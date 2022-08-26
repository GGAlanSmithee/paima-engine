import type {
  ChainFunnel,
  GameStateMachine,
  PaimaRuntimeInitializer,
  ChainData,
} from "paima-utils";
import { doLog, logBlock, logSuccess, logError } from "paima-utils";
import * as fs from "fs/promises";
import { exec } from "child_process";
import { server, startServer } from "./server.js"
import process from "process";

const SNAPSHOT_INTERVAL = 151200;
let run = true;

process.on("SIGINT", () => {
  doLog("Caught SIGINT. Waiting for engine to finish processing current block");
  run = false;
});

process.on("SIGTERM", () => {
  doLog("Caught SIGTERM. Waiting for engine to finish processing current block");
  run = false;
});

process.on('exit', (code) => {
  doLog(`Exiting with code: ${code}`);
});


const paimaEngine: PaimaRuntimeInitializer = {
  initialize(chainFunnel, gameStateMachine, gameBackendVersion) {
    // initialize snapshot folder
    return {
      pollingRate: 4,
      chainDataExtensions: [],
      addGET(route, callback) {
        server.get(route, callback)
      },
      addPOST(route, callback) {
        server.post(route, callback)
      },
      setPollingRate(seconds: number) {
        this.pollingRate = seconds
      },
      addExtensions(chainDataExtensions) {
        this.chainDataExtensions = [...this.chainDataExtensions, ...chainDataExtensions]
      },
      async run() {
        await lockEngine()
        this.addGET("/backend_version", async (req, res) => {
          res.status(200).json(gameBackendVersion);
        });
        // pass endpoints to web server and run
        (async () => startServer())();
        runIterativeFunnel(gameStateMachine, chainFunnel, this.pollingRate);
      }
    }
  }
}

async function lockEngine() {
  try {
    const f = await fs.readFile("./engine-lock");
    await logError("engine-lock exists")
    process.exit(0)
  } catch (e) {
    await fs.writeFile("./engine-lock", "");
  }
}

async function snapshots() {
  const dir = "snapshots"
  try {
    const files = await fs.readdir(dir);
    if (files.length === 0) return SNAPSHOT_INTERVAL
    const stats = files.map(async (f) => {
      const s = await fs.stat(dir + "/" + f);
      return { name: f, stats: s }
    })
    const ss = await Promise.all(stats);
    ss.sort((a, b) => a.stats.mtime.getTime() - b.stats.mtime.getTime())
    if (ss.length > 2) await fs.rm(dir + "/" + ss[0].name);
    const maxnum = ss[ss.length - 1].name.match(/\d+/);
    const max = maxnum?.[0] || "0"
    return parseInt(max) + SNAPSHOT_INTERVAL
  } catch {
    await fs.mkdir(dir);
    return SNAPSHOT_INTERVAL
  }
}

async function runIterativeFunnel(gameStateMachine: GameStateMachine, chainFunnel: ChainFunnel, pollingRate: number) {
  while (run) {
    const latestReadBlockHeight = await gameStateMachine.latestBlockHeight();
    // take DB snapshot first
    const snapshotTrigger = await snapshots();
    if (latestReadBlockHeight === snapshotTrigger) await saveSnapshot(latestReadBlockHeight);
    const latestChainData = await chainFunnel.readData(latestReadBlockHeight + 1) as ChainData[];
    // retry later if no data came in
    if (!latestChainData || !latestChainData?.length) await delay(pollingRate * 1000);
    else
      for (let block of latestChainData) {
        await logBlock(block);
        if (block.submittedData.length) console.log(block)
        try {
          await gameStateMachine.process(block);
          await logSuccess(block)
        }
        catch (error) {
          await logError(error)
        }
      }
    if (!run) {
      await fs.rm("./engine-lock")
      process.exit(0)
    }
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function saveSnapshot(blockHeight: number) {
  const username = process.env.DB_USER;
  const database = process.env.DB_NAME;
  const fileName = `paima-snapshot-${blockHeight}.tar`;
  doLog(`Attempting to save snapshot: ${fileName}`)
  exec(`pg_dump -U ${username} -d ${database} -f ./snapshots/${fileName} -F t`,)
}

export default paimaEngine
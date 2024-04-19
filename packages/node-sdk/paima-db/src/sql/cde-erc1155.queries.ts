/** Types generated for queries found in "src/sql/cde-erc1155.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'CdeErc1155ModifyBalance' parameters type */
export interface ICdeErc1155ModifyBalanceParams {
  cde_id: number;
  token_id: string;
  value: string;
  wallet_address: string;
}

/** 'CdeErc1155ModifyBalance' return type */
export type ICdeErc1155ModifyBalanceResult = void;

/** 'CdeErc1155ModifyBalance' query type */
export interface ICdeErc1155ModifyBalanceQuery {
  params: ICdeErc1155ModifyBalanceParams;
  result: ICdeErc1155ModifyBalanceResult;
}

const cdeErc1155ModifyBalanceIR: any = {"usedParamSet":{"cde_id":true,"token_id":true,"wallet_address":true,"value":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":101}]},{"name":"token_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":106,"b":115}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":135}]},{"name":"value","required":true,"transform":{"type":"scalar"},"locs":[{"a":140,"b":146}]}],"statement":"INSERT INTO cde_erc1155_data (\n  cde_id,\n  token_id,\n  wallet_address,\n  balance\n)\nVALUES (\n  :cde_id!,\n  :token_id!,\n  :wallet_address!,\n  :value!\n)\nON CONFLICT (cde_id, token_id, wallet_address)\nDO UPDATE SET balance = CAST(cde_erc1155_data.balance AS NUMERIC) + CAST(EXCLUDED.balance AS NUMERIC)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO cde_erc1155_data (
 *   cde_id,
 *   token_id,
 *   wallet_address,
 *   balance
 * )
 * VALUES (
 *   :cde_id!,
 *   :token_id!,
 *   :wallet_address!,
 *   :value!
 * )
 * ON CONFLICT (cde_id, token_id, wallet_address)
 * DO UPDATE SET balance = CAST(cde_erc1155_data.balance AS NUMERIC) + CAST(EXCLUDED.balance AS NUMERIC)
 * ```
 */
export const cdeErc1155ModifyBalance = new PreparedQuery<ICdeErc1155ModifyBalanceParams,ICdeErc1155ModifyBalanceResult>(cdeErc1155ModifyBalanceIR);


/** 'CdeErc1155DeleteIfZero' parameters type */
export interface ICdeErc1155DeleteIfZeroParams {
  cde_id: number;
  token_id: string;
  wallet_address: string;
}

/** 'CdeErc1155DeleteIfZero' return type */
export type ICdeErc1155DeleteIfZeroResult = void;

/** 'CdeErc1155DeleteIfZero' query type */
export interface ICdeErc1155DeleteIfZeroQuery {
  params: ICdeErc1155DeleteIfZeroParams;
  result: ICdeErc1155DeleteIfZeroResult;
}

const cdeErc1155DeleteIfZeroIR: any = {"usedParamSet":{"cde_id":true,"token_id":true,"wallet_address":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":62,"b":69}]},{"name":"token_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":86,"b":95}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":133}]}],"statement":"DELETE FROM cde_erc1155_data\nWHERE balance = '0'\nAND cde_id = :cde_id!\nAND token_id = :token_id!\nAND wallet_address = :wallet_address!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM cde_erc1155_data
 * WHERE balance = '0'
 * AND cde_id = :cde_id!
 * AND token_id = :token_id!
 * AND wallet_address = :wallet_address!
 * ```
 */
export const cdeErc1155DeleteIfZero = new PreparedQuery<ICdeErc1155DeleteIfZeroParams,ICdeErc1155DeleteIfZeroResult>(cdeErc1155DeleteIfZeroIR);


/** 'CdeErc1155Burn' parameters type */
export interface ICdeErc1155BurnParams {
  cde_id: number;
  token_id: string;
  value: string;
  wallet_address: string;
}

/** 'CdeErc1155Burn' return type */
export type ICdeErc1155BurnResult = void;

/** 'CdeErc1155Burn' query type */
export interface ICdeErc1155BurnQuery {
  params: ICdeErc1155BurnParams;
  result: ICdeErc1155BurnResult;
}

const cdeErc1155BurnIR: any = {"usedParamSet":{"cde_id":true,"token_id":true,"wallet_address":true,"value":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":101}]},{"name":"token_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":106,"b":115}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":135}]},{"name":"value","required":true,"transform":{"type":"scalar"},"locs":[{"a":140,"b":146}]}],"statement":"INSERT INTO cde_erc1155_burn (\n  cde_id,\n  token_id,\n  wallet_address,\n  balance\n)\nVALUES (\n  :cde_id!,\n  :token_id!,\n  :wallet_address!,\n  :value!\n)\nON CONFLICT (cde_id, token_id, wallet_address)\nDO UPDATE SET balance = CAST(cde_erc1155_burn.balance AS NUMERIC) + CAST(EXCLUDED.balance AS NUMERIC)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO cde_erc1155_burn (
 *   cde_id,
 *   token_id,
 *   wallet_address,
 *   balance
 * )
 * VALUES (
 *   :cde_id!,
 *   :token_id!,
 *   :wallet_address!,
 *   :value!
 * )
 * ON CONFLICT (cde_id, token_id, wallet_address)
 * DO UPDATE SET balance = CAST(cde_erc1155_burn.balance AS NUMERIC) + CAST(EXCLUDED.balance AS NUMERIC)
 * ```
 */
export const cdeErc1155Burn = new PreparedQuery<ICdeErc1155BurnParams,ICdeErc1155BurnResult>(cdeErc1155BurnIR);


/** 'CdeErc1155GetAllTokens' parameters type */
export interface ICdeErc1155GetAllTokensParams {
  cde_id: number;
  wallet_address: string;
}

/** 'CdeErc1155GetAllTokens' return type */
export interface ICdeErc1155GetAllTokensResult {
  balance: string;
  cde_id: number;
  token_id: string;
  wallet_address: string;
}

/** 'CdeErc1155GetAllTokens' query type */
export interface ICdeErc1155GetAllTokensQuery {
  params: ICdeErc1155GetAllTokensParams;
  result: ICdeErc1155GetAllTokensResult;
}

const cdeErc1155GetAllTokensIR: any = {"usedParamSet":{"cde_id":true,"wallet_address":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":53}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":76,"b":91}]}],"statement":"SELECT * from cde_erc1155_data\nWHERE cde_id = :cde_id!\nAND wallet_address = :wallet_address!\nAND CAST(balance AS NUMERIC) > 0"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * from cde_erc1155_data
 * WHERE cde_id = :cde_id!
 * AND wallet_address = :wallet_address!
 * AND CAST(balance AS NUMERIC) > 0
 * ```
 */
export const cdeErc1155GetAllTokens = new PreparedQuery<ICdeErc1155GetAllTokensParams,ICdeErc1155GetAllTokensResult>(cdeErc1155GetAllTokensIR);


/** 'CdeErc1155GetByTokenId' parameters type */
export interface ICdeErc1155GetByTokenIdParams {
  cde_id: number;
  token_id: string;
}

/** 'CdeErc1155GetByTokenId' return type */
export interface ICdeErc1155GetByTokenIdResult {
  balance: string;
  cde_id: number;
  token_id: string;
  wallet_address: string;
}

/** 'CdeErc1155GetByTokenId' query type */
export interface ICdeErc1155GetByTokenIdQuery {
  params: ICdeErc1155GetByTokenIdParams;
  result: ICdeErc1155GetByTokenIdResult;
}

const cdeErc1155GetByTokenIdIR: any = {"usedParamSet":{"cde_id":true,"token_id":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":53}]},{"name":"token_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":79}]}],"statement":"SELECT * from cde_erc1155_data\nWHERE cde_id = :cde_id!\nAND token_id = :token_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * from cde_erc1155_data
 * WHERE cde_id = :cde_id!
 * AND token_id = :token_id!
 * ```
 */
export const cdeErc1155GetByTokenId = new PreparedQuery<ICdeErc1155GetByTokenIdParams,ICdeErc1155GetByTokenIdResult>(cdeErc1155GetByTokenIdIR);


/** 'CdeErc1155GetByTokenIdAndWallet' parameters type */
export interface ICdeErc1155GetByTokenIdAndWalletParams {
  cde_id: number;
  token_id: string;
  wallet_address: string;
}

/** 'CdeErc1155GetByTokenIdAndWallet' return type */
export interface ICdeErc1155GetByTokenIdAndWalletResult {
  balance: string;
  cde_id: number;
  token_id: string;
  wallet_address: string;
}

/** 'CdeErc1155GetByTokenIdAndWallet' query type */
export interface ICdeErc1155GetByTokenIdAndWalletQuery {
  params: ICdeErc1155GetByTokenIdAndWalletParams;
  result: ICdeErc1155GetByTokenIdAndWalletResult;
}

const cdeErc1155GetByTokenIdAndWalletIR: any = {"usedParamSet":{"cde_id":true,"wallet_address":true,"token_id":true},"params":[{"name":"cde_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":53}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":76,"b":91}]},{"name":"token_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":117}]}],"statement":"SELECT * from cde_erc1155_data\nWHERE cde_id = :cde_id!\nAND wallet_address = :wallet_address!\nAND token_id = :token_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * from cde_erc1155_data
 * WHERE cde_id = :cde_id!
 * AND wallet_address = :wallet_address!
 * AND token_id = :token_id!
 * ```
 */
export const cdeErc1155GetByTokenIdAndWallet = new PreparedQuery<ICdeErc1155GetByTokenIdAndWalletParams,ICdeErc1155GetByTokenIdAndWalletResult>(cdeErc1155GetByTokenIdAndWalletIR);



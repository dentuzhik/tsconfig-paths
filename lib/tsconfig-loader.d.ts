/**
 * Typing for the parts of tsconfig that we care about
 */
export interface Tsconfig {
  extends?: string | string[];
  compilerOptions?: {
    baseUrl?: string;
    paths?: {
      [key: string]: Array<string>;
    };
    strict?: boolean;
  };
}
export interface TsConfigLoaderResult {
  tsConfigPath: string | undefined;
  baseUrl: string | undefined;
  paths:
    | {
        [key: string]: Array<string>;
      }
    | undefined;
}
export interface TsConfigLoaderParams {
  getEnv: (key: string) => string | undefined;
  cwd: string;
  loadSync?(
    cwd: string,
    filename?: string,
    baseUrl?: string
  ): TsConfigLoaderResult;
}
export declare function tsConfigLoader({
  getEnv,
  cwd,
  loadSync,
}: TsConfigLoaderParams): TsConfigLoaderResult;

import * as path from "path";
import {
  sys as tsSys,
  findConfigFile,
  readConfigFile,
  parseJsonConfigFileContent,
} from "typescript";

/**
 * Typing for the parts of tsconfig that we care about
 */
export interface Tsconfig {
  extends?: string | string[];
  compilerOptions?: {
    baseUrl?: string;
    paths?: { [key: string]: Array<string> };
    strict?: boolean;
  };
}

export interface TsConfigLoaderResult {
  tsConfigPath: string | undefined;
  baseUrl: string | undefined;
  paths: { [key: string]: Array<string> } | undefined;
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

export function tsConfigLoader({
  getEnv,
  cwd,
  loadSync = loadSyncDefault,
}: TsConfigLoaderParams): TsConfigLoaderResult {
  const TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT");
  const TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL");

  // tsconfig.loadSync handles if TS_NODE_PROJECT is a file or directory
  // and also overrides baseURL if TS_NODE_BASEURL is available.
  const loadResult = loadSync(cwd, TS_NODE_PROJECT, TS_NODE_BASEURL);
  return loadResult;
}

function loadSyncDefault(
  cwd: string,
  filename?: string,
  baseUrl?: string
): TsConfigLoaderResult {
  const earlyReturn = {
    tsConfigPath: undefined,
    baseUrl: undefined,
    paths: undefined,
  };
  if (filename) {
    cwd = filename;
  }

  const tsConfigPath = findConfigFile(
    path.dirname(cwd),
    tsSys.fileExists,
    path.basename(cwd)
  );

  if (!tsConfigPath) {
    return earlyReturn;
  }

  const tsconfigFileOrError = readConfigFile(tsConfigPath, tsSys.readFile);
  if (tsconfigFileOrError.error) {
    return earlyReturn;
  }

  const parsedConfig = parseJsonConfigFileContent(
    tsconfigFileOrError.config,
    tsSys,
    path.dirname(tsConfigPath)
  );
  const compilerOptions = parsedConfig.options;

  return {
    tsConfigPath,
    baseUrl: baseUrl || (compilerOptions && compilerOptions.baseUrl),
    paths: compilerOptions && compilerOptions.paths,
  };
}

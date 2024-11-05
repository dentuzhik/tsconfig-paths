"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigLoader = tsConfigLoader;
var path = require("path");
var typescript_1 = require("typescript");
function tsConfigLoader(_a) {
    var getEnv = _a.getEnv, cwd = _a.cwd, _b = _a.loadSync, loadSync = _b === void 0 ? loadSyncDefault : _b;
    var TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT");
    var TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL");
    // tsconfig.loadSync handles if TS_NODE_PROJECT is a file or directory
    // and also overrides baseURL if TS_NODE_BASEURL is available.
    var loadResult = loadSync(cwd, TS_NODE_PROJECT, TS_NODE_BASEURL);
    return loadResult;
}
function loadSyncDefault(cwd, filename, baseUrl) {
    var earlyReturn = {
        tsConfigPath: undefined,
        baseUrl: undefined,
        paths: undefined,
    };
    if (filename) {
        cwd = filename;
    }
    var tsConfigPath = (0, typescript_1.findConfigFile)(path.dirname(cwd), typescript_1.sys.fileExists, path.basename(cwd));
    if (!tsConfigPath) {
        return earlyReturn;
    }
    var tsconfigFileOrError = (0, typescript_1.readConfigFile)(tsConfigPath, typescript_1.sys.readFile);
    if (tsconfigFileOrError.error) {
        return earlyReturn;
    }
    var parsedConfig = (0, typescript_1.parseJsonConfigFileContent)(tsconfigFileOrError.config, typescript_1.sys, path.dirname(tsConfigPath));
    var compilerOptions = parsedConfig.options;
    return {
        tsConfigPath: tsConfigPath,
        baseUrl: baseUrl || (compilerOptions && compilerOptions.baseUrl),
        paths: compilerOptions && compilerOptions.paths,
    };
}
//# sourceMappingURL=tsconfig-loader.js.map
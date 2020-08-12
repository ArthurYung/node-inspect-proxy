"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInspectPort = exports.isInspect = void 0;
function checkNodeOptions() {
    return process.env.NODE_OPTIONS
        && process.env.NODE_OPTIONS.startsWith('--inspect');
}
function checkExecArgs() {
    const args = process.execArgv;
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--inspect'))
            return true;
    }
    return false;
}
function parseArgsPort(arg = '') {
    const res = arg.match(/^--inspect(-port)?=(\d\.){4}?(.*)+$/);
    if (res) {
        const port = res[2].split(':')[1];
        if (port.includes('.'))
            return null;
        return Number(port);
    }
    return null;
}
function getExecArgsPort() {
    const args = process.execArgv;
    let port;
    for (let i = 0; i < args.length; i++) {
        port = parseArgsPort(args[i]);
        if (port)
            return port;
    }
    return null;
}
function getNodeOptionsPort() {
    return parseArgsPort(process.env.NODE_OPTIONS);
}
function isInspect() {
    return checkNodeOptions() || checkExecArgs();
}
exports.isInspect = isInspect;
function getInspectPort() {
    return getExecArgsPort() || getNodeOptionsPort() || process.debugPort;
}
exports.getInspectPort = getInspectPort;
//# sourceMappingURL=utils.js.map
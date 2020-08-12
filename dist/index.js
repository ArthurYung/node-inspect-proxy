"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
const utils_1 = require("./utils");
const url = require("url");
exports.debug = (app) => {
    if (!utils_1.isInspect()) {
        return;
    }
    console.debug(`

    Debugger Proxy listening your app.

    To start debugging, open the following URL in Chrome:

    chrome://devtools/bundled/js_app.html?ws=YOUR_APP_HOST/__debug__

  `);
    const nodeOptions = process.env.NODE_OPTIONS;
    const inspectPort = utils_1.getInspectPort();
    process.env.NODE_OPTIONS = '';
    const worker = child_process_1.fork(path_1.resolve(__dirname, 'proxy.js'), { execArgv: [] });
    process.env.NODE_OPTIONS = nodeOptions;
    app.on('upgrade', function upgrade(request, socket) {
        const pathname = url.parse(request.url).pathname;
        if (pathname.startsWith('/__debug__')) {
            worker.send({
                headers: request.headers,
                method: request.method,
                type: 'connect',
                url: '/' + inspectPort,
            }, socket);
        }
    });
};
//# sourceMappingURL=index.js.map
import { fork } from 'child_process'
import { resolve } from 'path'
import { isInspect, getInspectPort } from './utils'
import * as url from 'url'

export const debug = (app) => {
  if (!isInspect()) {
    return;
  }

  console.debug(`

    Debugger Proxy listening your app.

    To start debugging, open the following URL in Chrome:

    chrome://devtools/bundled/js_app.html?ws=YOUR_APP_HOST/__debug__

  `);

  const nodeOptions = process.env.NODE_OPTIONS
  const inspectPort = getInspectPort()

  process.env.NODE_OPTIONS = ''

  const worker = fork(resolve(__dirname, 'proxy.js'), { execArgv: [] })

  process.env.NODE_OPTIONS = nodeOptions

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
}

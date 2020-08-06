import { fork } from 'child_process'
import { resolve } from 'path'
import * as url from 'url'

export const debug = (app) => {
  const nodeOptions = process.env.NODE_OPTIONS
  if (!nodeOptions.startsWith('--inspect')) {
    return;
  }

  console.debug(`

    Debugger Proxy listening your app.

    To start debugging, open the following URL in Chrome:

    chrome://devtools/bundled/js_app.html?ws=YOUR_APP_HOST/__debug__

  `);

  process.env.NODE_OPTIONS = ''

  const worker = fork(resolve(__dirname, 'proxy.js'))

  process.env.NODE_OPTIONS = nodeOptions

  app.on('upgrade', function upgrade(request, socket) {
    const pathname = url.parse(request.url).pathname;

    if (pathname.startsWith('/__debug__')) {
      worker.send({ 
        headers: request.headers, 
        method: request.method, 
        type: 'connect',
        url: '/' + (pathname.replace(/\/__debug__/, '') || '9229'),
      }, socket);
    }
  });
}

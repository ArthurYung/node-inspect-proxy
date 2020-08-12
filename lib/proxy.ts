import * as WebSocket from "ws";
import * as url from "url";
import * as http from "http";

type ProxySessionInfo = {
  frontend: WebSocket;
  backend: WebSocket;
};

const sessionCaches: Map<string, ProxySessionInfo> = new Map();
let server: WebSocket.Server;

// 获取本级debugger ws地址
function getDebuggerUrl(prot: string) {
  return new Promise<string>((resolve, reject) => {
    http.get(`http://127.0.0.1:${prot}/json`, (res) => {
      let rawInfo = "";
      res.on("data", (chunk) => (rawInfo += chunk));
      res
        .on("end", () => {
          const debugInfos = JSON.parse(rawInfo);
          const connectCount = debugInfos.length;
          if (connectCount > 1) {
            reject(`${connectCount} debugger connects on this port`);
            return;
          }

          const url = debugInfos[0].webSocketDebuggerUrl;
          if (url) {
            resolve(url);
          } else {
            reject(`a devTools has connected to ws://127.0.0.1/${prot}`);
          }
        })
      res.on("error", (error) => {
        reject(error.message);
      });
    }).on('error', error => {
      reject(error.message)
    });
  });
}

// 关闭转发代理
function closeSession(prot: string) {
  const session = sessionCaches.get(prot);
  if (session) {
    session.frontend?.close();
    session.backend?.close();
    sessionCaches.delete(prot);
  }
}

// 创建一个转发连接
function createBackendProxy(url: string, prot: string) {
  return new Promise<WebSocket>((resolve, reject) => {
    const backend = new WebSocket(url);
    backend.on("open", () => {
      console.debug("debugger proxy is created");
      backend["_socket"].pause();
      resolve(backend);
    });
    backend.on("error", (err) => {
      reject(err.message);
    });
  });
}

// 代理数据转发
function proxyMessage(frontend: WebSocket, backend: WebSocket, prot: string) {
  frontend.on("message", (data) => {
    backend?.send(data);
  });
  backend.on("message", (data) => {
    frontend?.send(data);
  });
  frontend.on("close", () => {
    closeSession(prot);
  });
  backend.on("close", () => {
    closeSession(prot);
  });
  frontend["_socket"].resume();
  backend["_socket"].resume();
  sessionCaches.set(prot, { frontend, backend });
}

// 开始代理
async function proxyStart(socket: WebSocket, prot: string) {
  // 先清理一下旧的连接
  closeSession(prot);

  try {
    const url = await getDebuggerUrl(prot);
    const backend = await createBackendProxy(url, prot);
    proxyMessage(socket, backend, prot);
  } catch (e) {
    console.error(e);
  }
}

server = new WebSocket.Server({noServer: true});

server.on("connection", (socket, incomingMessage) => {
  // pause current socket wait proxy
  socket["_socket"].pause();

  // get proxy prot
  const prot = url.parse(incomingMessage.url, true).pathname.slice(1);
  proxyStart(socket, prot);
});

server.on("error", (e) => {
  console.error(e.message);
});

process.on('message', (message, handle) => {
  if (typeof message === 'object' && message.type === 'connect') {
    server.handleUpgrade(message, handle, Buffer.from(''), function (conn) {
      server.emit('connection', conn, message);
    });
  }
})


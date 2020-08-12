import { spawn } from 'child_process'

describe("proxy inspect server", () => {
  test('test createServer', async () => {
    await spawn(
      "sh",
      [
        "-c",
        "NODE_OPTIONS='--inspect=9226' node ./test/child-server.js"
      ], {
        stdio: ["pipe", "inherit", "inherit"]
      }
    );

    console.log('open chrome://devtools/bundled/js_app.html?ws=127.0.0.1:3320/__debug__')
  })

  test('test express', async () => {
    await spawn(
      "sh",
      [
        "-c",
        "NODE_OPTIONS='--inspect=9227' node ./test/express-server.js"
      ], {
        stdio: ["pipe", "inherit", "inherit"]
      }
    );
  })

  test('test koa', async () => {
    await spawn(
      "sh",
      [
        "-c",
        "NODE_OPTIONS='--inspect=9228' node ./test/koa-server.js"
      ], {
        stdio: ["pipe", "inherit", "inherit"]
      }
    );
  })
})

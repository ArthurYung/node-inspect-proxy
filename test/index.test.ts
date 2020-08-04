import { spawn } from 'child_process'

describe("proxy inspect server", () => {
  test('test server', async () => {
    await spawn(
      "sh",
      [
        "-c",
        "NODE_OPTIONS=--inspect node ./test/child-server.js"
      ], {
        stdio: ["pipe", "inherit", "inherit"]
      }
    );

    console.log('open chrome://devtools/bundled/js_app.html?ws=127.0.0.1:3320/__debug__')
  })
})

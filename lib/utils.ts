function checkNodeOptions(): boolean {
  return process.env.NODE_OPTIONS 
    && process.env.NODE_OPTIONS.startsWith('--inspect')
}

function checkExecArgs(): boolean {
  const args = process.execArgv;
  for(let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--inspect')) return true
  }
  return false
}

function parseArgsPort(arg: string = ''): number {
  const res = arg.match(/^--inspect(-port)?=(\d\.){4}?(.*)+$/)
  if (res) {
    const port = res[2].split(':')[1]
    if (port.includes('.')) return null
    return Number(port)
  }
  return null
}

function getExecArgsPort(): number {
  const args = process.execArgv;
  let port
  for(let i = 0; i < args.length; i++) {
    port = parseArgsPort(args[i])
    if (port) return port
  }
  return null
}

function getNodeOptionsPort():number {
  return parseArgsPort(process.env.NODE_OPTIONS)
}


export function isInspect():boolean {
  return checkNodeOptions() || checkExecArgs()
}

export function getInspectPort():number {
  return getExecArgsPort() || getNodeOptionsPort() || process.debugPort
}

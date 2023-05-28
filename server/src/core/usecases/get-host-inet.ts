import { networkInterfaces } from 'os'

export function getHostInet() {
  const inets = Object.entries(networkInterfaces()).filter(
    (i) => i[0] !== 'lo',
  )[0][1]
  return inets?.filter((i) => i.family === 'IPv4' && !i.internal)[0]
}

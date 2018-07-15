const callAsync = this.requestIdleCallback || this.requestIdleCallback || this.setImmediate || setTimeout
const dataGun = (listeners = dataGun.listMap()) => Object.assign((evt, fn, one) => {
  fn._one = one
  fn.stop = listeners.del.bind(null, evt, fn)
  listeners(evt, fn)
  return fn
}, {
  listeners,
  fire (evt, ...data) {
    callAsync(() => listeners.each(evt, h => {
      h(...data)
      if (h._one) h.stop()
    }))
  }
})
dataGun.listMap = (map = new Map()) => Object.assign((key, val) => val != null
  ? (map.has(key) ? map : map.set(key, new Set())).get(key).add(val) : map.get(key), {
  del: (key, val) => (map.has(key) && map.get(key).delete(val).size < 1 && map.delete(key), val),
  has: (key, val) => map.has(key) && (val == null || map.get(key).has(val)),
  each (key, fn) { map.has(key) && map.get(key).forEach(fn) }
})
export default dataGun

const def = o => o !== undefined
const listMap = (map = new Map()) => Object.assign(
  (key, val) => def(val) ? (map.has(key) ? map : map.set(key, new Set())).get(key).add(val) : map.get(key),
  {
    map,
    del (key, val) {
      map.has(key) && map.get(key).delete(val).size < 1 && map.delete(key)
    },
    has (key, val) {
      const list = map.get(key)
      return !!list && def(val) && list.has(val)
    },
    each (key, fn) { map.has(key) && map.get(key).forEach(fn) }
  }
)

const dataGun = (listeners = listMap()) => Object.assign((evt, fn, one) => {
  fn._one = one
  fn.stop = () => listeners.del(evt, fn)
  listeners(evt, fn)
  return fn
}, {
  listeners,
  fire (evt, ...data) {
    listeners.each(evt, h => {
      setTimeout(() => h(...data), 0)
      h._one && h.stop()
    })
  }
})
dataGun.listMap = listMap
export default dataGun

const def = o => o !== undefined
const listMap = (map = new Map()) => Object.assign(
  (key, val) => (
    def(val) ? (map.has(key) ? map : map.set(key, new Set())).get(key).add(val) : map.get(key)
  ),
  {
    map,
    del (key, val) {
      map.has(key) && map.get(key).delete(val).size < 1 && map.delete(key)
    },
    has (key, val) {
      const exists = map.has(key)
      return def(val) ? exists && map.get(key).has(val) : exists
    },
    each (key, fn) { map.has(key) && map.get(key).forEach(fn) }
  }
)

export default Object.assign(
  (listeners = listMap()) => Object.assign((evt, fn, one) => {
    fn._one = one
    fn.stop = () => listeners.del(evt, fn)
    listeners(evt, fn)
    return fn
  }, {
    del: listeners.del,
    fire (evt, ...data) {
      listeners.each(evt, h => {
        setTimeout(() => h(...data), 0)
        h._one && h.stop()
      })
    }
  }),
  {listMap}
)

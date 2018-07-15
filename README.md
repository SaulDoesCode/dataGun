# dataGun - a lighthearted tiny solution to all your event emitting/receiving problems
all in less than 24 lines of code    

## Usage

```javascript
import dataGun from 'datagun'

const gun = dataGun()

gun(
  'final-warning',
  msg => console.warn(msg),
  true // fire only once
)

gun.fire('final-warning', `Save your selves... It's the end!!!!`)

const toggler = {
  toggle (state) { /* some logic/api */ }
}

const listener = gun('remoteTrigger', toggler.toggle)

// fire! ->--pew->-pew-->->
gun.fire('remoteTrigger', true)

// stop listening after 2 minutes
setTimeout(listener.stop, 60000 * 2)
```

## API

* emit - ``(dataGun() -> emitter).fire( eventName, ...data)``
* listen - ``(dataGun() -> emitter)(eventName, func, =runOnce) -> listener``
* stop listening - ``listener.stop()`` or ``emitter.listeners.del(eventName, func)``

#### Extra

* ``dataGun().listeners`` is a listMap
You can check or manipulate listeners via it.

listMap - ``dataGun.listMap() -> {del, has, each}``

**listMap** is just a utility to manage a ``Map`` that contains ``Set``s
```javascript
  import dataGun from 'dataGun.mjs'
  const lm = dataGun.listMap()

  // set
  lm('key', 'value0')
  lm('key', 'value1')
  // get
  lm('key') // -> Set{'value0', 'value1'}
  // get the base map
  lm.map // -> Map{key: Set{...}}
  // has
  lm.has('key') // -> true
  lm.has('key', 'value2') // -> false
  // delete a value
  lm.del('key', 'value0')
  // or
  lm('key').delete('value0')

  // loop over contents
  lm.each('key', value => {
    console.log(value)
  })
  // value0
  // value1
  // ...
```

#### NOTE: datagun uses ES6 Modules
you might have to run node with ``--experimental-modules``
And no dependencies so no fuss!
##### MIT license          

#### The Source:     
      
```javascript
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
```

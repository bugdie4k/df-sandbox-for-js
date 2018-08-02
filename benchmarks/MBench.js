function toMsNs ([ s, ns ]) {
  const nsTotal = s * Math.pow(10, 9) + ns
  const ms = Math.trunc(nsTotal / Math.pow(10, 6))
  const newNs = nsTotal - ms * Math.pow(10, 6)
  return [ ms, Math.trunc(newNs) ]
}

class MBench {
  constructor (name, optionsArgs = {}) {
    this.name = name
    const defaultOptions = {
      iters: 10,
      global: {},
      beforeAll: function () {},
      beforeIter: function () {},
      fn: null,
      afterIter: function () {},
      afterAll: function () {}
    }
    this.options = Object.freeze(Object.assign({}, defaultOptions, optionsArgs))
  }

  setIters (iters) {
    this.options.iter = iters
    return this
  }

  run () {
    const {
      iters,
      beforeEach,
      afterEach,
      beforeAll,
      afterAll,
      fn,
      global
    } = this.options
    this.stats = {
      measures: []
    }
    global.this = this
    beforeAll.call(global)
    for (let i = 0; i < iters; ++i) {
      beforeEach.call(global)
      const time1 = process.hrtime()
      fn.call(global)
      const time2 = process.hrtime()
      afterEach.call(global)
      this.stats.measures.push([ time2[0] - time1[0], time2[1] - time1[1] ])
    }    
    this.stats.mean = this.stats.measures
      .reduce((acc, dt) => [ acc[0] + dt[0], acc[1] + dt[1] ], [ 0, 0 ])
      .map(measure => measure / iters)
    if (!this.statsSeq) {
      this.statsSeq = []
    }
    this.statsSeq.push(this.stats)
    // console.log(stats)
    afterAll.call(global)
    return this
  }

  report (comment) {
    console.log(`,- ${this.name}`)
    if (comment) {
      console.log(`|  ${comment}`)
    }
    const [ ms, ns ] = toMsNs(this.stats.mean)
    console.log(`\`--> ${ms}ms ${ns}ns`)
    return this.stats
  }
}

MBench.toMsNs = toMsNs
module.exports = MBench

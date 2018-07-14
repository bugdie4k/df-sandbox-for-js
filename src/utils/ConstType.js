function validator (enumName, badValueMsg) {
  return type => {
    for (const k in this) {
      if (typeof this[k] !== 'function' && this[k] === type) {
        return
      }
    }
    // report error
    if (badValueMsg !== '') {
      badValueMsg = `\n${badValueMsg.toString()}`
    }
    let defaultMsg = 'Unexpected enum value'
    if (enumName !== '') {
      defaultMsg = `Unexpected value of enum '${enumName.toString()}'`
    }
    throw new Error(`${defaultMsg}: ${type}${badValueMsg}\n`)
  }
}

class ConstType {
  constructor (constants, options = {}) {
    let { name, errMsg } = options
    if (name === undefined) name = ''
    if (errMsg === undefined) errMsg = ''
    let name_ = name.toString()
    if (name_) {
      name_ = `${name.toString()}_`
    }
    for (const c of constants) {
      this[c] = `${c}:${name_}CONST_TYPE_CONSTANT`
    }
    this.validate = validator.call(this, name, errMsg)
    return Object.freeze(this)
  }
}

module.exports = ConstType

const uuid = require('uuid/v4')

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
    const defaultOptions = {
      name: '',
      errMsg: '',
      addUUID: false
    }
    let { name, errMsg, addUUID } = Object.assign({}, defaultOptions, options)
    let name_ = name.toString()
    if (name_) {
      name_ = `${name.toString()}_`
    }
    if (Array.isArray(constants)) {
      for (const c of constants) {
        let str = `${c}:${name_}CONST_TYPE_CONSTANT`
        if (addUUID) {
          str += `_${uuid()}`
        }
        this[c] = str
      }
    } else if (constants && typeof constants === 'object') {
      for (const key in constants) {
        let str = constants[key].toString()
        if (addUUID) {
          str += `_${uuid()}`
        }
        this[key] = str
      }
    }
    this.validate = validator.call(this, name, errMsg)
    return Object.freeze(this)
  }
}

module.exports = ConstType

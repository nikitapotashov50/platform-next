const _ = require('lodash')

module.exports = async function (init, field = 'code') {
  var Model = this

  var defaults = _.clone(init)

  await Model.remove({})

  for (var code in defaults) {
    var elem = new Model({ [field]: code })
    _.extend(elem, defaults[code])
    elem.save()
  }
}

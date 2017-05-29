const keyObj = (docs, options = {}) => {
  if (!options.key) options.key = '_id'

  return docs.reduce((object, item) => {
    if (object.middleware) object.middleware(item)
    object[item[options.key]] = item
    return object
  }, {})
}

module.exports = {
  keyObj
}

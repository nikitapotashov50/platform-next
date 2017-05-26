const fs = require('fs')
const koaBody = require('koa-body')
const pify = require('pify')
const AWS = require('aws-sdk')
const shortid = require('shortid')
const config = require('../../../config')
// const { models } = require('../../models')

AWS.config.update({
  accessKeyId: config.aws.access_key_id,
  secretAccessKey: config.aws.secret_access_key,
  signatureVersion: 'v4'
})

module.exports = router => {
  router.post('/', koaBody({ multipart: true }), async ctx => {
    const s3 = new AWS.S3()

    try {
      const { file } = ctx.request.body.files
      const { hash } = ctx.request.body.fields

      const fileData = await pify(fs.readFile)(file.path)

      const uploadParams = {
        Bucket: 'bm-platform',
        Key: `${shortid.generate()}-${file.name}`,
        Body: fileData,
        ContentType: file.type
      }

      const uploadedFile = await s3.upload(uploadParams).promise()

      ctx.body = {
        url: uploadedFile.Location,
        key: file.name,
        hash
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })

  router.delete('/', async ctx => {
    const s3 = new AWS.S3()

    try {
      const { key } = ctx.params

      await s3.deleteObject({
        Bucket: 'bm-platform',
        Key: key
      }).promise()
    } catch (e) {
      ctx.body = {
        status: 500,
        message: e.message
      }
    }
  })
}

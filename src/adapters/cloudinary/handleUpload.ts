import fs from 'fs'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { Readable } from 'stream'
import type stream from 'stream'
import * as cloudinary from 'cloudinary'

import type { HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  prefix?: string
  getStorageClient: () => any
}

const multipartThreshold = 1024 * 1024 * 50 // 50MB

export const getHandleUpload = ({
  getStorageClient,

  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    // if (file.buffer.length > 0 && file.buffer.length < multipartThreshold) {
    getStorageClient().v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    /* getStorageClient()
      .v2.uploader.upload('https://upload.wikimedia.org/wikipedia/de/b/bb/Png-logo.png', {
        resource_type: 'video',
        public_id: 'myfolder/mysubfolder/my_dog',
        overwrite: true,
      })
      .then((result: any) => console.log(result))

 */

    const upOptions: any = {
      public_id: fileKey,
      folder: undefined,
      unique_filename: false,
      resource_type: 'auto',
    }

    await new Promise((resolve, reject) => {
      const streamA = cloudinary.v2.uploader.upload_stream(upOptions, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })

      Readable.from(fileBufferOrStream).pipe(streamA)
    })

    /*
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    if (file.buffer.length > 0 && file.buffer.length < multipartThreshold) {
      await getStorageClient().putObject({
        Bucket: bucket,
        Key: fileKey,
        Body: fileBufferOrStream,
        ACL: acl,
        ContentType: file.mimeType,
      })

      return data
    }

    const parallelUploadS3 = new Upload({
      client: getStorageClient(),
      params: {
        Bucket: bucket,
        Key: fileKey,
        Body: fileBufferOrStream,
        ACL: acl,
        ContentType: file.mimeType,
      },
      queueSize: 4,
      partSize: multipartThreshold,
    })

    await parallelUploadS3.done() */

    return data
  }
}

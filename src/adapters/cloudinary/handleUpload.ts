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

export const getHandleUpload = ({
  getStorageClient,

  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    getStorageClient().v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

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

    return data
  }
}

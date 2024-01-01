import fs from 'fs'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { Readable } from 'stream'
import type stream from 'stream'

import type { UploadApiErrorResponse, UploadResponseCallback } from 'cloudinary'
import type { HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  prefix?: string
  getStorageClient: () => any
}

export const getHandleUpload = ({ getStorageClient, prefix = '' }: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    const upOptions: any = {
      public_id: fileKey,
      folder: undefined,
      unique_filename: false,
      resource_type: 'auto',
    }

    await new Promise((resolve, reject) => {
      const streamA = getStorageClient().uploader.upload_stream(
        upOptions,
        (err: UploadApiErrorResponse, res: UploadResponseCallback) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        },
      )

      Readable.from(fileBufferOrStream).pipe(streamA)
    })

    return data
  }
}

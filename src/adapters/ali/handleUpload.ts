import path from 'path'
import fs from 'fs'
import type stream from 'stream'
import type OSS from 'ali-oss'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  prefix?: string
  getStorageClient: () => OSS
}

const multipartThreshold = 1024 * 1024 * 50 // 50MB

export const getHandleUpload = ({ prefix = '', getStorageClient }: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    if (file.buffer.length > 0 && file.buffer.length < multipartThreshold) {
      await getStorageClient().put(fileKey, fileBufferOrStream)
    }

    return data
  }
}

import type { StorageClient } from '@supabase/storage-js'
import fs from 'fs'
import path from 'path'
import type stream from 'stream'
import type { HandleUpload } from '../../types'

interface Args {
  getStorageClient: () => StorageClient
  bucket: string
  prefix?: string
}

export const getHandleUpload = ({ getStorageClient, bucket, prefix = '' }: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(prefix, file.filename)

    const fileBufferOrStream: Buffer | stream.Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    await getStorageClient().from(bucket).upload(fileKey, fileBufferOrStream, {
      contentType: file.mimeType,
    })

    return data
  }
}

import path from 'path'
import type { Storage } from '@google-cloud/storage'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload, GeneratePrefix } from '../../types'

interface Args {
  collection: CollectionConfig
  bucket: string
  acl?: 'Private' | 'Public'
  prefix?: GeneratePrefix
  getStorageClient: () => Storage
}

export const getHandleUpload = ({
  getStorageClient,
  bucket,
  acl,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const key: string = typeof prefix === 'function' ? prefix() : prefix
    const gcsFile = getStorageClient().bucket(bucket).file(path.posix.join(key, file.filename))
    await gcsFile.save(file.buffer, {
      metadata: {
        contentType: file.mimeType,
      },
    })

    if (acl) {
      await gcsFile[`make${acl}`]()
    }

    return data
  }
}

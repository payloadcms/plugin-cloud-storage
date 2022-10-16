import path from 'path'
import type * as AWS from '@aws-sdk/client-s3'
import type { CollectionConfig } from 'payload/types'
import type { GeneratePrefix, HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  bucket: string
  acl?: 'private' | 'public-read'
  prefix?: GeneratePrefix
  getStorageClient: () => AWS.S3
}

export const getHandleUpload = ({
  getStorageClient,
  bucket,
  acl,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const key: string = typeof prefix === 'function' ? prefix() : prefix
    await getStorageClient().putObject({
      Bucket: bucket,
      Key: path.posix.join(key, file.filename),
      Body: file.buffer,
      ACL: acl,
      ContentType: file.mimeType,
    })

    return data
  }
}

import path from 'path'
import type * as AWS from '@aws-sdk/client-s3'
import type { CollectionConfig } from 'payload/types'
import type { GeneratePrefix, HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  bucket: string
  acl?: 'private' | 'public-read'
  prefix?: string
  s3: AWS.S3
  generatePrefix?: GeneratePrefix
}

export const getHandleUpload = ({
  s3,
  bucket,
  acl,
  prefix = '',
  generatePrefix,
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const keyPaths = [prefix]
    if (generatePrefix && typeof generatePrefix === 'function') {
      keyPaths.push(...generatePrefix())
    }

    await s3.putObject({
      Bucket: bucket,
      Key: path.posix.join(...keyPaths, file.filename),
      Body: file.buffer,
      ACL: acl,
      ContentType: file.mimeType,
    })

    return data
  }
}

import path from 'path'
import type { Storage } from '@google-cloud/storage'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload, GeneratePrefix } from '../../types'

interface Args {
  collection: CollectionConfig
  bucket: string
  acl?: 'Private' | 'Public'
  prefix?: string
  gcs: Storage
  generatePrefix?: GeneratePrefix
}

export const getHandleUpload = ({
  gcs,
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

    const gcsFile = gcs.bucket(bucket).file(path.posix.join(...keyPaths, file.filename))
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

import type { StorageClient } from '@supabase/storage-js'
import path from 'path'

interface Args {
  getStorageClient: () => StorageClient
  bucket: string
  prefix?: string
}

export const getHandleUpload = ({ getStorageClient, bucket, prefix = '' }: Args): any => {
  return async ({ data, file }: any) => {
    const fileKey: string = path.posix.join(prefix, file.filename)

    await getStorageClient().from(bucket).upload(fileKey, file)

    return data
  }
}

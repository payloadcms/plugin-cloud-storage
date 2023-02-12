import type { StorageClient } from '@supabase/storage-js'
import path from 'path'
import type { HandleDelete } from '../../types'

interface Args {
  getStorageClient: () => StorageClient
  bucket: string
}

export const getHandleDelete = ({ getStorageClient, bucket }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    const fileKey: string = path.posix.join(prefix, filename)

    await getStorageClient().from(bucket).remove([fileKey])
  }
}

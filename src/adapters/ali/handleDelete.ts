import path from 'path'
import type OSS from 'ali-oss'
import type { HandleDelete } from '../../types'

interface Args {
  getStorageClient: () => OSS
}

export const getHandleDelete = ({ getStorageClient }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    await getStorageClient().delete(path.posix.join(prefix, filename))
  }
}

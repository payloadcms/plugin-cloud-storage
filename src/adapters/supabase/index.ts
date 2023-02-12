import { StorageClient } from '@supabase/storage-js'
import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

interface Args {
  url: string
  apiKey: string
  bucket: string
}

export const supabaseAdapter =
  ({ url, apiKey, bucket }: Args): any =>
  ({ collection, prefix }: any): any => {
    let storageClient: StorageClient | null = null
    const getStorageClient: () => StorageClient = () => {
      if (storageClient) return storageClient
      storageClient = new StorageClient(url, {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      })
      return storageClient
    }

    return {
      handleUpload: getHandleUpload({ getStorageClient, bucket, prefix }),
      handleDelete: getHandleDelete({ getStorageClient, bucket }),
      generateURL: getGenerateURL({ bucket, endpoint: url }),
      staticHandler: getHandler({ getStorageClient, bucket, collection }),
      webpack: extendWebpackConfig,
    }
  }

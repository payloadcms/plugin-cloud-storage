import OSS from 'ali-oss'
import { getGenerateURL } from './generateUrl'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'
import type { Adapter, GeneratedAdapter } from '../../types'

export interface Args {
  config: OSS.Options & { sldEnable?: boolean }
}

export const aliAdapter =
  ({ config }: Args): Adapter =>
  ({ collection, prefix }): GeneratedAdapter => {
    let storageClient: OSS | null = null

    const getStorageClient = (): OSS => {
      if (storageClient) return storageClient
      storageClient = new OSS(config)
      return storageClient
    }

    return {
      handleUpload: getHandleUpload({
        collection,
        prefix,
        getStorageClient,
      }),
      handleDelete: getHandleDelete({ getStorageClient }),
      generateURL: getGenerateURL({ config }),
      staticHandler: getStaticHandler({ getStorageClient, collection }),
      webpack: extendWebpackConfig,
    }
  }

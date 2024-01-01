import { v2 as cloudinary } from 'cloudinary'
import type { ConfigOptions } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '../../types'
import { getGenerateURL } from './generateURL'
import { getHandler } from './staticHandler'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { extendWebpackConfig } from './webpack'

export interface Args {
  /**
   * Cloudinary client configuration.
   *
   * [Cloudinary Node Docs](https://cloudinary.com/documentation/node_integration)
   */
  config: {
    cloud_name?: string
    api_key?: string
    api_secret?: string
  }
}

export const cloudinaryAdapter =
  ({ config = {} }: Args): Adapter =>
  ({ collection, prefix }): GeneratedAdapter => {
    const storageClient: any | null = null
    const getStorageClient: () => ConfigOptions = () => {
      if (storageClient) return storageClient
      cloudinary.config(config)
      return cloudinary
    }

    return {
      handleUpload: getHandleUpload({
        collection,
        getStorageClient,
        prefix,
      }),
      handleDelete: getHandleDelete({ getStorageClient }),
      generateURL: getGenerateURL({ getStorageClient }),
      staticHandler: getHandler({ getStorageClient, collection }),
      webpack: extendWebpackConfig,
    }
  }

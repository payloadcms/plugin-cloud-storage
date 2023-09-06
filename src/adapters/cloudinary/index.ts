import type * as AWS from '@aws-sdk/client-s3'
import * as cloudinary from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '../../types'
import { getGenerateURL } from './generateURL'
import { getHandler } from './staticHandler'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { extendWebpackConfig } from './webpack'

export interface Args {
  /**
   * AWS S3 client configuration. Highly dependent on your AWS setup.
   *
   * [AWS.S3ClientConfig Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html)
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
    let storageClient: any | null = null
    const getStorageClient: () => any = () => {
      if (storageClient) return storageClient
      storageClient = cloudinary //  new AWS.S3(config)
      return storageClient
    }

    return {
      handleUpload: getHandleUpload({
        collection,
        getStorageClient,
        prefix,
      }),
      handleDelete: getHandleDelete({ getStorageClient }),
      generateURL: getGenerateURL({ config }),
      staticHandler: getHandler({ getStorageClient, collection }),
      webpack: extendWebpackConfig,
    }
  }

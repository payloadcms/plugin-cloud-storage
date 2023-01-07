import ImageKit from 'imagekit'
import type { Adapter, GeneratedAdapter } from '../../types'
import { getGenerateURL } from './generateURL'
import { getHandler } from './staticHandler'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { extendWebpackConfig } from './webpack'

export interface Args {
  publicKey: string
  privateKey: string
  urlEndpoint: string
  folder?: string
}

export const imageKitAdapter =
  ({ publicKey, privateKey, urlEndpoint, folder }: Args): Adapter =>
  ({ collection, prefix }): GeneratedAdapter => {
    let imageKit: ImageKit | null = null

    const getImageKit = () => {
      if (imageKit) return imageKit
      return (imageKit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
      }))
    }

    return {
      handleUpload: getHandleUpload({
        collection,
        prefix,
        getImageKit,
        folder,
      }),
      handleDelete: getHandleDelete({ getImageKit }),
      generateURL: getGenerateURL({ getImageKit, urlEndpoint }),
      staticHandler: getHandler({ getImageKit, urlEndpoint, collection }),
      webpack: extendWebpackConfig,
    }
  }

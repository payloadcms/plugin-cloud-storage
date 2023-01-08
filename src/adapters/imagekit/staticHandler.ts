import type { CollectionConfig } from 'payload/types'
import type ImageKit from 'imagekit'
import https from 'https'
import type { StaticHandler } from '../../types'

interface Args {
  getImageKit: () => ImageKit
  urlEndpoint: string
  collection: CollectionConfig
  folder?: string
}

export const getHandler = ({
  getImageKit,
  urlEndpoint,
  collection,
  folder,
}: Args): StaticHandler => {
  return async (req, res, next) => {
    if (folder) {
      https.get(`${urlEndpoint + folder}/${req.params.filename}`, mapRes => mapRes.pipe(res))
    } else {
      https.get(urlEndpoint + req.params.filename, mapRes => mapRes.pipe(res))
    }

    return res
  }
}

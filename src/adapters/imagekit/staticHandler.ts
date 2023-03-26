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
    const handleResponse = mapRes => {
      // Forward the Content-Type header
      res.setHeader('Content-Type', mapRes.headers['content-type'])

      // Forward the Content-Length header. Note: if the image is modified in the process, this would need to change.
      res.setHeader('Content-Length', mapRes.headers['content-length'])

      // Pipe the response
      mapRes.pipe(res)
    }

    if (folder) {
      https.get(`${urlEndpoint + folder}/${req.params.filename}`, handleResponse)
    } else {
      https.get(urlEndpoint + req.params.filename, handleResponse)
    }

    return res
  }
}

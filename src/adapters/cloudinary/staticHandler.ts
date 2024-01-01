import path from 'path'
import type { CollectionConfig } from 'payload/types'
import https from 'https'
import type { StaticHandler } from '../../types'
import { getFilePrefix } from '../../utilities/getFilePrefix'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => any
}

export const getHandler = ({ getStorageClient, collection }: Args): StaticHandler => {
  return async (req, res, next) => {
    try {
      const prefix = await getFilePrefix({ req, collection })

      // const filePath = path.posix.join(prefix, req.params.filename)

      const cloudinaryUrl = getStorageClient().url(`${req.params.filename}.jpg`, {
        resource_type: 'image',
        secure: true,
      })

      console.log(cloudinaryUrl)

      // Use https to get the stream
      https
        .get(cloudinaryUrl, response => {
          // Set appropriate headers for the response
          res.setHeader('Content-Type', response.headers['content-type'])

          // Stream the file directly to the response
          response.pipe(res)
        })
        .on('error', err => {
          req.payload.logger.error(err)
          next()
        })
    } catch (err) {
      req.payload.logger.error(err)
      return next()
    }
  }
}

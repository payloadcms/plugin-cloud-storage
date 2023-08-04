import type OSS from 'ali-oss'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { Readable } from 'stream'
import type { StaticHandler } from '../../types'
import { getFilePrefix } from '../../utilities/getFilePrefix'

interface Args {
  getStorageClient: () => OSS
  collection: CollectionConfig
}

export const getStaticHandler = ({ getStorageClient, collection }: Args): StaticHandler => {
  return async (req, res, next) => {
    try {
      const prefix = await getFilePrefix({ req, collection })
      const fileKey = path.posix.join(prefix, req.params.filename)

      const object = await getStorageClient().get(fileKey)

      res.header(object.res.headers)
      res.status(object.res.status)

      const readableStream = Readable.from(object.content)

      if (object?.content) {
        return readableStream.pipe(res)
      }

      return next()
    } catch (err: unknown) {
      req.payload.logger.error(err)
      return next()
    }
  }
}

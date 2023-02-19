import type { StorageClient } from '@supabase/storage-js'
import { BlobReadStream } from 'fast-blob-stream'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import type { StaticHandler } from '../../types'
import { getFilePrefix } from '../../utilities/getFilePrefix'

interface Args {
  getStorageClient: () => StorageClient
  bucket: string
  collection: CollectionConfig
}

export const getHandler = ({ getStorageClient, bucket, collection }: Args): StaticHandler => {
  return async (req, res, next) => {
    try {
      const prefix = await getFilePrefix({ req, collection })
      const key: string = path.posix.join(prefix, req.params.filename)

      const { data } = await getStorageClient().from(bucket).list('', {
        limit: 1,
        offset: 0,
        search: key,
      })
      const file = data![0]
      const fileDownloaded = await getStorageClient().from(bucket).download(key)
      const blobFile = fileDownloaded.data

      res.set({
        'Content-Length': file.metadata.contentLength,
        'Content-Type': file.metadata.mimetype,
        ETag: file.metadata.eTag,
      })

      if (blobFile) {
        const readStream = new BlobReadStream(blobFile)
        return readStream.pipe(res)
      }

      return next()
    } catch (err: unknown) {
      req.payload.logger.error(err)
      return next()
    }
  }
}

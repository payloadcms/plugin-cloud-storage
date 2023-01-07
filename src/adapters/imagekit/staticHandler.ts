import path from 'path'
import type { CollectionConfig } from 'payload/types'
import type { StaticHandler } from '../../types'
import { getFilePrefix } from '../../utilities/getFilePrefix'
import ImageKit from "imagekit";

interface Args {
  getImageKit: () => ImageKit,
  urlEndpoint: string,
  collection: CollectionConfig
}

export const getHandler = ({ getImageKit, urlEndpoint, collection }: Args): StaticHandler => {
  return async (req, res, next) => {
    console.log("StaticHandler", res);

    //TODO
    /*
    try {
      const prefix = await getFilePrefix({ req, collection })

      const url = getImageKit().url({
        path: path.posix.join(prefix, req.params.filename),
        urlEndpoint: urlEndpoint,
        /*transformation : [{
            "height" : "300",
            "width" : "400"
        }]*//*
      });

      const [metadata] = await file.getMetadata()

      res.set({
        'Content-Length': metadata.size,
        'Content-Type': metadata.contentType,
        ETag: metadata.etag,
      })

      return file.createReadStream().pipe(res)
    } catch (err: unknown) {
      return next()
    }*/
  }
}

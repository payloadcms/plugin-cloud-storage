import type { CollectionConfig } from 'payload/types'
import type { StaticHandler } from '../../types'
import ImageKit from "imagekit";
import https from "https";

interface Args {
  getImageKit: () => ImageKit,
  urlEndpoint: string,
  collection: CollectionConfig
}

export const getHandler = ({ getImageKit, urlEndpoint, collection }: Args): StaticHandler => {
  return async (req, res, next) => {

    https.get(urlEndpoint + req.params.filename, (mapRes) => mapRes.pipe(res));


    return res;
  }
}

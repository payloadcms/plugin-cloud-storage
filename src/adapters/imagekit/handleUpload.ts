import ImageKit from 'imagekit'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  prefix?: string
  getImageKit: () => ImageKit
}

export const getHandleUpload = ({
  getImageKit,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {


    const response = await getImageKit().upload({
      file : file.buffer, //required
      fileName : file.filename,   //required
      /*extensions: [
          {
              name: "google-auto-tagging",
              maxTags: 5,
              minConfidence: 95,
          }
      ],*/
    });

    console.log("Upload response", response)

    data.cloudImageID = response?.fileId;
    data.filename = response?.name;
    return data;
  }
}

import path from 'path'
import * as cloudinary from 'cloudinary'
import type { GenerateURL } from '../../types'

interface Args {
  config: {
    cloud_name?: string
    api_key?: string
    api_secret?: string
  }
}

export const getGenerateURL =
  ({ config }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // TODO: Is there a better way to get the MIME type
    const fileEnding: string = filename.split('.').pop() || 'jpg'

    const url = cloudinary.v2.url(`${filename}.jpg`, {
      resource_type: ['mp4', 'mov', 'avi'].includes(fileEnding) ? 'video' : 'image',
    })

    return url
  }

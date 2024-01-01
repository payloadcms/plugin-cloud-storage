import path from 'path'
import type * as AWS from '@aws-sdk/client-s3'
import * as cloudinary from 'cloudinary'
import type { HandleDelete } from '../../types'

interface Args {
  getStorageClient: () => AWS.S3
}

export const getHandleDelete = ({ getStorageClient }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(filename, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}

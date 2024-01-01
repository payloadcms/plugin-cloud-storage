import type { DeleteApiResponse } from 'cloudinary'
import type { HandleDelete } from '../../types'

interface Args {
  getStorageClient: () => any
}

export const getHandleDelete = ({ getStorageClient }: Args): HandleDelete => {
  return async ({ filename /* , doc: { prefix = '' } */ }) => {
    await new Promise((resolve, reject) => {
      getStorageClient().uploader.destroy(filename, (err: any, res: DeleteApiResponse) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}

import type { GenerateURL } from '../../types'

interface Args {
  getStorageClient: () => any
}

export const getGenerateURL =
  ({ getStorageClient }: Args): GenerateURL =>
  ({ filename /* , prefix = '' */ }) => {
    // TODO: Is there a better way to get the MIME type
    const fileEnding: string = filename.split('.').pop() || 'jpg'

    const url = getStorageClient().url(`${filename}.jpg`, {
      resource_type: ['mp4', 'mov', 'avi'].includes(fileEnding) ? 'video' : 'image',
      secure: true,
    })

    return url
  }

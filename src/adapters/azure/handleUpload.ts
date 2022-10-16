import path from 'path'
import type { ContainerClient } from '@azure/storage-blob'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload, GeneratePrefix } from '../../types'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => ContainerClient
  prefix?: string
  generatePrefix?: GeneratePrefix
}

export const getHandleUpload = ({ getStorageClient, prefix = '' }: Args): HandleUpload => {
  return async ({ data, file }) => {
    const blockBlobClient = getStorageClient().getBlockBlobClient(
      path.posix.join(prefix, file.filename),
    )

    await blockBlobClient.upload(file.buffer, file.buffer.byteLength, {
      blobHTTPHeaders: { blobContentType: file.mimeType },
    })

    return data
  }
}

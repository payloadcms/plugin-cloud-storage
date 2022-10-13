import path from 'path'
import type { ContainerClient } from '@azure/storage-blob'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload, GeneratePrefix } from '../../types'

interface Args {
  collection: CollectionConfig
  containerClient: ContainerClient
  allowContainerCreate: boolean
  prefix?: string
  generatePrefix?: GeneratePrefix
}

export const getHandleUpload = ({
  allowContainerCreate,
  containerClient,
  prefix = '',
  generatePrefix,
}: Args): HandleUpload => {
  if (allowContainerCreate) {
    containerClient.createIfNotExists({ access: 'blob' })
  }

  const keyPaths = [prefix]
  if (generatePrefix && typeof generatePrefix === 'function') {
    keyPaths.push(...generatePrefix())
  }

  return async ({ data, file }) => {
    const blockBlobClient = containerClient.getBlockBlobClient(
      path.posix.join(...keyPaths, file.filename),
    )

    await blockBlobClient.upload(file.buffer, file.buffer.byteLength, {
      blobHTTPHeaders: { blobContentType: file.mimeType },
    })

    return data
  }
}

import type { ContainerClient } from '@azure/storage-blob'
import { BlobServiceClient } from '@azure/storage-blob'
import type { Adapter, GeneratedAdapter } from '../../types'
import { getHandler } from './staticHandler'
import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { extendWebpackConfig } from './webpack'

export interface Args {
  connectionString?: string
  containerName: string
  baseURL: string
  allowContainerCreate: boolean
  storageClient?: ContainerClient
}

export const azureBlobStorageAdapter = ({
  connectionString,
  allowContainerCreate,
  containerName,
  baseURL,
  storageClient: customStorageClient,
}: Args): Adapter => {
  let storageClient: ContainerClient | null = customStorageClient ?? null

  if (!connectionString && !customStorageClient) {
    throw new Error('You must provide a connection string or a storage client')
  }

  const getStorageClient = () => {
    if (storageClient) return storageClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString!) // We know this is defined if storageClient is not
    return (storageClient = blobServiceClient.getContainerClient(containerName))
  }

  const createContainerIfNotExists = () => {
    getStorageClient().createIfNotExists({ access: 'blob' })
  }

  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload({
        collection,
        getStorageClient,
        prefix,
      }),
      handleDelete: getHandleDelete({ collection, getStorageClient }),
      generateURL: getGenerateURL({ containerName, baseURL }),
      staticHandler: getHandler({ getStorageClient, collection }),
      webpack: extendWebpackConfig,
      ...(allowContainerCreate && { onInit: createContainerIfNotExists }),
    }
  }
}

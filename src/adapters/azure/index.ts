import type { ContainerClient } from '@azure/storage-blob'
import { BlobServiceClient } from '@azure/storage-blob'
import type { Adapter, GeneratedAdapter } from '../../types'
import { getHandler } from './staticHandler'
import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { extendWebpackConfig } from './webpack'

export type Args = {
  /**
   * The name of the container to use
   * @see https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction#containers
   * @example
   * ```ts
   * const containerName = 'my-container'
   * ```
   */
  containerName: string
  baseURL: string
  /**
   * Allow the adapter to create the container if it doesn't exist
   */
  allowContainerCreate: boolean
} & (
  | {
      /**
       * Connection string for the Azure Storage Account
       * @see https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string
       */
      connectionString: string
      storageClient?: never
    }
  | {
      /**
       * A custom Azure Storage Client
       * @see https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest
       * @example
       * ```ts
       * import { ContainerClient } from '@azure/storage-blob'
       * const containerClient = new ContainerClient(connectionString, containerName)
       * ```
       */
      storageClient: ContainerClient
      connectionString?: never
    }
)

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

  const getStorageClient: () => ContainerClient = () => {
    if (storageClient) return storageClient

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString as string)
    storageClient = blobServiceClient.getContainerClient(containerName as string)
    return storageClient
  }

  const createContainerIfNotExists: () => void = () => {
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

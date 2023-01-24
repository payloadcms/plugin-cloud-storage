import path from 'path'
import type * as AWS from '@aws-sdk/client-s3'
import type { CollectionConfig } from 'payload/types'
import type { HandleUpload } from '../../types'

interface Args {
  collection: CollectionConfig
  bucket: string
  acl?: 'private' | 'public-read'
  prefix?: string
  getStorageClient: () => AWS.S3
}

export const getHandleUpload = ({
  getStorageClient,
  bucket,
  acl,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(prefix, file.filename)
    console.log('Uploading file...', { fileKey })

    if (file.buffer.length < 1024 * 1024 * 100) {
      await getStorageClient().putObject({
        Bucket: bucket,
        Key: fileKey,
        Body: file.buffer,
        ACL: acl,
        ContentType: file.mimeType,
      })

      return data
    }

    console.log('Initiating multipart upload...', { fileKey })
    const { UploadId: uploadId } = await getStorageClient().createMultipartUpload({
      Bucket: bucket,
      Key: fileKey,
      ACL: acl,
      ContentType: file.mimeType,
    })

    if (!uploadId) {
      throw new Error('No upload ID returned from S3')
    }

    const partSize = 1024 * 1024 * 5 // 5MB
    const parts = []

    try {
      const totalParts = file.buffer.length / partSize
      for (let i = 0; i < file.buffer.length; i += partSize) {
        const partNumber = i / partSize + 1
        const part = Uint8Array.prototype.slice.call(file.buffer, i, i + partSize)

        console.log('Uploading part...', {
          fileKey,
          partNumber,
          totalParts,
        })

        const uploadPart = await getStorageClient().uploadPart({
          Bucket: bucket,
          Key: fileKey,
          Body: part,
          PartNumber: partNumber,
          UploadId: uploadId,
        })
        parts.push({
          ETag: uploadPart.ETag,
          PartNumber: partNumber,
        })
      }

      await getStorageClient().completeMultipartUpload({
        Bucket: bucket,
        Key: fileKey,
        MultipartUpload: {
          Parts: parts,
        },
        UploadId: uploadId,
      })
    } catch {
      await getStorageClient().abortMultipartUpload({
        Bucket: bucket,
        Key: fileKey,
        UploadId: uploadId,
      })
    }

    return data
  }
}

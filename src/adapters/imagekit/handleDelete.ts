import type ImageKit from 'imagekit'
import type { HandleDelete } from '../../types'

interface Args {
  getImageKit: () => ImageKit
}

export const getHandleDelete = ({ getImageKit }: Args): HandleDelete => {
  return async ({ filename, doc }) => {
    const response = await getImageKit().deleteFile(doc?.cloudImageID)
  }
}
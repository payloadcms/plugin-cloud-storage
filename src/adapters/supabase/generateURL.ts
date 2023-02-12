import path from 'path'
import type { GenerateURL } from '../../types'

interface Args {
  endpoint: string
  bucket: string
}

export const getGenerateURL =
  ({ endpoint, bucket }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    return `${endpoint}/object/public/${bucket}/${path.posix.join(prefix, filename)}`
  }

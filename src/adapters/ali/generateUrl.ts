import OSS from 'ali-oss'
import type { GenerateURL } from '../../types'

interface Args {
  config: OSS.Options
}

export const getGenerateURL = ({ config }: Args): GenerateURL => {
  return async ({ filename }) => {
    const aliOss = new OSS(config)
    const params: OSS.SignatureUrlOptions = {
      expires: 60 * 60 * 24 * 365,
    }
    const url = await aliOss.signatureUrl(filename, params)
    return url
  }
}

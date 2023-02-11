import { createClient } from '@supabase/supabase-js'
import { extendWebpackConfig } from './webpack'

interface Args {
  config: {
    url: string
    key: string
  }
}

export const supabaseAdapter = async ({ config }: Args): any => {
  const supabase = createClient(config.url, config.key)

  const { data, error } = await supabase.storage.getBucket('avatars')
  console.log({ data, error })
  return {
    handleUpload: () => null,
    handleDelete: () => null,
    generateURL: () => null,
    staticHandler: () => null,
    webpack: extendWebpackConfig,
  }
}

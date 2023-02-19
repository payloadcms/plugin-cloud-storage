import path from 'path'
import type { Configuration as WebpackConfig } from 'webpack'

export const extendWebpackConfig = (existingWebpackConfig: WebpackConfig): WebpackConfig => {
  const newConfig: WebpackConfig = {
    ...existingWebpackConfig,
    resolve: {
      ...(existingWebpackConfig.resolve || {}),
      alias: {
        ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
        '@supabase/storage-js': path.resolve(__dirname, './mock.js'),
        'fast-blob-stream': path.resolve(__dirname, './mock.js'),
        fs: path.resolve(__dirname, './fileStub.js'),
      },
    },
  }

  return newConfig
}

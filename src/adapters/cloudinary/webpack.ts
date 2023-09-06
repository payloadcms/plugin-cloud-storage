import type { Configuration as WebpackConfig } from 'webpack'
import path from 'path'

export const extendWebpackConfig = (existingWebpackConfig: WebpackConfig): WebpackConfig => {
  const newConfig: WebpackConfig = {
    ...existingWebpackConfig,
    resolve: {
      ...(existingWebpackConfig.resolve || {}),
      fallback: {
        ...(existingWebpackConfig.resolve?.fallback ? existingWebpackConfig.resolve.fallback : {}),
        stream: false,
      },
      alias: {
        ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
        cloudinary: path.resolve(__dirname, './cloudinaryMock.js'),
        fs: path.resolve(__dirname, './fsMock.js'),
      },
    },
  }

  return newConfig
}

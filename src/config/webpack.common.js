import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { smart } from 'webpack-merge'
import { ROOT, SRC_DIR, MODULES_DIR } from '../helpers'
import createAssetsConfig from './webpack.assets'
import createScriptsConfig from './webpack.scripts'
import createStylesConfig from './webpack.styles'

const templateDir = `${ROOT}/.webpack/index.html`

function createConfig (conf = {}) {
  const assetsConfig = createAssetsConfig(conf)
  const scriptsConfig = createScriptsConfig(conf)
  const stylesConfig = createStylesConfig(conf)

  const config = {
    context: ROOT,
    entry: {
      main: './src'
    },
    resolve: {
      root: [SRC_DIR, MODULES_DIR]
    },
    output: {
      path: path.join(ROOT, 'build'),
      filename: 'bundle.js'
    },
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new HtmlWebpackPlugin({
        template: templateDir,
        hash: false,
        filename: 'index.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true
        }
      })
    ]
  }

  if (conf.globals) {
    config.plugins.push(new webpack.DefinePlugin(conf.globals))
  }

  return smart(assetsConfig, scriptsConfig, stylesConfig, config)
}

export default createConfig

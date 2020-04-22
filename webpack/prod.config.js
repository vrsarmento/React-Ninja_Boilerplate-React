'use strict'

const webpack = require('webpack')
const common = require('./common')

const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const crp = new ExtractTextPlugin({
  filename: 'crp.css'
})
const styles = new ExtractTextPlugin({
  filename: '[name]-[hash].css'
})

module.exports = {
  entry: common.entry,
  output: common.output,

  plugins: [
    crp,
    styles,

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new HtmlPlugin(common.htmlPluginConfig('template.html')),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),

  ],

  module: {
    rules: [
      common.standardPreLoader,
      common.jsLoader, 
      {
        test: /\.css$/,
        exclude: /node_modules|(search|style)\.css/,
        include: /src/,
        use: styles.extract.apply({
          fallback: common.cssLoader.use[0],
          use: common.cssLoader.use.slice(1)
        })
      },
      {
        test: /(search|style)\.css$/,
        exclude: /node_modules/,
        include: /src/,
        use: crp.extract.apply({
          fallback: common.cssLoader.use[0],
          use: common.cssLoader.use.slice(1)
        })
      }
    ]
  },

  resolve: common.resolve
}
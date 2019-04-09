const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
      	test: /\.vue$/,
      	use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
          MiniCssExtractPlugin.loader,
					'css-loader'
				]
			}
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
}
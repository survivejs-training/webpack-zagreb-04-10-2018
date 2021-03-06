const path = require("path")
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const parts = require("./webpack.parts");

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
    ],
    devtool: "source-map"
  },
  parts.loadJavaScript({
    include: path.resolve(__dirname, 'src')
  }),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[chunkhash].js",
      filename: "[name].[chunkhash].js",
    },
  },
  parts.extractCSS({
    use: "css-loader",
  }),
  {
    optimization: {
      splitChunks: {
        chunks: "initial",
      },
      runtimeChunk: {
        name: "manifest",
      },
    },
  },
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  {
    devtool: "cheap-module-eval-source-map"
  },
  parts.loadCSS(),
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};
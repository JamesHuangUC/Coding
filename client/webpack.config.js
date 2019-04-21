const HtmlWebPackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      favicon: "src/favicon.ico"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        // API_HOST: JSON.stringify("https://icoding.herokuapp.com"),
        API_HOST: JSON.stringify("http://localhost:3000"),
        API_CODING: JSON.stringify("https://coding-api.cmps.app")
      }
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // languages: ['javascript','json']
    })
  ],
  output: {
//    publicPath: "/" //development env
    publicPath: "/coding/" //production env
  },
  node: {
    dns: "mock",
    net: "mock"
  }
};

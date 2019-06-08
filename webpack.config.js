const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: '/',
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/
        ],
        use: {
          loader: "babel-loader",
          query: {
            presets: ['@babel/react']
          }
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader"
        }]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: { minimize: false }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js.map$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      name: "index",
      template: "./src/index.html",
      filename: "index.html",
      chunks: ['index']
    }),
  ],
  module: {  // If I remove this, webpack fails. \(~n~)/
    rules: [
    ],
  },
  devtool: "source-map",
}
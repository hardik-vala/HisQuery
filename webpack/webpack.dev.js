const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
require("dotenv").config({ path: "./.env.development" });

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    ...common.plugins,
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
});

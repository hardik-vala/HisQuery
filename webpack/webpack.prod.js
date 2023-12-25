const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
require("dotenv").config({ path: "./.env.production" });

module.exports = merge(common, {
  mode: "production",
  plugins: [
    ...common.plugins,
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
});

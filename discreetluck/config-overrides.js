const { override, addWebpackAlias } = require("customize-cra");
const webpack = require("webpack");
const path = require("path");

module.exports = override((config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false, // Mock 'fs' in the browser
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    crypto: require.resolve("crypto-browserify"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser", // Add process polyfill
      Buffer: ["buffer", "Buffer"], // Add Buffer polyfill
    })
  );

  return config;
});

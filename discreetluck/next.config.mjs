import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

export default {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      })
    );

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/cfd-dlc-js-wasm/dist/*.wasm",
            to: "public/static/js/[name][ext]",
          },
          {
            from: "node_modules/cfd-js-wasm/dist/*.wasm",
            to: "public/static/js/[name][ext]",
          },
        ],
      })
    );

    config.resolve.fallback = {
      ...config.resolve.fallback,
      process: "process/browser",
      path: "path-browserify",
      fs: false,
      crypto: "crypto-browserify",
      buffer: "buffer/",
      stream: "stream-browserify",
      vm: "vm-browserify",
      assert: "assert/",
      util: "util/",
      zlib: "browserify-zlib",
    };

    return config;
  },
};

module.exports = {
  webpack(cfg) {
    cfg.module.rules.unshift({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      enforce: "pre",
      use: [
        {
          loader: require.resolve("./loader.js"),
        },
      ],
    });
    return cfg;
  },
  experimental: {
    turbo: {
      rules: {
        "**/*.{js,jsx,ts,tsx}": {
          loaders: [require.resolve("./loader.js")],
        },
      },
    },
  },
};

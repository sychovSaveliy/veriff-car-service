const path = require("path");
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set(
      "global",
      path.resolve(__dirname, "src/styles/_variables.scss")
    );

    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 10240 }));
  }
};

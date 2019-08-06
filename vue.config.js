const path = require("path");
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set(
      "global",
      path.resolve(__dirname, "src/styles/_variables.scss")
    );
  }
};

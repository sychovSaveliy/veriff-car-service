module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
            @import "~@/styles/_variables.scss"
            @import "~@/styles/_global.scss"
          `,
        implementation: require("sass"),
        fiber: require("fibers")
      }
    }
  },
  chainWebpack: config => {
    ["vue-modules", "vue", "normal-modules", "normal"].forEach(match => {
      config.module
        .rule("sass")
        .oneOf(match)
        .use("sass-loader")
        .tap(opt =>
          Object.assign(opt, {
            data: `
                @import "~@/styles/_variables.scss"
                @import "~@/styles/_global.scss"
            `
          })
        );
    });
  }
};

const path = require("path");
// https://cli.vuejs.org/guide/webpack.html#simple-configuration
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        icons: path.resolve(
          __dirname,
          "node_modules/vue-material-design-icons"
        ),
      },
      extensions: [".vue"],
    },
  },
};

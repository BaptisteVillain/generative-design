const path = require("path");

module.exports = {
  runtimeCompiler: true,
  chainWebpack: config => {
    config
      .module
      .rule("glslify-loader")
      .test(/\.(glsl|frag|vert)$/)
      .use("raw-loader")
        .loader("raw-loader")
        .end();
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  },
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/*/*.scss'),
      ],
    })
}


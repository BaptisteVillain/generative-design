module.exports = {
  chainWebpack: config => {
    config
      .module
      .rule("glslify-loader")
      .test(/\.(glsl|frag|vert)$/)
      .use("raw-loader")
        .loader("raw-loader")
        .end();
    }
};

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Copy of the',
    }
  },
  assetsDir: 'static',
  devServer: {
    proxy: {
      "/api/": {
        target: process.env.VUE_APP_BASE_URL,
      }
    }
  }
}
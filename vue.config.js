module.exports = {
  devServer: {
    proxy: {
      '/project-api/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/project-api/': '',
        },
      },
    },
  },
}

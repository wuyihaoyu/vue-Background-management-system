// module.exports = {
//     　　devServer: {
//     　　　　host: 'localhost',
//     　　　　port: 8080,
//     　　　　proxy: {
//     　　　　　　'/getDiscList': {
//     　　　　　　　　target: 'http://127.0.0.1:8888',// 要跨域的域名
//     　　　　　　　　changeOrigin: true, // 是否开启跨域
//     　　　　　　　　pathRewrite: {
//     　　　　　　　　'^/api': '' // 在请求的时候 凡是/api开头的地址都可以跨域
//     　　　　　　　　}
//     　　　　　　},
//     　　　　}
//     　　}
//     };


module.exports = {
        devServer: {
          proxy: {
            '/api': { 
              target: 'http://api.boblog.com', //对应服务器地址
              changeOrigin: true, //允许跨域
            //   ws: true,
              pathRewrite: {
              '^/api': ''
              }
            }
          }
        }
      }
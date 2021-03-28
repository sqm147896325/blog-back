const path = require('path')
module.exports = {
	chainWebpack: config => {
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
	},
	css: {
		loaderOptions: {
			less: {
				javascriptEnabled: true
			}
		}
	},

	// 配置跨域
	devServer: {
		proxy: {
			'/api': {
				//业务类的接口请求地址，这里的api可以是后端的工程名
				changeOrigin: true,
				target: 'http://127.0.0.1:3000'
			}
		}
	}
}

function addStyleResource(rule) {
	rule.use('style-resource')
	.loader('style-resources-loader')
	.options({
		patterns: [
			// 需要全局导入的less路径，自己修改，我这里引入了两个less文件
			path.resolve(__dirname, './src/style/variables.less'),
		],
	})
}

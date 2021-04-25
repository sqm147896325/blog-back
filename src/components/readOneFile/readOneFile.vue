<template>
	<el-upload
		ref="upload"
		action=""
		:accept="this.accept"
		:auto-upload="false"
		:on-change="changeFile"
		:http-request="uploadHandler">
		<el-button plain slot="trigger" size="small">
			<i class="el-icon-upload font-size-14"></i>读取文件
		</el-button>
		<div class="text-info">仅支持{{this.accept}}后缀文件上传，最大2MB</div>
	</el-upload>
</template>

<script>
/**
 * @description: 基于element-ui的自定义读取单个文件组件
 * @param {props}		accept		可以传入的文件后缀，用逗号隔开如： .txt,.md
 * @param {method}		readText	读取文件成功的回调，返回读取的值
 */
export default {
	name: 'readOneFile',
	props:{
		// 可以传入的文件后缀
		accept: {
			type: String,
			defalut: '',
			required: true
		}
	},
	methods: {
		init(){},

		// 获取随机数
		getRandomNum (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		},
		// 更改文件检测
		changeFile (file, fileList) {
			if (file.status === 'ready') {
				// 已上传文件列表如果存在 2 条记录，移除第一条，实现替换效果
				if (fileList.length === 2) {
					fileList.shift()
				}
				
				// 手动开始上传
				this.$refs['upload'].submit()
			}
		},
		// 上传回调
		uploadHandler (params) {
			const isLt2M = params.file.size / 1024 / 1024 <= 2
			if (!isLt2M) {
			this.$notify({
				message: '上传的文件不能大于2MB',
				type: 'warning',
				title: '警告'
			})
				return false;
			}
			
			// 调用 element ui 进度条
			params.onProgress({ percent: this.getRandomNum(19, 99) })
			setTimeout(() => {
				this.readText(params)
			}, 100)
		},
		// 读取文本操作
		async readText (params) {
			// UTF-8,GBK,GB2312
			const readFile = new FileReader()
			readFile.onload = (e) => {
				let data = e.target.result;			// 读取到文件数据
				this.$emit('readText',data);		// 读取成功父组件回调
				params.onProgress({ percent: 100 }) // 调用 element ui 进度条
				params.onSuccess() 					// 调用 element ui 上传成功方法
			}
			readFile.readAsText(params.file);
		}
	}
}
</script>

<style lang="less" scoped>
// 上传提示文字
.text-info{
	font-size: 14px;
	color: #606266;
}

// 去掉已上传文件列表的文件移除动画
/deep/ .el-list-leave-active {
	transition: none;
}
/deep/ .el-list-leave-active {
	opacity: 0;
}
/deep/ .el-upload-list {
	max-height: 26px;
}
</style>>
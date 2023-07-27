const path = require('path')
const fs = require('fs')
const JSZip = require('jszip')

/**
 * 自定义vite插件
 * @param {*} param0 插件配置项
 * @returns 生成的处理配置
 */
const plugin = function ({
  zipFileName = 'dist', // 压缩包文件名
  distWhere = '../dist/', // 构建生成的文件夹目录（相对）
  sourcemapWhere = '../suorcemap/' // sourcemap生成的文件夹目录（相对）
} = {}) {
  zipFileName += '.zip'
  const distOutput = path.resolve(__dirname, distWhere) // 设置读取文件的绝对路径
  const sourcemapOutput = path.resolve(__dirname, sourcemapWhere) // 设置读取文件的绝对路径

  return {
    name: 'vite-plugin-build',
    apply: 'build',
    closeBundle: async () => {
      await moveSourcemap(distOutput, sourcemapOutput) // 移动sourcemap文件到外面
      makeZip(distOutput, zipFileName) // 制作zip包
    }
  }
}

module.exports = plugin

/**
 * 移动sourcemap文件到特定文件夹
 * @param {*} distOutput 打包生成的目录
 * @param {*} sourcemapOutput sourcemap需要移动到的目录
 * @returns Promise
 */
const moveSourcemap = (distOutput, sourcemapOutput) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(distOutput) // 根据文件路径读取文件，返回文件列表

    const promiseArr = [] // 收集异步

    // 遍历读取到的文件列表
    files.forEach((filename) => {
      const distDir = path.join(distOutput, filename) // dist目录的绝对路径
      const sourcemapDir = path.join(sourcemapOutput, filename) // sourcemap目录的绝对路径

      const stats = fs.statSync(distDir) // 根据路径获取文件信息，返回文件状态对象

      const isFile = stats.isFile()// 是文件
      if (isFile) {
        const ext = filename.split('.')[filename.split('.').length - 1]
        if (ext === 'map') {
        // 如果是sourcemap文件，通过重命名移动文件到指定目录
          promiseArr.push(fs.renameSync(distDir, sourcemapDir))
        }
      }

      const isDir = stats.isDirectory()// 是文件夹
      if (isDir) {
        promiseArr.push(moveSourcemap(distDir, sourcemapOutput))// 递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    // stats 为其他类型不做处理
    })

    Promise.all(promiseArr).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}

/**
 * 将构建后的文件压缩成zip包
 * @param {*} distOutput 打包生成的目录
 * @param {*} zipFileName zip包名称
 */
const makeZip = (distOutput, zipFileName) => {
  const zip = new JSZip()
  const distPath = path.resolve(distOutput)
  // const allFolder = zip.folder(fileName) // 不注释多出打包文件夹这一层级
  const allFolder = zip

  // 读取dist下的根文件目录
  const readDir = function (allFolder, dirPath) {
    const files = fs.readdirSync(dirPath)
    files.forEach((fileName) => {
      const fillPath = path.join(dirPath, './', fileName)
      const file = fs.statSync(fillPath)
      // 如果是文件夹的话需要递归遍历下面的子文件
      if (file.isDirectory()) {
        const dirZip = allFolder.folder(fileName)
        readDir(dirZip, fillPath)
      } else {
        // 读取每个文件为buffer存到zip中
        allFolder.file(fileName, fs.readFileSync(fillPath))
      }
    })
  }

  // 移除已经存在的包
  const removeExistedZip = () => {
    const dest = path.join(distPath, './dist/' + zipFileName)
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest)
    }
  }

  // 压缩函数
  const zipDir = function () {
    readDir(allFolder, distPath)
    zip.generateAsync({
      type: 'nodebuffer', // 压缩类型
      compression: 'DEFLATE', // 压缩算法
      compressionOptions: {
        // 压缩级别
        level: 9
      }
    }).then((content) => {
      const dest = path.join(distPath, './' + zipFileName)
      removeExistedZip()
      // 把zip包写到硬盘中，这个content现在是一段buffer
      fs.writeFileSync(dest, content)
    })
  }

  removeExistedZip()
  zipDir(distPath)
}

/* 自定义指令 */
const directives = {
  // code 代码块复制
  codeCopy: {
    mounted: (el) => {
      const code = el.querySelectorAll('pre > code')
      if (!code.length) {
        return false
      }
      for (let index = 0; index < code.length; index++) {
        const codeItem = code[index]

        // 创建设置子元素
        const copyButton = document.createElement('button')
        copyButton.innerText = '复制'
        copyButton.style.opacity = 0
        copyButton.style.position = 'absolute'
        copyButton.style.top = '10px'
        copyButton.style.right = '10px'
        copyButton.style.background = '#999'
        copyButton.style.transition = 'all 0.2s'
        copyButton.style.cursor = 'pointer'

        // 设置父元素
        codeItem.style.position = 'relative'
        codeItem.className = 'hljs ' + codeItem.className
        codeItem.appendChild(copyButton)

        codeItem.addEventListener('mouseover', () => {
          copyButton.style.opacity = 1
        })

        codeItem.addEventListener('mouseleave', () => {
          copyButton.style.opacity = 0
        })

        copyButton.addEventListener('click', () => {
          const text = codeItem.innerText.slice(0, -2) // 获取复制的内容并去除增加的 '复制' 二字
          navigator.clipboard.writeText(text)
        })
      }
    }
  }
}

// 自定义指令批量注册
export default {
  install (app) {
    for (const key in directives) {
      if (Object.hasOwnProperty.call(directives, key)) {
        const directiveItem = directives[key]
        app.directive(key, directiveItem)
      }
    }
  }
}

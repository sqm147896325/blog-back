<template>
  <div class="sys-msg">
    <div
      id="xterm"
      ref="xterm"
    />
  </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

export default {
  name: 'SysMsg',
  data () {
    return {
      term: null,
      fitAddon: null,
      sshState: false,
      historyCmd: [], // 历史命令
      historyIndex: 0, // 历史命令索引
      temCmdStr: [], // 正在输入中的命令
      temCmdIndex: 0, // 正在输入中的命令索引
      symbol: '$ > ', // 换行时开始的符号
      ins: 0
    }
  },
  computed: {
    pipAfter () {
      return this.temCmdStr.slice(this.temCmdIndex)
    }
  },
  mounted () {
    this.initTerm()
    // this.$socket.term.emit('init');
  },
  beforeUnmount () {
    this.socket.term.close()
    this.term && this.term.dispose()
  },
  methods: {
    initTerm () {
      // 设置了cols或者fitAddon.fit(); 当一行字符超过80个过会替换现在的内容，否则换行
      const term = new Terminal({
        cursorBlink: true, // 关标闪烁
        cursorStyle: 'bar', // 光标样式 'block' | 'underline' | 'bar'
        scrollback: 100 // 当行的滚动超过初始值时保留的行视窗，越大回滚能看的内容越多，
      })
      this.term = term
      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)
      this.fitAddon = fitAddon
      term.open(this.$refs.xterm)
      // 自适应大小(使终端的尺寸和几何尺寸适合于终端容器的尺寸)，初始化的时候宽高都是对的
      term.focus()
      this.term.onData(data => {
        this.sshState ? this.$socket.term.emit('res', data) : this.keyInput(data)
      })
      /* 不知道键名时可以开启该方法 */
      // this.term.onKey(data =>  {
      //  console.log('key', data)
      // });
      // ! fitAddon首次自适应时效果不好，暂时屏蔽自适应
      // setTimeout(() => this.fitAddon.fit(), 500)
      // window.addEventListener('resize', this.resizeTerm);
      this.initGreet()
    },
    initGreet () {
      this.term.write('*** （^0^） ***')
      this.keyEnter()
    },
    keyInput (key) {
      // console.log('input', key)
      if (key.includes(';')) {
        console.log('暂时不支持组合键')
        return false
      }
      // if (!key.includes("'\'") && key.length > 1) {
      //  console.log('粘贴', key)
      //  key.split('').forEach(e => {
      //    this.temCmdStr.splice(this.temCmdIndex, this.ins, e)
      //  });
      //  this.temCmdIndex += key.length
      //  this.term.write(key);
      //  return false
      // }
      if (key === '\r') {
        this.keyEnter()
      } else if (key === '\x7F') {
        this.keyBackspace()
      } else if (key === '\u001b[A') {
        this.keyUp()
      } else if (key === '\u001b[B') {
        this.keyDown()
      } else if (key === '\u001b[C') {
        this.keyRight()
      } else if (key === '\u001b[D') {
        this.keyLeft()
      } else {
        const temArr = []; const bArr = []
        this.pipAfter.forEach(e => {
          temArr.push(e)
          bArr.push('\b')
        })
        const temKey = key + temArr.join('') + bArr.join('')
        this.term.write(temKey)
        this.temCmdStr.splice(this.temCmdIndex, this.ins, key)
        this.temCmdIndex++
      }
    },

    // 回车
    keyEnter () {
      this.cmd(this.temCmdStr.join(''))
      this.term.writeln('')
      this.term.write(this.symbol)
      this.historyCmd.push(this.temCmdStr)
      this.historyIndex++
      this.temCmdStr = []
      this.temCmdIndex = 0
    },
    // 删除
    keyBackspace () {
      if (this.temCmdIndex === 0) return false // 判断是否删完
      const temArr = []; const bArr = []
      this.pipAfter.forEach(e => {
        temArr.push(e)
        bArr.push('\b')
      })
      const temKey = '\b' + temArr.join('') + ' \b' + bArr.join('')
      this.term.write(temKey)
      this.temCmdIndex--
      this.temCmdStr.splice(this.temCmdIndex, this.ins + 1)
    },
    keyUp () {
      if (this.historyIndex !== 0) {
        this.historyIndex--
      }
      this.term.write(this.historyCmd[this.historyIndex].join(''))
    },
    keyDown () {
      if (this.historyIndex < this.historyCmd.length) {
        this.historyIndex++
      }
      this.term.write(this.historyCmd[this.historyIndex].join(''))
    },
    keyRight () {
      if (this.temCmdIndex >= this.temCmdStr.length) return false
      this.temCmdIndex++
      this.term.write('\u001b[C')
    },
    keyLeft () {
      if (this.temCmdIndex <= 0) return false
      this.temCmdIndex--
      this.term.write('\u001b[D')
    },

    getColsAndRows (element) {
      // 暂时不用
      element = element || document.getElementById('xterm')
      return {
        rows: parseInt((element.clientHeight - 0) / 18),
        cols: 10 // parseInt(element.clientWidth / 8)
      }
    },
    resizeTerm () {
      this.fitAddon.fit()
      this.term.scrollToBottom()
    },

    cmd (cmd) {
      console.log(cmd)
    }
  },
  sockets: {
    term: {
      res (event) {
        this.term.write(event.toString())
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sys-msg{
  display: flex;
  justify-content: center;
  #xterm {
    margin: 5px;
  }
}
</style>

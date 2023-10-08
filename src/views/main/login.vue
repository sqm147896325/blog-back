<template>
  <div class="login">
    <div class="title">
      LS后台
    </div>
    <div class="card">
      <el-form
        ref="loginForm"
        :model="loginInfo"
        :rules="rules"
        class="loginForm"
      >
        <el-form-item
          prop="id"
          class="item"
        >
          <el-input
            v-model="loginInfo.id"
            placeholder="请输入id或邮箱"
            @keyup.enter.native="login"
          >
            <template #prepend>
              账号
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          class="item"
        >
          <el-input
            v-model="loginInfo.password"
            placeholder="请输入密码"
            show-password
            @keyup.enter.native="login"
          >
            <template #prepend>
              密码
            </template>
          </el-input>
        </el-form-item>
        <div class="item-button">
          <el-button
            class="login-btn"
            type="info"
            @click="login"
          >
            登录
          </el-button>
          <div
            class="function-btn"
            size="small"
            type="text"
            @click="registerOrForget"
          >
            注册/忘记密码
          </div>
        </div>
      </el-form>
    </div>
    <my-form
      ref="myForm"
      :title="title"
      :formdata="formdata"
      :row="bindData"
      :rules="rules"
      :visible="dialogVisible"
      @cancelForm="handleClose"
      @submitFrom="submitFrom"
      @close="dialogVisible = false"
    >
      <template #verification="{ allRow, rowKey }">
        <el-input v-model="allRow[rowKey]">
          <el-button
            slot="append"
            :disabled="verificationText !== '获取验证码'"
            :loading="verificationText === 'loading'"
            @click="getVerification"
          >
            {{ ['获取验证码', 'loading'].includes(verificationText) ? '获取验证码' : verificationText + '秒后可再次获取' }}
          </el-button>
        </el-input>
      </template>
    </my-form>
  </div>
</template>

<script>
import { apiPostLogin, apiToolEmailVerify, apiToolEmailSetUser, apiGetUser } from '@/api/user.js'
import From from '@/components/Form/Form.vue'

export default {
  name: 'LoginView',
  components: { 'my-form': From },

  beforeRouteEnter (to, from, next) {
    let redirect = '/'
    if (to.query && to.query.redirect) {
      redirect = to.query.redirect
    }
    if (to.query && to.query.token) {
      localStorage.setItem('token', to.query.token)
      apiGetUser().then(res => {
        const userInfo = res.dataInfo
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        next(vm => {
          vm.$store.commit('user/setUserInfo', userInfo)
          vm.$message.success('授权免登录成功')
          vm.$router.replace({ path: redirect })
        })
      }).catch(e => {
        console.log('免登录失败', e)
        localStorage.removeItem('token') // 401 时会自动提示，这里防止产生其他问题
        next()
      })
    } else {
      next()
    }
  },

  data () {
    return {
      loginInfo: {
        id: '',
        password: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入id或邮箱', trigger: 'blur' },
          { min: 1, message: '请输入账号id或绑定邮箱', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码在6-20个字符', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, validator: this.reSure, trigger: 'blur' }
        ],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码为4个字符', trigger: 'blur' }
        ]
      },
      formdata: {
        email: { label: '邮箱', value: '' },
        verification: { label: '验证码', value: '' },
        password: { label: '密码', value: '', type: 'password' },
        rePassword: { label: '确认密码', value: '', type: 'password' }
      }, // 表单
      bindData: {
        username: '',
        email: '',
        password: '',
        rePassword: ''
      },
      title: '注册',
      verificationText: '获取验证码',
      dialogVisible: false,
      verificationData: ''
    }
  },

  mounted () {
    this.init()
  },
  methods: {
    init () {

    },
    login () {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          console.log('[login] 校验失败')
        } else {
          const res = await apiPostLogin(this.loginInfo)
          // 存在res且flag为1则表示登录成功
          if (res?.flag === 1) {
            localStorage.setItem('token', res.dataInfo.token)
            const userInfo = res.dataInfo.userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            this.$store.commit('user/setUserInfo', userInfo)
            let redirect = '/'
            if (this.$route.query && this.$route.query.redirect) {
              redirect = this.$route.query.redirect
            }
            this.$router.push(redirect)
            this.$message.success('登录成功')
          }
        }
      })
    },
    registerOrForget () {
      this.dialogVisible = true
      this.title = '注册/忘记密码'
    },
    handleClose () {
      this.dialogVisible = false
    },
    async submitFrom (data, type) {
      await apiToolEmailSetUser({ email: data.email, verification: data.verification, password: data.password })
    },

    /* 注册登录相关 */
    // 校验两次密码是否一致
    reSure (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
        // password 是表单上绑定的字段
      } else if (value !== this.$refs.myForm.rowData.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    // 获取验证码
    async getVerification () {
      this.$refs.myForm.$refs.form.validateField('email', async (errorMessage) => {
        if (!errorMessage) {
          apiToolEmailVerify({ email: this.$refs.myForm.rowData.email }).then(() => {
            this.verificationText = 60
            const timer = setInterval(() => {
              this.verificationText--
              if (this.verificationText === 0) {
                this.verificationText = '获取验证码'
                clearInterval(timer)
              }
            }, 1000)
          }).catch(() => {
            this.verificationText = '获取验证码'
          })
          this.verificationText = 'loading'
        } else {
          this.$message.error('请先输入正确邮箱')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: @bg-other;
}
.title{
  position: absolute;
  top: 120px;
  font-size: @fz-big-title;
  font-family: '微软雅黑';
  letter-spacing: 10px;
  background-clip: text;
  color: @c-black;
}
.card{
  height: 200px;
  width: 300px;
  background: @bg-bar;
  padding: 20px;
  box-shadow: 10px 10px 5px #666666;
  opacity: 0.9;
  border-radius: 10px;

}
.loginForm{
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .item{
    width: 100%;
  }
}
.item-button{
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  .login-btn{
    margin-right: 150px;
  }
  .function-btn{
    color: #fff;
    font-size: @fz-small;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>

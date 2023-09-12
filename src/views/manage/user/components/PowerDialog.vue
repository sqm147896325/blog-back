<template>
  <el-dialog
    title="设置权限"
    :visible="show"
    :show-close="false"
    width="350px"
  >
    <el-tree
      ref="powerTree"
      :data="routerPower"
      show-checkbox
      node-key="name"
      default-expand-all
      :default-checked-keys="powerData"
      :props="defaultProps"
      @check="powerCheck"
    />
    <span slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button
        type="primary"
        :disabled="equally"
        @click="save"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { apiPostPower } from '@/api/user.js'

export default {
  name: 'PowerDialog',
  props: {
    // 当前用户拥有的权限
    powerData: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // el-tree 显示的格式设置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      equally: true // 权限数据未发生改变不发送请求
    }
  },
  computed: {
    // 根据路由遍历设置权限
    routerPower () {
      let routerData = this.$router.options.routes
      // 首页不参与鉴权，为默认的最小权限
      routerData = routerData.filter(e => {
        return e.name !== 'dashboard'
      })
      routerData = this.recursionFilter(routerData, (routerData) => this.ruleOfFilter(routerData))
      return routerData
    }
  },
  watch: {
    show (newValue, oldValue) {
      if (oldValue === true) {
        // 监听旧的值，如果发生改变且之前为true，则需要清除勾选
        this.$refs.powerTree.setCheckedKeys([])
      }
    }
  },
  mounted () {
  },
  methods: {
    // 权限选择回调
    powerCheck () {
      // 转化一致格式比较是否发生改变
      let power = this.$refs.powerTree.getCheckedNodes()
      power = power.map(e => {
        return e.name
      })
      if (power.sort().toString() === [...this.powerData].sort().toString()) {
        // 相等无法点击确定
        this.equally = true
      } else {
        // 不相等才能修改
        this.equally = false
      }
    },

    // 取消
    cancel () {
      this.$emit('update:show', false)
    },
    // 保存
    async save () {
      let power = this.$refs.powerTree.getCheckedNodes()
      power = power.map(e => {
        return e.name
      })
      const params = {
        id: this.id,
        power: JSON.stringify(power)
      }
      await apiPostPower(params)
      this.$emit('update:show', false)
      this.$emit('save') // 告诉父组件已经发生更新请求了，父组件中数据也应该相应更新
      this.equally = true // 子组件的某些数据也要重新加载
    },

    // 递归剔除
    recursionFilter (data, callback = () => {}) {
      data = callback(data)
      data.forEach(e => {
        if (e.children) {
          e.children = this.recursionFilter(e.children, () => callback(e.children))
        }
        return e
      })
      return data
    },

    // 剔除的规则
    ruleOfFilter (routerData) {
      routerData = routerData.filter(e => {
        // 剔除meta中show字段为false的路由
        if (e.meta && e.meta.show === false) {
          return false
        }
        // 如果有e.children且e.children是只有唯一一个值的数组，则删除他。
        if (e.children && e.children[1] === undefined) {
          delete e.children
        }
        return true
      })
      return routerData
    }
  }
}
</script>

<style lang="less" scoped>

</style>

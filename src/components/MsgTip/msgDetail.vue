<template>
  <div
    class="main"
    @click="visiable ? close() : open()"
  >
    <h2 class="msg-title">
      <span>{{ title }}&nbsp;</span>
      <el-icon>
        <component :is="visiable ? 'CaretTop' : 'CaretBottom'" />
      </el-icon>
    </h2>
    <div
      v-if="visiable"
      class="msg-list"
    >
      <div
        v-for="(value, key) in map"
        :key="key"
        class="list-item"
      >
        {{ value[0] }}:{{ value[1] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MsgDetail',
  props: {
    title: {
      type: String,
      default: ''
    },
    msgMap: {
      type: Object,
      default: () => {}
    },
    dataInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      map: [],
      visiable: false
    }
  },
  mounted () {
    this.map = new Map() // 这里初始化map，对象地址不改变vue没法动态刷新
    const keys = Object.keys(this.msgMap)
    keys.forEach(e => {
      this.map.set(this.msgMap[e], this.dataInfo[e])
    })
  },
  methods: {
    open () {
      this.visiable = true
    },
    close () {
      this.visiable = false
    }
  }
}
</script>

<style lang="less" scoped>
.main{
    cursor: pointer;
    .msg-title{
        font-weight: 700;
        font-size: @fz-big;
        margin: 0;
        color: @c-black;
    }
    .msg-button {
        color: blue;
        font-size: @fz-normal;
        padding-top: 10px;
    }
    .msg-list{
        padding-top: 10px;
        .list-item{
            padding: 5px 0;
        }
    }
}
</style>

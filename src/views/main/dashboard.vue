<template>
  <div class="dashboard">
    <grid-layout
      :layout="layout"
      :col-num="6"
      :row-height="40"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <div
          v-if="item.i == '0'"
          id="new-blog"
          style="width: 100%;height:100%"
        />
        <div
          v-else-if="item.i == '1'"
          id="keyword-data"
          style="width: 100%;height:100%"
        />
        <div
          v-else
          class="item-inner"
        />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout' // 引入vue-grid-layout布局
import { apiGetBlogList, apiGetKeyword } from '@/api/blog.js'
import * as echarts from 'echarts' // 引入echarts
export default {
  name: 'DashboardView',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data () {
    return {
      // 新增博客相关
      newBlog: {
        chart: {},
        option: {},
        data: []
      },
      // 关键字及其出现次数相关
      keywordData: {
        chart: {},
        option: {},
        data: []
      },
      layout: [
        { x: 0, y: 0, w: 3, h: 5, i: '0' },
        { x: 3, y: 0, w: 3, h: 5, i: '1' },
        { x: 0, y: 1, w: 3, h: 5, i: '2' },
        { x: 3, y: 1, w: 3, h: 5, i: '3' },
        { x: 0, y: 2, w: 3, h: 5, i: '4' },
        { x: 3, y: 2, w: 3, h: 5, i: '5' }
      ]
    }
  },
  async mounted () {
    await this.init()
  },
  methods: {
    // 初始化
    async init () {
      await this.getNewBlog()
      await this.getKeywordData()
      this.charts()
    },

    /* 图表相关 */
    // 图表设置流程
    charts () {
      // 近日新增博客 图表设置
      this.newBlog.chart = echarts.init(document.getElementById('new-blog'))
      this.newBlog.option = {
        title: { text: '近日新增博客', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{ type: 'pie', data: this.newBlog.data, radius: '60%' }]
      }
      this.newBlog.chart.setOption(this.newBlog.option)
      // 关键字统计 图表设置
      this.keywordData.chart = echarts.init(document.getElementById('keyword-data'))
      this.keywordData.option = {
        title: { text: '关键字统计', left: 'left' },
        tooltip: { trigger: 'item' },
        // legend: { orient: 'vertical', left: 'left' },
        series: [{ type: 'pie', data: this.keywordData.data, radius: '60%' }]
      }
      this.keywordData.chart.setOption(this.keywordData.option)
    },

    /* 获取所要展示的数据 */
    // 获取新增加的博客
    async getNewBlog () {
      const query = {
        page: 1,
        pagesize: 3
      }
      // 获取数据库中最新增加的三条博客数据
      const { dataInfo } = await apiGetBlogList(query)
      this.newBlog.data = dataInfo.rows.map(e => {
        return {
          value: e.visited,
          name: e.title
        }
      })
    },
    async getKeywordData () {
      const { dataInfo } = await apiGetKeyword()
      const keys = Object.keys(dataInfo)
      this.keywordData.data = keys.map((e) => {
        return {
          value: dataInfo[e],
          name: e
        }
      })
    }
  }

}
</script>

<style lang="less" scoped>
.dashboard{
    // ! 这里不固定页脚
    // height: 83vh;
    // overflow: scroll;
}
.item-inner{
    background: rgba(0, 255, 64, 0.46);
    width: 100%;
    height: 100%;
}
</style>

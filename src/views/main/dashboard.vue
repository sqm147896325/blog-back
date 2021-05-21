<template>
    <div class="dashboard">
        <div id="new-blog" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>
import { apiGetBlogList } from '@/api/blog.js'
import * as echarts from 'echarts' // 引入echarts
export default {
    name: 'Dashboard',
    data() {
        return {
            // 新增博客相关
            newBlog: {
                chart: {},
                option: {},
                data: []
            }
        }
    },
    async mounted() {
        await this.init()
    },
    methods: {
        // 初始化
        async init() {
            await this.getNewBlog()
            this.charts()
            console.log('获取data中的数据', this.$data)
        },

        /* 图表相关 */
        // 获取需要渲染的图表
        getCharts() {
            this.newBlog.chart = echarts.init(document.getElementById('new-blog'))
        },
        // 配置信息设置
        setCharts() {
            // 图表对应的配置
            this.newBlog.option = {
                title: {
                    text: '近日新增博客',
                    subtext: '访问次数',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '新增博客',
                        type: 'pie',
                        radius: '50%',
                        data: this.newBlog.data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        },
        mountCharts() {
            // 使用刚指定的配置项和数据显示图表。
            this.newBlog.chart.setOption(this.newBlog.option);
        },
        // 图表设置流程
        charts() {
            this.getCharts()
            this.setCharts()
            this.mountCharts()
        },


        /* 获取所要展示的数据 */
        // 获取新增加的博客
        async getNewBlog() {
            let query = {
                page: 1,
                pagesize: 3
            }
            // 获取数据库中最新增加的三条博客数据
            let { dataInfo } = await apiGetBlogList(query)
            console.log('',dataInfo)
            this.newBlog.data = dataInfo.rows.map(e => {
                return {
                    value: e.visited,
                    name: e.title
                }
            })
            console.log(this.newBlog.data)
        }
    }
    
}
</script>

<style lang="less" scoped>
    
</style>
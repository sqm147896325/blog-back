import { mount } from '@vue/test-utils'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css' // 导入全局样式

import TableFormat from '../src/components/TableFormat/TableFormat.vue'

describe('TableFormat', () => {
  it('组件挂载', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
          { field: 'author_id', cname: '作者id', cshow: true, align: 'center', showname: '作者id', clock: false, width: 80 },
          { field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false, width: 160 },
          { field: 'keyword', cname: '关键字', cshow: true, align: 'center', showname: '关键字', clock: false, width: 160 },
          { field: 'lenght', cname: '字数', cshow: true, align: 'center', showname: '字数', clock: false, width: 160 },
          { field: 'visited', cname: '访问次数', cshow: true, align: 'center', showname: '访问次数', clock: false, width: 160 },
          { field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width: 'auto' },
          { field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width: 'auto' },
          { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width: 270 }
        ]
      }
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('确定方法', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
          { field: 'author_id', cname: '作者id', cshow: true, align: 'center', showname: '作者id', clock: false, width: 80 },
          { field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false, width: 160 },
          { field: 'keyword', cname: '关键字', cshow: true, align: 'center', showname: '关键字', clock: false, width: 160 },
          { field: 'lenght', cname: '字数', cshow: true, align: 'center', showname: '字数', clock: false, width: 160 },
          { field: 'visited', cname: '访问次数', cshow: true, align: 'center', showname: '访问次数', clock: false, width: 160 },
          { field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width: 'auto' },
          { field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width: 'auto' },
          { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width: 270 }
        ]
      }
    })

    wrapper.vm.$nextTick(() => {
      // 模拟点击确定按钮
      wrapper.find('.format-row button:nth-child(1)').trigger('click')

      // 检查是否触发了setTableOption事件
      expect(wrapper.emitted('setTableOption')).toBeTruthy()

      // 检查是否触发了update:modelValue事件
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  it('重置方法', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
          { field: 'author_id', cname: '作者id', cshow: true, align: 'center', showname: '作者id', clock: false, width: 80 },
          { field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false, width: 160 },
          { field: 'keyword', cname: '关键字', cshow: true, align: 'center', showname: '关键字', clock: false, width: 160 },
          { field: 'lenght', cname: '字数', cshow: true, align: 'center', showname: '字数', clock: false, width: 160 },
          { field: 'visited', cname: '访问次数', cshow: true, align: 'center', showname: '访问次数', clock: false, width: 160 },
          { field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width: 'auto' },
          { field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width: 'auto' },
          { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width: 270 }
        ]
      }
    })

    wrapper.vm.$nextTick(() => {
      // 修改数据
      wrapper.vm.tableData = [{ cname: 'Name 1', cshow: false }]

      // 模拟点击重置按钮
      wrapper.find('.format-row button:nth-child(2)').trigger('click')

      // 检查数据是否重置成功
      expect(wrapper.vm.tableData).toEqual([
        { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
        { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
        { field: 'author_id', cname: '作者id', cshow: true, align: 'center', showname: '作者id', clock: false, width: 80 },
        { field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false, width: 160 },
        { field: 'keyword', cname: '关键字', cshow: true, align: 'center', showname: '关键字', clock: false, width: 160 },
        { field: 'lenght', cname: '字数', cshow: true, align: 'center', showname: '字数', clock: false, width: 160 },
        { field: 'visited', cname: '访问次数', cshow: true, align: 'center', showname: '访问次数', clock: false, width: 160 },
        { field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width: 'auto' },
        { field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width: 'auto' },
        { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width: 270 }
      ])
    })
  })

  // 其他测试用例...
})

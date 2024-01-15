import { mount } from '@vue/test-utils'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css' // 导入全局样式

import TableFormat from '../src/components/TableFormat/TableFormat.vue'

describe('TableFormat 组件测试', () => {
  it('组件挂载', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
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
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
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
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
        ]
      }
    })

    wrapper.vm.$nextTick(() => {
      // 修改数据
      wrapper.vm.tableData = [[
        { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
        { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 }
      ]]

      // 模拟点击重置按钮
      wrapper.find('.format-row button:nth-child(2)').trigger('click')

      // 检查数据是否重置成功
      expect(wrapper.vm.tableData).toEqual([
        { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
        { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
      ])
    })
  })
})

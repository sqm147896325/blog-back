import { mount } from '@vue/test-utils'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css' // 导入全局样式

import TableFormat from '../src/components/TableFormat/TableFormat.vue'

describe('TableFormat', () => {
  it('renders correctly', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      }
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits setTableOption event', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      }
    })

    // 模拟点击确定按钮
    wrapper.find('.format-row button:nth-child(1)').trigger('click')

    // 检查是否触发了setTableOption事件
    expect(wrapper.emitted('setTableOption')).toBeTruthy()
  })

  it('emits update:modelValue event', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      }
    })

    // 模拟点击确定按钮
    wrapper.find('.format-row button:nth-child(1)').trigger('click')

    // 检查是否触发了update:modelValue事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('resets data on reset button click', () => {
    const wrapper = mount(TableFormat, {
      global: {
        plugins: [ElementPlus, ElementPlusIconsVue]
      }
    })

    // 修改数据
    wrapper.vm.tableData = [{ cname: 'Name 1', cshow: false }]

    // 模拟点击重置按钮
    wrapper.find('.format-row button:nth-child(2)').trigger('click')

    // 检查数据是否重置成功
    expect(wrapper.vm.tableData).toEqual([])
  })

  // 其他测试用例...
})

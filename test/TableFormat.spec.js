import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'

import TableFormat from '../src/components/TableFormat/TableFormat.vue'

describe('TableFormat 组件测试', () => {
  it('组件挂载', async () => {
    const wrapper = await mount(TableFormat, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: true, // 渲染出来需要耗时，vitest无法准确感知
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
        ]
      }
    })

    // 防止 modelValue 未渲染，赋值做等待使用
    await wrapper.setProps({
      tableOption: [
        { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
        { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
      ]
    })

    expect(wrapper.text()).toContain('格式')
    expect(wrapper.get('.format-row').text()).toContain('确定', '重置')
    expect(wrapper.text()).toContain('标题')
  })

  it('确定方法', async () => {
    const wrapper = await mount(TableFormat, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
        ]
      }
    })

    // 模拟点击确定按钮
    await wrapper.get('.format-row button:nth-child(1)').trigger('click')

    // 检查是否触发了setTableOption事件
    const setTableOption = wrapper.emitted('setTableOption')
    expect(setTableOption).toBeTruthy()
    // setTableOption 第一次触发 的 第一个返回值
    expect(setTableOption[0][0]).toEqual([
      { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
      { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
    ])

    // 检查是否触发了update:modelValue事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('重置方法', async () => {
    const wrapper = await mount(TableFormat, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
        ]
      }
    })

    // // 修改数据
    // await wrapper.setProps({
    //   tableOption: [
    //     { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 },
    //     { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 }
    //   ]
    // })

    // expect(wrapper.vm.tableData.map(e => e.cname)).toEqual(['作者名', '标题'])

    // 模拟点击重置按钮
    await wrapper.get('.format-row button:nth-child(2)').trigger('click')

    // 检查数据是否重置成功
    expect(wrapper.vm.tableData.map(e => e.cname)).toEqual(['标题', '作者名'])
  })
})

import { mount } from '@vue/test-utils'
import TableFormat from '@/components/TableFormat/TableFormat.vue'

test('mount component', async () => {
  expect(TableFormat).toBeTruthy()

  const wrapper = mount(TableFormat, {
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

  expect(wrapper.text()).toContain('4 x 2 = 8')
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.get('button').trigger('click')

  expect(wrapper.text()).toContain('4 x 3 = 12')

  await wrapper.get('button').trigger('click')

  expect(wrapper.text()).toContain('4 x 4 = 16')
})

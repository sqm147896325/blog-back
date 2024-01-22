/// <reference types="Cypress" />
import TableFormat from './TableFormat.vue'

describe('<TableFormat />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.viewport(1024, 768)

    cy.mount(TableFormat, {
      propsData: {
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
  })

  it('重置方法', () => {
    cy.mount(TableFormat, {
      propsData: {
        modelValue: true,
        tableOption: [
          { field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width: 180 },
          { field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width: 100 }
        ]
      }
    })

    cy.get('tbody > :nth-child(1) > .el-table_2_column_8 > .cell')
      .contains('标题')
      .should('exist')

    cy.get(':nth-child(1) > .el-table_2_column_12 > .cell > .el-checkbox')
      .click()

    cy.contains('下移')
      .click()

    cy.get('tbody > :nth-child(1) > .el-table_2_column_8 > .cell')
      .contains('作者名')
      .should('exist')

    cy.contains('重置')
      .click()

    cy.get('tbody > :nth-child(1) > .el-table_2_column_8 > .cell')
      .contains('标题')
      .should('exist')
  })
})

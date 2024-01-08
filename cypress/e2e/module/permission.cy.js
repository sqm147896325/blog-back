/// <reference types="Cypress" />

// 获取环境变量的值
const visitUrl = Cypress.env('visitUrl')

describe('权限测试', () => {
  beforeEach(() => {
    cy.visit(visitUrl)

    // 获取并输入测试用户用户名
    cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('10001')

    // 获取并输入测试用户密码
    cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('111111')

    // 点击登录按钮
    cy.get('.el-button')
      .click()

    // 确认跳转到了首页
    cy.location('pathname').should('eq', '/page/back/dashboard')

    // 设置本地存储
    cy.window().then((win) => {
      win.localStorage.setItem('token', win.localStorage.getItem('token'))
      win.localStorage.setItem('userInfo', win.localStorage.getItem('userInfo'))
    })
  })

  it('新增用户逻辑', () => {
    cy.visit(`${visitUrl}/manage/user`)

    cy.get('.el-input-group > :nth-child(2)').type('test2')

    cy.contains('搜索').click()

    cy.contains('添加').click()

    cy.wait(1000)

    cy.get('.el-form').within(() => {
      cy.get('.el-form-item .el-input__wrapper input').eq(0).type('test2')
      cy.get('.el-form-item .el-input__wrapper input').eq(1).type('111111')
      cy.contains('确定').click()
    })

    let username
    // 获取特定行的数据，暂存用户名
    cy.get('.el-table__inner-wrapper')
      .contains('tr', 'test2')
      .find('td')
      .eq(1)
      .invoke('text')
      .then(res => {
        username = res
      })

    // 获取特定行的数据，暂存用户名
    cy.get('.el-table__inner-wrapper')
      .contains('tr', 'test2')
      .within(() => {
        cy.contains('修改权限').click()
      })

    cy.get('[data-key="application"] .el-checkbox').eq(0).click()

    cy.get('.el-dialog__footer').contains('确定').click()

    // 登出，换新添加的用户来登录
    cy.get('.dropdown-head.el-tooltip__trigger.el-tooltip__trigger .el-icon')
      .trigger('mouseenter')

    cy.contains('登出').click()

    // 输入新添加的测试用户用户名
    cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__wrapper')
      .then($el => {
        cy.wrap($el).type(username)
      })

    // 新添加的测试用户密码
    cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('111111')

    // 点击登录按钮
    cy.get('.el-button')
      .click()

    // 确认跳转到了首页
    cy.location('pathname').should('eq', '/page/back/dashboard')

    cy.wait(1000)

    cy.visit(`${visitUrl}/application/app-list`)

    // 可以正常跳转其他页面
    cy.location('pathname').should('eq', '/page/back/application/app-list')

    cy.get('.view').contains('appList').should('exist')
  })

  it('删除用户逻辑', () => {
    cy.visit(`${visitUrl}/manage/user`)

    cy.get('.el-input-group > :nth-child(2)').type('test2')

    cy.contains('搜索').click()

    // 获取特定行的数据，进行删除
    cy.get('.el-table__inner-wrapper')
      .contains('tr', 'test2')
      .within(() => {
        cy.contains('删除').click()
      })

    cy.contains('确定').click()

    // 断言不存在
    cy.get('.el-table__inner-wrapper')
      .contains('tr', 'test2')
      .should('not.exist')
  })
})

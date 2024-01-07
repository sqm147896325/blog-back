/// <reference types="Cypress" />

// 获取环境变量的值
const visitUrl = Cypress.env('visitUrl')

describe('ai助手测试', () => {
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

  it('正确用户名密码登录', () => {
    cy.visit(`${visitUrl}`)
  })
})

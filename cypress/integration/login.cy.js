/// <reference types="Cypress" />
import crypto from 'crypto-js'
// 获取环境变量的值
const visitUrl = Cypress.env('visitUrl')
const apiUrl = Cypress.env('apiUrl')

describe('登录测试', () => {
  it('正确用户名密码登录', () => {
    cy.visit(visitUrl)

    cy.location('pathname').should('eq', '/page/back/login')

    // 获取并输入测试用户用户名
    cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('10001')

    // 获取并输入测试用户密码
    cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('111111')

    // 点击登录按钮
    cy.get('.el-button')
      .click()

    // 定位到首页
    cy.location('pathname').should('eq', '/page/back/dashboard')
  })

  it('错误的用户名密码登陆', () => {
    cy.visit(visitUrl)

    cy.location('pathname').should('eq', '/page/back/login')

    // 获取并输入测试用户用户名
    cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('10001')

    // 获取并输入测试用户密码
    cy.get(':nth-child(2) > .el-form-item__content > .el-input > .el-input__wrapper')
      .type('222222')

    // 点击登录按钮
    cy.get('.el-button')
      .click()

    // 登陆失败提示
    cy.get('.el-message__content')
      .should('have.text', '账号密码错误')
  })

  it('授权免登陆', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        id: '10001',
        password: crypto.MD5('111111').toString()
      }
    }).then(res => {
      const token = res.body.dataInfo.token
      cy.visit(`${visitUrl}/login?token=${token}`)
      cy.location('pathname').should('eq', '/page/back/dashboard')
    })
  })
})

/// <reference types="Cypress" />
describe('登录测试', () => {
  it('正确用户名密码登录', () => {
    cy.visit('http://localhost:3000/api/file/fileLink?fileId=015f66a0ad3711eea1698b7b58ed5be0&user_id=10001')
  })
})

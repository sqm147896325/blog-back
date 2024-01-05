describe('登录测试', () => {
  it('正确用户名密码登录', () => {
    cy.visit('http://localhost:3000')

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
})

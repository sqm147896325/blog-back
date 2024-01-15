/// <reference types="Cypress" />

// 获取环境变量的值
const visitUrl = Cypress.env('visitUrl')

describe('网盘测试', () => {
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

  it('网盘上传', () => {
    cy.visit(`${visitUrl}/application/network-disk`)

    cy.contains('上传').click()

    cy.contains('点击上传').click()

    // 上传文件
    cy.fixture('image.jpeg').then(fileContent => {
      cy.get('input[type="file"]').then(el => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg')
        const file = new File([blob], 'image.jpeg', { type: 'image/jpeg' })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        el[0].files = dataTransfer.files
        cy.wrap(el).trigger('change', { force: true })
      })
    })

    cy.get('tbody').its('length')

    cy.contains('上传至此').click()

    // 断言 table 元素存在
    cy.get('.el-table').should('exist')

    // 断言 table 比之前多一行
    cy.get('.el-table__body .el-table__row').should('have.length.gt', 0)
  })

  it('网盘预览', () => {
    cy.visit(`${visitUrl}/application/network-disk`)

    // 注册新页面打开监听
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })

    // 点击预览
    cy.contains('预览').eq(0).click()

    // 检测 window.open 被调用，并验证url是否可以正常加载
    cy.get('@windowOpen').should('be.called').then((args) => {
      const [path] = args.lastCall.args // 获取第一个参数 —— 跳转的path
      cy.url().then(url => {
        const previewURL = new URL(url).origin + path
        cy.request(previewURL).then((response) => {
          expect(response.status).to.eq(200) // 检查响应状态码是否为 200
        })
      })
    })
  })

  it('网盘单行下载', () => {
    cy.visit(`${visitUrl}/application/network-disk`)

    // 断言 table 有行
    cy.get('.el-table__body .el-table__row').should('have.length.gt', 0)

    cy.get('tbody > :nth-child(1) > .el-table_1_column_1 > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
      .click()

    // 注册新页面打开监听
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.contains('下载').click()

    // 检测 window.open 被调用，并验证url是否可以正常加载
    cy.get('@windowOpen').should('be.called').then((args) => {
      const [path] = args.lastCall.args // 获取第一个参数 —— 跳转的path
      cy.url().then(url => {
        const previewURL = new URL(url).origin + path
        cy.request(previewURL).then((response) => {
          expect(response.status).to.eq(200) // 检查响应状态码是否为 200
        })
      })
    })
  })

  it('网盘单个删除', async () => {
    cy.visit(`${visitUrl}/application/network-disk`)

    // 断言 table 有行
    cy.get('.el-table__body .el-table__row').should('have.length.gt', 0)

    cy.get('tbody').its('length').then(length => {
      cy.get('tbody > :nth-child(1) > .el-table_1_column_1 > .cell > .el-checkbox > .el-checkbox__input > .el-checkbox__inner')
        .click()

      cy.contains('删除').click()

      // 断言 table 元素存在
      cy.get('.el-table').should('exist')

      // 断言 table 比之前少一行
      cy.get('.el-table__body .el-table__row').should('have.length', length - 1)
    })
  })
})

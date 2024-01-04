describe('测试', () => {
  it('访问', () => {
    cy.visit('http://localhost:3000')

    cy.location('pathname').should('eq', '/page/back/login')
  })
})

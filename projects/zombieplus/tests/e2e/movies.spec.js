const { test, expect } = require('@playwright/test')

const { LoginPage } = require('../pages/LoginPage')
const { MoviesPage } = require('../pages/MoviesPage')
const { Toast } = require('../pages/Components')

let loginPage
let moviesPage
let toast

test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page)
    moviesPage = new MoviesPage(page)
    toast = new Toast(page)
})

test('deve pode cadastrar um novo filme', async ({ page }) => {

    //  é importante estar logado para poder cadastrar um filme, então vamos fazer o login antes de tudo

    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()
})



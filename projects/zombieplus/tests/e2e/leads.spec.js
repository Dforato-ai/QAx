
const { test, expect } = require('@playwright/test')
const { faker } = require('@faker-js/faker')
const { LandingPage } = require('../pages/LandingPage')
const { Toast } = require('../pages/Components')

// import { log } from 'node:console'
  
let landingPage
let toast

test.beforeEach(({ page }) => {
  landingPage = new LandingPage(page)
  toast = new Toast(page)
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await toast.haveText(message)

})

test('não deve cadastrar quando o email já exite', async ({ page,request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })
  expect(newLead.ok()).toBeTruthy() 



  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, leadEmail)
  
  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'

  await toast.haveText(message)

})

test('não deve cadastrar com email incorreto', async ({ page }) => {
  const landingPage = new LandingPage(page)
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm("fernando papito", "papitomail.com.br")


  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click()

  await landingPage.alertHaveText('Email incorreto')

})

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page)
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm("", "papito@hotmail.com.br")
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click()

  await landingPage.alertHaveText('Campo obrigatório')

})

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page)
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm("fernando papito", "")
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click()

  await landingPage.alertHaveText('Campo obrigatório')

})

test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page)
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm("", "")


  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click()

  await landingPage.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])

})



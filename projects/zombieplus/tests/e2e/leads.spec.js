// @ts-check
const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../pages/LandingPage');

import { log } from 'node:console';

test('deve cadastrar um lead na fila de espera', async ({ page }) => {  
  const landingPage = new LandingPage(page);
  await landingPage.visit();
  await landingPage.openLeadModal();    
  await landingPage.submitLeadForm("fernando papito", "papito@hotmail.com.br");

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  
  await landingPage.toastHaveText(message);
 
});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.visit();
  await landingPage.openLeadModal();    
  await landingPage.submitLeadForm("fernando papito", "papitomail.com.br");


  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await landingPage.alertHaveText('Email incorreto')

});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.visit();
  await landingPage.openLeadModal();    
  await landingPage.submitLeadForm("", "papito@hotmail.com.br");
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await landingPage.alertHaveText('Campo obrigatório')

});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.visit();
  await landingPage.openLeadModal();    
  await landingPage.submitLeadForm("fernando papito", "");
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await landingPage.alertHaveText('Campo obrigatório')

});

test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.visit();
  await landingPage.openLeadModal();    
  await landingPage.submitLeadForm("", "");

    
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await landingPage.alertHaveText([
  'Campo obrigatório',
  'Campo obrigatório'
  ])

});



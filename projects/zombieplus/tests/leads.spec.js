// @ts-check
import { test, expect } from '@playwright/test';
import { log } from 'node:console';

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByRole('button', { name: /Aperte o play/ }).click()

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.getByPlaceholder('Informe seu nome').fill("fernando papito")
  await page.getByPlaceholder('Informe seu email').fill('papito@hotmail.com')


  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await page.getByText('seus dados conosco').click()
  const vcontent = await page.content()
  console.log(vcontent)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  await expect(page.locator('.toast')).toHaveText(message)
  await expect(page.locator('.toast')).toBeHidden({timeout: 5000})

});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByRole('button', { name: /Aperte o play/ }).click()

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.getByPlaceholder('Informe seu nome').fill("fernando papito")
  await page.getByPlaceholder('Informe seu email').fill('papito.com.br')

  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await expect(page.locator('.alert')).toHaveText('Email incorreto')


});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.getByRole('button', { name: /Aperte o play/ }).click()

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

 
  await page.getByPlaceholder('Informe seu email').fill('papito@yahoo.com.br')

  await page.getByTestId('modal')
    .getByText('Quero entrar na fila').click ()

  await expect(page.locator('.alert')).toHaveText('Email incorreto')


});

const { expect } = require('@playwright/test')

export class MoviesPage {
    
    constructor(page) {
        this.page = page
    }


    async isLoggedIn() {
        //     const logout = this.page.locator('.logout')
        //     await expect(logout).toBeVisible()
        await this.page.waitForLoadState('networkidle')
        await expect(this.page).toHaveURL(/admin/)
    }
}
const {describe, it, before, after} = require('mocha')
const path = require('path')
const express = require('express')
const webdriver = require('selenium-webdriver')
const {Eyes} = require('eyes.selenium')
require('chromedriver')

const {By, until} = webdriver

describe('calculator app visual test', function () {
  let driver
  let server

  this.timeout(60000)

  before((done) => {
    const app = express()
    app.use('/', express.static(path.resolve(__dirname, '../../dist')))
    server = app.listen(8080, done)
  })
  after(() => {
    server.close()
  })

  before(async () => {
    driver = await new webdriver.Builder()
      .forBrowser('chrome')
      .build()
  })
  after(async () => await driver.quit())

  let eyes
  before(async () => {
    eyes = new Eyes()

    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setBatch(null, process.env.APPLITOOLS_BATCH_ID)

    await eyes.open(driver, 'Calculator App', 'Calculator App: E2E', {width: 800, height: 600})
  })

  after(async () => {
    await eyes.close()
  })

  it('should look beatiful', async function () {
    await driver.get('http://localhost:8080')

    await driver.wait(until.elementLocated(By.css('.display')), 5000)

    await eyes.checkWindow('before calculation')

    const digit4Element = await driver.findElement(By.css('.digit-4'))
    const digit2Element = await driver.findElement(By.css('.digit-2'))
    const operatorMultiply = await driver.findElement(By.css('.operator-multiply'))
    const operatorEquals = await driver.findElement(By.css('.operator-equals'))

    await digit4Element.click()
    await digit2Element.click()
    await operatorMultiply.click()
    await digit2Element.click()
    await operatorEquals.click()

    await eyes.checkWindow('after calculation')
  })
})

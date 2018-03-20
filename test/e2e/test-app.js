const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const express = require('express')
const webdriver = require('selenium-webdriver')
require('chromedriver')

const {By, until} = webdriver

describe('calculator app', function () {
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

  it('should work', async function () {
    await driver.get('http://localhost:8080')

    await driver.wait(until.titleIs('Calculator'))

    await driver.wait(until.elementLocated(By.css('.display')), 5000)

    const displayElement = await driver.findElement(By.css('.display'))

    expect(await displayElement.getText()).to.equal('0')

    const digit4Element = await driver.findElement(By.css('.digit-4'))
    const digit2Element = await driver.findElement(By.css('.digit-2'))
    const operatorMultiply = await driver.findElement(By.css('.operator-multiply'))
    const operatorEquals = await driver.findElement(By.css('.operator-equals'))

    await digit4Element.click()
    await digit2Element.click()
    await operatorMultiply.click()
    await digit2Element.click()
    await operatorEquals.click()

    await driver.wait(until.elementTextIs(displayElement, '84'), 5000)
  })
})

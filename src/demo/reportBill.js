/**
 * @file Given an order id and record id, retrieve the items and calculate the fees
 *
 * @copyright Laurie Reynolds 2016
 */
var util = require('util')


import {dataStoreManager} from '../appServer/managers/dataStoreManager'
import {properties} from '../appServer/utils/properties'

function printBillHeading(tableID, bill) {
  bill += '==========================\n'
  bill += '      Table:  ' + tableID + '\n\n'

  return bill
}

function printDinerHeading(dinerID, bill) {
  bill += 'Diner ' + dinerID + '\n'

  return bill
}

function printMenuItem(name, price, bill) {
  // Print out the menu item
  var padding = 20 - name.length
  for (var ppp = 0; ppp < padding; ppp++) {
    bill += ' '
  }

  bill +=  name+ '   $ ' + util.format('%d', (price).toFixed(2)) + '\n'

  return bill
}

function printDinerAmounts(subTotal, taxAmount, tipAmount, taxPercentage, tipPercentage, total, bill) {
  bill += '                  ---------\n'
  bill += '            Subtotal     $ ' + subTotal + '\n'
  bill += '            Tax (' + taxPercentage + ' %)   $ ' + (taxAmount).toFixed(2) + '\n'
  bill += '            Tip (' + tipPercentage +  ' %)    $ ' + (tipAmount).toFixed(2) + '\n'
  bill += '                  ----------\n'
  bill += '            Total: $ ' + (total).toFixed(2) + '\n'

  return bill
}

function printOrderAmounts(subTotal, taxAmount, tipAmount, taxPercentage, tipPercentage, total, bill) {
  bill += '----------------------------------------------------\n'
  bill += '                      Subtotal     $ ' + subTotal + '\n'
  bill += '                      Tax (' + taxPercentage + ' %)   $ ' + (taxAmount).toFixed(2) + '\n'
  bill += '                      Tip (' + tipPercentage +  ' %)    $ ' + (tipAmount).toFixed(2) + '\n'
  bill += '                                 ----------\n'
  bill += '                      Total: $ ' + (total).toFixed(2) + '\n'

  return bill
}

/**
 *
 * @param tableID
 * @returns {number}
 */
export function reportBill (menuID, tableID) {

  var _dataStoreManager = dataStoreManager.getInstance()
  var menu = _dataStoreManager.getData(menuID, properties.menuSettings)

  var order = _dataStoreManager.getData(tableID, properties.orderSettings )
  order.tipPercentage = menu.tipPercentage
  order.taxPercentage = menu.taxPercentage

  var bill = ''

  bill = printBillHeading(tableID, bill)

  for (var i = 0; i < order.numDiners; i++) {

    var dinerID = i + 1

    var diner = _dataStoreManager.getData(tableID, dinerID)

    bill = printDinerHeading(dinerID, bill)

    for (var j = 0; j < diner.dishes.length; j++) {

      var dishName = diner.dishes[j]
      var menuItem = _dataStoreManager.getData(menuID, dishName)

      bill = printMenuItem(menuItem.name, menuItem.price, bill)
    }

    bill = printDinerAmounts(diner.subTotal, diner.taxAmount,  diner.tipAmount, order.taxPercentage, order.tipPercentage, diner.total, bill)

  }

  bill = printOrderAmounts(order.subTotal, order.taxAmount,  order.tipAmount, order.taxPercentage, order.tipPercentage, order.total, bill)


  console.log(bill)
}


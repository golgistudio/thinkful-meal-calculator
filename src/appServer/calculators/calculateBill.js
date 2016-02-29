/**
 * @file Given an order id and record id, retrieve the items and calculate the fees
 *
 * @copyright Laurie Reynolds 2016
 */

import {dataStoreManager} from '../managers/dataStoreManager'
import {properties} from '../utils/properties'

/**
 *
 * @param tableID
 * @returns {number}
 */
export function calculateBill (menuID, tableID) {

  // Get the menu settings for the tip and tax percentage
  var _dataStoreManager = dataStoreManager.getInstance()
  var menu = _dataStoreManager.getData(menuID, properties.menuSettings)

  var order = _dataStoreManager.getData(tableID, properties.orderSettings )
  order.tipPercentage = menu.tipPercentage
  order.taxPercentage = menu.taxPercentage

  var orderSubTotal = 0

  for (var i = 0; i < order.numDiners; i++) {

    // Get the diner
    var dinerID = i + 1
    var diner = _dataStoreManager.getData(tableID, dinerID)

    var subTotal = 0

    // Calculate the subtotal for the diner
    for (var j = 0; j < diner.dishes.length; j++) {
      var dishName = diner.dishes[j]
      var menuItem = _dataStoreManager.getData(menuID, dishName)
      subTotal += menuItem.price
    }

    // Add to the order subtotal
    orderSubTotal += subTotal

    // Calculate the amounts for the diner
    diner.subTotal = subTotal
    diner.taxAmount = diner.subTotal * (menu.taxPercentage/100)
    diner.tipAmount = diner.subTotal * (menu.tipPercentage/100)
    diner.total = diner.subTotal + diner.taxAmount + diner.tipAmount

    // Store the updated diner
    _dataStoreManager.setData(tableID, dinerID, diner)

  }

  // Calculate amounts for the order
  order.subTotal = orderSubTotal
  order.taxAmount = orderSubTotal * (menu.taxPercentage/100)
  order.tipAmount = orderSubTotal * (menu.tipPercentage/100)

  order.total = order.subTotal + order.taxAmount + order.tipAmount

  // Store the update order
  _dataStoreManager.setData(tableID, properties.orderSettings, order)

}


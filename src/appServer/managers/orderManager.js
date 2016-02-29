/**
 * @file
 * @description Manage records: read from json and validate
 *
 * @copyright Laurie Reynolds 2016
 *
 */

import {dataStoreManager} from './dataStoreManager'
import {generateUUID} from '../utils/generateUUID'
import {properties} from '../utils/properties'
import {OrderSettings, Diner} from '../model/order'

/**
 *
 * @type {{getInstance}}
 */
export var orderManager = (function () {
  'use strict'

  // Instance stores a reference to the Singleton
  var instance

  // ToDo - This should archive the current order for the table
  function createOrder(parameters) {

    var orderData = parameters.order

    // Create and store the menu settings
    var order = new OrderSettings()

    order.tableNumber = orderData.tableNumber
    order.numDiners = orderData.numDiners

    dataStoreManager.getInstance().setData(order.tableNumber, properties.orderSettings, orderData)

    // Initialize the diners
    for (var i = 0; i < order.numDiners; i++) {
      var diner = new Diner()
      diner.dinerID = i + 1
      diner.tableNumber = order.tableNumber
      diner.dishes = []

      dataStoreManager.getInstance().setData(order.tableNumber, diner.dinerID, diner)
    }

    return {
      error: properties.noError
    }
  }

  function addToOrder(parameters) {

    // Get the input data - collection of diners with a collection of dishes ordered
    var orderData = parameters.order
    var tableNumber = orderData.tableNumber
    var diners = orderData.diners

    // Loop through all the diners and add the dishes that they ordered
    var arrayLength = diners.length
    for (var i = 0; i < arrayLength; i++) {
      var dinerItem = diners[i]

      // Retrieve the diner's current order
      var diner = dataStoreManager.getInstance().getData(tableNumber, parseInt(dinerItem.dinerID))

      if (typeof diner.dishes === undefined) {
        diner.dishes = []
      }

      // Loop through the new dishes to add and add them to the diner
      var length = dinerItem.dishes.length
      for (var j = 0; j < length; j++) {
        var dishItem = dinerItem.dishes[j]

        diner.dishes.push(dishItem.name)
      }

      // Update the datstore with the updated diner information
      dataStoreManager.getInstance().setData(tableNumber, parseInt(diner.dinerID), diner)
    }

    return {
      error: properties.noError
    }
  }

  function processOrder(parameters) {
    var orderData = parameters.data

    var length = orderData.length

    for (var i= 0; i < length; i++) {
      var orderItem = orderData[i]

      switch (orderItem.command) {
        case properties.createOrder:
          var params = {
            order: orderItem.data
          }

          createOrder(params)
          break
        case properties.addToOrder:
          var params = {
            order : orderItem.data
          }
          addToOrder(params)
          break
      }
    }
    return {
      error: properties.noError
    }
  }


  /**
   *
   * @returns {{orderInterface: orderInterface}}
   */

  function init() {
    return {
      orderInterface: function (request, parameters) {
        var results = {
          error: properties.noResults
        }
        switch (request) {
          case properties.createOrder :
            results = createOrder(parameters)
            break
          case properties.addToOrder:
            results = addToOrder(parameters)
            break
          case properties.processOrder:
            results = processOrder(parameters)
            break
        }

        return results
      }
    }
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if (!instance) {
        instance = init()
      }
      return instance
    }
  }
})()

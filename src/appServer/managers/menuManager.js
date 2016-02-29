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
import {MenuSettings, Dish} from '../model/menu'

/**
 *
 * @type {{getInstance}}
 */
export var menuManager = (function () {
  'use strict'

  // Instance stores a reference to the Singleton
  var instance

  function createMenu(parameters) {

    var menuID = generateUUID()

    var menuData = parameters.menu

    // Create and store the menu settings
    var menuSettings = new MenuSettings()

    menuSettings.taxPercentage = parseFloat(menuData.taxPercentage)
    menuSettings.tipPercentage = parseFloat(menuData.tipPercentage)
    menuSettings.menuID = menuID

    dataStoreManager.getInstance().setData(menuID, properties.menuSettings, menuSettings)

    // Create and store the dishes.  Dish names must be unique
    var dishesData = menuData.dishes

    var arrayLength = dishesData.length
    for (var i = 0; i < arrayLength; i++) {
      var data = dishesData[i]
      var dishItem = new Dish()

      dishItem.name = data.name
      dishItem.category = data.category
      dishItem.price = parseFloat(data.price)
      dishItem.description = data.description

      dataStoreManager.getInstance().setData(menuID, dishItem.name, dishItem)
    }

    return {
      data: menuID,
      error: properties.noError
    }
  }


  /**
   *
   * @returns {{menuInterface: menuInterface}}
   */

  function init() {
    return {
      menuInterface: function (request, parameters) {
        var results = {
          error: properties.noResults
        }
        switch (request) {
          case properties.createMenu :
            results = createMenu(parameters)
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

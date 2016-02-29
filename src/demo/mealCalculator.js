/**
 * @file Demo application for reporting fees given a record definition and orders files
 *
 * @copyright Laurie Reynolds 2016
 */

//var commandLineUsage = require('command-line-usage')
//var commandLineArgs = require('command-line-args')
var fs = require('fs')
var async = require('async')

import {properties} from '../appServer/utils/properties'
import {initializeMenu} from '../appServer/bootstrap/initializeMenu'
import {orderManager} from '../appServer/managers/orderManager'
import {calculateBill} from '../appServer/calculators/calculateBill'
import {reportBill} from './reportBill'


function displayHelp() {
  const optionDefinitions = [
    {name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide'},
    {name: 'orders', type: String, multiple: false, alias: 'o',
      description: 'The input file containing orders to process.  JSON file'},
    {name: 'menu', type: String, multiple: false, alias: 'r',
      description: 'The input file containing menu definitions.  JSON file'}
  ]
  /* eslint-disable max-len */
  const options = {
    title: 'Menu Calculator',
    description: 'Demo app to create a bill for a restaurant order',
    synopsis: [
      '> node wrapper.js -o {file including full path} -m {file including full path}'
    ],
    footer: 'Github project: https://github.com/golgistudio/records-demo'
  }

  console.log(options.title)
  console.log(options.description)
  console.log(options.synopsis)

  for (var i = 0; i < optionDefinitions.length; i++) {
    var element = optionDefinitions[i]
    console.log (element.name + ': ' + element.alias + '      ' + element.description)
  }
}

/**
 * @function
 * @description Process the command line parameters
 * @returns {*} input options
 */
function getInputParameters () {

  /* eslint-enable max-len */
  try {

    var inputOptions = []
    var helpNeeded = false

    var args = process.argv.slice(2)
    for (var i = 0; i < args.length; i++) {
      var val = args[i]

      var next = i+1
      switch (val) {
        case '-o':
            if (next < args.length) {
              inputOptions[properties.ordersKey] = args[next]
            }
          break;
        case '-m' :
            if (next < args.length) {
              inputOptions[properties.menuKey] = args[next]
            }
          break;
        case '-h':
          helpNeeded = true
          break;
      }
    }

    if (Object.keys(inputOptions).length < 2) {
      helpNeeded = true
    }

    if (!(inputOptions.hasOwnProperty(properties.ordersKey)) || !(inputOptions.hasOwnProperty(properties.menuKey))) {
      helpNeeded = true
    }

    if (!helpNeeded) {
      // check if the file exists
      fs.accessSync(inputOptions[properties.ordersKey], fs.R_OK)
      fs.accessSync(inputOptions[properties.menuKey], fs.R_OK)
    } else {
      displayHelp()
    }

    // return the options
    return {
      'inputOptions': inputOptions,
      'error': helpNeeded
    }
  } catch (err) {
    // Something is wrong - output the error and help message
    console.log('**************')
    console.log(err)
    console.log('**************')
    displayHelp()
  }
}

/**
 * @function
 * @description Read in the orders file and load it into memory
 * @param orderFileName
 * @param callback
 */
function initializeOrders (orderFileName, callback) {
  fs.readFile(orderFileName, 'utf8',
    function (err, data) {
      if (err) {
        throw err
      }

      var order = JSON.parse(data)
      var parameters = {
        data: order
      }
      var orderID = orderManager.getInstance().orderInterface(properties.processOrder, parameters)

      callback(null, orderID)
    })
}

/**
 * @function
 * @description Main entry point to the application
 */
function main () {
  try {
    // Process the input parameters
    // JSON file of orders
    var results = getInputParameters()

    if (results.error) {
      return
    }

    var inputOptions = results['inputOptions']

    // Use async to read in the records and orders and calculate the fees
    // Report the fees
    async.series(
      [
        function menu (callback) {

          initializeMenu(inputOptions[properties.menuKey], callback)
        },
        function orders (callback) {
          initializeOrders(inputOptions[properties.ordersKey], callback)
        }
      ],
      function callback (err, results) {
        if (err) {
          console.log(err)
        } else {
          var menuID = results[0]
          if (menuID !== -1) {
            calculateBill(menuID, "1")
            reportBill(menuID, "1")
            calculateBill(menuID, "2")
            reportBill(menuID, "2")
          } else {
            if (menuID === -1) {
              console.log('Invalid menu definition')
            }
          }
        }
      })
  } catch (err) {
    console.log(err)
  }
}

main()

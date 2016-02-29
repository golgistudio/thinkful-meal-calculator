var express = require('express')
import bodyparser from 'body-parser'
import _debug from 'debug'

import config from '../../../config'
import {properties} from './utils/properties'
import {initializeRecords} from './bootstrap/initializeRecords'
import {dataStoreManager} from '../shared/model/dataStoreManager'
import {orderManager} from './managers/orderManager'
import {calculateFees} from './calculators/calculateBill'
import {calculateDistributions} from './calculators/calculateDistributions'

const debug = _debug('app:src:recordApp:appServer')
const paths = config.utils_paths
var app = express()

var serverStatus = properties.serverStatusNotReady

var recordID = -1
var orderID = -1

// +++++++++++++
/**
 * @function
 * @description Report the Distributions
 * @param orderID
 */
function reportDistributions (orderID) {
  var _dataStoreManager = dataStoreManager.getInstance()
  var orderCollection = _dataStoreManager.getData(orderID)
  var distributions = _dataStoreManager.getData(properties.distributionKey)

  console.log('--------------------------------------------')
  console.log('              Distributions                 ')
  console.log('--------------------------------------------')

  if (orderCollection != null) {
    var orderCollectionLength = orderCollection.length

    for (var iii = 0; iii < orderCollectionLength; iii++) {
      var orderObj = orderCollection[iii]
      console.log(orderObj.date + '  -  ' + orderObj.number)
      var orderObjItemsLength = orderObj.items.length
      console.log()
      for (var jjj = 0; jjj < orderObjItemsLength; jjj++) {
        var orderItemObj = orderObj.items[jjj]

        var recordString = jjj+1 + '. ' + orderItemObj.type + ' (' + orderItemObj.pages + ') '
        var padding = 38 - recordString.length
        for (var ppp = 0; ppp < padding; ppp++) {
          recordString = recordString + '.'
        }

        recordString = recordString + ' $' + orderItemObj.fee

        console.log(recordString)

        for (var key in orderItemObj.distributions) {
          var stringVal = '     ' + key
          padding = 45 - stringVal.length
          for (var pp = 0; pp < padding; pp++) {
            stringVal = stringVal + '.'
          }
          stringVal = stringVal + ' $' + orderItemObj.distributions[key]
          console.log(stringVal)
        }
        console.log()
      }
      console.log('                          Total .....  $' + orderObj.fee)
      console.log()
      for (var orderKey in orderObj.distributions) {
        stringVal = orderKey
        padding = 45 - stringVal.length
        for (pp = 0; pp < padding; pp++) {
          stringVal = stringVal + '.'
        }
        stringVal = stringVal + ' $' + orderObj.distributions[orderKey]
        console.log(stringVal)
      }
      console.log()
      console.log('--------------------------------------------')
    }
  }
  console.log('__________________________________________________')
  console.log('|                 Total Distributions             |')
  console.log()
  if (distributions != null) {
    for (var itemKey in distributions) {
      stringVal = '   ' + itemKey
      padding = 45 - stringVal.length
      for (pp = 0; pp < padding; pp++) {
        stringVal = stringVal + '.'
      }
      stringVal = stringVal + ' $' + distributions[itemKey]
      console.log(stringVal)
    }
  }
}

// ++++++++++++++++
function reportFees (orderID) {
  var _dataStoreManager = dataStoreManager.getInstance()
  var orderCollection = _dataStoreManager.getData(orderID)

  console.log('--------------------------------------------')
  console.log('                ORDER FEES                  ')
  console.log('--------------------------------------------')

  if (orderCollection != null) {
    var orderCollectionLength = orderCollection.length

    for (var iii = 0; iii < orderCollectionLength; iii++) {
      var orderObj = orderCollection[iii]
      console.log(orderObj.date + '  -  ' + orderObj.number)
      var orderObjItemsLength = orderObj.items.length
      console.log()
      for (var jjj = 0; jjj < orderObjItemsLength; jjj++) {
        var orderItemObj = orderObj.items[jjj]

        var recordString = jjj+1 + '. ' + orderItemObj.type + ' (' + orderItemObj.pages + ') '
        var padding = 38 - recordString.length
        for (var ppp = 0; ppp < padding; ppp++) {
          recordString = recordString + '.'
        }

        recordString = recordString + ' $' + orderItemObj.fee

        console.log(recordString)
      }
      console.log(' ')
      console.log('                          Total .....  $' + orderObj.fee)
      console.log('--------------------------------------------')
    }
  }
}

// +++++++++++++

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/status', (request, response, next) => {
  console.log('status')
  response.json({status: serverStatus})
})

app.post('/orders', bodyparser.json(), (request, response) => {
  console.log(request.body)
  orderID = orderManager.getInstance().defineOrder(request.body)

  response.json('all is good')
})

app.get('/fees', (request, response, next) => {
  console.log('fees')
  calculateFees(recordID, orderID)
  reportFees(orderID)
  var _dataStoreManager = dataStoreManager.getInstance()
  var orderCollection = _dataStoreManager.getData(orderID)
  response.json(JSON.stringify(orderCollection))
})

app.get('/distributions', (request, response) => {
  console.log('distributions')
  calculateDistributions(recordID, orderID)
  reportDistributions(orderID)
  var _dataStoreManager = dataStoreManager.getInstance()
  var orderCollection = _dataStoreManager.getData(orderID)

  response.json(JSON.stringify(orderCollection))
})

var recordsFile = paths.base(config.dir_app_server) + properties.recordDefinitionPath
console.log(recordsFile)
initializeRecords(recordsFile, (err, results) => {
  if (err) {
    console.log(err)
  } else {
    serverStatus = properties.serverStatusReady
    recordID = results
    console.log(results)
  }
})

const port = config.app_server_port
const host = config.app_server_host

app.listen(port)
debug(`Server is now running at ${host}:${port}.`)

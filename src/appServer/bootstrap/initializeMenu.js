/**
 * @file Bootstrap file for initializing record fees and distributions
 *
 * @copyright Laurie Reynolds 2016
 */
var fs = require('fs')
import {menuManager} from '../managers/menuManager'
import {dataStoreManager} from '../managers/dataStoreManager'
import {properties} from '../utils/properties'

/**
 * @function
 * @param callback
 * @description Read in a JSON definition and load into the datastore
 *              Returns the id of the record read in
 */
export function initializeMenu (menuName, callback) {
    try {
        fs.readFile(menuName, 'utf8', function (err, data) {
            if (err) {
                throw err
            }

            // Read in the menu data
            var menuData = JSON.parse(data)
            var parameters = {
                menu: menuData
            }

            var results = menuManager.getInstance().menuInterface(properties.createMenu, parameters)

            var menuID = -1

            if (results.error === properties.noError) {
                menuID = results.data
            }

            callback(null, menuID)
        })
    } catch (err) {
        console.log(err)
    }
}

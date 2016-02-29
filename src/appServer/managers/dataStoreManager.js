/**
 * @file
 */

/*global module:false */
/*jshint bitwise: false*/

/*global module:false */

/**
 *
 * @type {{getInstance}}
 */
export var dataStoreManager = (function () {

    "use strict"

    // Instance stores a reference to the Singleton
    var instance;
    var storeCollection = []
    function init() {

        return {
            setData : function(keyId, dataName, data) {

                var keyCollection = storeCollection[keyId]
                if (!keyCollection) {
                    keyCollection = []
                    storeCollection[keyId] =  keyCollection
                }

                keyCollection[dataName] =  data
            },

            getData : function(keyId, dataName) {

                var keyCollection = storeCollection[keyId]
                var dataSet = null

                if (keyCollection) {
                    dataSet = keyCollection[dataName]
                }
                return dataSet
            }
        }
    }
    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init()
            }
            return instance
        }
    }

})()




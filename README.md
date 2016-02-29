## Simple meal calculator

### Table of contents

  * [Table of contents](#table-of-contents)
  * [Overview](#overview)
  * [Running the application](#running-the-application)

### Overview

This is a simple calculator to generate a bill.   It takes two input files and outputs a bill itemized by table and diner with subtotals and totals for each diner and the whole table

Input files
* src/appServer/Data/menu.json - Defines menu items and prices
* src/demo/data/orders.json - Defines orders for two sets of diners

Components
```
|── Demo 
    |── data
          orders.json - order items
    wrapper.js - Invokes the transpiler
    mealCalculator.js - Main script for the calculator
    runMealCalc.sh - Shell script to run the calculator with the example data
    reportfill.js - Prints out the bill for the two tables defined in the order
|── appServer
    |── bootstrap
          initializeMenu.js - Reads in the menu.json file and loads it into a simple in memory store
    |── calculators
          calculateBill.js - calculate the bill
    |── data
          menu.json - Menu items
    |── managers
          dataStoreManager.js - Simple in memory data store
          menuManager.js - Singlenton instance that parses the menu json file and stores it in the datastore
          orderManager.js - Singleton instance that parses the json order file and stores it in the datastore
    |── model
          menu.js
          order.js
    |── utils
          properties.js
    
```
  
### Running the Application

Download and install the necessary node modules.  

```bash
git clone https://github.com/golgistudio/thinkful-meal-calculator.git
cd thinkful-meal-calculator
npm install
```

To run the command line demo for calculating fees.  The bash shell script includes references to the input files and calls a wrapper script that compiles the ES6 code.  It prints out a bill for two tables

```bash
cd src/demo
./runMealCalc.sh
```

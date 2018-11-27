'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  BASE_API: '"http://mock.eolinker.com/XQAWFb650d4ae131b16a4191b428faa34b7a5d6997db904?uri="',
  // BASE_API: '"http://result.eolinker.com/Je3uWvx2b424506b8f201ff4b3344f8afce76c2c2a0ef43?uri="',

})

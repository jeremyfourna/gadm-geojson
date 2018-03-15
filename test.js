/* jshint esversion: 6 */

const R = require('ramda');
const {
  generateFilesFromShp
} = require('./index');
const { cleanNodeInput } = require('./src/utils');

//generateFilesFromShp('geojson',cleanNodeInput(process.argv));
generateFilesFromShp('topojson', cleanNodeInput(process.argv));

const R = require('ramda');
const { generateGeojsonFromShp } = require('./index');
const { cleanNodeInput } = require('./src/utils');

generateGeojsonFromShp(cleanNodeInput(process.argv));

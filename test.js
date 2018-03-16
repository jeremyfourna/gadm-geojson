/* jshint esversion: 6 */

const R = require('ramda');
const { transform } = require('./index');
const { cleanNodeInput } = require('./src/utils');

const config = {
  outputFolderName: 'topojson',
  outputFileType: 'topojson',
  inputFileType: 'shp'
};

//transform('geojson', cleanNodeInput(process.argv));
transform(config, cleanNodeInput(process.argv));

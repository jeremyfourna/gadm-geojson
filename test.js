/* jshint esversion: 6 */

const R = require('ramda');
const {
  generateFilesFromShp
} = require('./index');
const { cleanNodeInput } = require('./src/utils');

generateFilesFromShp('geojson', cleanNodeInput(process.argv));
//generateFilesFromShp('topojson', cleanNodeInput(process.argv));


/*
node test.js public/AUT_adm_shp/ public/BEL_adm_shp/ public/CHE_adm_shp/ public/DEU_adm_shp/ public/DNK_adm_shp/ public/ESP_adm_shp/ public/FIN_adm_shp/ public/FRA_adm_shp/ public/GBR_adm_shp/ public/HUN_adm_shp/ public/IRL_adm_shp/ public/ITA_adm_shp/ public/NLD_adm_shp/ public/NOR_adm_shp/ public/POL_adm_shp/ public/SWE_adm_shp/
*/

/*
node test.js public/BEL_adm_shp/ public/CHE_adm_shp/ public/DEU_adm_shp/ public/ESP_adm_shp/ public/FRA_adm_shp/ ITA_adm_shp/ public/CHE_adm_shp/ public/LUX_adm_shp/
*/

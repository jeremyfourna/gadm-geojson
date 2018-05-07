/* jshint esversion: 6 */

const R = require('ramda');
const {
  generateFilesFromShp
} = require('./index');
const { cleanNodeInput } = require('./src/utils');

generateFilesFromShp('geojson', cleanNodeInput(process.argv));
//generateFilesFromShp('topojson', cleanNodeInput(process.argv));


/*
node test.js \
public/AUT_adm_shp/ public/BEL_adm_shp/ public/CHE_adm_shp/ public/DEU_adm_shp/ public/DNK_adm_shp/ public/ESP_adm_shp/ public/FIN_adm_shp/ \
public/FRA_adm_shp/ public/GBR_adm_shp/ public/HUN_adm_shp/ public/IRL_adm_shp/ public/ITA_adm_shp/ public/NLD_adm_shp/ public/NOR_adm_shp/ public/POL_adm_shp/ \
public/SWE_adm_shp/ public/gadm34_ALB_shp/ public/gadm34_AND_shp/ public/gadm34_AZE_shp/ public/gadm34_BLR_shp/ public/gadm34_BIH_shp/ public/gadm34_BGR_shp/ \
public/gadm34_HRV_shp/ public/gadm34_CZE_shp/ public/gadm34_EST_shp/ public/gadm34_GEO_shp/ public/gadm34_GRC_shp/ public/gadm34_ISL_shp/ public/gadm34_KAz_shp/ \
public/gadm34_XKO_shp/ public/gadm34_LVA_shp/ public/gadm34_LIE_shp/ public/gadm34_LTU_shp/ public/gadm34_LUX_shp/ public/gadm34_MKD_shp/ public/gadm34_MLT_shp/ \
public/gadm34_MDA_shp/ public/gadm34_MCO_shp/ public/gadm34_MNE_shp/ public/gadm34_PRT_shp/ public/gadm36_ROU_shp/ public/gadm36_SMR_shp/ public/gadm36_SRB_shp/ \
public/gadm36_SVK_shp/ public/gadm36_SVN_shp/ public/gadm36_UKR_shp/ public/gadm36_VAT_shp/ public/gadm36_TUR_shp/
*/

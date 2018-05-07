const R = require('ramda');

const countryLevel = {
  gadm34_ALB_shp: 0,
  gadm34_AND_shp: 0,
  AUT_adm_shp: 0,
  gadm34_AZE_shp: 0,
  BEL_adm_shp: 0,
  gadm34_BIH_shp: 0,
  gadm34_BGR_shp: 0,
  gadm34_BLR_shp: 0,
  CHE_adm_shp: 0,
  gadm34_CZE_shp: 0,
  DEU_adm_shp: 0,
  DNK_adm_shp: 0,
  ESP_adm_shp: 0,
  gadm34_EST_shp: 0,
  FIN_adm_shp: 0,
  FRA_adm_shp: 0,
  gadm34_GEO_shp: 0,
  GBR_adm_shp: 0,
  gadm34_GRC_shp: 0,
  gadm34_HRV_shp: 0,
  HUN_adm_shp: 0,
  IRL_adm_shp: 0,
  gadm34_ISL_shp: 0,
  ITA_adm_shp: 0,
  gadm34_KAZ_shp: 0,
  gadm34_LIE_shp: 0,
  gadm34_LVA_shp: 0,
  gadm34_LTU_shp: 0,
  gadm34_LUX_shp: 0,
  gadm34_MCO_shp: 0,
  gadm34_MDA_shp: 0,
  gadm34_MKD_shp: 0,
  gadm34_MLT_shp: 0,
  gadm34_MNE_shp: 0,
  NLD_adm_shp: 0,
  NOR_adm_shp: 0,
  POL_adm_shp: 0,
  gadm34_PRT_shp: 0,
  gadm36_ROU_shp: 0,
  gadm36_SMR_shp: 0,
  gadm36_SRB_shp: 0,
  gadm36_SVK_shp: 0,
  gadm36_SVN_shp: 0,
  SWE_adm_shp: 0,
  gadm36_TUR_shp: 0,
  gadm36_UKR_shp: 0,
  gadm36_VAT_shp: 0,
  gadm34_XKO_shp: 0
};

const regionLevel = {
  gadm34_ALB_shp: 1,
  gadm34_AND_shp: 1,
  AUT_adm_shp: 1,
  gadm34_AZE_shp: 1,
  BEL_adm_shp: 1,
  gadm34_BIH_shp: 1,
  gadm34_BGR_shp: 1,
  gadm34_BLR_shp: 1,
  CHE_adm_shp: 1,
  gadm34_CZE_shp: 1,
  DEU_adm_shp: 1,
  DNK_adm_shp: 1,
  ESP_adm_shp: 1,
  gadm34_EST_shp: 1,
  FIN_adm_shp: 1,
  FRA_adm_shp: 1,
  gadm34_GEO_shp: 1,
  GBR_adm_shp: 1,
  gadm34_GRC_shp: 1,
  gadm34_HRV_shp: 1,
  HUN_adm_shp: 1,
  IRL_adm_shp: 1,
  gadm34_ISL_shp: 1,
  ITA_adm_shp: 1,
  gadm34_KAZ_shp: 1,
  gadm34_LIE_shp: 1,
  gadm34_LVA_shp: 1,
  gadm34_LTU_shp: 1,
  gadm34_LUX_shp: 1,
  gadm34_MCO_shp: 0,
  gadm34_MDA_shp: 1,
  gadm34_MKD_shp: 1,
  gadm34_MLT_shp: 1,
  gadm34_MNE_shp: 1,
  NLD_adm_shp: 1,
  NOR_adm_shp: 1,
  POL_adm_shp: 1,
  gadm34_PRT_shp: 1,
  gadm36_ROU_shp: 1,
  gadm36_SMR_shp: 1,
  gadm36_SRB_shp: 1,
  gadm36_SVK_shp: 1,
  gadm36_SVN_shp: 1,
  SWE_adm_shp: 1,
  gadm36_TUR_shp: 1,
  gadm36_UKR_shp: 1,
  gadm36_VAT_shp: 0,
  gadm34_XKO_shp: 1
};

const districtLevel = {
  CHE_adm_shp: 1,
  DEU_adm_shp: 1,
  ESP_adm_shp: 2,
  FRA_adm_shp: 2,
  GBR_adm_shp: 2,
  ITA_adm_shp: 1,
  gadm34_LIE_shp: 1,
  gadm34_MKD_shp: 1
};

const cityLevel = {
  CHE_adm_shp: 3,
  DEU_adm_shp: 2,
  ESP_adm_shp: 4,
  FRA_adm_shp: 5,
  GBR_adm_shp: 4,
  ITA_adm_shp: 3
};

// selectLevel :: string -> object
function selectLevel(level) {
  console.log('selectLevel', level);

  return R.cond([
    [R.equals('country'), R.always(countryLevel)],
    [R.equals('region'), R.always(regionLevel)],
    [R.equals('district'), R.always(districtLevel)],
    [R.equals('city'), R.always(cityLevel)],
    [R.T, R.always(-1)]
  ])(level);
}

exports.selectLevel = selectLevel;

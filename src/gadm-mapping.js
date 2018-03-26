const R = require('ramda');

const countryLevel = {
  AUT_adm_shp: 0,
  BEL_adm_shp: 0,
  CHE_adm_shp: 0,
  DEU_adm_shp: 0,
  DNK_adm_shp: 0,
  ESP_adm_shp: 0,
  FIN_adm_shp: 0,
  FRA_adm_shp: 0,
  GBR_adm_shp: 0,
  HUN_adm_shp: 0,
  IRL_adm_shp: 0,
  ITA_adm_shp: 0,
  NLD_adm_shp: 0,
  NOR_adm_shp: 0,
  POL_adm_shp: 0,
  SWE_adm_shp: 0
};

const regionLevel = {
  AUT_adm_shp: 1,
  BEL_adm_shp: 1,
  CHE_adm_shp: 1,
  DEU_adm_shp: 1,
  DNK_adm_shp: 1,
  ESP_adm_shp: 1,
  FIN_adm_shp: 1,
  FRA_adm_shp: 1,
  GBR_adm_shp: 1,
  HUN_adm_shp: 1,
  IRL_adm_shp: 1,
  ITA_adm_shp: 1,
  NLD_adm_shp: 1,
  NOR_adm_shp: 1,
  POL_adm_shp: 1,
  SWE_adm_shp: 1
};

const districtLevel = {
  CHE_adm_shp: 1,
  DEU_adm_shp: 1,
  ESP_adm_shp: 2,
  FRA_adm_shp: 2,
  GBR_adm_shp: 2,
  ITA_adm_shp: 1
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

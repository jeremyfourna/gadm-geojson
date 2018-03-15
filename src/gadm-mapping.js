const R = require('ramda');

const countryLevel = {
  CHE_adm_shp: 0,
  DEU_adm_shp: 0,
  ESP_adm_shp: 0,
  FRA_adm_shp: 0,
  GBR_adm_shp: 0,
  HUN_adm_shp: 0,
  ITA_adm_shp: 0
};

const regionLevel = {
  CHE_adm_shp: 1,
  DEU_adm_shp: 1,
  ESP_adm_shp: 1,
  FRA_adm_shp: 1,
  GBR_adm_shp: 1,
  HUN_adm_shp: 0,
  ITA_adm_shp: 1
};

const districtLevel = {
  CHE_adm_shp: 1,
  DEU_adm_shp: 1,
  ESP_adm_shp: 2,
  FRA_adm_shp: 2,
  GBR_adm_shp: 2,
  HUN_adm_shp: 0,
  ITA_adm_shp: 1
};

const cityLevel = {
  CHE_adm_shp: 3,
  DEU_adm_shp: 2,
  ESP_adm_shp: 4,
  FRA_adm_shp: 5,
  GBR_adm_shp: 4,
  HUN_adm_shp: 0,
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

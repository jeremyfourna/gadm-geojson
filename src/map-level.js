/* jshint esversion: 6 */

const shell = require('shelljs');
const R = require('ramda');

const {
  fileTypeInDir,
  isStringType
} = require('./utils');

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


function getFilesForLevel(level, listOfDirectories) {
  console.log('getFilesForLevel', level, listOfDirectories);

  function allFilesInsideDirectories(listOfDirectories) {
    console.log('allFilesInsideDirectories', listOfDirectories);

    return R.map(cur => {
      const lsResults = fileTypeInDir('shp', cur);
      const listOfFiles = R.filter(isStringType, lsResults);

      return listOfFiles;
    }, listOfDirectories);
  }

  function filesWithoutType(listOfFilesInsideDirectories) {
    console.log('filesWithoutType', listOfFilesInsideDirectories);

    return R.map(cur => {
      return R.map(cur1 => {
        return R.head(R.split('.', cur1));
      }, cur);
    }, listOfFilesInsideDirectories);
  }

  function onlyFilesForLevel(level) {
    console.log('onlyFilesForLevel', level);

    return function(listOfFilesInsideDirectories) {
      console.log('onlyFilesForLevel -> anonymous function', listOfFilesInsideDirectories);
      const adminLevel = selectLevel(level);

      return R.map(cur => {
        return R.filter(cur1 => {
          const path = R.split('/', cur1);
          const country = R.nth(1, path);
          const fileLevel = R.last(R.last(path));

          return R.has(country, adminLevel) && R.equals(Number(fileLevel), R.prop(country, adminLevel));
        }, cur);
      }, listOfFilesInsideDirectories);
    };
  }

  function addFileTypeToFiles(listOfFilesInsideDirectories) {
    console.log('addFileTypeToFiles', listOfFilesInsideDirectories);
    const listOfFilesFlattened = R.flatten(listOfFilesInsideDirectories)

    return R.map(cur => R.concat(cur, '.shp'), listOfFilesFlattened);
  }

  return R.compose(
    addFileTypeToFiles,
    onlyFilesForLevel(level),
    filesWithoutType,
    allFilesInsideDirectories)(listOfDirectories);
}

function getFilesForAllLevels(levels, listOfDirectories) {
  console.log('getFilesForAllLevels', listOfDirectories);


  return R.map(cur => getFilesForLevel(cur, listOfDirectories), levels);
}

exports.getFilesForAllLevels = R.curry(getFilesForAllLevels);

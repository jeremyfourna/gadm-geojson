const shell = require('shelljs');
const R = require('ramda');

const {
  fileTypeInDir,
  isStringType
} = require('./utils');

const countryLevel = {
  DEU_adm_shp: 0,
  ITA_adm_shp: 0
};

function getFilesForCountryLevel(listOfDirectories) {
  console.log('getFilesForCountryLevel', listOfDirectories);
  const allFilesInsideDirectories = R.map(cur => {
    const lsResults = fileTypeInDir('shp', cur);
    const listOfFiles = R.filter(isStringType, lsResults);

    return listOfFiles;
  }, listOfDirectories);
  const filesWithoutType = R.map(cur => {
    return R.map(cur1 => {
      return R.head(R.split('.', cur1));
    }, cur);
  }, allFilesInsideDirectories);
  const onlyFilesForCountries = R.map(cur => {
    return R.filter(cur1 => {
      const path = R.split('/', cur1);
      const country = R.nth(1, path);
      const fileLevel = R.last(R.last(path));

      return R.has(country, countryLevel) && R.equals(Number(fileLevel), R.prop(country, countryLevel));
    }, cur);
  }, filesWithoutType);
  const addFileTypeToCountryFiles = R.map(cur => R.concat(cur, '.shp'), R.flatten(onlyFilesForCountries));

  return addFileTypeToCountryFiles;
}

exports.getFilesForCountryLevel = getFilesForCountryLevel;

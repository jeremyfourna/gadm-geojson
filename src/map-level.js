/* jshint esversion: 6 */

const R = require('ramda');

const {
  fileTypeInDir,
  isStringType
} = require('./utils');

const {
  selectLevel
} = require('./gadm-mapping');


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
    const listOfFilesFlattened = R.flatten(listOfFilesInsideDirectories);

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

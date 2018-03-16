const shell = require('shelljs');
const R = require('ramda');

const {
  fileTypeInDir,
  isStringType
} = require('./utils');

const {
  selectLevel
} = require('./gadm-mapping');

function allFilesInsideDirectories(listOfDirectories) {
  shell.echo('allFilesInsideDirectories', listOfDirectories);

  return R.map(cur => {
    const lsResults = fileTypeInDir('shp', cur);
    const listOfFiles = R.filter(isStringType, lsResults);

    return listOfFiles;
  }, listOfDirectories);
}

function filesWithoutType(listOfFilesInsideDirectories) {
  shell.echo('filesWithoutType', listOfFilesInsideDirectories);

  return R.map(cur => {
    return R.map(cur1 => {
      return R.head(R.split('.', cur1));
    }, cur);
  }, listOfFilesInsideDirectories);
}

function onlyFilesForLevel(level) {
  shell.echo('onlyFilesForLevel', level);

  return function(listOfFilesInsideDirectories) {
    shell.echo('onlyFilesForLevel -> anonymous function', listOfFilesInsideDirectories);
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
  shell.echo('addFileTypeToFiles', listOfFilesInsideDirectories);
  const listOfFilesFlattened = R.flatten(listOfFilesInsideDirectories);

  return R.map(cur => R.concat(cur, '.shp'), listOfFilesFlattened);
}

function getFilesForLevel(level, directories) {
  shell.echo('getFilesForLevel', level, directories);

  return R.compose(
    addFileTypeToFiles,
    onlyFilesForLevel(level),
    filesWithoutType,
    allFilesInsideDirectories
  )(directories);
}

function getFilesForAllLevels(levels, directories) {
  shell.echo('getFilesForAllLevels', directories);

  return R.map(cur => getFilesForLevel(cur, directories), levels);
}

exports.getFilesForAllLevels = R.curry(getFilesForAllLevels);

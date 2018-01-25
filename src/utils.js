const R = require('ramda');
const shell = require('shelljs');

function lengthZero(list) {
  return R.equals(0, R.length(list));
}

function isStringType(cur) {
  return R.equals('String', R.type(cur));
}

function changeEndPath(folderName, path) {
  const pathAsArray = R.split('/', path);
  const initOfPath = R.init(pathAsArray);
  const folderAddedToPath = R.append(folderName, initOfPath);

  return R.join('/', folderAddedToPath);
}

function fileTypeInDir(fileType, directory) {
  const anyFileType = R.concat('*.', fileType);

  return shell.ls(R.concat(directory, anyFileType));
}

function cleanNodeInput(args) {
  return R.drop(2, args);
}

exports.changeEndPath = R.curry(changeEndPath);
exports.cleanNodeInput = cleanNodeInput;
exports.isStringType = isStringType;
exports.fileTypeInDir = R.curry(fileTypeInDir);
exports.lengthZero = lengthZero;

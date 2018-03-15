/* jshint esversion: 6 */

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

// cleanDirectories :: (string, string,[string], function) -> function
function cleanDirectories(folderName, fileFormat, directories, callback) {
  // cleanDirectory :: [string] -> function
  function cleanDirectory(remainingDirectories) {
    if (lengthZero(remainingDirectories)) {

      return callback(folderName, fileFormat, directories);

    } else {
      const dir = R.head(remainingDirectories);
      const outputDirectory = R.concat(dir, folderName);

      if (!R.contains(folderName, shell.ls(dir))) {
        shell.mkdir(outputDirectory);

        return cleanDirectory(R.tail(remainingDirectories));

      } else {
        // topojson and geojson files  end in .json
        shell.rm(R.concat(outputDirectory, '/*.json'));

        return cleanDirectory(R.tail(remainingDirectories));
      }
    }
  }

  return cleanDirectory(directories);
}

exports.changeEndPath = R.curry(changeEndPath);
exports.cleanDirectories = R.curry(cleanDirectories);
exports.cleanNodeInput = cleanNodeInput;
exports.isStringType = isStringType;
exports.fileTypeInDir = R.curry(fileTypeInDir);
exports.lengthZero = lengthZero;
exports.mapIndexed = R.addIndex(R.map);

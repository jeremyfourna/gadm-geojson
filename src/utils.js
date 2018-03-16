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

// cleanDirectories :: (object, [string]) -> [string]
function cleanDirectories(config, directories) {
  // cleanDirectory :: [string] -> [string]
  function cleanDirectory(remainingDirectories) {
    if (lengthZero(remainingDirectories)) {

      return directories;

    } else {
      const q = p(config);
      const directory = R.head(remainingDirectories);
      const outputDirectory = R.concat(directory, q('outputFolderName'));

      if (R.contains(q('outputFolderName'), shell.ls(directory))) {
        // topojson and geojson files end in .json
        shell.rm(R.concat(outputDirectory, '/*.json'));
      } else {
        shell.mkdir(outputDirectory);
      }

      return cleanDirectory(R.tail(remainingDirectories));
    }
  }

  return cleanDirectory(directories);
}

function cleanDirectory(config, directories) {
  const outputDirectory = R.prop('outputDirectory', config);

  // Check if folder already exist, if no create it
  if (R.contains(outputDirectory, shell.ls())) {
    // topojson and geojson files end in .json
    shell.rm('-rf', R.concat(outputDirectory, '/'));
  } else {
    shell.mkdir(outputDirectory);
  }

  return directories;
}

// p :: (object, string) -> a
function p(obj, prop) {
  const fProp = R.flip(R.prop);
  const fPath = R.flip(R.path);

  return R.ifElse(
    R.is(Array),
    fPath(obj),
    fProp(obj)
  )(prop);
}

exports.changeEndPath = R.curry(changeEndPath);
exports.cleanDirectory = R.curry(cleanDirectory);
exports.cleanDirectories = R.curry(cleanDirectories);
exports.cleanNodeInput = cleanNodeInput;
exports.fileTypeInDir = R.curry(fileTypeInDir);
exports.isStringType = isStringType;
exports.lengthZero = lengthZero;
exports.mapIndexed = R.addIndex(R.map);
exports.p = R.curry(p);

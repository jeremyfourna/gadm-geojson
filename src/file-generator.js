const shell = require('shelljs');
const R = require('ramda');
const {
  changeEndPath,
  fileTypeInDir,
  isStringType,
  lengthZero
} = require('./utils');

function cleanDirectories(directories, callback) {
  function cleanDirectory(remainingDirectories) {
    if (lengthZero(remainingDirectories)) {

      return callback(directories);

    } else {
      const dir = R.head(remainingDirectories);
      const outputDirectory = R.concat(dir, 'geojson');

      if (!R.contains('geojson', shell.ls(dir))) {

        shell.mkdir(outputDirectory);
        return cleanDirectory(R.tail(remainingDirectories));

      } else {

        shell.rm(R.concat(outputDirectory, '/*.json'));
        return cleanDirectory(R.tail(remainingDirectories));
      }
    }
  }

  return cleanDirectory(directories);
}

function formatFiles(directories, callback = true) {
  function formatOneDir(remainingDirectories) {
    function formatOneFile(remainingFiles) {
      if (lengthZero(remainingFiles)) {

        return formatOneDir(R.tail(remainingDirectories));

      } else {
        const file = R.head(remainingFiles);
        const outputDir = changeEndPath('geojson', file);

        return shell.exec(
          `mapshaper ${file} -simplify weighted keep-shapes 10% -o format=geojson ${outputDir}`,
          function(code, stdout, stderr) {
            return formatOneFile(R.tail(remainingFiles));
          });

      }
    }

    if (lengthZero(remainingDirectories)) {

      //return callback(directories);
      return console.log('Work done...');

    } else {
      const dir = R.head(remainingDirectories);
      const lsResults = fileTypeInDir('shp', dir);
      const listOfFiles = R.filter(isStringType, lsResults);

      return formatOneFile(listOfFiles);

    }
  }

  return formatOneDir(directories);
}

function generateGeojsonFromShp(directories) {
  if (!shell.which('mapshaper')) {
    shell.echo('Sorry, this script requires mapshaper');
    shell.exit(1);
  }

  return cleanDirectories(directories, formatFiles);

}

exports.generateGeojsonFromShp = generateGeojsonFromShp;

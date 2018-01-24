const shell = require('shelljs');
const R = require('ramda');

function isStringType(cur) {
  return R.equals('String', R.type(cur));
}

function cleanOutput(folderName, path) {
  const pathAsArray = R.split('/', path);
  const initOfPath = R.init(pathAsArray);
  const folderAddedToPath = R.append(folderName, initOfPath);

  return R.join('/', folderAddedToPath);
}

function lengthZero(list) {
  return R.equals(0, R.length(list));
}

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
        const outputDir = cleanOutput('geojson', file);

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
      const lsResults = shell.ls(R.concat(dir, '*.shp'));
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

generateGeojsonFromShp(R.drop(2, process.argv));

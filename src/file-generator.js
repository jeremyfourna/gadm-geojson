const shell = require('shelljs');
const R = require('ramda');
const {
  changeEndPath,
  fileTypeInDir,
  isStringType,
  lengthZero
} = require('./utils');

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

// formatFiles :: (string, string,[string], function) -> function
function formatFiles(folderName, fileFormat, directories) {
  // formatOneDir :: [string] -> function
  function formatOneDir(remainingDirectories) {
    // formatOneFile :: [string] -> function
    function formatOneFile(remainingFiles) {
      console.log(remainingFiles);
      if (lengthZero(remainingFiles)) {

        return formatOneDir(R.tail(remainingDirectories));

      } else {
        const file = R.head(remainingFiles);
        const outputDir = changeEndPath(folderName, file);

        return shell.exec(
          `mapshaper ${file} -simplify weighted keep-shapes 10% -o format=${fileFormat} ${outputDir}`,
          function(code, stdout, stderr) {
            return formatOneFile(R.tail(remainingFiles));
          });

      }
    }
    // formatAllFilesIntoOne :: [string] -> function
    function formatAllFilesIntoOne(listOfFiles) {
      const formatedListOfFiles = R.join(' ', listOfFiles)
      const outputDir = changeEndPath(folderName, R.head(listOfFiles));
      console.log(listOfFiles, formatedListOfFiles);

      return shell.exec(
        `mapshaper -i ${formatedListOfFiles} combine-files -simplify weighted keep-shapes 10% -o format=${fileFormat} ${outputDir}`,
        function(code, stdout, stderr) {
          return formatOneDir(R.tail(remainingDirectories));
        });
    }

    if (lengthZero(remainingDirectories)) {

      //return callback(directories);
      return console.log('Work done...');

    } else {
      const directory = R.head(remainingDirectories);
      const lsResults = fileTypeInDir('shp', directory);
      const listOfFiles = R.filter(isStringType, lsResults);

      if (R.equals(fileFormat, 'topojson')) {

        return formatAllFilesIntoOne(listOfFiles);

      } else {

        return formatOneFile(listOfFiles);

      }
    }
  }

  return formatOneDir(directories);
}

// generateFilesFromShp :: string -> [string] -> IO
function generateFilesFromShp(fileFormat, directories) {
  if (!shell.which('mapshaper')) {
    shell.echo('Sorry, this script requires mapshaper');

    return shell.exit(1);
  }

  const folderName = fileFormat;

  return cleanDirectories(folderName, fileFormat, directories, formatFiles);
}

exports.generateFilesFromShp = R.curry(generateFilesFromShp);

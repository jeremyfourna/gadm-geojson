/* jshint esversion: 6 */

const shell = require('shelljs');
const R = require('ramda');
const {
  changeEndPath,
  cleanDirectories,
  fileTypeInDir,
  isStringType,
  lengthZero,
  mapIndexed
} = require('./utils');
const { getFilesForAllLevels } = require('./map-level');

// formatFiles :: (string, string,[string], function) -> function
function formatFiles(folderName, fileFormat, directories) {
  // formatOneDir :: [string] -> function
  function formatOneDir(remainingDirectories) {
    // formatOneFile :: [string] -> function
    function formatOneFile(remainingFiles) {
      console.log('formatOneFile', remainingFiles);
      if (lengthZero(remainingFiles)) {

        return formatOneDir(R.tail(remainingDirectories));

      } else {
        const file = R.head(remainingFiles);
        const outputDir = changeEndPath(folderName, file);

        return shell.exec(
          `mapshaper ${file} -simplify weighted keep-shapes 10% -o format=${fileFormat} ${outputDir}`,
          (code, stdout, stderr) => {
            return formatOneFile(R.tail(remainingFiles));
          });

      }
    }
    // formatAllFilesIntoOne :: (string, [string]) -> function
    function formatAllFilesIntoOne(level, listOfFiles) {
      console.log('formatAllFilesIntoOne', listOfFiles);
      const formatedListOfFiles = R.join(' ', listOfFiles);

      //-filter-fields NAME_1 \
      return shell.exec(`mapshaper \
        -i ${formatedListOfFiles} combine-files \
        -each "this.properties = function(properties) {\
          function a(props) {\
            return function(key) {\
              return props[key] || null;\
            };\
          }\
          var p = a(properties);\
          return {\
            id:p('ID_5') || p('ID_4') || p('ID_3') || p('ID_2') || p('ID_1') || p('ID_0'),\
            name:p('NAME_5') || p('NAME_4') || p('NAME_3') || p('NAME_2') || p('NAME_1') || p('NAME_0'),\
            type:p('TYPE_5') || p('TYPE_4') || p('TYPE_3') || p('TYPE_2') || p('TYPE_1') || p('TYPE_0'),\
            iso:p('ISO')\
          };\
        }(this.properties)" \
        -merge-layers \
        -simplify weighted keep-shapes 10% \
        -o format=${fileFormat} public/${level}.json`);
    }

    console.log('formatOneDir', remainingDirectories);

    if (lengthZero(remainingDirectories)) {

      return console.log('Work done...');

    } else {
      if (R.equals(fileFormat, 'topojson')) {
        const levels = ['country', 'region', 'district', 'city'];
        const allListOfFilesForAllAdminLevel = getFilesForAllLevels(levels, directories);

        return mapIndexed((cur, index) => formatAllFilesIntoOne(R.nth(index, levels), cur), allListOfFilesForAllAdminLevel);

      } else {
        const directory = R.head(remainingDirectories);
        const lsResults = fileTypeInDir('shp', directory);
        const listOfFiles = R.filter(isStringType, lsResults);

        return formatOneFile(listOfFiles);

      }
    }
  }

  console.log('formatFiles', folderName, fileFormat, directories);

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

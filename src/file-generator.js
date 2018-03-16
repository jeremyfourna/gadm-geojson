const shell = require('shelljs');
const R = require('ramda');
const {
  changeEndPath,
  cleanDirectory,
  cleanDirectories,
  fileTypeInDir,
  isStringType,
  lengthZero,
  mapIndexed,
  p
} = require('./utils');
const { getFilesForAllLevels } = require('./map-level');

// formatFiles :: (string, string, [string], function) -> function
function formatFiles(folderName, fileFormat, directories) {
  // formatOneDir :: [string] -> function
  function formatOneDir(remainingDirectories) {
    // formatOneFile :: [string] -> function
    function formatOneFile(remainingFiles) {
      // transformFile :: (string, string, [string]) -> function
      function transformFile(folderName, fileFormat, remainingFiles) {
        const file = R.head(remainingFiles);
        const outputDir = changeEndPath(folderName, file);

        return shell.exec(
          `mapshaper ${file} -simplify weighted keep-shapes 10% -o format=${fileFormat} ${outputDir}`,
          () => {
            return formatOneFile(R.tail(remainingFiles));
          });
      }

      shell.echo('formatOneFile', remainingFiles);

      return R.ifElse(
        lengthZero,
        () => formatOneDir(R.tail(remainingDirectories)),
        () => transformFile(folderName, fileFormat, remainingFiles)
      )(remainingFiles);
    }

    function transformFileIntoTopojson(fileFormat, directories, remainingDirectories) {
      return R.ifElse(
        R.equals('topojson'),
        () => {
          const levels = ['country', 'region', 'district', 'city'];
          const allListOfFilesForAllAdminLevel = getFilesForAllLevels(levels, directories);

          return mapIndexed((cur, index) => formatAllFilesIntoOne(fileFormat, R.nth(index, levels), cur), allListOfFilesForAllAdminLevel);
        },
        () => R.compose(
          formatOneFile,
          R.filter(isStringType),
          fileTypeInDir('shp'),
          R.head)(remainingDirectories)
      )(fileFormat);
    }

    shell.echo('formatOneDir', remainingDirectories);

    return R.ifElse(
      lengthZero,
      () => exit('Work done...'),
      () => transformFileIntoTopojson(fileFormat, directories, remainingDirectories)
    )(remainingDirectories);
  }

  shell.echo('formatFiles', folderName, fileFormat, directories);

  return formatOneDir(directories);
}

// formatAllFilesIntoOne :: (string, string, [string]) -> function
function formatAllFilesIntoOne(fileFormat, level, listOfFiles) {
  shell.echo('formatAllFilesIntoOne', listOfFiles);
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

// generateFilesFromShp :: object -> [string] -> IO
function generateFilesFromShp(config, directories) {
  if (!shell.which('mapshaper')) {
    shell.echo('Sorry, this script requires mapshaper');

    return shell.exit(1);
  } else {

    return cleanDirectories(q('folderName'), q('fileType'), directories, formatFiles);
  }
}

function transform(config, directories) {
  if (!shell.which('mapshaper')) {
    return exit('Sorry, this script requires mapshaper');
  } else if (isConfigValid(config)) {
    return selectTransformMethod(config, directories);
  } else {
    return exit('Your configuration object is not valid, see documentation for accepted properties and values');
  }
}

// isConfigValid :: object -> boolean
function isConfigValid(config) {
  const q = p(config);
  const acceptedInputFileTypes = ['shp'];
  const acceptedOutputFileTypes = ['geojson', 'topojson'];

  return R.and(
    R.contains(q('inputFileType'), acceptedInputFileTypes),
    R.contains(q('outputFileType'), acceptedOutputFileTypes)
  );
}

// exit :: string -> IO
function exit(message) {
  shell.echo(message);

  return shell.exit(1);
}

// checkIOFileTypes :: (string, string) -> function -> boolean
function checkIOFileTypes(input, output) {
  return function(config) {
    const q = p(config);

    return R.and(
      R.equals(q('inputFileType'), input),
      R.equals(q('outputFileType'), output)
    );
  }
}

function selectTransformMethod(config, directories) {
  return R.cond([
    [checkIOFileTypes('shp', 'topojson'), (config) => makeTopojsonFile(config, directories)],
    [checkIOFileTypes('shp', 'geojson'), (config) => makeGeojsonFiles(config, directories)],
    [R.T, () => exit('Your configuration object is not valid, see documentation for accepted properties and values')]
  ])(config);
}

function makeTopojsonFile(config, directories) {
  return R.compose(
    createTopojsonFile(config),
    cleanDirectory(config)
  )(directories);
}

function createTopojsonFile(config, directories) {
  const q = p(config);
  const levels = ['country', 'region', 'district', 'city'];

  return mapIndexed(
    (cur, index) => formatAllFilesIntoOne(q('outputFileType'), R.nth(index, levels), cur),
    getFilesForAllLevels(directories)
  );
}

exports.transform = R.curry(transform);

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

function generateGeojsonFromShp(terminal, directories) {
  const lsResults = R.map(cur => terminal.ls(R.concat(cur, '*.shp')), directories);
  const listOfFiles = R.map(cur => R.filter(isStringType, cur), lsResults);

  if (!terminal.which('mapshaper')) {
    terminal.echo('Sorry, this script requires mapshaper');
    terminal.exit(1);
  }

  R.forEach(cur => {
    const outputDirectory = R.concat(cur, 'geojson');
    if (!R.contains('geojson', terminal.ls(cur))) {
      terminal.mkdir(outputDirectory);
    } else {
      terminal.rm(`${outputDirectory}/*.json`);
    }
  }, directories);

  R.forEach(cur => {
    R.forEach(cur1 => {
      const outputDirectory = cleanOutput('geojson', cur1);
      terminal.exec(`mapshaper ${cur1} -simplify dp 10% -o format=geojson ${outputDirectory}`);
    }, cur);
  }, listOfFiles);
}

generateGeojsonFromShp(shell, R.slice(2, Infinity, process.argv));

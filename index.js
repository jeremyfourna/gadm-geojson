const shell = require('shelljs');
const R = require('ramda');

function onlyStringType(cur) {
  return R.equals('String', R.type(cur));
}

if (!shell.which('mapshaper')) {
  shell.echo('Sorry, this script requires mapshaper');
  shell.exit(1);
}



const directory = process.argv[2];
const outputDirectory = R.concat(directory, 'geojson');

if (!R.contains('geojson', shell.ls(directory))) {
  shell.mkdir(outputDirectory);
}

const lsResult = shell.ls(R.concat(directory, '*.shp'));
const listOfFiles = R.filter(onlyStringType, lsResult);

console.log(listOfFiles);


R.forEach(cur => {
  shell.exec(`mapshaper ${cur} -simplify dp 10% -o format=geojson ${outputDirectory}`);
}, listOfFiles);

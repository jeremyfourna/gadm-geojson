const Papa = require('papaparse');
const R = require('ramda');
const fs = require('fs');

const {
  cleanNodeInput,
  fileTypeInDir
} = require('./utils');

function csvToJsonOneFile(pathToFile, callback) {
  console.log(pathToFile);
  return Papa.parse(fs.createReadStream(R.head(pathToFile)), {
    complete(rows) {
      return callback(R.prop('data', rows));
    },
    header: true
  });
}

csvToJsonOneFile(cleanNodeInput(process.argv), console.log);

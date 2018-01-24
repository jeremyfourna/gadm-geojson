# gadm-geojson

Transform Shapefiles from GADM into geosjon file that you can use via Leaflet or other libraries

## Setup

1. `npm install -g mapshaper`
2. Download countries' `Shapefile` from http://www.gadm.org/country
3. Extract all files from the `zip` inside a folder

## Usage

`node index.js <directory-path-1> <directory-path-2> ... <directory-path-N>`

The program will create inside the directory a folder `geojson` and put the transformed files inside.
You can use the `geojson` file inside your application.

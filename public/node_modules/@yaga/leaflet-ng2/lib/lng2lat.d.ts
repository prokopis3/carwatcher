import { Position } from 'geojson';
/**
 * Function to convert from Lng-Lat format from geoJSON to LatLng on Leaflet
 */
export declare function lng2lat(position: Position | Position[] | Position[][] | Position[][][]): Position | Position[] | Position[][] | Position[][][];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Function to convert from Lng-Lat format from geoJSON to LatLng on Leaflet
 */
/* tslint:disable:max-line-length */
function lng2lat(position) {
    /* tslint:enable */
    if (position.length > 0 && typeof position[0] === 'number') {
        return [position[1], position[0]];
    }
    else if (position.length && Array.prototype.isPrototypeOf(position)) {
        var arr = [];
        for (var i = 0; i < position.length; i += 1) {
            arr.push(lng2lat(position[i]));
        }
        return arr;
    }
}
exports.lng2lat = lng2lat;
//# sourceMappingURL=lng2lat.js.map
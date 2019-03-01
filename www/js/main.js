/**
 * initialisation of the dynamic part of the web site
 *
 */
function init()
{

/** OSM Integration of the MAP */
var Longitude = 46.852704

var Latitude = 9.5255747

var mymap = L.map('mapid').setView([Longitude, Latitude], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

}

/** initialise */
window.onload=init;
var earthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesLink = "static/data/tectonic_GeoJSON/PB2002_plates.json"; //?

var earthQuakeMap;
var tectonicPlatesMap;

// list used for 3 different map types
var mapLayers = {
  "Satellite": "satellite-v9",
  "Grayscale": "light-v10",
  "Outdoors": "mapbox.outdoors"
};

var baseMaps = {};
var tileLayers = [];

//map id loop didn't work?
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © " + 
               "<a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong>"+ 
               "<a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © " + 
               "<a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong>"+ 
               "<a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © " + 
               "<a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong>"+ 
               "<a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});
 
var map = L.map("map", {
  center: [40.7, -94.5],
  zoom: 3,
  layers: [graymap, satellitemap, outdoors]
});

graymap.addTo(map);

var baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};
 
var tectonicPlates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var overlays = { "tectonicPlates": tectonicPlates, "earthquakes": earthquakes}; //data layers

L.control
 .layers(baseMaps, overlays) //change layers
 .addTo(map);
 
//set map color for coordinates depth
function pickColor(depth) {
  switch (true) {
    case (depth < 10):
      return "chartreuse";
    case (depth < 30):
      return "greenyellow";
    case (depth < 50):
      return "gold";
    case (depth < 70):
      return "DarkOrange";
    case (depth < 90):
      return "Peru";
    default:
      return "red";
  };
};

//legend details on map
function showLegend() {

  var legendInfo = [{ depth: "-10-10", color: "chartreuse" },
  { depth: "10-30", color: "greenyellow" },
  { depth: "30-50", color: "gold" },
  { depth: "50-70", color: "DarkOrange" },
  { depth: "70-90", color: "Peru" },
  { depth: "90+", color: "red" }];

  var htmlStr = "<h3> Depth </h3> <hr>";

  for (i = 0; i < legendInfo.length; i++) {
    htmlStr += "<p style = \"background-color: " + legendInfo[i].color +
      "\">" + legendInfo[i].depth + "</p> ";
  };

  return htmlStr;
};
  
//retrieve earthquake & tectonic plates data from links 
d3.json(earthquakeLink).then(function (data) {
  console.log(data.features[1]);
  // console.log(data);

  L.geoJson(data, { 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    }, 
    style: styleInfo, 
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    } 
  }).addTo(earthquakes);

  earthquakes.addTo(map);
 
    //info 
    var legendInfo = L.control({
      position: "bottom-right"
    });

    legendInfo.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      return div;
    };

    legendInfo.addTo(map);
 
  }); 
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

var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(map);


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

  L.geoJSON(data, {
    pointToLayer: function(geoJsonPoint, latlng) {
      return L.circleMarker(latlng, {
        radius: geoJsonPoint.properties.mag * 2.5,
        color: "red",
        // fillColor: pickColor(geoJsonPoint.features[1].geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: .5,
        weight: 1 
      });
  }
  }).addTo(map); 
     
    L.geoJSON(data, { 
        onEachFeatures: function(features, layer) {
            layer.bindPopup("Place:" + data.feature[1].properties.place + 
                            "<br> Coordinates: " + data.features[1].geometry.coordinates +
                            "<br> Magnitude: " + data.feature[1].properties.mag + 
                            "<br> Time: " + new Date(data.feature[1].properties.time));
        },
        pointToLayer: createMarker
    });

      //layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(geoMap);

    //info
    var legendInfo = L.control({
      position: "bottom-right"
    });

    legendInfo.onAdd = function () {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };

    info.addTo(geoMap);

    document.querySelector(".legend").innerHTML = showLegend();
    
  }); 
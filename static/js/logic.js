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

//function create map
function createGeoMap(earthquakesData, tectonicPlatesData) {

  //layers loop
  for (var layer in mapLayers) {
    console.log(layer + " -> " + mapLayers[layer])

    var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> " +
        " contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
        " Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: mapLayers[layer], //map-id
      accessToken: API_KEY
    })

    //baseMaps.push(layer, tileLayer);
    tileLayers.push(tileLayer);
    baseMaps[layer] = tileLayer;
  }

  var overlayMaps = {
    "Earthquakes": earthquakesData,
    "Tectonic Plates": tectonicPlatesData
  };



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
};

//retrieve earthquake & tectonic plates data from links 
 
d3.json(earthquakeLink).then(function (data) {
  console.log(data.features[1]);
  // console.log(data);

  L.geoJSON(data, {
    pointToLayer: function(geoJsonPoint, latlng) {
      return L.circleMarker(latlng, {
        radius: geoJsonPoint.properties.mag*2.5,
        // fillColor: 
      });
  }
  }).addTo(map);
 

// d3.json(tectonicPlatesLink).then(function(plateData) { 

// plates = L.geoJSON(plateData), {
//     style: function(features) {
//         return {
//             color:"orange",
//             fillColor:"white",
//             fillOpacity:.5
//         }
//     },
//     onEachFeature: function(features, layer) {
//         console.log(feature.coordinates);
//         layer.bindPopup("Tectonic Plate Name: " + data.features[1].properties.PlateName);
//     }
// } 

  function createMarker(coordinates) {

    var options = {
      color: "red",
      fillColor: pickColor(data.features[1].geometry.coordinates[2]),
      opacity: 1,
      fillOpacity: .5,
      weight: 1,
      radius: data.features[1].properties.mag * 5
    };

    return L.circleMarker(data.features[1].geometry.coordinates[0], data.features[1].geometry.coordinates[1]);
  }

    var earthquakes = L.geoJSON(data, { 
        onEachFeatures: function(features, layer) {
            layer.bindPopup("Place:" + data.feature[1].properties.place + 
                            "<br> Coordinates: " + data.features[1].geometry.coordinates +
                            "<br> Magnitude: " + data.feature[1].properties.mag + 
                            "<br> Time: " + new Date(data.feature[1].properties.time));
        },
        pointToLayer: createMarker
    });

    var plates;
    createGeoMap(earthquakes, plates);

  });
// });

// d3.json(earthquakeLink).then(createGeoMap(earthquakes, plates)); 
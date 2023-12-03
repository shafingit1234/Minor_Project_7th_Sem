const edges = [];
let slope_user = 0;
let lines_you_want = 5;
var polygonCoords = [];
var horizontalLines = [];
var markers = [];
const vertices = [];
const clipped_Line = [];
var polygon;
var map;
let user_width = document.getElementById("user_width");
const slope_entry = document.getElementById("slope_entry_id");
function initMap() {
  // Define the coordinates for the polygon vertices
  // Create the polygon with horizontal lines
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Replace with your desired center coordinates
    zoom: 10, // Adjust the zoom level as needed
  });
  // mouse click event to create user based convex polygon
  // Listen for clicks on the map

  google.maps.event.addListener(map, "click", function (event) {
    addLatLng(event.latLng);
    placeMarker(event.latLng);
  });
}
function placeMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  // Store the marker in the markers array
  markers.push(marker);
}
function addLatLng(latLng) {
  // Add the clicked point to the polygonCoords array
  // console.log("Hi");
  polygonCoords.push({
    lat: latLng.lat(),
    lng: latLng.lng(),
  });

  // Create or update the polygon on the map
  // updatePolygon();
}
function drawConvex() {
  convertPolygonCoord();
  if (polygon) {
    polygon.setMap(null);
  }
  // Create a polygon with the provided coordinates
  polygon = new google.maps.Polygon({
    paths: polygonCoords,
    map: map,
  });
}
function createPolygonWithHorizontalLines() {
  if (
    user_width.value != undefined &&
    user_width.value > 0 &&
    user_width.value != null
  ) {
    lines_you_want = user_width.value;
  } else {
    lines_you_want = 5;
  }

  if (
    slope_entry.value != undefined &&
    slope_entry.value > 0 &&
    slope_entry.value != null
  ) {
    slope_user = slope_entry.value;
  } else {
    slope_user = 0;
  }
  // Calculate the boundaries of the polygon
  var minLat = Number.POSITIVE_INFINITY;
  var maxLat = Number.NEGATIVE_INFINITY;
  var minLng = Number.POSITIVE_INFINITY;
  var maxLng = Number.NEGATIVE_INFINITY;
  polygonCoords.forEach(function (coord) {
    console.log(coord.lat + " " + coord.lng);
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });
  console.log("---------------------------------------------");
  // Calculate the latitude increment for the horizontal lines
  var latIncrement = (maxLat - minLat) / (lines_you_want + 1); // 6 because you want 5 horizontal lines

  // Initialize an array to store the coordinates of the horizontal lines
  var horizontalLines = [];
  if (slope_user == 90) {
    slope_user--;
  }
  if (slope_user > 90) {
    slope_user = slope_user % 90;
  }
  slope_user = (slope_user * Math.PI) / 180;
  let dist = Math.abs(maxLng - minLng);
  let offset = dist * Math.tan(slope_user);
  console.log(Math.tan(slope_user));
  console.log("this is offset ", offset);
  var t = 0;
  // Create 5 horizontal lines within the polygon
  i = 0;
  while (true) {
    var lineLat = minLat + i++ * latIncrement;
    if (lineLat > maxLat) {
      break;
    }
    // Define the starting and ending points of each horizontal line
    // console.log(lineLat + " " + (lineLat + offset))
    var lineStart = { lat: lineLat, lng: minLng };
    var lineEnd = { lat: lineLat + offset, lng: maxLng };

    // Create a horizontal line (Polyline)
    // if (t == 0) {

    // var horizontalLine = new google.maps.Polyline({
    //     path: [lineStart, lineEnd],
    //     map: map,
    //     // You can customize other properties of the polyline as needed
    // });
    // t++;
    // }

    // Store the starting and ending points of the horizontal line
    horizontalLines.push({ start: lineStart, end: lineEnd });
  }
  var p = 0;
  i = 0;
  while (true) {
    var lineLat = minLat - i++ * latIncrement;
    if (lineLat + offset < minLat) {
      break;
    }
    // Define the starting and ending points of each horizontal line
    console.log(
      lineLat + " " + minLng + "  " + (lineLat + offset) + " " + maxLng
    );
    var lineStart = { lat: lineLat, lng: minLng };
    var lineEnd = { lat: lineLat + offset, lng: maxLng };

    // var horizontalLine = new google.maps.Polyline({
    //     path: [lineStart, lineEnd],
    //     map: map,
    //     // You can customize other properties of the polyline as needed
    // });

    horizontalLines.push({ start: lineStart, end: lineEnd });
  }

  // Return the polygon and an array of horizontal line
  clip_the_lines(horizontalLines, map);

  return { polygon: polygon, horizontalLines: horizontalLines };
}
function findEquations() {
  let n = vertices.length;
  for (let i = 0; i < vertices.length; i++) {
    let x_1 = vertices[i % n].lat;
    let y_1 = vertices[i % n].lng;
    let x_2 = vertices[(i + 1) % n].lat;
    let y_2 = vertices[(i + 1) % n].lng;
    let slope = (y_2 - y_1) / (x_2 - x_1);
    let intercept = y_1 - slope * x_1;
    let radians = Math.atan(slope);
    edges.push({ s: slope, r: radians, c: intercept });
  }
}
function convertPolygonCoord() {
  // console.log(polygonCoords)
  for (let i = 0; i < polygonCoords.length; i++) {
    let x = polygonCoords[i].lat;
    let y = polygonCoords[i].lng;
    vertices.push({ lat: x, lng: y }); // Store the coordinates
  }
  // console.log("hi", vertices)
}
function clip_the_lines(horizontalLines, map) {
  //horizontal
  // console.log(horizontalLines[0].start);

  // console.log(vertices);
  for (let i = 0; i < horizontalLines.length; i++) {
    let temp = clipLineToPolygon(
      horizontalLines[i].start,
      horizontalLines[i].end,
      vertices
    );
    // console.log(temp);
    if (temp.length == 0) continue;
    clipped_Line.push(temp);
  }
  console.log("hi", clipped_Line);
  for (let i = 0; i < clipped_Line.length; i++) {
    var horizontalLine = new google.maps.Polyline({
      path: [clipped_Line[i][0], clipped_Line[i][1]],
      map: map,
      // You can customize other properties of the polyline as needed
    });
    console.log("bye");
  }
  // plot_clip_lines();
}
function clipLineToPolygon(lineStart, lineEnd, vertices) {
  let clippedLine = [];

  for (let i = 0; i < vertices.length; i++) {
    const edgeStart = vertices[i];
    const edgeEnd = vertices[(i + 1) % vertices.length];

    // Check if the edge intersects the line
    if (doIntersect(lineStart, lineEnd, edgeStart, edgeEnd)) {
      const intersectionPoint = calculateIntersection(
        lineStart,
        lineEnd,
        edgeStart,
        edgeEnd
      );
      if (intersectionPoint) {
        clippedLine.push(intersectionPoint);
      }
    }
  }

  return clippedLine;
}
function doIntersect(p1, q1, p2, q2) {
  const o1 = check(p1, q1, p2);
  const o2 = check(p1, q1, q2);
  const o3 = check(p2, q2, p1);
  const o4 = check(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  return false;
}
function check(p, q, r) {
  const val =
    (q.lng - p.lng) * (r.lat - q.lat) - (q.lat - p.lat) * (r.lng - q.lng);

  if (val === 0) return 0; // Collinear
  return val > 0 ? 1 : 2; // Clockwise or counterclockwise
}
function calculateIntersection(p1, q1, p2, q2) {
  const a1 = q1.lng - p1.lng;
  const b1 = p1.lat - q1.lat;
  const c1 = a1 * p1.lat + b1 * p1.lng;

  const a2 = q2.lng - p2.lng;
  const b2 = p2.lat - q2.lat;
  const c2 = a2 * p2.lat + b2 * p2.lng;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return null; // Lines are parallel
  }

  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  return { lat: x, lng: y };
}

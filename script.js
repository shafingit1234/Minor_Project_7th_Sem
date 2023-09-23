const canvas = document.getElementById("coordinateCanvas");
const ctx = canvas.getContext("2d");
const polygonVertices = []; // Generate a convex polygon
const line_start = [];
const line_end = [];
const clipped_Line = [];
const edges = [];

const line_table = document.getElementById("table_lines");
const tble = document.getElementById("table_poly");
let total_vertices = document.getElementById("numVertices");
let total_lines = document.getElementById("numLines");
let mx_left = Infinity;
let mx_right = -1;
let partition_width = -1;

//function to clear the canvas.
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  total_vertices.value = 0;
  polygonVertices.length = 0;
  mx_left = Infinity;
  mx_right = -1;
  partition_width = -1;
  line_start.length = 0;
  line_end.length = 0;
  clipped_Line.length = 0;
}
//function to clear already clipped lines and re create new clipped lines.
function clearCanvasForClipping() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mx_left = Infinity;
  mx_right = -1;
  partition_width = -1;
  drawPolygon(polygonVertices);
  line_start.length = 0;
  line_end.length = 0;
  clipped_Line.length = 0;
}

function generateConvexPolygon() {
  // console.log(total_vertices.value);
  delete_line_table();
  let numVertices = total_vertices.value;
  if (numVertices == null) {
    numVertices = 3;
  }
  // Number of vertices for the polygon
  clearCanvas();
  const radius = 150; // Radius of the polygon

  // const vertices = [];

  for (let i = 0; i < numVertices; i++) {
    const angle = (2 * Math.PI * i) / numVertices;
    const x = canvas.width / 2 + radius * Math.cos(angle);
    const y = canvas.height / 2 + radius * Math.sin(angle);
    polygonVertices.push({ x, y });
  }
  drawPolygon(polygonVertices);
  delete_poly_table();
  tble.style.display = "block";
  let tmp = tble.getElementsByTagName("tbody");
  polygonVertices.map((ele, index) => {
    let row = document.createElement("tr");
    let c_1 = document.createElement("td");
    c_1.innerText = ele.x;
    let c_2 = document.createElement("td");
    c_2.innerText = ele.y;
    row.appendChild(c_1);
    row.appendChild(c_2);
    tmp[0].appendChild(row);
  });
}
function delete_poly_table() {
  if (tble.style.display === "block") {
    // console.log("hi");
    let tbody = tble.querySelector("tbody");
    tble.removeChild(tbody);
    tbody = document.createElement("tbody");
    tble.appendChild(tbody);
  }
  tble.style.display = "none";
}
function drawPolygon(vertices) {
  if (vertices.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  mx_left = Math.min(vertices[0].x, mx_left);
  mx_right = Math.max(vertices[0].x, mx_right);
  for (let i = 1; i < vertices.length; i++) {
    mx_left = Math.min(vertices[i].x, mx_left);
    mx_right = Math.max(vertices[i].x, mx_right);
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  partition_width = mx_right - mx_left + 1;
  // console.log("partition width in drawPolygon function " + partition_width);
  ctx.closePath();
  ctx.stroke();
}
function findEquationOfLine() {
  const len = polygonVertices.length;
  for (let i = 0; i < len; i++) {
    let x_1 = polygonVertices[i].x;
    let x_2 = polygonVertices[(i + 1) % len].x;
    let y_1 = polygonVertices[i].y;
    let y_2 = polygonVertices[(i + 1) % len].y;

    let slope = (y_2 - y_1) / (x_2 - x_1);
    let intercept = y_1 - slope * x_1;
    // let arr = [];
    // console.log(slope);
    edges.push([slope, intercept]);
  }
  // console.log("No of edges " + edges.length);
}
function partitionPolygonWithParallelLines(vertices, numPartitions) {
  if (vertices.length < 3 || numPartitions < 1) return;

  // console.log("Partition width in partition algo " + partition_width);
  const partitionSpacing = partition_width / numPartitions;
  // console.log("mx left and mx right");
  // console.log(mx_left + " " + mx_right);
  // console.log("mx left and mx right ends");
  for (let i = 1; i <= numPartitions; i++) {
    const partitionX = i * partitionSpacing + mx_left;
    // console.log("partition X" + partitionX);
    // ctx.beginPath();
    line_start.push({ x: partitionX, y: 0 });
    line_end.push({ x: partitionX, y: canvas.height });
    // ctx.moveTo(partitionX, 0);
    // ctx.lineTo(partitionX, canvas.height);
    // ctx.stroke();
  }
}
function generateLines() {
  let num_lines = 3;
  if (
    total_lines.value != 3 ||
    total_lines.value != undefined ||
    total_lines.value != null
  ) {
    num_lines = total_lines.value;
  }
  clearCanvasForClipping();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log("generate Lines " + num_lines);
  partitionPolygonWithParallelLines(polygonVertices, num_lines);
  clip_the_lines();
  display_line_table();
}
function delete_line_table() {
  if (line_table.style.display === "block") {
    let tbody = line_table.querySelector("tbody");
    if (tbody) {
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
    }
  }
  line_table.style.display = "none";
}
function display_line_table() {
  delete_line_table();
  line_table.style.display = "block";
  let sub_heading_row = document.createElement("tr");
  let x_1 = document.createElement("td");
  x_1.innerText = "X_Coordinate";
  let y_1 = document.createElement("td");
  y_1.innerText = "Y_Coordinate";
  let x_2 = document.createElement("td");
  x_2.innerText = "X_Coordinate";
  let y_2 = document.createElement("td");
  y_2.innerText = "Y_Coordinate";
  sub_heading_row.appendChild(x_1);
  sub_heading_row.appendChild(y_1);
  sub_heading_row.appendChild(x_2);
  sub_heading_row.appendChild(y_2);
  line_table.getElementsByTagName("tbody")[0].appendChild(sub_heading_row);
  line_start.map((ele, index) => {
    let row = document.createElement("tr");
    let c_1 = document.createElement("td");
    let c_2 = document.createElement("td");
    let c_3 = document.createElement("td");
    let c_4 = document.createElement("td");
    c_1.innerText = line_start[index].x;
    c_2.innerText = line_start[index].y;
    c_3.innerText = line_end[index].x;
    c_4.innerText = line_end[index].y;
    row.appendChild(c_1);
    row.appendChild(c_2);
    row.appendChild(c_3);
    row.appendChild(c_4);
    line_table.querySelector("tbody").appendChild(row);
  });
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPolygon(polygonVertices);
  partitionPolygonWithParallelLines(polygonVertices, 7); // Partition the polygon into 5 parts
  clip_the_lines();
}

draw(); // Initial drawing

// function calculateIntersection(p1, p2, edgeStart, edgeEnd) {
//   const dx1 = p2.x - p1.x;
//   const dy1 = p2.y - p1.y;
//   const dx2 = edgeEnd.x - edgeStart.x;
//   const dy2 = edgeEnd.y - edgeStart.y;

//   const determinant = dx1 * dy2 - dy1 * dx2;

//   if (determinant === 0) {
//     return null; // Lines are parallel or coincident
//   }

//   const t =
//     ((edgeStart.x - p1.x) * dy2 - (edgeStart.y - p1.y) * dx2) / determinant;
//   const u =
//     -((edgeStart.x - p1.x) * dy1 - (edgeStart.y - p1.y) * dx1) / determinant;

//   if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
//     return {
//       x: p1.x + t * dx1,
//       y: p1.y + t * dy1,
//     };
//   } else {
//     return null; // Intersection point is outside the line segments
//   }
// }
function clipLineAgainstPolygon(lineStart, lineEnd, polygonVertices) {
  let clippedLine = [];
  const numVertices = polygonVertices.length;

  for (let i = 0; i < numVertices; i++) {
    const edgeStart = polygonVertices[i];
    const edgeEnd = polygonVertices[(i + 1) % numVertices];

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

  return clippedLine;
}
// Redraw when the window is resized
function clip_the_lines() {
  for (let i = 0; i < line_start.length; i++) {
    let temp = clipLineToPolygon(line_start[i], line_end[i], polygonVertices);
    if (temp.length == 0) continue;
    clipped_Line.push(temp);
  }
  // for (let i = 0; i < clipped_Line.length; i++) {
  //   console.log(clipped_Line[i]);
  // }
  plot_clip_lines();
}

function plot_clip_lines() {
  for (let i = 0; i < clipped_Line.length; i++) {
    if (clipped_Line[i].length < 2) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(clipped_Line[i][0].x, clipped_Line[i][0].y);
    ctx.lineTo(clipped_Line[i][1].x, clipped_Line[i][1].y);
    ctx.stroke();
  }
}
window.addEventListener("resize", draw);

function clipLineToPolygon(lineStart, lineEnd, polygonVertices) {
  let clippedLine = [];

  for (let i = 0; i < polygonVertices.length; i++) {
    const edgeStart = polygonVertices[i];
    const edgeEnd = polygonVertices[(i + 1) % polygonVertices.length];

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

function check(p, q, r) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val === 0) return 0; // Collinear
  return val > 0 ? 1 : 2; // Clockwise or counterclockwise
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

function calculateIntersection(p1, q1, p2, q2) {
  const a1 = q1.y - p1.y;
  const b1 = p1.x - q1.x;
  const c1 = a1 * p1.x + b1 * p1.y;

  const a2 = q2.y - p2.y;
  const b2 = p2.x - q2.x;
  const c2 = a2 * p2.x + b2 * p2.y;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return null; // Lines are parallel
  }

  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  return { x, y };
}

function drawClippedLines() {
  const lineStart = { x: 100, y: 100 };
  const lineEnd = { x: 400, y: 400 };

  const clippedLine = clipLineToPolygon(lineStart, lineEnd, polygonVertices);

  ctx.beginPath();
  ctx.moveTo(lineStart.x, lineStart.y);

  for (const point of clippedLine) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}

function reset() {
  // alert("reset");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  total_vertices.value = 0;
  polygonVertices.length = 0;
  mx_left = Infinity;
  mx_right = -1;
  partition_width = -1;
  line_start.length = 0;
  line_end.length = 0;
  clipped_Line.length = 0;
  total_lines.length = 0;
  delete_line_table();
  delete_poly_table();
}

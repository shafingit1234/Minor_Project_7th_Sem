const canvas = document.getElementById("coordinateCanvas");
const ctx = canvas.getContext("2d");
const vertices = [];
const line_start = [];
const line_end = [];
const clipped_Line = [];

const line_table = document.getElementById("table_lines");
const tble = document.getElementById("table_poly");
let total_lines = document.getElementById("numLines");
let mx_left = Infinity;
let mx_right = -1;
let partition_width = -1;
let num_of_partitions = 3;
// const clippedLine = [];

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vertices.length = 0;
  mx_left = Infinity;
  mx_right = -1;
  partition_width = -1;
  line_start.length = 0;
  line_end.length = 0;
  clipped_Line.length = 0;
}

function clearCanvasForClipping() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mx_left = Infinity;
  mx_right = -1;
  partition_width = -1;
  drawPolygon(vertices);
  line_start.length = 0;
  line_end.length = 0;
  clipped_Line.length = 0;
}
function drawConvex() {
  delete_line_table();
  drawPolygon(vertices);
  delete_poly_table();
  tble.style.display = "block";
  let tmp = tble.getElementsByTagName("tbody");
  vertices.map((ele, index) => {
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
  if (!isConvex(vertices)) {
    // console.error("A polygon needs at least 3 vertices.");
    alert("Polygon drawn is not convex, Try Again!!");
    reset();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  mx_left = Math.min(mx_left, vertices[0].x);
  mx_right = Math.max(mx_right, vertices[0].x);
  for (let i = 1; i < vertices.length; i++) {
    mx_left = Math.min(mx_left, vertices[i].x);
    mx_right = Math.max(mx_right, vertices[i].x);
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  partition_width = mx_right - mx_left + 1;
  // Connect last vertex to the first to close the polygon
  ctx.lineTo(vertices[0].x, vertices[0].y);

  ctx.closePath();
  ctx.stroke();
}
function isConvex(vertices) {
  if (vertices.length < 3) {
    console.error("A polygon needs at least 3 vertices.");
    return false;
  }

  let isPositive = false;
  let isNegative = false;

  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % n];
    const p3 = vertices[(i + 2) % n];

    const crossProduct = crossProductZ(p1, p2, p3);

    if (crossProduct > 0) {
      isPositive = true;
    } else if (crossProduct < 0) {
      isNegative = true;
    }

    // If both signs are encountered, the polygon is not convex
    if (isPositive && isNegative) {
      return false;
    }
  }

  // If all cross products have the same sign, the polygon is convex
  return true;
}

function crossProductZ(p1, p2, p3) {
  // Calculate the cross product in the z-direction
  return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}
// Call the drawPolygon function with the defined vertices
// drawPolygon(vertices);

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  vertices.push({ x, y }); // Store the coordinates
  drawPoint(x, y); // Draw the point on the canvas
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
  //   clearCanvasForClipping();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log("generate Lines " + num_lines);
  if (
    total_lines.value != 3 ||
    total_lines.value != undefined ||
    total_lines.value != null
  ) {
    num_of_partitions = total_lines.value;
  }
  clearCanvasForClipping();
  partitionPolygonWithParallelLines(vertices, num_of_partitions);
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
function clip_the_lines() {
  for (let i = 0; i < line_start.length; i++) {
    let temp = clipLineToPolygon(line_start[i], line_end[i], vertices);
    if (temp.length == 0) continue;
    clipped_Line.push(temp);
  }
  // for (let i = 0; i < clipped_Line.length; i++) {
  //   console.log(clipped_Line[i]);
  // }
  plot_clip_lines();
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
function clipLineAgainstPolygon(lineStart, lineEnd, vertices) {
  let clippedLine = [];
  const numVertices = vertices.length;

  for (let i = 0; i < numVertices; i++) {
    const edgeStart = vertices[i];
    const edgeEnd = vertices[(i + 1) % numVertices];

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

function reset() {
  // alert("reset");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vertices.length = 0;
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
canvas.addEventListener("click", handleCanvasClick);

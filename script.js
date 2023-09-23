const canvas = document.getElementById("coordinateCanvas");
const ctx = canvas.getContext("2d");
const polygonVertices = []; // Generate a convex polygon
const line_start = [];
const line_end = [];
const clipped_Line = [];
const edges = [];
let total_vertices = document.getElementById("numVertices");
let total_lines = document.getElementById("numLines");
console.log(total_vertices.value);
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  polygonVertices.length = 0;
}
function generateConvexPolygon() {
  let numVertices = total_vertices.value | 3;
  // Number of vertices for the polygon

  const radius = 150; // Radius of the polygon
  clearCanvas();
  // const vertices = [];

  for (let i = 0; i < numVertices; i++) {
    const angle = (2 * Math.PI * i) / numVertices;
    const x = canvas.width / 2 + radius * Math.cos(angle);
    const y = canvas.height / 2 + radius * Math.sin(angle);
    polygonVertices.push({ x, y });
  }
  drawPolygon(polygonVertices);
  const tble = document.getElementById("table_poly");
  console.log(tble);
  if (tble.style.display === "block") {
    console.log("hi");
    // let tbdy = tble.getElementsByTagName("tbody");
    let tbody = tble.querySelector("tbody");
    // let tbl = tble.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    // console.log(tbl);
    // let sze = tbl.length;
    // for (let i = sze - 1; i >= 0; i--) {
    //   tbdy.deleteRow(i);
    // }
    tble.removeChild(tbody);
    tbody = document.createElement("tbody");
    tble.appendChild(tbody);
  }
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
  // return vertices;
}
let mx_left = Infinity;
let mx_right = -1;
let partition_width = -1;
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
  console.log("No of edges " + edges.length);
}
function partitionPolygonWithParallelLines(vertices, numPartitions) {
  if (vertices.length < 3 || numPartitions < 1) return;

  const partitionSpacing = partition_width / (numPartitions + 1);
  console.log(mx_left + " " + mx_right);
  for (let i = 1; i <= numPartitions; i++) {
    const partitionX = i * partitionSpacing + mx_left;

    // ctx.beginPath();
    line_start.push({ x: partitionX, y: 0 });
    line_end.push({ x: partitionX, y: canvas.height });
    // ctx.moveTo(partitionX, 0);
    // ctx.lineTo(partitionX, canvas.height);
    // ctx.stroke();
  }
}
function generateLines() {
  let num_lines = total_lines | 3;
  partitionPolygonWithParallelLines(polygonVertices, num_lines);
  clip_the_lines();
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
  for (let i = 0; i < clipped_Line.length; i++) {
    console.log(clipped_Line[i]);
  }
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

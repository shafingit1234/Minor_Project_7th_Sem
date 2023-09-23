const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");

const coordinates_x = [];
const coordinates_y = [];
const edges = [];
const points = [];
function findEquationOfLine() {
  const len = coordinates_x.length;
  for (let i = 0; i < len; i++) {
    let x_1 = coordinates_x[i];
    let x_2 = coordinates_x[(i + 1) % len];
    let y_1 = coordinates_y[i];
    let y_2 = coordinates_y[(i + 1) % len];

    let slope = (y_2 - y_1) / (x_2 - x_1);
    let intercept = y_1 - slope * x_1;
    // let arr = [];
    // console.log(slope);
    edges.push([slope, intercept]);
  }
  console.log("No of edges " + edges.length);
}

function findPoints() {
  findEquationOfLine();
  let idx = findFarthestPoint();
  console.log("farthest point " + idx);
  let intercept_1 = edges[0][1];
  // console.log("Intercept_1" + intercept_1);
  const intercept_2 = coordinates_y[idx] - coordinates_x[idx] * edges[0][0];
  // console.log("Intercept_2" + intercept_2);
  let intercept = (intercept_2 - intercept_1) / 100;
  console.log("Value of the intercept chosen is " + intercept);
  intercept_1 = intercept_1 + intercept;
  let slope = edges[0][0];
  let start = 1;
  let end = edges.length - 1;
  let start_idx_coordinate = 2; //correspond to e1
  let end_idx_coordinate = coordinates_x.length - 1; //correspond to e2
  let count = 0;
  while (start_idx_coordinate <= end_idx_coordinate && start <= end) {
    count++;
    let p1 = findPointOfIntersection(edges[start], [slope, intercept_1]);
    let p2 = findPointOfIntersection(edges[end], [slope, intercept_1]);
    // p1[0] = p1[0] | 0;
    // p1[1] = p1[0] | 0;
    // p2[0] = p2[0] | 0;
    // p2[1] = p2[0] | 0;
    // console.log("-----------------------------");
    // console.log("p1" + " " + p1[0] + " " + p1[1]);
    // console.log("p2" + " " + p2[0] + " " + p2[1]);
    // console.log("---------------------------");

    let check_start = validStartPoint(p1, start_idx_coordinate);
    console.log("check_start " + check_start);
    let check_end = validEndPoint(p2, end_idx_coordinate);
    console.log("check_end " + check_end);
    if (check_start == true && check_end == true) {
      points.push([p1, p2]);
      intercept_1 += intercept;
      continue;
    }
    if (check_start == false) {
      start_idx_coordinate++;
      start++;
    }
    if (check_end == false) {
      end_idx_coordinate--;
      end--;
    }
  }
  console.log("count " + count);
  const btn = document.getElementById("crt-plot-points");
  if (points.length > 0) {
    btn.style.display = "inline";
    console.log("POINTS FOUND");
  } else {
    alert("Unable to find satisfiable points!!");
  }
  for (let index = 0; index < points.length; index++) {
    let pnt1 = points[index][0];
    let pnt2 = points[index][1];
    console.log("Pnt1");
    console.log(pnt1[0] + " " + pnt1[1]);
    console.log("Pnt2");
    console.log(pnt2[0] + " " + pnt2[1]);
  }
}

function findPointOfIntersection(e1, e2) {
  let slope_1 = e1[0];
  let intercept_1 = e1[1];

  let slope_2 = e2[0];
  let intercept_2 = e2[1];

  let x = (intercept_1 - intercept_2) / (slope_2 - slope_1);
  let y = x * slope_1 + intercept_1;

  return [x, y];
}
function validEndPoint(point, idx) {
  let len = coordinates_x.length;
  let x_1 = coordinates_x[idx];
  let x_2 = coordinates_x[(idx + 1) % len];

  let y_1 = coordinates_y[idx];
  let y_2 = coordinates_y[(idx + 1) % len];

  let x_3 = point[0];
  let y_3 = point[1];
  // console.log("valid point function starts");
  // console.log(x_1 + " " + y_1);
  // console.log(x_2 + " " + y_2);
  // console.log(x_3 + " " + y_3);
  let dist_1 = Math.sqrt((x_1 - x_3) * (x_1 - x_3) + (y_1 - y_3) * (y_1 - y_3));
  let dist_2 = Math.sqrt((x_2 - x_3) * (x_2 - x_3) + (y_2 - y_3) * (y_2 - y_3));
  let dist = Math.sqrt((x_1 - x_2) * (x_1 - x_2) + (y_1 - y_2) * (y_1 - y_2));
  console.log("-------- distance start --------");
  console.log(dist_1 + dist_2 + " " + dist);
  console.log("-------- distance end --------");
  if (
    dist_1.toFixed(3) < dist.toFixed(3) &&
    dist_2.toFixed(3) < dist.toFixed(3)
  ) {
    return true;
  }
  return false;
}

function validStartPoint(point, idx) {
  let x_1 = coordinates_x[idx];
  let x_2 = coordinates_x[idx - 1];

  let y_1 = coordinates_y[idx];
  let y_2 = coordinates_y[idx - 1];

  let x_3 = point[0];
  let y_3 = point[1];
  // console.log("valid point function starts");
  // console.log(x_1 + " " + y_1);
  // console.log(x_2 + " " + y_2);
  // console.log(x_3 + " " + y_3);
  let dist_1 = Math.sqrt((x_1 - x_3) * (x_1 - x_3) + (y_1 - y_3) * (y_1 - y_3));
  let dist_2 = Math.sqrt((x_2 - x_3) * (x_2 - x_3) + (y_2 - y_3) * (y_2 - y_3));
  let dist = Math.sqrt((x_1 - x_2) * (x_1 - x_2) + (y_1 - y_2) * (y_1 - y_2));
  console.log("-------- distance start --------");
  console.log(dist_1 + dist_2 + " " + dist);
  console.log("-------- distance end --------");
  if (
    dist_1.toFixed(3) < dist.toFixed(3) &&
    dist_2.toFixed(3) < dist.toFixed(3)
  ) {
    return true;
  }
  return false;
}

function findFarthestPoint() {
  const chosen_edge = edges[0];
  let dist = -1;
  let x_idx = -1;
  let y_idx = -1;
  for (let i = 2; i < coordinates_x.length; i++) {
    let x = coordinates_x[i];
    let y = coordinates_y[i];
    let new_dist_1 = Math.sqrt(
      (x - coordinates_x[0]) * (x - coordinates_x[0]) +
        (y - coordinates_y[0]) * (y - coordinates_y[0])
    );
    let new_dist_2 = Math.sqrt(
      (x - coordinates_x[1]) * (x - coordinates_x[1]) +
        (y - coordinates_y[1]) * (y - coordinates_y[1])
    );
    if (dist < new_dist_1) {
      dist = new_dist_1;
      x_idx = i;
      y_idx = i;
    }
    if (dist < new_dist_2) {
      dist = new_dist_2;
      x_idx = i;
      y_idx = i;
    }
  }
  return x_idx;
}

function pointPlots() {
  console.log("Point plots function called!!");
  console.log(points);
  ctx.beginPath();
  console.log("Hello Hello " + points[0][0][0] + " " + points[0][0][1]);
  ctx.moveTo(points[0][0][0], points[0][0][1]);
  ctx.lineTo(points[0][1][0], points[0][1][0]);

  for (i = 1; i < points.length; i++) {
    let x_1 = points[i][0][0];
    let x_2 = points[i][0][1];
    let y_1 = points[i][1][0];
    let y_2 = points[i][1][1];

    ctx.moveTo(x_1, y_1);
    ctx.lineTo(x_2, y_2);
  }
  ctx.closePath();
  ctx.strokeStyle = "brown";
  ctx.stroke();
}

//functions for creating convex polygon

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  coordinates_x.push(x);
  coordinates_y.push(y);
}

function checkConvex() {
  if (isConvex() == false) {
    alert("Inputs chosen are not forming a convex polygon!!");
    coordinates_x.length = 0;
    coordinates_y.length = 0;
  } else {
    const get_reslt_btn = document.getElementById("btn-result");
    get_reslt_btn.style.display = "inline";
  }
}

const isConvex = () => {
  const length = coordinates_x.length;
  let pre = 0,
    curr = 0;
  for (let i = 0; i < length; ++i) {
    let dx1 = coordinates_x[(i + 1) % length] - coordinates_x[i];
    let dx2 = coordinates_x[(i + 2) % length] - coordinates_x[(i + 1) % length];
    let dy1 = coordinates_y[(i + 1) % length] - coordinates_y[i];
    let dy2 = coordinates_y[(i + 2) % length] - coordinates_y[(i + 1) % length];
    curr = dx1 * dy2 - dx2 * dy1;
    if (curr != 0) {
      if ((curr > 0 && pre < 0) || (curr < 0 && pre > 0)) return false;
      else pre = curr;
    }
  }
  return true;
};

function getResults() {
  const div_result = document.getElementById(" result");
  console.log(div_result);
  div_result.style.display = "block";
  const get_table = document.getElementById("tbl");
  get_table.style.display = "block";
  coordinates_x.map((ele, index) => {
    let row = document.createElement("tr");
    let c_1 = document.createElement("td");
    c_1.innerText = ele;
    let c_2 = document.createElement("td");
    c_2.innerText = coordinates_y[index];
    row.appendChild(c_1);
    row.appendChild(c_2);
    get_table.appendChild(row);
  });
  const temp = document.getElementById("crt-polygon");
  temp.style.display = "inline";
}

function createPolygon() {
  ctx.beginPath();
  ctx.moveTo(coordinates_x[0], coordinates_y[0]);

  const length = coordinates_x.length;
  for (let i = 1; i < length; i++) {
    ctx.lineTo(coordinates_x[i], coordinates_y[i]);
  }
  ctx.lineTo(coordinates_x[0], coordinates_y[0]);
  ctx.closePath();
  ctx.strokeStyle = "Red";
  ctx.stroke();
  const btn = document.getElementById("crt-points");
  btn.style.display = "inline";
}
let canvasElem = document.querySelector("canvas");

canvasElem.addEventListener("mousedown", function (e) {
  getMousePosition(canvasElem, e);
});

function drawParallelLines() {
  const parallelDistance = 100;
  const canvas = document.getElementById("cnv");
  const ctx = canvas.getContext("2d");
  const directionVectorX = coordinates_x[0] - coordinates_x[1];
  const directionVectorY = coordinates_y[0] - coordinates_y[1];
  const length = Math.sqrt(
    directionVectorX * directionVectorX + directionVectorY * directionVectorY
  );

  const unitVectorX = directionVectorX / length;
  const unitVectorY = directionVectorY / length;

  for (let i = 0; i < 5; i++) {
    const offsetX = unitVectorY * parallelDistance * i;
    const offsetY = -unitVectorX * parallelDistance * i;

    ctx.beginPath();
    for (let j = 0; j < coordinates_x.length; j += coordinates_x.length - 1) {
      const x = coordinates_x[j] + offsetX;
      const y = coordinates_y[j] + offsetY;
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

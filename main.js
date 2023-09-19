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
    console.log(slope);
    edges.push([slope, intercept]);
  }
}

function findPoints() {
  findEquationOfLine();
  const m1 = edges[0][0];
  const c1 = edges[0][1];
  for (let i = 1; i < edges.length; i++) {
    let m2 = edges[i][0];
    let c2 = edges[i][1];
    let x_new = (c2 - c1) / (m1 - m2);
    let y_new = m2 * x_new + c2;
    points.push([x_new, y_new]);
  }
  points.map((ele) => {
    console.log(ele[0] + " " + ele[1]);
  });
  const btn = document.getElementById("crt-plot-points");
  btn.style.display = "inline";
}

function pointPlots() {
  const canvas = document.getElementById("cnv");
  const ctx = canvas.getContext("2d");
  for (i = 0; i < points.length - 1; i++) {
    let x_1 = points[i][0];
    let x_2 = points[i + 1][0];
    let y_1 = points[i][1];
    let y_2 = points[i + 1][1];
    ctx.beginPath();
    ctx.moveTo(x_1, y_1);
    ctx.lineTo(x_2, y_2);
    ctx.stroke();
  }
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
  const canvas = document.getElementById("cnv");
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(coordinates_x[0], coordinates_y[0]);

  const length = coordinates_x.length;
  for (let i = 1; i < length; i++) {
    ctx.lineTo(coordinates_x[i], coordinates_y[i]);
  }
  ctx.lineTo(coordinates_x[0], coordinates_y[0]);
  ctx.stroke();
  const btn = document.getElementById("crt-points");
  btn.style.display = "inline";
}
let canvasElem = document.querySelector("canvas");

canvasElem.addEventListener("mousedown", function (e) {
  getMousePosition(canvasElem, e);
});

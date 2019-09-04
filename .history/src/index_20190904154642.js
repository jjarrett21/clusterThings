const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const height = 400;
const width = 400;
const data = [
  [1, 2],
  [2, 1],
  [2, 4],
  [1, 3],
  [2, 2],
  [3, 1],
  [1, 1],

  [7, 3],
  [8, 2],
  [6, 4],
  [7, 4],
  [8, 1],
  [9, 2],

  [10, 8],
  [9, 10],
  [7, 8],
  [7, 9],
  [8, 11],
  [9, 9]
];
const means = [];
const assignments = [];
const dataExtremes = 0;
const dataRange = 0;
const drawDelay = 2000;

const setup = () => {
  dataExtremes = getDataExtremes(data);
  dataRange = getDataRanges(dataExtremes);
  means = initMeans(3);

  makeAssignments();
  draw();

  setTimeout(run, drawDelay);
};

const getDataRanges = extremes => {
  const ranges = [];

  for (const dimension in extremes) {
    ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
  }

  return ranges;
};

const getDataExtremes = points => {
  const extremes = [];

  for (const i in data) {
    const point = data[i];

    for (const dimension in point) {
      if (!extremes[dimension]) {
        extremes[dimension] = { min: 1000, max: 0 };
      }

      if (point[dimension] < extremes[dimension].min) {
        extremes[dimension].min = point[dimension];
      }

      if (point[dimension] > extremes[dimension].max) {
        extremes[dimension].max = point[dimension];
      }
    }
  }

  return extremes;
};

const initMeans = k => {
  if (!k) {
    k = 3;
  }

  while (k--) {
    const mean = [];

    for (const dimension in dataExtremes) {
      mean[dimension] =
        dataExtremes[dimension].min + Math.random() * dataRange[dimension];
    }

    means.push(mean);
  }

  return means;
};

const makeAssignments = () => {
  for (const i in data) {
    const point = data[i];
    const distances = [];

    for (const j in means) {
      const mean = means[j];
      const sum = 0;

      for (const dimension in point) {
        const difference = point[dimension] - mean[dimension];
        difference *= difference;
        sum += difference;
      }

      distances[j] = Math.sqrt(sum);
    }

    assignments[i] = distances.indexOf(Math.min.apply(null, distances));
  }
};

const moveMeans = () => {
  makeAssignments();

  const sums = Array(means.length);
  const counts = Array(means.length);
  const moved = false;

  for (const j in means) {
    counts[j] = 0;
    sums[j] = Array(means[j].length);
    for (const dimension in means[j]) {
      sums[j][dimension] = 0;
    }
  }

  for (const point_index in assignments) {
    const mean_index = assignments[point_index];
    const point = data[point_index];
    const mean = means[mean_index];

    counts[mean_index]++;

    for (const dimension in mean) {
      sums[mean_index][dimension] += point[dimension];
    }
  }

  for (const mean_index in sums) {
    console.log(counts[mean_index]);
    if (0 === counts[mean_index]) {
      sums[mean_index] = means[mean_index];
      console.log("Mean with no points");
      console.log(sums[mean_index]);

      for (const dimension in dataExtremes) {
        sums[mean_index][dimension] =
          dataExtremes[dimension].min + Math.random() * dataRange[dimension];
      }
      continue;
    }

    for (const dimension in sums[mean_index]) {
      sums[mean_index][dimension] /= counts[mean_index];
    }
  }

  if (means.toString() !== sums.toString()) {
    moved = true;
  }

  means = sums;

  return moved;
};

const run = () => {
  const moved = moveMeans();
  draw();

  if (moved) {
    setTimeout(run, drawDelay);
  }
};
const draw = () => {
  ctx.clearRect(0, 0, width, height);

  ctx.globalAlpha = 0.3;
  for (const point_index in assignments) {
    const mean_index = assignments[point_index];
    const point = data[point_index];
    const mean = means[mean_index];

    ctx.save();

    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(
      (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2)),
      (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2))
    );
    ctx.lineTo(
      (mean[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2)),
      (mean[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2))
    );
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
  ctx.globalAlpha = 1;

  for (const i in data) {
    ctx.save();

    const point = data[i];

    const x =
      (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2));
    const y =
      (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2));

    ctx.strokeStyle = "#333333";
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  for (const i in means) {
    ctx.save();

    const point = means[i];

    const x =
      (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2));
    const y =
      (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2));

    ctx.fillStyle = "green";
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }
};

setup();

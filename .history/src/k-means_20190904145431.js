var data = [
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
      extremes[dimension] = !extremes[dimension] ? { min: 1000, max: 0 } : null;
      extremes[dimension].min =
        point[dimension] < extremes[dimension].min ? point[dimension] : null;
      extremes[dimension].max =
        point[dimension] > extremes[dimension].max ? point[dimension] : null;
    }
  }
  return extremes;
};

const initMeans = (k) => {
  if(!k) {
    k = 3
  };

  while(k--) {
    const mean = []
  }

  for(var dimension in dataExtremes )
}

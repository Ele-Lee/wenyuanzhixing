export function randomHexColor() {
  let hex = Math.floor(Math.random() * 0xffffff).toString(16);
  while (hex.length < 6) {
    hex = "0" + hex;
  }
  return "#" + hex;
}

export const workerChange = function () {
  self.onmessage = function (e) {
    const newData = nextChangeData(e.data.payload);
    postMessage({
      type: e.data.type,
      payload: newData,
    });
  };

  function nextChangeData(data) {
    Object.keys(data).forEach((key) => {
      data[key] = changeColor(data[key]);
    });
    return data;
  }

  function changeColor(originColor) {
    originColor = rgb2Hex(originColor);
    const newColor = randomHexColor();
    if (originColor === newColor) {
      return changeColor(originColor);
    }
    return newColor;
  }

  function randomHexColor() {
    let hex = Math.floor(Math.random() * 0xffffff).toString(16);
    while (hex.length < 6) {
      hex = "0" + hex;
    }
    return "#" + hex;
  }
  function rgb2Hex(rgb) {
    if (/^rgb\((\d{1,3}\,){2}\d{1,3}\)$/i.test(rgb)) {
      let hex = "#";
      rgb.replace(/\d{1,3}/g, function (kw) {
        kw = parseInt(kw).toString(16);
        kw = kw.length < 2 ? 0 + kw : kw;
        hex += kw;
      });
      return hex;
    } else {
      return rgb;
    }
  }
};

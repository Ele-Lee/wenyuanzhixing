export function randomHexColor() {
  let hex = Math.floor(Math.random() * 0xffffff).toString(16);
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  return '#' + hex;
}

export const aniClassNamePre = 'span-ani--';

export const workerChange = function () {
  self.onmessage = function (e) {
    const newData = nextChangeData(e.data.payload);

    postMessage({
      type: e.data.type,
      payload: newData,
    });
  };

  function nextChangeData(data) {
    const animationStartColor = randomHexColor();
    const cssStrMap = {};
    const aniClassNamePre = 'span-ani--';
    const makeCssTemplate = targetColor => {
      const tmp = targetColor.replace('#', '');
      return `
      .${aniClassNamePre}${tmp} {
        animation-duration: 2s;
        animation-name: hueRotate-${tmp};
      }
      
      @keyframes hueRotate-${tmp} {
        0% {
          filter: hue-rotate(0);
          background: ${animationStartColor};
        }
      
        100% {
          filter: hue-rotate(720deg);
          background: ${targetColor};
        }
      }
      `;
    };
    Object.keys(data).forEach(key => {
      const newColor = changeColor(data[key]);
      data[key] = newColor;
      cssStrMap[key] = makeCssTemplate(newColor);
    });
    return { data, cssStrMap };
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
      hex = '0' + hex;
    }
    return '#' + hex;
  }
  function rgb2Hex(rgb) {
    if (/^rgb\((\d{1,3}\,){2}\d{1,3}\)$/i.test(rgb)) {
      let hex = '#';
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

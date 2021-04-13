export function randomHexColor() {
  let hex = Math.floor(Math.random() * 0xffffff).toString(16);
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  return '#' + hex;
}

export function changeColor(originColor) {
  originColor = rgb2Hex(originColor);
  const newColor = randomHexColor();
  if (originColor === newColor) {
    return changeColor(originColor);
  }
  return newColor;
}

export function rgb2Hex(rgb) {
  if (/^rgb\((\d{1,3}\,){2}\d{1,3}\)$/i.test(rgb)) {
    //test RGB
    let hex = '#'; //定义十六进制颜色变量
    rgb.replace(/\d{1,3}/g, function (kw) {
      //提取rgb数字
      kw = parseInt(kw).toString(16); //转为十六进制
      kw = kw.length < 2 ? 0 + kw : kw; //判断位数，保证两位
      hex += kw; //拼接
    });
    return hex; //返回十六进制
  } else {
    return rgb; //输入格式错误,返回#000
  }
}

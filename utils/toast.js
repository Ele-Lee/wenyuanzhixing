const wrapId = 'toast-wrap';
const toastClassNameForContent = 'toast-instance__content';
const toastClassNameForContrainer = 'toast-instance__container';

const toastClassNameForAniStart = 'animate__animated';
const toastClassNameForOut = 'animate__fadeOutUp';
const toastClassNameForIn = 'animate__fadeInDown';

export default class Toast {
  constructor(t = 1000) {
    this.time = t;

    this.wrap = null;
    this.aniTime = 0;
  }

  initWrap() {
    if (this.wrap) return;
    const wrap = document.createElement('div');
    wrap.id = wrapId;

    document.body.appendChild(wrap);

    this.wrap = wrap;

    // 进场动画时间
    try {
      this.aniTime =
        parseInt(
          getComputedStyle(document.querySelector('body')).getPropertyValue(
            '--animate-duration'
          )
        ) * 1000;
    } catch (error) {}
  }

  show(txt) {
    this.initWrap();

    const item1 = document.createElement('div');

    const aniList = [toastClassNameForAniStart, toastClassNameForIn];
    item1.classList.add(toastClassNameForContrainer, ...aniList);

    const item2 = document.createElement('div');
    item2.className = toastClassNameForContent;
    item2.innerText = txt;

    item1.appendChild(item2);

    this.wrap.appendChild(item1);

    setTimeout(() => {
      // item1.classList.remove(...aniList);
      // item1.className = toastClassNameForContrainer;
      this.hide(item1);
    }, this.aniTime);
  }

  hide(dom) {
    // dom.classList.add(toastClassNameForAniStart, toastClassNameForOut);
    setTimeout(() => {
      this.play(dom, false);
      this.removeDom(dom);
    }, this.time);
  }

  removeDom(dom) {
    setTimeout(() => {
      this.wrap.removeChild(dom);
    }, this.aniTime);
  }

  play(dom, isIn) {
    const animateClassName = isIn ? toastClassNameForIn : toastClassNameForOut;
    dom.className = toastClassNameForContrainer;
    window.requestAnimationFrame(function (time) {
      window.requestAnimationFrame(function (time) {
        dom.className = `${toastClassNameForContrainer} ${toastClassNameForAniStart} ${animateClassName}`;
      });
    });
  }
}

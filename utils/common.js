export function setTextInTag(tagType, context, id) {
  let tag, hadTag;
  if (id) {
    hadTag = document.getElementById(id);
  }
  if (hadTag) {
    tag = hadTag;
  } else {
    tag = document.createElement(tagType);
    if (tagType === 'script') {
      tag.setAttribute('defer', '*');
    } else {
      tag.type = 'text/css';
    }
    !!id && tag.setAttribute('id', id);
  }
  if (hadTag) {
    tag.textContent = '';
    tag.textContent = context;
  } else {
    tag.appendChild(document.createTextNode(context));
    const head = document.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(tag);
    }
  }
}

export function playAnimationByDom(spanTag, aniClass) {
  spanTag.className = '';
  window.requestAnimationFrame(function (time) {
    window.requestAnimationFrame(function (time) {
      spanTag.className = aniClass;
      // spanTag.style.backgroundColor = preColorMap[key];
    });
  });
}

export function throttle(fn, wait) {
  let canRun = true;
  return (...args) => {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, wait);
  };
}

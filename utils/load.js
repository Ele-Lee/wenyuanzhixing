import { useEffect } from 'react';
export function useLoadScript(url, cb, delay = 0) {
  useEffect(() => {
    if (!url) {
      cb && cb(null);
    }
    setTimeout(() => {
      loadScript(url).then(id => {
        cb && cb(id);
      });
    }, delay);
  }, []);
}

export function loadScript(url, id) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    !!id && (script.id = id);
    script.onload = script.onreadystatechange = function () {
      if (
        !this.readyState ||
        this.readyState == 'loaded' ||
        this.readyState == 'complete'
      ) {
        resolve(id);
        script.onload = script.onreadystatechange = null;
      }
    };
    script.onerror = function () {
      reject(null);
    };
    document.body.appendChild(script);
    //document.getElementsByTagName('body')[0].appendChild(script);
  });
}

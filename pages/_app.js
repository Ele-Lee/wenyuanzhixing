import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/toast.css';
import Toast from '../utils/toast';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    window.myToast = new Toast();
    window.showToast = showToast;
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;

function showToast(msg, duration = 1000) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText =
    'font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;';
  document.body.appendChild(m);
  setTimeout(function () {
    var d = 0.5;
    m.style.opacity = '0';
    setTimeout(function () {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
}

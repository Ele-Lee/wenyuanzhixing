import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { useLoadScript } from '../utils/load';
import IntInput from '../components/IntInput';
import styles from '../styles/home.module.css';

const defaultWrapData = { width: 60, height: 60 };
export default function Home() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState('正在读取网格页...');

  const [wrapData, setWrapData] = useState(defaultWrapData);

  const onInputChangeByKey = key => e => {
    if (!defaultWrapData.hasOwnProperty(key)) {
      throw 'no this key';
    }
    setWrapData(pre => ({ ...pre, [key]: e.target.value }));
  };

  /**
   * 模拟题目要求1中的  “页面加载时” 。。。
   */
  useLoadScript(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/_next/static/chunks/pages/grid.js'
      : '',
    () => {
      setLoadingText('网格页代码已读取');
    },
    1000
  );

  return (
    <div className={styles.inputBox}>
      <div>
        长：
        <IntInput
          onChange={onInputChangeByKey('width')}
          value={wrapData.width}
        />
      </div>
      <div>
        高：
        <IntInput
          onChange={onInputChangeByKey('height')}
          value={wrapData.height}
        />
      </div>
      <div className={styles.last}>
        <button
          onClick={() => {
            if (wrapData.width && wrapData.height) {
              router.push(
                '/grid' + qs.stringify(wrapData, { addQueryPrefix: true })
              );
            } else {
              window.alert('先输入两个有效值');
            }
          }}
        >
          next
        </button>
      </div>
      <h5>{loadingText}</h5>
    </div>
  );
}

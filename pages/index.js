import { useState } from 'react';
import IntInput from '../components/IntInput';
import { useRouter } from 'next/router';
import qs from 'qs';

const defaultWrapData = { width: '', height: '' };
export default function Home() {
  const router = useRouter();

  const [wrapData, setWrapData] = useState(defaultWrapData);

  const onInputChangeByKey = key => e => {
    if (!defaultWrapData.hasOwnProperty(key)) {
      throw 'no this key';
    }
    setWrapData(pre => ({ ...pre, [key]: e.target.value }));
  };

  return (
    <div>
      长：
      <IntInput onChange={onInputChangeByKey('width')} value={wrapData.width} />
      高：
      <IntInput
        onChange={onInputChangeByKey('height')}
        value={wrapData.height}
      />
      <button
        onClick={() => {
          if (wrapData.width && wrapData.height) {
            router.replace(
              '/grid' + qs.stringify(wrapData, { addQueryPrefix: true })
            );
          } else {
            window.alert('先输入两个有效值');
          }
        }}
      >
        提交
      </button>
    </div>
  );
}

Home.getInitialProps = () => {
  return {
    aa: 1,
  };
};

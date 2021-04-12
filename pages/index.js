import { useState } from "react";
import IntInput from "../components/IntInput";
import styles from "../styles/Home.module.css";

const defaultWrapData = { width: "", height: "" };
export default function Home() {
  const [wrapData, setWrapData] = useState(defaultWrapData);

  const onInputChangeByKey = (key) => (e) => {
    if (!defaultWrapData.hasOwnProperty(key)) {
      throw "no this key";
    }
    setWrapData((pre) => ({ ...pre, [key]: e.target.value }));
  };

  return (
    <div>
      长：
      <IntInput onChange={onInputChangeByKey("width")} value={wrapData.width} />
      高：
      <IntInput
        onChange={onInputChangeByKey("height")}
        value={wrapData.height}
      />
      <button>提交</button>
    </div>
  );
}

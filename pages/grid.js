import { useLayoutEffect, useEffect, useRef } from "react";
import { randomHexColor, workerChange } from "../utils/color";
import { workerChangeSum } from "../utils/calc";
import WebWorker from "../utils/worker";
import styles from "../styles/grid.module.css";

const makeMatrix = (row, col) => {
  return Array.from({ length: row }, (k) => new Int16Array(col));
};

const getMatrixIdxByAttr = (e) => {
  try {
    const curIdxStr = e.target.attributes["data-idx"].value;
    return { idxList: curIdxStr.split("-"), attrStr: curIdxStr };
  } catch (error) {
    console.error(error, e.target);
    return null;
  }
};

const getMatrixValue = (arr, idxList) => {
  return arr[idxList[0]][idxList[1]];
};

const toggleMatrixValue = (arr, idxList) => {
  arr[idxList[0]][idxList[1]] ^= 1;
  return arr[idxList[0]][idxList[1]];
};

export default function Grid({ query }) {
  const matrixDataRef = useRef(makeMatrix(+query.width, +query.height));
  const recordSpanTagRef = useRef({});
  const countRef = useRef(0);

  const { dispatch } = useChangeColor(recordSpanTagRef.current);

  const { getSumByWorkder } = useCalcNum(({ sum, orderId }) => {
    if (orderId === countRef.current) {
      window.myToast.show(`当前岛屿数量：${sum}`);
    }
  });

  const matrixData = matrixDataRef.current;
  const _handle = (e, isLeft) => {
    const { idxList, attrStr } = getMatrixIdxByAttr(e);
    const setChange = () => {
      toggleMatrixValue(matrixData, idxList);

      getSumByWorkder(matrixData, ++countRef.current);
    };

    if (!idxList) return;
    const isNone = getMatrixValue(matrixData, idxList);

    const targetSpan = e.target;
    if (!isNone && isLeft) {
      Reflect.set(recordSpanTagRef.current, attrStr, targetSpan);
      const colorResult = randomHexColor();
      dispatch("prechange", { [attrStr]: colorResult });
      targetSpan.style.backgroundColor = colorResult;
      setChange();
    } else if (!isLeft) {
      Reflect.deleteProperty(recordSpanTagRef.current, attrStr, targetSpan);
      dispatch("removeKey", attrStr);
      targetSpan.style.backgroundColor = "";
      setChange();
    }
  };

  const leftClick = (e) => {
    if (e.target.tagName.toLocaleLowerCase() !== "span") return;
    _handle(e, true);
  };

  const rightClick = (e) => {
    _handle(e, false);
    e.preventDefault();
    return false;
  };

  useLayoutEffect(() => {
    const element = document.getElementById("spanWrap");
    const fragment = document.createDocumentFragment();

    const _render = (i, key) => {
      if (matrixData.length <= i) return;
      const list = matrixData[i];
      list.forEach((k, j) => {
        const span = document.createElement("span");
        const tmp = `${i}-${j}`;
        span.setAttribute("data-idx", tmp);
        fragment.appendChild(span);
      });
      element.appendChild(fragment);

      if (key % 6) {
        _render(i + 1, key + 1);
      } else {
        requestAnimationFrame(() => {
          _render(i + 1, key + 1);
        });
      }
    };
    _render(0, 0);
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        id="spanWrap"
        onClick={leftClick}
        onContextMenu={rightClick}
        className={styles.layout}
        style={{
          gridTemplateRows: `repeat(${matrixData.length}, 1fr)`,
          gridTemplateColumns: `repeat(${matrixData[0].length}, 1fr)`,
        }}
      >
        {/* {matrixData.map((item, i) =>
          Array.from(item).map((_, j) => {
            const tmp = `${i}-${j}`;
            return <span key={tmp} data-idx={tmp}></span>;
          })
        )} */}
      </div>
    </div>
  );
}

function useCalcNum(cb) {
  const workerRefForOdd = useRef(null);
  const workerRefForEven = useRef(null);

  useEffect(() => {
    const handle = function (res) {
      if (res.data.type === "result") {
        cb && cb(res.data.payload);
      }
    };

    workerRefForOdd.current = new WebWorker(workerChangeSum);
    workerRefForOdd.current.onmessage = handle;
    workerRefForEven.current = new WebWorker(workerChangeSum);
    workerRefForEven.current.onmessage = handle;
    return () => {
      workerRefForOdd.current.terminate();
      workerRefForEven.current.terminate();
    };
  }, []);

  return {
    getSumByWorkder(data, orderId) {
      if (orderId & 1) {
        workerRefForOdd.current.postMessage({ data, orderId });
      } else {
        workerRefForEven.current.postMessage({ data, orderId });
      }
    },
  };
}

function useChangeColor(recordSpanTagObj) {
  const workerRef = useRef(null);
  const preColorMap = useRef({});

  useEffect(() => {
    workerRef.current = new WebWorker(workerChange);
    workerRef.current.onmessage = function (res) {
      if (res.data.type === "prechange") {
        preColorMap.current = Object.assign(
          preColorMap.current,
          res.data.payload
        );
      }
    };
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const dispatch = (type, payload) => {
    switch (type) {
      case "prechange": {
        workerRef.current.postMessage({ type, payload });
        break;
      }
      case "removeKey": {
        Reflect.deleteProperty(workerRef.current, payload);
        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    const eventFn = (e) => {
      if (e.keyCode == 67) {
        for (const item in recordSpanTagObj) {
          recordSpanTagObj[item].style.backgroundColor =
            preColorMap.current[item];
        }

        dispatch("prechange", preColorMap.current);
      }
    };

    window.addEventListener("keyup", eventFn);
    return () => {
      window.removeEventListener("keyup", eventFn);
    };
  }, [preColorMap, recordSpanTagObj]);

  return { dispatch };
}

Grid.getInitialProps = (p) => {
  return {
    query: p.query,
  };
};

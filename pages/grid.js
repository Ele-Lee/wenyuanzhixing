import { useState, useEffect, useRef } from 'react';
import styles from '../styles/grid.module.css';
import { randomHexColor, changeColor } from '../utils/color';
import { getLandsNumFromGrid } from '../utils/calc';

const makeMatrix = (row, col) => {
  return Array.from({ length: row }, k => new Int16Array(col));
};

const getMatrixIdxByAttr = e => {
  try {
    const curIdxStr = e.target.attributes['data-idx'].value;
    return curIdxStr.split('-');
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
};

export default function Grid({ query }) {
  const matrixDataRef = useRef(makeMatrix(+query.width, +query.height));
  const recordMapRef = useRef(null);

  useEffect(() => {
    const eventFn = e => {
      if (e.keyCode == 67) {
        let changeMap = new Map();

        Object.keys(recordMapRef.current).forEach(item => {
          const targetSpan = document.querySelector(`span[data-idx="${item}"]`);
          changeMap.set(
            targetSpan,
            changeColor(targetSpan.style.backgroundColor)
          );
        });

        for (const iterator of changeMap) {
          const [dom, color] = iterator;
          dom.style.backgroundColor = color;
        }
        changeMap = null;
      }
    };

    window.addEventListener('keyup', eventFn);
    return () => {
      window.removeEventListener('keyup', eventFn);
    };
  }, [recordMapRef.current]);

  const renderCells = () => {
    const matrixData = matrixDataRef.current;

    const _handle = (matrixData, idxList) => {
      toggleMatrixValue(matrixData, idxList);
      const { num, recordMap } = getLandsNumFromGrid(matrixData);
      window.myToast.show(`当前岛屿数量：${num}`);
      recordMapRef.current = recordMap;
    };

    const leftClick = e => {
      if (e.target.tagName.toLocaleLowerCase() !== 'span') return;

      const colorResult = randomHexColor();
      const idxList = getMatrixIdxByAttr(e);
      if (idxList && !getMatrixValue(matrixData, idxList)) {
        _handle(matrixData, idxList);

        const targetSpan = e.target;

        targetSpan.style.backgroundColor = colorResult;
      }
    };

    const rightClick = e => {
      const idxList = getMatrixIdxByAttr(e);
      if (idxList && getMatrixValue(matrixData, idxList)) {
        _handle(matrixData, idxList);

        const targetSpan = e.target;
        targetSpan.style.backgroundColor = '';
      }
      e.preventDefault();
      return false;
    };

    return (
      <div
        onClick={leftClick}
        onContextMenu={rightClick}
        className={styles.layout}
        style={{
          gridTemplateRows: `repeat(${matrixData.length}, 1fr)`,
          gridTemplateColumns: `repeat(${matrixData[0].length}, 1fr)`,
        }}
      >
        {matrixData.map((item, i) =>
          Array.from(item).map((_, j) => {
            const tmp = `${i}-${j}`;
            return <span key={tmp} data-idx={tmp}></span>;
          })
        )}
      </div>
    );
  };

  return <div className={styles.wrap}>{renderCells()}</div>;
}

Grid.getInitialProps = p => {
  return {
    query: p.query,
  };
};

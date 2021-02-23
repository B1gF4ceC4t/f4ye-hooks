import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import useSize from '../useSize';

const useVirtualList = (list, option) => {
  const containerRef = useRef();
  const size = useSize(containerRef);

  const [state, setState] = useState({ start: 0, end: 10 });
  const { itemHeight, overscan = 5 } = option;

  if (typeof itemHeight !== 'number' && typeof itemHeight !== 'function') {
    throw new Error('please enter a valid itemHeight');
  }

  // calculate number of offset items
  const getOffset = scrollTop => {
    if (typeof itemHeight === 'number') {
      return Math.floor(scrollTop / itemHeight) + 1;
    }
    let sum = 0;
    let offset = 0;
    for (let i = 0, len = list.length; i < len; i++) {
      sum += itemHeight(i);
      if (sum >= scrollTop) {
        offset = i;
        break;
      }
    }
    return offset + 1;
  };

  // calculate number of visible items
  const getViewCapacity = containerHeight => {
    if (typeof itemHeight === 'number') {
      return Math.ceil(containerHeight / itemHeight);
    }
    const { start = 0 } = state;
    let sum = 0;
    let capacity = 0;
    for (let i = start, len = list.length; i < len; i++) {
      sum += itemHeight(i);
      if (sum >= containerHeight) {
        capacity = i;
        break;
      }
    }
    return capacity - start;
  };

  // calculate index of start and end
  const calculateRange = () => {
    const element = containerRef.current;
    if (element) {
      const offset = getOffset(element.scrollTop);
      const viewCapacity = getViewCapacity(element.clientHeight);

      const from = offset - overscan;
      const to = offset + viewCapacity + overscan;
      setState({
        start: Math.max(from, 0),
        end: Math.min(to, list.length)
      });
    }
  };

  // calculate value of scrollTop
  const getDistanceTop = index => {
    if (typeof itemHeight === 'number') {
      return itemHeight * index;
    }
    return list.slice(0, index).reduce((sum, _, i) => sum + itemHeight(i), 0);
  };

  // scroll to target
  const scrollTo = index => {
    if (containerRef.current) {
      containerRef.current.scrollTop = getDistanceTop(index);
      calculateRange();
    }
  };

  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return itemHeight * list.length;
    }
    return list.reduce((sum, _, i) => sum + itemHeight(i), 0);
  }, [list, itemHeight]);

  const offsetTop = useMemo(() => getDistanceTop(state.start), [state.start]);

  useEffect(() => {
    calculateRange();
  }, [size.width, size.height]);

  return {
    list: list.slice(state.start, state.end).map((ele, index) => ({
      data: ele,
      index: state.start + index
    })),
    scrollTo,
    containerProps: {
      ref: ele => {
        containerRef.current = ele;
      },
      onScroll: e => {
        e.preventDefault();
        calculateRange();
      },
      style: { overflowY: 'auto' }
    },
    wrapperProps: {
      style: {
        width: '100%',
        height: totalHeight - offsetTop,
        marginTop: offsetTop
      }
    }
  };
};

export default useVirtualList;

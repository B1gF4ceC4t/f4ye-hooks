import {
  act,
  renderHook,
  RenderHookResult
} from '@testing-library/react-hooks';
import { useVirtualList } from '../../index';

/* 暂时关闭 act 警告  见：https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256 */
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('useVirtualList', () => {
  it('should be defined', () => {
    expect(useVirtualList).toBeDefined();
  });

  describe('virtual list render', () => {
    let mockRef = { scrollTop: 0, clientHeight: 300 };
    let hook;

    const setup = (list = [], options = {}) => {
      hook = renderHook(() =>
        useVirtualList(list, { itemHeight: 30, ...options })
      );
      hook.result.current.containerProps.ref(mockRef);
    };

    afterEach(() => {
      hook.unmount();
      mockRef = { scrollTop: 0, clientHeight: 300 };
    });

    it('test return list size', () => {
      setup(Array.from(Array(99999).keys()), {});

      act(() => {
        hook.result.current.scrollTo(80);
      });

      // 10 items plus 5 overscan * 2
      expect(hook.result.current.list.length).toBe(20);
      expect(mockRef.scrollTop).toBe(80 * 30);
    });

    it('test with fixed height', () => {
      setup(Array.from(Array(99999).keys()), { overscan: 0 });

      act(() => {
        hook.result.current.scrollTo(20);
      });

      expect(hook.result.current.list.length).toBe(10);
      expect(mockRef.scrollTop).toBe(20 * 30);
    });

    it('test with dynamic height', () => {
      setup(Array.from(Array(99999).keys()), {
        overscan: 0,
        itemHeight: i => (i % 2 === 0 ? 30 : 60)
      });

      act(() => {
        hook.result.current.scrollTo(20);
      });

      // average height for easy calculation
      const averageHeight = (30 + 60) / 2;

      expect(hook.result.current.list.length).toBe(
        Math.floor(300 / averageHeight)
      );

      expect(mockRef.scrollTop).toBe(10 * 30 + 10 * 60);
      expect(hook.result.current.list[0].data).toBe(20);
      expect(hook.result.current.list[0].index).toBe(20);
      expect(hook.result.current.list[5].data).toBe(25);
      expect(hook.result.current.list[5].index).toBe(25);

      expect(hook.result.current.wrapperProps.style.marginTop).toBe(
        20 * averageHeight
      );
      expect(hook.result.current.wrapperProps.style.height).toBe(
        (99998 - 20) * averageHeight + 30
      );
    });
  });
});

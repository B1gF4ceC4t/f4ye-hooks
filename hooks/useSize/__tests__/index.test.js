import { renderHook } from '@testing-library/react-hooks';
import { useSize } from '../../index';

describe('test useSize', () => {
  test('should be defined', () => {
    expect(useSize).toBeDefined();
  });

  test('with argument', () => {
    const hook = renderHook(() => useSize(document.body));
    expect(hook.result.current.width).toEqual(0);
    expect(hook.result.current.height).toEqual(0);
  });
});

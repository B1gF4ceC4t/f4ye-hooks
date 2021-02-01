import { renderHook } from '@testing-library/react-hooks';
import { useInView } from '../../index';

describe('useInView', () => {
  it('should be defined', () => {
    expect(useInView).toBeDefined();
  });

  it('with argument', () => {
    const hook = renderHook(() => useInView(document.body));
    expect(hook.result.current).toEqual(false);
  });
});

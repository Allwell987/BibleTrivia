import useTimer from '../src/hooks/useTimer';
import { renderHook } from '@testing-library/react-native';

describe('useTimer Hook', () => {
  test('should initialize with given seconds', () => {
    const { result } = renderHook(() => useTimer(15, jest.fn(), true));
    expect(result.current.timeLeft).toBe(15);
  });

  test('should initialize with different second values', () => {
    const { result } = renderHook(() => useTimer(30, jest.fn(), true));
    expect(result.current.timeLeft).toBe(30);
  });

  test('should have resetTimer function', () => {
    const { result } = renderHook(() => useTimer(15, jest.fn(), true));
    expect(typeof result.current.resetTimer).toBe('function');
  });

  test('should initialize to zero when seconds is zero', () => {
    const { result } = renderHook(() => useTimer(0, jest.fn(), true));
    expect(result.current.timeLeft).toBe(0);
  });

  test('should initialize to initial seconds regardless of active state', () => {
    const { result: inactiveResult } = renderHook(() => useTimer(20, jest.fn(), false));
    expect(inactiveResult.current.timeLeft).toBe(20);

    const { result: activeResult } = renderHook(() => useTimer(20, jest.fn(), true));
    expect(activeResult.current.timeLeft).toBe(20);
  });

  test('should handle negative seconds gracefully', () => {
    const { result } = renderHook(() => useTimer(-5, jest.fn(), true));
    expect(result.current.timeLeft).toBe(-5);
  });

  test('should accept callback as second parameter', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimer(10, callback, true));
    expect(result.current.timeLeft).toBe(10);
    expect(typeof callback).toBe('function');
  });
});

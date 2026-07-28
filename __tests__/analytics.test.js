const memoryStore = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => memoryStore[key] ?? null),
  setItem: jest.fn(async (key, value) => {
    memoryStore[key] = value;
  }),
  removeItem: jest.fn(async (key) => {
    delete memoryStore[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
  }),
}));

import { trackEvent, trackScreenView, getAnalyticsEvents, clearAnalyticsEvents } from '../src/utils/analytics';

describe('analytics utils', () => {
  beforeEach(async () => {
    Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
    await clearAnalyticsEvents();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stores tracked events and screen views', async () => {
    await trackEvent('quiz_started', { difficulty: 'easy' });
    await trackScreenView('Home', { previous_screen: 'Onboarding' });

    const events = await getAnalyticsEvents(10);

    expect(events.length).toBe(2);
    expect(events[0].name).toBe('screen_view');
    expect(events[0].params.screen_name).toBe('Home');
    expect(events[1].name).toBe('quiz_started');
  });
});

import { NativeModules, Platform } from 'react-native';
import PlayGames from '../src/utils/PlayGames';

jest.mock('react-native', () => ({
  NativeModules: {
    PlayGamesModule: {
      signIn: jest.fn(),
      showLeaderboard: jest.fn(),
      submitScore: jest.fn(),
    },
  },
  Platform: {
    OS: 'android',
  },
}));

describe('PlayGames Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
  });

  it('calls signIn on Android', async () => {
    NativeModules.PlayGamesModule.signIn.mockResolvedValue(true);
    const result = await PlayGames.signIn();
    expect(NativeModules.PlayGamesModule.signIn).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('does not call signIn on iOS', async () => {
    Platform.OS = 'ios';
    const result = await PlayGames.signIn();
    expect(NativeModules.PlayGamesModule.signIn).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('calls showLeaderboard with correct ID', async () => {
    await PlayGames.showLeaderboard('leaderboard_123');
    expect(NativeModules.PlayGamesModule.showLeaderboard).toHaveBeenCalledWith('leaderboard_123');
  });

  it('calls submitScore with correct parameters', async () => {
    await PlayGames.submitScore('leaderboard_123', 100);
    expect(NativeModules.PlayGamesModule.submitScore).toHaveBeenCalledWith('leaderboard_123', 100);
  });
});

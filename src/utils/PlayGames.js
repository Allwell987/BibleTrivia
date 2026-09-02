import { NativeModules, Platform } from 'react-native';

const { PlayGamesModule } = NativeModules;

const PlayGames = {
  /**
   * Triggers automatic sign-in for Play Games Services v2.
   * On success, the "Welcome back" banner will appear.
   * @returns {Promise<boolean>}
   */
  signIn: async () => {
    if (Platform.OS !== 'android') return false;
    try {
      return await PlayGamesModule.signIn();
    } catch (error) {
      console.error('Play Games Sign-in error:', error);
      return false;
    }
  },

  /**
   * Shows the native leaderboard UI.
   * @param {string} leaderboardId
   */
  showLeaderboard: async (leaderboardId) => {
    if (Platform.OS !== 'android') return;
    try {
      await PlayGamesModule.showLeaderboard(leaderboardId);
    } catch (error) {
      console.error('Play Games Leaderboard error:', error);
    }
  },

  /**
   * Submits a score to the specified leaderboard.
   * @param {string} leaderboardId
   * @param {number} score
   */
  submitScore: async (leaderboardId, score) => {
    if (Platform.OS !== 'android') return;
    try {
      await PlayGamesModule.submitScore(leaderboardId, score);
    } catch (error) {
      console.error('Play Games Submit Score error:', error);
    }
  },
};

export default PlayGames;

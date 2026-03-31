const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args) => mockGetItem(...args),
  setItem: (...args) => mockSetItem(...args),
  removeItem: (...args) => mockRemoveItem(...args),
}));

import { saveScore, loadScores, clearScores } from '../src/utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockRemoveItem.mockReset();
  });

  describe('loadScores', () => {
    test('should return empty array when no scores exist', async () => {
      mockGetItem.mockResolvedValue(null);

      const scores = await loadScores();

      expect(scores).toEqual([]);
      expect(mockGetItem).toHaveBeenCalledWith('bible_trivia_scores_easy');
      expect(mockGetItem).toHaveBeenCalledWith('bible_trivia_scores_medium');
      expect(mockGetItem).toHaveBeenCalledWith('bible_trivia_scores_hard');
    });

    test('should return parsed scores when they exist', async () => {
      const mockScores = [{ name: 'Test', score: 10, difficulty: 'easy' }];
      mockGetItem.mockResolvedValueOnce(JSON.stringify(mockScores));

      const scores = await loadScores();

      expect(scores).toEqual(mockScores);
    });

    test('should load only one difficulty when provided', async () => {
      const hardScores = [{ id: 'hard-1', name: 'HardPlayer', score: 7, total: 10, pct: 70, difficulty: 'hard' }];
      mockGetItem.mockResolvedValueOnce(JSON.stringify(hardScores));

      const scores = await loadScores('hard');

      expect(scores).toEqual(hardScores);
      expect(mockGetItem).toHaveBeenCalledWith('bible_trivia_scores_hard');
    });

    test('should return empty array on error', async () => {
      mockGetItem.mockRejectedValueOnce(new Error('Storage error'));

      const scores = await loadScores();

      expect(scores).toEqual([]);
    });
  });

  describe('saveScore', () => {
    test('should save a new score with computed fields', async () => {
      mockGetItem.mockResolvedValueOnce(null);
      mockSetItem.mockResolvedValueOnce(undefined);

      const result = await saveScore({ name: 'Test', score: 5, total: 10, difficulty: 'easy', timeLeft: 30 });

      expect(mockSetItem).toHaveBeenCalledWith(
        'bible_trivia_scores_easy',
        expect.any(String)
      );

      const savedData = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject({
        name: 'Test',
        score: 5,
        total: 10,
        difficulty: 'easy',
        pct: 50,
      });
      expect(savedData[0]).toHaveProperty('id');
      expect(savedData[0]).toHaveProperty('date');
      expect(result).toMatchObject({ rank: 1, isPersonalBest: true });
    });

    test('should return null rank when score is outside top 10', async () => {
      const existingScores = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        name: `Player${i + 1}`,
        score: 10,
        total: 10,
        pct: 100,
        difficulty: 'easy',
      }));
      mockGetItem.mockResolvedValueOnce(JSON.stringify(existingScores));
      mockSetItem.mockResolvedValueOnce(undefined);

      const result = await saveScore({ name: 'LowPlayer', score: 1, total: 10, difficulty: 'easy' });

      expect(result.rank).toBe(0);
      expect(result.isPersonalBest).toBe(false);
    });

    test('should use default name if not provided', async () => {
      mockGetItem.mockResolvedValueOnce(null);
      mockSetItem.mockResolvedValueOnce(undefined);

      await saveScore({ score: 5, total: 10 });

      const savedData = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedData[0].name).toBe('Player');
    });

    test('should sort by percentage then by score', async () => {
      const existingScores = [
        { id: '1', name: 'Player1', score: 3, total: 10, pct: 30 },
        { id: '2', name: 'Player2', score: 8, total: 10, pct: 80 },
      ];
      mockGetItem.mockResolvedValueOnce(JSON.stringify(existingScores));
      mockSetItem.mockResolvedValueOnce(undefined);

      await saveScore({ name: 'NewPlayer', score: 7, total: 10, difficulty: 'easy' });

      const savedData = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedData[0].name).toBe('Player2');
      expect(savedData[1].name).toBe('NewPlayer');
    });

    test('should keep only top 10 scores', async () => {
      const existingScores = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        name: `Player${i}`,
        score: i,
        total: 10,
        pct: i * 10,
      }));
      mockGetItem.mockResolvedValueOnce(JSON.stringify(existingScores));
      mockSetItem.mockResolvedValueOnce(undefined);

      await saveScore({ name: 'NewPlayer', score: 100, total: 10, difficulty: 'easy' });

      const savedData = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedData.length).toBeLessThanOrEqual(10);
      expect(savedData[0].name).toBe('NewPlayer');
    });
  });

  describe('clearScores', () => {
    test('should remove scores from storage', async () => {
      mockRemoveItem.mockResolvedValue(undefined);

      await clearScores();

      expect(mockRemoveItem).toHaveBeenCalledWith('bible_trivia_scores_easy');
      expect(mockRemoveItem).toHaveBeenCalledWith('bible_trivia_scores_medium');
      expect(mockRemoveItem).toHaveBeenCalledWith('bible_trivia_scores_hard');
    });
  });
});

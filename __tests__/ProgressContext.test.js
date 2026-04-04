import { checkUnlocks, getDifficultyAccuracy, getDifficultySessions, appendSeenEntry } from '../src/context/ProgressContext';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('../src/config/firebase', () => ({
  db: {},
  isFirebaseConfigured: false,
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('../src/data/collectibles', () => ({
  CHARACTERS: [],
  BIBLE_BOOKS: [],
}));

const createProgress = (overrides = {}) => ({
  unlockedDifficulties: ['easy'],
  unlockedEras: ['creation'],
  eraProgress: {
    creation: 0,
    patriarchs: 0,
    exodus: 0,
    kings: 0,
    prophets: 0,
    jesus: 0,
    earlyChurch: 0,
  },
  bookProgress: {},
  unlockedCharacters: [],
  unlockedBooks: [],
  easyCompleted: 0,
  mediumCompleted: 0,
  hardCompleted: 0,
  expertCompleted: 0,
  easyCorrect: 0,
  easyTotal: 0,
  mediumCorrect: 0,
  mediumTotal: 0,
  hardCorrect: 0,
  hardTotal: 0,
  expertCorrect: 0,
  expertTotal: 0,
  ...overrides,
});

describe('ProgressContext adaptive difficulty', () => {
  it('promotes medium after 3 easy sessions at 80% accuracy', () => {
    const updated = checkUnlocks(createProgress({
      easyCompleted: 3,
      easyCorrect: 12,
      easyTotal: 15,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy', 'medium']);
  });

  it('does not unlock medium before 3 easy sessions', () => {
    const updated = checkUnlocks(createProgress({
      easyCompleted: 2,
      easyCorrect: 8,
      easyTotal: 10,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy']);
  });

  it('promotes hard after medium also sustains the threshold', () => {
    const updated = checkUnlocks(createProgress({
      easyCompleted: 3,
      easyCorrect: 12,
      easyTotal: 15,
      mediumCompleted: 3,
      mediumCorrect: 12,
      mediumTotal: 15,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy', 'medium', 'hard']);
  });

  it('removes hard and expert when medium accuracy falls below the demotion threshold', () => {
    const updated = checkUnlocks(createProgress({
      unlockedDifficulties: ['easy', 'medium', 'hard', 'expert'],
      easyCompleted: 3,
      easyCorrect: 12,
      easyTotal: 15,
      mediumCompleted: 3,
      mediumCorrect: 3,
      mediumTotal: 10,
      hardCompleted: 3,
      hardCorrect: 9,
      hardTotal: 10,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy', 'medium']);
  });

  it('removes medium and all higher tiers when easy accuracy falls below the demotion threshold', () => {
    const updated = checkUnlocks(createProgress({
      unlockedDifficulties: ['easy', 'medium', 'hard', 'expert'],
      easyCompleted: 3,
      easyCorrect: 3,
      easyTotal: 10,
      mediumCompleted: 3,
      mediumCorrect: 9,
      mediumTotal: 10,
      hardCompleted: 3,
      hardCorrect: 9,
      hardTotal: 10,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy']);
  });

  it('keeps zero-attempt tiers locked and avoids divide-by-zero issues', () => {
    const updated = checkUnlocks(createProgress({
      easyCompleted: 3,
      easyCorrect: 0,
      easyTotal: 0,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy']);
    expect(getDifficultyAccuracy(updated, 'easy')).toBe(0);
    expect(getDifficultySessions(updated, 'easy')).toBe(3);
  });

  it('does not demote from one poor source session before minimum session history', () => {
    const updated = checkUnlocks(createProgress({
      unlockedDifficulties: ['easy', 'medium'],
      easyCompleted: 1,
      easyCorrect: 1,
      easyTotal: 10,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy', 'medium']);
  });

  it('locks orphaned tiers when prerequisite source tier is missing', () => {
    const updated = checkUnlocks(createProgress({
      unlockedDifficulties: ['easy', 'hard', 'expert'],
      easyCompleted: 3,
      easyCorrect: 3,
      easyTotal: 10,
    }));

    expect(updated.unlockedDifficulties).toEqual(['easy']);
  });
});

describe('appendSeenEntry anti-repeat history', () => {
  it('returns entries unchanged when key is null', () => {
    const existing = [{ key: 'Who built the ark?', date: new Date().toISOString() }];
    const result = appendSeenEntry(existing, null);
    expect(result).toEqual(existing);
  });

  it('returns entries unchanged when key is undefined', () => {
    const existing = [{ key: 'Who built the ark?', date: new Date().toISOString() }];
    const result = appendSeenEntry(existing, undefined);
    expect(result).toEqual(existing);
  });

  it('prepends a new entry with today\'s ISO date when key is fresh', () => {
    const before = Date.now();
    const result = appendSeenEntry([], 'Who built the ark?');
    const after = Date.now();

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('Who built the ark?');
    const entryTime = new Date(result[0].date).getTime();
    expect(entryTime).toBeGreaterThanOrEqual(before);
    expect(entryTime).toBeLessThanOrEqual(after);
  });

  it('new entry is placed at the front of the list', () => {
    const older = { key: 'older question', date: new Date(Date.now() - 1000).toISOString() };
    const result = appendSeenEntry([older], 'new question');

    expect(result[0].key).toBe('new question');
    expect(result[1].key).toBe('older question');
  });

  it('deduplicates by key: re-inserting an existing key refreshes its date and removes the old entry', () => {
    const oldDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days ago
    const existing = [{ key: 'Who built the ark?', date: oldDate }];

    const result = appendSeenEntry(existing, 'Who built the ark?');

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('Who built the ark?');
    // Date should be refreshed to now (later than oldDate)
    expect(result[0].date > oldDate).toBe(true);
  });

  it('prunes entries older than 30 days', () => {
    const expiredDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    const recentDate  = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    const entries = [
      { key: 'expired question', date: expiredDate },
      { key: 'recent question',  date: recentDate  },
    ];

    const result = appendSeenEntry(entries, 'new question');

    const keys = result.map(e => e.key);
    expect(keys).not.toContain('expired question');
    expect(keys).toContain('recent question');
    expect(keys).toContain('new question');
  });

  it('handles empty entries array without throwing', () => {
    expect(() => appendSeenEntry([], 'some key')).not.toThrow();
    const result = appendSeenEntry([], 'some key');
    expect(result[0].key).toBe('some key');
  });

  it('handles undefined entries without throwing', () => {
    expect(() => appendSeenEntry(undefined, 'some key')).not.toThrow();
    const result = appendSeenEntry(undefined, 'some key');
    expect(result[0].key).toBe('some key');
  });
});


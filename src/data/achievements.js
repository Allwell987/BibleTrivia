export const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    requirement: { type: 'quizzes', count: 1 },
  },
  {
    id: 'quiz_10',
    title: 'Getting Started',
    description: 'Complete 10 quizzes',
    icon: '📚',
    requirement: { type: 'quizzes', count: 10 },
  },
  {
    id: 'quiz_50',
    title: 'Bible Scholar',
    description: 'Complete 50 quizzes',
    icon: '📖',
    requirement: { type: 'quizzes', count: 50 },
  },
  {
    id: 'quiz_100',
    title: 'Scripture Master',
    description: 'Complete 100 quizzes',
    icon: '🏆',
    requirement: { type: 'quizzes', count: 100 },
  },
  {
    id: 'perfect_first',
    title: 'Perfect Start',
    description: 'Get 100% on your first quiz',
    icon: '💯',
    requirement: { type: 'perfect', count: 1 },
  },
  {
    id: 'perfect_5',
    title: 'Flawless',
    description: 'Get 5 perfect scores',
    icon: '⭐',
    requirement: { type: 'perfect', count: 5 },
  },
  {
    id: 'perfect_10',
    title: 'Perfectionist',
    description: 'Get 10 perfect scores',
    icon: '🌟',
    requirement: { type: 'perfect', count: 10 },
  },
  {
    id: 'streak_3',
    title: 'Consistent',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: { type: 'streak', count: 3 },
  },
  {
    id: 'streak_7',
    title: 'Dedicated',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: { type: 'streak', count: 7 },
  },
  {
    id: 'streak_30',
    title: 'Committed',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    requirement: { type: 'streak', count: 30 },
  },
  {
    id: 'easy_master',
    title: 'Easy Does It',
    description: 'Complete all easy questions',
    icon: '🌱',
    requirement: { type: 'difficulty_complete', difficulty: 'easy' },
  },
  {
    id: 'medium_master',
    title: 'Rising Scholar',
    description: 'Complete all medium questions',
    icon: '📈',
    requirement: { type: 'difficulty_complete', difficulty: 'medium' },
  },
  {
    id: 'hard_master',
    title: 'Bible Expert',
    description: 'Complete all hard questions',
    icon: '🎓',
    requirement: { type: 'difficulty_complete', difficulty: 'hard' },
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 10 questions in under 3 seconds each',
    icon: '⚡',
    requirement: { type: 'speed_answers', count: 10 },
  },
  {
    id: 'all_categories',
    title: 'Well Rounded',
    description: 'Play quizzes from all categories',
    icon: '🎨',
    requirement: { type: 'categories', count: 5 },
  },
  {
    id: 'century',
    title: 'Century',
    description: 'Answer 100 questions correctly',
    icon: '💯',
    requirement: { type: 'correct_answers', count: 100 },
  },
  {
    id: 'century_500',
    title: 'Half a Millennium',
    description: 'Answer 500 questions correctly',
    icon: '📊',
    requirement: { type: 'correct_answers', count: 500 },
  },
  {
    id: 'century_1000',
    title: 'Millennium',
    description: 'Answer 1000 questions correctly',
    icon: '🌟',
    requirement: { type: 'correct_answers', count: 1000 },
  },
];

export function checkAchievements(stats, streak, unlockedIds = []) {
  const newlyUnlocked = [];
  const unlocked = [...unlockedIds];

  ACHIEVEMENTS.forEach(achievement => {
    if (unlocked.includes(achievement.id)) return;

    const { requirement } = achievement;
    let earned = false;

    switch (requirement.type) {
      case 'quizzes':
        earned = stats.totalQuizzes >= requirement.count;
        break;
      case 'perfect':
        earned = stats.perfectScores >= requirement.count;
        break;
      case 'streak':
        earned = streak.currentStreak >= requirement.count;
        break;
      case 'correct_answers':
        earned = stats.totalCorrect >= requirement.count;
        break;
      case 'categories':
        const categories = new Set();
        if (stats.easyTotal > 0) categories.add('easy');
        if (stats.mediumTotal > 0) categories.add('medium');
        if (stats.hardTotal > 0) categories.add('hard');
        if (stats.prophetsTotal > 0) categories.add('prophets');
        if (stats.wisdomTotal > 0) categories.add('wisdom');
        earned = categories.size >= requirement.count;
        break;
      default:
        break;
    }

    if (earned) {
      newlyUnlocked.push(achievement.id);
      unlocked.push(achievement.id);
    }
  });

  return { newlyUnlocked, unlocked };
}

export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

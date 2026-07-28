export const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Answer your first question correctly',
    icon: '👶',
    reward: 10,
    check: (progress) => progress.totalCorrect >= 1,
  },
  {
    id: 'bible_student',
    title: 'Bible Student',
    description: 'Answer 50 questions correctly',
    icon: '📖',
    reward: 50,
    check: (progress) => progress.totalCorrect >= 50,
  },
  {
    id: 'bible_scholar',
    title: 'Bible Scholar',
    description: 'Answer 250 questions correctly',
    icon: '🎓',
    reward: 100,
    check: (progress) => progress.totalCorrect >= 250,
  },
  {
    id: 'streak_7',
    title: 'Creation Week',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    reward: 100,
    check: (progress) => progress.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    title: 'Monthly Faithful',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    reward: 250,
    check: (progress) => progress.currentStreak >= 30,
  },
  {
    id: 'perfect_10',
    title: 'Perfect Ten',
    description: 'Get 10 perfect scores',
    icon: '🎯',
    reward: 75,
    check: (progress) => progress.perfectScores >= 10,
  },
  {
    id: 'era_master',
    title: 'Era Master',
    description: 'Master your first era (Reach Bronze tier)',
    icon: '🏛️',
    reward: 50,
    check: (progress) => progress.unlockedEras.length > 1,
  },
  {
    id: 'collector',
    title: 'Collector',
    description: 'Unlock 5 characters',
    icon: '👥',
    reward: 75,
    check: (progress) => progress.unlockedCharacters.length >= 5,
  },
];

export const getNewAchievements = (progress, alreadyUnlockedIds = []) => {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !alreadyUnlockedIds.includes(achievement.id) && achievement.check(progress)
  );
};

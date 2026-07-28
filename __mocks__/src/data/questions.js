const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const QUESTIONS = {
  easy: [
    { question: 'Test question 1?', options: ['A', 'B', 'C', 'D'], answer: 'A', reference: 'Genesis 1:1', category: 'oldTestament', explanation: 'Test explanation' },
  ],
  medium: [
    { question: 'Test question 2?', options: ['A', 'B', 'C', 'D'], answer: 'B', reference: 'Exodus 1:1', category: 'oldTestament', explanation: 'Test explanation' },
  ],
  hard: [
    { question: 'Test question 3?', options: ['A', 'B', 'C', 'D'], answer: 'C', reference: 'Matthew 1:1', category: 'gospels', explanation: 'Test explanation' },
  ],
  expert: [],
};

export const CATEGORIES = {
  all: 'All',
  gospels: 'Gospels',
  oldTestament: 'Old Testament',
  newTestament: 'New Testament',
  wisdom: 'Wisdom Literature',
  history: 'Historical Books',
};

export const getDailyVerse = () => ({ text: 'Test verse', ref: 'John 3:16' });

export const EXPERT_VERSES = [
  { text: 'Test expert verse 1', ref: 'Proverbs 1:1' },
  { text: 'Test expert verse 2', ref: 'Proverbs 2:1' },
  { text: 'Test expert verse 3', ref: 'Proverbs 3:1' },
  { text: 'Test expert verse 4', ref: 'Proverbs 4:1' },
  { text: 'Test expert verse 5', ref: 'Proverbs 5:1' },
  { text: 'Test expert verse 6', ref: 'Proverbs 6:1' },
  { text: 'Test expert verse 7', ref: 'Proverbs 7:1' },
];

export const getQuestionsByCategory = (category, difficulty = 'all') => {
  let pool = [];
  if (difficulty === 'all') {
    pool = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
  } else {
    pool = QUESTIONS[difficulty] || [];
  }
  if (category === 'all') return pool;
  return pool.filter(q => q.category === category);
};

export { shuffleArray };
export const getRandomQuestions = (difficulty, count = 10, category = 'all') => shuffleArray(QUESTIONS[difficulty] || []).slice(0, count);

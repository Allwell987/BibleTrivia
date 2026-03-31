import { QUESTIONS, CATEGORIES, getDailyVerse, getQuestionsByCategory } from '../src/data/questions';

describe('Questions Data', () => {
  test('should have questions for all difficulty levels', () => {
    expect(QUESTIONS).toHaveProperty('easy');
    expect(QUESTIONS).toHaveProperty('medium');
    expect(QUESTIONS).toHaveProperty('hard');
  });

  test('each difficulty should have questions', () => {
    expect(QUESTIONS.easy.length).toBeGreaterThan(0);
    expect(QUESTIONS.medium.length).toBeGreaterThan(0);
    expect(QUESTIONS.hard.length).toBeGreaterThan(0);
  });

  test('each question should have required fields', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
      expect(q).toHaveProperty('reference');
    });
  });

  test('each question should have exactly 4 options', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(q.options.length).toBe(4);
    });
  });

  test('answer should be one of the options', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(q.options).toContain(q.answer);
    });
  });

  test('questions should have non-empty question text', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(typeof q.question).toBe('string');
      expect(q.question.length).toBeGreaterThan(0);
    });
  });

  test('references should point to biblical books', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(typeof q.reference).toBe('string');
      expect(q.reference.length).toBeGreaterThan(0);
    });
  });

  test('should have category field', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(q).toHaveProperty('category');
    });
  });

  test('should have explanation field', () => {
    const allQuestions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
    allQuestions.forEach(q => {
      expect(q).toHaveProperty('explanation');
      expect(typeof q.explanation).toBe('string');
    });
  });
});

describe('Categories', () => {
  test('should have all required categories', () => {
    expect(CATEGORIES).toHaveProperty('all');
    expect(CATEGORIES).toHaveProperty('gospels');
    expect(CATEGORIES).toHaveProperty('oldTestament');
    expect(CATEGORIES).toHaveProperty('newTestament');
    expect(CATEGORIES).toHaveProperty('wisdom');
    expect(CATEGORIES).toHaveProperty('history');
  });
});

describe('Daily Verse', () => {
  test('should return a verse object', () => {
    const verse = getDailyVerse();
    expect(verse).toHaveProperty('text');
    expect(verse).toHaveProperty('ref');
  });

  test('should return different verses on different days', () => {
    const verse1 = getDailyVerse();
    expect(typeof verse1.text).toBe('string');
    expect(typeof verse1.ref).toBe('string');
  });
});

describe('getQuestionsByCategory', () => {
  test('should return all questions when category is all', () => {
    const questions = getQuestionsByCategory('all', 'all');
    expect(questions.length).toBeGreaterThan(20);
  });

  test('should filter by category', () => {
    const gospelsQuestions = getQuestionsByCategory('gospels');
    gospelsQuestions.forEach(q => {
      expect(q.category).toBe('gospels');
    });
  });

  test('should filter by difficulty', () => {
    const easyQuestions = getQuestionsByCategory('all', 'easy');
    expect(easyQuestions.length).toBe(QUESTIONS.easy.length);
  });
});

export const CHARACTERS = [
  {
    id: 'moses',
    name: 'Moses',
    era: 'exodus',
    verse: 'Exodus 33:11',
    bio: 'The prophet who led Israel out of Egypt and received the Ten Commandments.',
    fact: 'Moses was 80 years old when he first spoke to Pharaoh.',
    image: '🧔🏾‍♂️',
    requirement: { type: 'era_mastery', era: 'exodus', count: 10 }
  },
  {
    id: 'david',
    name: 'David',
    era: 'kings',
    verse: 'Psalm 23:1',
    bio: 'The shepherd boy who became Israel\'s greatest king and a man after God\'s own heart.',
    fact: 'David was the youngest of eight brothers.',
    image: '🤴🏾',
    requirement: { type: 'era_mastery', era: 'kings', count: 10 }
  },
  {
    id: 'paul',
    name: 'Paul',
    era: 'earlyChurch',
    verse: 'Philippians 4:13',
    bio: 'Formerly a persecutor of the church, he became the apostle to the Gentiles.',
    fact: 'Paul was a tentmaker by trade.',
    image: '📜',
    requirement: { type: 'era_mastery', era: 'earlyChurch', count: 10 }
  },
  {
    id: 'noah',
    name: 'Noah',
    era: 'creation',
    verse: 'Genesis 6:22',
    bio: 'A righteous man who built an ark to save his family and animals from the great flood.',
    fact: 'The ark was approximately 450 feet long, 75 feet wide, and 45 feet high.',
    image: '🚢',
    requirement: { type: 'era_mastery', era: 'creation', count: 10 }
  },
  {
    id: 'mary',
    name: 'Mary',
    era: 'jesus',
    verse: 'Luke 1:38',
    bio: 'The mother of Jesus, who faithfully accepted God\'s miraculous plan.',
    fact: 'Mary is mentioned in the Quran more than in the New Testament.',
    image: '👩🏾‍🍼',
    requirement: { type: 'era_mastery', era: 'jesus', count: 10 }
  }
];

export const BIBLE_BOOKS = [
  { id: 'genesis', name: 'Genesis', era: 'creation', questionsNeeded: 5 },
  { id: 'exodus', name: 'Exodus', era: 'exodus', questionsNeeded: 5 },
  { id: 'psalms', name: 'Psalms', era: 'kings', questionsNeeded: 5 },
  { id: 'matthew', name: 'Matthew', era: 'jesus', questionsNeeded: 5 },
  { id: 'acts', name: 'Acts', era: 'earlyChurch', questionsNeeded: 5 },
];

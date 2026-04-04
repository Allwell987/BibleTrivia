import { ADDITIONAL_QUESTIONS } from './additionalQuestions';

export const CATEGORIES = {
  all: 'All',
  gospels: 'Gospels',
  oldTestament: 'Old Testament',
  newTestament: 'New Testament',
  wisdom: 'Wisdom Literature',
  history: 'Historical Books',
  prophecy: 'Prophecy',
};

export const ERAS = {
  creation: 'Creation',
  patriarchs: 'Patriarchs',
  exodus: 'Exodus & Egypt',
  conquest: 'Conquest',
  judges: 'Judges',
  unitedKingdom: 'United Kingdom',
  dividedKingdom: 'Divided Kingdom',
  prophets: 'The Prophets',
  exile: 'Exile',
  return: 'The Return',
  intertestamental: 'The Silent Years',
  gospels: 'Life of Jesus',
  parables: 'Parables of Jesus',
  acts: 'The Early Church',
  letters: 'The Epistles',
  revelation: 'The Last Things',
};

const BASE_QUESTIONS = {
  easy: [
    {
      question: 'How many days did God take to create the world?',
      options: ['5', '6', '7', '10'],
      answer: '6',
      reference: 'Genesis 1:31',
      bibleBook: 'Genesis',
      era: 'creation',
      category: 'oldTestament',
      explanation: 'God created the world in six days and rested on the seventh day.',
      insight: 'God is the ultimate Creator who brings order out of chaos.',
      reflection: 'How can you honor God as your Creator in your daily routine today?',
    },
    {
      question: 'What was the name of the garden where Adam and Eve lived?',
      options: ['Eden', 'Gethsemane', 'Canaan', 'Nazareth'],
      answer: 'Eden',
      reference: 'Genesis 2:8',
      bibleBook: 'Genesis',
      era: 'creation',
      category: 'oldTestament',
      explanation: 'God planted a garden in Eden, eastward in Paradise.',
      insight: 'Eden represents God\'s perfect design for fellowship with humanity.',
      reflection: 'What "garden" of peace has God provided for you in your life right now?',
    },
    {
      question: 'Who built the ark?',
      options: ['Moses', 'Abraham', 'Noah', 'David'],
      answer: 'Noah',
      reference: 'Genesis 6:14',
      bibleBook: 'Genesis',
      era: 'creation',
      category: 'oldTestament',
      explanation: 'God instructed Noah to build an ark to save his family from the flood.',
      insight: 'Obedience even when it doesn\'t make sense to others leads to salvation.',
      reflection: 'Is there something God is asking you to "build" or do that requires faith today?',
    },
    {
      question: 'How many disciples did Jesus have?',
      options: ['10', '11', '12', '14'],
      answer: '12',
      reference: 'Matthew 10:1',
      bibleBook: 'Matthew',
      era: 'gospels',
      category: 'gospels',
      explanation: 'Jesus chose 12 disciples to follow Him and spread the gospel.',
      insight: 'Jesus uses ordinary people to accomplish extraordinary kingdom work.',
      reflection: 'How are you responding to Jesus\' call to follow Him in your current season?',
    },
    {
      question: 'What is the first book of the Bible?',
      options: ['Exodus', 'Psalms', 'Matthew', 'Genesis'],
      answer: 'Genesis',
      reference: 'Genesis 1:1',
      bibleBook: 'Genesis',
      era: 'creation',
      category: 'oldTestament',
      explanation: 'Genesis is the first book, documenting creation and early history.',
      insight: 'Everything begins with God; He is the Alpha and the Omega.',
      reflection: 'Start your day by acknowledging God as the beginning of all your efforts.',
    },
    {
      question: 'In what city was Jesus born?',
      options: ['Jerusalem', 'Nazareth', 'Bethlehem', 'Jericho'],
      answer: 'Bethlehem',
      reference: 'Luke 2:4-7',
      bibleBook: 'Luke',
      era: 'gospels',
      category: 'gospels',
      explanation: 'Jesus was born in Bethlehem, the city of David.',
      insight: 'Prophecy was fulfilled in the humblest of settings.',
      reflection: 'God often works in small, quiet places. Where might He be working in your life?',
    },
    {
      question: 'Who was swallowed by a great fish?',
      options: ['Elijah', 'Jonah', 'Paul', 'Peter'],
      answer: 'Jonah',
      reference: 'Jonah 1:17',
      bibleBook: 'Jonah',
      era: 'prophets',
      category: 'oldTestament',
      explanation: 'Jonah was swallowed by a great fish for three days and nights.',
      insight: 'You cannot run from God\'s call; His mercy follows you even in rebellion.',
      reflection: 'Are you running from anything God has called you to do?',
    },
    {
      question: 'What did Moses use to part the Red Sea?',
      options: ['His voice', 'Rain', 'His staff', 'Wind alone'],
      answer: 'His staff',
      reference: 'Exodus 14:16',
      bibleBook: 'Exodus',
      era: 'exodus',
      category: 'oldTestament',
      explanation: 'Moses stretched out his hand and the Lord divided the sea with a strong east wind.',
      insight: 'God uses what is in your hand to perform His miracles.',
      reflection: 'What "staff" or simple tool has God given you to serve Him today?',
    },
    {
      question: 'What is the greatest commandment?',
      options: ['Love God', 'Love your neighbor', 'Both above', 'Keep the Sabbath'],
      answer: 'Both above',
      reference: 'Matthew 22:37-40',
      bibleBook: 'Matthew',
      era: 'gospels',
      category: 'gospels',
      explanation: 'Love the Lord your God with all your heart, and love your neighbor as yourself.',
      insight: 'Love is the foundation of all biblical laws and principles.',
      reflection: 'How can you show practical love to a neighbor or colleague today?',
    },
    {
      question: 'Who was the mother of Jesus?',
      options: ['Martha', 'Mary', 'Elizabeth', 'Sarah'],
      answer: 'Mary',
      reference: 'Luke 1:30-31',
      bibleBook: 'Luke',
      era: 'gospels',
      category: 'gospels',
      explanation: 'Mary was chosen by God to be the mother of Jesus Christ.',
      insight: 'Surrender to God\'s will ("Let it be to me") brings forth the miraculous.',
      reflection: 'Can you say "Yes" to God\'s plan for you, even if it seems impossible?',
    },
  ],
  medium: [
    {
      question: 'How many plagues did God send on Egypt?',
      options: ['7', '8', '10', '12'],
      answer: '10',
      reference: 'Exodus 7-12',
      bibleBook: 'Exodus',
      era: 'exodus',
      category: 'oldTestament',
      explanation: 'The ten plagues demonstrated God\'s power over Egyptian gods.',
      insight: 'God is supreme over every false idol and worldly power.',
      reflection: 'What "idols" of modern life do you need to recognize as powerless compared to God?',
    },
    {
      question: 'Which king of Israel was known for his great wisdom?',
      options: ['David', 'Saul', 'Solomon', 'Hezekiah'],
      answer: 'Solomon',
      reference: '1 Kings 3:12',
      bibleBook: '1 Kings',
      era: 'unitedKingdom',
      category: 'oldTestament',
      explanation: 'God gave Solomon wisdom, understanding, and knowledge beyond measure.',
      insight: 'Wisdom begins with the fear of the Lord and a humble heart to listen.',
      reflection: 'In what area of your life do you need to ask God for wisdom today?',
    },
  ],
  hard: [
    {
      question: 'How old was Methuselah when he died?',
      options: ['777', '900', '969', '930'],
      answer: '969',
      reference: 'Genesis 5:27',
      bibleBook: 'Genesis',
      era: 'creation',
      category: 'oldTestament',
      explanation: 'Methuselah lived longer than any other human (969 years).',
      insight: 'God\'s patience and the spans of early human history are vast and purposeful.',
      reflection: 'Time is a gift. How are you stewarding the years God has given you?',
    },
    {
      question: 'Who was the first martyr of the Christian church?',
      options: ['Paul', 'James', 'Stephen', 'Barnabas'],
      answer: 'Stephen',
      reference: 'Acts 7:59-60',
      bibleBook: 'Acts',
      era: 'acts',
      category: 'newTestament',
      explanation: 'Stephen was stoned to death for preaching about Jesus.',
      insight: 'Faithfulness to the Gospel may come at a high cost, but it has eternal reward.',
      reflection: 'Are you willing to stand for your faith even when it is unpopular?',
    },
  ],
};

export const QUESTIONS = {
  easy: [...BASE_QUESTIONS.easy, ...ADDITIONAL_QUESTIONS.easy],
  medium: [...BASE_QUESTIONS.medium, ...ADDITIONAL_QUESTIONS.medium],
  hard: [...BASE_QUESTIONS.hard, ...ADDITIONAL_QUESTIONS.hard],
  expert: ADDITIONAL_QUESTIONS.expert || [],
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomQuestions = (difficulty, count = 10, category = 'all') => {
  let pool = [];
  
  if (difficulty === 'all') {
    pool = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];
  } else if (difficulty === 'mixed') {
    pool = shuffleArray([...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard]);
  } else {
    pool = QUESTIONS[difficulty] || [];
  }
  
  if (category !== 'all') {
    pool = pool.filter(q => q.category === category);
  }
  
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
};

export const DAILY_VERSES = [
  { text: 'For God so loved the world that he gave his one and only Son.', ref: 'John 3:16' },
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'Trust in the Lord with all your heart.', ref: 'Proverbs 3:5' },
  { text: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
  { text: 'Be strong and courageous. Do not be afraid.', ref: 'Deuteronomy 31:6' },
  { text: 'Your word is a lamp to my feet and a light for my path.', ref: 'Psalm 119:105' },
  { text: 'Love is patient, love is kind. It does not envy.', ref: '1 Corinthians 13:4' },
  { text: 'The Lord works righteousness and justice.', ref: 'Psalm 103:6' },
  { text: 'Call upon me in the day of trouble.', ref: 'Psalm 50:15' },
  { text: 'Be joyful in hope, patient in affliction.', ref: 'Romans 12:12' },
  { text: 'He heals the brokenhearted and binds up their wounds.', ref: 'Psalm 147:3' },
  { text: 'The name of the Lord is a strong tower.', ref: 'Proverbs 18:10' },
  { text: 'Fear not, for I am with you.', ref: 'Isaiah 41:10' },
  { text: 'My grace is sufficient for you.', ref: '2 Corinthians 12:9' },
  { text: 'Delight yourself in the Lord and he will give you desires of your heart.', ref: 'Psalm 37:4' },
  { text: 'The Lord is close to the brokenhearted.', ref: 'Psalm 34:18' },
  { text: 'In all things, God works for the good.', ref: 'Romans 8:28' },
  { text: 'Be kind and compassionate to one another.', ref: 'Ephesians 4:32' },
  { text: 'The way of the righteous is level.', ref: 'Isaiah 26:7' },
  { text: 'Whoever pursues righteousness and love finds life.', ref: 'Proverbs 21:21' },
  { text: 'The fear of the Lord is the beginning of wisdom.', ref: 'Psalm 111:10' },
  { text: 'Create in me a clean heart, O God.', ref: 'Psalm 51:10' },
  { text: 'He leads me beside still waters.', ref: 'Psalm 23:2' },
  { text: 'The Lord is my light and my salvation.', ref: 'Psalm 27:1' },
  { text: 'This is the day the Lord has made.', ref: 'Psalm 118:24' },
  { text: 'Come to me, all you who are weary.', ref: 'Matthew 11:28' },
  { text: 'I am the way, the truth, and the life.', ref: 'John 14:6' },
  { text: 'Let your light shine before others.', ref: 'Matthew 5:16' },
  { text: 'With God, all things are possible.', ref: 'Matthew 19:26' },
  { text: 'The truth will set you free.', ref: 'John 8:32' },
];

export function getDailyVerse() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

export function getQuestionsByCategory(category, difficulty = 'all') {
  let questions = [];
  
  if (difficulty === 'all') {
    questions = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard, ...QUESTIONS.expert];
  } else if (difficulty === 'expert') {
    questions = QUESTIONS.expert || [];
  } else {
    questions = QUESTIONS[difficulty] || [];
  }
  
  if (category === 'all') {
    return questions;
  }
  
  return questions.filter(q => q.category === category);
}

export const EXPERT_VERSES = [
  { text: 'The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.', ref: 'Proverbs 9:10' },
  { text: 'For the Lord gives wisdom; from His mouth come knowledge and understanding.', ref: 'Proverbs 2:6' },
  { text: 'How unsearchable are His judgments and His paths beyond tracing out!', ref: 'Romans 11:33' },
  { text: 'Oh, the depth of the riches of the wisdom and knowledge of God!', ref: 'Romans 11:33' },
  { text: 'To him be the glory and the power for ever and ever!', ref: '1 Peter 5:11' },
  { text: 'Great is our Lord and mighty in power; His understanding has no limit.', ref: 'Psalm 147:5' },
  { text: 'The counsel of the Lord stands forever, the purposes of His heart through all generations.', ref: 'Psalm 33:11' },
  { text: 'Your statutes are my heritage forever; they are the joy of my heart.', ref: 'Psalm 119:111' },
  { text: 'Precious treasure and oil are in a wise man\'s dwelling, but a foolish man devours it.', ref: 'Proverbs 21:20' },
  { text: 'The heart of him who has understanding seeks knowledge, but the mouths of fools feed on folly.', ref: 'Proverbs 15:14' },
  { text: 'Whoever gets sense loves his own soul; he who keeps understanding will discover good.', ref: 'Proverbs 19:8' },
  { text: 'Buy truth, and do not sell it; get wisdom, instruction, and understanding.', ref: 'Proverbs 23:23' },
  { text: 'The mind of man plans his way, but the Lord directs his steps.', ref: 'Proverbs 16:9' },
  { text: 'Do not be wise in your own eyes; fear the Lord and turn away from evil.', ref: 'Proverbs 3:7' },
  { text: 'It is the glory of God to conceal a matter; to search out a matter is the glory of kings.', ref: 'Proverbs 25:2' },
];

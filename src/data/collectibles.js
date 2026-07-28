export const CHARACTERS = [
  {
    id: 'adam',
    name: 'Adam',
    era: 'creation',
    verse: 'Genesis 2:7',
    bio: 'The first man, created from the dust of the ground.',
    fact: 'The name Adam is related to the Hebrew word for "ground" (adamah).',
    image: '👤',
    requirement: { type: 'era_mastery', era: 'creation', count: 5 }
  },
  {
    id: 'noah',
    name: 'Noah',
    era: 'creation',
    verse: 'Genesis 6:22',
    bio: 'A righteous man who built an ark to save his family and animals from the great flood.',
    fact: 'The ark was approximately 450 feet long, 75 feet wide, and 45 feet high.',
    image: '🚢',
    requirement: { type: 'era_mastery', era: 'creation', count: 15 }
  },
  {
    id: 'abraham',
    name: 'Abraham',
    era: 'patriarchs',
    verse: 'Genesis 15:6',
    bio: 'The father of many nations who followed God\'s call to an unknown land.',
    fact: 'Abraham was 100 years old when his son Isaac was born.',
    image: '⛺',
    requirement: { type: 'era_mastery', era: 'patriarchs', count: 10 }
  },
  {
    id: 'joseph',
    name: 'Joseph',
    era: 'patriarchs',
    verse: 'Genesis 50:20',
    bio: 'A dreamer sold into slavery who rose to become second-in-command of Egypt.',
    fact: 'Joseph was 17 years old when he was sold into slavery.',
    image: '🧥',
    requirement: { type: 'era_mastery', era: 'patriarchs', count: 20 }
  },
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
    id: 'joshua',
    name: 'Joshua',
    era: 'conquest',
    verse: 'Joshua 1:9',
    bio: 'The successor to Moses who led the Israelites into the Promised Land.',
    fact: 'Joshua was one of only two spies who brought back a good report of Canaan.',
    image: '🎺',
    requirement: { type: 'era_mastery', era: 'conquest', count: 10 }
  },
  {
    id: 'samson',
    name: 'Samson',
    era: 'judges',
    verse: 'Judges 16:28',
    bio: 'A judge of immense strength who fought against the Philistines.',
    fact: 'Samson was a Nazirite from birth, meaning his hair was never to be cut.',
    image: '💪🏾',
    requirement: { type: 'era_mastery', era: 'judges', count: 10 }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    era: 'judges',
    verse: 'Ruth 1:16',
    bio: 'A Moabite woman whose loyalty to her mother-in-law led her to the lineage of David.',
    fact: 'Ruth was the great-grandmother of King David.',
    image: '🌾',
    requirement: { type: 'era_mastery', era: 'judges', count: 15 }
  },
  {
    id: 'david',
    name: 'David',
    era: 'unitedKingdom',
    verse: 'Psalm 23:1',
    bio: 'The shepherd boy who became Israel\'s greatest king and a man after God\'s own heart.',
    fact: 'David was the youngest of eight brothers.',
    image: '🤴🏾',
    requirement: { type: 'era_mastery', era: 'unitedKingdom', count: 10 }
  },
  {
    id: 'solomon',
    name: 'Solomon',
    era: 'wisdom',
    verse: 'Proverbs 1:7',
    bio: 'The wisest king of Israel who built the first Temple in Jerusalem.',
    fact: 'Solomon wrote 3,000 proverbs and 1,005 songs.',
    image: '🏛️',
    requirement: { type: 'era_mastery', era: 'wisdom', count: 10 }
  },
  {
    id: 'elijah',
    name: 'Elijah',
    era: 'prophets',
    verse: '1 Kings 18:39',
    bio: 'A bold prophet who stood against the prophets of Baal on Mount Carmel.',
    fact: 'Elijah was taken to heaven in a whirlwind with a chariot of fire.',
    image: '🔥',
    requirement: { type: 'era_mastery', era: 'prophets', count: 10 }
  },
  {
    id: 'daniel',
    name: 'Daniel',
    era: 'exile',
    verse: 'Daniel 6:22',
    bio: 'A prophet known for his wisdom and faithfulness in the lions\' den.',
    fact: 'Daniel served under four different kings in Babylon and Persia.',
    image: '🦁',
    requirement: { type: 'era_mastery', era: 'exile', count: 10 }
  },
  {
    id: 'esther',
    name: 'Esther',
    era: 'return',
    verse: 'Esther 4:14',
    bio: 'The Jewish queen of Persia who risked her life to save her people.',
    fact: 'Esther\'s Hebrew name was Hadassah.',
    image: '👑',
    requirement: { type: 'era_mastery', era: 'return', count: 10 }
  },
  {
    id: 'mary',
    name: 'Mary',
    era: 'gospels',
    verse: 'Luke 1:38',
    bio: 'The mother of Jesus, who faithfully accepted God\'s miraculous plan.',
    fact: 'Mary is mentioned in the Quran more than in the New Testament.',
    image: '👩🏾‍🍼',
    requirement: { type: 'era_mastery', era: 'gospels', count: 10 }
  },
  {
    id: 'peter',
    name: 'Peter',
    era: 'miracles',
    verse: 'Matthew 16:16',
    bio: 'A fisherman who became a leader of the apostles and the "rock" of the church.',
    fact: 'Peter\'s original name was Simon.',
    image: '⚓',
    requirement: { type: 'era_mastery', era: 'miracles', count: 10 }
  },
  {
    id: 'paul',
    name: 'Paul',
    era: 'acts',
    verse: 'Philippians 4:13',
    bio: 'Formerly a persecutor of the church, he became the apostle to the Gentiles.',
    fact: 'Paul was a tentmaker by trade.',
    image: '📜',
    requirement: { type: 'era_mastery', era: 'acts', count: 10 }
  },
  {
    id: 'lydia',
    name: 'Lydia',
    era: 'missions',
    verse: 'Acts 16:15',
    bio: 'A successful businesswoman and the first convert to Christianity in Europe.',
    fact: 'Lydia was a seller of purple cloth.',
    image: '💜',
    requirement: { type: 'era_mastery', era: 'missions', count: 10 }
  },
  {
    id: 'john',
    name: 'John',
    era: 'revelation',
    verse: 'Revelation 22:20',
    bio: 'The "beloved disciple" who wrote the Gospel of John and the Book of Revelation.',
    fact: 'John was the only one of the twelve apostles not to die a martyr\'s death.',
    image: '👁️',
    requirement: { type: 'era_mastery', era: 'revelation', count: 10 }
  }
];

export const BIBLE_BOOKS = [
  { id: 'genesis', name: 'Genesis', era: 'creation', questionsNeeded: 10 },
  { id: 'exodus', name: 'Exodus', era: 'exodus', questionsNeeded: 10 },
  { id: 'leviticus', name: 'Leviticus', era: 'exodus', questionsNeeded: 5 },
  { id: 'numbers', name: 'Numbers', era: 'wilderness', questionsNeeded: 5 },
  { id: 'deuteronomy', name: 'Deuteronomy', era: 'wilderness', questionsNeeded: 5 },
  { id: 'joshua', name: 'Joshua', era: 'conquest', questionsNeeded: 10 },
  { id: 'judges', name: 'Judges', era: 'judges', questionsNeeded: 10 },
  { id: 'ruth', name: 'Ruth', era: 'judges', questionsNeeded: 5 },
  { id: '1samuel', name: '1 Samuel', era: 'unitedKingdom', questionsNeeded: 10 },
  { id: '2samuel', name: '2 Samuel', era: 'unitedKingdom', questionsNeeded: 10 },
  { id: 'psalms', name: 'Psalms', era: 'wisdom', questionsNeeded: 20 },
  { id: 'proverbs', name: 'Proverbs', era: 'wisdom', questionsNeeded: 15 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', era: 'wisdom', questionsNeeded: 5 },
  { id: 'isaiah', name: 'Isaiah', era: 'prophets', questionsNeeded: 10 },
  { id: 'daniel', name: 'Daniel', era: 'exile', questionsNeeded: 10 },
  { id: 'esther', name: 'Esther', era: 'return', questionsNeeded: 5 },
  { id: 'matthew', name: 'Matthew', era: 'gospels', questionsNeeded: 15 },
  { id: 'mark', name: 'Mark', era: 'gospels', questionsNeeded: 10 },
  { id: 'luke', name: 'Luke', era: 'gospels', questionsNeeded: 15 },
  { id: 'john', name: 'John', era: 'gospels', questionsNeeded: 15 },
  { id: 'acts', name: 'Acts', era: 'acts', questionsNeeded: 20 },
  { id: 'romans', name: 'Romans', era: 'letters', questionsNeeded: 10 },
  { id: 'revelation', name: 'Revelation', era: 'revelation', questionsNeeded: 15 },
];

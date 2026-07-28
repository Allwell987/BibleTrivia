export const ANAGRAMS = [
  {
    id: '1',
    word: 'EXODUS',
    scrambled: 'USDEOX',
    hint: 'The second book of the Bible, detailing the departure of the Israelites from Egypt.',
    difficulty: 'easy'
  },
  {
    id: '2',
    word: 'GENESIS',
    scrambled: 'SSENEIG',
    hint: 'The first book of the Bible, meaning "beginning" or "origin".',
    difficulty: 'easy'
  },
  {
    id: '3',
    word: 'ABRAHAM',
    scrambled: 'MAHARAB',
    hint: 'The patriarch called by God to leave his home for a new land, promised to be the father of many nations.',
    difficulty: 'easy'
  },
  {
    id: '4',
    word: 'GOLIATH',
    scrambled: 'HTAILOG',
    hint: 'The Philistine giant defeated by young David with a sling and a stone.',
    difficulty: 'easy'
  },
  {
    id: '5',
    word: 'SOLOMON',
    scrambled: 'NOMOLOS',
    hint: 'The king known for his great wisdom and for building the first Temple in Jerusalem.',
    difficulty: 'medium'
  },
  {
    id: '6',
    word: 'SAMSON',
    scrambled: 'NOSMAS',
    hint: 'The judge known for his immense strength, which was tied to his hair.',
    difficulty: 'easy'
  },
  {
    id: '7',
    word: 'BETHLEHEM',
    scrambled: 'MEHELHTEB',
    hint: 'The town where Jesus was born, also known as the City of David.',
    difficulty: 'medium'
  },
  {
    id: '8',
    word: 'NAZARETH',
    scrambled: 'HTERAZAN',
    hint: 'The town where Jesus grew up.',
    difficulty: 'medium'
  },
  {
    id: '9',
    word: 'PENTECOST',
    scrambled: 'TSOCETNEP',
    hint: 'The day the Holy Spirit descended upon the Apostles, often called the birthday of the Church.',
    difficulty: 'hard'
  },
  {
    id: '10',
    word: 'JERUSALEM',
    scrambled: 'MEALASUREJ',
    hint: 'The holy city where the Temple was located and where Jesus was crucified and rose again.',
    difficulty: 'medium'
  },
  {
    id: '11',
    word: 'PARABLE',
    scrambled: 'ELBARAP',
    hint: 'A simple story used to illustrate a moral or spiritual lesson, as told by Jesus.',
    difficulty: 'easy'
  },
  {
    id: '12',
    word: 'COVENANT',
    scrambled: 'TNANEVOC',
    hint: 'A solemn agreement between God and His people.',
    difficulty: 'hard'
  },
  {
    id: '13',
    word: 'PHARISEE',
    scrambled: 'EESIRAHP',
    hint: 'A member of an ancient Jewish sect known for strict observance of traditional and written law.',
    difficulty: 'hard'
  },
  {
    id: '14',
    word: 'HOSANNA',
    scrambled: 'ANNAOSOH',
    hint: 'A shout of praise or adoration, used by the crowds when Jesus entered Jerusalem.',
    difficulty: 'medium'
  },
  {
    id: '15',
    word: 'MESSIAH',
    scrambled: 'HAISSEM',
    hint: 'The promised deliverer of the Jewish nation prophesied in the Hebrew Bible.',
    difficulty: 'medium'
  }
];

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

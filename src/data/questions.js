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
  wilderness: 'Wilderness',
  conquest: 'Conquest',
  judges: 'Judges',
  unitedKingdom: 'United Kingdom',
  wisdom: 'Wisdom Literature',
  dividedKingdom: 'Divided Kingdom',
  prophets: 'The Prophets',
  exile: 'Exile',
  return: 'The Return',
  intertestamental: 'The Silent Years',
  gospels: 'Life of Jesus',
  miracles: 'Miracles of Jesus',
  parables: 'Parables of Jesus',
  acts: 'The Early Church',
  missions: 'Missionary Journeys',
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

const REFLECTION_BY_ERA = {
	creation: 'Where do you see God bringing order, beauty, or new beginnings in your life this week?',
	patriarchs: 'What step of trust is God asking you to take, even before you see the full outcome?',
	exodus: 'Where might God be inviting you to leave fear behind and walk forward in faith?',
	wilderness: 'How has God provided for your needs in a "dry" or difficult season recently?',
	conquest: 'What "promised land" or goal is God calling you to pursue with courage today?',
	judges: 'What area of life needs renewed obedience and dependence on God right now?',
	unitedKingdom: 'How can you choose humility and faithfulness over pride or compromise today?',
	wisdom: 'Which piece of biblical wisdom has most shaped your decisions lately?',
	dividedKingdom: 'How can you remain faithful to God even when those around you are not?',
	prophets: 'What is God speaking to your heart through His Word today?',
	exile: 'How can you remain faithful to God when life feels uncertain or unfamiliar?',
	return: 'What is God helping you to rebuild or restore in your life right now?',
	intertestamental: 'How do you stay patient and faithful when God seems silent?',
	gospels: 'How can you respond to Jesus with practical love and obedience today?',
	miracles: 'Where have you seen God\'s supernatural power at work in your life?',
	parables: 'Which story of Jesus has most recently challenged your perspective?',
	acts: 'How can you encourage and strengthen another believer this week?',
	missions: 'Who is God placing on your heart to share His love with today?',
	letters: 'What practical instruction from the Epistles can you apply today?',
	revelation: 'How does the hope of Christ\'s return change how you live today?',
};

const fallbackReflection = (question) =>
	REFLECTION_BY_ERA[question.era] || 'How can you apply this truth in a practical way today?';

const enrichQuestion = (question) => ({
	...question,
	insight: question.insight || question.explanation,
	reflection: question.reflection || fallbackReflection(question),
});

const RAW_ADDITIONAL_QUESTIONS = {
	easy: [
		{
			question: 'Who interpreted Pharaoh\'s dreams in Egypt?',
			options: ['Moses', 'Joseph', 'Daniel', 'Aaron'],
			answer: 'Joseph',
			reference: 'Genesis 41:25-32',
			bibleBook: 'Genesis',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'God gave Joseph the interpretation of Pharaoh\'s dreams about years of plenty and famine.',
		},
		{
			question: 'Who climbed a sycamore tree to see Jesus?',
			options: ['Matthew', 'Bartimaeus', 'Zacchaeus', 'Nicodemus'],
			answer: 'Zacchaeus',
			reference: 'Luke 19:2-4',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Zacchaeus climbed a sycamore tree because he was short and wanted to see Jesus.',
		},
		{
			question: 'Who was thrown into the lions\' den?',
			options: ['Jeremiah', 'Daniel', 'Ezekiel', 'Nehemiah'],
			answer: 'Daniel',
			reference: 'Daniel 6:16',
			bibleBook: 'Daniel',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Daniel was thrown into the lions\' den for continuing to pray to God.',
		},
		{
			question: 'What was Jesus laid in after He was born?',
			options: ['A cradle', 'A manger', 'A basket', 'A blanket'],
			answer: 'A manger',
			reference: 'Luke 2:7',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Mary laid baby Jesus in a manger because there was no room for them in the inn.',
		},
		{
			question: 'Who was the first king of Israel?',
			options: ['David', 'Solomon', 'Saul', 'Samuel'],
			answer: 'Saul',
			reference: '1 Samuel 10:24',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Saul was anointed as Israel\'s first king before David.',
		},
		{
			question: 'How many times did Peter deny Jesus?',
			options: ['One', 'Two', 'Three', 'Four'],
			answer: 'Three',
			reference: 'Luke 22:61',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Peter denied knowing Jesus three times before the rooster crowed.',
		},
		{
			question: 'Who succeeded Moses and led Israel into the Promised Land?',
			options: ['Caleb', 'Aaron', 'Joshua', 'Samuel'],
			answer: 'Joshua',
			reference: 'Joshua 1:1-2',
			bibleBook: 'Joshua',
			era: 'exodus',
			category: 'history',
			explanation: 'After Moses died, God appointed Joshua to lead Israel into the Promised Land.',
		},
		{
			question: 'What did Jesus use to feed the five thousand?',
			options: ['Five loaves and two fish', 'Seven loaves and two fish', 'Three loaves and five fish', 'Five loaves and five fish'],
			answer: 'Five loaves and two fish',
			reference: 'Matthew 14:17-21',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus multiplied five loaves and two fish to feed a crowd of more than five thousand.',
		},
		{
			question: 'Which book comes after Genesis?',
			options: ['Leviticus', 'Numbers', 'Exodus', 'Deuteronomy'],
			answer: 'Exodus',
			reference: 'Exodus 1:1',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Exodus is the second book of the Bible and follows Genesis.',
		},
		{
			question: 'Who said, "The Lord is my shepherd"?',
			options: ['Solomon', 'Isaiah', 'David', 'Moses'],
			answer: 'David',
			reference: 'Psalm 23:1',
			bibleBook: 'Psalms',
			era: 'unitedKingdom',
			category: 'wisdom',
			explanation: 'David wrote Psalm 23, which begins with "The Lord is my shepherd."',
		},
		{
			question: 'Who was the earthly husband of Mary?',
			options: ['Zechariah', 'Joseph', 'John', 'Joachim'],
			answer: 'Joseph',
			reference: 'Matthew 1:19-20',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Joseph was betrothed to Mary and became the earthly father figure to Jesus.',
		},
		{
			question: 'Which disciple walked on water toward Jesus?',
			options: ['John', 'Peter', 'Andrew', 'Thomas'],
			answer: 'Peter',
			reference: 'Matthew 14:28-29',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Peter stepped out of the boat and walked on the water toward Jesus.',
		},
		{
			question: 'What did God place in the sky as a sign of His covenant with Noah?',
			options: ['A rainbow', 'A bright star', 'A pillar of cloud', 'A dove'],
			answer: 'A rainbow',
			reference: 'Genesis 9:13',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'God set the rainbow in the clouds as a sign of His covenant with all living creatures.',
		},
		{
			question: 'Who was the brother of Moses?',
			options: ['Joshua', 'Aaron', 'Caleb', 'Elisha'],
			answer: 'Aaron',
			reference: 'Exodus 4:14',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Aaron was Moses\' brother and spokesman before Pharaoh.',
		},
		{
			question: 'Which city did Jesus enter riding on a donkey?',
			options: ['Bethlehem', 'Jericho', 'Jerusalem', 'Nazareth'],
			answer: 'Jerusalem',
			reference: 'Matthew 21:7-10',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus entered Jerusalem on a donkey, fulfilling prophecy.',
		},
		{
			question: 'How many books are in the New Testament?',
			options: ['27', '39', '24', '31'],
			answer: '27',
			reference: 'New Testament Canon',
			bibleBook: 'None',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The New Testament contains 27 books.',
		},
		{
			question: 'What was the profession of Peter before following Jesus?',
			options: ['Carpenter', 'Farmer', 'Fisherman', 'Tax collector'],
			answer: 'Fisherman',
			reference: 'Matthew 4:18-19',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Peter was fishing when Jesus called him to become a fisher of men.',
		},
		{
			question: 'Who was thrown into a fiery furnace with two other men?',
			options: ['Daniel', 'Shadrach', 'Nehemiah', 'Ezra'],
			answer: 'Shadrach',
			reference: 'Daniel 3:20-23',
			bibleBook: 'Daniel',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Shadrach, Meshach, and Abednego were thrown into the fiery furnace for refusing idolatry.',
		},
		{
			question: 'Who was the first man created by God?',
			options: ['Cain', 'Abel', 'Seth', 'Adam'],
			answer: 'Adam',
			reference: 'Genesis 2:7',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'God formed Adam from the dust of the ground and breathed life into him.',
		},
		{
			question: 'What did David use to defeat Goliath?',
			options: ['A sword', 'A spear', 'A sling and stone', 'A bow and arrow'],
			answer: 'A sling and stone',
			reference: '1 Samuel 17:50',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'David defeated the Philistine giant Goliath with a single stone from his sling.',
		},
		{
			question: 'How many commandments did God give to Moses on Mount Sinai?',
			options: ['7', '10', '12', '40'],
			answer: '10',
			reference: 'Exodus 20',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'God gave the Ten Commandments to Moses as the moral foundation for Israel.',
		},
		{
			question: 'What bird brought an olive leaf back to Noah\'s Ark?',
			options: ['Raven', 'Dove', 'Eagle', 'Sparrow'],
			answer: 'Dove',
			reference: 'Genesis 8:11',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'The return of the dove with an olive leaf showed Noah that the flood waters had receded.',
		},
		{
			question: 'What was the secret to Samson\'s great strength?',
			options: ['His diet', 'His shoes', 'His hair', 'His sword'],
			answer: 'His hair',
			reference: 'Judges 16:17',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Samson was a Nazirite, and his strength came from God as long as his hair was never cut.',
		},
		{
			question: 'Who was the wife of Adam?',
			options: ['Sarah', 'Eve', 'Mary', 'Ruth'],
			answer: 'Eve',
			reference: 'Genesis 2:22',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'God created Eve from one of Adam\'s ribs to be his companion.',
		},
		{
			question: 'What was the first plague God sent upon Egypt?',
			options: ['Frogs', 'Lice', 'Water into blood', 'Darkness'],
			answer: 'Water into blood',
			reference: 'Exodus 7:20',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'The Nile and all water in Egypt turned to blood as the first plague.',
		},
		{
			question: 'How many days and nights did it rain during the great flood?',
			options: ['7 days', '12 days', '40 days', '100 days'],
			answer: '40 days',
			reference: 'Genesis 7:12',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'And rain fell on the earth forty days and forty nights.',
		},
		{
			question: 'What was the first thing Noah did after leaving the ark?',
			options: ['Planted a vineyard', 'Built an altar', 'Built a house', 'Looked for food'],
			answer: 'Built an altar',
			reference: 'Genesis 8:20',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Then Noah built an altar to the Lord and, taking some of all the clean animals and clean birds, he sacrificed burnt offerings on it.',
		},
		{
			question: 'Who was the oldest man mentioned in the Bible?',
			options: ['Noah', 'Adam', 'Methuselah', 'Enoch'],
			answer: 'Methuselah',
			reference: 'Genesis 5:27',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Altogether, Methuselah lived a total of 969 years, and then he died.',
		},
		{
			question: 'Who was the strongest man in the Bible?',
			options: ['Samson', 'David', 'Goliath', 'Saul'],
			answer: 'Samson',
			reference: 'Judges 14-16',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Samson was endowed by God with supernatural strength to deliver Israel.',
		},
		{
			question: 'What did the prodigal son do with his inheritance?',
			options: ['Invested it', 'Gave it to the poor', 'Wasted it in riotous living', 'Bought a farm'],
			answer: 'Wasted it in riotous living',
			reference: 'Luke 15:13',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'The younger son went to a far country and squandered his wealth.',
		},
		{
			question: 'What did God create on the first day?',
			options: ['The sun', 'Light', 'Animals', 'Man'],
			answer: 'Light',
			reference: 'Genesis 1:3-5',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'God said, "Let there be light," and there was light on the first day of creation.',
		},
		{
			question: 'Who was the mother of Cain and Abel?',
			options: ['Sarah', 'Rebekah', 'Eve', 'Leah'],
			answer: 'Eve',
			reference: 'Genesis 4:1-2',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Eve was the first woman and the mother of all living, including Cain and Abel.',
		},
		{
			question: 'How many people were saved on the ark during the great flood?',
			options: ['2', '4', '8', '12'],
			answer: '8',
			reference: 'Genesis 7:13',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Noah, his wife, his three sons, and their wives (total of 8) were saved on the ark.',
		},
		{
			question: 'What was the name of the sea that Moses parted to help the Israelites escape?',
			options: ['Dead Sea', 'Red Sea', 'Sea of Galilee', 'Mediterranean Sea'],
			answer: 'Red Sea',
			reference: 'Exodus 14:21',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'God used a strong east wind to part the Red Sea, allowing Israel to cross on dry ground.',
		},
		{
			question: 'What did God create on the fourth day?',
			options: ['Birds and fish', 'Land and plants', 'Sun, moon, and stars', 'Man and woman'],
			answer: 'Sun, moon, and stars',
			reference: 'Genesis 1:14-19',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'On the fourth day, God created the lights in the expanse of the heavens.',
		},
		{
			question: 'Who was the father of Abraham?',
			options: ['Terah', 'Nahor', 'Haran', 'Lot'],
			answer: 'Terah',
			reference: 'Genesis 11:27',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Terah was the father of Abram (Abraham), Nahor, and Haran.',
		},
		{
			question: 'How many brothers did Joseph have?',
			options: ['7', '10', '11', '12'],
			answer: '11',
			reference: 'Genesis 42:13',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Joseph was one of the twelve sons of Jacob, meaning he had eleven brothers.',
		},
		{
			question: 'What did Jesus turn into wine at the wedding in Cana?',
			options: ['Water', 'Milk', 'Juice', 'Vinegar'],
			answer: 'Water',
			reference: 'John 2:1-11',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus performed His first public miracle by turning water into high-quality wine.',
		},
		{
			question: 'How many days was Jesus in the tomb before rising?',
			options: ['One', 'Two', 'Three', 'Seven'],
			answer: 'Three',
			reference: 'Matthew 12:40',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'As Jonah was three days and nights in the whale, so Jesus was three days in the heart of the earth.',
		},
		{
			question: 'What did God use to make the first woman, Eve?',
			options: ['Dust', 'A rib', 'A breath', 'A word'],
			answer: 'A rib',
			reference: 'Genesis 2:22',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'The Lord God took a rib from Adam and made it into a woman.',
		},
		{
			question: 'What was the name of the mountain where Abraham went to sacrifice Isaac?',
			options: ['Mount Sinai', 'Mount Moriah', 'Mount Nebo', 'Mount Hermon'],
			answer: 'Mount Moriah',
			reference: 'Genesis 22:2',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'God told Abraham to go to the land of Moriah and offer Isaac there as a burnt offering.',
		},
		{
			question: 'Who was the sister of Moses and Aaron?',
			options: ['Miriam', 'Ruth', 'Esther', 'Martha'],
			answer: 'Miriam',
			reference: 'Exodus 15:20',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Miriam the prophetess was the sister of Aaron and Moses.',
		},
		{
			question: 'How many sons did Noah have?',
			options: ['Two', 'Three', 'Four', 'Seven'],
			answer: 'Three',
			reference: 'Genesis 6:10',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Noah had three sons: Shem, Ham, and Japheth.',
		},
		{
			question: 'From what did God speak to Moses in the desert?',
			options: ['A cloud', 'A burning bush', 'A mountain', 'A pillar of fire'],
			answer: 'A burning bush',
			reference: 'Exodus 3:2-4',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'The angel of the Lord appeared to Moses in flames of fire from within a bush.',
		},
		{
			question: 'In what city was Jesus born?',
			options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Jericho'],
			answer: 'Bethlehem',
			reference: 'Matthew 2:1',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus was born in Bethlehem in Judea, during the time of King Herod.',
		},
		{
			question: 'Who was the mother of Jesus?',
			options: ['Elizabeth', 'Mary', 'Martha', 'Ruth'],
			answer: 'Mary',
			reference: 'Luke 1:30-31',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'The angel Gabriel told Mary that she would conceive and give birth to a son named Jesus.',
		},
		{
			question: 'What is the first book of the Bible?',
			options: ['Exodus', 'Genesis', 'Matthew', 'Psalms'],
			answer: 'Genesis',
			reference: 'Genesis 1:1',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Genesis is the first book of the Bible, beginning with the creation of the world.',
		},
		{
			question: 'How many disciples did Jesus choose to be His closest followers?',
			options: ['7', '10', '12', '40'],
			answer: '12',
			reference: 'Matthew 10:1',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus called twelve disciples to be His closest companions and sent them out to preach.',
		},
		{
			question: 'Who was given a coat of many colors by his father?',
			options: ['David', 'Joseph', 'Benjamin', 'Isaac'],
			answer: 'Joseph',
			reference: 'Genesis 37:3',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Israel (Jacob) loved Joseph more than any of his other sons and made him an ornate robe.',
		},
		{
			question: 'Who was the man God told to build a large boat to save his family from a flood?',
			options: ['Noah', 'Abraham', 'Moses', 'Isaac'],
			answer: 'Noah',
			reference: 'Genesis 6:13-14',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'God told Noah to build an ark because He was going to bring a flood upon the earth.',
		},
		{
			question: 'What was the food God provided for the Israelites in the wilderness?',
			options: ['Manna', 'Bread', 'Corn', 'Fruit'],
			answer: 'Manna',
			reference: 'Exodus 16:31',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'The people of Israel called the bread from heaven manna. It was white like coriander seed and tasted like wafers made with honey.',
		},
		{
			question: 'Who was the baby found in a basket in the Nile river?',
			options: ['Joseph', 'Moses', 'Samuel', 'Isaac'],
			answer: 'Moses',
			reference: 'Exodus 2:3-10',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Moses\' mother hid him in a basket in the Nile to save him, and he was found by Pharaoh\'s daughter.',
		},
		{
			question: 'What is the last book of the Bible?',
			options: ['Genesis', 'Matthew', 'Psalms', 'Revelation'],
			answer: 'Revelation',
			reference: 'Revelation 22',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'prophecy',
			explanation: 'Revelation is the final book of the New Testament and the entire Bible.',
		},
		{
			question: 'Who was the person that betrayed Jesus for thirty pieces of silver?',
			options: ['Peter', 'James', 'Judas Iscariot', 'John'],
			answer: 'Judas Iscariot',
			reference: 'Matthew 26:14-15',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Judas Iscariot, one of the twelve disciples, agreed to deliver Jesus to the chief priests for money.',
		},
	],
	medium: [
		{
			question: 'What was the name of Samuel\'s mother?',
			options: ['Hannah', 'Naomi', 'Abigail', 'Miriam'],
			answer: 'Hannah',
			reference: '1 Samuel 1:20',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Hannah prayed for a son and later dedicated Samuel to the Lord.',
		},
		{
			question: 'Which judge defeated the Midianites with 300 men?',
			options: ['Samson', 'Ehud', 'Gideon', 'Jephthah'],
			answer: 'Gideon',
			reference: 'Judges 7:7',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'God used Gideon and 300 men to defeat the Midianites so the victory would clearly be His.',
		},
		{
			question: 'Which woman became queen of Persia and saved the Jews?',
			options: ['Ruth', 'Deborah', 'Esther', 'Miriam'],
			answer: 'Esther',
			reference: 'Esther 4:14',
			bibleBook: 'Esther',
			era: 'exile',
			category: 'history',
			explanation: 'Esther risked her life before the king and helped save the Jewish people.',
		},
		{
			question: 'Who replaced Judas Iscariot among the twelve apostles?',
			options: ['Barsabbas', 'Matthias', 'Stephen', 'Barnabas'],
			answer: 'Matthias',
			reference: 'Acts 1:26',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The apostles cast lots and Matthias was chosen to replace Judas.',
		},
		{
			question: 'What was the name of the city where believers were first called Christians?',
			options: ['Jerusalem', 'Antioch', 'Corinth', 'Ephesus'],
			answer: 'Antioch',
			reference: 'Acts 11:26',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The disciples were first called Christians in Antioch.',
		},
		{
			question: 'Who was the tax collector among Jesus\' disciples?',
			options: ['Philip', 'Matthew', 'Simon', 'Thaddeus'],
			answer: 'Matthew',
			reference: 'Matthew 9:9',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Matthew was a tax collector before Jesus called him to follow.',
		},
		{
			question: 'What was the name of the city whose walls fell after Israel marched around it?',
			options: ['Ai', 'Hebron', 'Jericho', 'Bethel'],
			answer: 'Jericho',
			reference: 'Joshua 6:20',
			bibleBook: 'Joshua',
			era: 'exodus',
			category: 'history',
			explanation: 'God caused the walls of Jericho to fall after Israel obeyed His instructions.',
		},
		{
			question: 'Who wrote many of the Proverbs?',
			options: ['David', 'Solomon', 'Asaph', 'Job'],
			answer: 'Solomon',
			reference: 'Proverbs 1:1',
			bibleBook: 'Proverbs',
			era: 'unitedKingdom',
			category: 'wisdom',
			explanation: 'The book of Proverbs opens by identifying Solomon as its main author.',
		},
		{
			question: 'Which prophet confronted David after his sin with Bathsheba?',
			options: ['Nathan', 'Samuel', 'Elijah', 'Gad'],
			answer: 'Nathan',
			reference: '2 Samuel 12:7',
			bibleBook: '2 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Nathan rebuked David after the matter of Bathsheba and Uriah.',
		},
		{
			question: 'Who was the Roman governor who sentenced Jesus to crucifixion?',
			options: ['Herod', 'Felix', 'Pontius Pilate', 'Festus'],
			answer: 'Pontius Pilate',
			reference: 'Mark 15:15',
			bibleBook: 'Mark',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Pontius Pilate gave the order for Jesus to be crucified.',
		},
		{
			question: 'What was the name of the island where Paul was shipwrecked?',
			options: ['Crete', 'Patmos', 'Cyprus', 'Malta'],
			answer: 'Malta',
			reference: 'Acts 28:1',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'After the shipwreck, Paul and the others learned that the island was called Malta.',
		},
		{
			question: 'Who prayed and fire fell from heaven on Mount Carmel?',
			options: ['Elijah', 'Elisha', 'Isaiah', 'Jeremiah'],
			answer: 'Elijah',
			reference: '1 Kings 18:36-38',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Elijah prayed and the Lord answered with fire, proving He is God.',
		},
		{
			question: 'Which apostle was known as the doubter before seeing the risen Jesus?',
			options: ['Andrew', 'Thomas', 'Philip', 'Bartholomew'],
			answer: 'Thomas',
			reference: 'John 20:24-29',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Thomas doubted until he saw and touched Jesus\' wounds.',
		},
		{
			question: 'On what mountain did Moses receive the Ten Commandments?',
			options: ['Mount Nebo', 'Mount Sinai', 'Mount Tabor', 'Mount Carmel'],
			answer: 'Mount Sinai',
			reference: 'Exodus 19:20',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Moses went up to the top of Mount Sinai to receive the Law from God.',
		},
		{
			question: 'Who was the woman who hid the Israelite spies in Jericho?',
			options: ['Ruth', 'Rahab', 'Deborah', 'Jael'],
			answer: 'Rahab',
			reference: 'Joshua 2:1',
			bibleBook: 'Joshua',
			era: 'exodus',
			category: 'history',
			explanation: 'Rahab hid the spies and was spared when Jericho was destroyed.',
		},
		{
			question: 'Where did Jesus go to pray before He was arrested?',
			options: ['Gethsemane', 'Golgotha', 'Bethany', 'Nazareth'],
			answer: 'Gethsemane',
			reference: 'Matthew 26:36',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus prayed in agony in the Garden of Gethsemane before His betrayal.',
		},
		{
			question: 'How many days had Lazarus been dead when Jesus raised him?',
			options: ['One', 'Two', 'Three', 'Four'],
			answer: 'Four',
			reference: 'John 11:39',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus performed one of His greatest miracles by raising Lazarus after four days.',
		},
		{
			question: 'Which sea did Jesus calm during a storm?',
			options: ['The Dead Sea', 'The Red Sea', 'The Sea of Galilee', 'The Mediterranean Sea'],
			answer: 'The Sea of Galilee',
			reference: 'Mark 4:39',
			bibleBook: 'Mark',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus commanded the wind and the waves to be still on the Sea of Galilee.',
		},
		{
			question: 'Who was the prophet that was fed by ravens?',
			options: ['Elijah', 'Elisha', 'Isaiah', 'Jeremiah'],
			answer: 'Elijah',
			reference: '1 Kings 17:6',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'During a famine, ravens brought Elijah bread and meat every morning and evening.',
		},
		{
			question: 'What was the name of the giant Philistine warrior defeated by David?',
			options: ['Ishbi-benob', 'Saph', 'Goliath', 'Lahmi'],
			answer: 'Goliath',
			reference: '1 Samuel 17:4',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Goliath was the champion of Gath who defied the armies of the living God.',
		},
		{
			question: 'Which son of Jacob was sold into slavery by his brothers?',
			options: ['Reuben', 'Benjamin', 'Joseph', 'Judah'],
			answer: 'Joseph',
			reference: 'Genesis 37:28',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Joseph\'s brothers were jealous of his dreams and his father\'s favor.',
		},
		{
			question: 'What did John the Baptist eat in the wilderness?',
			options: ['Manna', 'Locusts and wild honey', 'Berries and nuts', 'Bread and wine'],
			answer: 'Locusts and wild honey',
			reference: 'Matthew 3:4',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'John wore camel\'s hair and survived on a simple wilderness diet.',
		},
		{
			question: 'Who was the first person to see the risen Jesus on Easter morning?',
			options: ['Peter', 'John', 'Mary Magdalene', 'Mary the mother of Jesus'],
			answer: 'Mary Magdalene',
			reference: 'John 20:14-16',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Mary Magdalene was at the tomb early and was the first to speak with the risen Lord.',
		},
		{
			question: 'Which book of the Bible is the longest by number of chapters?',
			options: ['Genesis', 'Isaiah', 'Psalms', 'Jeremiah'],
			answer: 'Psalms',
			reference: 'Biblical Structure',
			bibleBook: 'Psalms',
			era: 'unitedKingdom',
			category: 'wisdom',
			explanation: 'The book of Psalms contains 150 individual psalms or chapters.',
		},
		{
			question: 'What was the name of the pool in Jerusalem where Jesus healed a man who had been paralyzed for 38 years?',
			options: ['Siloam', 'Bethesda', 'Gihon', 'Jordan'],
			answer: 'Bethesda',
			reference: 'John 5:2-9',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'The Pool of Bethesda had five porches and was near the Sheep Gate.',
		},
		{
			question: 'Who was the woman who became the mother of King Solomon?',
			options: ['Michal', 'Abigail', 'Bathsheba', 'Haggith'],
			answer: 'Bathsheba',
			reference: '2 Samuel 12:24',
			bibleBook: '2 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Bathsheba, who had been the wife of Uriah, later bore Solomon to King David.',
		},
		{
			question: 'Who was the first judge of Israel?',
			options: ['Ehud', 'Othniel', 'Gideon', 'Deborah'],
			answer: 'Othniel',
			reference: 'Judges 3:9',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Othniel, Caleb\'s nephew, was the first judge God raised up to deliver Israel.',
		},
		{
			question: 'Who was the woman who betrayed Samson to the Philistines?',
			options: ['Rahab', 'Delilah', 'Ruth', 'Jezebel'],
			answer: 'Delilah',
			reference: 'Judges 16:18',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Delilah was paid by the Philistine lords to discover the secret of Samson\'s strength.',
		},
		{
			question: 'Who was the king of Israel who succeeded Saul?',
			options: ['Solomon', 'David', 'Jonathan', 'Hezekiah'],
			answer: 'David',
			reference: '2 Samuel 5:4',
			bibleBook: '2 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'David was thirty years old when he became king, and he reigned forty years.',
		},
		{
			question: 'Who was the prophet who succeeded Elijah?',
			options: ['Isaiah', 'Elisha', 'Jeremiah', 'Samuel'],
			answer: 'Elisha',
			reference: '2 Kings 2:15',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'The spirit of Elijah rested on Elisha after Elijah was taken to heaven.',
		},
		{
			question: 'Who was the queen who visited Solomon to test him with hard questions?',
			options: ['Queen of Sheba', 'Queen Esther', 'Queen Jezebel', 'Queen Vashti'],
			answer: 'Queen of Sheba',
			reference: '1 Kings 10:1',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'The Queen of Sheba came to Jerusalem with a very great caravan to test Solomon\'s wisdom.',
		},
		{
			question: 'In what river was Jesus baptized?',
			options: ['Nile', 'Euphrates', 'Jordan', 'Tigris'],
			answer: 'Jordan',
			reference: 'Matthew 3:13',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Jesus came from Galilee to the Jordan to be baptized by John.',
		},
		{
			question: 'Who was the king who sought to kill the baby Jesus?',
			options: ['Herod the Great', 'Herod Antipas', 'Agrippa', 'Caesar Augustus'],
			answer: 'Herod the Great',
			reference: 'Matthew 2:13',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Herod was furious and gave orders to kill all the boys in Bethlehem who were two years old and under.',
		},
		{
			question: 'Who was Paul\'s main companion during his imprisonment in Philippi?',
			options: ['Barnabas', 'Silas', 'Timothy', 'Luke'],
			answer: 'Silas',
			reference: 'Acts 16:25',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul and Silas were praying and singing hymns to God while in prison.',
		},
		{
			question: 'What was the name of the woman Peter raised from the dead in Joppa?',
			options: ['Lydia', 'Dorcas', 'Priscilla', 'Phoebe'],
			answer: 'Dorcas',
			reference: 'Acts 9:36-41',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Dorcas (or Tabitha) was a disciple always doing good and helping the poor.',
		},
		{
			question: 'Who was the woman judge who led Israel to victory alongside Barak?',
			options: ['Deborah', 'Jael', 'Ruth', 'Miriam'],
			answer: 'Deborah',
			reference: 'Judges 4:4',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Deborah was a prophetess and the only female judge mentioned in the Bible.',
		},
		{
			question: 'Which judge made a rash vow involving the first thing that came out of his house?',
			options: ['Jephthah', 'Samson', 'Gideon', 'Ehud'],
			answer: 'Jephthah',
			reference: 'Judges 11:30-31',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Jephthah vowed to sacrifice whatever first came out of his house to meet him if he returned in victory.',
		},
		{
			question: 'Who killed a lion with his bare hands?',
			options: ['David', 'Samson', 'Saul', 'Solomon'],
			answer: 'Samson',
			reference: 'Judges 14:6',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'The Spirit of the Lord came powerfully upon Samson so that he tore the lion apart with his bare hands.',
		},
		{
			question: 'Which apostle was a physician?',
			options: ['Matthew', 'Luke', 'John', 'Paul'],
			answer: 'Luke',
			reference: 'Colossians 4:14',
			bibleBook: 'Colossians',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul refers to Luke as "our dear friend Luke, the doctor."',
		},
		{
			question: 'Who was the sister of Mary and Lazarus?',
			options: ['Miriam', 'Martha', 'Elizabeth', 'Ruth'],
			answer: 'Martha',
			reference: 'John 11:1',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Lazarus was from Bethany, the village of Mary and her sister Martha.',
		},
		{
			question: 'Who was the first Christian martyr?',
			options: ['Peter', 'James', 'Stephen', 'Paul'],
			answer: 'Stephen',
			reference: 'Acts 7:59-60',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Stephen was stoned to death for his faith, becoming the first martyr of the early church.',
		},
		{
			question: 'Who was the judge that killed 600 Philistines with an oxgoad?',
			options: ['Shamgar', 'Ehud', 'Tola', 'Jair'],
			answer: 'Shamgar',
			reference: 'Judges 3:31',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Shamgar son of Anath struck down six hundred Philistines with an oxgoad and saved Israel.',
		},
		{
			question: 'Who was the prophet that was swallowed by a great fish?',
			options: ['Isaiah', 'Jonah', 'Elijah', 'Daniel'],
			answer: 'Jonah',
			reference: 'Jonah 1:17',
			bibleBook: 'Jonah',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Jonah tried to run from God but was swallowed by a great fish when he was thrown overboard.',
		},
		{
			question: 'What was the name of the garden where Adam and Eve lived?',
			options: ['Gethsemane', 'Eden', 'Zion', 'Carmel'],
			answer: 'Eden',
			reference: 'Genesis 2:8',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Now the Lord God had planted a garden in the east, in Eden; and there he put the man he had formed.',
		},
		{
			question: 'How many stones did David pick up before fighting Goliath?',
			options: ['One', 'Three', 'Five', 'Twelve'],
			answer: 'Five',
			reference: '1 Samuel 17:40',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'David chose five smooth stones from the stream and put them in the pouch of his shepherd’s bag.',
		},
		{
			question: 'Who was the woman who became the mother of Samuel?',
			options: ['Hannah', 'Peninnah', 'Elizabeth', 'Rebekah'],
			answer: 'Hannah',
			reference: '1 Samuel 1:20',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Hannah prayed for a son and promised to give him to the Lord all the days of his life.',
		},
		{
			question: 'Which book comes after the four Gospels in the New Testament?',
			options: ['Romans', 'Acts', 'Hebrews', 'Revelation'],
			answer: 'Acts',
			reference: 'Acts 1:1',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The Book of Acts follows the Gospels of Matthew, Mark, Luke, and John.',
		},
		{
			question: 'Who was the king who asked God for wisdom?',
			options: ['David', 'Saul', 'Solomon', 'Hezekiah'],
			answer: 'Solomon',
			reference: '1 Kings 3:9',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'God told Solomon to ask for whatever he wanted, and Solomon asked for wisdom to lead God\'s people.',
		},
		{
			question: 'Which prophet was thrown into a lions\' den?',
			options: ['Jeremiah', 'Ezekiel', 'Daniel', 'Isaiah'],
			answer: 'Daniel',
			reference: 'Daniel 6:16',
			bibleBook: 'Daniel',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'Daniel was thrown into the lions\' den because he refused to stop praying to God.',
		},
		{
			question: 'How many years did the Israelites wander in the wilderness?',
			options: ['7', '12', '40', '100'],
			answer: '40',
			reference: 'Numbers 14:34',
			bibleBook: 'Numbers',
			era: 'exodus',
			category: 'history',
			explanation: 'Because of their lack of faith, the Israelites were made to wander in the wilderness for forty years.',
		},
	],
	hard: [
		{
			question: 'Who interpreted the handwriting on the wall for Belshazzar?',
			options: ['Jeremiah', 'Daniel', 'Ezekiel', 'Ezra'],
			answer: 'Daniel',
			reference: 'Daniel 5:25-28',
			bibleBook: 'Daniel',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'Daniel interpreted the writing that announced judgment on Belshazzar\'s kingdom.',
		},
		{
			question: 'Which church in Revelation was described as lukewarm?',
			options: ['Sardis', 'Pergamum', 'Laodicea', 'Smyrna'],
			answer: 'Laodicea',
			reference: 'Revelation 3:15-16',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The church in Laodicea was rebuked for being neither hot nor cold.',
		},
		{
			question: 'Who was the father of John the Baptist?',
			options: ['Joseph', 'Zechariah', 'Simeon', 'Joachim'],
			answer: 'Zechariah',
			reference: 'Luke 1:13',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'The angel told Zechariah that his wife Elizabeth would bear a son named John.',
		},
		{
			question: 'What was the name of Abraham\'s nephew who traveled with him?',
			options: ['Lot', 'Laban', 'Ishmael', 'Esau'],
			answer: 'Lot',
			reference: 'Genesis 12:5',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Lot, Abraham\'s nephew, traveled with him from Haran into Canaan.',
		},
		{
			question: 'Who told Timothy that all Scripture is God-breathed?',
			options: ['Peter', 'Paul', 'John', 'James'],
			answer: 'Paul',
			reference: '2 Timothy 3:16',
			bibleBook: '2 Timothy',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul wrote to Timothy that all Scripture is inspired by God and useful for training.',
		},
		{
			question: 'Which Old Testament book begins with the words, "Vanity of vanities"?',
			options: ['Job', 'Psalms', 'Ecclesiastes', 'Proverbs'],
			answer: 'Ecclesiastes',
			reference: 'Ecclesiastes 1:2',
			bibleBook: 'Ecclesiastes',
			era: 'unitedKingdom',
			category: 'wisdom',
			explanation: 'Ecclesiastes opens with the repeated phrase "Vanity of vanities."',
		},
		{
			question: 'Which man fell out of a window while Paul was preaching and was taken up dead?',
			options: ['Tychicus', 'Eutychus', 'Onesimus', 'Trophimus'],
			answer: 'Eutychus',
			reference: 'Acts 20:9-10',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Eutychus fell from the third story while Paul preached late into the night.',
		},
		{
			question: 'Which prophet married Gomer as a sign to Israel?',
			options: ['Amos', 'Hosea', 'Joel', 'Micah'],
			answer: 'Hosea',
			reference: 'Hosea 1:2-3',
			bibleBook: 'Hosea',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'God commanded Hosea to marry Gomer to illustrate Israel\'s unfaithfulness.',
		},
		{
			question: 'Who was king of Judah when Isaiah received his temple vision?',
			options: ['Hezekiah', 'Uzziah', 'Ahaz', 'Josiah'],
			answer: 'Uzziah',
			reference: 'Isaiah 6:1',
			bibleBook: 'Isaiah',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Isaiah says his vision came in the year that King Uzziah died.',
		},
		{
			question: 'Which New Testament letter was sent to a runaway slave and his master?',
			options: ['Philemon', 'Titus', '2 Timothy', 'Galatians'],
			answer: 'Philemon',
			reference: 'Philemon 1:10-16',
			bibleBook: 'Philemon',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul wrote to Philemon concerning Onesimus, encouraging reconciliation.',
		},
		{
			question: 'Who was the wife of Ahab who promoted Baal worship in Israel?',
			options: ['Athaliah', 'Jezebel', 'Vashti', 'Delilah'],
			answer: 'Jezebel',
			reference: '1 Kings 16:31-33',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Jezebel influenced Ahab and Israel toward Baal worship.',
		},
		{
			question: 'Which city in Revelation was told, "You have abandoned the love you had at first"?',
			options: ['Smyrna', 'Ephesus', 'Thyatira', 'Philadelphia'],
			answer: 'Ephesus',
			reference: 'Revelation 2:4',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Jesus commended Ephesus for endurance but rebuked them for leaving their first love.',
		},
		{
			question: 'How many generations from Abraham to David did Matthew record?',
			options: ['Ten', 'Twelve', 'Fourteen', 'Sixteen'],
			answer: 'Fourteen',
			reference: 'Matthew 1:17',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Matthew records 14 generations in each of three periods from Abraham to Jesus.',
		},
		{
			question: 'What was the first miracle of Elisha?',
			options: ['Parting the Jordan', 'Multiplying oil', 'Raising the widow\'s son', 'Curing Naaman'],
			answer: 'Multiplying oil',
			reference: '2 Kings 4:1-7',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Elisha multiplied the widow\'s oil to pay her debts.',
		},
		{
			question: 'How many chapters are in the Gospel of John?',
			options: ['18', '20', '21', '24'],
			answer: '21',
			reference: 'John Structure',
			bibleBook: 'John',
			era: 'gospels',
			category: 'newTestament',
			explanation: 'The Gospel of John has 21 chapters.',
		},
		{
			question: 'Who was the wife of Isaac and mother of Jacob and Esau?',
			options: ['Sarah', 'Rebekah', 'Leah', 'Rachel'],
			answer: 'Rebekah',
			reference: 'Genesis 24:67',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Rebekah became the wife of Isaac and later the mother of the twins Esau and Jacob.',
		},
		{
			question: 'Who was the left-handed judge who killed King Eglon of Moab?',
			options: ['Othniel', 'Ehud', 'Shamgar', 'Barak'],
			answer: 'Ehud',
			reference: 'Judges 3:15',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Ehud, a left-handed Benjamite, delivered Israel by assassinating the Moabite king.',
		},
		{
			question: 'Which book of the Bible does not contain the word "God"?',
			options: ['Song of Solomon', 'Esther', 'Ecclesiastes', 'Both Song of Solomon and Esther'],
			answer: 'Both Song of Solomon and Esther',
			reference: 'Biblical Canon',
			bibleBook: 'Esther',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'The word "God" is famously absent from the books of Esther and the Song of Solomon.',
		},
		{
			question: 'Who was the prophetess and judge who led Israel to victory over Jabin\'s army?',
			options: ['Miriam', 'Deborah', 'Huldah', 'Anna'],
			answer: 'Deborah',
			reference: 'Judges 4:4',
			bibleBook: 'Judges',
			era: 'judges',
			category: 'history',
			explanation: 'Deborah was the only female judge of Israel and a powerful prophetess.',
		},
		{
			question: 'Which tribe of Israel did not receive a portion of land as an inheritance?',
			options: ['Benjamin', 'Dan', 'Levi', 'Reuben'],
			answer: 'Levi',
			reference: 'Joshua 13:33',
			bibleBook: 'Joshua',
			era: 'exodus',
			category: 'history',
			explanation: 'The tribe of Levi was chosen for the priesthood and the Lord was their inheritance.',
		},
		{
			question: 'Who was the High Priest who presiding over the trial of Jesus?',
			options: ['Annas', 'Caiaphas', 'Eleazar', 'Jonathan'],
			answer: 'Caiaphas',
			reference: 'Matthew 26:57',
			bibleBook: 'Matthew',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Caiaphas was the High Priest who conspired to have Jesus arrested and tried.',
		},
		{
			question: 'Which prophet was taken to heaven in a whirlwind?',
			options: ['Moses', 'Elijah', 'Elisha', 'Enoch'],
			answer: 'Elijah',
			reference: '2 Kings 2:11',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Elijah did not die but was taken up in a chariot of fire and a whirlwind.',
		},
		{
			question: 'Who was the mother of Ishmael?',
			options: ['Sarah', 'Hagar', 'Keturah', 'Rebekah'],
			answer: 'Hagar',
			reference: 'Genesis 16:15',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Hagar was Sarah\'s Egyptian handmaid who bore Abraham\'s first son.',
		},
		{
			question: 'What was the name of the place where Jesus was crucified?',
			options: ['Gethsemane', 'Golgotha', 'Zion', 'Bethany'],
			answer: 'Golgotha',
			reference: 'John 19:17',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Golgotha, also known as the Place of the Skull, was the site of the crucifixion.',
		},
		{
			question: 'Who was the father of King David?',
			options: ['Jesse', 'Saul', 'Samuel', 'Solomon'],
			answer: 'Jesse',
			reference: '1 Samuel 16:1',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Jesse was the Bethlehemite who had eight sons, the youngest being David.',
		},
		{
			question: 'What was the name of the servant whose ear was cut off by Peter during the arrest of Jesus?',
			options: ['Malchus', 'Marcus', 'Mathias', 'Mene'],
			answer: 'Malchus',
			reference: 'John 18:10',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Simon Peter drew his sword and struck Malchus, the high priest\'s servant.',
		},
		{
			question: 'Which book of the Bible follows the book of Daniel?',
			options: ['Ezekiel', 'Hosea', 'Joel', 'Amos'],
			answer: 'Hosea',
			reference: 'Biblical Order',
			bibleBook: 'Hosea',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Hosea is the first of the twelve Minor Prophets and follows Daniel in most Bibles.',
		},
		{
			question: 'Who was the father of the twelve tribes of Israel?',
			options: ['Abraham', 'Isaac', 'Jacob', 'Joseph'],
			answer: 'Jacob',
			reference: 'Genesis 35:23-26',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Jacob had twelve sons who became the heads of the twelve tribes of Israel.',
		},
		{
			question: 'Who was the father of King Saul?',
			options: ['Jesse', 'Kish', 'Samuel', 'Abner'],
			answer: 'Kish',
			reference: '1 Samuel 9:1',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Kish was a Benjamite of standing, the father of Saul.',
		},
		{
			question: 'In what valley did David fight Goliath?',
			options: ['Valley of Elah', 'Valley of Jezreel', 'Valley of Hinnom', 'Valley of Kidron'],
			answer: 'Valley of Elah',
			reference: '1 Samuel 17:2',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Saul and the Israelites assembled and camped in the Valley of Elah.',
		},
		{
			question: 'Who was the wife of Moses?',
			options: ['Zipporah', 'Miriam', 'Rebekah', 'Leah'],
			answer: 'Zipporah',
			reference: 'Exodus 2:21',
			bibleBook: 'Exodus',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Moses agreed to stay with Jethro, who gave his daughter Zipporah to Moses in marriage.',
		},
		{
			question: 'On what mountain did Aaron die?',
			options: ['Mount Sinai', 'Mount Nebo', 'Mount Hor', 'Mount Carmel'],
			answer: 'Mount Hor',
			reference: 'Numbers 20:28',
			bibleBook: 'Numbers',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'Aaron died there on top of Mount Hor, and Moses and Eleazar came down from the mountain.',
		},
		{
			question: 'Who helped Jesus carry the cross on the way to Golgotha?',
			options: ['Peter', 'Simon of Cyrene', 'John', 'Joseph of Arimathea'],
			answer: 'Simon of Cyrene',
			reference: 'Luke 23:26',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'They seized Simon from Cyrene and put the cross on him and made him carry it behind Jesus.',
		},
		{
			question: 'Who was the father of the prophet Samuel?',
			options: ['Elkanah', 'Eli', 'Kish', 'Jesse'],
			answer: 'Elkanah',
			reference: '1 Samuel 1:1',
			bibleBook: '1 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'There was a certain man named Elkanah who had two wives, one named Hannah.',
		},
		{
			question: 'Which woman stayed with her mother-in-law Naomi after her husband died?',
			options: ['Orpah', 'Ruth', 'Esther', 'Leah'],
			answer: 'Ruth',
			reference: 'Ruth 1:16',
			bibleBook: 'Ruth',
			era: 'judges',
			category: 'history',
			explanation: 'Ruth replied, "Where you go I will go, and where you stay I will stay."',
		},
		{
			question: 'Which prophet saw a vision of a valley of dry bones coming to life?',
			options: ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel'],
			answer: 'Ezekiel',
			reference: 'Ezekiel 37:1-10',
			bibleBook: 'Ezekiel',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'The hand of the Lord was on me, and he brought me out by the Spirit to a valley full of bones.',
		},
		{
			question: 'Who was the king of Babylon when Jerusalem was destroyed?',
			options: ['Cyrus', 'Darius', 'Nebuchadnezzar', 'Belshazzar'],
			answer: 'Nebuchadnezzar',
			reference: '2 Kings 25:8',
			bibleBook: '2 Kings',
			era: 'exile',
			category: 'history',
			explanation: 'Nebuchadnezzar king of Babylon marched against Jerusalem with his whole army.',
		},
		{
			question: 'Who was the cupbearer to the Persian king who returned to rebuild Jerusalem\'s walls?',
			options: ['Nehemiah', 'Ezra', 'Zerubbabel', 'Mordecai'],
			answer: 'Nehemiah',
			reference: 'Nehemiah 1:11',
			bibleBook: 'Nehemiah',
			era: 'exile',
			category: 'history',
			explanation: 'Nehemiah was the cupbearer to King Artaxerxes before leading the wall reconstruction.',
		},
		{
			question: 'Which priest led the first group of exiles back to Jerusalem to rebuild the Temple?',
			options: ['Zerubbabel', 'Ezra', 'Joshua', 'Haggai'],
			answer: 'Zerubbabel',
			reference: 'Ezra 2:2',
			bibleBook: 'Ezra',
			era: 'exile',
			category: 'history',
			explanation: 'Zerubbabel was the governor who led the return and laid the foundation of the second temple.',
		},
		{
			question: 'Which Persian king allowed the Jews to return to Jerusalem?',
			options: ['Cyrus', 'Darius', 'Xerxes', 'Artaxerxes'],
			answer: 'Cyrus',
			reference: 'Ezra 1:1',
			bibleBook: 'Ezra',
			era: 'exile',
			category: 'history',
			explanation: 'Cyrus the Great issued the decree that allowed the Jews to return and rebuild.',
		},
		{
			question: 'What was the name of the mountain where Moses died?',
			options: ['Mount Sinai', 'Mount Nebo', 'Mount Carmel', 'Mount Ararat'],
			answer: 'Mount Nebo',
			reference: 'Deuteronomy 34:1',
			bibleBook: 'Deuteronomy',
			era: 'exodus',
			category: 'history',
			explanation: 'Moses went up from the plains of Moab to Mount Nebo, where the Lord showed him the Promised Land before he died.',
		},
		{
			question: 'Who was the grandmother of Timothy?',
			options: ['Eunice', 'Lois', 'Lydia', 'Dorcas'],
			answer: 'Lois',
			reference: '2 Timothy 1:5',
			bibleBook: '2 Timothy',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul mentioned the sincere faith of Timothy, which first lived in his grandmother Lois and his mother Eunice.',
		},
		{
			question: 'Which king of Judah was only eight years old when he began to reign?',
			options: ['Josiah', 'Hezekiah', 'Manasseh', 'Uzziah'],
			answer: 'Josiah',
			reference: '2 Kings 22:1',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Josiah was eight years old when he became king, and he reigned in Jerusalem thirty-one years.',
		},
		{
			question: 'Who was the husband of Priscilla?',
			options: ['Aquila', 'Apollos', 'Barnabas', 'Silas'],
			answer: 'Aquila',
			reference: 'Acts 18:2',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul met a Jew named Aquila and his wife Priscilla in Corinth; they were tentmakers like him.',
		},
		{
			question: 'What was the original name of the apostle Paul?',
			options: ['Saul', 'Simon', 'Silas', 'Stephen'],
			answer: 'Saul',
			reference: 'Acts 13:9',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Before he was known as Paul, he was called Saul of Tarsus.',
		},
	],
	expert: [
		{
			question: 'What was the name of the river that flowed out of Eden to water the garden?',
			options: ['Tigris', 'Euphrates', 'Gihon', 'Pishon'],
			answer: 'Pishon',
			reference: 'Genesis 2:10-14',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'The four rivers were Pishon, Gihon, Tigris, and Euphrates.',
		},
		{
			question: 'What was the Greek word used in John 1:1 that is translated as "Word" in English Bibles?',
			options: ['Ethos', 'Logos', 'Pathos', 'Mythos'],
			answer: 'Logos',
			reference: 'John 1:1',
			bibleBook: 'John',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Logos means "Word" and has philosophical and theological significance.',
		},
		{
			question: 'In which century was the canon of the New Testament officially settled?',
			options: ['1st century', '2nd century', '4th century', '16th century'],
			answer: '4th century',
			reference: 'New Testament Canon',
			bibleBook: 'None',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The 27 books of the New Testament were formally recognized in the 4th century.',
		},
		{
			question: 'What was the name of the biblical covenant where God promised Abraham a land, descendants, and blessing?',
			options: ['Mosaic Covenant', 'Davidic Covenant', 'Abrahamic Covenant', 'New Covenant'],
			answer: 'Abrahamic Covenant',
			reference: 'Genesis 12:1-3, 15:18-21',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'The Abrahamic Covenant is unconditional and eternal.',
		},
		{
			question: 'In which book is the "Shema" found?',
			options: ['Exodus', 'Deuteronomy', 'Leviticus', 'Numbers'],
			answer: 'Deuteronomy',
			reference: 'Deuteronomy 6:4-5',
			bibleBook: 'Deuteronomy',
			era: 'exodus',
			category: 'oldTestament',
			explanation: 'The Shema (Hear, O Israel) is found in Deuteronomy 6:4-5.',
		},
		{
			question: 'What was the name of the island where John wrote the Book of Revelation?',
			options: ['Ephesus', 'Patmos', 'Crete', 'Cyprus'],
			answer: 'Patmos',
			reference: 'Revelation 1:9',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'newTestament',
			explanation: 'John was exiled on the island of Patmos when he wrote Revelation.',
		},
		{
			question: 'Who was the king of Salem and priest of God Most High who blessed Abraham?',
			options: ['Abimelech', 'Melchizedek', 'Chedorlaomer', 'Potiphar'],
			answer: 'Melchizedek',
			reference: 'Genesis 14:18',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Melchizedek is a mysterious figure, a king-priest who prefigured Christ.',
		},
		{
			question: 'What city served as the capital of the Northern Kingdom of Israel?',
			options: ['Jerusalem', 'Samaria', 'Hebron', 'Shechem'],
			answer: 'Samaria',
			reference: '1 Kings 16:24',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'King Omri bought the hill of Samaria and built the city as the capital of Israel.',
		},
		{
			question: 'Who was the man that died instantly after touching the Ark of the Covenant?',
			options: ['Abinadab', 'Ahio', 'Uzzah', 'Eleazar'],
			answer: 'Uzzah',
			reference: '2 Samuel 6:6-7',
			bibleBook: '2 Samuel',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Uzzah reached out to steady the Ark and was struck dead by God for his irreverence.',
		},
		{
			question: 'In what region or land was the Tower of Babel built?',
			options: ['Ur', 'Shinar', 'Assyria', 'Egypt'],
			answer: 'Shinar',
			reference: 'Genesis 11:2',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'The people settled in a plain in the land of Shinar and decided to build a city and a tower.',
		},
		{
			question: 'In which epistle does Paul describe the "Armor of God" in detail?',
			options: ['Galatians', 'Ephesians', 'Philippians', 'Colossians'],
			answer: 'Ephesians',
			reference: 'Ephesians 6:10-18',
			bibleBook: 'Ephesians',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul uses the imagery of a soldier\'s armor to describe spiritual defenses for believers.',
		},
		{
			question: 'Which of the following kings of Judah was known for finding the Book of the Law in the Temple?',
			options: ['Hezekiah', 'Josiah', 'Jehoshaphat', 'Asa'],
			answer: 'Josiah',
			reference: '2 Kings 22:8',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Josiah led a great spiritual reformation after the Law was rediscovered.',
		},
		{
			question: 'Who was the Roman emperor during the majority of Jesus\' public ministry?',
			options: ['Augustus', 'Tiberius', 'Caligula', 'Nero'],
			answer: 'Tiberius',
			reference: 'Luke 3:1',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'newTestament',
			explanation: 'Tiberius Caesar ruled the Roman Empire from AD 14 to AD 37.',
		},
		{
			question: 'Which of the seven churches in Revelation is promised a "new name" and a "white stone"?',
			options: ['Pergamum', 'Thyatira', 'Sardis', 'Philadelphia'],
			answer: 'Pergamum',
			reference: 'Revelation 2:17',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'newTestament',
			explanation: 'The overcomers in Pergamum are promised hidden manna and a white stone with a new name.',
		},
		{
			question: 'Who was the Persian king who issued the decree allowing the Jews to return and rebuild the Temple?',
			options: ['Darius', 'Xerxes', 'Cyrus', 'Artaxerxes'],
			answer: 'Cyrus',
			reference: 'Ezra 1:1-3',
			bibleBook: 'Ezra',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'Cyrus the Great was prompted by God to allow the Jewish exiles to return to Jerusalem.',
		},
		{
			question: 'Who was the king of the Southern Kingdom of Judah when Jerusalem fell to Babylon?',
			options: ['Jehoiachin', 'Jehoiakim', 'Zedekiah', 'Josiah'],
			answer: 'Zedekiah',
			reference: '2 Kings 25:1-7',
			bibleBook: '2 Kings',
			era: 'exile',
			category: 'history',
			explanation: 'Zedekiah was the last king of Judah before the total Babylonian destruction.',
		},
		{
			question: 'What was the name of the Roman centurion in Caesarea who was the first Gentile convert mentioned in Acts?',
			options: ['Julius', 'Cornelius', 'Claudius', 'Publius'],
			answer: 'Cornelius',
			reference: 'Acts 10:1-2',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Cornelius was a devout man whose vision led to Peter visiting him and the Holy Spirit falling on Gentiles.',
		},
		{
			question: 'Who was the father of Noah?',
			options: ['Methuselah', 'Lamech', 'Enoch', 'Jared'],
			answer: 'Lamech',
			reference: 'Genesis 5:28-29',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Lamech was 182 years old when he had Noah, naming him so because he would bring comfort.',
		},
		{
			question: 'What was the name of the city that served as the capital of the Assyrian Empire and to which Jonah was sent?',
			options: ['Babylon', 'Nineveh', 'Susa', 'Tarshish'],
			answer: 'Nineveh',
			reference: 'Jonah 1:2',
			bibleBook: 'Jonah',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'Nineveh was a great city that Jonah eventually preached to, leading to their repentance.',
		},
		{
			question: 'Which king of Persia allowed the Jews to return to Jerusalem?',
			options: ['Cyrus', 'Darius', 'Xerxes', 'Artaxerxes'],
			answer: 'Cyrus',
			reference: 'Ezra 1:1',
			bibleBook: 'Ezra',
			era: 'exile',
			category: 'history',
			explanation: 'Cyrus the Great issued the decree that allowed the Jews to return and rebuild.',
		},
		{
			question: 'How many days was Jonah in the belly of the great fish?',
			options: ['One', 'Two', 'Three', 'Seven'],
			answer: 'Three',
			reference: 'Jonah 1:17',
			bibleBook: 'Jonah',
			era: 'unitedKingdom',
			category: 'prophecy',
			explanation: 'Jonah was in the belly of the fish three days and three nights.',
		},
		{
			question: 'Who were the three friends of Daniel thrown into the fiery furnace?',
			options: ['Shadrach, Meshach, Abednego', 'Ezra, Nehemiah, Zerubbabel', 'Peter, James, John', 'Abraham, Isaac, Jacob'],
			answer: 'Shadrach, Meshach, Abednego',
			reference: 'Daniel 3:23',
			bibleBook: 'Daniel',
			era: 'exile',
			category: 'oldTestament',
			explanation: 'These three men, Shadrach, Meshach and Abednego, fell bound into the blazing furnace.',
		},
		{
			question: 'Who was the wife of Boaz and great-grandmother of King David?',
			options: ['Ruth', 'Naomi', 'Rahab', 'Sarah'],
			answer: 'Ruth',
			reference: 'Ruth 4:13, 17',
			bibleBook: 'Ruth',
			era: 'judges',
			category: 'history',
			explanation: 'So Boaz took Ruth and she became his wife... And they named him Obed. He was the father of Jesse, the father of David.',
		},
		{
			question: 'Who was the Roman procurator of Judea before whom Paul appeared in Caesarea and who was succeeded by Porcius Festus?',
			options: ['Pontius Pilate', 'Antonius Felix', 'Gallio', 'Agrippa'],
			answer: 'Antonius Felix',
			reference: 'Acts 23:24, 24:27',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Felix kept Paul in prison for two years, hoping for a bribe, before being succeeded by Festus.',
		},
		{
			question: 'Who was the mother of Timothy?',
			options: ['Lydia', 'Eunice', 'Phoebe', 'Lois'],
			answer: 'Eunice',
			reference: '2 Timothy 1:5',
			bibleBook: '2 Timothy',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul recalled the sincere faith that lived in Timothy\'s mother Eunice and grandmother Lois.',
		},
		{
			question: 'Where did Jacob have a dream of a ladder reaching to heaven?',
			options: ['Bethel', 'Hebron', 'Shechem', 'Beersheba'],
			answer: 'Bethel',
			reference: 'Genesis 28:19',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Jacob called that place Bethel, though the city used to be called Luz.',
		},
		{
			question: 'Which king of Israel reigned for only seven days?',
			options: ['Zimri', 'Omri', 'Shallum', 'Zechariah'],
			answer: 'Zimri',
			reference: '1 Kings 16:15',
			bibleBook: '1 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Zimri reigned in Tirzah seven days until he set the palace on fire around him.',
		},
		{
			question: 'Who was the high priest who found the Book of the Law during Josiah\'s reign?',
			options: ['Hilkiah', 'Zadok', 'Abiathar', 'Jehoiada'],
			answer: 'Hilkiah',
			reference: '2 Kings 22:4',
			bibleBook: '2 Kings',
			era: 'unitedKingdom',
			category: 'history',
			explanation: 'Hilkiah the high priest said to Shaphan the secretary, "I have found the Book of the Law in the temple of the Lord."',
		},
		{
			question: 'In what city was the apostle Paul born?',
			options: ['Jerusalem', 'Antioch', 'Tarsus', 'Rome'],
			answer: 'Tarsus',
			reference: 'Acts 22:3',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul said, "I am a Jew, born in Tarsus of Cilicia, but brought up in this city."',
		},
		{
			question: 'Who was the queen of Persia before Esther?',
			options: ['Vashti', 'Jezebel', 'Athaliah', 'Sheba'],
			answer: 'Vashti',
			reference: 'Esther 1:19',
			bibleBook: 'Esther',
			era: 'exile',
			category: 'history',
			explanation: 'King Xerxes issued a royal decree that Vashti was never again to enter his presence.',
		},
		{
			question: 'Who were the tentmakers Paul stayed with in Corinth?',
			options: ['Ananias and Sapphira', 'Priscilla and Aquila', 'Philemon and Apphia', 'Barnabas and Mark'],
			answer: 'Priscilla and Aquila',
			reference: 'Acts 18:2-3',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Because Paul was a tentmaker as they were, he stayed and worked with them.',
		},
		{
			question: 'Who was the famous Pharisee and teacher of the law who taught the apostle Paul?',
			options: ['Nicodemus', 'Gamaliel', 'Caiaphas', 'Hillel'],
			answer: 'Gamaliel',
			reference: 'Acts 22:3',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul was thoroughly trained in the law of our ancestors under Gamaliel.',
		},
		{
			question: 'Who was the Roman governor who succeeded Felix and sent Paul to Rome?',
			options: ['Pontius Pilate', 'Porcius Festus', 'Gallio', 'Sergius Paulus'],
			answer: 'Porcius Festus',
			reference: 'Acts 24:27',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'When two years had passed, Felix was succeeded by Porcius Festus.',
		},
		{
			question: 'Who was the father of Methuselah?',
			options: ['Enoch', 'Lamech', 'Jared', 'Adam'],
			answer: 'Enoch',
			reference: 'Genesis 5:21',
			bibleBook: 'Genesis',
			era: 'creation',
			category: 'oldTestament',
			explanation: 'Enoch was 65 years old when he became the father of Methuselah.',
		},
		{
			question: 'Who was the Roman emperor when Jesus was born?',
			options: ['Tiberius', 'Augustus', 'Nero', 'Claudius'],
			answer: 'Augustus',
			reference: 'Luke 2:1',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'history',
			explanation: 'In those days Caesar Augustus issued a decree that a census should be taken of the entire Roman world.',
		},
		{
			question: 'What was the name of the place where the sun stood still for Joshua?',
			options: ['Jericho', 'Ai', 'Gibeon', 'Beth-el'],
			answer: 'Gibeon',
			reference: 'Joshua 10:12',
			bibleBook: 'Joshua',
			era: 'exodus',
			category: 'history',
			explanation: 'Joshua said to the Lord in the presence of Israel: "Sun, stand still over Gibeon."',
		},
		{
			question: 'Which gospel is addressed to a person named Theophilus?',
			options: ['Matthew', 'Mark', 'Luke', 'John'],
			answer: 'Luke',
			reference: 'Luke 1:3',
			bibleBook: 'Luke',
			era: 'gospels',
			category: 'gospels',
			explanation: 'Luke addressed both his Gospel and the book of Acts to "most excellent Theophilus."',
		},
		{
			question: 'What was the name of the city that Paul was traveling to when he saw a bright light and heard Jesus\' voice?',
			options: ['Jerusalem', 'Damascus', 'Antioch', 'Rome'],
			answer: 'Damascus',
			reference: 'Acts 9:3',
			bibleBook: 'Acts',
			era: 'acts',
			category: 'newTestament',
			explanation: 'As Saul neared Damascus on his journey, suddenly a light from heaven flashed around him.',
		},
		{
			question: 'Which of the twelve tribes of Israel was Paul from?',
			options: ['Judah', 'Levi', 'Benjamin', 'Reuben'],
			answer: 'Benjamin',
			reference: 'Philippians 3:5',
			bibleBook: 'Philippians',
			era: 'acts',
			category: 'newTestament',
			explanation: 'Paul described himself as being "of the people of Israel, of the tribe of Benjamin."',
		},
		{
			question: 'Who was the father of the prophet Isaiah?',
			options: ['Amoz', 'Amos', 'Azariah', 'Ahaz'],
			answer: 'Amoz',
			reference: 'Isaiah 1:1',
			bibleBook: 'Isaiah',
			era: 'unitedKingdom',
			category: 'oldTestament',
			explanation: 'The vision concerning Judah and Jerusalem that Isaiah son of Amoz saw.',
		},
		{
			question: 'What was the name of the place where Jacob wrestled with God?',
			options: ['Bethel', 'Peniel', 'Shechem', 'Hebron'],
			answer: 'Peniel',
			reference: 'Genesis 32:30',
			bibleBook: 'Genesis',
			era: 'patriarchs',
			category: 'oldTestament',
			explanation: 'Jacob called the place Peniel, saying, "It is because I saw God face to face, and yet my life was spared."',
		},
		{
			question: 'Which of the seven churches in Revelation was told they had a reputation for being alive but were dead?',
			options: ['Sardis', 'Laodicea', 'Smyrna', 'Philadelphia'],
			answer: 'Sardis',
			reference: 'Revelation 3:1',
			bibleBook: 'Revelation',
			era: 'acts',
			category: 'newTestament',
			explanation: 'To the angel of the church in Sardis write: "I know your deeds; you have a reputation of being alive, but you are dead."',
		},
	],
};

export const ADDITIONAL_QUESTIONS = Object.fromEntries(
	Object.entries(RAW_ADDITIONAL_QUESTIONS).map(([difficulty, questions]) => [
		difficulty,
		questions.map(enrichQuestion),
	])
);

const CANON_QUESTION_TARGET = 50;

const OT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
];

const NT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

const ALL_BOOKS = [...OT_BOOKS, ...NT_BOOKS];
const NEW_TESTAMENT_SET = new Set(NT_BOOKS);
const GOSPEL_SET = new Set(['Matthew', 'Mark', 'Luke', 'John']);
const LETTERS_SET = new Set([
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
  'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude',
]);
const WISDOM_SET = new Set(['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon']);
const HISTORY_SET = new Set([
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles',
  '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Acts',
]);
const PROPHECY_SET = new Set([
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Revelation',
]);

const inferCategoryForBook = (book) => {
  if (GOSPEL_SET.has(book)) return 'gospels';
  if (WISDOM_SET.has(book)) return 'wisdom';
  if (HISTORY_SET.has(book)) return 'history';
  if (PROPHECY_SET.has(book)) return 'prophecy';
  return NEW_TESTAMENT_SET.has(book) ? 'newTestament' : 'oldTestament';
};

const inferEraForBook = (book) => {
  if (GOSPEL_SET.has(book)) return 'gospels';
  if (book === 'Acts') return 'acts';
  if (book === 'Revelation') return 'revelation';
  if (LETTERS_SET.has(book)) return 'letters';
  if (book === 'Genesis') return 'creation';
  if (['Exodus', 'Leviticus'].includes(book)) return 'exodus';
  if (['Numbers', 'Deuteronomy'].includes(book)) return 'wilderness';
  if (book === 'Joshua') return 'conquest';
  if (['Judges', 'Ruth'].includes(book)) return 'judges';
  if (['1 Samuel', '2 Samuel', '1 Chronicles', '2 Chronicles'].includes(book)) return 'unitedKingdom';
  if (['Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'].includes(book)) return 'wisdom';
  if (['1 Kings', '2 Kings'].includes(book)) return 'dividedKingdom';
  if (['Ezra', 'Nehemiah', 'Esther'].includes(book)) return 'return';
  if (['Job', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'].includes(book)) return 'prophets';
  return 'creation';
};

const rotateOptions = (options, seed) => {
  const shift = seed % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
};

const buildBookOptions = (correctBook, seed) => {
  const correctIndex = ALL_BOOKS.indexOf(correctBook);
  const nearOffsets = [-3, -2, -1, 1, 2, 3, 4, -4];
  const distractors = [];

  for (const offset of nearOffsets) {
    const idx = correctIndex + offset;
    if (idx < 0 || idx >= ALL_BOOKS.length) continue;
    const candidate = ALL_BOOKS[idx];
    if (candidate !== correctBook && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
    if (distractors.length === 3) break;
  }

  if (distractors.length < 3) {
    for (const candidate of ALL_BOOKS) {
      if (candidate !== correctBook && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
      if (distractors.length === 3) break;
    }
  }

  return rotateOptions([correctBook, ...distractors], seed);
};

const buildPositionOptions = (correctPosition, seed) => {
  const candidates = new Set([correctPosition]);
  const offsets = [1, -1, 3, -3, 5, -5];

  for (const offset of offsets) {
    const value = correctPosition + offset;
    if (value >= 1 && value <= ALL_BOOKS.length) {
      candidates.add(value);
    }
    if (candidates.size >= 4) break;
  }

  if (candidates.size < 4) {
    for (let n = 1; n <= ALL_BOOKS.length; n++) {
      candidates.add(n);
      if (candidates.size >= 4) break;
    }
  }

  return rotateOptions(Array.from(candidates).slice(0, 4).map(String), seed);
};

const buildCountOptions = (correctCount, seed) => {
  const candidates = new Set([correctCount]);
  const offsets = [1, -1, 2, -2, 4, -4, 6, -6];

  for (const offset of offsets) {
    const value = correctCount + offset;
    if (value >= 0 && value < ALL_BOOKS.length) {
      candidates.add(value);
    }
    if (candidates.size >= 4) break;
  }

  if (candidates.size < 4) {
    for (let n = 0; n < ALL_BOOKS.length; n++) {
      candidates.add(n);
      if (candidates.size >= 4) break;
    }
  }

  return rotateOptions(Array.from(candidates).slice(0, 4).map(String), seed);
};

const buildCanonQuestions = () => {
  const easy = [];
  const medium = [];
  const hard = [];
  const expert = [];

  for (let i = 0; i < CANON_QUESTION_TARGET; i++) {
    const current = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i + 1];
    easy.push({
      question: `Which book comes immediately after ${current}?`,
      options: buildBookOptions(answer, i),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} follows ${current} in the standard Protestant order of biblical books.`,
    });
  }

  for (let i = 0; i < CANON_QUESTION_TARGET; i++) {
    const targetIndex = i + 16;
    const targetBook = ALL_BOOKS[targetIndex];
    const answer = ALL_BOOKS[targetIndex - 1];
    medium.push({
      question: `Which book comes immediately before ${targetBook}?`,
      options: buildBookOptions(answer, i + 50),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} appears immediately before ${targetBook} in the standard biblical order.`,
    });
  }

  for (let i = 0; i < CANON_QUESTION_TARGET; i++) {
    const index = (i * 5) % ALL_BOOKS.length;
    const book = ALL_BOOKS[index];
    const answer = String(index + 1);
    hard.push({
      question: `In the standard Protestant order, what number book of the Bible is ${book}?`,
      options: buildPositionOptions(index + 1, i + 100),
      answer,
      reference: 'Biblical Canon',
      bibleBook: book,
      era: inferEraForBook(book),
      category: inferCategoryForBook(book),
      explanation: `${book} is book number ${index + 1} in the 66-book Protestant Bible order.`,
    });
  }

  for (let i = 0; i < CANON_QUESTION_TARGET; i++) {
    const centerIndex = i + 7;
    const previous = ALL_BOOKS[centerIndex - 1];
    const answer = ALL_BOOKS[centerIndex];
    const next = ALL_BOOKS[centerIndex + 1];
    expert.push({
      question: `Which book is positioned between ${previous} and ${next}?`,
      options: buildBookOptions(answer, i + 150),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} sits between ${previous} and ${next} in the standard biblical order.`,
    });
  }

  return { easy, medium, hard, expert };
};

export const CANON_QUESTIONS = buildCanonQuestions();

const CANON_BATCH_TWO_TARGET = 50;

const buildCanonBatchTwoQuestions = () => {
  const easy = [];
  const medium = [];
  const hard = [];
  const expert = [];

  for (let i = 0; i < CANON_BATCH_TWO_TARGET; i++) {
    const current = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i + 2];
    easy.push({
      question: `Which book comes two books after ${current}?`,
      options: buildBookOptions(answer, i + 200),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} is two positions after ${current} in the standard Protestant biblical order.`,
    });
  }

  for (let i = 0; i < CANON_BATCH_TWO_TARGET; i++) {
    const targetBook = ALL_BOOKS[i + 2];
    const answer = ALL_BOOKS[i];
    medium.push({
      question: `Which book comes two books before ${targetBook}?`,
      options: buildBookOptions(answer, i + 250),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} is two positions before ${targetBook} in the standard Protestant biblical order.`,
    });
  }

  for (let i = 0; i < CANON_BATCH_TWO_TARGET; i++) {
    const bookIndex = i + 8;
    const book = ALL_BOOKS[bookIndex];
    const answer = String(bookIndex);
    hard.push({
      question: `How many books come before ${book} in the standard 66-book Protestant order?`,
      options: buildCountOptions(bookIndex, i + 300),
      answer,
      reference: 'Biblical Canon',
      bibleBook: book,
      era: inferEraForBook(book),
      category: inferCategoryForBook(book),
      explanation: `There are ${bookIndex} books before ${book} in the standard 66-book Protestant order.`,
    });
  }

  for (let i = 0; i < CANON_BATCH_TWO_TARGET; i++) {
    const bookIndex = i + 8;
    const book = ALL_BOOKS[bookIndex];
    const countAfter = ALL_BOOKS.length - (bookIndex + 1);
    const answer = String(countAfter);
    expert.push({
      question: `How many books come after ${book} in the standard 66-book Protestant order?`,
      options: buildCountOptions(countAfter, i + 350),
      answer,
      reference: 'Biblical Canon',
      bibleBook: book,
      era: inferEraForBook(book),
      category: inferCategoryForBook(book),
      explanation: `There are ${countAfter} books after ${book} in the standard 66-book Protestant order.`,
    });
  }

  return { easy, medium, hard, expert };
};

export const CANON_BATCH_TWO_QUESTIONS = buildCanonBatchTwoQuestions();

const normalizeQuestionKey = (questionText = '') =>
  questionText.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const dedupeQuestions = (questions, seenKeys) => {
  const unique = [];

  for (const question of questions) {
    const enriched = enrichQuestion(question);
    const key = normalizeQuestionKey(enriched.question);
    if (!key || seenKeys.has(key)) continue;
    seenKeys.add(key);
    unique.push(enriched);
  }

  return unique;
};

const RAW_QUESTIONS = {
  easy: [
    ...BASE_QUESTIONS.easy,
    ...ADDITIONAL_QUESTIONS.easy,
    ...CANON_QUESTIONS.easy,
    ...CANON_BATCH_TWO_QUESTIONS.easy,
  ],
  medium: [
    ...BASE_QUESTIONS.medium,
    ...ADDITIONAL_QUESTIONS.medium,
    ...CANON_QUESTIONS.medium,
    ...CANON_BATCH_TWO_QUESTIONS.medium,
  ],
  hard: [
    ...BASE_QUESTIONS.hard,
    ...ADDITIONAL_QUESTIONS.hard,
    ...CANON_QUESTIONS.hard,
    ...CANON_BATCH_TWO_QUESTIONS.hard,
  ],
  expert: [
    ...(ADDITIONAL_QUESTIONS.expert || []),
    ...CANON_QUESTIONS.expert,
    ...CANON_BATCH_TWO_QUESTIONS.expert,
  ],
};

const QUESTION_TOTAL_TARGET = 1000;
const QUESTION_DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'expert'];

const buildSupplementalQuestions = () => {
  const easy = [];
  const medium = [];
  const hard = [];
  const expert = [];

  for (let i = 0; i < ALL_BOOKS.length - 3; i++) {
    const current = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i + 3];
    easy.push({
      question: `In the 66-book order, which book comes three books after ${current}?`,
      options: buildBookOptions(answer, i + 500),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} is three places after ${current} in the standard Protestant biblical order.`,
    });
  }

  for (let i = 3; i < ALL_BOOKS.length; i++) {
    const targetBook = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i - 3];
    easy.push({
      question: `In the 66-book order, which book comes three books before ${targetBook}?`,
      options: buildBookOptions(answer, i + 600),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `${answer} is three places before ${targetBook} in the standard Protestant biblical order.`,
    });
  }

  for (let i = 0; i < ALL_BOOKS.length - 4; i++) {
    const current = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i + 4];
    medium.push({
      question: `Starting at ${current}, what is the fifth book including the starting book?`,
      options: buildBookOptions(answer, i + 700),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `Counting ${current} as first, ${answer} is the fifth book in sequence.`,
    });
  }

  for (let i = 4; i < ALL_BOOKS.length; i++) {
    const current = ALL_BOOKS[i];
    const answer = ALL_BOOKS[i - 4];
    medium.push({
      question: `Counting backward from ${current}, what is the fifth book including the starting book?`,
      options: buildBookOptions(answer, i + 800),
      answer,
      reference: 'Biblical Canon',
      bibleBook: answer,
      era: inferEraForBook(answer),
      category: inferCategoryForBook(answer),
      explanation: `Counting ${current} as first while moving backward, ${answer} is the fifth book in sequence.`,
    });
  }

  for (let i = 0; i < ALL_BOOKS.length - 6; i++) {
    const first = ALL_BOOKS[i];
    const second = ALL_BOOKS[i + 6];
    const answer = '5';
    hard.push({
      question: `How many books are between ${first} and ${second} in the standard order?`,
      options: buildCountOptions(Number(answer), i + 900),
      answer,
      reference: 'Biblical Canon',
      bibleBook: first,
      era: inferEraForBook(first),
      category: inferCategoryForBook(first),
      explanation: `There are exactly five books between ${first} and ${second}.`,
    });
  }

  for (let i = 0; i < ALL_BOOKS.length - 10; i++) {
    const first = ALL_BOOKS[i];
    const second = ALL_BOOKS[i + 10];
    const answer = '9';
    hard.push({
      question: `How many books are between ${first} and ${second} in the standard 66-book order?`,
      options: buildCountOptions(Number(answer), i + 1000),
      answer,
      reference: 'Biblical Canon',
      bibleBook: first,
      era: inferEraForBook(first),
      category: inferCategoryForBook(first),
      explanation: `There are exactly nine books between ${first} and ${second} in the standard order.`,
    });
  }

  for (let i = 0; i < ALL_BOOKS.length - 15; i++) {
    const book = ALL_BOOKS[i + 15];
    const answer = String(i + 16);
    expert.push({
      question: `What is the position number of ${book} in the 66-book Protestant order?`,
      options: buildPositionOptions(i + 16, i + 1100),
      answer,
      reference: 'Biblical Canon',
      bibleBook: book,
      era: inferEraForBook(book),
      category: inferCategoryForBook(book),
      explanation: `${book} is book number ${i + 16} in the standard Protestant biblical order.`,
    });
  }

  for (let i = 0; i < ALL_BOOKS.length - 15; i++) {
    const index = i + 15;
    const book = ALL_BOOKS[index];
    const answer = String(ALL_BOOKS.length - index);
    expert.push({
      question: `What is ${book}'s position when counting from the end of the 66-book order?`,
      options: buildPositionOptions(ALL_BOOKS.length - index, i + 1200),
      answer,
      reference: 'Biblical Canon',
      bibleBook: book,
      era: inferEraForBook(book),
      category: inferCategoryForBook(book),
      explanation: `${book} is position ${ALL_BOOKS.length - index} when counting backward from Revelation.`,
    });
  }

  return { easy, medium, hard, expert };
};

const buildQuestions = () => {
  const seenQuestionKeys = new Set();
  const questions = {
    easy: dedupeQuestions(RAW_QUESTIONS.easy, seenQuestionKeys),
    medium: dedupeQuestions(RAW_QUESTIONS.medium, seenQuestionKeys),
    hard: dedupeQuestions(RAW_QUESTIONS.hard, seenQuestionKeys),
    expert: dedupeQuestions(RAW_QUESTIONS.expert, seenQuestionKeys),
  };

  const supplemental = buildSupplementalQuestions();
  const supplementalIndex = { easy: 0, medium: 0, hard: 0, expert: 0 };

  let total =
    questions.easy.length +
    questions.medium.length +
    questions.hard.length +
    questions.expert.length;

  let cursor = 0;
  while (total < QUESTION_TOTAL_TARGET) {
    const difficulty = QUESTION_DIFFICULTY_ORDER[cursor % QUESTION_DIFFICULTY_ORDER.length];
    cursor += 1;

    const pool = supplemental[difficulty];
    let added = false;

    while (supplementalIndex[difficulty] < pool.length && !added) {
      const candidate = pool[supplementalIndex[difficulty]];
      supplementalIndex[difficulty] += 1;
      const uniqueCandidate = dedupeQuestions([candidate], seenQuestionKeys);
      if (uniqueCandidate.length > 0) {
        questions[difficulty].push(uniqueCandidate[0]);
        total += 1;
        added = true;
      }
    }

    if (!added) {
      const hasRemainingCandidates = QUESTION_DIFFICULTY_ORDER.some(
        (key) => supplementalIndex[key] < supplemental[key].length
      );
      if (!hasRemainingCandidates) break;
    }
  }

  return questions;
};

export const QUESTIONS = buildQuestions();

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

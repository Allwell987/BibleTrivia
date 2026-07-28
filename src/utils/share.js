import { Share, Platform } from 'react-native';

const GRADES = {
  perfect: { emoji: '🏆', text: 'PERFECT!' },
  excellent: { emoji: '⭐', text: 'Excellent!' },
  great: { emoji: '👍', text: 'Great job!' },
  good: { emoji: '📖', text: 'Good effort!' },
  keepTrying: { emoji: '🙏', text: 'Keep practicing!' },
};

function getGrade(pct) {
  if (pct === 100) return GRADES.perfect;
  if (pct >= 90) return GRADES.excellent;
  if (pct >= 70) return GRADES.great;
  if (pct >= 50) return GRADES.good;
  return GRADES.keepTrying;
}

export async function shareResults({ score, total, difficulty, pct, playerName, didYouKnowFact = '' }) {
  const grade = getGrade(pct);
  const factLine = didYouKnowFact ? `\n\nDid you know? ${didYouKnowFact}` : '';

  const messages = {
    android: `📖 Bible Trivia Results 📖\n\n${playerName} scored ${score}/${total} (${pct}%) on ${difficulty.toUpperCase()} mode!\n\n${grade.emoji} ${grade.text}${factLine}\n\nTest your Bible knowledge!\n\n#BibleTrivia #Scripture #Faith`,

    ios: `📖 Bible Trivia Results 📖\n\n${playerName} scored ${score}/${total} (${pct}%) on ${difficulty.toUpperCase()} mode!\n\n${grade.emoji} ${grade.text}${factLine}\n\nTest your Bible knowledge! #BibleTrivia`,

    generic: `I just scored ${score}/${total} (${pct}%) on ${difficulty} Bible Trivia! ${grade.emoji} ${grade.text}${factLine}\n\nTest your knowledge of Scripture! Download the Bible Trivia App.`,
  };

  const message = Platform.OS === 'android' ? messages.android : messages.ios;

  try {
    const result = await Share.share({
      message,
      title: `${playerName}'s Bible Trivia Score - ${grade.text}`,
    });
    return result;
  } catch (error) {
    console.warn('Share failed:', error);
    return { action: Share.sharedAction };
  }
}

export async function shareAchievement({ title, description, icon }) {
  const message = `🎉 I just unlocked "${title}" in Bible Trivia!\n\n${icon} ${description}\n\nCan you beat my achievements? Download Bible Trivia!\n\n#BibleTrivia #AchievementUnlocked`;

  try {
    const result = await Share.share({
      message,
      title: `Achievement Unlocked: ${title}`,
    });
    return result;
  } catch (error) {
    console.warn('Share failed:', error);
    return { action: Share.sharedAction };
  }
}

export async function shareStreak({ streak }) {
  const message = `🔥 I'm on a ${streak}-day streak in Bible Trivia!\n\nKeeping up with my daily Bible study! Join me and test your knowledge.\n\n#BibleTrivia #Streak #Faith`;

  try {
    const result = await Share.share({
      message,
      title: `My ${streak}-Day Bible Trivia Streak!`,
    });
    return result;
  } catch (error) {
    console.warn('Share failed:', error);
    return { action: Share.sharedAction };
  }
}

export async function shareChallenge({ mode, score, correct, total }) {
  const message = `⚡ I just played ${mode} in Bible Trivia!\n\nScore: ${score} points\nCorrect: ${correct}/${total}\n\nThink you can beat me? Download the Bible Trivia App!\n\n#BibleTrivia #Challenge`;

  try {
    const result = await Share.share({
      message,
      title: `Bible Trivia Challenge: ${mode}`,
    });
    return result;
  } catch (error) {
    console.warn('Share failed:', error);
    return { action: Share.sharedAction };
  }
}

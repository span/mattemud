/**
 * AnswerValidator - Delad svarsvalidering
 */

class AnswerValidator {
  static check(userAnswer, correctAnswer) {
    const clean = userAnswer.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();

    // Exakt match
    if (clean === correct) return true;

    // Whitespace-tolerant
    if (clean.replace(/\s/g, '') === correct.replace(/\s/g, '')) return true;

    // Procent-format: "50" matchar "50%"
    if (correct.endsWith('%') && clean.replace('%', '') === correct.slice(0, -1)) return true;

    // Rest-format: "5rest2" matchar "5 rest 2"
    if (correct.includes('rest')) {
      if (clean.replace(',', '').replace(/\s/g, '') === correct.replace(/\s/g, '')) return true;
    }

    // Komma som decimal: "3,5" → "3.5"
    const numeric = clean.replace(',', '.');
    if (numeric === correct) return true;

    // Numerisk jämförelse
    const userNum = parseFloat(numeric);
    const correctNum = parseFloat(correct);
    if (!isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum) return true;

    return false;
  }
}

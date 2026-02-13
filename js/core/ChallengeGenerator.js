/**
 * ChallengeGenerator - Matteuppgifter för huvudräkning
 */

class MathProblem {
  constructor({ question, answer, category, difficulty, hint = '', methodExplanation = '' }) {
    this.question = question;
    this.answer = String(answer);
    this.category = category;
    this.difficulty = difficulty;
    this.hint = hint;
    this.methodExplanation = methodExplanation;
  }
}

class ChallengeGenerator {
  generate(category, difficulty = 1) {
    const generators = {
      addition: (d) => this._generateAddition(d),
      subtraction: (d) => this._generateSubtraction(d),
      multiplication: (d) => this._generateMultiplication(d),
      division: (d) => this._generateDivision(d),
    };

    const generator = generators[category] || generators.addition;
    return generator(difficulty);
  }

  _rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Addition
  // diff 1: 1-5 + 1-5
  // diff 2: 1-10 + 1-10
  // diff 3: tiotal (10+20, 30+40 etc.)
  _generateAddition(difficulty) {
    if (difficulty <= 1) {
      const a = this._rand(1, 5);
      const b = this._rand(1, 5);
      return new MathProblem({
        question: `Vad är ${a} + ${b}?`,
        answer: a + b,
        category: 'addition',
        difficulty,
        hint: 'Räkna på fingrarna!',
        methodExplanation: `${a} + ${b} = ${a + b}\nBara räkna ihop talen!`
      });
    } else if (difficulty === 2) {
      const a = this._rand(1, 10);
      const b = this._rand(1, 10);
      return new MathProblem({
        question: `Vad är ${a} + ${b}?`,
        answer: a + b,
        category: 'addition',
        difficulty,
        hint: 'Börja på det största talet och räkna uppåt!',
        methodExplanation: `${a} + ${b} = ${a + b}`
      });
    } else {
      const a = this._choice([10, 20, 30, 40, 50]);
      const b = this._choice([10, 20, 30, 40]);
      return new MathProblem({
        question: `Vad är ${a} + ${b}?`,
        answer: a + b,
        category: 'addition',
        difficulty,
        hint: 'Tänk i tiotal!',
        methodExplanation: `${a} + ${b} = ${a + b}`
      });
    }
  }

  // Subtraktion
  // diff 1: inom 10 (a > b alltid)
  // diff 2: inom 20 (t.ex. 17 - 9)
  // diff 3: tiotal (80 - 30, 70 - 20 etc.)
  _generateSubtraction(difficulty) {
    if (difficulty <= 1) {
      const a = this._rand(3, 10);
      const b = this._rand(1, a - 1);
      return new MathProblem({
        question: `Vad är ${a} - ${b}?`,
        answer: a - b,
        category: 'subtraction',
        difficulty,
        hint: 'Börja på det stora talet och räkna bakåt!',
        methodExplanation: `${a} - ${b} = ${a - b}`
      });
    } else if (difficulty === 2) {
      const a = this._rand(11, 20);
      const b = this._rand(2, a - 1);
      return new MathProblem({
        question: `Vad är ${a} - ${b}?`,
        answer: a - b,
        category: 'subtraction',
        difficulty,
        hint: 'Dela upp i steg om det hjälper!',
        methodExplanation: `${a} - ${b} = ${a - b}`
      });
    } else {
      const a = this._choice([50, 60, 70, 80, 90, 100]);
      const b = this._choice([10, 20, 30, 40]);
      const correctedB = b >= a ? a - 10 : b;
      return new MathProblem({
        question: `Vad är ${a} - ${correctedB}?`,
        answer: a - correctedB,
        category: 'subtraction',
        difficulty,
        hint: 'Tänk i tiotal!',
        methodExplanation: `${a} - ${correctedB} = ${a - correctedB}`
      });
    }
  }

  // Multiplikation - difficulty = tabellens nummer
  // diff 0: 0:ans tabell, diff 1: 1:ans tabell, ... diff 10: 10:ans
  // diff 11: blandade tabeller 2-10
  _generateMultiplication(difficulty) {
    // 0:ans tabell - allt gånger 0 = 0
    if (difficulty === 0) {
      const b = this._rand(0, 10);
      const [first, second] = Math.random() < 0.5 ? [0, b] : [b, 0];
      return new MathProblem({
        question: `Vad är ${first} × ${second}?`,
        answer: 0,
        category: 'multiplication',
        difficulty,
        hint: 'Allt gånger noll blir...?',
        methodExplanation: `${first} × ${second} = 0\nAllt gånger 0 blir alltid 0!`
      });
    }

    // 1:ans tabell - allt gånger 1 = sig själv
    if (difficulty === 1) {
      const b = this._rand(0, 10);
      const [first, second] = Math.random() < 0.5 ? [1, b] : [b, 1];
      return new MathProblem({
        question: `Vad är ${first} × ${second}?`,
        answer: first * second,
        category: 'multiplication',
        difficulty,
        hint: 'Allt gånger ett blir sig själv!',
        methodExplanation: `${first} × ${second} = ${first * second}\nAllt gånger 1 förblir samma tal!`
      });
    }

    // Blandade tabeller
    let table;
    if (difficulty >= 2 && difficulty <= 10) {
      table = difficulty;
    } else {
      table = this._rand(2, 10);
    }

    const b = this._rand(1, 10);
    const answer = table * b;

    // Slumpa ordningen så det inte alltid är "tabell × tal"
    const [first, second] = Math.random() < 0.5 ? [table, b] : [b, table];

    return new MathProblem({
      question: `Vad är ${first} × ${second}?`,
      answer,
      category: 'multiplication',
      difficulty,
      hint: `Tänk på ${table}:ans tabell!`,
      methodExplanation: `${first} × ${second} = ${answer}`
    });
  }

  // Division
  // diff 1: jämn division med enkla tabeller (2, 5, 10)
  // diff 2: jämn division alla tabeller
  // diff 3: division med rest, små tal
  _generateDivision(difficulty) {
    if (difficulty <= 1) {
      const table = this._choice([2, 5, 10]);
      const result = this._rand(1, 10);
      const a = table * result;
      return new MathProblem({
        question: `Vad är ${a} ÷ ${table}?`,
        answer: result,
        category: 'division',
        difficulty,
        hint: `Tänk: Vad gånger ${table} blir ${a}?`,
        methodExplanation: `${a} ÷ ${table} = ${result}`
      });
    } else if (difficulty === 2) {
      const table = this._rand(2, 10);
      const result = this._rand(1, 10);
      const a = table * result;
      return new MathProblem({
        question: `Vad är ${a} ÷ ${table}?`,
        answer: result,
        category: 'division',
        difficulty,
        hint: `Tänk: Vad gånger ${table} blir ${a}?`,
        methodExplanation: `${a} ÷ ${table} = ${result}`
      });
    } else {
      const b = this._rand(2, 5);
      const result = this._rand(2, 9);
      const rest = this._rand(1, b - 1);
      const a = b * result + rest;
      return new MathProblem({
        question: `Vad är ${a} ÷ ${b}? (Svara med rest, t.ex. '5 rest 2')`,
        answer: `${result} rest ${rest}`,
        category: 'division',
        difficulty,
        hint: `Hur många gånger går ${b} i ${a}?`,
        methodExplanation: `${a} ÷ ${b} = ${result} rest ${rest}`
      });
    }
  }
}

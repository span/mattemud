/**
 * MathBeast - Mattemonstret
 */

class MathBeast {
  constructor() {
    this.generator = new ChallengeGenerator();
    this.active = false;
    this.currentProblem = null;
    this.practiceProblem = null;
    this.attempts = 0;
    this.maxAttempts = GameConstants.MATHBEAST_MAX_ATTEMPTS;
  }

  static EVIL_LAUGHS = ['MUAHAHA!', 'BWAHAHA!', 'Hihihihi!', 'MWEHEHEHE!'];
  static GREETINGS = [
    'Oj oj, DU igen! Har du FORTFARANDE inte fattat?!',
    'STOPP! Du gissar ju bara!',
    'Hahaha! Fel IGEN! Nu tar JAG över!',
    'Hmm... verkar som att JAG måste visa dig!',
  ];
  static SUCCESS_RESPONSES = [
    'Hmmpf... det var rätt. Bra jobbat!',
    'Jaja, DEN gången gick det bra. Vi ses nästa gång!',
    'Okej okej, du klarade det. Men jag VÄNTAR på nästa fel!',
  ];
  static FAILURE_RESPONSES = [
    'Nej! Försök igen!',
    'Nope! Titta på vad jag sa!',
    'Inte riktigt. Kolla exemplet!',
  ];

  _choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shouldAppear(consecutiveErrors) {
    return consecutiveErrors >= GameConstants.MATHBEAST_APPEAR_AFTER;
  }

  appear(failedProblem) {
    this.active = true;
    this.currentProblem = failedProblem;
    this.attempts = 0;

    const greeting = this._choice(MathBeast.GREETINGS);
    const laugh = this._choice(MathBeast.EVIL_LAUGHS);

    this.practiceProblem = this.generator.generate(
      failedProblem.category,
      failedProblem.difficulty
    );

    return `
${Colors.BG_RED}${Colors.WHITE}${Colors.BOLD}╔═══════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.BG_RED}${Colors.WHITE}${Colors.BOLD}║     🔥🔥🔥 MATTEMONSTRET HAR ANLÄNT! 🔥🔥🔥          ║${Colors.RESET}
${Colors.BG_RED}${Colors.WHITE}${Colors.BOLD}╚═══════════════════════════════════════════════════════╝${Colors.RESET}

  ${Colors.RED}${Colors.BOLD}${laugh}${Colors.RESET}

  ${Colors.CYAN}"${greeting}"${Colors.RESET}

${Colors.MAGENTA}════════════════════════════════════════════════════════${Colors.RESET}

${Colors.YELLOW}${Colors.BOLD}Mattemonstret visar hur man räknar:${Colors.RESET}

${Colors.WHITE}${failedProblem.methodExplanation}${Colors.RESET}

${Colors.MAGENTA}════════════════════════════════════════════════════════${Colors.RESET}

  ${Colors.CYAN}"Fattade du? BRA! Nu ska DU lösa en!"${Colors.RESET}

  ${Colors.YELLOW}${Colors.BOLD}${this.practiceProblem.question}${Colors.RESET}
`;
  }

  checkAnswer(answer) {
    if (!this.active || !this.practiceProblem) {
      return [false, 'Mattemonstret är inte aktivt.'];
    }

    this.attempts++;

    if (AnswerValidator.check(answer, this.practiceProblem.answer)) {
      return this._handleSuccess();
    }
    return this._handleFailure();
  }

  _handleSuccess() {
    this.active = false;
    const response = this._choice(MathBeast.SUCCESS_RESPONSES);

    return [true, `
  ${Colors.GREEN}${Colors.BOLD}"${response}"${Colors.RESET}

${Colors.RED}     *poff*${Colors.RESET}

  ${Colors.MAGENTA}(Mattemonstret försvinner i ett rökmoln...)${Colors.RESET}

${Colors.GREEN}════════════════════════════════════════════════════════${Colors.RESET}

  ${Colors.GREEN}${Colors.BOLD}Du kan nu fortsätta med den ursprungliga uppgiften!${Colors.RESET}
`];
  }

  _handleFailure() {
    const response = this._choice(MathBeast.FAILURE_RESPONSES);

    if (this.attempts >= this.maxAttempts) {
      this.active = false;
      return [true, `
  ${Colors.YELLOW}"Okej okej, jag ger mig! Svaret var: ${Colors.BOLD}${this.practiceProblem.answer}${Colors.RESET}${Colors.YELLOW}"${Colors.RESET}

  ${Colors.MAGENTA}(Mattemonstret försvinner motvilligt...)${Colors.RESET}
`];
    }

    return [false, `
  ${Colors.RED}${Colors.BOLD}${this._choice(MathBeast.EVIL_LAUGHS)}${Colors.RESET}

  ${Colors.RED}"${response}"${Colors.RESET}

  ${Colors.YELLOW}Ledtråd: ${this.practiceProblem.hint}${Colors.RESET}

  ${Colors.WHITE}Försök igen (${this.maxAttempts - this.attempts} försök kvar):${Colors.RESET}
  ${Colors.MAGENTA}${Colors.BOLD}${this.practiceProblem.question}${Colors.RESET}
`];
  }

  isActive() {
    return this.active;
  }
}

const DEFAULT_QUESTIONS = 50;
const DATA_STORAGE_KEY = "mathGalaxyData";
const STORAGE_KEY = "starMathDailyRecords";
const GROWTH_STORAGE_KEY = "mathGalaxyGrowth";
const WEEKLY_GOAL = 1200;

const levels = [
  { name: "星星学徒", min: 0, next: 300 },
  { name: "计算探索者", min: 300, next: 800 },
  { name: "星轨训练员", min: 800, next: 1500 },
  { name: "数学飞行员", min: 1500, next: 3000 },
  { name: "银河计算师", min: 3000, next: 6000 },
  { name: "宇宙数学家", min: 6000, next: Infinity },
];

const categories = [
  {
    id: "singleAddSub",
    name: "个位数加减法",
    reward: 1,
    difficulty: "Lv.1 入门轨道",
    make() {
      const isAddition = Math.random() < 0.5;
      const a = randomInt(1, 9);
      const b = randomInt(1, 9);

      if (isAddition) {
        return { text: `${a} + ${b}`, answer: a + b };
      }

      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      return { text: `${larger} - ${smaller}`, answer: larger - smaller };
    },
  },
  {
    id: "add2",
    name: "2 位数加法",
    reward: 1,
    difficulty: "Lv.2 月面基地",
    make() {
      const a = randomInt(10, 99);
      const b = randomInt(10, 99);
      return { text: `${a} + ${b}`, answer: a + b };
    },
  },
  {
    id: "add3",
    name: "3 位数加法",
    reward: 2,
    difficulty: "Lv.3 星云航线",
    make() {
      const a = randomInt(100, 999);
      const b = randomInt(100, 999);
      return { text: `${a} + ${b}`, answer: a + b };
    },
  },
  {
    id: "add4",
    name: "4 位数加法",
    reward: 3,
    difficulty: "Lv.4 深空跃迁",
    make() {
      const a = randomInt(1000, 9999);
      const b = randomInt(1000, 9999);
      return { text: `${a} + ${b}`, answer: a + b };
    },
  },
  {
    id: "mul2x1",
    name: "两位数乘个位数",
    reward: 4,
    difficulty: "Lv.5 引擎加速",
    make() {
      const a = randomInt(10, 99);
      const b = randomInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    },
  },
  {
    id: "mul2x2",
    name: "两位数乘两位数",
    reward: 5,
    difficulty: "Lv.6 银河挑战",
    make() {
      const a = randomInt(10, 99);
      const b = randomInt(10, 99);
      return { text: `${a} × ${b}`, answer: a * b };
    },
  },
];

const state = {
  questions: [],
  selectedCategories: [],
  totalQuestions: DEFAULT_QUESTIONS,
  currentIndex: 0,
  stars: 0,
  correct: 0,
  wrong: 0,
  combo: 0,
  maxCombo: 0,
  baseStars: 0,
  answerTimes: [],
  questionStartedAt: 0,
  categoryStats: {},
  locked: false,
  timedOut: false,
  timerSeconds: 20,
  timeLeft: 20,
  timerId: null,
  nextQuestionId: null,
  editingUserId: "",
};

let galaxyData = loadGalaxyData();

const els = {
  appShell: document.querySelector("#appShell"),
  userScreen: document.querySelector("#userScreen"),
  userCards: document.querySelector("#userCards"),
  createUserModal: document.querySelector("#createUserModal"),
  createUserForm: document.querySelector("#createUserForm"),
  cancelCreateUser: document.querySelector("#cancelCreateUser"),
  createUserTitle: document.querySelector("#create-user-title"),
  saveUserButton: document.querySelector("#saveUserButton"),
  newUserName: document.querySelector("#newUserName"),
  newUserGrade: document.querySelector("#newUserGrade"),
  currentPilotText: document.querySelector("#currentPilotText"),
  streakDaysText: document.querySelector("#streakDaysText"),
  switchUserButton: document.querySelector("#switchUserButton"),
  editCurrentUserButton: document.querySelector("#editCurrentUserButton"),
  starCount: document.querySelector("#starCount"),
  levelName: document.querySelector("#levelName"),
  nextLevelText: document.querySelector("#nextLevelText"),
  levelProgressFill: document.querySelector("#levelProgressFill"),
  starDustCount: document.querySelector("#starDustCount"),
  weeklyGoalText: document.querySelector("#weeklyGoalText"),
  weeklyProgressFill: document.querySelector("#weeklyProgressFill"),
  progressText: document.querySelector("#progressText"),
  correctText: document.querySelector("#correctText"),
  wrongText: document.querySelector("#wrongText"),
  accuracyText: document.querySelector("#accuracyText"),
  comboText: document.querySelector("#comboText"),
  progressFill: document.querySelector("#progressFill"),
  welcomeScreen: document.querySelector("#welcomeScreen"),
  quizScreen: document.querySelector("#quizScreen"),
  resultScreen: document.querySelector("#resultScreen"),
  startButton: document.querySelector("#startButton"),
  restartButton: document.querySelector("#restartButton"),
  categoryOptions: document.querySelector("#categoryOptions"),
  backButton: document.querySelector("#backButton"),
  recordsToggle: document.querySelector("#recordsToggle"),
  recordsPanel: document.querySelector("#recordsPanel"),
  recordsClose: document.querySelector("#recordsClose"),
  categoryBadge: document.querySelector("#categoryBadge"),
  questionNumber: document.querySelector("#questionNumber"),
  questionText: document.querySelector("#questionText"),
  answerForm: document.querySelector("#answerForm"),
  answerInput: document.querySelector("#answerInput"),
  nextButton: document.querySelector("#nextButton"),
  timerText: document.querySelector("#timerText"),
  timerFill: document.querySelector("#timerFill"),
  rewardBurst: document.querySelector("#rewardBurst"),
  feedbackText: document.querySelector("#feedbackText"),
  finalScore: document.querySelector("#finalScore"),
  finalMessage: document.querySelector("#finalMessage"),
  settlementTotal: document.querySelector("#settlementTotal"),
  settlementCorrect: document.querySelector("#settlementCorrect"),
  settlementAccuracy: document.querySelector("#settlementAccuracy"),
  baseStarsText: document.querySelector("#baseStarsText"),
  accuracyBonusText: document.querySelector("#accuracyBonusText"),
  comboBonusText: document.querySelector("#comboBonusText"),
  speedBonusText: document.querySelector("#speedBonusText"),
  perfectBonusText: document.querySelector("#perfectBonusText"),
  totalStarsAnimation: document.querySelector("#totalStarsAnimation"),
  resultLevelProgressFill: document.querySelector("#resultLevelProgressFill"),
  resultLevelText: document.querySelector("#resultLevelText"),
  categorySummary: document.querySelector("#categorySummary"),
  todaySummary: document.querySelector("#todaySummary"),
  recordsList: document.querySelector("#recordsList"),
  clearRecordsButton: document.querySelector("#clearRecordsButton"),
};

els.startButton.addEventListener("click", startPractice);
els.restartButton.addEventListener("click", startPractice);
els.backButton.addEventListener("click", returnToSetup);
els.switchUserButton.addEventListener("click", showUserScreen);
els.editCurrentUserButton.addEventListener("click", () => openEditUserModal(galaxyData.currentUserId));
els.userCards.addEventListener("click", handleUserCardsClick);
els.createUserForm.addEventListener("submit", handleCreateUser);
els.cancelCreateUser.addEventListener("click", closeCreateUserModal);
els.answerForm.addEventListener("submit", handleAnswer);
els.answerInput.addEventListener("keydown", handleAnswerKeydown);
els.nextButton.addEventListener("click", goToNextQuestion);
els.clearRecordsButton.addEventListener("click", clearRecords);
els.recordsToggle.addEventListener("click", openRecordsDrawer);
els.recordsClose.addEventListener("click", closeRecordsDrawer);
document.addEventListener("click", handleGlobalClick);

renderCategoryOptions();
renderStats();
initializeApp();

function initializeApp() {
  if (!getCurrentUser()) {
    showUserScreen();
    return;
  }

  showMainApp();
}

function showMainApp() {
  els.userScreen.classList.add("hidden");
  els.appShell.classList.remove("hidden");
  renderPilot();
  renderGrowth();
  renderRecords();
}

function showUserScreen() {
  clearTimer();
  clearNextQuestionDelay();
  els.appShell.classList.add("hidden");
  els.userScreen.classList.remove("hidden");
  renderUserCards();
}

function renderUserCards() {
  const cards = galaxyData.users.map((user) => {
    const level = getLevelInfo(user.totalStars);
    const selected = user.id === galaxyData.currentUserId ? " is-selected" : "";
    return `
      <button class="user-card${selected}" type="button" data-user-id="${user.id}">
        <span class="user-avatar">${user.avatar}</span>
        <strong>${user.name}</strong>
        <small>${user.grade}</small>
        <em>${level.name}</em>
        <span>⭐ ${user.totalStars}</span>
        <span>🔥 ${user.streakDays || 0} 天</span>
        <span class="user-card-actions">
          <span class="mini-action" data-action="edit-user" data-user-id="${user.id}">编辑</span>
        </span>
      </button>
    `;
  }).join("");

  els.userCards.innerHTML = `
    ${cards}
    <button class="user-card create-pilot-card" type="button" data-action="create-user">
      <span class="user-avatar">＋</span>
      <strong>创建新飞行员</strong>
      <small>建立独立星图档案</small>
    </button>
  `;
}

function handleUserCardsClick(event) {
  const card = event.target.closest(".user-card");
  if (!card) return;

  if (card.dataset.action === "create-user") {
    openCreateUserModal();
    return;
  }

  const action = event.target.closest("[data-action='edit-user']");
  if (action) {
    event.stopPropagation();
    openEditUserModal(action.dataset.userId);
    return;
  }

  galaxyData.currentUserId = card.dataset.userId;
  saveGalaxyData();
  showMainApp();
}

function openCreateUserModal() {
  state.editingUserId = "";
  els.createUserTitle.textContent = "创建新飞行员";
  els.saveUserButton.textContent = "创建并开始训练";
  els.createUserForm.reset();
  els.createUserModal.classList.remove("hidden");
  els.newUserName.focus();
}

function openEditUserModal(userId) {
  const user = galaxyData.users.find((item) => item.id === userId);
  if (!user) return;
  state.editingUserId = user.id;
  els.createUserTitle.textContent = "编辑飞行员资料";
  els.saveUserButton.textContent = "保存资料";
  els.newUserName.value = user.name;
  els.newUserGrade.value = user.grade;
  const avatarInput = document.querySelector(`input[name="newUserAvatar"][value="${user.avatar}"]`);
  if (avatarInput) avatarInput.checked = true;
  els.createUserModal.classList.remove("hidden");
  els.newUserName.focus();
}

function closeCreateUserModal() {
  els.createUserModal.classList.add("hidden");
  els.createUserForm.reset();
  state.editingUserId = "";
}

function handleCreateUser(event) {
  event.preventDefault();
  const name = els.newUserName.value.trim();
  if (!name) return;

  const avatar = document.querySelector('input[name="newUserAvatar"]:checked').value;
  if (state.editingUserId) {
    const user = galaxyData.users.find((item) => item.id === state.editingUserId);
    if (!user) return;
    user.name = name;
    user.grade = els.newUserGrade.value;
    user.avatar = avatar;
    saveGalaxyData();
    closeCreateUserModal();
    if (els.userScreen.classList.contains("hidden")) {
      showMainApp();
    } else {
      renderUserCards();
    }
    return;
  }

  const user = createEmptyUser({
    name,
    grade: els.newUserGrade.value,
    avatar,
  });
  galaxyData.users.push(user);
  galaxyData.currentUserId = user.id;
  saveGalaxyData();
  closeCreateUserModal();
  showMainApp();
}

function handleGlobalClick(event) {
  if (event.target.closest("#switchUserButton")) {
    showUserScreen();
  }
  const editButton = event.target.closest("#editCurrentUserButton");
  if (editButton) {
    openEditUserModal(galaxyData.currentUserId);
  }
}

function renderPilot() {
  const user = getCurrentUser();
  if (!user) return;
  const level = getLevelInfo(user.totalStars);
  els.currentPilotText.textContent = `${user.avatar} ${user.name}｜${user.grade}｜${level.name}`;
  els.streakDaysText.textContent = user.streakDays || 0;
  document.querySelector("#records-title").textContent = `${user.name}的每日星图`;
}

function startPractice() {
  clearTimer();
  clearNextQuestionDelay();
  const selectedCategories = getSelectedCategories();
  if (selectedCategories.length === 0) {
    window.alert("请至少选择一种题型。");
    return;
  }

  state.totalQuestions = Number(document.querySelector('input[name="questionCount"]:checked').value);
  state.selectedCategories = selectedCategories;
  state.questions = buildQuestionSet(selectedCategories, state.totalQuestions);
  state.currentIndex = 0;
  state.stars = 0;
  state.correct = 0;
  state.wrong = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.baseStars = 0;
  state.answerTimes = [];
  state.locked = false;
  state.timedOut = false;
  state.timerSeconds = Number(document.querySelector('input[name="timerSeconds"]:checked').value);
  state.timeLeft = state.timerSeconds;
  state.categoryStats = Object.fromEntries(
    categories.map((category) => [
      category.id,
      { name: category.name, correct: 0, wrong: 0 },
    ]),
  );

  showScreen("quiz");
  renderStats();
  renderQuestion();
}

function renderCategoryOptions() {
  els.categoryOptions.innerHTML = categories
    .map((category) => {
      return `
        <label>
          <input type="checkbox" name="categoryType" value="${category.id}" checked>
          <span>
            <strong>${category.name}</strong>
            <small>基础 +${category.reward} 星</small>
            <em>${category.difficulty}</em>
          </span>
        </label>
      `;
    })
    .join("");
}

function getSelectedCategories() {
  const selectedIds = [...document.querySelectorAll('input[name="categoryType"]:checked')]
    .map((input) => input.value);
  return categories.filter((category) => selectedIds.includes(category.id));
}

function buildQuestionSet(selectedCategories, totalQuestions) {
  const counts = getCategoryCounts(selectedCategories, totalQuestions);
  const questions = selectedCategories.flatMap((category) =>
    Array.from({ length: counts[category.id] }, () => {
      const question = category.make();
      return {
        ...question,
        categoryId: category.id,
        categoryName: category.name,
        reward: category.reward,
      };
    }),
  );

  return shuffle(questions);
}

function getCategoryCounts(selectedCategories, totalQuestions) {
  const baseCount = Math.floor(totalQuestions / selectedCategories.length);
  const remainder = totalQuestions % selectedCategories.length;

  return Object.fromEntries(
    selectedCategories.map((category, index) => [
      category.id,
      baseCount + (index < remainder ? 1 : 0),
    ]),
  );
}

function handleAnswer(event) {
  event.preventDefault();

  if (state.locked) return;

  const question = state.questions[state.currentIndex];
  const rawAnswer = els.answerInput.value.trim();
  if (!rawAnswer) return;

  const userAnswer = Number(rawAnswer);
  const isCorrect = userAnswer === question.answer;
  const elapsedSeconds = getQuestionElapsedSeconds();
  state.answerTimes.push(elapsedSeconds);
  clearTimer();
  const categoryStat = state.categoryStats[question.categoryId];
  state.locked = true;

  if (isCorrect) {
    const reward = getQuestionReward(question);
    state.correct += 1;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.baseStars += question.reward;
    state.stars += reward;
    categoryStat.correct += 1;
    flashQuestion("correct");
    showRewardAnimation(reward);
    showFeedback(
      "correct",
      buildCorrectFeedback(question, reward),
    );
    renderStats();
    scheduleNextQuestion();
  } else {
    state.wrong += 1;
    state.combo = 0;
    state.stars = Math.max(0, state.stars - 1);
    categoryStat.wrong += 1;
    flashQuestion("wrong");
    showFeedback("wrong", `再想一想：这题答案是 ${question.answer}，扣 1 颗星。`);
    els.nextButton.classList.remove("hidden");
    els.answerInput.disabled = true;
    renderStats();
  }
}

function handleAnswerKeydown(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (state.locked) return;
  els.answerForm.requestSubmit();
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  state.timeLeft = state.timerSeconds;
  state.locked = false;
  state.timedOut = false;
  els.quizScreen.classList.remove("timer-low");
  els.categoryBadge.textContent = question.categoryName;
  els.questionNumber.textContent = `第 ${state.currentIndex + 1} 题`;
  els.nextButton.classList.add("hidden");
  els.answerInput.disabled = false;
  els.questionText.textContent = `${question.text} = ?`;
  els.rewardBurst.innerHTML = "";
  els.feedbackText.textContent = "";
  els.feedbackText.className = "feedback-text";
  els.answerInput.value = "";
  els.answerInput.focus();
  state.questionStartedAt = Date.now();
  renderTimer();
  startTimer();
}

function renderStats() {
  const answered = state.correct + state.wrong;
  const accuracy = answered === 0 ? 0 : Math.round((state.correct / answered) * 100);
  els.progressText.textContent = `${answered} / ${state.totalQuestions}`;
  els.correctText.textContent = state.correct;
  els.wrongText.textContent = state.wrong;
  els.accuracyText.textContent = `${accuracy}%`;
  els.comboText.textContent = state.combo;
  els.progressFill.style.width = `${(answered / state.totalQuestions) * 100}%`;
}

function showFeedback(type, text) {
  els.feedbackText.textContent = text;
  els.feedbackText.className = `feedback-text ${type}`;
}

function getQuestionElapsedSeconds() {
  if (!state.questionStartedAt) return state.timerSeconds;
  return Math.max(0, (Date.now() - state.questionStartedAt) / 1000);
}

function showRewardAnimation(reward) {
  const stars = Array.from({ length: reward }, (_, index) => {
      const angle = (Math.PI * 2 * index) / reward - Math.PI / 2;
      const ring = index % 2 === 0 ? 112 : 78;
      const x = `${Math.round(Math.cos(angle) * ring)}px`;
      const y = `${Math.round(Math.sin(angle) * ring)}px`;
      const rotate = `${Math.round((angle * 180) / Math.PI)}deg`;

      return `
        <span
          class="reward-star"
          style="--x: ${x}; --y: ${y}; --rotate: ${rotate}; --delay: ${Math.min(index * 34, 220)}ms"
        ></span>
      `;
    })
    .join("");

  els.rewardBurst.innerHTML = `<span class="reward-label">+${reward} 星 · Combo ${state.combo}</span>${stars}`;
}

function flashQuestion(type) {
  els.quizScreen.classList.remove("answer-correct", "answer-wrong");
  void els.quizScreen.offsetWidth;
  els.quizScreen.classList.add(type === "correct" ? "answer-correct" : "answer-wrong");
  window.setTimeout(() => {
    els.quizScreen.classList.remove("answer-correct", "answer-wrong");
  }, 820);
}

function getQuestionReward(question) {
  if (state.timedOut) return 1;

  const elapsedSeconds = state.timerSeconds - state.timeLeft;
  if (elapsedSeconds <= 10) return question.reward * 3;
  if (elapsedSeconds <= 20) return question.reward * 2;
  if (elapsedSeconds <= 30) return question.reward + 1;
  return question.reward;
}

function buildCorrectFeedback(question, reward) {
  if (state.timedOut) return "答对了！超时后完成，获得 1 颗星。";

  const elapsedSeconds = state.timerSeconds - state.timeLeft;
  if (elapsedSeconds <= 10) return `神速！10 秒内完成，获得 ${question.reward} × 3 = ${reward} 颗星！`;
  if (elapsedSeconds <= 20) return `很快！20 秒内完成，获得 ${question.reward} × 2 = ${reward} 颗星！`;
  if (elapsedSeconds <= 30) return `稳稳完成，30 秒内奖励 +1，获得 ${question.reward} + 1 = ${reward} 颗星！`;
  return `答对了，获得 ${reward} 颗星！`;
}

function startTimer() {
  clearTimer();
  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    renderTimer();

    if (state.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function renderTimer() {
  const percent = Math.max(0, (state.timeLeft / state.timerSeconds) * 100);
  els.timerText.textContent = `${state.timeLeft} 秒`;
  els.timerFill.style.width = `${percent}%`;
  els.quizScreen.classList.toggle("timer-low", state.timeLeft <= 5);
}

function handleTimeout() {
  if (state.locked) return;

  clearTimer();
  state.timedOut = true;
  state.timeLeft = 0;
  renderTimer();
  showFeedback("wrong", "时间到！还可以继续做，答对可获得 1 颗星。");
  els.answerInput.focus();
}

function scheduleNextQuestion() {
  clearNextQuestionDelay();
  state.nextQuestionId = window.setTimeout(() => {
    state.currentIndex += 1;

    if (state.currentIndex >= state.totalQuestions) {
      finishPractice();
      return;
    }

    renderQuestion();
  }, 850);
}

function goToNextQuestion() {
  clearTimer();
  clearNextQuestionDelay();
  state.locked = true;
  state.currentIndex += 1;

  if (state.currentIndex >= state.totalQuestions) {
    finishPractice();
    return;
  }

  renderQuestion();
}

function clearTimer() {
  if (!state.timerId) return;
  window.clearInterval(state.timerId);
  state.timerId = null;
}

function clearNextQuestionDelay() {
  if (!state.nextQuestionId) return;
  window.clearTimeout(state.nextQuestionId);
  state.nextQuestionId = null;
}

function finishPractice() {
  clearTimer();
  clearNextQuestionDelay();
  const accuracy = Math.round((state.correct / state.totalQuestions) * 100);
  const settlement = buildSettlement(accuracy);
  const session = {
    finishedAt: new Date().toISOString(),
    correct: state.correct,
    wrong: state.wrong,
    stars: settlement.totalEarned,
    total: state.totalQuestions,
    timerSeconds: state.timerSeconds,
    categories: state.categoryStats,
    accuracy,
    maxCombo: state.maxCombo,
    type: state.selectedCategories.map((category) => category.name).join("、"),
  };
  const { before: growthBefore, after: growthAfter } = applyUserPracticeResult(session, settlement);

  els.finalScore.textContent = `${state.correct} / ${state.totalQuestions}`;
  els.finalMessage.textContent = buildFinalMessage(accuracy, settlement.totalEarned);
  renderSettlement(settlement, growthBefore, growthAfter);
  els.categorySummary.innerHTML = state.selectedCategories
    .map((category) => {
      const stat = state.categoryStats[category.id];
      const total = stat.correct + stat.wrong;
      return `
        <div class="summary-item">
          <span>${category.name}</span>
          <strong>${stat.correct} / ${total}</strong>
        </div>
      `;
    })
    .join("");

  showScreen("result");
  renderGrowth(growthAfter);
  animateTotalStars(growthBefore.totalStars, growthAfter.totalStars);
  renderRecords();
}

function buildSettlement(accuracy) {
  const accuracyBonus = accuracy >= 90 ? 20 : 0;
  const perfectBonus = accuracy === 100 ? 50 : 0;
  const comboBonus = state.maxCombo >= 10 ? 25 : state.maxCombo >= 5 ? 10 : 0;
  const averageTime = getAverageAnswerTime();
  const speedBonus = state.correct > 0 && averageTime < state.timerSeconds * 0.5 ? 20 : 0;
  const totalEarned = state.baseStars + accuracyBonus + perfectBonus + comboBonus + speedBonus;

  return {
    accuracy,
    averageTime,
    accuracyBonus,
    perfectBonus,
    comboBonus,
    speedBonus,
    baseStars: state.baseStars,
    totalEarned,
  };
}

function getAverageAnswerTime() {
  if (state.answerTimes.length === 0) return state.timerSeconds;
  const total = state.answerTimes.reduce((sum, value) => sum + value, 0);
  return total / state.answerTimes.length;
}

function renderSettlement(settlement, growthBefore, growthAfter) {
  els.settlementTotal.textContent = `+${settlement.totalEarned} 星`;
  els.settlementCorrect.textContent = `${state.correct} / ${state.totalQuestions}`;
  els.settlementAccuracy.textContent = `${settlement.accuracy}%`;
  els.baseStarsText.textContent = settlement.baseStars;
  els.accuracyBonusText.textContent = settlement.accuracyBonus;
  els.comboBonusText.textContent = settlement.comboBonus;
  els.speedBonusText.textContent = settlement.speedBonus;
  els.perfectBonusText.textContent = settlement.perfectBonus;
  els.totalStarsAnimation.textContent = `${growthBefore.totalStars} → ${growthAfter.totalStars}`;

  const level = getLevelInfo(growthAfter.totalStars);
  els.resultLevelText.textContent = `${level.name} · ${level.nextText}`;
  els.resultLevelProgressFill.style.width = `${level.progress}%`;
  animateStarFlight(Math.min(18, Math.max(4, Math.ceil(settlement.totalEarned / 20))));
}

function applyUserPracticeResult(session, settlement) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No current user selected");
  }
  const before = {
    totalStars: user.totalStars,
    starDust: user.starDust,
  };
  const todayKey = getDateKey();
  const weekKey = getWeekKey();
  resetWeeklyGoalIfNeeded(user, weekKey);

  user.totalStars += settlement.totalEarned;
  user.starDust += settlement.totalEarned;
  user.weeklyGoal.earnedThisWeek += settlement.totalEarned;
  updateUserStreak(user, todayKey);
  user.practiceHistory.unshift({
    id: `practice-${Date.now()}`,
    date: todayKey,
    time: formatAttemptTime(session.finishedAt),
    type: session.type,
    totalQuestions: session.total,
    correct: session.correct,
    wrong: session.wrong,
    accuracy: session.accuracy,
    timeLimit: session.timerSeconds,
    starsEarned: settlement.totalEarned,
    maxCombo: session.maxCombo,
  });
  saveGalaxyData();

  return {
    before,
    after: {
      totalStars: user.totalStars,
      starDust: user.starDust,
    },
  };
}

function renderGrowth() {
  const user = getCurrentUser();
  if (!user) return;
  resetWeeklyGoalIfNeeded(user, getWeekKey());
  saveGalaxyData();
  const level = getLevelInfo(user.totalStars);
  const weekStars = user.weeklyGoal.earnedThisWeek;
  const weeklyTarget = user.weeklyGoal.target || WEEKLY_GOAL;
  const weekProgress = Math.min(100, Math.round((weekStars / weeklyTarget) * 100));

  els.starCount.textContent = user.totalStars;
  els.levelName.textContent = level.name;
  els.nextLevelText.textContent = level.nextText;
  els.levelProgressFill.style.width = `${level.progress}%`;
  els.starDustCount.textContent = user.starDust;
  els.weeklyGoalText.textContent = weekStars >= weeklyTarget
    ? "本周星轨完成"
    : `本周 ${weekStars} / ${weeklyTarget}`;
  els.weeklyProgressFill.style.width = `${weekProgress}%`;
  renderPilot();
}

function getLevelInfo(totalStars) {
  const current = [...levels].reverse().find((level) => totalStars >= level.min) ?? levels[0];

  if (current.next === Infinity) {
    return {
      name: current.name,
      progress: 100,
      nextText: "已进入最高星域",
    };
  }

  const span = current.next - current.min;
  const earnedInLevel = totalStars - current.min;
  const progress = Math.max(0, Math.min(100, Math.round((earnedInLevel / span) * 100)));
  return {
    name: current.name,
    progress,
    nextText: `距离下一等级还差 ${current.next - totalStars} 星`,
  };
}

function animateTotalStars(fromValue, toValue) {
  const duration = 850;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const value = Math.round(fromValue + (toValue - fromValue) * progress);
    els.starCount.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function animateStarFlight(count) {
  const container = document.createElement("div");
  container.className = "star-flight-layer";
  document.body.appendChild(container);

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.className = "flying-star";
    star.style.setProperty("--delay", `${index * 45}ms`);
    star.style.setProperty("--start-x", `${randomInt(-90, 90)}px`);
    star.style.setProperty("--start-y", `${randomInt(-20, 70)}px`);
    container.appendChild(star);
  }

  window.setTimeout(() => container.remove(), 1300);
}

function buildFinalMessage(accuracy, stars) {
  if (accuracy >= 90) {
    return `很棒！正确率 ${accuracy}%，本轮收集了 ${stars} 颗星。`;
  }
  if (accuracy >= 70) {
    return `完成得不错，正确率 ${accuracy}%。再练一轮会更稳。`;
  }
  return `已经完成本轮练习，正确率 ${accuracy}%。慢慢来，先把容易错的类别练熟。`;
}

function renderRecords() {
  const user = getCurrentUser();
  if (!user) return;
  document.querySelector("#records-title").textContent = `${user.name}的每日星图`;
  const records = groupPracticeHistoryByDate(user.practiceHistory);
  const dateKey = getDateKey();
  const today = records[dateKey];

  if (!today) {
    els.todaySummary.innerHTML = "<strong>今天还没练习</strong><span>完成一轮后会自动保存。</span>";
  } else {
    els.todaySummary.innerHTML = `
      <strong>${today.correct} / ${today.total}</strong>
      <span>今天 ${today.sessions} 轮，${getRate(today.correct, today.total)}% 正确率，获得 ${today.stars} 颗星</span>
    `;
  }

  const entries = Object.entries(records)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14);

  if (entries.length === 0) {
    els.recordsList.innerHTML = '<div class="record-item"><div class="record-detail">暂无每日成绩。</div></div>';
    return;
  }

  els.recordsList.innerHTML = entries
    .map(([date, record]) => {
      const weakest = findWeakestCategory(record.categories);
      const attempts = getRecordAttempts(record);
      return `
        <article class="record-item">
          <div class="record-top">
            <span class="record-date">${formatDate(date)}</span>
            <span class="record-rate">${getRate(record.correct, record.total)}%</span>
          </div>
          <div class="record-detail">
            当日汇总：${record.sessions} 轮，答对 ${record.correct}/${record.total}，星星 ${record.stars}
            ${weakest ? `<br>可多练：${weakest}` : ""}
          </div>
          <div class="attempt-list" aria-label="${formatDate(date)}每次成绩">
            ${attempts
              .map((attempt, index) => {
                return `
                  <div class="attempt-item">
                    <span>${attempt.time || `第 ${attempts.length - index} 次`}</span>
                    <strong>${attempt.correct}/${attempt.totalQuestions}</strong>
                    <em>${attempt.accuracy}% · ${attempt.starsEarned} 星 · ${attempt.timeLimit || "-"} 秒</em>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function getRecordAttempts(record) {
  return [...record.attempts].sort((a, b) => b.id.localeCompare(a.id));
}

function groupPracticeHistoryByDate(history) {
  return history.reduce((records, attempt) => {
    const date = attempt.date;
    records[date] = records[date] ?? {
      sessions: 0,
      total: 0,
      correct: 0,
      wrong: 0,
      stars: 0,
      attempts: [],
      categories: {},
    };
    records[date].sessions += 1;
    records[date].total += attempt.totalQuestions;
    records[date].correct += attempt.correct;
    records[date].wrong += attempt.wrong;
    records[date].stars += attempt.starsEarned;
    records[date].attempts.push(attempt);
    return records;
  }, {});
}

function findWeakestCategory(categoryRecords) {
  const ordered = Object.values(categoryRecords)
    .filter((item) => item.correct + item.wrong > 0)
    .sort((a, b) => getRate(a.correct, a.correct + a.wrong) - getRate(b.correct, b.correct + b.wrong));

  if (!ordered[0]) return "";

  const total = ordered[0].correct + ordered[0].wrong;
  return getRate(ordered[0].correct, total) < 100 ? ordered[0].name : "";
}

function clearRecords() {
  const user = getCurrentUser();
  if (!user) return;
  const confirmed = window.confirm(`确定要清空${user.name}的所有练习记录吗？`);
  if (!confirmed) return;
  user.practiceHistory = [];
  user.streakDays = 0;
  user.lastPracticeDate = "";
  saveGalaxyData();
  renderPilot();
  renderRecords();
}

function showScreen(screen) {
  els.welcomeScreen.classList.toggle("hidden", screen !== "welcome");
  els.quizScreen.classList.toggle("hidden", screen !== "quiz");
  els.resultScreen.classList.toggle("hidden", screen !== "result");
}

function returnToSetup() {
  clearTimer();
  clearNextQuestionDelay();
  showScreen("welcome");
  renderStats();
}

function openRecordsDrawer() {
  els.recordsPanel.classList.add("is-open");
  els.recordsToggle.classList.add("is-hidden");
}

function closeRecordsDrawer() {
  els.recordsPanel.classList.remove("is-open");
  els.recordsToggle.classList.remove("is-hidden");
}

function loadGalaxyData() {
  try {
    const data = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY));
    if (data?.users?.length) {
      return normalizeGalaxyData(data);
    }
  } catch {
    // Fall through to migration.
  }

  const migrated = migrateLegacyData();
  if (migrated.users.length) {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(migrated));
  }
  return migrated;
}

function normalizeGalaxyData(data) {
  const users = data.users.map((user) => {
    const normalized = {
      ...createEmptyUser({
        name: user.name || "数学飞行员",
        grade: user.grade || "未设置",
        avatar: user.avatar || "🚀",
      }),
      ...user,
    };
    normalized.weeklyGoal = normalized.weeklyGoal ?? {
      target: WEEKLY_GOAL,
      earnedThisWeek: 0,
      weekStart: getWeekKey(),
    };
    normalized.practiceHistory = normalized.practiceHistory ?? [];
    normalized.unlockedBadges = normalized.unlockedBadges ?? [];
    normalized.unlockedPlanets = normalized.unlockedPlanets ?? [];
    resetWeeklyGoalIfNeeded(normalized, getWeekKey());
    return normalized;
  });

  return {
    currentUserId: users.some((user) => user.id === data.currentUserId)
      ? data.currentUserId
      : users[0]?.id || "",
    users,
  };
}

function migrateLegacyData() {
  const legacyGrowth = readLegacyGrowth();
  const legacyHistory = readLegacyHistory();
  const hasLegacyData = legacyGrowth.totalStars > 0 || legacyHistory.length > 0;

  if (!hasLegacyData) {
    return { currentUserId: "", users: [] };
  }

  const user = createEmptyUser({
    name: "默认飞行员",
    grade: "未设置",
    avatar: "🚀",
  });
  user.totalStars = legacyGrowth.totalStars;
  user.starDust = legacyGrowth.starDust;
  user.practiceHistory = legacyHistory;
  user.streakDays = calculateStreakDays(legacyHistory);
  user.lastPracticeDate = legacyHistory[0]?.date ?? "";
  user.weeklyGoal.earnedThisWeek = legacyGrowth.currentWeekStars;
  return {
    currentUserId: user.id,
    users: [user],
  };
}

function readLegacyGrowth() {
  try {
    const growth = JSON.parse(localStorage.getItem(GROWTH_STORAGE_KEY)) ?? {};
    const weekKey = getWeekKey();
    return {
      totalStars: Number(growth.totalStars) || 0,
      starDust: Number(growth.starDust) || 0,
      currentWeekStars: Number(growth.weeklyStars?.[weekKey]) || 0,
    };
  } catch {
    return { totalStars: 0, starDust: 0, currentWeekStars: 0 };
  }
}

function readLegacyHistory() {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    return Object.entries(records).flatMap(([date, record]) => {
      const attempts = record.attempts?.length
        ? record.attempts
        : [{ correct: record.correct, total: record.total, stars: record.stars, timerSeconds: "" }];

      return attempts.map((attempt, index) => {
        const correct = Number(attempt.correct) || 0;
        const total = Number(attempt.total) || Number(attempt.totalQuestions) || 0;
        const stars = Number(attempt.stars) || Number(attempt.starsEarned) || 0;
        return {
          id: `legacy-${date}-${index}`,
          date,
          time: formatAttemptTime(attempt.finishedAt) || "",
          type: "旧记录",
          totalQuestions: total,
          correct,
          wrong: Math.max(0, total - correct),
          accuracy: getRate(correct, total),
          timeLimit: Number(attempt.timerSeconds) || "",
          starsEarned: stars,
          maxCombo: 0,
        };
      });
    }).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

function createEmptyUser({ name, grade, avatar }) {
  return {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    grade,
    avatar,
    createdAt: new Date().toISOString(),
    totalStars: 0,
    starDust: 0,
    streakDays: 0,
    lastPracticeDate: "",
    weeklyGoal: {
      target: WEEKLY_GOAL,
      earnedThisWeek: 0,
      weekStart: getWeekKey(),
    },
    unlockedBadges: [],
    unlockedPlanets: [],
    practiceHistory: [],
  };
}

function getCurrentUser() {
  return galaxyData.users.find((user) => user.id === galaxyData.currentUserId);
}

function saveGalaxyData() {
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(galaxyData));
}

function resetWeeklyGoalIfNeeded(user, weekKey) {
  user.weeklyGoal = user.weeklyGoal ?? {
    target: WEEKLY_GOAL,
    earnedThisWeek: 0,
    weekStart: weekKey,
  };
  if (user.weeklyGoal.weekStart !== weekKey) {
    user.weeklyGoal.weekStart = weekKey;
    user.weeklyGoal.earnedThisWeek = 0;
  }
  user.weeklyGoal.target = user.weeklyGoal.target || WEEKLY_GOAL;
}

function updateUserStreak(user, todayKey) {
  if (user.lastPracticeDate === todayKey) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);
  user.streakDays = user.lastPracticeDate === yesterdayKey ? (user.streakDays || 0) + 1 : 1;
  user.lastPracticeDate = todayKey;
}

function calculateStreakDays(history) {
  const dates = [...new Set(history.map((attempt) => attempt.date))].sort((a, b) => b.localeCompare(a));
  if (dates.length === 0) return 0;

  let streak = 1;
  let cursor = new Date(`${dates[0]}T00:00:00`);
  for (let index = 1; index < dates.length; index += 1) {
    cursor.setDate(cursor.getDate() - 1);
    if (formatDateKey(cursor) !== dates[index]) break;
    streak += 1;
  }
  return streak;
}

function getRate(correct, total) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

function getDateKey() {
  return formatDateKey(new Date());
}

function getWeekKey() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - day + 1);
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const date = String(monday.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function formatDateKey(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatAttemptTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

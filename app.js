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


const rarityBonus = {
  Common: 0,
  Rare: 50,
  Epic: 120,
  Legendary: 250,
};

const duplicateStarDust = {
  Common: 10,
  Rare: 30,
  Epic: 80,
  Legendary: 150,
};

const drawRarityTable = [
  { rarity: "Common", weight: 45 },
  { rarity: "Rare", weight: 30 },
  { rarity: "Epic", weight: 20 },
  { rarity: "Legendary", weight: 5 },
];

function getRarityCode(rarity) {
  switch (rarity) {
    case "Common":
      return "C";
    case "Rare":
      return "R";
    case "Epic":
      return "SR";
    case "Legendary":
      return "SSR";
    default:
      return "C";
  }
}

const solarScienceCards = [
  {
    id: "sun",
    cardNo: "SC-001",
    realmId: "solar_realm",
    name: "Sun",
    nameZh: "太阳",
    category: "恒星",
    rarity: "Legendary",
    image: "/cards/solar/sun.png",
    fallbackIcon: "☀️",
    scienceIntro: "太阳是太阳系的中心恒星，提供光和热，也用强大的引力维系行星轨道。",
    keyIdeas: ["核聚变释放能量", "太阳风会影响空间环境", "太阳质量占太阳系绝大部分"],
    domains: { gravity: 100, orbit: 70, matter: 82, energy: 100, mystery: 86 },
    lightNodeId: "node-sun",
  },
  {
    id: "mercury",
    cardNo: "SC-002",
    realmId: "solar_realm",
    name: "Mercury",
    nameZh: "水星",
    category: "岩石行星",
    rarity: "Rare",
    image: "/cards/solar/mercury.png",
    fallbackIcon: "☿️",
    scienceIntro: "水星是最靠近太阳的行星，公转很快，昼夜温差极大。",
    keyIdeas: ["轨道周期约 88 天", "几乎没有厚大气", "表面布满撞击坑"],
    domains: { gravity: 32, orbit: 92, matter: 70, energy: 72, mystery: 48 },
    lightNodeId: "node-mercury",
  },
  {
    id: "venus",
    cardNo: "SC-003",
    realmId: "solar_realm",
    name: "Venus",
    nameZh: "金星",
    category: "岩石行星",
    rarity: "Rare",
    image: "/cards/solar/venus.png",
    fallbackIcon: "♀️",
    scienceIntro: "金星拥有浓厚二氧化碳大气和强烈温室效应，是太阳系最热的行星。",
    keyIdeas: ["自转方向很特别", "云层含硫酸成分", "表面气压极高"],
    domains: { gravity: 62, orbit: 64, matter: 84, energy: 95, mystery: 68 },
    lightNodeId: "node-venus",
  },
  {
    id: "earth",
    cardNo: "SC-004",
    realmId: "solar_realm",
    name: "Earth",
    nameZh: "地球",
    category: "生命行星",
    rarity: "Epic",
    image: "/cards/solar/earth.png",
    fallbackIcon: "🌍",
    scienceIntro: "地球拥有液态水、活跃大气和磁场，是目前已知唯一孕育生命的星球。",
    keyIdeas: ["液态水塑造气候和地貌", "磁场保护生命环境", "板块运动让地球持续变化"],
    domains: { gravity: 68, orbit: 76, matter: 90, energy: 82, mystery: 92 },
    lightNodeId: "node-earth",
  },
  {
    id: "moon",
    cardNo: "SC-005",
    realmId: "solar_realm",
    name: "Moon",
    nameZh: "月球",
    category: "天然卫星",
    rarity: "Common",
    image: "/cards/solar/moon.png",
    fallbackIcon: "🌙",
    scienceIntro: "月球是地球的天然卫星，影响潮汐，也是人类首次登陆的外星世界。",
    keyIdeas: ["潮汐与月球引力有关", "月相来自日照角度变化", "表面保存早期撞击历史"],
    domains: { gravity: 38, orbit: 78, matter: 64, energy: 40, mystery: 58 },
    lightNodeId: "node-moon",
  },
  {
    id: "mars",
    cardNo: "SC-006",
    realmId: "solar_realm",
    name: "Mars",
    nameZh: "火星",
    category: "岩石行星",
    rarity: "Rare",
    image: "/cards/solar/mars.png",
    fallbackIcon: "♂️",
    scienceIntro: "火星是红色岩石行星，拥有巨型火山、峡谷和可能存在过液态水的证据。",
    keyIdeas: ["氧化铁让火星呈红色", "极冠含冰", "探测车持续研究古环境"],
    domains: { gravity: 46, orbit: 70, matter: 82, energy: 56, mystery: 86 },
    lightNodeId: "node-mars",
  },
  {
    id: "jupiter",
    cardNo: "SC-007",
    realmId: "solar_realm",
    name: "Jupiter",
    nameZh: "木星",
    category: "气态巨行星",
    rarity: "Epic",
    image: "/cards/solar/jupiter.png",
    fallbackIcon: "🟠",
    scienceIntro: "木星是太阳系最大的行星，强大引力和大红斑风暴使它成为行星科学重点。",
    keyIdeas: ["主要由氢和氦组成", "大红斑是巨大风暴", "拥有大量卫星"],
    domains: { gravity: 96, orbit: 64, matter: 86, energy: 88, mystery: 82 },
    lightNodeId: "node-jupiter",
  },
  {
    id: "saturn",
    cardNo: "SC-008",
    realmId: "solar_realm",
    name: "Saturn",
    nameZh: "土星",
    category: "环状巨行星",
    rarity: "Epic",
    image: "/cards/solar/saturn.png",
    fallbackIcon: "🪐",
    scienceIntro: "土星以壮观光环闻名，光环由冰粒、岩屑和尘埃组成。",
    keyIdeas: ["光环不是实体圆盘", "密度很低", "土卫六拥有浓厚大气"],
    domains: { gravity: 88, orbit: 68, matter: 90, energy: 72, mystery: 86 },
    lightNodeId: "node-saturn",
  },
  {
    id: "uranus",
    cardNo: "SC-009",
    realmId: "solar_realm",
    name: "Uranus",
    nameZh: "天王星",
    category: "冰巨行星",
    rarity: "Rare",
    image: "/cards/solar/uranus.png",
    fallbackIcon: "🔵",
    scienceIntro: "天王星是一颗冰巨行星，自转轴几乎横躺，像在轨道上侧身滚动。",
    keyIdeas: ["富含水、氨和甲烷冰", "蓝绿色来自甲烷吸收红光", "极端倾角造成特殊季节"],
    domains: { gravity: 74, orbit: 80, matter: 82, energy: 52, mystery: 78 },
    lightNodeId: "node-uranus",
  },
  {
    id: "neptune",
    cardNo: "SC-010",
    realmId: "solar_realm",
    name: "Neptune",
    nameZh: "海王星",
    category: "冰巨行星",
    rarity: "Rare",
    image: "/cards/solar/neptune.png",
    fallbackIcon: "🔷",
    scienceIntro: "海王星是遥远的冰巨行星，拥有太阳系中极强的高速风暴。",
    keyIdeas: ["通过引力异常被预言发现", "风速可非常惊人", "轨道周期约 165 年"],
    domains: { gravity: 78, orbit: 82, matter: 80, energy: 78, mystery: 80 },
    lightNodeId: "node-neptune",
  },
  {
    id: "pluto",
    cardNo: "SC-011",
    realmId: "solar_realm",
    name: "Pluto",
    nameZh: "冥王星",
    category: "矮行星",
    rarity: "Rare",
    image: "/cards/solar/pluto.png",
    fallbackIcon: "🟤",
    scienceIntro: "冥王星是柯伊伯带中的矮行星，表面有冰原、山脉和复杂地貌。",
    keyIdeas: ["轨道偏心率较大", "与卡戎形成独特系统", "新视野号揭示了丰富地貌"],
    domains: { gravity: 28, orbit: 86, matter: 74, energy: 38, mystery: 88 },
    lightNodeId: "node-pluto",
  },
  {
    id: "asteroid_belt",
    cardNo: "SC-012",
    realmId: "solar_realm",
    name: "Asteroid Belt",
    nameZh: "小行星带",
    category: "天体区域",
    rarity: "Common",
    image: "/cards/solar/asteroid-belt.png",
    fallbackIcon: "☄️",
    scienceIntro: "小行星带位于火星和木星之间，保存着太阳系早期形成过程的线索。",
    keyIdeas: ["包含大量岩石小天体", "谷神星是其中的矮行星", "木星引力影响其结构"],
    domains: { gravity: 44, orbit: 76, matter: 88, energy: 34, mystery: 72 },
    lightNodeId: "node-asteroid-belt",
  },
  {
    id: "comet",
    cardNo: "SC-013",
    realmId: "solar_realm",
    name: "Comet",
    nameZh: "彗星",
    category: "冰尘天体",
    rarity: "Common",
    image: "/cards/solar/comet.png",
    fallbackIcon: "💫",
    scienceIntro: "彗星由冰、尘埃和岩石组成，接近太阳时会形成明亮彗发和彗尾。",
    keyIdeas: ["彗尾总大致背向太阳", "保存太阳系原始物质", "轨道可能非常 elongated"],
    domains: { gravity: 22, orbit: 92, matter: 76, energy: 64, mystery: 82 },
    lightNodeId: "node-comet",
  },
  {
    id: "kuiper_belt",
    cardNo: "SC-014",
    realmId: "solar_realm",
    name: "Kuiper Belt",
    nameZh: "柯伊伯带",
    category: "外太阳系区域",
    rarity: "Epic",
    image: "/cards/solar/kuiper-belt.png",
    fallbackIcon: "❄️",
    scienceIntro: "柯伊伯带位于海王星外侧，包含大量冰质小天体和矮行星。",
    keyIdeas: ["冥王星属于柯伊伯带天体", "保存太阳系外缘信息", "短周期彗星可能来自这里"],
    domains: { gravity: 58, orbit: 88, matter: 84, energy: 36, mystery: 94 },
    lightNodeId: "node-kuiper-belt",
  },
  {
    id: "oort_cloud",
    cardNo: "SC-015",
    realmId: "solar_realm",
    name: "Oort Cloud",
    nameZh: "奥尔特云",
    category: "假想彗星云",
    rarity: "Legendary",
    image: "/cards/solar/oort-cloud.png",
    fallbackIcon: "🌌",
    scienceIntro: "奥尔特云被认为是包围太阳系的遥远冰质天体云，可能是许多长周期彗星的来源。",
    keyIdeas: ["距离太阳极其遥远", "尚未被直接观测确认", "连接太阳系与星际空间边界"],
    domains: { gravity: 66, orbit: 96, matter: 78, energy: 30, mystery: 100 },
    lightNodeId: "node-oort-cloud",
  },
].map((card) => ({
  ...card,
  sciencePower: card.domains.gravity + card.domains.orbit + card.domains.matter + card.domains.energy + card.domains.mystery + rarityBonus[card.rarity],
}));

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
  practiceStartedAt: 0,
  totalTimerId: null,
  nextQuestionId: null,
  editingUserId: "",
  selectedRarityFilter: "All",
  recentLightNodeId: "",
};

let galaxyData = loadGalaxyData();


function safeListen(element, eventName, handler) {
  if (element) element.addEventListener(eventName, handler);
}

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
  journeyButton: document.querySelector("#journeyButton"),
  journeyScreen: document.querySelector("#journeyScreen"),
  closeJourneyButton: document.querySelector("#closeJourneyButton"),
  journeyPilotAvatar: document.querySelector("#journeyPilotAvatar"),
  journeyPilotName: document.querySelector("#journeyPilotName"),
  journeyProgressText: document.querySelector("#journeyProgressText"),
  journeyTotalStars: document.querySelector("#journeyTotalStars"),
  journeyStarDust: document.querySelector("#journeyStarDust"),
  journeyDrawChances: document.querySelector("#journeyDrawChances"),
  journeyDrawProgress: document.querySelector("#journeyDrawProgress"),
  packHintText: document.querySelector("#packHintText"),
  openPackButton: document.querySelector("#openPackButton"),
  solarProgressBadge: document.querySelector("#solarProgressBadge"),
  solarRealmMap: document.querySelector("#solarRealmMap"),
  mapPreview: document.querySelector("#mapPreview"),
  rarityFilters: document.querySelector("#rarityFilters"),
  scienceCardGrid: document.querySelector("#scienceCardGrid"),
  packResultModal: document.querySelector("#packResultModal"),
  closePackResult: document.querySelector("#closePackResult"),
  packResultContent: document.querySelector("#packResultContent"),
  scienceCardModal: document.querySelector("#scienceCardModal"),
  closeCardDetail: document.querySelector("#closeCardDetail"),
  scienceCardDetail: document.querySelector("#scienceCardDetail"),
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
  totalTimeText: document.querySelector("#totalTimeText"),
  sessionStarsText: document.querySelector("#sessionStarsText"),
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

safeListen(els.startButton, "click", startPractice);
safeListen(els.restartButton, "click", startPractice);
safeListen(els.backButton, "click", returnToSetup);
safeListen(els.switchUserButton, "click", showUserScreen);
safeListen(els.editCurrentUserButton, "click", () => openEditUserModal(galaxyData.currentUserId));
safeListen(els.journeyButton, "click", openJourneyScreen);
safeListen(els.closeJourneyButton, "click", closeJourneyScreen);
safeListen(els.openPackButton, "click", handleOpenPack);
safeListen(els.closePackResult, "click", closePackResultModal);
safeListen(els.packResultContent, "click", handlePackResultContentClick);
safeListen(els.closeCardDetail, "click", closeScienceCardModal);
safeListen(els.solarRealmMap, "click", handleSolarMapClick);
safeListen(els.solarRealmMap, "mouseover", handleSolarMapPreview);
safeListen(els.rarityFilters, "click", handleRarityFilter);
safeListen(els.scienceCardGrid, "click", handleScienceCardGridClick);
safeListen(els.userCards, "click", handleUserCardsClick);
safeListen(els.createUserForm, "submit", handleCreateUser);
safeListen(els.cancelCreateUser, "click", closeCreateUserModal);
safeListen(els.answerForm, "submit", handleAnswer);
safeListen(els.answerInput, "keydown", handleAnswerKeydown);
safeListen(els.nextButton, "click", goToNextQuestion);
safeListen(els.clearRecordsButton, "click", clearRecords);
safeListen(els.recordsToggle, "click", openRecordsDrawer);
safeListen(els.recordsClose, "click", closeRecordsDrawer);
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
  clearTotalTimer();
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
  clearTotalTimer();
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
  state.practiceStartedAt = Date.now();
  state.categoryStats = Object.fromEntries(
    categories.map((category) => [
      category.id,
      { name: category.name, correct: 0, wrong: 0 },
    ]),
  );

  showScreen("quiz");
  renderStats();
  renderSessionMeta();
  startTotalTimer();
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
    renderSessionMeta();
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
    renderSessionMeta();
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
  els.questionText.textContent = `${question.text} =`;
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
  renderSessionMeta();
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

function startTotalTimer() {
  clearTotalTimer();
  state.totalTimerId = window.setInterval(renderSessionMeta, 1000);
}

function clearTotalTimer() {
  if (!state.totalTimerId) return;
  window.clearInterval(state.totalTimerId);
  state.totalTimerId = null;
}

function renderSessionMeta() {
  if (els.sessionStarsText) {
    els.sessionStarsText.textContent = `本轮星星 ${state.stars}`;
  }
  if (!els.totalTimeText) return;
  const elapsedSeconds = state.practiceStartedAt
    ? Math.floor((Date.now() - state.practiceStartedAt) / 1000)
    : 0;
  els.totalTimeText.textContent = `总用时 ${formatElapsedTime(elapsedSeconds)}`;
}

function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.max(0, totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function clearNextQuestionDelay() {
  if (!state.nextQuestionId) return;
  window.clearTimeout(state.nextQuestionId);
  state.nextQuestionId = null;
}

function finishPractice() {
  clearTimer();
  clearTotalTimer();
  clearNextQuestionDelay();
  renderSessionMeta();
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
  const hadPracticeToday = user.practiceHistory.some((attempt) => attempt.date === todayKey);
  resetWeeklyGoalIfNeeded(user, weekKey);
  initializeJourneyData(user);

  user.totalStars += settlement.totalEarned;
  user.starDust += settlement.totalEarned;
  user.weeklyGoal.earnedThisWeek += settlement.totalEarned;
  updateUserStreak(user, todayKey);
  updateJourneyProgress(user, settlement.totalEarned, !hadPracticeToday);
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


function createDefaultJourney() {
  return {
    dailyDrawChances: 0,
    starsTowardNextDraw: 0,
    starsEarnedToday: 0,
    drawChancesEarnedToday: 0,
    totalDraws: 0,
    pityCounter: 0,
    lastJourneyDate: getDateKey(),
  };
}

function createDefaultRealmProgress() {
  return {
    solar_realm: {
      totalCards: solarScienceCards.length,
      unlockedCards: 0,
      completed: false,
      completedAt: null,
    },
  };
}

function initializeJourneyData(user) {
  user.journey = { ...createDefaultJourney(), ...(user.journey ?? {}) };
  user.cardCollection = user.cardCollection ?? {};
  user.realmProgress = { ...createDefaultRealmProgress(), ...(user.realmProgress ?? {}) };
  user.realmProgress.solar_realm = {
    ...createDefaultRealmProgress().solar_realm,
    ...(user.realmProgress.solar_realm ?? {}),
  };
  const todayKey = getDateKey();
  if (user.journey.lastJourneyDate !== todayKey) {
    user.journey.starsEarnedToday = 0;
    user.journey.drawChancesEarnedToday = 0;
    user.journey.lastJourneyDate = todayKey;
  }
  refreshRealmProgress(user);
}

function refreshRealmProgress(user) {
  const unlockedCards = solarScienceCards.filter((card) => user.cardCollection?.[card.id]?.owned).length;
  const progress = user.realmProgress.solar_realm;
  progress.totalCards = solarScienceCards.length;
  progress.unlockedCards = unlockedCards;
  if (unlockedCards >= solarScienceCards.length && !progress.completed) {
    progress.completed = true;
    progress.completedAt = new Date().toISOString();
  }
}

function updateJourneyProgress(user, starsEarned, isFirstPracticeToday) {
  initializeJourneyData(user);
  const journey = user.journey;
  journey.starsEarnedToday += starsEarned;

  if (isFirstPracticeToday) {
    journey.dailyDrawChances += 1;
  }

  if (journey.drawChancesEarnedToday < 5) {
    journey.starsTowardNextDraw += starsEarned;
    while (journey.starsTowardNextDraw >= 100 && journey.drawChancesEarnedToday < 5) {
      journey.starsTowardNextDraw -= 100;
      journey.drawChancesEarnedToday += 1;
      journey.dailyDrawChances += 1;
    }
  }

  if (isFirstPracticeToday) {
    if ((user.streakDays || 0) > 0 && user.streakDays % 7 === 0) {
      journey.dailyDrawChances += 3;
    } else if ((user.streakDays || 0) > 0 && user.streakDays % 3 === 0) {
      journey.dailyDrawChances += 1;
    }
  }
}

function openJourneyScreen() {
  const user = getCurrentUser();
  if (!user) return;
  initializeJourneyData(user);
  saveGalaxyData();
  renderJourneyScreen();
  els.journeyScreen.classList.remove("hidden");
}

function closeJourneyScreen() {
  els.journeyScreen.classList.add("hidden");
  state.recentLightNodeId = "";
}

function renderJourneyScreen() {
  const user = getCurrentUser();
  if (!user) return;
  initializeJourneyData(user);
  const progress = user.realmProgress.solar_realm;
  els.journeyPilotAvatar.textContent = user.avatar;
  els.journeyPilotName.textContent = `${user.name}的星际之旅`;
  els.journeyTotalStars.textContent = user.totalStars;
  els.journeyStarDust.textContent = user.starDust;
  els.journeyDrawChances.textContent = user.journey.dailyDrawChances;
  els.journeyDrawProgress.textContent = `${user.journey.starsTowardNextDraw} / 100`;
  els.journeyProgressText.textContent = `太阳星域 ${progress.unlockedCards} / ${progress.totalCards}`;
  els.solarProgressBadge.textContent = progress.completed
    ? "太阳星域科学图鉴完成"
    : `${progress.unlockedCards} / ${progress.totalCards}`;
  els.openPackButton.disabled = user.journey.dailyDrawChances <= 0;
  els.packHintText.textContent = user.journey.dailyDrawChances > 0
    ? `还有 ${user.journey.dailyDrawChances} 次科学星光探索机会。`
    : "完成练习获得更多探索机会";
  renderSolarRealmMap(user);
  renderScienceCardGrid(user);
}

function renderSolarRealmMap(user) {
  els.solarRealmMap.innerHTML = solarScienceCards.map((card, index) => {
    const entry = user.cardCollection[card.id];
    const unlocked = Boolean(entry?.owned);
    const active = state.recentLightNodeId === card.lightNodeId ? " is-new-light" : "";
    return `
      <button class="solar-node realm-node ${unlocked ? "unlocked" : "locked"} ${card.rarity.toLowerCase()}${active}" type="button" data-card-id="${card.id}" style="--node-index: ${index}">
        <span class="realm-node-core">${unlocked ? renderCelestialThumb(card) : "?"}</span>
        <strong>${card.nameZh}</strong>
        <small>${getRarityCode(card.rarity)} · ${card.cardNo}</small>
      </button>
    `;
  }).join("");
}

function renderScienceCardGrid(user) {
  const filter = state.selectedRarityFilter;
  els.scienceCardGrid.innerHTML = solarScienceCards
    .filter((card) => filter === "All" || card.rarity === filter)
    .map((card) => {
      const entry = user.cardCollection[card.id];
      const unlocked = Boolean(entry?.owned);
      return renderScienceCardFace(card, entry, unlocked, { compact: true, asButton: true });
    }).join("");
}

function renderScienceCardFace(card, entry, unlocked, options = {}) {
  const tagName = options.asButton ? "button" : "div";
  const buttonAttrs = options.asButton ? `type="button" data-card-id="${card.id}"` : "";
  const compactClass = options.compact ? " is-compact" : "";
  const ownedClass = unlocked ? "is-owned" : "is-unknown";
  const title = unlocked ? `${card.nameZh} ${card.name}` : "Unknown Celestial File";
  const subtitle = unlocked ? `${card.category} · Solar Realm` : "Solar Realm Collection";
  const intro = unlocked ? card.scienceIntro : `尚未点亮 ${card.nameZh} 的星体档案。开启科学星光包，解锁这份宇宙科学档案。`;
  const ideas = unlocked ? card.keyIdeas.slice(0, options.compact ? 3 : 4) : ["未发现", "科学档案", "等待点亮"];
  const imageMarkup = unlocked ? renderCelestialImage(card) : `<span class="planet-fallback">◎</span>`;
  const countText = unlocked ? `Lv.${entry.level} · ×${entry.count}${entry.isShiny ? " · Shiny" : ""}` : "LOCKED";

  return `
    <${tagName} class="science-card solar-science-card card-${card.rarity.toLowerCase()} ${ownedClass}${compactClass}" ${buttonAttrs}>
      <div class="card-constellation" aria-hidden="true"></div>
      <div class="card-orbit-ring" aria-hidden="true"></div>
      <div class="card-topline">
        <span class="rarity-badge rarity-${card.rarity.toLowerCase()}">${getRarityCode(card.rarity)}</span>
        <span class="card-number">${card.cardNo}</span>
      </div>
      <div class="card-image-area">
        ${imageMarkup}
      </div>
      <div class="card-title-block">
        <strong class="card-title">${title}</strong>
        <span class="card-category">${subtitle}</span>
      </div>
      <p class="science-intro">${intro}</p>
      <div class="key-ideas">
        ${ideas.map((idea) => `<span class="key-idea-pill">${idea}</span>`).join("")}
      </div>
      ${unlocked ? renderDomainRows(card, options.compact) : renderCardBackMini()}
      <div class="science-power">
        <span class="science-power-label">Science Power</span>
        <strong class="science-power-value">${unlocked ? card.sciencePower : "???"}</strong>
      </div>
      <div class="collection-meta">${countText}</div>
    </${tagName}>
  `;
}

function renderCardBackMini() {
  return `
    <div class="card-back-mini">
      <span>Solar</span>
      <strong>Science Cards</strong>
      <em>My Stellar Journey</em>
    </div>
  `;
}


function renderCelestialImage(card) {
  const fallback = card.fallbackIcon ?? "◎";
  return `
    <img
      class="planet-image ${card.rarity.toLowerCase()}"
      src="${card.image}"
      alt="${card.nameZh} ${card.name}"
      loading="lazy"
      onerror="this.hidden=true;this.nextElementSibling.hidden=false"
    >
    <span class="planet-fallback ${card.rarity.toLowerCase()}" hidden>${fallback}</span>
  `;
}

function renderCelestialThumb(card) {
  const fallback = card.fallbackIcon ?? "✦";
  return `
    <img
      class="realm-node-image"
      src="${card.image}"
      alt=""
      loading="lazy"
      onerror="this.hidden=true;this.nextElementSibling.hidden=false"
    >
    <span class="realm-node-fallback" hidden>${fallback}</span>
  `;
}

function renderDomainRows(card, compact = false) {
  const rows = [
    ["gravity", "🌀", "Gravity"],
    ["orbit", "⭕", "Orbit"],
    ["matter", "◈", "Matter"],
    ["energy", "⚡", "Energy"],
    ["mystery", "✦", "Mystery"],
  ];
  const visibleRows = compact ? rows.slice(0, 3) : rows;
  return `
    <div class="domain-rows">
      ${visibleRows.map(([key, icon, label]) => `
        <div class="domain-row">
          <span class="domain-label">${icon} ${label}</span>
          <span class="domain-value">${card.domains[key]}</span>
          <span class="domain-bar"><i class="domain-fill" style="width: ${card.domains[key]}%"></i></span>
        </div>
      `).join("")}
    </div>
  `;
}

function handleOpenPack() {
  const user = getCurrentUser();
  if (!user) return;
  initializeJourneyData(user);
  if (user.journey.dailyDrawChances <= 0) {
    els.packHintText.textContent = "完成练习获得更多探索机会";
    renderJourneyScreen();
    return;
  }
  showPackChoice();
}

function showPackChoice() {
  els.packResultContent.innerHTML = `
    <div class="pack-choice-scene">
      <p class="eyebrow">Start a Science Discovery</p>
      <h2 id="packResultTitle">选择一张科学星光卡</h2>
      <p>三张卡背后连接同一个太阳星域星光包。选中一张，开启你的宇宙科学档案。</p>
      <div class="pack-choice-grid" aria-label="选择科学星光包中的一张卡">
        ${[0, 1, 2].map((index) => `
          <button class="pack-choice-card" type="button" data-pack-choice="${index + 1}" style="--choice-index: ${index}">
            ${renderScienceCardBack(index + 1)}
          </button>
        `).join("")}
      </div>
      <small class="pack-choice-hint">点击其中一张卡，星光会翻开你的发现。</small>
    </div>
  `;
  els.packResultModal.classList.remove("hidden");
}

function renderScienceCardBack(index) {
  return `
    <span class="choice-card-back">
      <i></i>
      <strong>Solar<br>Science<br>Cards</strong>
      <em>My Stellar Journey</em>
      <small>Discovery ${index}</small>
    </span>
  `;
}

function handlePackResultContentClick(event) {
  const choice = event.target.closest("[data-pack-choice]");
  if (!choice || choice.disabled) return;
  const user = getCurrentUser();
  if (!user) return;
  [...els.packResultContent.querySelectorAll("[data-pack-choice]")].forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-selected", button === choice);
    button.classList.toggle("is-faded", button !== choice);
  });
  choice.classList.add("is-opening");
  window.setTimeout(() => {
    const result = drawSolarScienceCard(user);
    saveGalaxyData();
    renderGrowth();
    renderJourneyScreen();
    showPackResult(result, choice.dataset.packChoice);
  }, 820);
}

function drawSolarScienceCard(user) {
  initializeJourneyData(user);
  user.journey.dailyDrawChances -= 1;
  user.journey.totalDraws += 1;
  const forceHighRarity = user.journey.pityCounter >= 9;
  const rarity = forceHighRarity ? pickWeightedRarity([
    { rarity: "Epic", weight: 80 },
    { rarity: "Legendary", weight: 20 },
  ]) : pickWeightedRarity(drawRarityTable);
  const card = pickWeightedCardByRarity(user, rarity);
  const entry = user.cardCollection[card.id];
  const isNew = !entry?.owned;
  let dustGained = 0;

  if (isNew) {
    user.cardCollection[card.id] = {
      owned: true,
      count: 1,
      level: 1,
      isShiny: false,
      firstCollectedAt: new Date().toISOString(),
      lastCollectedAt: new Date().toISOString(),
    };
    state.recentLightNodeId = card.lightNodeId;
  } else {
    entry.count += 1;
    entry.level = Math.max(entry.level || 1, entry.count >= 3 ? 2 : 1);
    if (entry.count >= 6) entry.level = Math.max(entry.level, 3);
    if (entry.count >= 5) entry.isShiny = true;
    entry.lastCollectedAt = new Date().toISOString();
    dustGained = duplicateStarDust[card.rarity];
    user.starDust += dustGained;
  }

  user.journey.pityCounter = ["Epic", "Legendary"].includes(card.rarity) ? 0 : user.journey.pityCounter + 1;
  refreshRealmProgress(user);
  return { card, isNew, dustGained, entry: user.cardCollection[card.id] };
}

function pickWeightedRarity(table) {
  const total = table.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of table) {
    roll -= item.weight;
    if (roll <= 0) return item.rarity;
  }
  return table[table.length - 1].rarity;
}

function pickWeightedCardByRarity(user, rarity) {
  const pool = solarScienceCards.filter((card) => card.rarity === rarity);
  const weighted = pool.map((card) => {
    const owned = Boolean(user.cardCollection[card.id]?.owned);
    const unownedCount = solarScienceCards.filter((item) => !user.cardCollection[item.id]?.owned).length;
    return { card, weight: owned ? 1 : (unownedCount >= 5 ? 4 : 2.5) };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.card;
  }
  return weighted[weighted.length - 1].card;
}

function showPackResult(result, choiceNumber = "") {
  const { card, isNew, dustGained, entry } = result;
  els.packResultContent.innerHTML = `
    <div class="pack-result-heading">
      <p class="eyebrow">${choiceNumber ? `Discovery ${choiceNumber} · ` : ""}${isNew ? "New Discovery! 新发现一个宇宙知识点！" : "Science File Upgraded 科学档案升级"}</p>
      <h2 id="packResultTitle">${isNew ? "Celestial Archive Activated 星体档案已点亮" : "星体研究进度提升"}</h2>
      <p>${isNew ? "太阳星域地图中对应节点已经点亮。" : `转化为星尘 +${dustGained}，科学档案研究等级提升。`}</p>
    </div>
    <div class="drawn-card-wrap">
      ${renderScienceCardFace(card, entry, true, { compact: false, asButton: false })}
    </div>
  `;
  els.packResultModal.classList.remove("hidden");
}

function closePackResultModal() {
  els.packResultModal.classList.add("hidden");
}

function handleSolarMapClick(event) {
  const node = event.target.closest("[data-card-id]");
  if (!node) return;
  showScienceCardDetail(node.dataset.cardId);
}

function handleSolarMapPreview(event) {
  const node = event.target.closest("[data-card-id]");
  if (!node) return;
  const user = getCurrentUser();
  const card = getSolarCard(node.dataset.cardId);
  const owned = Boolean(user?.cardCollection?.[card.id]?.owned);
  els.mapPreview.innerHTML = owned
    ? `<strong>${card.fallbackIcon ?? "✦"} ${card.nameZh}</strong><span>${getRarityCode(card.rarity)} · ${card.cardNo} · ${card.category} · Science Power ${card.sciencePower}</span>`
    : `<strong>未点亮星体</strong><span>开启科学星光包，发现 ${card.nameZh} 的科学档案。</span>`;
}

function handleRarityFilter(event) {
  const button = event.target.closest("[data-rarity]");
  if (!button) return;
  state.selectedRarityFilter = button.dataset.rarity;
  [...els.rarityFilters.querySelectorAll("button")].forEach((item) => item.classList.toggle("is-active", item === button));
  renderScienceCardGrid(getCurrentUser());
}

function handleScienceCardGridClick(event) {
  const cardButton = event.target.closest("[data-card-id]");
  if (!cardButton) return;
  showScienceCardDetail(cardButton.dataset.cardId);
}

function showScienceCardDetail(cardId) {
  const user = getCurrentUser();
  const card = getSolarCard(cardId);
  const entry = user?.cardCollection?.[cardId];
  const owned = Boolean(entry?.owned);
  els.scienceCardDetail.innerHTML = `
    <div class="card-detail-layout ${owned ? "" : "is-locked"}">
      <div class="detail-card-preview">
        ${renderScienceCardFace(card, entry, owned, { compact: false, asButton: false })}
      </div>
      <div class="detail-science-file">
        <p class="eyebrow">Solar Science Cards · ${getRarityCode(card.rarity)} · ${card.cardNo}</p>
        <h2 id="cardDetailTitle">${owned ? `${card.nameZh} / ${card.name}` : "Locked Science Card"}</h2>
        <strong>${card.category} · ${getRarityCode(card.rarity)} · ${card.cardNo}</strong>
        <p>${owned ? card.scienceIntro : `尚未点亮 ${card.nameZh} 的星体档案。完成练习获得探索机会，开启科学星光包来发现它。`}</p>
        ${owned ? renderDomainBars(card) : ""}
        ${owned ? `<div class="detail-key-ideas">${card.keyIdeas.map((idea) => `<span class="key-idea-pill">${idea}</span>`).join("")}</div>` : ""}
        ${owned ? `<div class="detail-meta"><span>Science Power ${card.sciencePower}</span><span>count ×${entry.count}</span><span>level ${entry.level}</span><span>${entry.isShiny ? "Shiny" : "普通档案"}</span><span>首次获得 ${formatDateTime(entry.firstCollectedAt)}</span></div>` : ""}
      </div>
    </div>
  `;
  els.scienceCardModal.classList.remove("hidden");
}

function renderDomainBars(card) {
  return renderDomainRows(card, false);
}

function closeScienceCardModal() {
  els.scienceCardModal.classList.add("hidden");
}

function getSolarCard(cardId) {
  return solarScienceCards.find((card) => card.id === cardId) ?? solarScienceCards[0];
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
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
  clearTotalTimer();
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
    initializeJourneyData(normalized);
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
    journey: createDefaultJourney(),
    cardCollection: {},
    realmProgress: createDefaultRealmProgress(),
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

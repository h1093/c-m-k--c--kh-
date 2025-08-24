

export interface PuppetAbility {
  name: string;
  description: string;
}

export interface MemoryFragment {
  id: string;
  title: string;
  text: string;
}

export interface Mutation {
  id: string;
  name: string;
  description: string; // Should describe both positive and negative effects
}

export type ComponentType = 'Core' | 'Frame' | 'Actuator';

export interface Component {
  id: string;
  name: string;
  description: string; // Should describe stat changes and effects
  type: ComponentType;
}

export interface Item {
  id: string; // ví dụ: "refined-oil"
  name: string;
  description: string;
  quantity: number;
}


export interface Clue {
  id: string; // ID định danh duy nhất, ví dụ: "nhat-ky-mat-tich-cua-su-phu"
  title: string;
  description: string;
}

export interface Quest {
  id: string; // ID định danh duy nhất, ví dụ: "giai-cuu-tho-may"
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
}

export interface Companion {
  id: string; // ID định danh duy nhất, ví dụ: "automaton-01"
  name: string;
  description: string;
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
}

export interface NPC {
  id: string; 
  name: string;
  description: string;
  background?: string; // Lý lịch, câu chuyện quá khứ hoặc bí mật của NPC.
  relationship: 'ally' | 'friendly' | 'neutral' | 'hostile';
  location: string;
  faction?: string; // Tên phe phái mà NPC này thuộc về, ví dụ: "Giáo Hội Đồng Hồ"
  goal?: string; // Their current short-term goal or state of mind.
  knowledge?: string[]; // A list of facts the NPC knows or believes about the player.

  // New properties for detailed profiling
  trangThai?: string; // "Status": What the NPC is currently doing, their role in the current scene.
  tuongTacCuoi?: string; // "Last Interaction": A summary of the last significant story-altering interaction.
}


export interface Enemy {
  name: string;
  description: string;
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
  subduable?: boolean; // True nếu kẻ thù này là máy móc và có thể thu phục
}

export interface Puppet {
  name: string;
  type: string;
  material: string;
  phePhai: string; // Phe Phái, tương tự Tông Môn, ví dụ: "Trường Phái Hộ Vệ", "Hội Người Dò Đường"
  loTrinh: string; // Tên Lộ Trình, ví dụ: "Pháo Đài", "Độc Lập"
  truongPhai: string; // Trường Phái, tương tự Chính/Tà, ví dụ: "Trường Phái Trật Tự", "Trường Phái Hỗn Mang"
  persona: string; // Nhân Cách, "phương pháp đóng vai" của con rối.
  sequence: number; // Thứ Tự, ví dụ: 9, 8
  sequenceName: string; // Tên của Thứ Tự, ví dụ: "Học Việc", "Nhà Chiêm Tinh Dây Cót"
  visualDescription?: string; // Mô tả trực quan do AI tạo ra
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    aberrantEnergy: number; // Tà Năng
    maxAberrantEnergy: number;
    resonance: number; // Cộng Hưởng - Mức độ đồng điệu với Nhân Cách
    operationalEnergy: number; // Năng Lượng Vận Hành - Nhiên liệu cho con rối
    maxOperationalEnergy: number;
  };
  abilities: PuppetAbility[];
  abilityPool: PuppetAbility[]; // Các kỹ năng tiềm năng có thể học
  mechanicalEssence: number; // Tinh Hoa Cơ Khí, dùng để nâng cấp
  
  // New Features
  memoryFragments: MemoryFragment[];
  mutations: Mutation[];
  componentSlots: {
      core: number;
      frame: number;
      actuator: number;
  };
  equippedComponents: Component[];
}

export type ExplanationId = 'resonance_and_persona' | 'aberrant_energy' | 'mechanical_essence' | 'combat' | 'sequences' | 'currency' | 'psyche_and_energy' | 'command_burden';

export interface Explanation {
  id: ExplanationId;
  title: string;
  text: string;
}

export interface LoreEntry {
  id: string; // "bi-an-ve-co-than-may-moc"
  title: string;
  content: string;
}

export interface LoreSummary {
  id: string;
  turnNumber: number;
  summary: string;
}

export interface StorySegment {
  scene: string;
  choices: string[];
  updatedPuppet?: Puppet;
  newClues?: Clue[];
  enemy?: Enemy;
  essenceGained?: number; // Lượng Tinh Hoa nhận được trong phân cảnh này
  resonanceChange?: number; // Sự thay đổi về Cộng Hưởng dựa trên lựa chọn
  explanation?: Explanation; // Giải thích cơ chế game được lồng ghép

  // Economy
  kimLenhChange?: number; // Tiền tệ thế giới bề nổi
  dauAnDongThauChange?: number; // Tiền tệ thế giới ngầm
  
  // New Survival Mechanics
  psycheChange?: number; // Sự thay đổi về Lý Trí của người chơi
  newItems?: Item[];
  updatedItems?: { id: string; quantityChange: number }[];


  // New Features
  newMemoryFragment?: MemoryFragment;
  newMutation?: Mutation;
  newComponent?: Component;
  newQuests?: Quest[];
  updatedQuests?: { id: string; status: 'completed' | 'failed' }[];
  newCompanion?: Companion;
  
  // Dynamic World Features
  worldEvent?: string;
  updatedWorldState?: { [key: string]: string };
  newOrUpdatedNPCs?: Partial<NPC>[];
  newLoreEntries?: LoreEntry[]; // Tri thức động mới được khám phá
  updatedFactionRelations?: { [faction: string]: number }; // Các thay đổi về mối quan hệ của người chơi với phe phái
}

export interface CombatTurnResult {
    combatLogEntry: string;
    updatedPuppet: Puppet;
    updatedEnemy: Enemy;
    isCombatOver: boolean;
    outcome: 'win' | 'loss' | 'ongoing';
    essenceGainedOnWin?: number;
    dauAnDongThauGainedOnWin?: number; // Thêm tiền tệ thế giới ngầm khi thắng
    newItemsOnWin?: Item[]; // Thêm vật phẩm khi thắng
    explanation?: Explanation;
    updatedCompanions?: Companion[];
    mentalShock?: string; // Sốc tinh thần người chơi phải chịu
    aberrantEnergyLeak?: string; // Mô tả ảo giác do Tà Năng rò rỉ
}

export interface UpgradeOption {
    type: 'skill' | 'stat_attack' | 'stat_defense' | 'stat_hp' | 'purge';
    name: string; // Tên của kỹ năng hoặc tên của chỉ số được nâng
    description: string;
    payload?: PuppetAbility; // Dữ liệu kỹ năng nếu type là 'skill'
}

export interface WorkshopData {
    scene: string;
    options: UpgradeOption[];
    explanation?: Explanation;
}

export type StartingScenario = 'complete' | 'ritual' | 'chaos' | 'human';

export enum GameStage {
  API_SETUP,
  START_SCREEN,
  WORLD_CREATION,
  CREATION,
  PLAYING,
  COMBAT,
  GAME_OVER,
  WORKSHOP, // Giai đoạn nâng cấp con rối
  LORE_SCREEN, // Màn hình tra cứu Sổ Tay Tri Thức
}

// Key là tên phe phái, value là điểm quan hệ từ -100 đến 100
export type FactionRelations = { [faction: string]: number };
export type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';


export interface GameState {
  stage: GameStage;
  previousStage: GameStage | null;
  puppetMasterName: string;
  puppetMasterBiography: string;
  mainQuest: string;
  puppet: Puppet | null;
  enemy: Enemy | null;
  storyHistory: StorySegment[];
  currentSegment: StorySegment | null;
  combatLog: string[];
  isLoading: boolean;
  error: string | null;
  clues: Clue[];
  workshopData: WorkshopData | null;
  shownExplanations: Set<ExplanationId>;
  componentInventory: Component[];
  customWorldPrompt: string | null;
  sideQuests: Quest[];
  companions: Companion[];
  mentalShock: string | null;
  aberrantEnergyLeak: string | null;
  lastDefeatedEnemy: Enemy | null;
  
  // Economy
  kimLenh: number; // Tiền tệ thế giới bề nổi
  dauAnDongThau: number; // Tiền tệ thế giới ngầm
  
  // New Survival Mechanics
  psyche: number; // Lý trí của người chơi
  maxPsyche: number;
  inventory: Item[];


  // Dynamic World Features
  npcs: NPC[];
  worldState: { [key: string]: string };
  loreEntries: LoreEntry[];
  loreSummaries: LoreSummary[];
  factionRelations: FactionRelations;
  difficulty: Difficulty;
  apiCalls: number;
}
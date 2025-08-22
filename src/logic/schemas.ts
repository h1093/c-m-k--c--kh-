


import { Type } from "@google/genai";

export const puppetAbilitySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING }
    }
};

export const itemSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID định danh duy nhất, ví dụ: 'refined-oil'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        quantity: { type: Type.INTEGER }
    },
    required: ["id", "name", "description", "quantity"]
};

export const memoryFragmentSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một định danh duy nhất, ngắn gọn, viết theo kiểu kebab-case, ví dụ: 'loi-thi-tham-cua-banh-rang'."},
        title: { type: Type.STRING },
        text: { type: Type.STRING, description: "Nội dung của mảnh ký ức, một đoạn văn ngắn, bí ẩn." }
    }
};

export const mutationSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một định danh duy nhất, ngắn gọn, viết theo kiểu kebab-case, ví dụ: 'khung-suon-gai-goc'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING, description: "Mô tả về đột biến, bao gồm cả mặt lợi và hại." }
    }
};

export const componentSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một định danh duy nhất, ngắn gọn, viết theo kiểu kebab-case, ví dụ: 'loi-nang-luong-bat-on'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING, description: "Mô tả về linh kiện và các hiệu ứng thay đổi chỉ số của nó." },
        type: { type: Type.STRING, description: "Loại linh kiện: 'Core', 'Frame', hoặc 'Actuator'."}
    },
    required: ["id", "name", "description", "type"]
};

export const companionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID định danh duy nhất, ví dụ: 'automaton-01'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        stats: {
            type: Type.OBJECT,
            properties: {
                hp: { type: Type.INTEGER },
                maxHp: { type: Type.INTEGER },
                attack: { type: Type.INTEGER },
                defense: { type: Type.INTEGER }
            }
        }
    },
    required: ["id", "name", "description", "stats"]
};

export const questSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID định danh duy nhất, ví dụ: 'giai-cuu-tho-may'."},
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        status: { type: Type.STRING, description: "Trạng thái của nhiệm vụ: 'active', 'completed', hoặc 'failed'."}
    },
    required: ["id", "title", "description", "status"]
};

export const npcSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất, kebab-case, ví dụ: 'tho-ren-grim'."},
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        background: { type: Type.STRING, description: "Lý lịch, câu chuyện quá khứ hoặc bí mật của NPC. Giữ nó ngắn gọn và hấp dẫn." },
        relationship: { type: Type.STRING, description: "Mối quan hệ với người chơi: 'ally', 'friendly', 'neutral', 'hostile'."},
        location: { type: Type.STRING, description: "Địa điểm hiện tại hoặc nơi gặp gỡ cuối cùng."},
        faction: { type: Type.STRING, description: "Tên phe phái mà NPC này thuộc về, ví dụ: 'Giáo Hội Đồng Hồ'"},
        goal: { type: Type.STRING, description: "Mục tiêu ngắn hạn hoặc trạng thái tâm trí hiện tại của NPC. Ví dụ: 'Đang hoài nghi về người chơi', 'Muốn tìm hiểu thêm về cổ vật'."},
        knowledge: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Một danh sách các sự thật mà NPC này biết hoặc tin về người chơi. Bao gồm cả những lời nói dối mà người chơi đã nói."
        }
    },
    required: ["id", "name", "description", "relationship", "location"]
};

export const npcMindSchema = {
    type: Type.OBJECT,
    properties: {
        trangThai: { 
            type: Type.STRING, 
            description: "Trạng thái hoặc vai trò hiện tại của NPC trong phân cảnh này. Ví dụ: 'Đang hoài nghi', 'Bị đe dọa', 'Thân thiện một cách thận trọng'." 
        },
        updatedTuongTacCuoi: { 
            type: Type.STRING, 
            description: "Một bản tóm tắt MỚI cho tương tác cuối cùng NẾU tương tác hiện tại đủ quan trọng để ghi nhớ (thay đổi mối quan hệ, mục tiêu, hoặc tiết lộ bí mật lớn). Nếu không, hãy trả về một chuỗi rỗng." 
        }
    },
    required: ["trangThai", "updatedTuongTacCuoi"]
};

export const loreEntrySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một định danh duy nhất, ngắn gọn, viết theo kiểu kebab-case, ví dụ: 'bi-an-ve-co-than-may-moc'."},
        title: { type: Type.STRING },
        content: { type: Type.STRING, description: "Nội dung của mục tri thức, tóm tắt một khám phá quan trọng của người chơi." }
    },
    required: ["id", "title", "content"]
};

export const loreSummarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "Một bản tóm tắt ngắn gọn, súc tích (một đoạn văn, 3-5 câu) về các sự kiện chính đã diễn ra."
        }
    },
    required: ["summary"]
};

export const biographySchema = {
    type: Type.OBJECT,
    properties: {
        origin: {
            type: Type.STRING,
            description: "Một câu mô tả nguồn gốc của nhân vật."
        },
        incident: {
            type: Type.STRING,
            description: "Một câu mô tả biến cố khởi đầu hoặc một chi tiết bất thường."
        },
        goal: {
            type: Type.STRING,
            description: "Một câu mô tả mục tiêu cá nhân của nhân vật."
        },
    },
    required: ["origin", "incident", "goal"],
};

export const puppetSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING },
        material: { type: Type.STRING },
        phePhai: { type: Type.STRING, description: "Phe Phái (tương tự Tông Môn) mà con rối thuộc về."},
        loTrinh: { type: Type.STRING, description: "Tên Lộ Trình mà con rối đang theo, ví dụ: 'Pháo Đài', 'Độc Lập'."},
        truongPhai: { type: Type.STRING, description: "Trường Phái (tương tự Chính/Tà) mà con rối tuân theo, ví dụ: Trật Tự, Hỗn Mang, Trung Lập."},
        persona: { type: Type.STRING, description: "Nhân Cách hay 'phương pháp đóng vai' cốt lõi của con rối, mà người chơi nên cố gắng tuân theo."},
        sequence: { type: Type.INTEGER, description: "Thứ Tự/cấp bậc hiện tại của con rối, ví dụ: 9." },
        sequenceName: { type: Type.STRING, description: "Tên của Thứ Tự hiện tại, ví dụ: 'Học Việc Sắt'." },
        stats: {
            type: Type.OBJECT,
            properties: {
                hp: { type: Type.INTEGER },
                maxHp: { type: Type.INTEGER },
                attack: { type: Type.INTEGER },
                defense: { type: Type.INTEGER },
                aberrantEnergy: { type: Type.INTEGER },
                maxAberrantEnergy: { type: Type.INTEGER },
                resonance: { type: Type.INTEGER, description: "Điểm Cộng Hưởng, từ 0-100, đo lường mức độ đồng điệu của con rối với Nhân Cách của nó." },
                operationalEnergy: { type: Type.INTEGER },
                maxOperationalEnergy: { type: Type.INTEGER }
            }
        },
        abilities: { 
            type: Type.ARRAY,
            items: puppetAbilitySchema,
            description: "Danh sách các kỹ năng đặc biệt của con rối. Có thể tăng lên khi nó thăng tiến."
        },
        abilityPool: {
            type: Type.ARRAY,
            items: puppetAbilitySchema,
            description: "Danh sách các kỹ năng mà con rối có thể học trong tương lai."
        },
        mechanicalEssence: { type: Type.INTEGER, description: "Số lượng Tinh Hoa Cơ Khí mà con rối hiện có, dùng để nâng cấp." },
        memoryFragments: { type: Type.ARRAY, items: memoryFragmentSchema },
        mutations: { type: Type.ARRAY, items: mutationSchema },
        componentSlots: {
            type: Type.OBJECT,
            properties: {
                core: { type: Type.INTEGER },
                frame: { type: Type.INTEGER },
                actuator: { type: Type.INTEGER }
            }
        },
        equippedComponents: { type: Type.ARRAY, items: componentSchema }
    },
    required: ["name", "type", "material", "phePhai", "loTrinh", "truongPhai", "persona", "sequence", "sequenceName", "stats", "abilities", "abilityPool", "mechanicalEssence", "memoryFragments", "mutations", "componentSlots", "equippedComponents"]
};

export const explanationSchema = {
    type: Type.OBJECT,
    description: "Một đoạn giải thích về một cơ chế game mới, được lồng ghép vào câu chuyện. Chỉ bao gồm khi một cơ chế được giới thiệu lần đầu.",
    properties: {
        id: { type: Type.STRING, description: "ID của cơ chế được giải thích: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'combat', 'sequences', 'currency', 'psyche_and_energy'." },
        title: { type: Type.STRING, description: "Tiêu đề của phần giải thích, ví dụ: 'Về Cộng Hưởng và Nhân Cách'." },
        text: { type: Type.STRING, description: "Nội dung giải thích chi tiết, được viết theo phong cách phù hợp với bối cảnh." }
    }
};

export const storySegmentSchema = {
    type: Type.OBJECT,
    properties: {
        scene: {
            type: Type.STRING,
            description: "Một đoạn mô tả chi tiết, hấp dẫn về tình huống, sự kiện hoặc lượt chiến đấu hiện tại, được viết theo phong cách steampunk thấm đẫm bí ẩn và kinh dị vũ trụ. Nên dài ít nhất 2-3 đoạn văn."
        },
        choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Một danh sách gồm 2-4 lựa chọn rõ ràng, có thể hành động cho người chơi. Nếu là kết thúc câu chuyện, mảng này có thể trống."
        },
        updatedPuppet: {
            ...puppetSchema,
            description: "Các chỉ số của con rối sau các sự kiện của phân cảnh. Chỉ bao gồm nếu các chỉ số đã thay đổi. Đối với phân cảnh đầu tiên, trường này là BẮT BUỘ̣c và phải chứa thông tin chi tiết về con rối mới được tạo ra (trừ kịch bản 'human')."
        },
        newClues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Một định danh duy nhất, ngắn gọn, viết theo kiểu kebab-case, ví dụ: 'nhat-ky-mat-tich-cua-su-phu'." },
                    title: { type: Type.STRING, description: "Một tiêu đề ngắn gọn cho manh mối." },
                    description: { type: Type.STRING, description: "Mô tả ngắn gọn về manh mối được phát hiện." }
                }
            },
            description: "Danh sách các manh mối mới mà người chơi đã khám phá trong phân cảnh này. Có thể trống."
        },
        enemy: {
            type: Type.OBJECT,
            description: "Nếu phân cảnh này bắt đầu một cuộc chiến, hãy mô tả kẻ thù ở đây. Nếu không, hãy bỏ qua.",
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                stats: {
                    type: Type.OBJECT,
                    properties: {
                        hp: { type: Type.INTEGER },
                        maxHp: { type: Type.INTEGER },
                        attack: { type: Type.INTEGER },
                        defense: { type: Type.INTEGER },
                    }
                }
            }
        },
        essenceGained: {
            type: Type.INTEGER,
            description: "Lượng 'Tinh Hoa Cơ Khí' người chơi nhận được khi hoàn thành phân cảnh này (nếu có). Thường dành cho các khám phá quan trọng hoặc giải quyết vấn đề một cách thông minh."
        },
        resonanceChange: {
            type: Type.INTEGER,
            description: "Sự thay đổi về điểm Cộng Hưởng. Dương nếu lựa chọn phù hợp với Nhân Cách, âm nếu không. Bỏ qua nếu không liên quan."
        },
        kimLenhChange: {
            type: Type.INTEGER,
            description: "Sự thay đổi về 'Kim Lệnh' (tiền tệ bề nổi). Dương là nhận, âm là mất."
        },
        dauAnDongThauChange: {
            type: Type.INTEGER,
            description: "Sự thay đổi về 'Dấu Ấn Đồng Thau' (tiền tệ thế giới ngầm). Dương là nhận, âm là mất."
        },
        psycheChange: {
            type: Type.INTEGER,
            description: "Sự thay đổi về Lý Trí (Psyche) của người chơi. Âm khi gặp sự kiện kinh hoàng, dương khi nghỉ ngơi hoặc thực hiện hành động 'tiếp đất'."
        },
        newItems: {
            type: Type.ARRAY,
            items: itemSchema,
            description: "Danh sách các vật phẩm mới người chơi nhận được."
        },
        updatedItems: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    quantityChange: { type: Type.INTEGER, description: "Số lượng thay đổi (âm là mất, dương là thêm)." }
                }
            },
            description: "Danh sách các vật phẩm trong túi đồ đã thay đổi số lượng."
        },
        explanation: explanationSchema,
        newMemoryFragment: { ...memoryFragmentSchema, description: "Một mảnh ký ức mới được mở khóa nếu Cộng Hưởng đạt ngưỡng cao." },
        newMutation: { ...mutationSchema, description: "Một đột biến mới xảy ra nếu Tà Năng đạt ngưỡng cao."},
        newComponent: { ...componentSchema, description: "Một linh kiện mới được tìm thấy như một phần thưởng."},
        newQuests: { type: Type.ARRAY, items: questSchema, description: "Một danh sách các nhiệm vụ phụ mới được giao."},
        updatedQuests: { 
            type: Type.ARRAY, 
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    status: { type: Type.STRING, description: "'completed' hoặc 'failed'"}
                }
            },
            description: "Một danh sách các nhiệm vụ phụ đã thay đổi trạng thái."
        },
        newCompanion: { ...companionSchema, description: "Một đồng đội MỚI gia nhập. Dùng khi một NPC được thăng cấp thành đồng đội."},
        worldEvent: { type: Type.STRING, description: "Một đoạn văn ngắn mô tả một sự kiện xảy ra trong thế giới khi người chơi không có mặt, để làm cho thế giới cảm thấy sống động. Ví dụ: tin đồn, thay đổi quyền lực của phe phái, v.v. Chỉ bao gồm không thường xuyên." },
        updatedWorldState: {
            type: Type.OBJECT,
            description: "Một đối tượng chứa các thay đổi đối với trạng thái của thế giới. Key là ID địa điểm (kebab-case), value là trạng thái mới. Ví dụ: {'khu-cong-nghiep': 'bao-dong-cao'}. QUAN TRỌNG: Bỏ qua hoàn toàn trường này nếu không có thay đổi nào về trạng thái thế giới.",
            properties: {
                placeholder: { 
                    type: Type.STRING,
                    description: "Đây là thuộc tính giữ chỗ để đảm bảo xác thực thành công. AI nên bỏ qua thuộc tính này và không đưa nó vào phản hồi."
                }
            },
            additionalProperties: { type: Type.STRING }
        },
        newOrUpdatedNPCs: { type: Type.ARRAY, items: npcSchema, description: "Danh sách các NPC mới gặp hoặc có mối quan hệ đã thay đổi. QUAN TRỌNG: Chỉ bao gồm các thuộc tính đã thay đổi cộng với id và name." },
        newLoreEntries: { type: Type.ARRAY, items: loreEntrySchema, description: "Một danh sách các mục tri thức động mới mà người chơi đã khám phá ra. Chỉ tạo ra khi có một khám phá quan trọng, đáng ghi nhớ." },
        updatedFactionRelations: {
            type: Type.OBJECT,
            description: "Một đối tượng chứa các thay đổi về mối quan hệ của người chơi với phe phái. Key là tên phe phái, value là SỐ LƯỢNG THAY ĐỔI (ví dụ: +10, -5). Chỉ bao gồm các phe phái có mối quan hệ thay đổi.",
            properties: {
                placeholder: {
                    type: Type.INTEGER,
                    description: "Đây là thuộc tính giữ chỗ. AI nên bỏ qua nó."
                }
            },
            additionalProperties: { type: Type.INTEGER }
        }
    },
    required: ["scene", "choices"]
};

export const combatTurnSchema = {
    type: Type.OBJECT,
    properties: {
        combatLogEntry: { type: Type.STRING, description: "Một đoạn văn tường thuật sống động về diễn biến trong lượt này, bao gồm hành động của người chơi, đồng đội (nếu có) và kẻ thù." },
        updatedPuppet: puppetSchema,
        updatedEnemy: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                stats: {
                    type: Type.OBJECT,
                    properties: {
                        hp: { type: Type.INTEGER },
                        maxHp: { type: Type.INTEGER },
                        attack: { type: Type.INTEGER },
                        defense: { type: Type.INTEGER },
                    }
                }
            },
            required: ["name", "description", "stats"]
        },
        isCombatOver: { type: Type.BOOLEAN, description: "True nếu một trong hai bên bị đánh bại (HP <= 0)." },
        outcome: { type: Type.STRING, description: "Kết quả của trận chiến nếu nó đã kết thúc: 'win', 'loss', hoặc 'ongoing'." },
        essenceGainedOnWin: { type: Type.INTEGER, description: "Lượng 'Tinh Hoa Cơ Khí' người chơi nhận được NẾU họ thắng trận này. Chỉ điền số khi isCombatOver=true và outcome='win'."},
        dauAnDongThauGainedOnWin: { type: Type.INTEGER, description: "Lượng 'Dấu Ấn Đồng Thau' người chơi nhận được NẾU họ thắng trận này. Chỉ điền số khi isCombatOver=true và outcome='win'."},
        explanation: explanationSchema,
        updatedCompanions: { type: Type.ARRAY, items: companionSchema, description: "Trạng thái được cập nhật của các đồng đội sau lượt chiến đấu."},
        mentalShock: { type: Type.STRING, description: "Mô tả cú sốc tinh thần mà người điều khiển phải chịu do Phản Hồi Đồng Cảm. Chỉ bao gồm khi con rối chịu sát thương đáng kể." },
        aberrantEnergyLeak: { type: Type.STRING, description: "Mô tả một ảo giác ngắn do Tà Năng rò rỉ. Chỉ bao gồm khi con rối chịu sát thương CỰC KỲ nghiêm trọng hoặc một đòn chí mạng." }
    },
    required: ["combatLogEntry", "updatedPuppet", "updatedEnemy", "isCombatOver", "outcome"]
};

export const workshopSchema = {
    type: Type.OBJECT,
    properties: {
        scene: { type: Type.STRING, description: "Một đoạn văn mô tả không khí trong xưởng chế tác khi người chơi chuẩn bị nâng cấp con rối. Hãy mô tả âm thanh của các bánh răng, ánh sáng le lói và cảm giác của năng lượng đang được tinh lọc." },
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "Loại nâng cấp: 'skill', 'stat_attack', 'stat_defense', 'stat_hp', hoặc 'purge'." },
                    name: { type: Type.STRING, description: "Tên của kỹ năng hoặc mô tả ngắn về việc tăng chỉ số (ví dụ: 'Cường Hóa Tấn Công')." },
                    description: { type: Type.STRING, description: "Mô tả chi tiết về lựa chọn nâng cấp này." },
                    payload: { ...puppetAbilitySchema, description: "Đối tượng kỹ năng, chỉ tồn tại nếu type là 'skill'." }
                },
                required: ["type", "name", "description"]
            }
        },
        explanation: explanationSchema
    },
    required: ["scene", "options"]
};

export const sequenceNameSchema = {
    type: Type.OBJECT,
    properties: {
        sequenceName: {
            type: Type.STRING,
            description: "Tên Thứ Tự mới được tạo ra."
        }
    },
    required: ["sequenceName"]
};

export const componentInstallSchema = {
    type: Type.OBJECT,
    properties: {
        scene: { type: Type.STRING, description: "Một đoạn văn mô tả quá trình lắp ráp linh kiện và hiệu ứng của nó." },
        updatedPuppet: puppetSchema,
    },
    required: ["scene", "updatedPuppet"]
};
import { GameState } from './types';

const SAVE_KEY = 'ckck-savegame';

export const saveGameState = (state: GameState): boolean => {
    try {
        // Convert Set to Array for JSON serialization
        const serializableState = {
            ...state,
            shownExplanations: Array.from(state.shownExplanations),
        };
        const stateJson = JSON.stringify(serializableState);
        localStorage.setItem(SAVE_KEY, stateJson);
        return true;
    } catch (e) {
        console.error("Lỗi khi lưu game:", e);
        return false;
    }
};

export const loadGameState = (): GameState | null => {
    try {
        const stateJson = localStorage.getItem(SAVE_KEY);
        if (!stateJson) return null;
        
        const loadedState = JSON.parse(stateJson);
        
        // Convert Array back to Set
        loadedState.shownExplanations = new Set(loadedState.shownExplanations);

        return loadedState as GameState;
    } catch (e) {
        console.error("Lỗi khi tải game:", e);
        localStorage.removeItem(SAVE_KEY); // Clear corrupted save
        return null;
    }
};

export const hasSaveGame = (): boolean => {
    try {
        return localStorage.getItem(SAVE_KEY) !== null;
    } catch (e) {
        console.error("Không thể truy cập localStorage để kiểm tra file lưu:", e);
        return false;
    }
};

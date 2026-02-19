import { create } from 'zustand';

interface TaskTimestamp {
  text: string;
  createdAt: number;
}

interface TaskTimestampsStore {
  timestamps: Map<string, number>;
  recordTaskCreation: (text: string) => void;
  checkIfInstantCheck: (text: string) => boolean;
  clearTimestamp: (text: string) => void;
}

export const useTaskTimestamps = create<TaskTimestampsStore>((set, get) => ({
  timestamps: new Map(),
  
  recordTaskCreation: (text: string) => {
    set((state) => {
      const newTimestamps = new Map(state.timestamps);
      newTimestamps.set(text, Date.now());
      return { timestamps: newTimestamps };
    });
  },
  
  checkIfInstantCheck: (text: string) => {
    const timestamp = get().timestamps.get(text);
    if (!timestamp) return false;
    
    const elapsed = Date.now() - timestamp;
    // Check if task was created within last 5 seconds
    return elapsed < 5000;
  },
  
  clearTimestamp: (text: string) => {
    set((state) => {
      const newTimestamps = new Map(state.timestamps);
      newTimestamps.delete(text);
      return { timestamps: newTimestamps };
    });
  },
}));

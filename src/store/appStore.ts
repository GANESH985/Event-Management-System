import { create } from 'zustand';

export interface Profile {
  _id: string;
  name: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLog {
  _id?: string;
  field: string;
  previousValue: unknown;
  newValue: unknown;
  updatedAt: string;
  updatedBy: string;
}

export interface Event {
  _id: string;
  title: string;
  profiles: Profile[];
  timezone: string;
  startDate: string;
  endDate: string;
  updateHistory: UpdateLog[];
  createdAt: string;
  updatedAt: string;
}

interface AppStore {
  profiles: Profile[];
  events: Event[];
  currentProfile: Profile | null;
  selectedProfiles: string[];

  setProfiles: (profiles: Profile[]) => void;
  setEvents: (events: Event[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  setSelectedProfiles: (profiles: string[]) => void;
  addProfile: (profile: Profile) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, event: Event) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  profiles: [],
  events: [],
  currentProfile: null,
  selectedProfiles: [],

  setProfiles: (profiles) => set({ profiles }),
  setEvents: (events) => set({ events }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setSelectedProfiles: (profiles) => set({ selectedProfiles: profiles }),

  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  updateEvent: (eventId, event) =>
    set((state) => ({
      events: state.events.map((e) => (e._id === eventId ? event : e)),
    })),
}));

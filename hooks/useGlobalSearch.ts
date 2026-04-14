import { create } from "zustand";

interface GlobalSearchStore {
	isOpen: boolean;
	query: string;
	setIsOpen: (isOpen: boolean) => void;
	setQuery: (query: string) => void;
	toggle: () => void;
}

export const useGlobalSearch = create<GlobalSearchStore>((set) => ({
	isOpen: false,
	query: "",
	setIsOpen: (isOpen) => set({ isOpen, query: isOpen ? "" : "" }), // Reset query on close
	setQuery: (query) => set({ query }),
	toggle: () => set((state) => ({ isOpen: !state.isOpen, query: "" })),
}));

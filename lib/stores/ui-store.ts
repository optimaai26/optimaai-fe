import { create } from "zustand";

/* ==========================================
 * UI Store – Lightweight client-only state
 * ========================================== */

export type ViewScope = "global" | "department";

interface UiState {
	/** Sidebar collapsed state */
	sidebarCollapsed: boolean;
	toggleSidebar: () => void;
	setSidebarCollapsed: (collapsed: boolean) => void;

	/** Mobile sidebar open */
	mobileSidebarOpen: boolean;
	setMobileSidebarOpen: (open: boolean) => void;

	/** Department vs Global toggle */
	viewScope: ViewScope;
	setViewScope: (scope: ViewScope) => void;

	/** Active modal ID */
	activeModal: string | null;
	openModal: (id: string) => void;
	closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
	// Sidebar
	sidebarCollapsed: false,
	toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
	setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

	// Mobile sidebar
	mobileSidebarOpen: false,
	setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

	// View scope
	viewScope: "global",
	setViewScope: (scope) => set({ viewScope: scope }),

	// Modal
	activeModal: null,
	openModal: (id) => set({ activeModal: id }),
	closeModal: () => set({ activeModal: null }),
}));

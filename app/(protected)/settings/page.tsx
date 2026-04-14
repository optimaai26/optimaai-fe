"use client";

import {
	Bell,
	Database,
	Globe,
	Paintbrush,
	Settings2,
	Shield,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

type Tab = "appearance" | "notifications" | "privacy" | "localization" | "data";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<Tab>("appearance");

	const tabs = [
		{ id: "appearance", label: "Appearance", icon: Paintbrush },
		{ id: "notifications", label: "Notifications", icon: Bell },
		{ id: "privacy", label: "Privacy", icon: Shield },
		{ id: "localization", label: "Localization", icon: Globe },
		{ id: "data", label: "Data & Export", icon: Database },
	] as const;

	return (
		<div className="animate-fade-in max-w-4xl mx-auto mb-10 w-full">
			<PageHeader
				title="Platform Settings"
				description="Configure your OptimaAI platform preferences and default behaviors."
			/>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Settings Navigation Sidebar */}
				<div className="md:col-span-1 space-y-1">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive
										? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								<Icon className="w-4 h-4" /> {tab.label}
							</button>
						);
					})}
				</div>

				{/* Settings Content Area */}
				<div className="md:col-span-3 space-y-6">
					{activeTab === "appearance" && (
						<div className="glass-card rounded-xl p-6 animate-fade-in">
							<h3 className="text-lg font-semibold mb-4">
								Appearance Settings
							</h3>
							<p className="text-sm text-muted-foreground mb-6">
								Customize how OptimaAI looks on your device. Alternatively, use
								the quick-toggle in the top right header.
							</p>

							<div className="space-y-4">
								<div className="flex items-center justify-between py-3 border-b border-border">
									<div>
										<h4 className="font-medium text-sm">Theme Preference</h4>
										<p className="text-xs text-muted-foreground mt-0.5">
											Select your preferred color theme.
										</p>
									</div>
									<select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50">
										<option value="system">System Default</option>
										<option value="light">Light</option>
										<option value="dark">Dark</option>
									</select>
								</div>

								<div className="flex items-center justify-between py-3 border-b border-border">
									<div>
										<h4 className="font-medium text-sm">Dense Interface</h4>
										<p className="text-xs text-muted-foreground mt-0.5">
											Reduce padding slightly to fit more data on screen.
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" className="sr-only peer" />
										<div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
									</label>
								</div>
							</div>

							<div className="flex justify-end mt-6">
								<button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
									Save Preferences
								</button>
							</div>
						</div>
					)}

					{activeTab !== "appearance" && (
						<div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center animate-fade-in border-dashed min-h-[300px]">
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
								<Settings2 className="w-8 h-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
							<p className="text-sm text-muted-foreground max-w-sm mx-auto">
								The {tabs.find((t) => t.id === activeTab)?.label} settings
								module is currently under active development.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

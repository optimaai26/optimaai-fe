import { Key, Mail, Shield, User } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ProfilePage() {
	return (
		<div className="animate-fade-in max-w-4xl mx-auto mb-10 w-full">
			<PageHeader
				title="Your Profile"
				description="Manage your personal information and security preferences."
			/>

			<div className="grid gap-6">
				{/* Personal Info Card */}
				<div className="glass-card rounded-xl p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<User className="w-5 h-5 text-primary-500" />
						Personal Information
					</h3>

					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground block mb-1.5">
									Full Name
								</label>
								<input
									type="text"
									className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
									defaultValue="Optima Demo User"
									disabled
								/>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground block mb-1.5">
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-4 w-4 text-muted-foreground" />
									</div>
									<input
										type="email"
										className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
										defaultValue="user@optima.ai"
										disabled
									/>
								</div>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-muted-foreground block mb-1.5">
								Bio
							</label>
							<textarea
								className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[100px]"
								defaultValue="AI enthusiast and data analyst."
							/>
						</div>

						<div className="flex justify-end mt-2">
							<button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
								Save Changes
							</button>
						</div>
					</div>
				</div>

				{/* Security Card */}
				<div className="glass-card rounded-xl p-6 border-danger/20">
					<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<Shield className="w-5 h-5 text-danger" />
						Security Settings
					</h3>

					<div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
						<div className="flex items-start gap-4">
							<div className="p-2 bg-muted rounded-full mt-0.5">
								<Key className="w-4 h-4 text-muted-foreground" />
							</div>
							<div>
								<h4 className="font-medium text-sm">Password</h4>
								<p className="text-xs text-muted-foreground mt-0.5">
									It's a good idea to use a strong password that you're not
									using elsewhere.
								</p>
							</div>
						</div>
						<button className="border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg text-xs font-medium transition-colors">
							Change
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

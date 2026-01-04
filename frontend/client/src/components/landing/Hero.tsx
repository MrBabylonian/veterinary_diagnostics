// Hero.tsx - Replicates the Hero section from reference HTML, with dark/light theme support
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Hero: React.FC = () => {
	return (
		// Main section: relative positioning for z-index layering, full height, centered flex layout
		// pt-40 pb-20: Top/bottom padding for spacing from navbar/footer
		// min-h-screen: Ensures at least full viewport height
		// flex flex-col items-center justify-center: Vertical stack, centered horizontally/vertically
		<section
			className={cn(
				"relative z-10 pt-40 pb-20 min-h-screen flex flex-col items-center justify-center",
			)}
		>
			{/* Text Content Block: Centered, max width for readability */}
			<div className={cn("text-center max-w-4xl px-6 mb-16")}>
				{/* Badge: Pill shape with animated dot */}
				{/* inline-flex items-center gap-2: Horizontal flex with centered items, 0.5rem gap */}
				{/* px-3 py-1: Padding inside the badge */}
				{/* rounded-full: Fully rounded corners */}
				{/* border border-violet-200 dark:border-cyan/30: Light mode violet border, dark mode cyan with opacity */}
				{/* bg-violet-50 dark:bg-cyan/5: Light background in violet, dark in cyan with low opacity */}
				{/* text-violet-700 dark:text-cyan: Text color switches with theme */}
				{/* text-xs font-mono: Small mono font */}
				{/* mb-6 uppercase tracking-widest: Spacing, uppercase, wide tracking */}
				<div
					className={cn(
						"font-medium inline-flex items-center gap-2 px-3 py-1",
						"rounded-full border border-violet-200 dark:border-cyan/30 bg-violet-50 dark:bg-cyan/5 text-violet-700 dark:text-cyan text-xs font-mono mb-6 uppercase tracking-widest animate-pulse",
					)}
				>
					{/* Animated dot: w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-cyan animate-pulse */}
					{/* animate-pulse: Built-in Tailwind animation for pulsing opacity */}
					<span
						className={cn(
							"w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-cyan",
						)}
					></span>
					v2.0 Neural Engine Live
				</div>

				{/* Heading: Large, responsive text with gradients */}
				{/* text-6xl md:text-7xl: 6xl on small screens, 7xl on medium+ (responsive scaling) */}
				{/* leading-tight: Tight line height for closer lines */}
				{/* mb-6 tracking-tight: Bottom margin, tight letter spacing */}
				<h1
					className={cn(
						"text-6xl md:text-7xl leading-tight mb-6 tracking-tight",
					)}
				>
					{/* Gradient text: text-gradient from globals.css (light: slate gradient; dark: white/slate) */}
					<span className={cn("text-gradient font-bold")}>
						Superhuman Diagnostics
					</span>
					<br />
					{/* Accent gradient: text-gradient-accent (violet to cyan in light; cyan to violet in dark) */}
					<span className={cn("text-gradient-accent font-bold")}>
						for Veterinary Medicine
					</span>
				</h1>

				{/* Paragraph: Descriptive text */}
				{/* text-lg: Large text size */}
				{/* text-slate-500 dark:text-slate-400: Light mode slate-500, dark mode slate-400 */}
				{/* max-w-2xl mx-auto mb-10 leading-relaxed: Max width, auto center, margin, relaxed leading */}
				<p
					className={cn(
						"text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed",
					)}
				>
					Transform raw bloodwork into actionable therapy plans in seconds. The
					first AI designed to see what the human eye might miss.
				</p>

				{/* Buttons Container: Responsive flex */}
				{/* flex flex-col md:flex-row: Stack vertically on small, horizontally on medium+ */}
				{/* items-center justify-center gap-4: Center items, 1rem gap */}
				<div
					className={cn(
						"flex flex-col md:flex-row items-center justify-center gap-4",
					)}
				>
					{/* Primary Button: Gradient background */}
					{/* px-8 py-4: Padding */}
					{/* bg-gradient-to-r from-violet-600 to-cyan-600: Horizontal gradient from violet to cyan */}
					{/* text-white rounded-xl: White text, rounded corners */}
					{/* hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105: Hover shadow/glow and scale */}
					{/* transition duration-300: Smooth 300ms transition */}
					<Button
						className={cn(
							"h-13 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600" +
								" text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition duration-300",
						)}
					>
						Get Early Access
					</Button>

					{/* Secondary Button: Glass effect */}
					{/* px-8 py-4: Padding */}
					{/* bg-white dark:bg-transparent: White in light, transparent in dark */}
					{/* border border-slate-200 dark:border-white/10: Light border, dark subtle white */}
					{/* text-slate-700 dark:text-white: Text color switches */}
					{/* rounded-xl flex items-center gap-2: Rounded, flex with icon gap */}
					{/* hover:bg-slate-50 dark:hover:bg-white/10: Hover background changes */}
					{/* transition: Smooth transition */}
					<Button
						className={cn(
							"h-13 px-8 py-4 bg-white dark:bg-transparent border" +
								" border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-xl flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition",
						)}
					>
						{/* Icon: SVG for play button */}
						<svg
							className={cn("w-5 h-5 text-violet-600 dark:text-cyan")}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Watch Workflow
					</Button>
				</div>
			</div>

			{/* 3D Hero Visual: Perspective container for depth */}
			{/* perspective-container: CSS class from globals.css for 2000px perspective */}
			{/* w-full max-w-5xl px-6 animate-float: Full width, max width, padding, floating animation */}
			<div
				className={cn(
					"perspective-container w-full max-w-5xl px-6 animate-float",
				)}
			>
				{/* Hero Interface: Tilted dashboard */}
				{/* hero-interface: CSS class for 3D transforms, shadows, hover (light/dark variants in globals.css) */}
				{/* relative rounded-2xl overflow-hidden aspect-video: Relative pos, rounded, hidden overflow, 16:9 aspect */}
				{/* bg-slate-300 dark:bg-[#0F172A]: Light background slate-300, dark custom slate */}
				{/* border-slate-400 dark:border-white/10: Border color switches */}
				<div
					className={cn(
						"hero-interface relative rounded-2xl overflow-hidden aspect-video bg-slate-300 dark:bg-[#0F172A] border border-slate-400 dark:border-white/10",
					)}
				>
					{/* Fake Dashboard UI: Absolute full cover */}
					<div className={cn("absolute inset-0 flex")}>
						{/* Sidebar: w-16 border-r border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/50 */}
						<div
							className={cn(
								"w-16 border-r border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/50",
							)}
						></div>

						{/* Content Area: flex-1 p-6 relative bg-slate-100 dark:bg-slate-900 */}
						<div
							className={cn(
								"flex-1 p-6 relative bg-slate-100 dark:bg-slate-900",
							)}
						>
							{/* Header: flex justify-between mb-8 */}
							<div className={cn("flex justify-between mb-8")}>
								<div
									className={cn(
										"w-32 h-4 bg-slate-300 dark:bg-white/10 rounded",
									)}
								></div>
								<div
									className={cn(
										"w-24 h-8 bg-white dark:bg-red-500/20 rounded border border-red-200 dark:border-red-500/50 shadow-sm",
									)}
								></div>
							</div>

							{/* Data Rows: space-y-3 for vertical spacing */}
							<div className={cn("space-y-3")}>
								{/* Row 1: h-12 w-full bg-white dark:bg-white/5 rounded border ... */}
								<div
									className={cn(
										"h-12 w-full bg-white dark:bg-white/5 rounded border border-slate-300 dark:border-white/5 flex items-center px-4 justify-between",
									)}
								>
									<div
										className={cn(
											"w-20 h-2 bg-slate-300 dark:bg-white/20 rounded",
										)}
									></div>
									<div
										className={cn(
											"w-32 h-2 bg-red-400 dark:bg-red-500 rounded shadow-sm dark:shadow-[0_0_10px_red]",
										)}
									></div>
								</div>
								{/* Row 2: Similar, with cyan bars */}
								<div
									className={cn(
										"h-12 w-full bg-white dark:bg-white/5 rounded border border-slate-300 dark:border-white/5 flex items-center px-4 justify-between",
									)}
								>
									<div
										className={cn(
											"w-20 h-2 bg-slate-300 dark:bg-white/20 rounded",
										)}
									></div>
									<div
										className={cn(
											"w-24 h-2 bg-cyan-600 dark:bg-cyan/50 rounded",
										)}
									></div>
								</div>
								{/* Row 3: Similar */}
								<div
									className={cn(
										"h-12 w-full bg-white dark:bg-white/5 rounded border border-slate-300 dark:border-white/5 flex items-center px-4 justify-between",
									)}
								>
									<div
										className={cn(
											"w-20 h-2 bg-slate-300 dark:bg-white/20 rounded",
										)}
									></div>
									<div
										className={cn(
											"w-40 h-2 bg-cyan-600 dark:bg-cyan/50 rounded",
										)}
									></div>
								</div>
							</div>

							{/* Floating Card: absolute top-6 right-6 w-64 h-full ... */}
							{/* bg-white/80 dark:bg-black/60 backdrop-blur-xl: Semi-transparent background with blur */}
							{/* border border-white/60 dark:border-violet-500/40: Border with opacity */}
							{/* rounded-xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]: Custom shadow */}
							<div
								className={cn(
									"absolute top-6 right-6 w-64 h-full bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/60 dark:border-violet-500/40 rounded-xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
								)}
							>
								<div
									className={cn(
										"w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 dark:bg-violet-600 rounded mb-4 shadow-lg dark:shadow-violet-200",
									)}
								></div>
								<div
									className={cn(
										"w-full h-2 bg-slate-300 dark:bg-white/20 rounded mb-2",
									)}
								></div>
								<div
									className={cn(
										"w-2/3 h-2 bg-slate-300 dark:bg-white/20 rounded mb-4",
									)}
								></div>
								{/* Gradient bar: bg-gradient-to-b from-violet-100 dark:from-violet-500/10 to-transparent */}
								<div
									className={cn(
										"w-full h-20 bg-gradient-to-b from-violet-100 dark:from-violet-500/10 to-transparent rounded border border-violet-200 dark:border-violet-500/20",
									)}
								></div>
							</div>
						</div>
					</div>

					{/* Reflection Overlay: absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 dark:via-white/5 to-transparent pointer-events-none mix-blend-overlay */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 dark:via-white/5 to-transparent pointer-events-none mix-blend-overlay",
						)}
					></div>
				</div>
			</div>
		</section>
	);
};

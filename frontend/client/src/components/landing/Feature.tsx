import React from "react";

const features = [
  {
    // Each feature object contains:
    // - title: The heading text
    // - description: The paragraph text (note: includes a <span> for emphasis)
    // - icon: The SVG JSX element (copied from the HTML)
    // - iconBg: Tailwind classes for the icon background, with dark: variants
    // - iconBorder: Border classes with dark: variants
    // - iconColor: Text color classes for the icon with dark: variants
    title: "Instant Analysis",
    description: (
      <>
        Upload PDF reports or connect directly to IDEXX/Antech analyzers. Get
        results in{" "}
        <span className="text-cyan dark:text-cyan font-mono font-bold dark:font-normal">
          seconds
        </span>
        .
      </>
    ),
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    iconBg: "bg-cyan-50 dark:bg-cyan/10",
    iconBorder: "border-cyan-100 dark:border-cyan/20",
    iconColor: "text-cyan dark:text-cyan",
  },
  {
    title: "Predictive AI",
    description:
      "Our model detects patterns in early-stage renal and hepatic failure often missed by standard reference ranges.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    iconBg: "bg-violet-50 dark:bg-violet/10",
    iconBorder: "border-violet-100 dark:border-violet/20",
    iconColor: "text-violet dark:text-violet-400",
  },
  {
    title: "Auto-Treatment Plans",
    description:
      "Don't just diagnose. Generate client-ready therapy protocols and diet recommendations instantly.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    iconBorder: "border-pink-100 dark:border-pink-500/20",
    iconColor: "text-pink-500 dark:text-pink-500",
  },
];

export const Feature: React.FC = () => {
  return (
    // The section wrapper: py-24 adds vertical padding (6rem top/bottom), px-6 horizontal padding.
    // relative z-10 ensures it's above background layers (z-10 is higher than z-0).
    <section className="py-24 px-6 relative z-10">
      {/* Container: max-w-6xl limits width, mx-auto centers it horizontally. */}
      <div className="max-w-6xl mx-auto">
        {/* Grid layout: grid creates a CSS Grid.
            grid-cols-1: 1 column on small screens (default).
            md:grid-cols-3: 3 columns on medium screens and up (768px+).
            gap-6: 1.5rem spacing between grid items.
            This responsive grid stacks cards vertically on mobile, 3 across on desktop. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map over the features array to render each card.
              .map() is a JavaScript array method that transforms each item into JSX.
              (feature, index) provides the feature object and its position (0,1,2).
              key={index} is required by React for list rendering to track changes. */}
          {features.map((feature, index) => (
            // Each card: glass-card applies the frosted glass effect (defined in globals.css).
            // p-8: 2rem padding inside the card.
            // rounded-3xl: Very rounded corners (1.5rem border-radius).
            // group: Enables group-hover for child elements.
            // cursor-default: Prevents cursor change on hover.
            <div
              key={index}
              className="glass-card p-8 rounded-3xl group cursor-default"
            >
              {/* Icon container: w-12 h-12 (3rem x 3rem), rounded-xl (0.75rem corners).
                  flex items-center justify-center: Centers the SVG icon.
                  mb-6: 1.5rem bottom margin.
                  group-hover:scale-110: Scales up to 110% on card hover (thanks to group).
                  transition: Smooth animation for the scale. */}
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 group-hover:scale-110 transition ${feature.iconBg} ${feature.iconBorder} ${feature.iconColor}`}
              >
                {/* Render the icon SVG */}
                {feature.icon}
              </div>
              {/* Title: text-xl (1.25rem), font-bold, text-slate-800 dark:text-white (dark mode white).
                  mb-2: 0.5rem bottom margin.
                  font-sans: Ensures Space Grotesk font. */}
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-sans">
                {feature.title}
              </h3>
              {/* Description: text-slate-500 dark:text-slate-400 (lighter in dark mode).
                  leading-relaxed: Increases line height for readability. */}
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

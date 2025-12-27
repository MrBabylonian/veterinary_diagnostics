import { cn } from "@/lib/utils";

export const Hero = () => {
  return (
    <section
      className={cn(
        "relative z-10 pt-40 pb-20",
        "m-h-screen flex flex-col items-center justify-center",
      )}
    >
      {/* Text Content */}
      <div className={cn("text-center max-w-4xl px-6 mb-16")}>
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1",
            "rounded-full border border-violet dark:border-cyan/30",
            "dark:bg-cyan/5 text-violet-700 dark:text-cyan text-xs font-mono",
            " mb-6 uppercase tracking-widest font-bold animate-pulse",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              "bg-violet-600 dark:bg-cyan ",
            )}
          ></span>
          v2.0 Neural Engine Live
        </div>
      </div>
    </section>
  );
};

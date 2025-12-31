import { Feature } from "./Feature";
import { Hero } from "./Hero";
import { Navbar } from "./Navbar";

const LandingPage = () => {
  return (
    <>
      {/* Background Layers */}
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none dark:hidden" />
      <div className="fixed inset-0 aurora-bg z-0 pointer-events-none dark:hidden" />
      <div className="hidden dark:block fixed inset-0 cyber-grid z-0 pointer-events-none" />
      <div className="hidden dark:block fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <Navbar />
      <Hero />
      <Feature />

      <footer className="border-t border-slate-200 dark:border-white/5 py-12 text-center text-slate-400 dark:text-slate-600 text-sm bg-slate-50 dark:bg-transparent">
        <p>&copy; 2025 VetAI Diagnostics. Engineered for the future of care.</p>
      </footer>
    </>
  );
};

export default LandingPage;

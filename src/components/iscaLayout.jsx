import { Outlet } from "react-router";
import TopBar from "./common/TopBar/topBar";
import LightRays from "./common/LightRays/LightRays";
import ThemeToggle from "./common/ThemeToggle/themeToggle";
import { useTheme } from "../theme/useTheme";
import Footer from "./common/Footer/footer";

const IscaLayout = () => {
  const { theme } = useTheme();
  console.log(theme);
  return (
    <main className="relative min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-[#0a0f0c] dark:text-stone-100">
      <div className="fixed inset-0 z-0 opacity-30 dark:opacity-100">
        <LightRays
          raysOrigin="top-center"
          raysColor={theme === "dark" ? "#2fa37a" : "#10b981"}
          raysSpeed={1.5}
          lightSpread={0.6}
          rayLength={2.2}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.2}
          distortion={0.02}
          className="custom-rays"
        />
      </div>
      <section className="relative z-10 grow *:px-6">
        <TopBar />
        <div className="relative z-10">
          <Outlet />
        </div>
        <Footer />
      </section>
      <ThemeToggle />
    </main>
  );
};

export default IscaLayout;

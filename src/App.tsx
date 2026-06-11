import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import { ROUTE_LOADING_MS } from "./config";

// Route-level code splitting: each page is its own chunk, so the
// loading screen reflects a *real* async load rather than a faked delay.
const Welcome = lazy(() => import("./pages/Welcome"));
const Home = lazy(() => import("./pages/Home"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const About = lazy(() => import("./pages/About"));
const Learn = lazy(() => import("./pages/Learn"));
const LearnAITools = lazy(() => import("./pages/LearnAITools"));
const LearnPrompting = lazy(() => import("./pages/LearnPrompting"));
const LearnHowModelsWork = lazy(() => import("./pages/LearnHowModelsWork"));
const LearnPromptingPatterns = lazy(() => import("./pages/LearnPromptingPatterns"));
const LearnLimitations = lazy(() => import("./pages/LearnLimitations"));
const LearnEthicsPrivacy = lazy(() => import("./pages/LearnEthicsPrivacy"));
const LearnChoosingTools = lazy(() => import("./pages/LearnChoosingTools"));
const LearnStayingCurrent = lazy(() => import("./pages/LearnStayingCurrent"));
const Compare = lazy(() => import("./pages/Compare"));

/** Friendly messages for the per-page loading screen. */
const loadingMessages: Record<string, string> = {
  "/": "Warming up the pencils",
  "/home": "Sorting the shelves",
  "/about": "Flipping the page",
  "/learn": "Sharpening the basics",
  "/learn/ai-tools": "Explaining the magic",
  "/learn/prompting": "Lining up the words",
  "/learn/how-models-work": "Counting the tokens",
  "/learn/prompting-patterns": "Mixing the patterns",
  "/learn/limitations": "Fact-checking the robot",
  "/learn/ethics-privacy": "Weighing the ethics",
  "/learn/choosing-tools": "Sizing up the options",
  "/learn/staying-current": "Chasing the frontier",
  "/compare": "Lining up the contenders",
};

function loadingMessageFor(path: string): string {
  if (/^\/category\/[^/]+\/[^/]+/.test(path)) return "Opening the tool";
  if (path.startsWith("/category")) return "Gathering the tools";
  return loadingMessages[path] ?? "Loading";
}

/** Wrap a page in the shared layout + a Suspense fallback. */
function page(node: ReactNode, message: string) {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen message={message} />}>{node}</Suspense>
    </Layout>
  );
}

export default function App() {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(ROUTE_LOADING_MS > 0);

  // Optional demo-mode loading screen on every route change.
  useEffect(() => {
    if (ROUTE_LOADING_MS === 0) {
      setTransitioning(false);
      return;
    }
    setTransitioning(true);
    const timer = window.setTimeout(() => setTransitioning(false), ROUTE_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const message = loadingMessageFor(location.pathname);

  if (transitioning) {
    return <LoadingScreen message={message} />;
  }

  return (
    <Suspense fallback={<LoadingScreen message={message} />}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingScreen message={message} />}>
              <Welcome />
            </Suspense>
          }
        />
        <Route path="/home" element={page(<Home />, "Sorting the shelves")} />
        <Route
          path="/category/:id"
          element={page(<CategoryPage />, "Gathering the tools")}
        />
        <Route
          path="/category/:id/:toolSlug"
          element={page(<ToolPage />, "Opening the tool")}
        />
        <Route path="/learn" element={page(<Learn />, "Sharpening the basics")} />
        <Route
          path="/learn/ai-tools"
          element={page(<LearnAITools />, "Explaining the magic")}
        />
        <Route
          path="/learn/prompting"
          element={page(<LearnPrompting />, "Lining up the words")}
        />
        <Route
          path="/learn/how-models-work"
          element={page(<LearnHowModelsWork />, "Counting the tokens")}
        />
        <Route
          path="/learn/prompting-patterns"
          element={page(<LearnPromptingPatterns />, "Mixing the patterns")}
        />
        <Route
          path="/learn/limitations"
          element={page(<LearnLimitations />, "Fact-checking the robot")}
        />
        <Route
          path="/learn/ethics-privacy"
          element={page(<LearnEthicsPrivacy />, "Weighing the ethics")}
        />
        <Route
          path="/learn/choosing-tools"
          element={page(<LearnChoosingTools />, "Sizing up the options")}
        />
        <Route
          path="/learn/staying-current"
          element={page(<LearnStayingCurrent />, "Chasing the frontier")}
        />
        <Route
          path="/compare"
          element={page(<Compare />, "Lining up the contenders")}
        />
        <Route path="/about" element={page(<About />, "Flipping the page")} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

import { RouterProvider, ScrollRestoration } from "react-router";
import router from "./routes";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router}>
        <ScrollRestoration />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;

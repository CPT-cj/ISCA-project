import { createBrowserRouter } from "react-router";
import IscaLayout from "./components/iscaLayout";
import Home from "./pages/Home/home";
import Doc from "./pages/doc/doc";
import Index from "./pages/index/index";
import Term from "./pages/term/term";
import Domain from "./pages/domain/domain";
import TermDetail from "./pages/termDetail/termDetail";
import DocDetail from "./pages/doc/docDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IscaLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "doc", element: <Doc /> },
      { path: "index", element: <Index /> },
      { path: "term", element: <Term />, children: [] },
      { path: "domain/:id", element: <Domain /> },
      { path: "search", element: <Domain /> },
      { path: "term/:id", element: <TermDetail /> },
      { path: "doc/:id", element: <DocDetail /> },
    ],
  },
]);

export default router;

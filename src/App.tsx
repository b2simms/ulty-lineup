import { Routes, Route, Outlet, Link } from "react-router-dom";
import PlayerRoster from "./PlayerRoster";
import PlayerLineup from "./PlayerLineup";
import Advanced from "./Advanced";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="" element={<PlayerLineup />} />
            <Route path="roster" element={<PlayerRoster />} />
            <Route path="advanced" element={<Advanced />} />

            {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <h1>404 Page Not Found</h1>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

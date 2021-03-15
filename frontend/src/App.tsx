import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProvideAuth from "./components/auth/ProvideAuth";
import { Signin } from "./components/screens/Signin";
import { routes } from "./routes";

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <PrivateRoute path={routes.APP}>
            MAIN APP
          </PrivateRoute>
          <Route path={routes.SIGININ}>
            <main className="light">
              <Signin />
            </main>
          </Route>
          <Route path={routes.ROOT}>
            <Redirect to={routes.APP} />
          </Route>
          {/* catch-all route */}
          <Route path='*' >
            404 not found
          </Route>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;

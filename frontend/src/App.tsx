import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProvideAuth from "./components/auth/ProvideAuth";
import { Navbar, NavItem } from "./components/nav";
import { ProvideConfigs } from "./components/piConfig";
import { Configs } from "./components/screens/Configs";
import { Device } from "./components/screens/Device";
import { AddConfig } from "./components/screens/AddConfig";
import { Signin } from "./components/screens/Signin";
import { routes } from "./routes";


import { ReactComponent as ListIcon } from './assets/icons/list.svg'
import { ReactComponent as AddIcon } from './assets/icons/add.svg'
import { ReactComponent as TimeIcon } from './assets/icons/time.svg'

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <PrivateRoute path={routes.APP}>
            <ProvideConfigs>
              <div className="light">
                <Navbar>
                  <NavItem path={routes.NEW_CONFIG} Icon={<AddIcon />} />
                  <NavItem path={routes.CONFIGS} Icon={<ListIcon />} />
                  <NavItem path={routes.DEVICE} Icon={<TimeIcon />} />
                </Navbar>
                <main>
                  <Switch>
                    <Route path={routes.NEW_CONFIG}>
                      <AddConfig />
                    </Route>
                    <Route path={routes.CONFIGS}>
                      <Configs />
                    </Route>
                    <Route path={routes.DEVICE}>
                      <Device />
                    </Route>
                    <Route path={routes.APP} exact>
                      <Redirect to={routes.CONFIGS}></Redirect>
                    </Route>
                    <Route path="*">
                      404 Not Found
                    </Route>
                  </Switch>
                </main>
              </div>
            </ProvideConfigs>
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

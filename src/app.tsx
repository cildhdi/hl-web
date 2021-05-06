import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { IndexPage } from './components';
import { RoutePath } from './config/route-path';

export function App() {
  return (
    <Router>
      <Switch>
        <Route path={RoutePath.index}>
          <IndexPage />
        </Route>
      </Switch>
    </Router>
  );
}

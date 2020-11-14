import React from 'react';

import { Switch, Route } from 'react-router-dom';

import About from './components/about/About';
import Main from './components/main/Main';
import HowTo from './components/howTo/HowTo';

export default function Routes() {
  return (
    <div>
      <Switch>
        <Route path="/About">
          <About />
        </Route>

        <Route path="/HowTo">
          <HowTo />
        </Route>

        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </div>
  );
}

import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Registration from './pages/Registration';
import Home from './pages/Home'
import Authorization from "./pages/Authorization";
import Topology from './pages/Topology';
import Main from './pages/Main';
import ClientTopology from './pages/ClientTopology';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/registration' component={Registration} />
                <Route path='/' exact component={Home} />
                <Route path='/authorization' component={Authorization}/>
                <Route path='/topology' component={Topology}/>
                <Route path='/main' exact component={Main}/>
                <Route path='/client_topology' component={ClientTopology}/>
                <Route path='/admin' component={Admin}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    );
}

export default App;

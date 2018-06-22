import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Survey from './components/Survey';
import Report from './components/Search/Report/Main';
import Submit from './components/Submit/Main';
import Incidents from './components/Search/Incidents';
import MapContainer from './components/Map/MapContainer';
import Home from './components/Home';
import { Login } from './components/Account/Login';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Map' component={ MapContainer } />
    <Route path='/Submit' component={ Submit } />
    <Route path='/Report' component={ Report } />
    <Route path='/Incidents' component={ Incidents } />
    <Route path='/Survey' component={ Survey } />
    <Route path='/Account/Login' component={ Login } />
</Layout>;

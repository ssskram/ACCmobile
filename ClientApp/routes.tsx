import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Survey from './components/Survey';
import Report from './components/Search/Report/Main';
import Submit from './components/Submit/Main';
import Incidents from './components/Search/Incidents';
import MapContainer from './components/Map/MapContainer';
import Home from './components/Home';
import NotFound from './components/NotFound';

export const routes = <Layout>
    <Route exact path='/NotFound' component={ NotFound } />
    <Route exact path='/' component={ Home } />
    <Route path='/Map' component={ MapContainer } />
    <Route path='/Submit' component={ Submit } />
    <Route path="/Report/id=:id" component={ Report }/>
    <Route path='/Incidents' component={ Incidents } />
    <Route path='/Survey' component={ Survey } />
</Layout>;

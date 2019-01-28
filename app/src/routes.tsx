import * as React from 'react'
import { Route } from 'react-router'
import Layout from './components/layout'
import Home from './components/home'
import Report from './components/report'
import Submit from './components/submit'

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path="/Report/id=:id" component={Report} />
    <Route path="/Submit" component={Submit}/>
  </Layout>
)
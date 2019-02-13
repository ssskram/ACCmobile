import * as React from 'react'
import { Route } from 'react-router'
import Layout from './components/layout'
import Home from './components/home'
import Report from './components/report'
import Submit from './components/submitIncident'
import DocumentTitle from 'react-document-title'
import ErrorPage from './components/utilities/errorPage'

export default () => (
  <DocumentTitle title='ACC Mobile'>
    <Layout>
      <Route exact path='/' component={Home} />
      <Route path="/Report/id=:id" component={Report} />
      <Route path="/Submit" component={Submit} />
      <Route path="/Error" component={ErrorPage} />
    </Layout>
  </DocumentTitle>
)
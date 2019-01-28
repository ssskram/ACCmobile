import * as React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, Navbar } from 'react-bootstrap'
import AccountContainer from './accountContainer'

const btnStyle = {
  fontSize: '18px',
  padding: '3px 15px',
  margin: '8px 10px'
}

export default class NavMenu extends React.Component<any, any> {

  public render() {
    return (
      <Navbar
        inverse
        fixedTop
        fluid
        collapseOnSelect
        style={{ zIndex: 1000 as any }}
      >
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>PGH Certs</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className='text-xs-center'>
          <AccountContainer />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, Navbar } from 'react-bootstrap'
import AccountContainer from './accountContainer'
import * as style from './constants'

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
            <Link to={'/'}>ACC Mobile</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className='text-xs-center'>
          <Nav>
            <NavItem><Link to={'/Submit'} className='btn btn-success' style={style.btnStyle}>New Incident</Link></NavItem>
          </Nav>
          <AccountContainer />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
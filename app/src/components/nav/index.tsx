import * as React from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavItem, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
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
            <LinkContainer to={'/Submit'}>
              <NavItem><button className='btn btn-success' style={style.btnStyle}>New Incident</button></NavItem>
            </LinkContainer>
          </Nav>
          <AccountContainer />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
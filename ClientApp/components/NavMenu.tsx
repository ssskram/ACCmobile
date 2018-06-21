import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as User from '../store/user';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

export class NavMenu extends React.Component<any, any>  {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
        }
    }

    componentDidMount() {
        // load user
        this.props.requestUser()
    }

    componentWillReceiveProps(props) {
        let self = this;
        self.setState({ user: props.user })
    }

    public render() {
        const { user } = this.state

        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'} data-toggle="collapse" data-target=".in">acc <strong>mobile</strong></Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li className="sidenav-header"><span className='glyphicon glyphicon-search'></span>Search</li>
                        <li>
                            <NavLink to={'/Incidents'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                All incidents
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Incidents'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                Open incidents
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Incidents'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                My incidents
                            </NavLink>
                        </li>
                        <li className="sidenav-header"><span className='glyphicon glyphicon-plus'></span>Submit</li>
                        <li>
                            <NavLink to={'/Submit'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                New incident
                            </NavLink>
                        </li>
                        <div className='accountcontainer'>
                            <li className="account">{user}</li>
                            <li className='logout'>
                                <NavLink to={'/Account/Login'} activeClassName='active' id="logout" className='btn btn-link navbar-logout-btn navbar-link'>
                                    <span className='glyphicon glyphicon-user'></span>Logout
                                </NavLink>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) =>
        state.user,
    User.actionCreators
)(NavMenu as any) as typeof NavMenu;


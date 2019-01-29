import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as style from './constants'
import * as types from './../../store/types'
import * as user from '../../store/user'

type props = {
    user: types.user,
    loadUser: () => void
}

export class AccountContainer extends React.Component<props, {}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadUser()
    }
    
    render() {
        const {
            user
        } = this.props

        return (
            <div style={style.accountContainer} className="navbar-right">
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        {user &&
                            <span style={style.whiteFont}><b><span className='glyphicon glyphicon-user nav-glyphicon'></span>{user.name}</b></span>
                        }
                        <button onClick={() => window.location.href = "/logout"} type="submit" className="btn btn-link navbar-logout-btn">Logout</button>
                    </li>

                </ul>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user
    }),
    ({
        ...user.actionCreators
    })
)(AccountContainer as any)
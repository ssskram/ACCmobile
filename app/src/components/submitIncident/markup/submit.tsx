import * as React from 'react'
import Spinner from '../../utilities/spinner'

type props = {
    saveObject: string
    isEnabled: boolean
    fireSubmit: () => void
}

type state = {
    spinner: boolean
}

export default class Submit extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            spinner: false
        }
    }

    submit() {
        this.setState({
            spinner: true
        })
        this.props.fireSubmit()
    }

    render() {
        const spinnerNotice = "...saving " + this.props.saveObject + "..."
        return (
            <div className='col-md-12 text-center' style={{ marginBottom: '25px' }}>
                <button disabled={!this.props.isEnabled} onClick={this.submit.bind(this)} className="btn btn-success">Save & Continue</button>
                {this.state.spinner &&
                    <Spinner notice={spinnerNotice} />
                }
            </div>
        )
    }
}
import * as React from 'react'

type props = {
    isEnabled: boolean
    fireSubmit: () => void
}

export default class Submit extends React.Component<props, {}> {

    render() {
        return (
            <div className='col-md-12 text-center' style={{ marginBottom: '25px' }}>
                <button disabled={!this.props.isEnabled} onClick={() => this.props.fireSubmit()} className="btn btn-success">Save</button>
            </div>
        )
    }
}
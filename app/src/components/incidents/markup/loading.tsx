import * as React from 'react'
import Spinner from '../../utilities/spinner'
const accIcon = require('../../../images/acclogo.png')

type props = {
    notice: string
}

export default class loading extends React.Component<props, {}> {

    public render() {

        return (
            <div>
                <Spinner notice={this.props.notice} />
                <div>
                    <img
                        src={accIcon as string}
                        style={{ marginTop: '75px', opacity: .4 }}
                        className="img-responsive center-block"
                    />
                </div>
            </div>
        )
    }
}
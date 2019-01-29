import * as React from 'react'
import * as style from '../constants'
import Spinner from '../../utilities/spinner'
const accIcon = require('../../../images/acclogo.png')

export default class loading extends React.Component<{}, {}> {

    public render() {

        return (
            <div>
                <Spinner notice='...loading incidents...' />
                <div>
                    <img
                        src={accIcon as string}
                        style={style.marginTop}
                        className="img-responsive center-block"
                    />
                </div>
            </div>
        )
    }
}
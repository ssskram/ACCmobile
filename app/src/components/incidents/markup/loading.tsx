import * as React from 'react'
import * as style from '../style'
import Spinner from '../../utilities/spinner'
const accIcon = require('../../images/acclogo.png')

export default class loading extends React.Component<any, any> {

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
import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import Map from './Map'

export class MapContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        const { coords } = this.props
        return (
            <div className='map-container'>
                <Map coords={coords} />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(MapContainer as any) as typeof MapContainer;
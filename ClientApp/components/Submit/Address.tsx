import * as React from 'react';
import Map from '../Map/MapContainer'

export default class Address extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    public render() {
        return (
            <div>
                <Map />
            </div>
        );
    }
}
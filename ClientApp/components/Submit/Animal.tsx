import * as React from 'react';

export default class Animal extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    public render() {
        return (
            <div>
                <div className="panel">
                    <div className="panel-body text-center">
                        Animal form here
                    </div>
                </div>
            </div>
        );
    }
}
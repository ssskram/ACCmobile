import * as React from 'react';

export default class Home extends React.Component<any, any> {


    componentWillUnmount() {
        this.props.clear()
    }

    public render() {
        return <div className="home-container">
            <img src='./images/acclogo.png' className="img-responsive center-block home-image" />
            <div className='text-center'>
                <hr />
            </div>
            <div className='row'>
                <div className='col-md-12 text-center'>
                    <h2>Uh oh!</h2>
                    <h2>I can't seem to find that incident</h2>
                    <h2>It was probably just deleted</h2>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
        </div>;
    }
}
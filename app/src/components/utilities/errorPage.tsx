import * as React from 'react'
import { Cat } from 'react-kawaii'

export default class Error extends React.Component<any, any> {

    public render() {
        return (
            <div className='text-center' style={{ marginTop: '50px' }}>
                <Cat size={300} mood="shocked" color="#AED3E5" />
                <h1>Uh oh!</h1>
                <h1>That didn't work.</h1>
                <h3>Please log out, log back in, and try again.</h3>
                <h3>If this problem persists, please contact the system administrator.</h3>
            </div>

        )
    }
}


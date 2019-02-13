import * as React from 'react'

export default class Error extends React.Component<any, any> {

    public render() {
        return (
            <div className='text-center'>
                <h1>Uh oh!</h1>
                <h3>That didn't work.  Please log out, log back in, and try again.</h3>
                <h3>If this problem persists, please contact the system administrator.</h3>
            </div>

        )
    }
}


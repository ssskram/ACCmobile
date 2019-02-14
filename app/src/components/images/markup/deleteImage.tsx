import * as React from 'react'

export default class DeleteImage extends React.Component<any, any> {

    componentDidMount() {
        console.log(this.props)
    }

    render() {
        return (
            <div>
                <button className='btn btn-danger' style={{ marginTop: '-5px' }}>Delete image</button>
            </div>
        )
    }
}
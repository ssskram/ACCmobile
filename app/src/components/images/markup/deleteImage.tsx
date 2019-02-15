import * as React from 'react'
import deleteImage from '../functions/deleteImage'
import Spinner from '../../utilities/spinner'

export default class DeleteImage extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            spinner: false
        }
    }

    delete() {
        this.setState ({
            spinner: true
        })
        deleteImage(this.props.image)
    }
    render() {
        return (
            <div>
                <button className='btn btn-danger' style={{ marginTop: '-5px' }} onClick={this.delete.bind(this)}>Delete image</button>
                {this.state.spinner &&
                    <Spinner notice= '...deleting image...'/>
                }
            </div>
        )
    }
}
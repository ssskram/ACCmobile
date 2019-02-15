import * as React from 'react'
import deleteAnimal from '../functions/deleteAnimal'
import Spinner from '../../utilities/spinner'

export default class DA extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            spinner: false
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    delete() {
        this.setState({
            spinner: true
        })
        deleteAnimal(this.props.animal)
    }

    render() {
        return (
            <div className='row'>
                <div className='col-md-12 text-center'>
                    <br />
                    <h3>Are you sure you want to delete this animal?</h3>
                    <button className='btn btn-danger' onClick={this.delete.bind(this)}>Delete</button>
                </div>
                {this.state.spinner &&
                    <Spinner notice='...deleting animal...' />
                }
            </div>
        )
    }
}


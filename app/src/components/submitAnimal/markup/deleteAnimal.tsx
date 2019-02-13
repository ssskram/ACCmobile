import * as React from 'react'
import deleteAnimal from '../functions/deleteAnimal'

export default class selectMap extends React.Component<any, any> {

    render() {
        return (
            <div className='row'>
                <div className='col-md-12 text-center'>
                    <br />
                    <h3>Are you sure you want to delete this {this.props.animalType}?</h3>
                    <button className='btn btn-danger' onClick={() => deleteAnimal(this.props.animal)}>Delete {this.props.animalType}</button>
                </div>
            </div>
        )
    }
}


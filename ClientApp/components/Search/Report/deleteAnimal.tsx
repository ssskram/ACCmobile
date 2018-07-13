import * as React from 'react';

export default class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    deleteAnimal () {
        this.props.throwSpinner()
        fetch('/api/animals/deleteAnimal', {
            method: 'POST',
            body: this.props.animal.itemID,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                location.reload()
            })
    }

    render() {
        const {
            animalType
        } = this.props.animal

        return (
            <div>
                <div className='row'>
                    <div className='col-md-12 text-center'>
                        <br />
                        <h3>Are you sure you want to delete this {animalType}?</h3>
                        <button className='btn btn-default' onClick={this.deleteAnimal.bind(this)}>Delete {animalType}</button>
                    </div>
                </div>
            </div>
        );
    }
}


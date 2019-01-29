import * as React from 'react'

export default class selectMap extends React.Component<any, any> {

    deleteAnimal () {
        this.props.throwSpinner()
        fetch('https://365proxy.azurewebsites.us/accmobile/deleteAnimal?itemId=' + this.props.animal.itemId, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            })
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
                        <button className='btn btn-primary' onClick={this.deleteAnimal.bind(this)}>Delete {animalType}</button>
                    </div>
                </div>
            </div>
        )
    }
}


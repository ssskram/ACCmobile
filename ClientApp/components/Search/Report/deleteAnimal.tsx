import * as React from 'react';

export default class selectMap extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    
    deleteAnimal () {
        // fetch to delete animal here
        location.reload();
    }

    render() {
        const {
            animalType
        } = this.props.animal
        return (
            <div>
                <div className='row'>
                    <div className='col-md-12 text-center'>
                        <br/>
                        <h3>Are you sure you want to delete this {animalType}?</h3>
                        <button className='btn btn-default' onClick={this.deleteAnimal}>Delete {animalType}</button>
                    </div>
                </div>
            </div>
        );
    }
}


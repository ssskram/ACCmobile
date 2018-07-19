import * as React from 'react';
import UpdateAnimal from '../../Submit/Animal'
import Modal from 'react-responsive-modal';
import DeleteAnimal from './deleteAnimal'
import Moment from 'react-moment'

const deleteButton = {
    color: 'red'
}

export default class Animals extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            deleteAnimal: false,
            addAnimal: false,
            animalToUpdate: {}
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            deleteAnimal: false,
            addAnimal: false,
            animalToUpdate: {}
        });
    }

    editAnimal(animal) {
        this.setState({
            modalIsOpen: true,
            animalToUpdate: animal
        })
    }

    deleteAnimal(animal) {
        this.setState({
            deleteAnimal: true,
            modalIsOpen: true,
            animalToUpdate: animal
        });
    }

    addAnimal() {
        this.setState({
            addAnimal: true,
            modalIsOpen: true
        });
    }

    public render() {
        const {
            modalIsOpen,
            deleteAnimal,
            addAnimal,
            animalToUpdate
        } = this.state

        return (
            <div>
                {this.props.animals == '' &&
                    <div className='text-center'>
                        <br />
                        <h3>No animals on this incident</h3>
                        <br />
                    </div>
                }
                {this.props.animals.map(animal =>
                    <div className='col-md-4' key={animal.itemID}>
                        <div className="facility">
                            <div className="panel">
                                <div className="panel-body text-center">
                                    <div className='col-md-12'>
                                        <div className='row text-center'>
                                            {animal.animalName == null &&
                                                <h3>{animal.animalType}</h3>
                                            }
                                            {animal.animalName != null &&
                                                <h3>{animal.animalType} named {animal.animalName}</h3>
                                            }
                                        </div>
                                        {animal.animalAge != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Age:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.animalAge}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.animalBreed != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Breed:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.animalBreed}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.animalCoat != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Coat:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.animalCoat}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.animalSex != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Sex:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.animalSex}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.licenseNo != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>License number:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.licenseNo}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.licenseYear != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>License year:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.licenseYear}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.rabbiesVacNo != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Rabies vacination number:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.rabbiesVacNo}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.rabbiesVacExp != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Rabies vacination expiration:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><Moment format="MM/DD/YYYY" date={animal.rabbiesVacExp} /></h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.vet != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Veterinarian:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.vet}</h5>
                                                </div>
                                            </div>
                                        }
                                        {animal.comments != null &&
                                            <div className='row text-center'>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5><strong>Comments:</strong></h5>
                                                </div>
                                                <div className='col-md-6 col-sm-12 text-center'>
                                                    <h5>{animal.comments}</h5>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className='col-md-12 text-center'>
                                        <button className='btn btn-link' onClick={() => this.editAnimal(animal)}>Edit</button>
                                        <button style={deleteButton} className='btn btn-link' onClick={() => this.deleteAnimal(animal)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='col-md-12 text-center'>
                    <button className='btn btn-default' onClick={this.addAnimal.bind(this)}>Add an animal</button>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    closeOnEsc={false}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {/* update animal */}
                    {deleteAnimal == false && addAnimal == false &&
                        <div>
                            <h3 className='text-center'>Edit animal</h3>
                            <UpdateAnimal
                                throwSpinner={this.props.throwSpinner.bind(this)}
                                incidentID={this.props.incidentID}
                                address={this.props.address}
                                coords={this.props.coords}
                                animal={animalToUpdate}
                                put={true} />
                        </div>
                    }
                    {/* add animal */}
                    {deleteAnimal == false && addAnimal == true &&
                        <div>
                            <h3 className='text-center'>Add animal</h3>
                            <UpdateAnimal
                                throwSpinner={this.props.throwSpinner.bind(this)}
                                incidentID={this.props.incidentID}
                                address={this.props.address}
                                coords={this.props.coords}
                                animal={animalToUpdate}
                                add={true} />
                        </div>
                    }
                    {/* delete animal */}
                    {deleteAnimal == true &&
                        <DeleteAnimal throwSpinner={this.props.throwSpinner.bind(this)} animal={animalToUpdate} />
                    }
                </Modal>
            </div>
        );
    }
}
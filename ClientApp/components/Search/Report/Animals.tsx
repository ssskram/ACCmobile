import * as React from 'react';
import UpdateAnimal from '../../Submit/Animal'
import Modal from 'react-responsive-modal';
import DeleteAnimal from './deleteAnimal'

const deleteButton = {
    color: 'red'
}

export default class Animals extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            deleteAnimal: true,
            animalToUpdate: {}
        }
    }

    editAnimal(animal) {
        this.setState({
            deleteAnimal: false,
            modalIsOpen: true,
            animalToUpdate: animal
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            animalToUpdate: {}
        });
    }

    deleteAnimal(animal) {
        this.setState({
            deleteAnimal: true,
            modalIsOpen: true,
            animalToUpdate: animal
        });
    }

    public render() {
        const {
            modalIsOpen,
            deleteAnimal,
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
                    <div className="container-fluid" key={animal.itemID}>
                        <div className='col-md-4'>
                            <div className="facility">
                                <div className="panel">
                                    <div className="panel-body text-center">
                                        <div className='col-md-12'>
                                            <div className='row text-center'>
                                                {animal.animalName == null &&
                                                    <h3>{animal.animalType}</h3>
                                                }
                                                {animal.animalName != null &&
                                                    <h3>{animal.animalType} name {animal.animalName}</h3>
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
                                                        <h5><strong>Rabbies vacination number:</strong></h5>
                                                    </div>
                                                    <div className='col-md-6 col-sm-12 text-center'>
                                                        <h5>{animal.rabbiesVacNo}</h5>
                                                    </div>
                                                </div>
                                            }
                                            {animal.rabbiesVacExp != null &&
                                                <div className='row text-center'>
                                                    <div className='col-md-6 col-sm-12 text-center'>
                                                        <h5><strong>Rabbies vacination expiration:</strong></h5>
                                                    </div>
                                                    <div className='col-md-6 col-sm-12 text-center'>
                                                        <h5>{animal.rabbiesVacExp}</h5>
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
                    </div>
                )}
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {deleteAnimal == false &&
                        <UpdateAnimal animal={animalToUpdate} put={true} />
                    }
                    {deleteAnimal == true &&
                        <DeleteAnimal animal={animalToUpdate} />
                    }

                </Modal>
            </div>
        );
    }
}
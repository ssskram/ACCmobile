import * as React from 'react'
import * as style from '../constants'
import Moment from 'react-moment'

type props = {
    animal: any
    editAnimal: (animalObj: object) => void
    deleteAnimal: (animalObj: object) => void
}

export default class AnimalCard extends React.Component<props, {}> {
    render() {
        const {
            animal
        } = this.props
        return (
            <div className='col-md-4' key={animal.itemID}>
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
                            <button className='btn btn-link' onClick={() => this.props.editAnimal(animal)}>Edit</button>
                            <button style={style.red} className='btn btn-link' onClick={() => this.props.deleteAnimal(animal)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
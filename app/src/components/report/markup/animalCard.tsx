import * as React from 'react'
import * as style from '../constants'
import Moment from 'react-moment'

type props = {
    index: number
    animal: any
    editAnimal: (animalObj: object) => void
    deleteAnimal: (animalObj: object) => void
}

export default class AnimalCard extends React.Component<props, {}> {
    render() {
        const {
            animal,
            index
        } = this.props

        const clearfix = index & 1 && index != 0
        return (
            <div key={index}>
                <div className='col-sm-6'>
                    <div className="panel">
                        <div className="panel-body text-center">
                            <div className='col-md-12'>
                                <div className='row text-center'>
                                    {animal.animalName == null &&
                                        <h4>{animal.animalType}</h4>
                                    }
                                    {animal.animalName != null &&
                                        <h4>{animal.animalType} named {animal.animalName}</h4>
                                    }
                                </div>
                                {animal.animalAge != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Age:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalAge}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalBreed != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Breed:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalBreed}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalCoat != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Coat:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalCoat}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalSex != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Sex:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalSex}</div>
                                        </div>
                                    </div>
                                }
                                {animal.licenseNo != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>License number:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.licenseNo}</div>
                                        </div>
                                    </div>
                                }
                                {animal.licenseYear != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>License year:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.licenseYear}</div>
                                        </div>
                                    </div>
                                }
                                {animal.rabbiesVacNo != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Rabies vacination number:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.rabbiesVacNo}</div>
                                        </div>
                                    </div>
                                }
                                {animal.rabbiesVacExp != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Rabies vacination expiration:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><Moment format="MM/DD/YYYY" date={animal.rabbiesVacExp} /></div>
                                        </div>
                                    </div>
                                }
                                {animal.vet != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Veterinarian:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.vet}</div>
                                        </div>
                                    </div>
                                }
                                {animal.comments != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><strong>Comments:</strong></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.comments}</div>
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
                {clearfix == true &&
                    <div className="clearfix"></div>
                }
            </div>
        )
    }
}
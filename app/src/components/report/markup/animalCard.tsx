import * as React from 'react'
import * as style from '../constants'

const dog = require('../../../images/dog.png')
const cat = require('../../../images/cat.png')
const other = require('../../../images/other.png')

type props = {
    index: number
    animal: any
    editAnimal: (animalObj: object) => void
    deleteAnimal: (animalObj: object) => void
}

const padding = {
    padding: '5px 0px'
}

export default class AnimalCard extends React.Component<props, {}> {
    render() {
        const {
            animal,
            index
        } = this.props

        const clearfix = index & 1 && index != 0
        console.log(animal)
        return (
            <div key={index}>
                <div className='col-sm-6'>
                    <div className="panel">
                        <div className="panel-body text-center">
                            <div className='col-md-4 hidden-md hidden-sm hidden-xs'>
                                {animal.animalType == "Dog" &&
                                    <img src={dog as string}></img>
                                }
                                {animal.animalType == "Cat" &&
                                    <img src={cat as string}></img>

                                }
                                {animal.animalType == "Other" &&
                                    <img src={other as string}></img>
                                }
                            </div>
                            <div className='col-md-12 col-lg-8'>
                                <div className='row text-center hidden-xl hidden-lg'>
                                    <h4>{animal.animalType}</h4>
                                </div>
                                {animal.animalName != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Name:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalName}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalAge != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Age:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalAge}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalBreed != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Breed:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalBreed}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalCoat != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Coat:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalCoat}</div>
                                        </div>
                                    </div>
                                }
                                {animal.animalSex != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Sex:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.animalSex}</div>
                                        </div>
                                    </div>
                                }
                                {animal.LicenseNo != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>License number:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.LicenseNo}</div>
                                        </div>
                                    </div>
                                }
                                {animal.LicenseYear != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>License year:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.LicenseYear}</div>
                                        </div>
                                    </div>
                                }
                                {animal.RabbiesVacNo != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Rabies number:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.RabbiesVacNo}</div>
                                        </div>
                                    </div>
                                }
                                {animal.RabbiesVacExp != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Rabies exp:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.RabbiesVacExp}</div>
                                        </div>
                                    </div>
                                }
                                {animal.Vet != null &&
                                    <div className='row text-center'>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Vet:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.Vet}</div>
                                        </div>
                                    </div>
                                }
                                {animal.Comments != null &&
                                    <div className='row text-center' style={padding}>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div><b>Comments:</b></div>
                                        </div>
                                        <div className='col-md-6 col-sm-12 text-center'>
                                            <div>{animal.Comments}</div>
                                        </div>
                                    </div>
                                }
                                <div>
                                    <button className='btn btn-link' onClick={() => this.props.editAnimal(animal)}>Edit</button>
                                    <button style={style.red} className='btn btn-link' onClick={() => this.props.deleteAnimal(animal)}>Delete</button>
                                </div>
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
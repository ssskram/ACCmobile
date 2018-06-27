import * as React from 'react';

const imgStyle = {
    width: '120px',
    height: '120px',
    opacity: .8
}

export default class Animals extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    public render() {
        return (
            <div>
                {this.props.animals == null &&
                    <div>
                        <br />
                        <h2>No animals on this incident</h2>
                        <br />
                    </div>
                }
                {this.props.animals.map(animal =>
                    <div className="container-fluid" key={animal.itemID}>
                        <div className="row">
                            <div className="facility">
                                <div className="panel">
                                    <div className="panel-body text-center">
                                        <div className='col-md-2 hidden-sm hidden-xs'>
                                            {animal.animalType == 'Dog' &&
                                                <div>
                                                    <img style={imgStyle} src='../images/dog.png' />
                                                </div>
                                            }
                                            {animal.animalType == 'Cat' &&
                                                <div>
                                                    <img style={imgStyle} src='../images/cat.png' />
                                                </div>
                                            }
                                            {animal.animalType == 'Other' &&
                                                <div>
                                                    <img style={imgStyle} src='../images/questionmark.png' />
                                                </div>
                                            }
                                        </div>
                                        <div className='col-md-10'>
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
                                                    </div>rabbiesVacExp
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
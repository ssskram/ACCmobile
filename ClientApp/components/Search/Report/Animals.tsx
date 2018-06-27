import * as React from 'react';

export default class Animals extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    public render() {
        return (
            <div>
                {this.props.animals.map(animal =>
                    <div className="container-fluid" key={animal.itemID}>
                        <div className="row">
                            <div className="facility">
                                <div className="panel">
                                    <div className="panel-body text-center">
                                        <div className="col-md-6">
                                            <strong>{animal.itemID}</strong>
                                            <p>{animal.animalName}</p>
                                            <p>{animal.animalAge}</p>
                                            <p>{animal.animalBreed}</p>
                                            <p>{animal.animalCoat}</p>
                                            <p>{animal.animalSex}</p>
                                            <p>{animal.animalType}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p>{animal.licenseNo}</p>
                                            <p>{animal.licenseYear}</p>
                                            <p>{animal.rabbiesVacExp}</p>
                                            <p>{animal.rabbiesVacNo}</p>
                                            <p>{animal.comments}</p>
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
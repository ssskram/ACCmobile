import * as React from 'react';
import Input from '../FormElements/input'
import Textarea from '../FormElements/textarea'
import Select from '../FormElements/select'

export default class Animal extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            animalName: '',
            animalAge: '',
            animalType: '',
            animalBreed: '',
            animalCoat: '',
            animalSex: '',
            LicenseNo: '',
            LicenseYear: '',
            RabbiesVacNo: '',
            RabbiesVacExp: '',
            Vet: '',
            Comments: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    public render() {
        const {
            animalName,
            animalAge,
            animalType,
            animalBreed,
            animalCoat,
            animalSex,
            LicenseNo,
            LicenseYear,
            RabbiesVacNo,
            RabbiesVacExp,
            Vet,
            Comments
        } = this.state

        return (
            <div>
                <h3 className='form-h'>{this.props.number}. {this.state.animalType}</h3>
                <div className="panel">
                    <div className="panel-body">
                        <div className='col-md-4'>
                            <Input
                                value={animalName}
                                name="animalName"
                                header="Animal's name"
                                placeholder="Name"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={animalAge}
                                name="animalAge"
                                header="Animal's age"
                                placeholder="Age"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={animalSex}
                                name="animalSex"
                                header="Animal's sex"
                                placeholder="Sex"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Select
                                value={animalType}
                                name="animalType"
                                header='Type'
                                placeholder='Select type...'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Select
                                value={animalBreed}
                                name="animalBreed"
                                header='Breed'
                                placeholder='Select breed...'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={true}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Select
                                value={animalCoat}
                                name="animalCoat"
                                header='Coat'
                                placeholder='Select coat...'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={true}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={LicenseNo}
                                name="licenseNo"
                                header="License number"
                                placeholder="License No."
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={LicenseYear}
                                name="LicenseYear"
                                header="License year"
                                placeholder="License Year"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={RabbiesVacNo}
                                name="RabbiesVacNo"
                                header="Rabbies Vac. No."
                                placeholder="Vaccine No."
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Input
                                value={RabbiesVacExp}
                                name="RabbiesVacExp"
                                header="Rabbies Vac. Exp."
                                placeholder="Vaccine Exp."
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
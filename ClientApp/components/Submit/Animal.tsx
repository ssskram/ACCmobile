import * as React from 'react';
import Input from '../FormElements/input'
import Textarea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as moment from 'moment'

const animalTypes = [
    { value: 'Dog', label: 'Dog', name: 'animalType' },
    { value: 'Cat', label: 'Cat', name: 'animalType' },
    { value: 'Other', label: 'Other', name: 'animalType' }
]

const animalSexes = [
    { value: 'Male', label: 'Male', name: 'animalSex' },
    { value: 'Female', label: 'Female', name: 'animalSex' },
    { value: 'Other', label: 'Other', name: 'animalSex' }
]

const loadingOptions = [{
    "value": '...loading...',
    "label": '...loading...'
}]
const conditionalOptions = [{
    "value": '...select type...',
    "label": '...select type...'
}]

// to populate with dropdown values
var allBreed: any[] = []
var allCoat: any[] = []
var allVet: any[] = []

export class Animal extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // dropdowns
            breedOptions: conditionalOptions,
            coatOptions: conditionalOptions,
            vetOptions: loadingOptions,

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
            Comments: '',
            itemID: '',
        }
        this.postNewAnimal = this.postNewAnimal.bind(this);
    }

    componentDidMount() {
        this.props.getDropdowns()
        this.setDropdowns()
        let animal = this.props.animal
        if (this.props.put == true) {
            if (animal.rabbiesVacExp) {
                this.setState ({
                    RabbiesVacExp: moment(animal.rabbiesVacExp),
                })
            }
            this.setState({
                animalName: animal.animalName || '',
                animalAge: animal.animalAge || '',
                animalType: animal.animalType || '',
                animalBreed: animal.animalBreed || '',
                animalCoat: animal.animalCoat || '',
                animalSex: animal.animalSex || '',
                LicenseNo: animal.licenseNo || '',
                LicenseYear: animal.licenseYear || '',
                RabbiesVacNo: animal.rabbiesVacNo || '',
                Vet: animal.vet || '',
                Comments: animal.comments || '',
                itemID: animal.itemID || ''
            }, function (this) {
                this.setDropdowns()
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setDropdowns()
        if (this.props.submit != nextProps.submit) {
            // trigger post
            if (nextProps.submit == true) {
                this.postNewAnimal()
            }
        }
    }

    setDropdowns() {
        let self = this;

        // set dropdowns
        allVet = []
        allCoat = []
        allBreed = []

        self.props.animalBreeds.forEach(function (element) {
            var json = { "value": element.breed, "label": element.breed, "type": element.type, "name": 'animalBreed' };
            allBreed.push(json)
        })
        self.props.animalCoats.forEach(function (element) {
            var json = { "value": element.coat, "label": element.coat, "type": element.type, "name": 'animalCoat' };
            allCoat.push(json)
        })
        self.props.veterinarians.forEach(function (element) {
            var json = { "value": element.vet, "label": element.vet, "name": 'Vet' };
            allVet.push(json)
        })
        self.setState({
            vetOptions: allVet
        })
        this.setConditionalDropodowns()
    }

    handleChildDate(date) {
        this.setState({ RabbiesVacExp: date });
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value }, function (this) {
            if (event.name === 'animalType') {
                this.setConditionalDropodowns()
            }
        });
    }

    handleCoatMulti(value) {
        this.setState({ animalCoat: value })
    };

    handleBreedMulti(value) {
        this.setState({ animalBreed: value })
    };

    setConditionalDropodowns() {
        let type = this.state.animalType
        if (type === 'Dog') {
            var breeds = allBreed.filter(function (obj) {
                return obj.type === 'Dog' || obj.type === 'Universal';
            });
            var coats = allCoat.filter(function (obj) {
                return obj.type === 'Dog' || obj.type === 'Universal';
            });
            this.setState({
                breedOptions: breeds,
                coatOptions: coats
            })
        }
        if (type === 'Cat') {
            var breeds = allBreed.filter(function (obj) {
                return obj.type === 'Cat' || obj.type === 'Universal';
            });
            var coats = allCoat.filter(function (obj) {
                return obj.type === 'Cat' || obj.type === 'Universal';
            });
            this.setState({
                breedOptions: breeds,
                coatOptions: coats
            })
        }
        if (type === 'Other') {
            this.setState({
                breedOptions: [],
                coatOptions: []
            })
        }
    }

    delete() {
        this.props.delete(this.props.number)
    }

    addAnimal(event) {
        event.preventDefault()
        this.props.throwSpinner()
        let self = this.state
        let data = JSON.stringify({
            incidentID: this.props.incidentID,
            animalName: self.animalName,
            animalType: self.animalType,
            animalBreed: self.animalBreed,
            animalCoat: self.animalCoat,
            animalSex: self.animalSex,
            animalAge: self.animalAge,
            LicenseNo: self.LicenseNo,
            LicenseYear: self.LicenseYear,
            RabbiesVacNo: self.RabbiesVacNo,
            RabbiesVacExp: self.RabbiesVacExp,
            Vet: self.Vet,
            Comments: self.Comments,
        })
        let cleaned_data = data.replace(/'/g, '');
        fetch('/api/animals/post', {
            method: 'POST',
            body: cleaned_data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                location.reload()
            })
    }

    put(event) {
        event.preventDefault()
        this.props.throwSpinner()
        let self = this.state
        let data = JSON.stringify({
            itemID: self.itemID,
            incidentID: this.props.incidentID,
            animalName: self.animalName,
            animalType: self.animalType,
            animalBreed: self.animalBreed,
            animalCoat: self.animalCoat,
            animalSex: self.animalSex,
            animalAge: self.animalAge,
            LicenseNo: self.LicenseNo,
            LicenseYear: self.LicenseYear,
            RabbiesVacNo: self.RabbiesVacNo,
            RabbiesVacExp: self.RabbiesVacExp,
            Vet: self.Vet,
            Comments: self.Comments,
        })
        let cleaned_data = data.replace(/'/g, '');
        fetch('/api/animals/put', {
            method: 'POST',
            body: cleaned_data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                location.reload()
            })
    }

    postNewAnimal() {
        let self = this
        let data = JSON.stringify({
            incidentID: this.props.incidentUUID,
            animalName: this.state.animalName,
            animalType: this.state.animalType,
            animalBreed: this.state.animalBreed,
            animalCoat: this.state.animalCoat,
            animalSex: this.state.animalSex,
            animalAge: this.state.animalAge,
            LicenseNo: this.state.LicenseNo,
            LicenseYear: this.state.LicenseYear,
            RabbiesVacNo: this.state.RabbiesVacNo,
            RabbiesVacExp: this.state.RabbiesVacExp,
            Vet: this.state.Vet,
            Comments: this.state.Comments,
        })
        let cleaned_data = data.replace(/'/g, '');
        fetch('/api/animals/post', {
            method: 'POST',
            body: cleaned_data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function () {
                self.props.postComplete()
            })
    }

    public render() {
        const {
            //dropdowns
            breedOptions,
            coatOptions,
            vetOptions,

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
                {!this.props.put == true && !this.props.add == true &&
                    <div className='row'>
                        <button className="btn-x" title='Delete animal' onClick={this.delete.bind(this)}>x</button>
                    </div>
                }
                <div className='row'>
                    <div className='col-md-3'>
                        <Select
                            value={animalType}
                            name="animalType"
                            header='Type'
                            placeholder='Animal type'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={animalTypes}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Input
                            value={animalName}
                            name="animalName"
                            header="Name"
                            placeholder="Animal's name"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Input
                            value={animalAge}
                            name="animalAge"
                            header="Age"
                            placeholder="Animal's age"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Select
                            value={animalSex}
                            name="animalSex"
                            header='Sex'
                            placeholder='Animal sex'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={animalSexes}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <Select
                            value={animalBreed}
                            name="animalBreed"
                            header='Breed'
                            placeholder='Select breed...'
                            onChange={this.handleBreedMulti.bind(this)}
                            multi={true}
                            options={breedOptions}
                        />
                    </div>
                    <div className='col-md-6'>
                        <Select
                            value={animalCoat}
                            name="animalCoat"
                            header='Coat'
                            placeholder='Select coat...'
                            onChange={this.handleCoatMulti.bind(this)}
                            multi={true}
                            options={coatOptions}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-3'>
                        <Input
                            value={LicenseNo}
                            name="LicenseNo"
                            header="License #"
                            placeholder="License No."
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Input
                            value={LicenseYear}
                            name="LicenseYear"
                            header="License yr"
                            placeholder="License Year"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Input
                            value={RabbiesVacNo}
                            name="RabbiesVacNo"
                            header="Rabbies #"
                            placeholder="Vaccine No."
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <Datepicker
                            value={RabbiesVacExp}
                            name="RabbiesVacExp"
                            header="Rab. Exp."
                            placeholder="Vaccine Exp."
                            callback={this.handleChildDate.bind(this)}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <Select
                            value={Vet}
                            name="Vet"
                            header='Veterinarian'
                            placeholder='Select vet...'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={vetOptions}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <Textarea
                            value={Comments}
                            name="Comments"
                            header="Comments"
                            placeholder="Describe the animal"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                </div>
                {this.props.add == true &&
                    <div className='col-md-12 text-center'>
                        <button onClick={this.addAnimal.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
                {this.props.put == true &&
                    <div className='col-md-12 text-center'>
                        <button onClick={this.put.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.dropdowns
    }),
    ({
        ...Dropdowns.actionCreators
    })
)(Animal as any) as typeof Animal;
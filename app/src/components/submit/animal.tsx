import * as React from 'react'
import Input from '../formElements/input'
import Textarea from '../formElements/textarea'
import Select from '../formElements/select'
import Datepicker from '../formElements/datepicker'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import * as moment from 'moment'
import * as constants from './constants'

type props = {
    new: boolean
    put: boolean
    add: boolean
    animal: any
    incidentID: string
    key: number
    addNewAnimal: (animalObj: object) => void
    dropdowns: types.dropdowns
    getDropdowns: () => void
    throwSpinner: () => void
}

type state = {
    breedOptions: Array<any>
    coatOptions: Array<any>
    vetOptions: Array<any>
    animalName: string
    animalAge: string
    animalType: string
    animalBreed: string
    animalCoat: string
    animalSex: string
    LicenseNo: string
    LicenseYear: string
    RabbiesVacNo: string
    RabbiesVacExp: any
    Vet: string
    Comments: string
    itemID: string
}

// to populate with dropdown values
var allBreed: any[] = []
var allCoat: any[] = []
var allVet: any[] = []

export class Animal extends React.Component<any, state> {
    constructor(props) {
        super(props)
        this.state = {
            // dropdowns
            breedOptions: constants.conditionalOptions,
            coatOptions: constants.conditionalOptions,
            vetOptions: constants.loadingOptions,

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
    }

    componentDidMount() {
        this.props.getDropdowns()
        this.setDropdowns()
        let animal = this.props.animal
        if (this.props.put == true) {
            if (animal.rabbiesVacExp) {
                this.setState({
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

    componentWillReceiveProps() {
        this.setDropdowns()
    }

    setDropdowns() {
        let self = this;

        // set dropdowns
        allVet = []
        allCoat = []
        allBreed = []

        self.props.dropdowns.animalBreeds.forEach(function (element) {
            var json = { "value": element.breed, "label": element.breed, "type": element.type, "name": 'animalBreed' };
            allBreed.push(json)
        })
        self.props.dropdowns.animalCoats.forEach(function (element) {
            var json = { "value": element.coat, "label": element.coat, "type": element.type, "name": 'animalCoat' };
            allCoat.push(json)
        })
        self.props.dropdowns.veterinarians.forEach(function (element) {
            var json = { "value": element.vet, "label": element.vet, "name": 'Vet' };
            allVet.push(json)
        })
        self.setState({
            vetOptions: allVet
        })
        this.setConditionalDropodowns()
    }

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

    // add animal to new incident form
    newAnimal() {
        this.props.addNewAnimal(this.state)
    }

    // add animal to existing incident
    addAnimal(event) {
        event.preventDefault()
        this.props.throwSpinner()
        let self = this.state
        let data = JSON.stringify({
            AdvisoryID: this.props.incidentID,
            Name: self.animalName,
            Type: self.animalType,
            Breed: self.animalBreed,
            Coat: self.animalCoat,
            Sex: self.animalSex,
            Age: self.animalAge,
            LicenseNumber: self.LicenseNo,
            LicenseYear: self.LicenseYear,
            RabbiesVacNo: self.RabbiesVacNo,
            RabbiesVacExp: self.RabbiesVacExp,
            Veterinarian: self.Vet,
            Comments: self.Comments,
        })
        let cleaned_data = data.replace(/'/g, '');
        fetch('https://365proxy.azurewebsites.us/accmobile/addAnimal', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            }),
            body: cleaned_data,
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
            itemId: self.itemID,
            AdvisoryID: this.props.incidentID,
            Name: self.animalName,
            Type: self.animalType,
            Breed: self.animalBreed,
            Coat: self.animalCoat,
            Sex: self.animalSex,
            Age: self.animalAge,
            LicenseNumber: self.LicenseNo,
            LicenseYear: self.LicenseYear,
            RabbiesVacNo: self.RabbiesVacNo,
            RabbiesVacExp: self.RabbiesVacExp,
            Veterinarian: self.Vet,
            Comments: self.Comments,
        })
        let cleaned_data = data.replace(/'/g, '');
        fetch('https://365proxy.azurewebsites.us/accmobile/updateAnimal', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
            }),
            body: cleaned_data,
        })
            .then(function () {
                location.reload()
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

        // validation
        const isEnabled =
            animalType != ''

        return (
            <div key={this.props.key}>
                <div className='col-md-3'>
                    <Select
                        value={animalType ? { value: animalType, label: animalType }: ''}
                        header='Type'
                        placeholder='Animal type'
                        onChange={v => {
                            this.setState({ animalType: v.value })
                            this.setConditionalDropodowns()
                        }}
                        multi={false}
                        options={constants.animalTypes}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={animalName}
                        header="Name"
                        placeholder="Animal's name"
                        callback={e => this.setState({ animalName: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={animalAge}
                        header="Age"
                        placeholder="Animal's age"
                        callback={e => this.setState({ animalAge: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Select
                        value={animalSex ? { value: animalSex, label: animalSex }: ''}
                        header='Sex'
                        placeholder='Animal sex'
                        onChange={v => this.setState({ animalSex: v.value })}
                        multi={false}
                        options={constants.animalSexes}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={animalBreed ? { value: animalBreed, label: animalBreed }: ''}
                        header='Breed'
                        placeholder='Select breed...'
                        onChange={v => this.setState({ animalBreed: v.value })}
                        multi={true}
                        options={breedOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={animalCoat ? { value: animalCoat, label: animalCoat }: ''}
                        header='Coat'
                        placeholder='Select coat...'
                        onChange={v => this.setState({ animalCoat: v.value })}
                        multi={true}
                        options={coatOptions}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={LicenseNo}
                        header="License #"
                        placeholder="License No."
                        callback={e => this.setState({ LicenseNo: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={LicenseYear}
                        header="License yr"
                        placeholder="License Year"
                        callback={e => this.setState({ LicenseYear: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={RabbiesVacNo}
                        header="Rabies #"
                        placeholder="Vaccine No."
                        callback={e => this.setState({ RabbiesVacNo: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Datepicker
                        value={RabbiesVacExp}
                        header="Rab. Exp."
                        placeholder="Vaccine Exp."
                        callback={date => this.setState({ RabbiesVacExp: moment(date).format('MM/DD/YYYY') })}
                    />
                </div>
                <Select
                    value={Vet ? { value: Vet, label: Vet }: ''}
                    header='Veterinarian'
                    placeholder='Select vet...'
                    onChange={v => this.setState({ Vet: v.value })}
                    multi={false}
                    options={vetOptions}
                />
                <Textarea
                    value={Comments}
                    header="Comments"
                    placeholder="Describe the animal"
                    callback={e => this.setState({ Comments: e.target.value })}
                />
                {this.props.add == true &&
                    <div className='col-md-12 text-center'>
                        <button disabled={!isEnabled} onClick={this.addAnimal.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
                {this.props.put == true &&
                    <div className='col-md-12 text-center'>
                        <button disabled={!isEnabled} onClick={this.put.bind(this)} className='btn btn-success'>Save</button>
                    </div>
                }
                {this.props.new == true &&
                    <div className='col-md-12 text-center'>
                        <button disabled={!isEnabled} onClick={this.newAnimal.bind(this)} className='btn btn-success'>Save</button>
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
)(Animal)
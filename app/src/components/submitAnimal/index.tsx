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
import * as constants from '../submitIncident/constants'
import { selected, update } from '../submitIncident/functions/handleMulti'
import postAnimal from './functions/postAnimal'
import putAnimal from './functions/putAnimal'
import SubmitButton from '../submitIncident/markup/submit'

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

            animalName: props.animal.animalName || '',
            animalAge: props.animal.animalAge || '',
            animalType: props.animal.animalType || '',
            animalBreed: props.animal.animalBreed || '',
            animalCoat: props.animal.animalCoat || '',
            animalSex: props.animal.animalSex || '',
            LicenseNo: props.animal.LicenseNo || '',
            LicenseYear: props.animal.LicenseYear || '',
            RabbiesVacNo: props.animal.RabbiesVacNo || '',
            RabbiesVacExp: props.animal.RabbiesVacExp || '',
            Vet: props.animal.Vet || '',
            Comments: props.animal.Comments || '',
            itemID: props.animal.itemID || ''
        }
    }

    componentDidMount() {
        this.props.getDropdowns()
        this.setDropdowns()
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

    async putPost() {
        event.preventDefault()
        let data: any = {
            AdvisoryID: this.props.incidentID,
            Name: this.state.animalName,
            Type: this.state.animalType,
            Breed: this.state.animalBreed,
            Coat: this.state.animalCoat,
            Sex: this.state.animalSex,
            Age: this.state.animalAge,
            LicenseNumber: this.state.LicenseNo,
            LicenseYear: this.state.LicenseYear,
            RabbiesVacNo: this.state.RabbiesVacNo,
            RabbiesVacExp: this.state.RabbiesVacExp,
            Veterinarian: this.state.Vet,
            Comments: this.state.Comments,
        }
        if (this.props.put) {
            data.Id = this.state.itemID
            await putAnimal(JSON.stringify(data).replace(/'/g, ''))
            location.reload()
        } else {
            await postAnimal(JSON.stringify(data).replace(/'/g, ''))
            location.reload()
        }
    }

    failure() {

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
                        value={animalType ? { value: animalType, label: animalType } : ''}
                        header='Type'
                        placeholder='Type'
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
                        placeholder="Name"
                        callback={e => this.setState({ animalName: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Input
                        value={animalAge}
                        header="Age"
                        placeholder="Age"
                        callback={e => this.setState({ animalAge: e.target.value })}
                    />
                </div>
                <div className='col-md-3'>
                    <Select
                        value={animalSex ? { value: animalSex, label: animalSex } : ''}
                        header='Sex'
                        placeholder='Sex'
                        onChange={v => this.setState({ animalSex: v.value })}
                        multi={false}
                        options={constants.animalSexes}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={animalBreed ? selected(animalBreed) : ''}
                        header='Breed'
                        placeholder='Breed(s)'
                        onChange={animalBreed => this.setState({ animalBreed: update(animalBreed) })}
                        multi={true}
                        options={breedOptions}
                    />
                </div>
                <div className='col-md-6'>
                    <Select
                        value={animalCoat ? selected(animalCoat) : ''}
                        header='Coat'
                        placeholder='Coat(s)'
                        onChange={animalCoat => this.setState({ animalCoat: update(animalCoat) })}
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
                    value={Vet ? { value: Vet, label: Vet } : ''}
                    header='Veterinarian'
                    placeholder='Vet'
                    onChange={v => this.setState({ Vet: v.value })}
                    multi={false}
                    options={vetOptions}
                />
                <Textarea
                    value={Comments}
                    header="Comments"
                    placeholder="Description"
                    callback={e => this.setState({ Comments: e.target.value })}
                />
                <SubmitButton
                    saveObject="animal" 
                    isEnabled={isEnabled}
                    fireSubmit={this.putPost.bind(this)}
                />
            </div>
        )
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
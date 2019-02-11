import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import Incident from './incident'
import Modal from 'react-responsive-modal'
import Autocomplete from '../formElements/autocomplete'
import Map from '../map/mapContainer'
import { v1 as uuid } from 'uuid'

const sectionPadding = {
    padding: '20px 0px'
}

export class Submit extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            map: false,
            address: '',
            coords: {},
            submit: false,
            spinnerIsOpen: false,
            formValid: false,
            countPostedItems: 0,
            redirect: false,

            // validation
            buttonIsEnabled: false,
            validationCount: 0
        }
        this.deleteAnimal = this.deleteAnimal.bind(this);
        this.postComplete = this.postComplete.bind(this);
        this.postNewAnimal = this.postNewAnimal.bind(this);
    }

    componentWillMount() {
        // generate uuid for new incident/animals
        const guid: string = uuid()
        this.setState({
            uuid: guid
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    clearCoords() {
        this.setState({
            map: false,
            coords: {}
        })
    }

    handleAutcomplete(props) {
        this.setState({
            coords: props.coords,
            address: props.address,
            map: true
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    fireSubmit() {
        let self = this
        let animals = this.state.animals
        this.setState({
            // this triggrs post on child incident component
            submit: true,
            spinnerIsOpen: true
        })
        animals.forEach(function (animal) {
            self.postNewAnimal(animal)
        })
    }

    postComplete() {
        this.setState({
            countPostedItems: this.state.countPostedItems + 1
        }, function (this) {
            this.redirect()
        })
    }

    redirect() {
        let requiredPosts = Object.keys(this.state.animals).length + 1 // for incident obj
        if (this.state.countPostedItems == requiredPosts) {
            this.setState({
                redirect: true
            })
        }
    }

    addAnimal() {
        this.setState({
            modalIsOpen: true,
        })
    }

    addNewAnimal(animal) {
        let newAnimal = {
            incidentUUID: this.state.uuid,
            animalName: animal.animalName,
            animalAge: animal.animalAge,
            animalType: animal.animalType,
            animalBreed: animal.animalBreed,
            animalCoat: animal.animalCoat,
            animalSex: animal.animalSex,
            LicenseNo: animal.LicenseNo,
            LicenseYear: animal.LicenseYear,
            RabbiesVacNo: animal.RabbiesVacNo,
            RabbiesVacExp: animal.RabbiesVacExp,
            Vet: animal.Vet,
            Comments: animal.Comments,
        }
        this.setState({
            modalIsOpen: false,
            animals: [...this.state.animals, newAnimal]
        })
    }

    postNewAnimal(animal) {
        let self = this
        let data = JSON.stringify({
            incidentID: animal.incidentUUID,
            animalName: animal.animalName,
            animalType: animal.animalType,
            animalBreed: animal.animalBreed,
            animalCoat: animal.animalCoat,
            animalSex: animal.animalSex,
            animalAge: animal.animalAge,
            LicenseNo: animal.LicenseNo,
            LicenseYear: animal.LicenseYear,
            RabbiesVacNo: animal.RabbiesVacNo,
            RabbiesVacExp: animal.RabbiesVacExp,
            Vet: animal.Vet,
            Comments: animal.Comments,
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
                self.postComplete()
            })
    }
    deleteAnimal(index) {
        var newArray = [...this.state.animals]
        newArray.splice(index, 1)
        this.setState({
            animals: newArray,
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    isValid() {
        this.setState({
            validationCount: this.state.validationCount + 1
        }, function (this) {
            if (this.state.validationCount == 2) {
                this.setState({
                    buttonIsEnabled: true
                })
            }
        })
    }

    isNotValid() {
        this.setState({
            buttonIsEnabled: false,
            validationCount: this.state.validationCount - 1
        })
    }

    public render() {
        const {
            uuid,
            map,
            address,
            coords,
            submit,
            spinnerIsOpen,
            redirect,
            buttonIsEnabled
        } = this.state

        if (redirect) {
            return <Redirect to='/' />
        }

        return (
            <div className='col-md-8 col-md-offset-2'>
                <h3>Address</h3>
                <hr />
                <div className='row' style={sectionPadding}>
                    <div className='row'>
                        <Autocomplete
                            value={address}
                            callback={this.handleAutcomplete.bind(this)}
                            clearCoords={this.clearCoords.bind(this)}
                        />
                    </div>
                    {map === true &&
                        <div className='row'>
                            <Map coords={coords} />
                        </div>
                    }
                </div>
                <h3>Description</h3>
                <hr />
                <div className='row' style={sectionPadding}>
                    <Incident
                        isNotValid={this.isNotValid.bind(this)}
                        isValid={this.isValid.bind(this)}
                        incidentUUID={uuid}
                        address={address}
                        coords={coords}
                        submit={submit}
                        postComplete={this.postComplete} />
                </div>
                <div className='col-md-12 text-center'>
                    <button disabled={!buttonIsEnabled} onClick={this.fireSubmit.bind(this)} className="btn btn-success">Save</button>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                {/* loading spinner */}
                <Modal
                    open={spinnerIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'spinner-overlay',
                        modal: 'spinner-modal'
                    }}
                    animationDuration={1000}
                    closeOnEsc={false}
                    closeOnOverlayClick={false}
                    showCloseIcon={false}
                    center>
                    <div className="loader"></div>
                    ...submitting incident...
                </Modal>
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
)(Submit)
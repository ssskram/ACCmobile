import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import * as Dropdowns from '../../store/dropdowns';
import Incident from './Incident'
import * as MessagesStore from '../../store/messages';
import Animals from './Animal'
import Modal from 'react-responsive-modal';
import Autocomplete from '../FormElements/autocomplete'
import Map from '../Map/MapContainer'
import { v1 as uuid } from 'uuid'

const sectionPadding = {
    padding: '20px'
}

const panelMargin = {
    paddingTop: '0px'
}

export class Submit extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            uuid: '',
            map: false,
            address: '',
            coords: {},
            counter: 0,
            animals: [],
            submitReady: false,
            submit: false,
            spinnerIsOpen: false,
            formValid: false,
            countPostedItems: 0,
            redirect: false
        }
        this.postComplete = this.postComplete.bind(this);
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

        // ping server
        this.props.ping()
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

    addAnimal() {
        var count = this.state.counter + 1
        var animalIndex = count
        this.setState({
            counter: count,
            animals: [...this.state.animals, animalIndex],
            submitReady: true
        })
    }

    showSubmit() {
        this.setState({
            submitReady: true
        });
    }

    fireSubmit() {
        this.setState({
            submit: true,
            spinnerIsOpen: true
        })
    }

    postComplete() {
        this.setState({
            countPostedItems: this.state.countPostedItems + 1
        }, function(this) {
            this.redirect()
        })
    }
    redirect() {
        let requiredPosts = Object.keys(this.state.animals).length + 1 // for incident obj
        if (this.state.countPostedItems == requiredPosts) {
            this.props.success()
            this.setState({
                redirect: true
            })
        }
    }

    deleteAnimal(index) {
        var newArray = [...this.state.animals];
        var remove = newArray.indexOf(index)
        newArray.splice(remove, 1);
        this.setState({ animals: newArray });
    }

    closeModal() {
        // spinner closes on page reload
        // a close function is just required by the library
    }

    public render() {
        const {
            uuid,
            map,
            address,
            coords,
            counter,
            animals,
            submitReady,
            submit,
            spinnerIsOpen,
            redirect
        } = this.state

        if (redirect) {
            return <Redirect to='/' />;
        }

        return (
            <div>
                <h2 className='text-center'>New Incident</h2>
                <div className='row'>
                    <div className='col-sm-3 col-md-2'>
                        <h3 className='text-center form-header'>Address</h3>
                    </div>
                    <div className='col-sm-9 col-md-10'>
                        <hr />
                    </div>
                </div>
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
                <div className='row'>
                    <div className='col-sm-3 col-md-2'>
                        <h3 className='text-center form-header'>Description</h3>
                    </div>
                    <div className='col-sm-9 col-md-10'>
                        <hr />
                    </div>
                </div>
                <div className='row' style={sectionPadding}>
                    <Incident incidentUUID={uuid}
                        address={address}
                        coords={coords}
                        submit={submit}
                        postComplete={this.postComplete} />
                </div>
                <div className='row'>
                    <div className='col-sm-3 col-md-2'>
                        <h3 className='text-center form-header'>Animals</h3>
                    </div>
                    <div className='col-sm-9 col-md-10'>
                        <hr />
                    </div>
                </div>
                <div className='row' style={sectionPadding}>
                    {counter > 0 && Object.keys(animals).length == 0 &&
                        <div className='row text-center'>
                            <h3><i>No animals on this incident</i></h3>
                        </div>
                    }
                    {counter === 0 && submitReady === true &&
                        <div className='row text-center'>
                            <h3><i>No animals on this incident</i></h3>
                        </div>
                    }
                    {submitReady === false &&
                        <div className='row'>
                            <div className='text-center'>
                                <h4>Do you have any animals to add?</h4>
                                <div className='row'>
                                    <button className='btn btn-default' onClick={this.addAnimal.bind(this)}>Yes</button>
                                    <button className='btn btn-default' onClick={this.showSubmit.bind(this)}>No</button>
                                </div>
                            </div>
                        </div>
                    }
                    {animals.map((animal) => <div>
                        <h3 className='form-h' key={animal}>{animal}.</h3>
                        <div className="panel">
                            <div style={panelMargin} className="panel-body">
                                <Animals
                                    incidentUUID={uuid}
                                    number={animal}
                                    key={animal}
                                    delete={this.deleteAnimal.bind(this)}
                                    submit={submit}
                                    postComplete={this.postComplete} />
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                {submitReady === true &&
                    <div className='row'>
                        <hr />
                        <div className='text-center'>
                            <div className='row'>
                                <button className="btn btn-default" onClick={this.addAnimal.bind(this)}>Add an animal</button>
                            </div>
                            <div className='row'>
                                <button onClick={this.fireSubmit.bind(this)} className="btn btn-success">Submit</button>
                            </div>

                        </div>
                    </div>
                }
                <br />
                <br />
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
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.dropdowns,
        ...state.messages
    }),
    ({
        ...Ping.actionCreators,
        ...MessagesStore.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Submit as any) as typeof Submit;
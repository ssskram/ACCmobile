import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import * as Dropdowns from '../../store/dropdowns';
import Incident from './Incident'
import Animals from './Animal'
import Autocomplete from '../FormElements/autocomplete'
import Map from '../Map/MapContainer'

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
            map: false,
            address: '',
            coords: {},
            counter: 0,
            animals: [],
            submit: false
        }
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
            submit: true
        })
    }

    showSubmit() {
        this.setState({
            submit: true
        });
    }

    deleteAnimal(index) {
        var newArray = [...this.state.animals];
        var remove = newArray.indexOf(index)
        newArray.splice(remove, 1);
        this.setState({ animals: newArray });
    }

    public render() {
        const {
            map,
            address,
            coords,
            counter,
            animals,
            submit
        } = this.state

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
                    <Incident />
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
                    {counter === 0 && submit === true &&
                        <div className='row text-center'>
                            <h3><i>No animals on this incident</i></h3>
                        </div>
                    }
                    {submit === false &&
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
                        <h3 className='form-h'>{animal}.</h3>
                        <div className="panel">
                            <div style={panelMargin} className="panel-body">
                                <Animals number={animal} key={animal} delete={this.deleteAnimal.bind(this)} />
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                {submit === true &&
                    <div className='row'>
                        <hr />
                        <div className='text-center'>
                            <div className='row'>
                                <button className="btn btn-default" onClick={this.addAnimal.bind(this)}>Add an animal</button>
                            </div>
                            <div className='row'>
                                <button className="btn btn-success">Submit</button>
                            </div>

                        </div>
                    </div>
                }
                <br />
                <br />
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.dropdowns
    }),
    ({
        ...Ping.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Submit as any) as typeof Submit;
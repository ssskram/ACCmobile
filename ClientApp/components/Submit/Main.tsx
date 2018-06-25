import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import Incident from './Incident'
import Animals from './Animal'
import Autocomplete from '../FormElements/autocomplete'
import Map from '../Map/MapContainer'

const btnStyle = {
    width: '50%'
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

        // load dropdown data
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
            <div className='main-form'>
                <h2 className='text-center'>New Incident</h2>
                <hr />
                <h3 className='text-center'>Address</h3>
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
                <hr />
                <h3 className='text-center'>Incident</h3>
                <div className='row'>
                    <Incident />
                </div>
                <hr />
                <h3 className='text-center'>Animals</h3>
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
                            </div>
                            <div className='row'>
                                <button className='btn btn-default' onClick={this.showSubmit.bind(this)}>No</button>
                            </div>
                        </div>
                    </div>
                }
                {animals.map((animal) => <Animals number={animal} key={animal}/>)}
                {submit === true &&
                    <div className='row'>
                        <hr />
                        <div className='text-center'>
                            <div className='row'>
                                <button className="btn btn-default" onClick={this.addAnimal.bind(this)}>Add an animal</button>
                            </div>
                            <div className='row'>
                                <button style={btnStyle} className="btn btn-success">Submit</button>
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
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(Submit as any) as typeof Submit;
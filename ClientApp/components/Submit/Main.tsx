import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Ping from '../../store/ping';
import Address from './Address'
import Incident from './Incident'
import Animals from './Animal'

const btnStyle = {
    width: '70%'
}

export class Submit extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
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

    addAnimal() {
        var count = this.state.counter + 1
        var animalIndex = count
        this.setState({
            counter: count,
            animals: [...this.state.animals, animalIndex],
            submit: true
        });
    }
    showSubmit() {
        this.setState({
            submit: true
        });
    }

    public render() {
        const {
            counter,
            animals,
            submit
        } = this.state

        return (
            <div className='main-form'>
                <h2 className='text-center'>New Incident</h2>
                <hr />
                <div className='row'>
                    <h3>1. Enter an address</h3>
                    <Address />
                </div>
                <div className='row'>
                    <h3>2. Describe the incident</h3>
                    <Incident />
                </div>
                <h3>3. Add animals</h3>
                {counter === 0 && submit === true &&
                    <div className='row text-center'>
                        <h3><i>No animals on this incident</i></h3>
                    </div>
                }
                {submit === false &&
                    <div className='row'>
                        <div className='text-center'>
                            <h4>Do you have any animals to add?</h4>
                            <button className='btn btn-default' onClick={this.addAnimal.bind(this)}>Yes</button>
                            <button className='btn btn-default' onClick={this.showSubmit.bind(this)}>No</button>
                        </div>
                    </div>
                }
                {animals.map((animal) => <Animals key={animal} />)}
                {submit === true &&
                    <div className='row'>
                        <hr />
                        <div className='text-center'>
                            <button className="btn btn-default" onClick={this.addAnimal.bind(this)}>Add an animal</button>
                            <button style={btnStyle} className="btn btn-success">Submit</button>
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
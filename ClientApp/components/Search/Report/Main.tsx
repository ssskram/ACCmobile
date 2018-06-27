import * as React from 'react';
import Modal from 'react-responsive-modal';
import Moment from 'react-moment'
import { connect } from 'react-redux';
import { ApplicationState } from '../../../store';
import * as Ping from '../../../store/ping';
import * as Incidents from '../../../store/incidents';
import * as Animals from '../../../store/animals';
import * as Dropdowns from '../../../store/dropdowns';
import Incident from './Incident'
import AnimalsTable from './Animals'

export class Report extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            incident: {},
            animals: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        const param = { id: this.props.match.params.id }
        fetch('/api/animals/report?id=' + encodeURIComponent(param.id), {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    animals: data
                });
            });
        fetch('/api/incidents/report?id=' + encodeURIComponent(param.id), {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    incident: data
                });
            });

        // load store
        this.props.getIncidents()
        this.props.getAnimals()
        this.props.getDropdowns()
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    public render() {
        const {
            incident,
            animals,
            modalIsOpen } = this.state

        return (
            <div>
                <h2 className='text-center'>Incident report</h2>
                <hr />
                <Incident incident={incident}/>
                <AnimalsTable animals={animals}/>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        transitionExit: 'transition-exit-active',
                        transitionExitActive: 'transition-exit-active',
                        overlay: 'spinner-overlay',
                        modal: 'spinner-modal'
                    }}
                    animationDuration={1000}
                    closeOnEsc={false}
                    closeOnOverlayClick={false}
                    showCloseIcon={false}
                    center>
                    <div className="loader"></div>
                    ...loading incident report...
                </Modal>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.incidents,
        ...state.animals,
        ...state.dropdowns
    }),
    ({
        ...Ping.actionCreators,
        ...Incidents.actionCreators,
        ...Animals.actionCreators,
        ...Incidents.actionCreators,
        ...Dropdowns.actionCreators
    })
)(Report as any) as typeof Report;
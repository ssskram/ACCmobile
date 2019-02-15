import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Dropdowns from '../../store/dropdowns'
import * as types from '../../store/types'
import * as constants from './constants'
import Fields from './markup/filterInputs'

type state = {
    reasonOptions: object
    submittedByOptions: object
    address: string
    status: string
    ownersName: string
    date: string
    clearDate: boolean
    reasonForVisit: string
    note: string
}

type props = {
    dropdowns: types.dropdowns
    incidents: types.incident[]
    showFilters: boolean
    clearFilters: boolean
    getDropdowns: () => void
    filter: (stateObj: state) => void
}

export class Filters extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            reasonOptions: constants.loadingOptions,
            submittedByOptions: constants.loadingOptions,
            address: '',
            status: '',
            ownersName: '',
            date: '',
            clearDate: false,
            reasonForVisit: '',
            note: ''
        }
    }

    componentDidMount() {
        this.props.getDropdowns()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clearFilters == true) {
            this.setState({
                address: '',
                status: undefined,
                date: '',
                clearDate: true,
                ownersName: undefined,
                reasonForVisit: undefined,
                note: ''
            })
        }
        this.setReasonsDropdown(nextProps)
    }

    setReasonsDropdown(nextProps) {
        var reasonOptions = [{ value: '', label: 'All' }]
        nextProps.dropdowns.reasonsForVisit.forEach(element => {
            var json = { "value": element.reason, "label": element.reason }
            reasonOptions.push(json)
        })
        this.setState({ reasonOptions })
    }


    childSetsState(stateObject) {
        this.setState(stateObject, () => this.props.filter(this.state))
    }

    public render() {
        return (
            <Fields
                state={this.state as state}
                showFilters={this.props.showFilters}
                setState={this.childSetsState.bind(this)}
            />
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
)(Filters)
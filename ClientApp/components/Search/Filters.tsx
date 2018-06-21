import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Dropdowns from '../../store/dropdowns'

export class Filters extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
        // get dropdowns
    }

    public render() {
        return (
            <div className="col-md-12">
                <div className="form-group">
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Address</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Search by address" />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Status</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Select status" />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Submitted by</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Select officer" />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Date</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Select date" />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Reason for visit</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Select reason for visit" />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-element">
                            <h4 className="form-h">Note</h4>
                            <input name="filter" id="filter" className="selectpicker form-control" placeholder="Search by note" />
                        </div>
                    </div>
                </div>
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
)(Filters as any) as typeof Filters;
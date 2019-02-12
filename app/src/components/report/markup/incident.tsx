import * as React from 'react'
import Moment from 'react-moment'
import * as style from '../constants'
import * as types from '../../../store/types'

type props = {
    incident: types.incident
}

export default class Incident extends React.Component<props, any> {

    public render() {
        const {
            callOrigin,
            citationNumber,
            date,
            modifiedBy,
            note,
            officerInitials,
            ownersLastName,
            ownersFirstName,
            ownersTelephoneNumber,
            pghCode,
            reasonForVisit,
            submittedBy
        } = this.props.incident

        return (
            <div className='col-lg-6 col-md-12'>
                <table className="table" id="incidenttable">
                    <tbody>
                        <tr>
                            <th style={style.borderNone} scope="row">Reason(s) For visit</th>
                            <td style={style.borderNone}>{reasonForVisit}</td>
                        </tr>
                        <tr>
                            <th scope="row">Date</th>
                            <td><Moment format="MM/DD/YYYY HH:mm" date={date} /></td>
                        </tr>
                        <tr>
                            <th scope="row">Owners name</th>
                            <td>{ownersFirstName} {ownersLastName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Telephone number</th>
                            <td>{ownersTelephoneNumber}</td>
                        </tr>
                        <tr>
                            <th scope="row">Call origin</th>
                            <td>{callOrigin}</td>
                        </tr>
                        <tr>
                            <th scope="row">PGH code(s)</th>
                            <td>{pghCode}</td>
                        </tr>
                        <tr>
                            <th scope="row">Citation number</th>
                            <td>{citationNumber}</td>
                        </tr>
                        <tr>
                            <th scope="row">Officers involved</th>
                            <td>{officerInitials}</td>
                        </tr>
                        <tr>
                            <th scope="row">Submitted by</th>
                            <td>{submittedBy}</td>
                        </tr>
                        <tr>
                            <th scope="row">Last modified by</th>
                            <td>{modifiedBy}</td>
                        </tr>
                        <tr>
                            <th scope="row">Note</th>
                            <td>{note}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
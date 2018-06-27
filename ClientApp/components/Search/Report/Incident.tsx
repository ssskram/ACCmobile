import * as React from 'react';

export default class Incident extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    public render() {
        const {
            address,
            callOrigin,
            citationNumber,
            comments,
            date,
            modifiedBy,
            note,
            officerInitials,
            ownersLastName,
            ownersFirstName,
            ownersTelephoneNumber,
            pghCode,
            reasonForVisit,
            submittedBy,
            zip
        } = this.props.incident
        return (
            <div>
                <h2 className='text-center'>{address}</h2>
                <table className="table" id="incidenttable">
                    <tbody>
                        <tr>
                            <th scope="row">Date</th>
                            <td>{date}</td>
                        </tr>
                        <tr>
                            <th scope="row">Zip code</th>
                            <td>{zip}</td>
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
                            <th scope="row">Reason(s) For visit</th>
                            <td>{reasonForVisit}</td>
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
                <h3>Comments:</h3>
                <div>{comments}</div>
            </div>
        );
    }
}
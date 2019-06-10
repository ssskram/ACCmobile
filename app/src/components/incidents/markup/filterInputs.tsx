import * as React from "react";
import * as constants from "../constants";
import Input from "../../formElements/input";
import Select from "../../formElements/select";
import Datepicker from "../../formElements/date";

type props = {
  showFilters: boolean;
  state: any;
  setState: (stateObj: object) => void;
};

export default class FilterInputs extends React.Component<props, {}> {
  public render() {
    const {
      reasonOptions,
      address,
      status,
      ownersName,
      date,
      clearDate,
      reasonForVisit,
      note
    } = this.props.state;

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <Input
              value={address}
              header=""
              placeholder="Search address"
              callback={e => this.props.setState({ address: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <Select
              value={status ? { value: status, label: status } : ""}
              header=""
              placeholder="Flter by status"
              onChange={status => this.props.setState({ status: status.value })}
              multi={false}
              options={constants.statuses}
            />
          </div>
        </div>
        {this.props.showFilters == true && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <Datepicker
                  value={date}
                  clearDate={clearDate}
                  header=""
                  placeholder="Filter by date"
                  callback={date =>
                    this.props.setState({
                      date: date.target.value,
                      clearDate: false
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <Select
                  value={
                    reasonForVisit
                      ? { value: reasonForVisit, label: reasonForVisit }
                      : ""
                  }
                  header=""
                  placeholder="Filter by reason"
                  onChange={reasonForVisit =>
                    this.props.setState({
                      reasonForVisit: reasonForVisit.value
                    })
                  }
                  multi={false}
                  options={reasonOptions}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Input
                  value={ownersName}
                  header=""
                  placeholder="Search owner's last name"
                  callback={e =>
                    this.props.setState({ ownersName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <Input
                  value={note}
                  header=""
                  placeholder="Search notes"
                  callback={e => this.props.setState({ note: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

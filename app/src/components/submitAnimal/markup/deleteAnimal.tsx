import * as React from "react";
import deleteAnimal from "../functions/deleteAnimal";
import Spinner from "../../utilities/spinner";
import updateIncident from "../../submitIncident/functions/putIncident";
import * as types from "../../../store/types";

type props = {
    spId: number;
    user: types.user;
    animal: any;
}

type state = {
    spinner: boolean
}

export default class DA extends React.Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false
    };
  }

  async delete() {
    this.setState({
      spinner: true
    });
    await deleteAnimal(this.props.animal);
    await updateIncident(
      JSON.stringify({
        Id: this.props.spId,
        ModifiedBy: this.props.user.email
      })
    );
    location.reload();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12 text-center">
          <br />
          <h3>Are you sure you want to delete this animal?</h3>
          <button className="btn btn-danger" onClick={this.delete.bind(this)}>
            Delete
          </button>
        </div>
        {this.state.spinner && <Spinner notice="...deleting animal..." />}
      </div>
    );
  }
}

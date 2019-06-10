import * as React from "react";
import "react-table/react-table.css";
import * as types from "../../../store/types";
import * as style from "../constants";
import Paging from "../../utilities/paging";
const placeholder = require("../../../images/image-placeholder.png");

type props = {
  currentPage: number;
  incidentsPerPage: number;
  incidents: types.incident[];
  setState: (stateObj: object) => void;
};

export default class Cards extends React.Component<props, {}> {
  public render() {
    const { currentPage, incidentsPerPage, incidents } = this.props;

    const status = incident => (
      <div>
        {incident.open === "Yes" && <h4 className="open">Open incident</h4>}
        {incident.open === "No" && <h4>Closed incident</h4>}
        {incident.open == null && <h4>Scanned document</h4>}
      </div>
    );

    // Logic for paging
    const indexOfLastIncident = currentPage * incidentsPerPage;
    const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
    const currentIncidents = incidents.slice(
      indexOfFirstIncident,
      indexOfLastIncident
    );
    const renderIncidents = currentIncidents.map((incident, index) => {
      if (incident.coords) {
        var coords = incident.coords.replace("(", "").replace(")", "");
        var url =
          "https://maps.googleapis.com/maps/api/streetview?size=150x150&location=" +
          coords +
          "&fov=60&heading=235&pitch=10&key=AIzaSyCPaIodXvOSQXvlUMj0iy8WbxzmC-epiO4";
      } else {
        var url = placeholder as string;
      }
      return (
        <div className="container-fluid" key={index}>
          <div className="row">
            <div className="incident">
              <div
                onClick={() => window.open(incident.link, "_blank")}
                className="panel panel-button"
              >
                <div className="panel-body text-center vertCenter">
                  <div className="col-md-3 hidden-sm hidden-xs">
                    <img style={style.imgStyle} src={url} />
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12 ubuntu">
                    <div className="hidden-md hidden-lg hidden-xl text-center">
                      {status(incident)}
                    </div>
                    <div style={style.address} className="oswald-header">
                      {incident.address}
                    </div>
                    <h5>{incident.date}</h5>
                    <h4>{incident.reasonForVisit}</h4>
                    <div
                      style={{
                        fontSize: ".8em",
                        textTransform: "uppercase" as "uppercase"
                      }}
                    >
                      Incident ID: {incident.itemId}{" "}
                    </div>
                    <div className="hidden-md hidden-lg hidden-xl">
                      {incident.note != null && (
                        <div>
                          <b>Note:</b> {incident.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3 hidden-sm hidden-xs text-center">
                    {status(incident)}
                    {incident.note && (
                      <div style={style.noteContainer}>
                        <div>
                          <strong>Note:</strong>
                        </div>
                        <div>{incident.note}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    // Logic for displaying page numbers
    const pageNumbers: any[] = [];
    for (let i = 1; i <= Math.ceil(incidents.length / incidentsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div>
        {renderIncidents}
        <Paging
          countIncidents={incidents}
          currentPage={currentPage}
          totalPages={pageNumbers}
          next={() =>
            this.props.setState({ currentPage: this.props.currentPage + 1 })
          }
          prev={() =>
            this.props.setState({ currentPage: this.props.currentPage - 1 })
          }
        />
      </div>
    );
  }
}

import Format from "date-format";

export default function filter(state, props) {
  if (state.address) {
    var address = state.address.toLowerCase();
  }
  if (state.date) {
    var date = new Date(state.date);
    var formattedDate = Format("MM/dd/yyyy", date);
  }
  if (state.ownersName) {
    var ownersName = state.ownersName.toLowerCase();
  }
  if (state.status) {
    var open = state.status.toLowerCase();
  }
  if (state.reasonForVisit) {
    var reasonForVisit = state.reasonForVisit.toLowerCase();
  }
  if (state.note) {
    var note = state.note.toLowerCase();
  }
  var filtered = props.incidents.filter(function(item) {
    if (address) {
      if (!item.address.toLowerCase().includes(address)) {
        return false;
      }
    }
    if (formattedDate) {
      if (!item.date.includes(formattedDate)) {
        return false;
      }
    }
    if (ownersName) {
      if (item.ownersLastName) {
        if (!item.ownersLastName.toLowerCase().includes(ownersName)) {
          return false;
        }
      } else if (!item.ownersLastName) {
        return false;
      }
    }
    if (open) {
      if (item.open) {
        if (!item.open.toLowerCase().includes(open)) {
          return false;
        }
      } else if (!item.open) {
        return false;
      }
    }
    if (reasonForVisit) {
      if (item.reasonForVisit) {
        if (!item.reasonForVisit.toLowerCase().includes(reasonForVisit)) {
          return false;
        }
      } else if (!item.reasonForVisit) {
        return false;
      }
    }
    if (note) {
      if (item.note) {
        if (!item.note.toLowerCase().includes(note)) {
          return false;
        }
      } else if (!item.note) {
        return false;
      }
    }
    return true;
  });
  return filtered;
}

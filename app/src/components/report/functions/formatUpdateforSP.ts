export default function formatSPLoad(incident, user) {
    const data = {
        Id: incident.itemId,
        Open: incident.open,
        ModifiedBy: user.email,
        AddressID: incident.coords,
        Address: incident.address,
    }
    return data
}
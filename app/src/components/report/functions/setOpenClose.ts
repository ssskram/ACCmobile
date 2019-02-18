export default function formatSPLoad(incident, user) {
    const data = {
        Id: incident.itemId,
        Open: incident.open,
        ModifiedBy: user.email
    }
    return data
}
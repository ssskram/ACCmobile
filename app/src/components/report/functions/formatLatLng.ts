export default function formatLatLng(data) {
    const lat = data.coords.substring(
        data.coords.lastIndexOf("(") + 1,
        data.coords.lastIndexOf(",")
    )
    const lng = data.coords.substring(
        data.coords.lastIndexOf(" ") + 1,
        data.coords.lastIndexOf(")")
    )
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)
    const lat_lng = { lat: latitude, lng: longitude }
    return lat_lng
}
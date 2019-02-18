export default function dropdownsLoaded(props) {
    return Object.keys(props.dropdowns).every(x => props.dropdowns[x].length == 0)
}
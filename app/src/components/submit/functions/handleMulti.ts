
export function selected(v) {
    const stringArray = v.split(', ')
    const items = [] as any
    stringArray.forEach(item => {
        const obj = { value: item, label: item }
        items.push(obj)
    })
    return items
}

export function update(items) {
    return items.map(elem => elem.value).join(', ')
}
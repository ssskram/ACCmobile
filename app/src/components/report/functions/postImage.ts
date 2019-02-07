export default async function postImage(image, itemId) {

    // read file
    let reader = await new FileReader()
    reader.onload = processFile(image[0])
    await reader.readAsDataURL(image[0])

    function processFile(theFile) {
        return async function (e) {
            const cleanedName = image[0].name.replace(/[,"+/()'\s]/g, '')
            console.log(e.target.result)

            await fetch('http://localhost:3000/accMobile/attachment?itemId=' + itemId + '&filename=' + cleanedName, {
                method: 'POST',
                body: e.target.result,
                headers: new Headers({
                    'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
                })
            })
        }

    }

    // // once complete, post image
    // const cleanedName = image[0].name.replace(/[,"+/()'\s]/g, '')
    // await fetch('http://localhost:3000/accMobile/attachment?itemId=' + itemId + '&filename=' + cleanedName, {
    //     method: 'POST',
    //     body: image[0],
    //     headers: new Headers({
    //         'Authorization': 'Bearer ' + process.env.REACT_APP_365_API
    //     })
    // })
}
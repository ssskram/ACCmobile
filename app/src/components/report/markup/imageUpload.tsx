import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
import ImageUploader from 'react-images-upload'
import postImage from '../functions/postImage'

type props = {
    incident: types.incident
}

type state = {
    image: Array<any>
}

export default class ImageUpload extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            image: []
        }
    }

    async post() {
        await postImage(this.state.image, this.props.incident.itemId)
        // location.reload()
    }

    render() {
        let imgButton
        if (this.state.image.length == 0) {
            imgButton = { display: 'block' }
        } else {
            imgButton = { display: 'none' }
        }

        return (
            <div className='text-center'>
                <ImageUploader
                    buttonStyles={imgButton}
                    withIcon={true}
                    buttonText='Click here to attach an image'
                    onChange={image => this.setState({ image })}
                    imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                    withLabel={false}
                    maxFileSize={5242880}
                    withPreview={true}
                    singleImage={true}
                />
                <button disabled={this.state.image.length == 0} onClick={this.post.bind(this)} className='btn btn-success'>Save image</button>
            </div>
        )
    }
}
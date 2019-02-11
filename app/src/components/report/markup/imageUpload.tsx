import * as React from 'react'
import * as types from '../../../store/types'
import ImageUploader from 'react-images-upload'
import postImage from '../functions/postImage'
import Input from '../../formElements/input'
import Textarea from '../../formElements/textarea'

type props = {
    incident: types.incident
    setState: (stateObj: object) => void
}

type state = {
    image: Array<any>,
    imageTitle: string
    imageDescription: string
}

export default class ImageUpload extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            imageTitle: '',
            imageDescription: '',
            image: []
        }
    }

    async post() {
        this.props.setState({ submitSpinner: true })
        await postImage(this.state, this.props.incident.uuid)
        location.reload()
    }

    render() {
        let imgButton
        if (this.state.image.length == 0) {
            imgButton = { display: 'block' }
        } else {
            imgButton = { display: 'none' }
        }

        const isEnabled =
            this.state.image.length != 0 &&
            this.state.imageTitle != ''

        return (
            <div>
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
                <br />
                <Input
                    value={this.state.imageTitle}
                    header="Title"
                    placeholder="Image title"
                    callback={e => this.setState({ imageTitle: e.target.value })}
                    required
                />
                <Textarea
                    value={this.state.imageDescription}
                    header="Description"
                    placeholder="Image description"
                    callback={e => this.setState({ imageDescription: e.target.value })}
                />
                <div className='text-center'>
                    <button disabled={!isEnabled} onClick={this.post.bind(this)} className='btn btn-success'>Save image</button>
                </div>
            </div>
        )
    }
}
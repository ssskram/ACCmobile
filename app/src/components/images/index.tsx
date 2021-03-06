import * as React from 'react'
import * as types from '../../store/types'
import Gallery from 'react-grid-gallery'
import getImages from '../report/functions/getImages'
import Modal from 'react-responsive-modal'
import ImageUpload from './markup/imageUpload'
import Spinner from '../utilities/spinner'
import DeleteImage from './markup/deleteImage'

type props = {
    incident: types.incident
}

type state = {
    isOpen: boolean
    images: Array<any>
    imageUpload: boolean
    submitSpinner: boolean
    currentImage: number
}

export default class Images extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            images: [],
            currentImage: 0,
            imageUpload: false,
            submitSpinner: false
        }
    }

    async componentDidMount() {
        const imageMeta = await getImages(this.props.incident.uuid)
        let imageState = [] as any
        imageMeta.forEach(image => {
            const obj = {
                src: "https://blobby.blob.core.usgovcloudapi.net/accmobile/" + image.relativePath,
                thumbnail: "https://blobby.blob.core.usgovcloudapi.net/accmobile/" + image.relativePath,
                name: image.relativePath,
                itemId: image.itemId,
                thumbnailWidth: 400,
                thumbnailHeight: 300,
                caption: image.imageDescription,
                thumbnailCaption: image.imageTitle
            }
            imageState.push(obj)
        })
        this.setState({
            images: imageState
        })
    }

    render() {
        return (
            <div className='row' style={{ marginTop: '75px', marginBottom: '100px' }}>
                <div>
                    <span style={{ fontSize: '1.7em' }}>Images</span>
                    <button style={{ marginTop: '-8px' }} onClick={() => this.setState({ imageUpload: true })} className='btn btn-secondary pull-right'><span className='glyphicon glyphicon-plus'></span></button>
                </div>
                <hr />
                {this.state.images.length > 0 &&
                    <Gallery
                        images={this.state.images}
                        enableLightbox={true}
                        enableImageSelection={false}
                        currentImageWillChange={index => this.setState({ currentImage: index })}
                        customControls={[<DeleteImage image={this.state.images[this.state.currentImage]} />]}
                    />
                }
                {this.state.images.length == 0 &&
                    <div className='text-center'>
                        <br />
                        <h4>No images on this incident</h4>
                        <br />
                    </div>
                }
                {this.state.imageUpload == true &&
                    <Modal
                        open={true}
                        onClose={() => this.setState({ imageUpload: false })}
                        closeOnEsc={false}
                        classNames={{
                            overlay: 'custom-overlay',
                            modal: 'custom-modal'
                        }}
                        center>
                        <ImageUpload
                            setState={this.setState.bind(this)}
                            incident={this.props.incident}
                        />
                    </Modal>
                }
                {this.state.submitSpinner &&
                    <Spinner notice='...saving image...' />
                }
            </div>
        )
    }
}
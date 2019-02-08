import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
import Gallery from 'react-grid-gallery'
import getImages from '../functions/getImages'
import Modal from 'react-responsive-modal'
import ImageUpload from './imageUpload'

type props = {
    incident: types.incident
}

type state = {
    isOpen: boolean
    images: Array<any>
    imageUpload: boolean
}

export default class Images extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            images: [],
            imageUpload: false
        }
    }

    async componentDidMount() {
        const imageMeta = await getImages(this.props.incident.uuid)
        let imageState = [] as any
        imageMeta.forEach(image => {
            const obj = {
                src: image.imageUrl,
                thumbnail: image.imageUrl,
                thumbnailWidth: 400,
                thumbnailHeight: 300,
                caption: image.imageDescription,
                thumnailCaption: image.imageTitle
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
                    <span style={{ fontSize: '2em' }}>Images</span>
                    <button style={{ marginTop: '-2px' }} onClick={() => this.setState({ imageUpload: true })} className='btn btn-secondary pull-right'><span className='glyphicon glyphicon-plus'></span></button>
                </div>
                <hr />
                {this.state.images.length > 0 &&
                    <Gallery images={this.state.images} />
                }
                {this.state.images.length == 0 &&
                    <div className='text-center'>
                        <br />
                        <h3>No images on this incident</h3>
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
                        <ImageUpload incident={this.props.incident} />
                    </Modal>
                }
            </div>
        )
    }
}
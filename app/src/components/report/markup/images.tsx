import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
import Gallery from 'react-grid-gallery'
import getImages from '../functions/getImages'

type props = {
    incident: types.incident
}

type state = {
    isOpen: boolean
    images: Array<any>
}

export default class Images extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            images: []
        }
    }

    async componentDidMount() {
        const images = await getImages(this.props.incident.itemId)
        let imageState = [] as any
        images.forEach(image => {
            const obj = {
                src: "https://cityofpittsburgh.sharepoint.com" + image.relativeUrl,
                thumbnail: "https://cityofpittsburgh.sharepoint.com" + image.relativeUrl,
                thumbnailWidth: 250,
                thumbnailHeight: 250
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
                    <button style={{ marginTop: '-2px' }} className='btn btn-secondary pull-right'><span className='glyphicon glyphicon-plus'></span></button>
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
            </div>
        )
    }
}
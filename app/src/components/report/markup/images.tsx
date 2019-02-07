import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
import Gallery from 'react-grid-gallery'

type props = {
    incident: types.incident
}

type state = {
    isOpen: boolean
}

const IMAGES =
    [{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
    },
    {
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
    },

    {
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212
    }]

export default class Images extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: true
        }
    }

    render() {
        return (
            <div className='row' style={{ marginTop: '75px', marginBottom: '100px' }}>
                <div>
                    <span style={{ fontSize: '2em' }}>Images</span>
                    <button style={{ marginTop: '-2px' }} className='btn btn-secondary pull-right'><span className='glyphicon glyphicon-plus'></span></button>
                </div>
                <hr />
                <Gallery images={IMAGES} />
            </div>
        )
    }
}
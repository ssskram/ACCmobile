import * as React from 'react'
import * as style from '../constants'
import * as types from '../../../store/types'
import { subscribeToActivity } from '../../../sockets/comments'
import { animateScroll } from "react-scroll"
import * as moment from 'moment'
import { SpeechBubble } from 'react-kawaii'
import postComment from '../functions/postComment'

type props = {
    incident: types.incident
    user: types.user
}

type state = {
    comments: types.comment[],
    comment: string
}

export default class Comments extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            comment: ''
        }
        subscribeToActivity((err, comments) => this.setState({ comments }), this.props.incident.uuid)
    }

    componentDidMount() {
        this.scrollDown()
    }

    componentWillReceiveProps(nextProps) {
        this.scrollDown()
    }

    componentDidUpdate() {
        this.scrollDown()
    }

    scrollDown() {
        animateScroll.scrollToBottom({
            containerId: "scrollTo"
        })
    }

    keyPress(e) {
        if (e.keyCode == 13) {
            if (this.state.comment != '') {
                this.post()
            }
        }
    }

    post() {
        if (this.state.comment != '') {
            const load = {
                dateTime: moment().format('MM/DD/YYYY, hh:mm:ss A'),
                incidentID: this.props.incident.uuid,
                user: this.props.user.name,
                comment: this.state.comment
            }
            this.setState({
                comments: [...this.state.comments, load],
                comment: ''
            })
            postComment(load)
        }
    }

    render() {
        const comments = this.state.comments
            .sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime))

        return (
            <div className='row' style={{ marginTop: '50px' }}>
                <div style={{ fontSize: '1.7em' }}>
                    Comments
                </div>
                <hr />
                <div style={{ paddingLeft: '5px' }}>
                    <div style={style.activityContainer} id='scrollTo'>
                        {this.props.user && comments.length > 0 &&
                            comments.map((item, index) => {
                                if (this.props.user.name != item.user) {
                                    return (
                                        <div key={index} className='col-md-12' style={{ margin: '8px' }}>
                                            <div className='row'>
                                                <div style={style.otherActivity} className='speech-bubble-right pull-right'>
                                                    <span style={{ margin: '10px' }}>{item.comment}</span><br />
                                                    {item.user &&
                                                        <div>
                                                            <span style={style.smallFont}><span style={{ fontSize: '.85em' }} className='glyphicon glyphicon-user nav-glyphicon'></span>{item.user}</span><br />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {item.user &&
                                                <div className='row'>
                                                    <div className='pull-right'>
                                                        <span style={{ fontSize: '.8em', color: '#fff' }}>{item.dateTime}</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className='col-md-12' style={{ margin: '8px' }}>
                                            <div className='row'>
                                                <div style={style.myActivity} className='speech-bubble-left pull-left'>
                                                    <span style={{ margin: '10px' }}>{item.comment}</span><br />
                                                </div>
                                            </div>
                                            {item.user &&
                                                <div className='row'>
                                                    <div className='pull-left'>
                                                        <span style={{ fontSize: '.8em', color: '#fff' }}>{item.dateTime}</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                            })
                        }
                        {this.props.user && comments.length == 0 &&
                            <div className='col-md-12 text-center' style={{ margin: '20px 0px' }}>
                                <SpeechBubble size={150} mood="sad" color="#d9edf7" />
                                <div className='alert alert-info' style={{ maxWidth: '300px', margin: '0 auto' }}>
                                    <span style={{ fontSize: '1.2em' }}><i>No comments here</i></span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div style={{ paddingLeft: '5px' }}>
                    <input value={this.state.comment} onKeyDown={this.keyPress.bind(this)} onChange={e => this.setState({ comment: e.target.value })} className='chatInput' placeholder={'New comment'}></input>
                    <button className='chatButton btn' onClick={this.post.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }
}
import * as React from 'react'
import * as types from '../../../store/types'
import Modal from 'react-responsive-modal'
import Textarea from '../../formElements/textarea'

type props = {
    comment: types.comment
    putComment: (comment: object, id: number) => void
    setState: (state: object) => void
}

type state = {
    comment: string
}

export default class EditComment extends React.Component<props, state> {
    constructor(props: props) {
        super(props)
        this.state = {
            comment: props.comment.comment
        }
    }

    put() {
        const comment = {
            dateTime: this.props.comment.dateTime,
            incidentID: this.props.comment.incidentID,
            user: this.props.comment.user,
            comment: this.state.comment
        }
        this.props.putComment(comment, this.props.comment.commentId)
        this.props.setState({ selectedComment: undefined })
    }

    render() {         
        return (
            <Modal
                open={true}
                onClose={() => this.props.setState({ selectedComment: undefined })}
                classNames={{
                    overlay: 'custom-overlay',
                    modal: 'custom-modal'
                }}
                showCloseIcon={true}
                center>
                <div>
                    <Textarea
                        header='Edit comment'
                        value={this.state.comment}
                        placeholder="Comment"
                        callback={e => this.setState({ comment: e.target.value })}
                    />
                    <div className='text-center'><button className='btn btn-success' disabled={this.state.comment == ''} onClick={this.put.bind(this)}>Save</button></div>
                </div>
            </Modal>
        )
    }
}
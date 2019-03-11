import * as React from 'react'
import Cleave from 'cleave.js/react'

export default class Date extends React.Component<any, any> {

    public render() {
        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h5 className="form-h4">{this.props.header}{this.props.required == true && <span style={{ color: 'red', fontSize: '20' }}>*</span>}</h5>
                    <Cleave type='search'
                        className='form-control'
                        options={{ date: true }}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        onChange={this.props.callback.bind(this)}>
                    </Cleave>
                </div>
            </div >
        )
    }
}

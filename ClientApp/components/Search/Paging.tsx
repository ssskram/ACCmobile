import * as React from 'react';

// props for pagination:
// https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

export default class Paging extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    public render() {
        const {
            modalIsOpen,
            currentPage,
            totalPages,
            prev,
            next,
            countIncidents
        } = this.props

        return (
            <div>
                {(modalIsOpen == false) && (countIncidents.length > 10) &&
                    <div>
                        {(currentPage - 1 == 0) && (totalPages.includes(currentPage + 1)) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={prev.bind(this)} disabled>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={next.bind(this)}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {(currentPage - 1 > 0) && (totalPages.includes(currentPage + 1)) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={prev.bind(this)}>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={next.bind(this)}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {!totalPages.includes(currentPage + 1) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={prev.bind(this)}>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn btn-secondary' onClick={next.bind(this)} disabled>Next</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
                <br/>
                <br/>
            </div>
        );
    }
}


import * as React from 'react'
import UpdateAnimal from '../../submitAnimal'
import Modal from 'react-responsive-modal'
import DeleteAnimal from '../../submitAnimal/markup/deleteAnimal'
import AnimalCard from './animalCard'

type props = {
    throwSpinner: () => void
    incidentID: string
    address: string
    coords: object
    animals: Array<any>
}

type state = {
    modalIsOpen: boolean,
    deleteAnimal: boolean,
    addAnimal: boolean,
    animalToUpdate: object
}

export default class Animals extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            deleteAnimal: false,
            addAnimal: false,
            animalToUpdate: {}
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            deleteAnimal: false,
            addAnimal: false,
            animalToUpdate: {}
        })
    }

    editAnimal(animal) {
        this.setState({
            modalIsOpen: true,
            animalToUpdate: animal
        })
    }

    deleteAnimal(animal) {
        this.setState({
            deleteAnimal: true,
            modalIsOpen: true,
            animalToUpdate: animal
        })
    }

    addAnimal() {
        this.setState({
            addAnimal: true,
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen,
            deleteAnimal,
            addAnimal,
            animalToUpdate
        } = this.state

        return (
            <div className='row' style={{ marginTop: '75px' }}>
                <div>
                    <span style={{ fontSize: '1.7em' }}>Animals</span>
                    <button style={{ marginTop: '-8px' }} className='btn btn-secondary pull-right' onClick={this.addAnimal.bind(this)}><span className='glyphicon glyphicon-plus'></span></button>
                </div>
                <hr />
                {this.props.animals.length == 0 &&
                    <div className='text-center'>
                        <br />
                        <h4>No animals on this incident</h4>
                        <br />
                    </div>
                }
                {this.props.animals.map((animal, key) =>
                    <AnimalCard
                        animal={animal}
                        index={key}
                        editAnimal={this.editAnimal.bind(this)}
                        deleteAnimal={this.deleteAnimal.bind(this)}
                    />
                )}
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    closeOnEsc={false}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {/* update animal */}
                    {deleteAnimal == false && addAnimal == false &&
                        <div>
                            <h3 className='text-center'>Edit animal</h3>
                            <UpdateAnimal
                                throwSpinner={this.props.throwSpinner.bind(this)}
                                incidentID={this.props.incidentID}
                                address={this.props.address}
                                coords={this.props.coords}
                                animal={animalToUpdate}
                                put={true} />
                        </div>
                    }
                    {/* add animal */}
                    {deleteAnimal == false && addAnimal == true &&
                        <div>
                            <h3 className='text-center'>Add animal</h3>
                            <UpdateAnimal
                                throwSpinner={this.props.throwSpinner.bind(this)}
                                incidentID={this.props.incidentID}
                                address={this.props.address}
                                coords={this.props.coords}
                                animal={animalToUpdate}
                                add={true} />
                        </div>
                    }
                    {/* delete animal */}
                    {deleteAnimal == true &&
                        <DeleteAnimal throwSpinner={this.props.throwSpinner.bind(this)} animal={animalToUpdate} />
                    }
                </Modal>
            </div>
        );
    }
}
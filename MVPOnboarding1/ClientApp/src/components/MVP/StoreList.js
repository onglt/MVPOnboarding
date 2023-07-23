import React, { Component } from 'react';
import { Modal, Button, Label, Icon, Form } from "semantic-ui-react";
import './MyComponent.css'
import $ from 'jquery';
import CustomAlert from './CustomAlert';


export class StoreList extends Component {
    static displayName = StoreList.name;

    constructor(props) {
        super(props);

        this.state = {
            stores: [], loading: true,
            sales: [],
            modalTitle: "",
            StoreId: 0,
            formData: {},
            modalOpenCreate: false,
            modalOpenEdit: false,
            modalOpenDelete: false,

            fields: {
                storeName: "",
                storeAddress: "",
            },
        };

    }



    handleOpenCreate = () => this.setState({ modalOpenCreate: true });

    handleCloseCreate = () => {
        this.setState({ modalOpenCreate: false });        
        this.setState({ fields: "" });
        this.refreshList();
    }

    handleChangeCreate = (e) => {
        const newFields = { ...this.state.fields, [e.target.name]: e.target.value };
        this.setState({ fields: newFields });
    };



    handleSubmitCreate() {
        var formData = {
            name: $('#myForm input[name=storeName]').val(),
            address: $('#myForm input[name=storeAddress]').val()
        };

        $.ajax({
            url: '/api/stores',
            type: 'POST',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(formData),

            

        })
            
            .then((result) => {                
                this.setState({ showModal: true, alertMessage: 'Store added successfully.', alertTextColor: '' });
                this.refreshList();
            }, (error) => {                
                this.setState({ showModal: true, alertMessage: 'Store add failed!', alertTextColor: 'red' });
            })
        this.handleCloseCreate();
    };


    handleOpenEdit = (storeId, storeName, storeAddress) => {
        this.setState({
            modalOpenEdit: true,
            selectedStoreId: storeId,
            selectedStoreName: storeName,
            selectedStoreAddress: storeAddress,

        });
    };

    handleCloseEdit = () => {
        this.setState({
            modalOpenEdit: false,
            selectedStoreId: null,
            selectedStoreName: '',
            selectedStoreAddress: '',
        });
        this.refreshList();
    }

    handleChangeEdit = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
        
    };

    handleSubmitEdit = () => {
        this.setState({ formData: {} });
        const { selectedStoreId } = this.state;
        const { selectedStoreName } = this.state;
        const { selectedStoreAddress } = this.state;              

        const requestData = {
            Id: selectedStoreId,
            Name: $('#myFormEdit input[name=selectedStoreName]').val(),
            Address: $('#myFormEdit input[name=selectedStoreAddress]').val()
        };

        $.ajax({
            url: 'https://localhost:7063/api/stores/' + selectedStoreId,
            type: 'PUT',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            dataType: 'json',
            success: (response) => {                
                this.setState({ showModal: true, alertMessage: 'Store updated successfully.', alertTextColor: '' });
                this.refreshList();
            },
            error: (error) => {                
                this.setState({ showModal: true, alertMessage: 'Store update failed!', alertTextColor: 'red' });                
            },
        })
        this.handleCloseEdit();

    };

    handleOpenDelete = (storeId, storeName) => {
        this.setState({
            modalOpenDelete: true,
            selectedStoreId: storeId,
            selectedStoreName: storeName,

        });
    };

    handleCloseDelete = () => {
        this.setState({
            modalOpenDelete: false,
            selectedStoreId: null,
            selectedStoreName: ""
        });
        this.refreshList();
    }

    handleSubmitDelete = () => {

        const { selectedStoreId } = this.state;

        const storeExistsInSales = this.state.sales.some(
            (sale) => sale.storeId === selectedStoreId
        );

        if (storeExistsInSales) {
            // Store exists in sales, prevent deletion and show a message
            this.setState({ showModal: true, alertMessage: 'Cannot delete store - it exists in one or more sales records!', alertTextColor: 'red' });
            this.handleCloseDelete();
        } else {

            $.ajax({
                url: 'https://localhost:7063/api/stores/' + selectedStoreId,
                type: 'DELETE',
                accept: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(selectedStoreId),
                dataType: 'json',
                success: (response) => {                    
                    this.setState({ showModal: true, alertMessage: 'Store deleted successfully.', alertTextColor: '' });                    
                    this.refreshList();
                },
                error: (error) => {                    
                    this.setState({ showModal: true, alertMessage: 'Store delete failed!', alertTextColor: 'red' });                    
                },
            })
        }
        this.handleCloseDelete();

    };

    handleAlertClose = () => {
        this.setState({ showModal: false, alertMessage: '', alertTextColor: undefined });
    };

    refreshList() {
        fetch('api/stores/')
            .then(response => response.json())
            .then(data => {
                this.setState({ stores: data });
            });
    }


    componentDidMount() {
        this.populateStoreData();
    }


    static renderStoreTable(stores, handleOpenEdit, handleCloseEdit, modalOpenEdit, handleSubmitEdit, handleOpenDelete) {


        return (


            <div>


                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => <tr key={store.id}>
                            <td>{store.id}</td>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td><Label color='green' className='clickable-label' onClick={() => handleOpenEdit(store.id, store.name, store.address)}><Icon name='edit' />Edit</Label></td>
                            <td><Label color='red' className='clickable-label' onClick={() => handleOpenDelete(store.id, store.name)}><Icon name='trash alternate' />Delete</Label></td>
                        </tr>

                        )}
                    </tbody>
                </table>
            </div>


        );
    }


    render() {


        const { fields } = this.state;

        const { stores, modalOpenEdit, selectedStoreId, selectedStoreName, selectedStoreAddress } = this.state;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : StoreList.renderStoreTable(this.state.stores, this.handleOpenEdit, this.handleCloseEdit, this.state.modalOpenEdit, this.handleSubmitEdit, this.handleOpenDelete);

        return (
            <div>
                {this.state.showModal && (
                    <CustomAlert message={this.state.alertMessage} onClose={this.handleAlertClose} textColor={this.state.alertTextColor} />
                )}

                <div>
                    <Button color="blue" onClick={this.handleOpenCreate}>Create Store</Button>

                    <Modal
                        open={this.state.modalOpenCreate}
                        onClose={this.handleCloseCreate}
                        closeOnEscape={false} closeOnDimmerClick={false}
                    >
                        <Modal.Header>Create Store</Modal.Header>

                        <Modal.Content>
                            <Form id="myForm" onSubmit={(e) => {
                                this.handleSubmitCreate(e);                                
                            }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="storeName"
                                    label="Name"
                                    placeholder="Enter a store name (max. 50 chars)"
                                    value={fields.storeName}
                                    onChange={this.handleChangeCreate}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="storeAddress"
                                    label="Address"
                                    placeholder="Enter a store address (max. 100 chars)"
                                    value={fields.storeAddress}
                                    onChange={this.handleChangeCreate}
                                />


                                <Button type="submit" color="blue">Create</Button>
                                <Button onClick={this.handleCloseCreate}>Cancel</Button>
                            </Form>
                           
                        </Modal.Content>

                        

                    </Modal>

                    <Modal
                        open={this.state.modalOpenEdit}
                        onClose={this.handleCloseEdit}
                        closeOnEscape={false} closeOnDimmerClick={false}
                    >
                        <Modal.Header>Edit Store</Modal.Header>

                        <Modal.Content>
                            <Form id="myFormEdit"
                                onSubmit={(e) => {
                                    this.handleSubmitEdit(e);                                    
                                }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="selectedStoreName"
                                    label="Name"
                                    placeholder="Enter a store name (max. 50 chars)"
                                    value={selectedStoreName}
                                    onChange={this.handleChangeEdit}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="selectedStoreAddress"
                                    label="Address"
                                    placeholder="Enter a store address (max. 100 chars)"
                                    value={selectedStoreAddress}
                                    onChange={this.handleChangeEdit}
                                />

                                <Button type="submit" color="blue">Edit</Button>
                                <Button onClick={this.handleCloseEdit}>Cancel</Button>

                            </Form>
                        </Modal.Content>
                    </Modal>

                    <Modal
                        open={this.state.modalOpenDelete}
                        onClose={this.handleCloseDelete}
                        closeOnEscape={false} closeOnDimmerClick={false}
                    >
                        <Modal.Header>Delete Store</Modal.Header>

                        <Modal.Content>

                            <p>Are you sure to delete store name: <b style={{ color: 'red' }}>{selectedStoreName}</b>?</p>


                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.handleSubmitDelete} color="red">Delete</Button>
                            <Button onClick={this.handleCloseDelete}>Cancel</Button>
                        </Modal.Actions>
                    </Modal>

                </div>

                <h1 id="tabelLabel">Store Details</h1>
                {contents}
            </div>

        );
    }

    async populateStoreData() {
        const response1 = await fetch('api/stores');
        const data1 = await response1.json();
        this.setState({ stores: data1, loading: false });

        const response2 = await fetch('api/sales');
        const data2 = await response2.json();
        this.setState({ sales: data2, loading: false });
    }

}




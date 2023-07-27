import React, { Component, useRef, useEffect } from 'react';
import { Modal, Button, Label, Icon, Form, Dropdown } from "semantic-ui-react";
import './MyComponent.css'
import $ from 'jquery';
import CustomAlert from './CustomAlert';


export class SaleList extends Component {
    static displayName = SaleList.name;

    constructor(props) {
        super(props);

        this.state = {
            sales: [], loading: true,
            customers: [],
            products: [],
            stores: [],
            SaleId: 0,
            formData: {},
            modalOpenCreate: false,
            modalOpenEdit: false,
            modalOpenDelete: false,
            selectedSaleId: 0,
            selectedCustomerId: 0,
            selectedProductId: 0,
            selectedStoreId: 0,
            selectedCustomerName: '',
            selectedProductName: '',
            selectedStoreName: '',
            selectedDateSold: '',


        };

    }


    handleOpenCreate = () => {
        this.setState({ modalOpenCreate: true });

    }

    handleCloseCreate = () => {
        this.setState({ modalOpenCreate: false });        
        this.setState({
            selectedSaleId: 0,
            selectedCustomerId: 0,
            selectedProductId: 0,
            selectedStoreId: 0,
            selectedDateSold: '',
        });
        this.refreshList();
    };

    handleChangeCreate1 = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };


    handleChangeCreate2 = (e, { name, value }) => {
        this.setState({
            [name]: value,
        });
    };


    handleSubmitCreate = () => {

        const { selectedSaleId } = this.state;
        const { selectedCustomerId } = this.state;
        const { selectedProductId } = this.state;
        const { selectedStoreId } = this.state;
        const { selectedDateSold } = this.state;

        const requestData = {
            Id: selectedSaleId,
            CustomerId: selectedCustomerId,
            ProductId: selectedProductId,
            StoreId: selectedStoreId,                      
        };



        $.ajax({
            url: '/api/sales',
            type: 'POST',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
        })

            .then((result) => {                
                this.setState({ showModal: true, alertMessage: 'Sale added successfully.', alertTextColor: '' });
                this.refreshList();
            }, (error) => {                
                this.setState({ showModal: true, alertMessage: 'Sale add failed!', alertTextColor: 'red' });
            })
        this.handleCloseCreate();
    };


    handleOpenEdit = (saleId, customerId, productId, storeId, dateSold) => {
        console.log(saleId);
        console.log(productId);
        console.log(dateSold);
        this.setState({
            modalOpenEdit: true,
            selectedSaleId: saleId,
            selectedCustomerId: customerId,
            selectedProductId: productId,
            selectedStoreId: storeId,
            selectedDateSold: dateSold,
        });

    };

    handleCloseEdit = () => {
        this.setState({
            modalOpenEdit: false,
            selectedSaleId: null,
            selectedCustomerId: null,
            selectedProductId: null,
            selectedStoreId: null,
            selectedDateSold: '',
        });
        this.refreshList();
    }


    handleChangeEdit1 = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };


    handleChangeEdit2 = (e, { name, value }) => {
        this.setState({
            [name]: value,
        });
    };


    handleSubmitEdit = () => {
        this.setState({ formData: {} });
        const { selectedSaleId } = this.state;
        const { selectedCustomerId } = this.state;
        const { selectedProductId } = this.state;
        const { selectedStoreId } = this.state;
        const { selectedDateSold } = this.state;

        const requestData = {
            Id: selectedSaleId,
            CustomerId: selectedCustomerId,
            ProductId: selectedProductId,
            StoreId: selectedStoreId,
            DateSold: selectedDateSold,
        };

        $.ajax({
            url: '/api/sales/' + selectedSaleId,
            type: 'PUT',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            dataType: 'json',
            success: (response) => {              
                this.setState({ showModal: true, alertMessage: 'Sale updated successfully.', alertTextColor: '' });                
                this.refreshList();
            },
            error: (error) => {                
                this.setState({ showModal: true, alertMessage: 'Sale update failed!', alertTextColor: 'red' });                
            },
        })
        this.handleCloseEdit();

    };

    handleOpenDelete = (saleId, customerName, productName, storeName, dateSold) => {
        this.setState({
            modalOpenDelete: true,
            selectedSaleId: saleId,
            selectedCustomerName: customerName,
            selectedProductName: productName,
            selectedStoreName: storeName,
            selectedDateSold: dateSold,

        });
    };

    handleCloseDelete = () => {
        this.setState({
            modalOpenDelete: false,
            selectedSaleId: null,
        });
        this.refreshList();
    }

    handleSubmitDelete = () => {

        const { selectedSaleId } = this.state;

        $.ajax({
            url: '/api/sales/' + selectedSaleId,
            type: 'DELETE',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(selectedSaleId),
            dataType: 'json',
            success: (response) => {                
                this.setState({ showModal: true, alertMessage: 'Sale deleted successfully.', alertTextColor: '' });                
                this.refreshList();
            },
            error: (error) => {                
                this.setState({ showModal: true, alertMessage: 'Sale delete failed!', alertTextColor: 'red' });                
            },
        })
        this.handleCloseDelete();

    };

    handleAlertClose = () => {
        this.setState({ showModal: false, alertMessage: '', alertTextColor: undefined });
    };

    refreshList() {
        fetch('api/sales/')
            .then(response => response.json())
            .then(data => {
                this.setState({ sales: data });
            });
    }


    componentDidMount() {
        this.populateSaleData();
    }


    static renderSaleTable(sales, handleOpenEdit, handleCloseEdit, modalOpenEdit, handleSubmitEdit, handleOpenDelete) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Store</th>
                            <th>Date Sold</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => <tr key={sale.id}>
                            <td>{sale.id}</td>
                            <td>{sale.customerName}</td>
                            <td>{sale.productName}</td>
                            <td>{sale.storeName}</td>
                            <td>{sale.dateSold}</td>
                            <td></td>
                            <td></td>
                            <td><Label color='green' className='clickable-label' onClick={() => handleOpenEdit(sale.id, sale.customerId, sale.productId, sale.storeId, sale.dateSold)}><Icon name='edit' />Edit</Label></td>
                            <td><Label color='red' className='clickable-label' onClick={() => handleOpenDelete(sale.id, sale.customerName, sale.productName, sale.storeName, sale.dateSold)}><Icon name='trash alternate' />Delete</Label></td>
                        </tr>

                        )}
                    </tbody>

                    
                    
                </table>
            </div>


        );
    }



    render() {

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : SaleList.renderSaleTable(this.state.sales, this.handleOpenEdit, this.handleCloseEdit, this.state.modalOpenEdit, this.handleSubmitEdit, this.handleOpenDelete);

        const { sales, customers, products, stores, modalOpenCreate, modalOpenEdit, modalOpenDelete, selectedSaleId, selectedProductId, selectedCustomerId, selectedStoreId } = this.state;

        const dateSold = new Date(); 
        const day = String(dateSold.getDate()).padStart(2, '0');
        const month = String(dateSold.getMonth() + 1).padStart(2, '0'); 
        const year = dateSold.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = dateSold.toLocaleTimeString();

        return (

            <div>

                {this.state.showModal && (
                    <CustomAlert message={this.state.alertMessage} onClose={this.handleAlertClose} textColor={this.state.alertTextColor} />
                )}

                <Button color="blue" onClick={this.handleOpenCreate}>Create Sale</Button>

                <Modal                    
                    open={this.state.modalOpenCreate}
                    onClose={this.handleCloseCreate}
                    closeOnEscape={false} closeOnDimmerClick={false}
                >
                    <Modal.Header>Create Sale</Modal.Header>

                    <Modal.Content>

                        <Form id="myFormCreate" onSubmit={this.handleSubmitCreate}>
                            <Form.Field>
                                <label>Date Sold</label>
                                <br></br>
                                <input
                                    type="text"
                                    value={`${formattedDate} ${formattedTime}`}
                                    readOnly
                                />
                                
                            </Form.Field>

                            <Form.Field><label>Customer <span style={{ color: 'red' }}>*</span></label>
                                <Dropdown
                                    selection
                                    options={customers.map(customer => ({
                                        key: customer.id,
                                        value: customer.id,
                                        text: customer.name
                                    }))}
                                    required={true}
                                    name="selectedCustomerId"
                                    value={this.state.selectedCustomerId}
                                    onChange={this.handleChangeCreate2}
                                    
                                />
                            </Form.Field>

                            <Form.Field><label>Product <span style={{ color: 'red' }}>*</span></label>
                                <Dropdown
                                    selection
                                    options={products.map(product => ({
                                        key: product.id,
                                        value: product.id,
                                        text: product.name
                                    }))}
                                    name="selectedProductId"
                                    value={this.state.selectedProductId}
                                    onChange={this.handleChangeCreate2}
                                />
                            </Form.Field>

                            <Form.Field><label>Store <span style={{ color: 'red' }}>*</span></label>
                                <Dropdown
                                    selection
                                    options={stores.map(store => ({
                                        key: store.id,
                                        value: store.id,
                                        text: store.name
                                    }))}
                                    name="selectedStoreId"
                                    value={this.state.selectedStoreId}
                                    onChange={this.handleChangeCreate2}
                                    
                                />
                            </Form.Field>

                            <br></br><br></br>



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
                    <Modal.Header>Edit Sale</Modal.Header>

                    <Modal.Content>
                        <Form id="myFormEdit" onSubmit={this.handleSubmitEdit}>

                            <Form.Field>
                                <label>Date Sold</label>
                                <input
                                    name="selectedDateSold"
                                    type="datetime-local"
                                    value={this.state.selectedDateSold}
                                    onChange={this.handleChangeEdit1}
                                />
                            </Form.Field>

                            <Form.Field><label>Customer</label>
                                {/*<Form.Select*/}
                                <Dropdown
                                    selection
                                    options={customers.map(customer => ({
                                        key: customer.id,
                                        value: customer.id,
                                        text: customer.name
                                    }))}
                                    name="selectedCustomerId"
                                    value={this.state.selectedCustomerId}
                                    onChange={this.handleChangeEdit2}
                                />
                            </Form.Field>

                            <Form.Field><label>Product</label>                                
                                <Dropdown
                                    selection
                                    options={products.map(product => ({
                                        key: product.id,
                                        value: product.id,
                                        text: product.name
                                    }))}
                                    name="selectedProductId"
                                    value={this.state.selectedProductId}
                                    onChange={this.handleChangeEdit2}
                                />
                            </Form.Field>

                            <Form.Field><label>Store</label>                                
                                <Dropdown
                                    selection
                                    options={stores.map(store => ({
                                        key: store.id,
                                        value: store.id,
                                        text: store.name
                                    }))}
                                    name="selectedStoreId"
                                    value={this.state.selectedStoreId}
                                    onChange={this.handleChangeEdit2}
                                />
                            </Form.Field>

                            <br></br><br></br>
                            <Button color="blue" type="submit">Edit</Button>
                            <Button onClick={this.handleCloseEdit}>Cancel</Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                <Modal
                    open={this.state.modalOpenDelete}
                    onClose={this.handleCloseDelete}
                    closeOnEscape={false} closeOnDimmerClick={false}
                >
                    <Modal.Header>Delete Sale</Modal.Header>

                    <Modal.Content>
                        <p>Are you sure to delete?</p>
                        <p><b style={{ minWidth: '120px', display: 'inline-block' }}>Id</b><span style={{ minWidth: '10px', display: 'inline-block' }}>:</span><b style={{ color: 'red' }}>{this.state.selectedSaleId}</b></p>
                        <p><b style={{ minWidth: '120px', display: 'inline-block' }}>Customer Name</b><span style={{ minWidth: '10px', display: 'inline-block' }}>:</span><b style={{ color: 'red' }}>{this.state.selectedCustomerName}</b></p>
                        <p><b style={{ minWidth: '120px', display: 'inline-block' }}>Product Name</b><span style={{ minWidth: '10px', display: 'inline-block' }}>:</span><b style={{ color: 'red' }}>{this.state.selectedProductName}</b></p>
                        <p><b style={{ minWidth: '120px', display: 'inline-block' }}>Store Name</b><span style={{ minWidth: '10px', display: 'inline-block' }}>:</span><b style={{ color: 'red' }}>{this.state.selectedStoreName}</b> </p>
                        <p><b style={{ minWidth: '120px', display: 'inline-block' }}>Date Sold</b><span style={{ minWidth: '10px', display: 'inline-block' }}>:</span><b style={{ color: 'red' }}>{this.state.selectedDateSold}</b></p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSubmitDelete} color="red">Delete</Button>
                        <Button onClick={this.handleCloseDelete}>Cancel</Button>
                    </Modal.Actions>
                </Modal>



                <h1 id="tabelLabel">Sale Details</h1>
                {contents}
            </div>

        );
    }

    async populateSaleData() {
        const response1 = await fetch('api/sales');
        const data1 = await response1.json();
        this.setState({ sales: data1, loading: false });

        const response2 = await fetch('api/customers');
        const data2 = await response2.json();
        this.setState({ customers: data2 });

        const response3 = await fetch('api/products');
        const data3 = await response3.json();
        this.setState({ products: data3 });

        const response4 = await fetch('api/stores');
        const data4 = await response4.json();
        this.setState({ stores: data4 });



    }

}




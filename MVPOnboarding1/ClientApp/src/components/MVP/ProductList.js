import React, { Component } from 'react';
import { Modal, Button, Label, Icon, Form } from "semantic-ui-react";
import './MyComponent.css'
import $ from 'jquery';
import CustomAlert from './CustomAlert';


export class ProductList extends Component {
   static displayName = ProductList.name;

    constructor(props) {
        super(props);

        this.state = {
            products: [], loading: true,
            sales: [],
            modalTitle: "",
            ProductId: 0,
            formData: {},
            modalOpenCreate: false,
            modalOpenEdit: false,
            modalOpenDelete: false,

            fields: {
                productName: "",
                productPrice: "",
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
        
        const numericValue = Number($('#myForm input[name=productPrice]').val());

        const roundedValue = numericValue.toFixed(2);

        var formData = {
            Name: $('#myForm input[name=productName]').val(),
            Price: roundedValue,
        };
              

        $.ajax({
            url: '/api/products',
            type: 'POST',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(formData),

         })            
            .then((result) => {                
                this.setState({ showModal: true, alertMessage: 'Product added successfully.', alertTextColor: '' });
                this.refreshList();
            }, (error) => {                
                this.setState({ showModal: true, alertMessage: 'Product add failed!', alertTextColor: 'red' });
            })
        this.handleCloseCreate();
    };


    handleOpenEdit = (productId, productName, productPrice) => {
        this.setState({
            modalOpenEdit: true,
            selectedProductId: productId,
            selectedProductName: productName,
            selectedProductPrice: productPrice,

        });
    };

    handleCloseEdit = () => {
        this.setState({
            modalOpenEdit: false,
            selectedProductId: null,
            selectedProductName: '',
            selectedProductPrice: '',
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
        const { selectedProductId } = this.state;
        const { selectedProductName } = this.state;
        const { selectedProductPrice } = this.state;

        const numericValue = Number(selectedProductPrice);

        const roundedValue = numericValue.toFixed(2);

        var formData = {
            Id: selectedProductId,
            Name: selectedProductName,
            Price: roundedValue,
        };

        
        $.ajax({
            url: '/api/products/' + selectedProductId,
            type: 'PUT',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: (response) => {                
                this.setState({ showModal: true, alertMessage: 'Product updated successfully.', alertTextColor: '' });                
                this.refreshList();
            },
            error: (error) => {                
                this.setState({ showModal: true, alertMessage: 'Product update failed!', alertTextColor: 'red' });                
            },
        })
        this.handleCloseEdit();

    };

    handleOpenDelete = (productId, productName) => {
        this.setState({
            modalOpenDelete: true,
            selectedProductId: productId,
            selectedProductName: productName,

        });
    };

    handleCloseDelete = () => {
        this.setState({
            modalOpenDelete: false,
            selectedProductId: null,
            selectedProductName: ""
        });
        this.refreshList();
    }

    handleSubmitDelete = () => {

        const { selectedProductId } = this.state;

        const productExistsInSales = this.state.sales.some(
            (sale) => sale.productId === selectedProductId
        );

        if (productExistsInSales) {
            // Product exists in sales, prevent deletion and show a message            
            this.setState({ showModal: true, alertMessage: 'Cannot delete product - it exists in one or more sales records!', alertTextColor: 'red' });
            this.handleCloseDelete();
        } else {

            $.ajax({
                url: '/api/products/' + selectedProductId,
                type: 'DELETE',
                accept: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(selectedProductId),
                dataType: 'json',
                success: (response) => {                    
                    this.setState({ showModal: true, alertMessage: 'Product deleted successfully.', alertTextColor: '' });                    
                    this.refreshList();
                },
                error: (error) => {                    
                    this.setState({ showModal: true, alertMessage: 'Product delete failed!', alertTextColor: 'red' });                    
                },
            })
            this.handleCloseDelete();
        }
    };

    handleAlertClose = () => {
        this.setState({ showModal: false, alertMessage: '', alertTextColor: undefined });
    };

    refreshList() {
        fetch('api/products/')
            .then(response => response.json())
            .then(data => {
                this.setState({ products: data });
            });
    }


    componentDidMount() {
        this.populateProductData();
    }


    static renderProductTable(products, handleOpenEdit, handleCloseEdit, modalOpenEdit, handleSubmitEdit, handleOpenDelete) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td><Label color='green' className='clickable-label' onClick={() => handleOpenEdit(product.id, product.name, product.price)}><Icon name='edit' />Edit</Label></td>
                            <td><Label color='red' className='clickable-label' onClick={() => handleOpenDelete(product.id, product.name)}><Icon name='trash alternate' />Delete</Label></td>
                        </tr>

                        )}
                    </tbody>
                </table>
            </div>


        );
    }


    render() {


        const { fields } = this.state;

        const { products, modalOpenEdit, selectedProductId, selectedProductName, selectedProductPrice } = this.state;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : ProductList.renderProductTable(this.state.products, this.handleOpenEdit, this.handleCloseEdit, this.state.modalOpenEdit, this.handleSubmitEdit, this.handleOpenDelete);

        return (

            <div>
                {this.state.showModal && (
                    <CustomAlert message={this.state.alertMessage} onClose={this.handleAlertClose} textColor={this.state.alertTextColor} />
                )}

                <div>
                    <Button color="blue" onClick={this.handleOpenCreate}>Create Product</Button>

                    <Modal
                        open={this.state.modalOpenCreate}
                        onClose={this.handleCloseCreate}
                        closeOnEscape={false} closeOnDimmerClick={false}
                    >
                        <Modal.Header>Create Product</Modal.Header>

                        <Modal.Content>
                            <Form id="myForm" onSubmit={(e) => {
                                this.handleSubmitCreate(e);                                
                            }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="productName"
                                    label="Name"
                                    placeholder="Enter a product name (max. 50 chars)"
                                    value={fields.productName}
                                    onChange={this.handleChangeCreate}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="productPrice"
                                    label="Price"
                                    placeholder="Enter a product price (only numeric value in format of 0.00)"
                                    value={fields.productPrice}
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
                        <Modal.Header>Edit Product</Modal.Header>

                        <Modal.Content>
                            <Form id="myFormEdit"
                                onSubmit={(e) => {
                                    this.handleSubmitEdit(e);                                    
                                }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="selectedProductName"
                                    label="Name"
                                    placeholder="Enter a product name (max. 50 chars)"
                                    value={selectedProductName}
                                    onChange={this.handleChangeEdit}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="selectedProductPrice"
                                    label="Price"
                                    placeholder="Enter a product price (only numeric value in format of 0.00)"
                                    value={selectedProductPrice}
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
                        <Modal.Header>Delete Product</Modal.Header>

                        <Modal.Content>

                            <p>Are you sure to delete product name: <b style={{ color: 'red' }}>{selectedProductName}</b>?</p>


                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.handleSubmitDelete} color="red">Delete</Button>
                            <Button onClick={this.handleCloseDelete}>Cancel</Button>
                        </Modal.Actions>
                    </Modal>

                </div>

                <h1 id="tabelLabel">Product Details</h1>
                {contents}
            </div>

        );
    }

    async populateProductData() {
        const response1 = await fetch('api/products');
        const data1 = await response1.json();
        this.setState({ products: data1, loading: false });

        const response2 = await fetch('api/sales');
        const data2 = await response2.json();
        this.setState({ sales: data2, loading: false });
    }

}




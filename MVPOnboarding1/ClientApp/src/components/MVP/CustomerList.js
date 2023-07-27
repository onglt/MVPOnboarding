import React, { Component } from 'react';
import { Modal, Button, Label, Icon, Form } from "semantic-ui-react";
import './MyComponent.css'
import $ from 'jquery';
import CustomAlert from './CustomAlert';

    
export class CustomerList extends Component {
    static displayName = CustomerList.name;

    constructor(props) {
        super(props);
        
        this.state = {
            customers: [], loading: true,
            sales:[],
            CustomerId: 0,
            formData: {},
            modalOpenCreate: false,
            modalOpenEdit: false,
            modalOpenDelete: false,
            
            fields: {
                customerName: "",
                customerAddress: "",
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
            name: $('#myForm input[name=customerName]').val(),
            address: $('#myForm input[name=customerAddress]').val()
        };

        $.ajax({
            url: '/api/customers',
            type: 'POST',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(formData),            

        })
            
            .then((result) => {                
                this.setState({ showModal: true, alertMessage: 'Customer added successfully.', alertTextColor: '' });
                this.refreshList();
            }, (error) => {                
                this.setState({ showModal: true, alertMessage: 'Customer add failed!', alertTextColor: 'red' });
            })
        this.handleCloseCreate();
    };


    handleOpenEdit = (customerId, customerName, customerAddress) => {
        this.setState({
            modalOpenEdit: true,
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,
            selectedCustomerAddress: customerAddress,

        });
    };

    handleCloseEdit = () => {
        this.setState({
            modalOpenEdit: false,
            selectedCustomerId: null,
            selectedCustomerName: '',
            selectedCustomerAddress: '',
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
        const { selectedCustomerId } = this.state;
        const { selectedCustomerName } = this.state;
        const { selectedCustomerAddress } = this.state;
              
        console.log(selectedCustomerId);
        console.log($('#myFormEdit input[name=selectedCustomerName]').val());
        console.log($('#myFormEdit input[name=selectedCustomerAddress]').val());

        const requestData = {
            Id: selectedCustomerId,
            Name: $('#myFormEdit input[name=selectedCustomerName]').val(),            
            Address: $('#myFormEdit input[name=selectedCustomerAddress]').val()
        };

        $.ajax({
            url: '/api/customers/' + selectedCustomerId,
            type: 'PUT',
            accept: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            dataType: 'json',
            success: (response) => {                
                this.setState({ showModal: true, alertMessage: 'Customer updated successfully.', alertTextColor: '' });                
                this.refreshList();
            },
            error: (error) => {                
                this.setState({ showModal: true, alertMessage: 'Customer update failed!', alertTextColor: 'red' });                
            },
         })
        this.handleCloseEdit();   
            
    };

    handleOpenDelete = (customerId, customerName) => {
        this.setState({
            modalOpenDelete: true,
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,

        });
    };

    handleCloseDelete = () => {
        this.setState({
            modalOpenDelete: false,
            selectedCustomerId: null,
            selectedCustomerName:""
            });
        this.refreshList();
    }

    handleSubmitDelete = () => {
        
        const { selectedCustomerId } = this.state;

        console.log(selectedCustomerId);

        const customerExistsInSales = this.state.sales.some(
            (sale) => sale.customerId === selectedCustomerId
        );

        console.log(customerExistsInSales);

        if (customerExistsInSales) {
            // Customer exists in sales, prevent deletion and show a message            
            this.setState({ showModal: true, alertMessage: 'Cannot delete customer - it exists in one or more sales records!', alertTextColor: 'red' });
            this.handleCloseDelete();
        } else {

            $.ajax({
                url: '/api/customers/' + selectedCustomerId,
                type: 'DELETE',
                accept: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(selectedCustomerId),
                dataType: 'json',
                success: (response) => {                    
                    this.setState({ showModal: true, alertMessage: 'Customer deleted successfully.', alertTextColor: '' });                    
                    this.refreshList();
                },
                error: (error) => {                    
                    this.setState({ showModal: true, alertMessage: 'Customer delete failed!', alertTextColor: 'red' });                    
                },
            })
        }
        this.handleCloseDelete();

    };

    handleAlertClose = () => {
        this.setState({ showModal: false, alertMessage: '', alertTextColor: undefined });
    };

    refreshList() {
        fetch('api/customers/')
            .then(response => response.json())
            .then(data => {
                this.setState({ customers: data });
            });
    }    
    

          
    componentDidMount() {
        this.populateCustomerData();
    }

       

    static renderCustomerTable(customers, handleOpenEdit, handleCloseEdit, modalOpenEdit, handleSubmitEdit, handleOpenDelete) {


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
                        {customers.map(customer => <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>                                                   
                            <td><Label color='green' className='clickable-label'  onClick={() => handleOpenEdit(customer.id, customer.name, customer.address)}><Icon name='edit' />Edit</Label></td>
                            <td><Label color='red' className='clickable-label' onClick={() => handleOpenDelete(customer.id, customer.name)}><Icon name='trash alternate' />Delete</Label></td>                     
                        </tr>

                        )}
                    </tbody>
                </table>
            </div>


        );
    }


    render() {

               
        const { fields } = this.state;

        const { customers, modalOpenEdit, selectedCustomerId, selectedCustomerName, selectedCustomerAddress } = this.state;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : CustomerList.renderCustomerTable(this.state.customers, this.handleOpenEdit, this.handleCloseEdit, this.state.modalOpenEdit, this.handleSubmitEdit, this.handleOpenDelete);

        return (
            <div>     
                {this.state.showModal && (
                    <CustomAlert message={this.state.alertMessage} onClose={this.handleAlertClose} textColor={this.state.alertTextColor} />
                )}

                <div>                    
                    <Button color="blue" onClick={this.handleOpenCreate}>Create Customer</Button>

                    <Modal
                        open={this.state.modalOpenCreate}
                        onClose={this.handleCloseCreate} 
                        closeOnEscape={false} closeOnDimmerClick={false}
                    >
                        <Modal.Header>Create Customer</Modal.Header>
                            
                        <Modal.Content>
                            <Form id="myForm" onSubmit={(e) => {
                                this.handleSubmitCreate(e);                                
                            }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="customerName"
                                    label="Name"
                                    placeholder="Enter a customer name (max. 50 chars)"
                                    value={fields.customerName}
                                    onChange={this.handleChangeCreate}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="customerAddress"
                                    label="Address"
                                    placeholder="Enter a customer address (max. 100 chars)"
                                    value={fields.customerAddress}
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
                        <Modal.Header>Edit Customer</Modal.Header>

                        <Modal.Content>
                            <Form id="myFormEdit"
                                onSubmit={(e) => {                                    
                                    this.handleSubmitEdit(e);                                
                            }}>

                                <Form.Input fluid
                                    required={true}
                                    maxLength={50}
                                    type="text"
                                    name="selectedCustomerName"
                                    label="Name"
                                    placeholder="Enter a customer name (max. 50 chars)"
                                    value={selectedCustomerName}
                                    onChange={this.handleChangeEdit}
                                />
                                <br></br>
                                <Form.Input fluid
                                    required={true}
                                    maxLength={100}
                                    type="text"
                                    name="selectedCustomerAddress"
                                    label="Address"
                                    placeholder="Enter a customer address (max. 100 chars)"
                                    value={selectedCustomerAddress}
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
                        <Modal.Header>Delete Customer</Modal.Header>

                        <Modal.Content>
                            
                            <p>Are you sure to delete customer name: <b style={{ color: 'red' }}>{selectedCustomerName}</b>?</p> 

                            
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.handleSubmitDelete} color="red">Delete</Button>
                            <Button onClick={this.handleCloseDelete}>Cancel</Button>
                        </Modal.Actions>
                    </Modal>   

                </div>
                
                <h1 id="tabelLabel">Customer Details</h1>
                {contents}
            </div>

        );
    }

    async populateCustomerData() {
        const response1 = await fetch('api/customers');
        const data1 = await response1.json();
        this.setState({ customers: data1, loading: false });

        const response2 = await fetch('api/sales');
        const data2 = await response2.json();
        this.setState({ sales: data2, loading: false });
    }

}




// const db = require('../db_config');
const customerQueries = require('../queries/customerQueries');
const { response } = require('express');

const createCustomer = async (req, res) => {
  try {
    const { person_id, name, email } = req.body;

    const newCustomer = await customerQueries.createCustomer(person_id, name, email)
    res.json(newCustomer.rows[0]);
  } catch (err) {
    console.error('Error creating customer: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCustomers = async (req, res) => {
 
  try {
    const customers = await customerQueries.getCustomers()
    
    res.json(customers);
  } catch (err) {
    console.error('Error getting customer list: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCustomerById = async (req, res) => {
  const id = 2
  try {
    const customer = await customerQueries.getCustomerById()
    res.json(customer.row[0]);
  } catch (err) {
    console.error('Error getting customer by id : ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateCustomer = async (req, res) => {
  try {
    const { person_id, name, email } = req.body;

    const updatedCustomer = await customerQueries.updateCustomer(person_id, name, email)
    res.json(updatedCustomer.rows[0]);
  } catch (err) {
    console.error('Error creating customer: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCustomer = async (req, res) => {
  const id = 2
  try {
    customerQueries.deleteCustomer(id).then(response => {
      res.status(200).json(`Deleted Customer with id${id}`)
    })
  } catch (err) {
    console.error('Error creating customer: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomers,
  deleteCustomer
  // Implement other CRUD operations for Customer table
};

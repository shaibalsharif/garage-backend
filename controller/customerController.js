// const db = require('../db_config');
const customerQueries = require('../queries/customerQueries');
const { response, json } = require('express');

const createCustomer = async (req, res) => {
  try {

    const { person_id, name, email } = req.body;

    const newCustomer = await customerQueries.createCustomer(req.body)

    res.json(newCustomer);
  } catch (err) {
    console.log(err);
    res.status(500).json(`${err}`)
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

  const id = req.params.id

  try {
    const customers = await customerQueries.getCustomerById(id)

    res.json(customers?.length ? customers[0] : {});
  } catch (err) {
    console.error('Error getting customer by id : ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateCustomer = async (req, res) => {
  try {

    const id = req.params.id
    const updatedCustomer = await customerQueries.updateCustomer(id, req.body)

    res.json(updatedCustomer);
  } catch (err) {
    console.log(err);
    res.status(500).json(`${err}`)
  }
};

const deleteCustomer = async (req, res) => {

  const id = req.params.id
  
  try {

    const removedCustomer = await customerQueries.deleteCustomer(id)
    res.json(removedCustomer);
  } catch (error) {
    console.log(error);
    res.status(500).json(`${error}`)
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

const carQueries = require('../queries/carQueries');
const { response, json } = require('express');

const addCar = async (req, res) => {

  console.log(req.body);
  try {

    const newCar = await carQueries.addCar(req.body)

    res.json(newCar);
  } catch (err) {

    res.status(500).json(`${err}`)
  }
};

const getCarList = async (req, res) => {
  const customer_id = req.query.customer_id || null;
  const id = req.query.id || null;
  const brand = req.query.brand || null;
  const model = req.query.model || null;
  const plate = req.query.plate || null;

  try {
    const carList = await carQueries.getCarList(id, customer_id, brand, model, plate)
    res.json(carList);
  } catch (err) {
    console.log(err);
    res.status(500).json(`${err}`)
  }
}

const updateCar = async (req, res) => {
  try {
    const id = req.params.id
    console.log(req.body);
    const updatedCar = await carQueries.updateCar(id, req.body)

    res.json(updatedCar);
  } catch (err) {
    console.log(err);
    res.status(500).json(`${err}`)
  }
}

const deleteCar = async (req, res) => {

  const id = req.params.id

  try {

    const removedCar = await carQueries.deleteCar(id)
    res.json(removedCar);
  } catch (error) {
    console.log(error);
    res.status(500).json(`${error}`)
  }

};
module.exports = {
  getCarList,
  addCar,
  updateCar,
  deleteCar
}

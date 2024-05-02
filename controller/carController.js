const carQueries = require('../queries/carQueries');
const { response, json } = require('express');

const addCar = async (req, res) => {


    try {

        const { person_id, name, email } = req.body;

        const newCar = await carQueries.addCar(req.body)
        res.json(newCar);
    } catch (err) {

        res.status(500).json(`${err}`)
    }
};

const getCarList = async (req, res) => {
    try {
        const carList = await carQueries.getCarList()
        res.json(carList);
    } catch (err) {
        console.log(err);
        res.status(500).json(`${err}`)
    }
}

const updateCar = async(req, res)=> {
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

const deleteCar= async (req, res) => {

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

const carQueries = require('../queries/carQueries');
const { response, json } = require('express');

const addCar = async (req, res) => {
    try {

        const { person_id, name, email } = req.body;

        const newCar = await carQueries.addCar(req.body)

        res.json(newCar);
    } catch (err) {
        console.log(err);
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


module.exports = {
    getCarList,
    addCar
}

const { pool } = require("../db_config");

const checkDuplicateNumberPlate = async (numberPlate, exception_id) => {
    const existingPlate = await pool.query(
        `SELECT id FROM cars WHERE plate = $1 ${exception_id ? `AND id != ${exception_id}` : ""}`,
        [numberPlate]
    );


    if (existingPlate.rows.length > 0) {
        throw new Error('Number Plate already exists');
    }
};

const checkDuplicateEngine = async (engine, exception_id) => {
    const existingEngine = await pool.query(
        `SELECT id FROM person WHERE engine = $1 ${exception_id ? `AND id != ${exception_id}` : ""}`,
        [engine]
    );


    if (existingEngine.rows.length > 0) {
        throw new Error('Engine number already exists');
    }
};

const addCar = async ({ customer_id, brand, model, plate, entry_date, color, engine, emergency }) => {

    try {
        await checkDuplicateEngine(engine);
        await checkDuplicateNumberPlate(phone);


        const newCar = await pool.query(
            `INSERT INTO cars (customer_id, brand, model, plate, entry_date, color, engine, emergency)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [customer_id, brand, model, plate, entry_date, color, engine, emergency]
        );
        const carId = newCar.rows[0].id;



        return {
            carId
        };
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};
const getCarList = async ({ }) => {
    try {
        const carList = await pool.query(
            `SELECT * FROM cars`
        )
        console.log("hello");
        console.log(carList);
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}


module.exports = {
    addCar,
    getCarList

};
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
        `SELECT id FROM cars WHERE engine = $1 ${exception_id ? `AND id != ${exception_id}` : ""}`,
        [engine]
    );


    if (existingEngine.rows.length > 0) {
        throw new Error('Engine number already exists');
    }
};

const addCar = async ({ customer_id, brand, model, plate, entry_date, color, engine, emergency, initial_problem, status }) => {
    console.log({ customer_id, brand, model, plate, entry_date, color, engine, emergency, initial_problem, status });

    try {
        await checkDuplicateEngine(engine);
        await checkDuplicateNumberPlate(plate);

        console.log();
        const newCar = await pool.query(
            `INSERT INTO cars (customer_id, brand, model, plate, entry_date, color, engine, emergency,initial_problem,status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING id`,
            [customer_id, brand, model, plate, entry_date, color, engine, emergency, initial_problem, status]
        );
        const carId = newCar.rows[0].id;
        console.log(carId);
        return {
            carId
        };
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

const getCarList = async (id, customer_id, brand, model, plate) => {
   console.log(customer_id);
    try {
        const carList = await pool.query(`
        SELECT cars.*, CONCAT(person.first_name, ' ', person.last_name, '-', cars.customer_id) AS customer
        FROM cars 
        LEFT JOIN customers ON CAST(cars.customer_id AS INTEGER) = CAST(customers.id AS INTEGER) 
        LEFT JOIN person ON CAST(customers.person_id AS INTEGER) = CAST(person.id AS INTEGER)
        ${(id || customer_id || brand || model || plate) ?
            `WHERE ${id ? `cars.id = CAST(${id} As INTEGER) ` : ''}
            ${customer_id ? `${id ? 'AND ' : ''}cars.customer_id = '${customer_id}' ` : ''} 
            ${brand ? `${customer_id || id ? 'AND ' : ''}cars.brand LIKE '%${brand}%' ` : ''}
            ${model ? `${customer_id || id || brand ? 'AND ' : ''}cars.model LIKE '%${model}%' ` : ''}
            ${plate ? `${customer_id || id || brand || model ? 'AND ' : ''}cars.plate LIKE '%${plate}%' ` : ''}
            ` : ''}
        ORDER BY cars.status, cars.customer_id
        `);

        return carList.rows;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

const updateCar = async (id, { brand, model, plate, color, engine, emergency,
    initial_problem, status, }) => {

    try {
        await checkDuplicateNumberPlate(plate, id);
        await checkDuplicateEngine(engine, id);

        const updateCar = await pool.query(
            `UPDATE cars SET brand = $1 , model = $2, plate = $3, color = $4, 
        engine = $5, emergency = $6, initial_problem = $7, status = $8 WHERE id = ${id}`,
            [brand, model, plate, color, engine, emergency,
                initial_problem, status]
        );
        return { updateCar }

    }
    catch (error) {
        throw new Error(`${error.message}`);
    }


};
const deleteCar = async (id) => {
    try {

        await pool.query(
            'DELETE FROM cars WHERE id = $1', [id]
        );



    } catch (error) {
        throw new Error(`${error.message}`);
    }

};



module.exports = {
    addCar,
    getCarList,
    updateCar,
    deleteCar

};
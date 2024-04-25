const { pool } = require('../db_config');

const createCustomer = async (first_name, last_name, dob, sex, email, phone) => {
  try {
    // Insert data into person table
    const newPerson = await pool.query(
      'INSERT INTO person (first_name, last_name, dob, sex, email, phone, added_date) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id',
      [first_name, last_name, dob, sex, email, phone]
    );
    const personId = newPerson.rows[0].id;

    // Insert data into customers table with person_id
    const newCustomer = await pool.query(
      'INSERT INTO customers (person_id) VALUES ($1) RETURNING *',
      [personId]
    );

    return {
      personId,
      customerId: newCustomer.rows[0].id
    };
  } catch (error) {
    throw new Error(`Error creating customer: ${error.message}`);
  }
};

const getCustomers = async () => {

  const customers = await pool.query(`SELECT c.id, p.first_name, p.last_name,p.dob, p.email, p.sex, p.added_date, p.phone ,a.country,a.address_name,
   a.address_type,a.house_no,a.road_no,a.postal_code,a.city, a.country
   FROM customers c 
   join person p 
   on c.person_id=p.id 
  join address a
   on a.person_id= p.id `);
  let temp_list = {}
  customers.rows.map(customer => {
    temp_list[customer.id] = {
      id: customer.id,
      "first_name": customer.first_name,
      "last_name": customer.last_name,
      "dob": customer.dob,
      "email": customer.email,
      "sex": customer.sex,
      "added_date": customer.added_date,
      "phone": customer.phone,
      "address": {
        ...temp_list[customer.id]?.address,
        [customer.address_type]: {
          "country": customer.country,
          "address_name": customer.address_name,
          "house_no": customer.house_no,
          "road_no": customer.road_no,
          "postal_code": customer.postal_code,
          "city": customer.city,
        }
      }

    }
  });
  return Object.values(temp_list)
};

const getCustomerById = async (id) => {
  const customer = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
  return customer;
};

const updateCustomer = async (id, name, email) => {
  const updatedCustomer = await pool.query(
    'UPDATE Customer SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
  );
  return updatedCustomer;
};

const deleteCustomer = async (id) => {
  await pool.query('DELETE FROM Customer WHERE id = $1', [id]);
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

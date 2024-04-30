const { pool } = require('../db_config');
const checkDuplicateEmail = async (email, exception_id) => {
  const existingEmail = await pool.query(
    `SELECT id FROM person WHERE email = $1 ${exception_id ? `AND id != ${exception_id}` : ""}`,
    [email]
  );

  if (existingEmail.rows.length > 0) {
    throw new Error('Email already exists');
  }
};

const checkDuplicatePhone = async (phone, exception_id) => {
  const existingPhone = await pool.query(
    `SELECT id FROM person WHERE phone = $1 ${exception_id ? `AND id != ${exception_id}` : ""}`,
    [phone]
  );

  if (existingPhone.rows.length > 0) {
    throw new Error('Phone number already exists');
  }
};

const createCustomer = async ({ first_name, last_name, dob, sex, email, phone, address_name, address_type,
  road_no, house_no, city, country, postal_code,emergency }) => {

  try {
    await checkDuplicateEmail(email);
    await checkDuplicatePhone(phone);



    const newPerson = await pool.query(
      `INSERT INTO person (first_name, last_name, dob, 
        sex, email, phone,emergency, added_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`,
      [first_name, last_name, dob, sex, email, phone,emergency]
    );
    const personId = newPerson.rows[0].id;

    // Insert data into customers table with person_id
    const newCustomer = await pool.query(
      'INSERT INTO customers (person_id) VALUES ($1) RETURNING *',
      [personId]
    );
    const newAddress = await pool.query(
      `INSERT INTO address (person_id,address_name, address_type,
        road_no, house_no, city,country, postal_code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [personId, address_name, address_type,
        road_no, house_no, city, country, postal_code]
    );

    return {
      personId,
      customerId: newCustomer.rows[0].id
    };
  } catch (error) {
    throw new Error(`${error.message}`);
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
 
  const customers = await pool.query(`SELECT c.id, p.first_name, p.last_name,p.dob, p.email, p.sex, p.added_date, p.phone ,a.country,a.address_name,
  a.address_type,a.house_no,a.road_no,a.postal_code,a.city, a.country
  FROM customers c 
  join person p 
  on c.person_id=p.id 
 join address a
  on a.person_id= p.id  
  where c.id=${id}
  `);

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

const updateCustomer = async (id, { first_name, last_name, dob, sex, email, phone, address_name, address_type,
  road_no, house_no, city, country, postal_code,emergency }) => {
  try {


    const person_id_result = await pool.query(
      `SELECT person_id 
       FROM customers
       WHERE id = ${id}`
    )
    const person_id = person_id_result?.rows[0].person_id;
    await checkDuplicateEmail(email, person_id);
    await checkDuplicatePhone(phone, person_id);
    const updatedPerson = await pool.query(
      `UPDATE person SET first_name = $1 , last_name = $2, dob = $3, sex = $4, 
       email = $5, phone = $6, emergency = $7  WHERE id = ${person_id}`,
      [first_name, last_name, dob, sex, email, phone, emergency]
    );

    const updated_address = await pool.query(
      `UPDATE address SET  address_name = $1, address_type = $2, road_no = $3, 
      house_no = $4, city = $5, country = $6,postal_code = $7 
       WHERE person_id = ${person_id}`,
      [address_name, address_type,
        road_no, house_no, city, country, postal_code]
    );

  }
  catch (error) {
    throw new Error(`${error.message}`);
  }


};

const deleteCustomer = async (id) => {
  try {
    const person_id_result = await pool.query(
      `SELECT person_id 
       FROM customers
       WHERE id = ${id}`
    )
    const person_id = person_id_result?.rows[0].person_id;

    
    await pool.query(
      'DELETE FROM Customers WHERE person_id = $1', [person_id]
    );
    await pool.query(
      'DELETE FROM address WHERE person_id = $1', [person_id]
    );
    await pool.query(
      'DELETE FROM person WHERE id = $1', [person_id]
    );


  } catch (error) {
    throw new Error(`${error.message}`);
  }
  
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

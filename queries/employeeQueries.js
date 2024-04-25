const db = require('./db');

const createEmployee = async (person_id, name, position) => {
  const newEmployee = await db.query(
    'INSERT INTO Employee (person_id, name, position) VALUES ($1, $2, $3) RETURNING *',
    [person_id, name, position]
  );
  return newEmployee.rows[0];
};

const getEmployees = async () => {
  const employees = await db.query('SELECT * FROM Employee');
  return employees.rows;
};

const getEmployeeById = async (id) => {
  const employee = await db.query('SELECT * FROM Employee WHERE id = $1', [id]);
  return employee.rows[0];
};

const updateEmployee = async (id, name, position) => {
  const updatedEmployee = await db.query(
    'UPDATE Employee SET name = $1, position = $2 WHERE id = $3 RETURNING *',
    [name, position, id]
  );
  return updatedEmployee.rows[0];
};

const deleteEmployee = async (id) => {
  await db.query('DELETE FROM Employee WHERE id = $1', [id]);
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

// controllers/usersController.js
const db = require('../db');

// Create User
exports.createUser = async (req, res) => {
  const { first_name, last_name, country, year_of_birth } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO person (first_name, last_name, country, year_of_birth) 
       VALUES (?, ?, ?, ?)`,
      [first_name, last_name, country, year_of_birth]
    );
    res.status(201).json({ id: result.insertId, message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Read All Users
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM person`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, country, year_of_birth } = req.body;
  try {
    await db.execute(
      `UPDATE person SET first_name = ?, last_name = ?, country = ?, year_of_birth = ? WHERE id = ?`,
      [first_name, last_name, country, year_of_birth, id]
    );
    res.json({ message: 'User updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(`DELETE FROM person WHERE id = ?`, [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

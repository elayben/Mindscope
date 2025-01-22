// controllers/usersController.js
const db = require('../db');



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


// Register Person
exports.registerUser = async (req, res) => {
  const { first_name, last_name, birth_year, country_code, password } = req.body;

  if (!first_name || !last_name || !birth_year || !country_code || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert new person
    const [result] = await db.execute(
      `INSERT INTO person (first_name, last_name, birth_year, country_code, password) VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, birth_year, country_code, password]
    );

    const personId = result.insertId; 

    res.status(201).json({
      message: 'User registered successfully',
      person_id: personId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// Login Person
exports.loginUser = async (req, res) => {
  const { first_name, last_name, password } = req.body;

  if (!first_name || !last_name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Fetch user details along with birth_year and country_code
    const [rows] = await db.execute(
      `SELECT first_name, last_name, birth_year, country_code 
       FROM person 
       WHERE first_name = ? AND last_name = ? AND password = ?`,
      [first_name, last_name, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Include birth_year and country_code in the response
    const user = rows[0];
    res.json({
      message: 'Login successful',
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        birthYear: user.birth_year,
        birthCountry: user.country_code,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
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

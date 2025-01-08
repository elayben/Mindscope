const db = require('../db');

// 13) Get all countries
exports.getAllCountriesWithCodes = async (req, res) => {
    try {
      const [rows] = await db.execute(
        `SELECT country_name, country_code FROM countries ORDER BY country_name ASC`
      );
  
      const countriesWithCodes = rows.reduce((acc, row) => {
        acc[row.country_name] = row.country_code;
        return acc;
      }, {});
  
      res.json(countriesWithCodes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch countries and their codes' });
    }
  };
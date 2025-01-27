// controllers/disorderDataController.js
const db = require('../db');

// (1) Get all disorders and their codes
exports.getAllDisorders = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM disorders`);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch all disorders:', error);
    res.status(500).json({ error: 'Failed to fetch all disorders' });
  }
};


// Done
// (2) Top 3 disorders (and their prevalences) in a given country
exports.getTopDisorders = async (req, res) => {
  const { countryCode } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT d.disorder_type, iy.prevalence 
       FROM in_year iy
       JOIN disorders d ON iy.disorder_id = d.disorder_id
       WHERE iy.country_code = ?
         AND iy.year = (SELECT MAX(year) FROM in_year WHERE country_code = ?)
         AND gender = 'both'
         AND d.disorder_type NOT IN ('overall', 'all_mental')
       ORDER BY iy.prevalence DESC
       LIMIT 3`,
      [countryCode, countryCode]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top disorders' });
  }
};

// Done
// (3) DALY growth during the years of a given country
exports.getDalyGrowth = async (req, res) => {
  const { countryCode, disorderId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT DISTINCT d.year, daly 
       FROM daly_table d
       WHERE d.country_code = ? AND disorder_id = ?
       ORDER BY year`,
      [countryCode, disorderId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch DALY growth' });
  }
};

// Done
// (4) Gender comparison for depression prevalence
exports.getDepressionGenderComparison = async (req, res) => {
  const { countryCode } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT d.disorder_type, iy.gender, iy.prevalence
       FROM in_year iy
       JOIN disorders d ON iy.disorder_id = d.disorder_id
       WHERE iy.country_code = ?
         AND iy.year = (
           SELECT MAX(year)
           FROM in_year iy_sub
           JOIN disorders d_sub ON iy_sub.disorder_id = d_sub.disorder_id
           WHERE iy_sub.country_code = ?
             AND d_sub.disorder_type = 'overall'
         )
         AND (d.disorder_type = 'depressive' OR d.disorder_type = 'overall')`,
      [countryCode, countryCode]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gender comparison' });
  }
};


// Done
// (5) DALY of all countries in a given year
exports.getDalyByYear = async (req, res) => {
  const { year, disorderId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT c.country_name, d.daly
       FROM daly_table d
       JOIN countries c ON d.country_code = c.country_code
       WHERE d.year = ? AND d.disorder_id = ?`,
      [year, disorderId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch DALY by year' });
  }
};

// Done
// (6) Top ten countries with a given disorder
exports.getTopCountriesByDisorder = async (req, res) => {
  const { disorderId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT c.country_name, iy.prevalence
       FROM in_year iy
       JOIN countries c ON iy.country_code = c.country_code
       WHERE iy.disorder_id = ?
         AND iy.year = (SELECT MAX(year) FROM in_year)
       ORDER BY iy.prevalence DESC
       LIMIT 10`,
      [disorderId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top countries' });
  }
};

// Done
// (7) Disorder prevalence per continent
exports.getDisorderPrevalenceByContinent = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.continent, d.disorder_type, 
              SUM(iy.prevalence * iy.population) / SUM(iy.population) AS prevalence
       FROM in_year iy
       JOIN countries c ON iy.country_code = c.country_code
       JOIN disorders d ON iy.disorder_id = d.disorder_id
       WHERE c.continent IS NOT NULL AND c.continent <> '\r'
       GROUP BY c.continent, d.disorder_type`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prevalence by continent' });
  }
};

// Done
// (8) Trend line of the last 10 years
exports.getTrendLine = async (req, res) => {
  const { countryCode } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT year, AVG(prevalence) AS overall_prevalence
       FROM in_year 
       WHERE country_code = ? 
         AND disorder_id = (SELECT disorder_id FROM disorders WHERE disorder_type = 'overall')
         AND year >= (SELECT MAX(year) FROM in_year WHERE country_code = ?) - 10
       GROUP BY year
       ORDER BY year`,
      [countryCode, countryCode]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trend line' });
  }
};

// Done
// (Updated) Top 5 Countries with Largest Gender Gap in Depression
exports.getTop5GenderGapInDepression = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.country_name, 
              ABS(SUM(CASE WHEN iy.gender = 'male' THEN iy.prevalence ELSE 0 END) - 
                  SUM(CASE WHEN iy.gender = 'female' THEN iy.prevalence ELSE 0 END)) AS gender_gap
       FROM in_year iy
       JOIN countries c ON iy.country_code = c.country_code
       WHERE iy.disorder_id = (SELECT disorder_id FROM disorders WHERE disorder_type = 'depressive')
         AND iy.year = (SELECT MAX(year) FROM in_year)
       GROUP BY c.country_name
       ORDER BY gender_gap DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch top 5 gender gap in depression' });
  }
};



// Done
// (10) Minimum DALY difference of anxiety between two countries in a given year
exports.getMinDalyDifferenceAnxiety = async (req, res) => {
  const { year } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT 
          c1.country_name AS country1,
          c2.country_name AS country2,
          ABS(d1.daly - d2.daly) AS daly_difference,
          ABS(iy1.prevalence - iy2.prevalence) AS prevalence_difference
       FROM daly_table d1
       JOIN daly_table d2 
           ON d1.year = d2.year
           AND d1.disorder_id = d2.disorder_id
           AND d1.country_code <> d2.country_code
       JOIN in_year iy1 
           ON d1.country_code = iy1.country_code 
           AND d1.year = iy1.year 
           AND d1.disorder_id = iy1.disorder_id
       JOIN in_year iy2 
           ON d2.country_code = iy2.country_code 
           AND d2.year = iy2.year 
           AND d2.disorder_id = iy2.disorder_id
       JOIN countries c1 ON d1.country_code = c1.country_code
       JOIN countries c2 ON d2.country_code = c2.country_code
       WHERE d1.disorder_id = 4
         AND d1.year = ?
       ORDER BY daly_difference ASC
       LIMIT 1`,
      [year]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch minimum DALY difference for anxiety' });
  }
};


// Done
// (11) Top 5 countries with most improvement (DALY reduction)
exports.getTopCountriesDalyImprovement = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
          c.country_name,
          (start_year.daly - end_year.daly) AS daly_reduction
       FROM countries c
       JOIN daly_table start_year 
           ON c.country_code = start_year.country_code
           AND start_year.year = (
               SELECT MIN(year) 
               FROM daly_table 
               WHERE country_code = c.country_code 
                 AND year >= (YEAR(CURDATE()) - 10)
                 AND disorder_id = 9
           )
       JOIN daly_table end_year 
           ON c.country_code = end_year.country_code
           AND end_year.year = (
               SELECT MAX(year) 
               FROM daly_table 
               WHERE country_code = c.country_code 
                 AND year >= (YEAR(CURDATE()) - 10)
                 AND disorder_id = 9
           )
       WHERE start_year.disorder_id = 9 
         AND end_year.disorder_id = 9
         AND start_year.daly > end_year.daly
       ORDER BY daly_reduction DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch top DALY improvement countries' });
  }
};

// Done
// (12) Disorder correlation globally
exports.getDisorderCorrelation = async (req, res) => {
  const { disorder1, disorder2 } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT 
          c.country_name,
          iy1.prevalence AS disorder1_prevalence,
          iy2.prevalence AS disorder2_prevalence
       FROM in_year iy1
       JOIN in_year iy2 
           ON iy1.country_code = iy2.country_code 
           AND iy1.year = iy2.year
       JOIN disorders d1 ON iy1.disorder_id = d1.disorder_id
       JOIN disorders d2 ON iy2.disorder_id = d2.disorder_id
       JOIN countries c ON iy1.country_code = c.country_code
       WHERE d1.disorder_type = ?
         AND d2.disorder_type = ?
         AND iy1.year = (SELECT MAX(year) FROM in_year)
       ORDER BY iy1.prevalence DESC`,
      [disorder1, disorder2]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch disorder correlation' });
  }
};





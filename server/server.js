const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Laptop@123',
  database: process.env.DB_NAME || 'saudi',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
  }
}

testConnection();

// API Routes

// Create new site
app.post('/api/sites', async (req, res) => {
  try {
    const siteData = req.body;

    // Validate required fields
    if (!siteData.name || !siteData.nameArabic || !siteData.city || !siteData.state) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, nameArabic, city, and state are required'
      });
    }

    // Map frontend fields to database columns
    const query = `
      INSERT INTO place (
        place_name,
        place_name_arabic,
        site_type,
        pin_colour,
        city,
        state,
        latitude,
        longitude,
        Period_Name,
        Sub_period,
        Des_cription,
        Des_arabic,
        Ref_erences,
        Media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      siteData.name,                                    // place_name
      siteData.nameArabic,                              // place_name_arabic
      siteData.type || 'Heritage Site',                 // site_type
      siteData.color || '#8B4513',                      // pin_colour
      siteData.city,                                    // city
      siteData.state,                                   // state
      siteData.coordinates?.lat || siteData.latitude,   // latitude
      siteData.coordinates?.lng || siteData.longitude,  // longitude
      siteData.period || siteData.periodName || null,   // Period_Name
      siteData.subPeriod || null,                       // Sub_period
      siteData.descriptionEnglish || null,              // Des_cription
      siteData.descriptionArabic || null,               // Des_arabic
      siteData.references || null,                      // Ref_erences
      siteData.media || null                            // Media
    ];

    const [result] = await pool.execute(query, values);

    console.log('✅ Site saved successfully, ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Site saved successfully',
      data: {
        id: result.insertId,
        ...siteData
      }
    });

  } catch (error) {
    console.error('❌ Error saving site:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving site to database',
      error: error.message
    });
  }
});

// Get all sites
app.get('/api/sites', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM place ORDER BY user_id DESC');

    // Map database columns to frontend format
    const sites = rows.map(row => ({
      id: row.user_id,
      name: row.place_name,
      nameArabic: row.place_name_arabic,
      type: row.site_type,
      color: row.pin_colour,
      city: row.city,
      state: row.state,
      coordinates: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      },
      period: row.Period_Name,
      subPeriod: row.Sub_period,
      descriptionEnglish: row.Des_cription,
      descriptionArabic: row.Des_arabic,
      references: row.Ref_erences,
      media: row.Media
    }));

    res.json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    console.error('❌ Error fetching sites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sites',
      error: error.message
    });
  }
});

// Get single site by ID
app.get('/api/sites/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM place WHERE user_id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    const row = rows[0];
    const site = {
      id: row.user_id,
      name: row.place_name,
      nameArabic: row.place_name_arabic,
      type: row.site_type,
      color: row.pin_colour,
      city: row.city,
      state: row.state,
      coordinates: {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude)
      },
      period: row.Period_Name,
      subPeriod: row.Sub_period,
      descriptionEnglish: row.Des_cription,
      descriptionArabic: row.Des_arabic,
      references: row.Ref_erences,
      media: row.Media
    };

    res.json({
      success: true,
      data: site
    });
  } catch (error) {
    console.error('❌ Error fetching site:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site',
      error: error.message
    });
  }
});

// Update site
app.put('/api/sites/:id', async (req, res) => {
  try {
    const siteData = req.body;

    const query = `
      UPDATE place SET
        place_name = ?,
        place_name_arabic = ?,
        site_type = ?,
        pin_colour = ?,
        city = ?,
        state = ?,
        latitude = ?,
        longitude = ?,
        Period_Name = ?,
        Sub_period = ?,
        Des_cription = ?,
        Des_arabic = ?,
        Ref_erences = ?,
        Media = ?
      WHERE user_id = ?
    `;

    const values = [
      siteData.name,
      siteData.nameArabic,
      siteData.type || 'Heritage Site',
      siteData.color || '#8B4513',
      siteData.city,
      siteData.state,
      siteData.coordinates?.lat || siteData.latitude,
      siteData.coordinates?.lng || siteData.longitude,
      siteData.period || siteData.periodName || null,
      siteData.subPeriod || null,
      siteData.descriptionEnglish || null,
      siteData.descriptionArabic || null,
      siteData.references || null,
      siteData.media || null,
      req.params.id
    ];

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    res.json({
      success: true,
      message: 'Site updated successfully',
      data: { id: req.params.id, ...siteData }
    });
  } catch (error) {
    console.error('❌ Error updating site:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating site',
      error: error.message
    });
  }
});

// Delete site
app.delete('/api/sites/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM place WHERE user_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    res.json({
      success: true,
      message: 'Site deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting site:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting site',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Saudi Heritage API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/sites`);
});

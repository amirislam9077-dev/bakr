const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/saudi-heritage';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Site Schema
const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameArabic: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#8B4513'
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  period: String,
  subPeriod: String,
  descriptionEnglish: String,
  descriptionArabic: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Site = mongoose.model('Site', siteSchema);

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

    // Create new site
    const newSite = new Site(siteData);
    const savedSite = await newSite.save();

    console.log('✅ Site saved successfully:', savedSite.name);

    res.status(201).json({
      success: true,
      message: 'Site saved successfully',
      data: savedSite
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
    const sites = await Site.find().sort({ createdAt: -1 });
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
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }
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
    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSite) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    res.json({
      success: true,
      message: 'Site updated successfully',
      data: updatedSite
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
    const deletedSite = await Site.findByIdAndDelete(req.params.id);

    if (!deletedSite) {
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

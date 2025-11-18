# Saudi Heritage Sites API

Backend API for managing Saudi Heritage Sites data.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## MongoDB Setup

### Option 1: Local MongoDB
If you have MongoDB installed locally, the default connection string will work:
```
mongodb://localhost:27017/saudi-heritage
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update line 11 in `server.js`:
```javascript
const MONGODB_URI = 'your-mongodb-atlas-connection-string';
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Create Site
- **POST** `/api/sites`
- Body:
```json
{
  "name": "Site Name",
  "nameArabic": "اسم الموقع",
  "type": "Mountain",
  "color": "#8B4513",
  "city": "Riyadh",
  "state": "Riyadh Region",
  "coordinates": {
    "lat": 24.7136,
    "lng": 46.6753
  },
  "period": "Islamic",
  "subPeriod": "Early Period",
  "descriptionEnglish": "Description...",
  "descriptionArabic": "وصف..."
}
```

### Get All Sites
- **GET** `/api/sites`

### Get Single Site
- **GET** `/api/sites/:id`

### Update Site
- **PUT** `/api/sites/:id`

### Delete Site
- **DELETE** `/api/sites/:id`

### Health Check
- **GET** `/api/health`

## Testing the API

You can test the API using:
- Browser: http://localhost:5000/api/health
- Postman
- cURL:
```bash
curl http://localhost:5000/api/health
```

## Common Issues

### Port already in use
If port 5000 is already in use, change the PORT in `server.js`:
```javascript
const PORT = 5001; // Change to any available port
```

### MongoDB connection failed
- Make sure MongoDB is running locally, OR
- Check your MongoDB Atlas connection string

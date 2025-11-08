# Event Management System

A full-stack application for managing events across multiple timezones with support for multiple user profiles.

## Features

- Create and manage user profiles with timezone settings
- Create events for multiple profiles simultaneously
- View events in user's selected timezone
- Update events with automatic change logging
- View event update history with timestamps
- Support for 15+ timezones
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand (state management)
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Date/Time**: dayjs with timezone support
- **UI Components**: Lucide React for icons

## Prerequisites

- Node.js 16+
- MongoDB (local or remote connection string)
- npm or yarn

## Project Structure

```
project/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── services/          # API service layer
│   ├── store/            # Zustand state management
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── server/               # Backend Express.js application
│   ├── config/           # Database configuration
│   ├── models/           # MongoDB models
│   ├── controllers/      # API controllers
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
└── .env                  # Environment variables
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create/update `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/event-management
PORT=5000
VITE_API_URL=http://localhost:5000
```

For remote MongoDB (Atlas), use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or ensure MongoDB service is running.

### 4. Start Backend Server

In a terminal:
```bash
npm run server
```

Server will run on `http://localhost:5000`

### 5. Start Frontend Development Server

In another terminal:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Profiles
- `POST /api/profiles` - Create a new profile
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/:id` - Update profile

### Events
- `POST /api/events` - Create a new event
- `GET /api/events` - Get all events
- `GET /api/events/profile/:profileId` - Get events for a profile
- `PUT /api/events/:id` - Update an event
- `GET /api/events/:id/history` - Get event update history

## Usage

### Create a Profile
1. Click on the profile selector dropdown at the top right
2. Click "Add Profile"
3. Enter profile name
4. Profile is created with default UTC timezone

### Create an Event
1. On the left sidebar, select one or more profiles from the dropdown
2. Choose a timezone for the event
3. Select start date and time
4. Select end date and time
5. Click "Create Event"

### View Events
- Events display in the selected timezone
- If no profile is selected, all events are shown
- Select a profile to view only their events
- All timestamps respect the user's timezone preference

### Update an Event
1. Click the Edit (pencil) icon on an event
2. Modify start and/or end dates/times
3. Click "Update Event"
4. Change is logged automatically

### View Event History
1. Click the History (clock) icon on an event
2. View all changes with timestamps
3. See previous and updated values

## Building for Production

```bash
npm run build
```

This creates optimized production build in `dist/` directory.

## Database Schema

### Profile Collection
```javascript
{
  name: String (required),
  timezone: String (default: "UTC"),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```javascript
{
  title: String,
  profiles: [ObjectId], // References to Profile documents
  timezone: String,
  startDate: Date,
  endDate: Date,
  updateHistory: [{
    field: String,
    previousValue: Mixed,
    newValue: Mixed,
    updatedAt: Date,
    updatedBy: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Timezone Support

Supported timezones:
- UTC
- America/New_York, America/Chicago, America/Denver, America/Los_Angeles
- Europe/London, Europe/Paris, Europe/Berlin
- Asia/Tokyo, Asia/Shanghai, Asia/Hong_Kong, Asia/Dubai, Asia/Kolkata
- Australia/Sydney
- Pacific/Auckland

## Features Explained

### Multi-Timezone Handling
- Each profile has a timezone setting
- Events are stored in UTC internally
- Frontend converts UTC to user's timezone for display
- Update history timestamps show in user's timezone

### Event Update History
- Tracks all changes to events (fields, dates, profiles)
- Shows previous and new values
- Timestamps in user's selected timezone
- Useful for audit trails and change tracking

### Responsive Design
- Mobile-friendly interface
- Adapts to different screen sizes
- Touch-friendly controls
- Desktop optimization with proper spacing

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env is correct
- Verify network connectivity for remote connections

### API Connection Error
- Ensure backend server is running on port 5000
- Check VITE_API_URL in .env points to correct server
- Verify CORS is enabled (it is by default)

### Date/Time Not Displaying Correctly
- Check browser console for errors
- Verify timezone is correctly set in profile
- Clear browser cache and refresh

## License

MIT

# Luxury Car Meetup Event Page

## Overview
This is a new Arabic event page for a luxury car meetup taking place in Akko on August 18, 2025. The page features a modern, responsive design with a registration form for attendees.

## Features

### 🎯 Event Details
- **Date**: August 18, 2025
- **Time**: 6:30 PM (18:30)
- **Location**: Baltimore 32, Acco Darom, Akko
- **Organizer**: ASD Auto Spa Detailing

### 🚗 Event Highlights
- Luxury cars showcase (Aventador, Huracan, R8, M-Power, AMG, Ferrari F8, Dodge Hellcat)
- DJ entertainment
- Refreshments
- Professional organization

### 📝 Registration Form
The registration form includes the following fields:
- Full Name (required)
- Phone Number (required)
- Email (required)
- Car Model (optional)
- Car Year (optional)
- Plate Number (optional)
- Message (optional)

## Technical Implementation

### File Structure
```
app/events/luxury-car-meetup/
├── page.tsx                    # Main event page component
└── route.ts                    # API endpoint for registration

app/api/events/register/
└── route.ts                    # Registration API endpoint
```

### Key Components
- **Hero Section**: Large banner with event title and key details
- **Event Description**: Detailed information about the event
- **Features Grid**: Visual representation of event highlights
- **Organizer Info**: Information about the event organizer
- **Registration Form**: Sticky sidebar form for attendees
- **Call to Action**: Bottom section encouraging registration

### Styling
- Modern gradient backgrounds
- Responsive design for all screen sizes
- Arabic RTL text direction support
- Smooth animations using Framer Motion
- Consistent with existing website design system

### Internationalization
- Full Arabic and English translations
- Uses `next-intl` for localization
- Translation keys in `messages/ar.json` and `messages/en.json`

## API Endpoint

### POST `/api/events/register`
Handles event registration submissions.

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (required)",
  "carModel": "string (optional)",
  "carYear": "string (optional)",
  "plateNumber": "string (optional)",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "registrationId": "REG-1234567890",
  "event": "Luxury Car Meetup Akko",
  "date": "18 أغسطس 2025",
  "time": "6:30 مساءً (18:30)"
}
```

## Integration

### Main Events Page
The luxury car meetup is featured on the main events page (`app/events/page.tsx`) as:
- Featured event (top banner)
- First event in the events grid
- Links directly to the event page

### Navigation
Users can access this page by:
1. Visiting `/events` and clicking on the featured event
2. Directly navigating to `/events/luxury-car-meetup`

## Future Enhancements

### Database Integration
- Replace console logging with actual database storage
- Add user authentication for registered attendees
- Implement email confirmation system

### Additional Features
- Attendee count display
- Social media sharing
- Photo gallery from previous events
- Interactive map showing event location
- Weather forecast integration

### Analytics
- Track registration conversions
- Monitor page views and engagement
- A/B testing for form optimization

## Maintenance

### Content Updates
- Event details can be updated in the `eventDetails` object
- Translations can be modified in the language files
- Images can be replaced in the public directory

### Technical Updates
- Dependencies are managed through package.json
- Styling follows Tailwind CSS conventions
- Components use existing UI component library

## Support

For technical issues or questions about this event page, please refer to:
- Component documentation in the codebase
- Translation files for content updates
- API endpoint for backend modifications

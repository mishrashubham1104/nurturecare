# NurtureCare - Full-Stack Home Nursing Website

A nursing care platform built with **React.js** (frontend) + **Node.js/Express** (backend), with **Framer Motion** animations throughout.

## Project Structure
```
NurtureCare/
├── frontend/          # React.js app
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js              # Router + layout
│       ├── index.js            # Entry point
│       ├── constants.js        # Colors, API base, animations
│       ├── context/
│       │   └── AppContext.js   # Global state + API calls
│       ├── components/
│       │   ├── Navbar.js       # Fixed navbar with active links
│       │   ├── Footer.js       # Full footer with links
│       │   └── BookingModal.js # Reusable booking modal
│       └── pages/
│           ├── HomePage.js         # Landing page
│           ├── ServicesPage.js     # All services + detail view
│           ├── HowItWorksPage.js   # Step-by-step guide + FAQ
│           ├── CaregiversPage.js   # Nurse profiles + detail view
│           ├── TestimonialsPage.js # All testimonials
│           ├── PricingPage.js      # Pricing plans
│           ├── ContactPage.js      # Contact form
│           └── BookingPage.js      # Standalone booking form
│
└── backend/           # Node.js Express API
    ├── server.js      # All routes + in-memory data
    └── package.json
```

## Quick Start

### 1. Backend (Node.js API)
```bash
cd backend
npm install
npm start
# API runs at http://localhost:5000
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | All 6 care services |
| GET | /api/caregivers | All 6 nurse profiles |
| GET | /api/testimonials | All testimonials |
| GET | /api/pricing | Pricing plans |
| POST | /api/bookings | Create a booking |
| GET | /api/bookings | List all bookings |
| POST | /api/contact | Submit contact form |

## Pages & Routes
| Route | Page |
|-------|------|
| / | Home (hero, services preview, testimonials) |
| /services | All services listing |
| /services/:slug | Individual service detail |
| /how-it-works | 5-step guide + FAQ |
| /caregivers | All nurse profiles |
| /caregivers/:id | Individual nurse profile |
| /testimonials | All reviews |
| /pricing | 3 pricing plans |
| /contact | Contact form |
| /book | Standalone booking form |

## Features
- ✅ Framer Motion animations throughout (page loads, hover, scroll-reveal)
- ✅ React Router v6 with all pages fully clickable
- ✅ Global state management with Context API
- ✅ Axios for all API calls
- ✅ Booking modal (reusable) + standalone booking page
- ✅ Contact form with success state
- ✅ Responsive layouts
- ✅ Playfair Display + DM Sans typography
- ✅ Navy + Teal color theme

## Tech Stack
- **Frontend**: React 18, React Router v6, Framer Motion, Axios
- **Backend**: Node.js, Express 4, CORS, body-parser
- **Fonts**: Google Fonts (Playfair Display, DM Sans)

- # .env.example
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
REACT_APP_API_URL=http://localhost:5000

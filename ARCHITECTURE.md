# EkkaTakka Academy — Complete Technical Blueprint
## Nepal Home Tuition Platform

---

## 1. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  Browser (React/Next.js) ─── Mobile App (React Native) │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────┐
│               CDN (Cloudflare / AWS CloudFront)         │
│  Static assets · Images · CSS/JS bundles               │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│               API GATEWAY (Nginx / AWS ALB)             │
│  Rate limiting · SSL termination · Load balancing       │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼──────┐  ┌───────▼──────────┐
│  REST API   │  │  WebSocket    │  │  File Upload     │
│ Node.js /   │  │  Server       │  │  Service         │
│ Laravel     │  │  (Real-time   │  │  (S3 / Local)    │
│             │  │   chat)       │  │                  │
└──────┬──────┘  └───────────────┘  └──────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│  PostgreSQL (primary) ─ Redis (cache/sessions/OTP)      │
│  Elasticsearch (teacher search) ─ S3 (documents)        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. RECOMMENDED TECH STACK

### Frontend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) | SSR, SEO, fast |
| Styling | Tailwind CSS | Utility-first, mobile-first |
| State | Zustand + React Query | Lightweight, server-state |
| Maps | Leaflet.js + OpenStreetMap | Free, Nepal coverage |
| Charts | Recharts | Lightweight |
| Real-time | Socket.io client | Chat & notifications |
| Forms | React Hook Form + Zod | Validation |

### Backend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Runtime | Node.js 20 LTS | Fast, large ecosystem |
| Framework | Express.js or Fastify | REST API |
| ORM | Prisma | Type-safe, PostgreSQL |
| Auth | JWT + bcrypt | Stateless, secure |
| Queue | Bull (Redis) | Background jobs |
| Search | Elasticsearch | Fast teacher search |
| Cache | Redis | Sessions, OTP, filters |
| Storage | AWS S3 / DigitalOcean Spaces | Documents |

### Database
- **Primary**: PostgreSQL 16 (see schema.sql)
- **Cache**: Redis 7
- **Search**: Elasticsearch 8 (optional — can start with PostgreSQL FTS)

### Payments
- **eSewa** — Nepal's #1 payment gateway
- **Khalti** — Popular alternative
- **IME Pay** — Bank transfer option

---

## 3. FOLDER STRUCTURE

```
ekkatakka-academy/
├── frontend/                     # Next.js app
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── find-teachers/
│   │   │   └── page.tsx          # Search & filter
│   │   ├── teacher/[id]/
│   │   │   └── page.tsx          # Teacher profile
│   │   ├── dashboard/
│   │   │   ├── student/page.tsx
│   │   │   └── teacher/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── register-teacher/page.tsx
│   │   └── api/                  # Next.js API routes (optional)
│   ├── components/
│   │   ├── ui/                   # Reusable atoms
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── teachers/
│   │   │   ├── TeacherCard.tsx
│   │   │   ├── TeacherModal.tsx
│   │   │   └── TeacherGrid.tsx
│   │   ├── search/
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── LocationDrillDown.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── map/
│   │   │   ├── NepalMap.tsx      # Interactive SVG map
│   │   │   └── ProvinceMap.tsx
│   │   ├── dashboard/
│   │   │   ├── StudentDash.tsx
│   │   │   └── TeacherDash.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── auth.ts               # Auth helpers
│   │   └── nepal-data.ts         # Geographic constants
│   ├── stores/
│   │   ├── authStore.ts          # Zustand auth
│   │   └── filterStore.ts        # Search filters
│   └── public/
│       ├── logo.png
│       └── hero.png
│
├── backend/                      # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── teachers.routes.ts
│   │   │   ├── students.routes.ts
│   │   │   ├── bookings.routes.ts
│   │   │   ├── reviews.routes.ts
│   │   │   ├── payments.routes.ts
│   │   │   ├── messages.routes.ts
│   │   │   ├── nepal.routes.ts   # Provinces, districts, etc.
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── teacher.service.ts
│   │   │   ├── search.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── otp.service.ts
│   │   │   └── recommendation.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verify
│   │   │   ├── roleGuard.ts      # student/teacher/admin
│   │   │   ├── rateLimiter.ts
│   │   │   └── upload.ts         # Multer S3
│   │   ├── models/               # Prisma models
│   │   ├── utils/
│   │   └── config/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── schema.sql                    # Full PostgreSQL schema
├── ARCHITECTURE.md               # This file
└── docker-compose.yml
```

---

## 4. REST API ENDPOINTS

### Auth
```
POST   /api/auth/send-otp          Send OTP to phone
POST   /api/auth/verify-otp        Verify OTP → JWT token
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with phone+password
POST   /api/auth/refresh           Refresh JWT token
POST   /api/auth/logout
```

### Nepal Geography
```
GET    /api/nepal/provinces                 All 7 provinces
GET    /api/nepal/districts?province_id=3   Districts in province
GET    /api/nepal/local-levels?district_id=27   Local levels
GET    /api/nepal/wards?local_level_id=1    Wards list
GET    /api/nepal/search?q=kathmandu        Search any location
```

### Teacher Search (core)
```
GET    /api/teachers
       Query params:
         province_id, district_id, local_level_id, ward_id
         subject, grade, mode (Home Tuition|Online)
         gender, language
         min_price, max_price
         min_rating
         verified, demo_available
         sort (rating|price_asc|price_desc|experience|reviews)
         page, limit
         nearby_lat, nearby_lng, radius_km   ← Nearby feature

GET    /api/teachers/:id            Full teacher profile
GET    /api/teachers/:id/reviews    Teacher reviews
GET    /api/teachers/:id/availability  Available slots
GET    /api/teachers/featured       Top rated (homepage)
GET    /api/teachers/recommended    AI recommendations
```

### Teacher Management
```
POST   /api/teachers/register       Register as teacher
PUT    /api/teachers/:id            Update profile
POST   /api/teachers/:id/areas      Add service area
DELETE /api/teachers/:id/areas/:aid Remove service area
POST   /api/teachers/:id/availability  Set availability
PUT    /api/teachers/:id/online-status Toggle online/offline
POST   /api/teachers/:id/documents  Upload document
GET    /api/teachers/:id/dashboard  Teacher dashboard data
GET    /api/teachers/:id/earnings   Earnings report
GET    /api/teachers/:id/students   Current students
```

### Bookings
```
POST   /api/bookings                Create booking request
GET    /api/bookings/:id            Get booking details
PUT    /api/bookings/:id/accept     Teacher accepts
PUT    /api/bookings/:id/reject     Teacher rejects
PUT    /api/bookings/:id/cancel     Student/teacher cancels
GET    /api/bookings/my             My bookings (student/teacher)
POST   /api/bookings/:id/demo       Request demo class
```

### Reviews
```
POST   /api/reviews                 Submit review (student only)
GET    /api/reviews/teacher/:id     Teacher's reviews
PUT    /api/reviews/:id             Edit review
DELETE /api/reviews/:id             Delete review (admin)
```

### Payments
```
POST   /api/payments/esewa/initiate    Start eSewa payment
POST   /api/payments/esewa/callback    eSewa webhook
POST   /api/payments/khalti/initiate   Start Khalti payment
POST   /api/payments/khalti/callback   Khalti webhook
GET    /api/payments/history           Payment history
```

### Chat
```
GET    /api/messages/:bookingId     Chat history
POST   /api/messages               Send message
PUT    /api/messages/:id/read       Mark as read
WebSocket: ws://api/chat            Real-time messages
```

### Student
```
GET    /api/students/:id/dashboard  Dashboard data
GET    /api/students/:id/saved      Saved teachers
POST   /api/students/:id/saved/:tid Save teacher
DELETE /api/students/:id/saved/:tid Unsave teacher
PUT    /api/students/:id/profile    Update profile
```

### Admin
```
GET    /api/admin/stats             Dashboard stats
GET    /api/admin/teachers          All teachers + filters
PUT    /api/admin/teachers/:id/verify  Verify/reject teacher
GET    /api/admin/bookings          All bookings
GET    /api/admin/payments          Payment ledger
GET    /api/admin/analytics         Charts & metrics
POST   /api/admin/nepal/provinces   Add province (rare)
POST   /api/admin/nepal/districts   Add district
POST   /api/admin/nepal/local-levels Add local level
```

---

## 5. SMART RECOMMENDATION ENGINE

```javascript
// Score each teacher for a student
function scoreTeacher(teacher, student) {
  let score = 0;

  // Location proximity (highest weight)
  if (teacher.ward_id === student.ward_id)           score += 50;
  else if (teacher.local_level_id === student.local_level_id) score += 35;
  else if (teacher.district_id === student.district_id)       score += 20;
  else if (teacher.province_id === student.province_id)       score += 10;

  // Subject match
  if (teacher.subjects.includes(student.desired_subject)) score += 25;

  // Grade match
  if (teacher.grades.includes(student.grade_level))   score += 15;

  // Budget match
  if (teacher.price_monthly <= student.budget)        score += 10;

  // Mode match
  if (teacher.mode.includes(student.preferred_mode))  score += 10;

  // Quality signals
  score += teacher.rating * 3;          // 0–15
  score += Math.min(teacher.reviews / 10, 5); // 0–5
  score += teacher.experience_years * 0.5;    // experience bonus
  if (teacher.is_verified)              score += 8;
  if (teacher.demo_available)           score += 5;

  return score;
}
```

---

## 6. NEARBY TEACHERS (Geolocation)

```javascript
// PostgreSQL query using PostGIS (or Haversine formula)
const nearbyTeachers = await db.query(`
  SELECT t.*, 
    (6371 * acos(
      cos(radians($1)) * cos(radians(lat)) * 
      cos(radians(lng) - radians($2)) + 
      sin(radians($1)) * sin(radians(lat))
    )) AS distance_km
  FROM teachers t
  JOIN wards w ON t.ward_id = w.id
  WHERE t.teaching_mode @> ARRAY['Home Tuition']
    AND t.is_verified = TRUE
  HAVING distance_km < $3
  ORDER BY distance_km ASC
  LIMIT 20
`, [studentLat, studentLng, radiusKm]);
```

---

## 7. DATABASE INDEXES STRATEGY

```sql
-- Composite index for the most common search pattern
CREATE INDEX idx_teachers_location_mode ON teachers
  (district_id, local_level_id, ward_id)
  WHERE is_verified = TRUE;

-- For price range + rating filter
CREATE INDEX idx_teachers_price_rating ON teachers
  (price_monthly, rating DESC);

-- For subject search (via teacher_subjects join)
CREATE INDEX idx_ts_subject ON teacher_subjects(subject_id, teacher_id);

-- Partial index for online teachers only
CREATE INDEX idx_teachers_online ON teachers(province_id, district_id)
  WHERE 'Online' = ANY(teaching_mode);
```

---

## 8. SEO STRATEGY

### URL Structure
```
/                                   Homepage
/find-teachers                      All teachers search
/find-teachers/bagmati-province     Province page
/find-teachers/bagmati/kathmandu    District page
/find-teachers/kathmandu-metropolitan-city  Local level page
/find-teachers/kathmandu/ward-15    Ward page
/teacher/sushila-adhikari-math      Teacher profile
/subjects/mathematics               Subject page
/online-tuition                     Online tuition page
/home-tuition-nepal                 Home tuition landing
```

### Meta Tags per page
```tsx
// Dynamic SEO for teacher search pages
export function generateMetadata({ params }) {
  return {
    title: `Home Tuition Teachers in ${params.district} | EkkaTakka Academy`,
    description: `Find verified home tuition and online teachers in ${params.district}, Nepal. Browse by subject, grade, and ward.`,
    keywords: `home tuition ${params.district}, teacher ${params.district} Nepal, tutor ${params.district}`,
    openGraph: { ... },
    alternates: {
      canonical: `https://ekkatakka.com/find-teachers/${params.province}/${params.district}`
    }
  };
}
```

### Sitemap (auto-generated)
```
/sitemap.xml:
  - All 7 province pages
  - All 77 district pages  
  - All 753 local level pages
  - All teacher profile pages
  - Subject pages (23)
  → Total: ~900+ indexed pages
```

---

## 9. DEPLOYMENT PLAN

### Option A: VPS (Budget — NPR 3,000/month)
```
DigitalOcean Droplet (4GB RAM, 2 vCPU)
├── Nginx (reverse proxy + SSL via Let's Encrypt)
├── PM2 (Node.js process manager)
├── PostgreSQL 16
├── Redis 7
└── Docker (optional)
```

### Option B: Cloud (Scalable — NPR 15,000+/month)
```
AWS / GCP Setup:
├── EC2 (t3.medium) — API servers
├── RDS PostgreSQL — Managed database
├── ElastiCache Redis — Session/cache
├── S3 + CloudFront — Static files + CDN
├── Route 53 — DNS
└── ACM — Free SSL
```

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ekkatakka
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  api:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      DATABASE_URL: postgresql://admin:secret@db/ekkatakka
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on: [db, redis]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://api:4000
    depends_on: [api]
```

---

## 10. RECOMMENDED LIBRARIES

### Frontend (npm)
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0",
  "recharts": "^2.10.0",
  "socket.io-client": "^4.6.0",
  "axios": "^1.6.0",
  "date-fns": "^3.0.0",
  "framer-motion": "^11.0.0",
  "react-hot-toast": "^2.4.0",
  "next-seo": "^6.5.0"
}
```

### Backend (npm)
```json
{
  "express": "^4.18.0",
  "prisma": "^5.10.0",
  "@prisma/client": "^5.10.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "ioredis": "^5.3.0",
  "multer": "^1.4.0",
  "multer-s3": "^3.0.0",
  "socket.io": "^4.6.0",
  "bull": "^4.12.0",
  "nodemailer": "^6.9.0",
  "axios": "^1.6.0",
  "helmet": "^7.1.0",
  "cors": "^2.8.0",
  "express-rate-limit": "^7.2.0",
  "winston": "^3.11.0",
  "joi": "^17.12.0"
}
```

---

## 11. SECURITY CHECKLIST

- [x] JWT tokens with expiry (15min access, 7d refresh)
- [x] OTP-based phone login (Sparrow SMS / Aakash SMS)
- [x] bcrypt password hashing (rounds: 12)
- [x] Role-based access control (student/teacher/admin)
- [x] Rate limiting on API endpoints
- [x] Helmet.js security headers
- [x] Input sanitization & validation (Zod/Joi)
- [x] File upload type/size validation
- [x] SQL injection prevention (Prisma ORM)
- [x] XSS protection (React + DOMPurify)
- [x] CORS configuration
- [x] HTTPS only (Let's Encrypt)
- [x] Admin IP whitelist (optional)

---

## 12. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Homepage LCP | < 2.5s |
| Teacher search API | < 200ms |
| Filter response | < 150ms (Redis cache) |
| Concurrent users | 1,000+ |
| Database query (search) | < 50ms with indexes |
| Uptime | 99.9% |

---

## 13. PHASE-WISE DEVELOPMENT

### Phase 1 — MVP (Month 1-2): NPR 0 cost
- [x] Static website (current build)
- [x] Nepal geographic database
- [x] Teacher listing & search
- [x] Teacher registration form
- [ ] Deploy on Vercel (free)

### Phase 2 — Backend (Month 2-3)
- [ ] Node.js API + PostgreSQL
- [ ] OTP login (SMS gateway)
- [ ] Booking system
- [ ] Teacher verification workflow
- [ ] Admin panel

### Phase 3 — Payments & Chat (Month 3-4)
- [ ] eSewa integration
- [ ] Khalti integration
- [ ] Real-time chat (Socket.io)
- [ ] Push notifications

### Phase 4 — AI & Scale (Month 4-6)
- [ ] Smart recommendation engine
- [ ] Elasticsearch for fast search
- [ ] Mobile app (React Native)
- [ ] Video demo classes (WebRTC / Daily.co)
- [ ] Multi-language (Nepali/English)

---

*EkkaTakka Academy — Worldwide Education Platform*
*Director: Lilavajra B Shreepali | Pokhara, Nepal | 9763248479*

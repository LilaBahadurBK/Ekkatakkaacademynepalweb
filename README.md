# 🏔️ EkkaTakka Academy — Find Teachers Across Nepal

**Nepal's most complete home tuition and online tutoring platform**

> Worldwide Education Platform | Director: Lilavajra B Shreepali | Pokhara, Nepal

---

## 📦 What's Inside This Package

| File | Description |
|------|-------------|
| `index.html` | Homepage with hero, province browser, featured teachers, interactive map |
| `find-teachers.html` | Full teacher search with province→district→ward drill-down + advanced filters |
| `teacher-register.html` | Teacher registration form with all fields |
| `dashboard-student.html` | Student dashboard — bookings, chat, payments, progress |
| `dashboard-teacher.html` | Teacher dashboard — schedule, earnings, availability, areas |
| `admin.html` | Admin panel — manage teachers, students, bookings, Nepal locations |
| `db.js` | Complete Nepal geographic database + 12 sample teachers |
| `app.js` | All JavaScript — search engine, drill-down, modal, filters, smart match |
| `style.css` | Full responsive CSS — dark mode, mobile-first |
| `schema.sql` | Production PostgreSQL database schema |
| `ARCHITECTURE.md` | Full tech stack, API docs, deployment guide |

---

## 🚀 How to Open

1. **Extract** the ZIP file
2. **Open** `index.html` in any browser
3. Everything works — no server needed for the frontend!

---

## ✨ Features Implemented

### 🗺️ Nepal Geographic System
- All **7 Provinces** with Nepali names
- All **77 Districts**
- **54 Local Levels** in the database (major cities fully mapped)
- **Ward-level** drill-down for all listed local levels
- Interactive **Nepal SVG map** — click province to explore

### 🔍 Teacher Search
- Province → District → Local Level → Ward drill-down browser
- **10 filter types**: subject, grade, mode, gender, price, rating, verified, demo
- Fast **instant filter** with active filter tags
- List view and **grid view** toggle
- Sort by rating / price / experience / reviews
- **Pagination** system
- **URL parameter support** (shareable search links)

### 👨‍🏫 Teacher Profiles
- Full profile **modal** with all details
- Availability calendar (days + time slots)
- Pricing (monthly + hourly)
- Subjects, grades, languages, travel radius
- Rating, reviews count, verification badge
- **Book Now** + **WhatsApp** + **Request Demo** actions

### 📱 Dashboards
- **Student Dashboard**: bookings, saved teachers, chat, online classes, payments (eSewa/Khalti), progress bars, reviews
- **Teacher Dashboard**: schedule, booking requests accept/reject, student list, earnings chart, availability manager, teaching areas, documents upload
- **Admin Panel**: stats, teacher management, location data, verify documents, bookings, payments, analytics charts

### 🎨 UI/UX
- **Dark Mode** (toggle + localStorage)
- **Mobile responsive** (hamburger menu, stacked layouts)
- Smooth animations and fade-in effects
- Toast notifications
- Counter animations on homepage
- Professional navy + orange color scheme

---

## 📞 Contact

- **Phone / WhatsApp**: 9763248479
- **Address**: Pokhara, Nepal
- **Director**: Lilavajra B Shreepali

---

## 🔧 For Production (Next Steps)

See `ARCHITECTURE.md` for:
- Full PostgreSQL schema (`schema.sql`)
- REST API endpoint documentation
- Next.js + Node.js backend setup
- Docker Compose configuration
- eSewa / Khalti payment integration
- SEO strategy (753 location pages)
- Deployment guide (VPS / AWS)
- Smart recommendation algorithm

---

*© 2025 EkkaTakka Academy. All Rights Reserved.*

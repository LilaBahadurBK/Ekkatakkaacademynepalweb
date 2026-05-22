// ============================================================
// EKKATAKKA ACADEMY — NEPAL GEOGRAPHIC + TEACHER DATABASE
// ============================================================

const DB = {

  // ── PROVINCES ──────────────────────────────────────────────
  provinces: [
    { id: 1, name: "Koshi Province", name_np: "कोशी प्रदेश", capital: "Biratnagar" },
    { id: 2, name: "Madhesh Province", name_np: "मधेश प्रदेश", capital: "Janakpurdham" },
    { id: 3, name: "Bagmati Province", name_np: "बाग्मती प्रदेश", capital: "Hetauda" },
    { id: 4, name: "Gandaki Province", name_np: "गण्डकी प्रदेश", capital: "Pokhara" },
    { id: 5, name: "Lumbini Province", name_np: "लुम्बिनी प्रदेश", capital: "Deukhuri" },
    { id: 6, name: "Karnali Province", name_np: "कर्णाली प्रदेश", capital: "Birendranagar" },
    { id: 7, name: "Sudurpashchim Province", name_np: "सुदूरपश्चिम प्रदेश", capital: "Godawari" }
  ],

  // ── DISTRICTS (all 77) ─────────────────────────────────────
  districts: [
    // Koshi (1)
    { id:1, province_id:1, name:"Taplejung" }, { id:2, province_id:1, name:"Panchthar" },
    { id:3, province_id:1, name:"Ilam" }, { id:4, province_id:1, name:"Jhapa" },
    { id:5, province_id:1, name:"Morang" }, { id:6, province_id:1, name:"Sunsari" },
    { id:7, province_id:1, name:"Dhankuta" }, { id:8, province_id:1, name:"Terhathum" },
    { id:9, province_id:1, name:"Sankhuwasabha" }, { id:10, province_id:1, name:"Bhojpur" },
    { id:11, province_id:1, name:"Solukhumbu" }, { id:12, province_id:1, name:"Okhaldhunga" },
    { id:13, province_id:1, name:"Khotang" }, { id:14, province_id:1, name:"Udayapur" },
    // Madhesh (2)
    { id:15, province_id:2, name:"Saptari" }, { id:16, province_id:2, name:"Siraha" },
    { id:17, province_id:2, name:"Dhanusha" }, { id:18, province_id:2, name:"Mahottari" },
    { id:19, province_id:2, name:"Sarlahi" }, { id:20, province_id:2, name:"Rautahat" },
    { id:21, province_id:2, name:"Bara" }, { id:22, province_id:2, name:"Parsa" },
    // Bagmati (3)
    { id:23, province_id:3, name:"Sindhupalchok" }, { id:24, province_id:3, name:"Rasuwa" },
    { id:25, province_id:3, name:"Dhading" }, { id:26, province_id:3, name:"Nuwakot" },
    { id:27, province_id:3, name:"Kathmandu" }, { id:28, province_id:3, name:"Bhaktapur" },
    { id:29, province_id:3, name:"Lalitpur" }, { id:30, province_id:3, name:"Kavrepalanchok" },
    { id:31, province_id:3, name:"Sindhuli" }, { id:32, province_id:3, name:"Ramechhap" },
    { id:33, province_id:3, name:"Dolakha" }, { id:34, province_id:3, name:"Makwanpur" },
    { id:35, province_id:3, name:"Chitwan" },
    // Gandaki (4)
    { id:36, province_id:4, name:"Kaski" }, { id:37, province_id:4, name:"Syangja" },
    { id:38, province_id:4, name:"Parbat" }, { id:39, province_id:4, name:"Baglung" },
    { id:40, province_id:4, name:"Myagdi" }, { id:41, province_id:4, name:"Mustang" },
    { id:42, province_id:4, name:"Manang" }, { id:43, province_id:4, name:"Lamjung" },
    { id:44, province_id:4, name:"Tanahun" }, { id:45, province_id:4, name:"Gorkha" },
    { id:46, province_id:4, name:"Nawalpur" },
    // Lumbini (5)
    { id:47, province_id:5, name:"Rupandehi" }, { id:48, province_id:5, name:"Kapilvastu" },
    { id:49, province_id:5, name:"Arghakhanchi" }, { id:50, province_id:5, name:"Gulmi" },
    { id:51, province_id:5, name:"Palpa" }, { id:52, province_id:5, name:"Nawalparasi West" },
    { id:53, province_id:5, name:"Dang" }, { id:54, province_id:5, name:"Banke" },
    { id:55, province_id:5, name:"Bardiya" }, { id:56, province_id:5, name:"Rolpa" },
    { id:57, province_id:5, name:"Rukum East" }, { id:58, province_id:5, name:"Pyuthan" },
    // Karnali (6)
    { id:59, province_id:6, name:"Surkhet" }, { id:60, province_id:6, name:"Dailekh" },
    { id:61, province_id:6, name:"Jajarkot" }, { id:62, province_id:6, name:"Dolpa" },
    { id:63, province_id:6, name:"Humla" }, { id:64, province_id:6, name:"Jumla" },
    { id:65, province_id:6, name:"Kalikot" }, { id:66, province_id:6, name:"Mugu" },
    { id:67, province_id:6, name:"Salyan" }, { id:68, province_id:6, name:"Rukum West" },
    // Sudurpashchim (7)
    { id:69, province_id:7, name:"Kanchanpur" }, { id:70, province_id:7, name:"Kailali" },
    { id:71, province_id:7, name:"Doti" }, { id:72, province_id:7, name:"Achham" },
    { id:73, province_id:7, name:"Bajura" }, { id:74, province_id:7, name:"Bajhang" },
    { id:75, province_id:7, name:"Darchula" }, { id:76, province_id:7, name:"Baitadi" },
    { id:77, province_id:7, name:"Dadeldhura" }
  ],

  // ── LOCAL LEVELS (representative sample — full major ones) ──
  localLevels: [
    // Kathmandu district (27)
    { id:1, district_id:27, name:"Kathmandu Metropolitan City", type:"Metropolitan", wards:32 },
    { id:2, district_id:27, name:"Kageshwori Manohara", type:"Municipality", wards:9 },
    { id:3, district_id:27, name:"Gokarneshwor", type:"Municipality", wards:9 },
    { id:4, district_id:27, name:"Shankharapur", type:"Municipality", wards:9 },
    { id:5, district_id:27, name:"Nagarjun", type:"Municipality", wards:9 },
    { id:6, district_id:27, name:"Budhanilkantha", type:"Municipality", wards:10 },
    { id:7, district_id:27, name:"Tokha", type:"Municipality", wards:11 },
    { id:8, district_id:27, name:"Tarakeshwor", type:"Municipality", wards:11 },
    { id:9, district_id:27, name:"Chandragiri", type:"Municipality", wards:15 },
    { id:10, district_id:27, name:"Kirtipur", type:"Municipality", wards:10 },
    // Lalitpur district (29)
    { id:11, district_id:29, name:"Lalitpur Metropolitan City", type:"Metropolitan", wards:29 },
    { id:12, district_id:29, name:"Godawari", type:"Municipality", wards:14 },
    { id:13, district_id:29, name:"Mahalaxmi", type:"Municipality", wards:11 },
    { id:14, district_id:29, name:"Konjyosom", type:"Rural Municipality", wards:5 },
    { id:15, district_id:29, name:"Bagmati", type:"Rural Municipality", wards:5 },
    // Bhaktapur district (28)
    { id:16, district_id:28, name:"Bhaktapur Municipality", type:"Municipality", wards:10 },
    { id:17, district_id:28, name:"Madhyapur Thimi", type:"Municipality", wards:7 },
    { id:18, district_id:28, name:"Changunarayan", type:"Municipality", wards:9 },
    { id:19, district_id:28, name:"Suryabinayak", type:"Municipality", wards:9 },
    // Kaski / Pokhara district (36)
    { id:20, district_id:36, name:"Pokhara Metropolitan City", type:"Metropolitan", wards:33 },
    { id:21, district_id:36, name:"Annapurna", type:"Rural Municipality", wards:6 },
    { id:22, district_id:36, name:"Machhapuchchhre", type:"Rural Municipality", wards:7 },
    { id:23, district_id:36, name:"Madi", type:"Rural Municipality", wards:6 },
    { id:24, district_id:36, name:"Rupa", type:"Rural Municipality", wards:5 },
    // Chitwan (35)
    { id:25, district_id:35, name:"Bharatpur Metropolitan City", type:"Metropolitan", wards:29 },
    { id:26, district_id:35, name:"Ratnanagar", type:"Municipality", wards:9 },
    { id:27, district_id:35, name:"Khairhani", type:"Municipality", wards:10 },
    { id:28, district_id:35, name:"Rapti", type:"Municipality", wards:7 },
    { id:29, district_id:35, name:"Ichchhakamana", type:"Rural Municipality", wards:6 },
    // Rupandehi (47)
    { id:30, district_id:47, name:"Butwal Sub-Metropolitan City", type:"Sub-Metropolitan", wards:19 },
    { id:31, district_id:47, name:"Lumbini Sanskritik", type:"Municipality", wards:9 },
    { id:32, district_id:47, name:"Sainamaina", type:"Municipality", wards:8 },
    { id:33, district_id:47, name:"Siddharthanagar", type:"Municipality", wards:10 },
    // Sunsari (6)
    { id:34, district_id:6, name:"Dharan Sub-Metropolitan City", type:"Sub-Metropolitan", wards:20 },
    { id:35, district_id:6, name:"Inaruwa", type:"Municipality", wards:9 },
    { id:36, district_id:6, name:"Itahari Sub-Metropolitan City", type:"Sub-Metropolitan", wards:16 },
    // Morang (5)
    { id:37, district_id:5, name:"Biratnagar Metropolitan City", type:"Metropolitan", wards:19 },
    { id:38, district_id:5, name:"Letang", type:"Municipality", wards:9 },
    { id:39, district_id:5, name:"Rangeli", type:"Municipality", wards:9 },
    // Surkhet (59)
    { id:40, district_id:59, name:"Birendranagar", type:"Municipality", wards:11 },
    { id:41, district_id:59, name:"Gurbhakot", type:"Municipality", wards:9 },
    // Kanchanpur (69)
    { id:42, district_id:69, name:"Mahendranagar", type:"Municipality", wards:9 },
    { id:43, district_id:69, name:"Belauri", type:"Municipality", wards:9 },
    // Kailali (70)
    { id:44, district_id:70, name:"Dhangadhi Sub-Metropolitan City", type:"Sub-Metropolitan", wards:19 },
    { id:45, district_id:70, name:"Tikapur", type:"Municipality", wards:9 },
    // Jhapa (4)
    { id:46, district_id:4, name:"Mechinagar", type:"Municipality", wards:9 },
    { id:47, district_id:4, name:"Birtamod", type:"Municipality", wards:9 },
    { id:48, district_id:4, name:"Damak", type:"Municipality", wards:9 },
    // Dhanusha (17)
    { id:49, district_id:17, name:"Janakpurdham Sub-Metropolitan City", type:"Sub-Metropolitan", wards:25 },
    { id:50, district_id:17, name:"Chhireshwornath", type:"Municipality", wards:7 },
    // Bara (21)
    { id:51, district_id:21, name:"Kalaiya Sub-Metropolitan City", type:"Sub-Metropolitan", wards:21 },
    { id:52, district_id:21, name:"Nijgadh", type:"Municipality", wards:8 },
    // Makwanpur (34)
    { id:53, district_id:34, name:"Hetauda Sub-Metropolitan City", type:"Sub-Metropolitan", wards:19 },
    { id:54, district_id:34, name:"Thaha", type:"Municipality", wards:10 }
  ],

  // ── TEACHERS (sample 30 teachers with rich data) ───────────
  teachers: [
    {
      id:1, name:"Sushila Adhikari", gender:"Female",
      photo: null, initials:"SA",
      qualification:"M.Ed Mathematics, Tribhuvan University",
      experience: 8, rating: 4.9, reviews: 47,
      subjects:["Mathematics","Statistics","Physics"],
      grades:["Grade 6-8","Grade 9-SEE","+2 Science","+2 Management"],
      mode:["Home Tuition","Online"],
      province_id:3, district_id:27, local_level_id:1, ward:15,
      price_monthly: 4500, price_hourly: 300,
      available_days:["Sun","Mon","Tue","Wed","Thu"],
      time_slots:["6:00 AM - 8:00 AM","4:00 PM - 7:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Top Rated",
      bio:"8 years of experience teaching Math & Science. SEE distinction guarantee program.",
      travel_radius_km: 5
    },
    {
      id:2, name:"Bikash Thapa", gender:"Male",
      photo: null, initials:"BT",
      qualification:"BCA, Pokhara University",
      experience: 5, rating: 4.8, reviews: 32,
      subjects:["Computer Science","Programming","IT"],
      grades:["Grade 9-SEE","+2 Science","University (BCA/BIT)"],
      mode:["Home Tuition","Online"],
      province_id:4, district_id:36, local_level_id:20, ward:10,
      price_monthly: 5000, price_hourly: 350,
      available_days:["Mon","Tue","Wed","Thu","Fri"],
      time_slots:["7:00 AM - 9:00 AM","5:00 PM - 8:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Verified",
      bio:"BCA graduate specializing in C, Java, Python, Web Development and database courses.",
      travel_radius_km: 8
    },
    {
      id:3, name:"Priya Rai", gender:"Female",
      photo: null, initials:"PR",
      qualification:"MA English, Kathmandu University",
      experience: 6, rating: 4.9, reviews: 61,
      subjects:["English","Spoken English","Grammar"],
      grades:["Nursery-Grade 5","Grade 6-8","Grade 9-SEE","+2"],
      mode:["Home Tuition","Online"],
      province_id:3, district_id:29, local_level_id:11, ward:7,
      price_monthly: 4000, price_hourly: 280,
      available_days:["Sun","Mon","Wed","Thu","Sat"],
      time_slots:["6:30 AM - 8:30 AM","3:30 PM - 6:30 PM"],
      languages:["Nepali","English","Hindi"],
      verified: true, demo: true, badge:"Top Rated",
      bio:"Passionate English teacher with 6 years experience. Specializes in spoken fluency.",
      travel_radius_km: 6
    },
    {
      id:4, name:"Narayan Sharma", gender:"Male",
      photo: null, initials:"NS",
      qualification:"M.Sc Physics, TU",
      experience: 12, rating: 5.0, reviews: 89,
      subjects:["Physics","Mathematics","Chemistry"],
      grades:["Grade 9-SEE","+2 Science","University"],
      mode:["Home Tuition"],
      province_id:3, district_id:27, local_level_id:1, ward:3,
      price_monthly: 6000, price_hourly: 400,
      available_days:["Sun","Mon","Tue","Wed","Thu","Fri"],
      time_slots:["5:00 AM - 8:00 AM","4:00 PM - 7:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: false, badge:"Expert",
      bio:"12 years of board exam coaching. 95% of students score distinction in Physics & Math.",
      travel_radius_km: 4
    },
    {
      id:5, name:"Anita Gurung", gender:"Female",
      photo: null, initials:"AG",
      qualification:"B.Ed, Pokhara University",
      experience: 4, rating: 4.7, reviews: 18,
      subjects:["Nepali","Social Studies","Health"],
      grades:["Nursery-Grade 5","Grade 6-8"],
      mode:["Home Tuition","Online"],
      province_id:4, district_id:36, local_level_id:20, ward:21,
      price_monthly: 3500, price_hourly: 250,
      available_days:["Sun","Mon","Tue","Thu","Fri"],
      time_slots:["7:00 AM - 9:00 AM","3:00 PM - 6:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Verified",
      bio:"Dedicated primary school teacher. Patient and child-friendly approach.",
      travel_radius_km: 5
    },
    {
      id:6, name:"Rajan Poudel", gender:"Male",
      photo: null, initials:"RP",
      qualification:"MBA, Kathmandu University",
      experience: 7, rating: 4.8, reviews: 43,
      subjects:["Accountancy","Business Studies","Economics"],
      grades:["+2 Management","University (BBA/BBS)"],
      mode:["Home Tuition","Online"],
      province_id:3, district_id:27, local_level_id:1, ward:28,
      price_monthly: 5500, price_hourly: 380,
      available_days:["Mon","Tue","Wed","Thu","Fri","Sat"],
      time_slots:["6:00 AM - 8:00 AM","5:00 PM - 8:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Top Rated",
      bio:"MBA with 7 years teaching Accountancy and Economics for +2 and BBA levels.",
      travel_radius_km: 7
    },
    {
      id:7, name:"Sunita Malla", gender:"Female",
      photo: null, initials:"SM",
      qualification:"B.Sc Nursing, BPKIHS",
      experience: 3, rating: 4.6, reviews: 12,
      subjects:["Biology","Chemistry","Health Science"],
      grades:["Grade 9-SEE","+2 Science"],
      mode:["Online"],
      province_id:3, district_id:29, local_level_id:11, ward:4,
      price_monthly: 4000, price_hourly: 280,
      available_days:["Sat","Sun","Mon"],
      time_slots:["7:00 AM - 10:00 AM","6:00 PM - 9:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Verified",
      bio:"Nursing graduate with deep knowledge of Biology & Chemistry. Online sessions only.",
      travel_radius_km: 0
    },
    {
      id:8, name:"Deepak Karki", gender:"Male",
      photo: null, initials:"DK",
      qualification:"B.E Civil Engineering, IOE",
      experience: 5, rating: 4.9, reviews: 27,
      subjects:["Mathematics","Physics","Engineering Drawing"],
      grades:["+2 Science","University (Engineering)"],
      mode:["Home Tuition","Online"],
      province_id:3, district_id:35, local_level_id:25, ward:12,
      price_monthly: 5500, price_hourly: 380,
      available_days:["Sun","Tue","Thu","Sat"],
      time_slots:["6:00 AM - 9:00 AM","4:00 PM - 7:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Expert",
      bio:"IOE engineer providing exam-focused coaching for science students and engineering aspirants.",
      travel_radius_km: 10
    },
    {
      id:9, name:"Kamala Shrestha", gender:"Female",
      photo: null, initials:"KS",
      qualification:"M.Ed Primary Education, TU",
      experience: 9, rating: 5.0, reviews: 74,
      subjects:["All Subjects","Mathematics","English","Nepali"],
      grades:["Nursery-Grade 5"],
      mode:["Home Tuition"],
      province_id:3, district_id:28, local_level_id:16, ward:5,
      price_monthly: 3800, price_hourly: 260,
      available_days:["Sun","Mon","Tue","Wed","Thu","Fri"],
      time_slots:["7:00 AM - 10:00 AM","3:00 PM - 6:00 PM"],
      languages:["Nepali","English","Newari"],
      verified: true, demo: false, badge:"Top Rated",
      bio:"9 years of primary level teaching. Gentle, creative approach for young learners.",
      travel_radius_km: 3
    },
    {
      id:10, name:"Aakash Basnet", gender:"Male",
      photo: null, initials:"AB",
      qualification:"BCA, Tribhuvan University",
      experience: 2, rating: 4.5, reviews: 8,
      subjects:["Computer Science","Programming","Web Development"],
      grades:["Grade 9-SEE","+2 Science","University"],
      mode:["Online"],
      province_id:1, district_id:5, local_level_id:37, ward:6,
      price_monthly: 3500, price_hourly: 240,
      available_days:["Mon","Wed","Fri","Sat","Sun"],
      time_slots:["6:00 PM - 9:00 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Verified",
      bio:"Young tech tutor specializing in HTML, CSS, JavaScript, Python for beginners.",
      travel_radius_km: 0
    },
    {
      id:11, name:"Laxmi Bhattarai", gender:"Female",
      photo: null, initials:"LB",
      qualification:"MA Nepali Literature, TU",
      experience: 10, rating: 4.9, reviews: 55,
      subjects:["Nepali","Social Studies","Moral Education"],
      grades:["Grade 6-8","Grade 9-SEE","+2"],
      mode:["Home Tuition","Online"],
      province_id:4, district_id:44, local_level_id:null, ward:null,
      price_monthly: 4200, price_hourly: 290,
      available_days:["Sun","Mon","Tue","Wed","Thu"],
      time_slots:["6:00 AM - 8:00 AM","4:00 PM - 7:00 PM"],
      languages:["Nepali"],
      verified: true, demo: true, badge:"Expert",
      bio:"10 years teaching Nepali and Social Studies. Board exam specialist.",
      travel_radius_km: 6
    },
    {
      id:12, name:"Bishnu Koirala", gender:"Male",
      photo: null, initials:"BK",
      qualification:"BBS, Tribhuvan University",
      experience: 6, rating: 4.7, reviews: 29,
      subjects:["Accountancy","Mathematics","Business Studies"],
      grades:["Grade 6-8","Grade 9-SEE","+2 Management"],
      mode:["Home Tuition"],
      province_id:3, district_id:34, local_level_id:53, ward:8,
      price_monthly: 4500, price_hourly: 300,
      available_days:["Mon","Tue","Thu","Fri","Sat"],
      time_slots:["7:00 AM - 9:30 AM","3:30 PM - 6:30 PM"],
      languages:["Nepali","English"],
      verified: true, demo: true, badge:"Verified",
      bio:"Commerce specialist with 6 years of experience. Student-friendly teaching style.",
      travel_radius_km: 8
    }
  ],

  // ── SUBJECTS LIST ─────────────────────────────────────────
  subjects: [
    "All Subjects","Mathematics","Physics","Chemistry","Biology",
    "English","Spoken English","Grammar","Nepali","Social Studies",
    "Computer Science","Programming","IT","Web Development",
    "Accountancy","Business Studies","Economics","Statistics",
    "Health Science","Engineering Drawing","Moral Education",
    "Music","Fine Arts","Hindi","Science"
  ],

  // ── GRADES ───────────────────────────────────────────────
  grades: [
    "Nursery-Grade 5","Grade 6-8","Grade 9-SEE",
    "+2 Science","+2 Management","+2 Humanities",
    "University (BCA/BIT)","University (BBA/BBS)","University (Engineering)"
  ],

  // ── HELPER FUNCTIONS ─────────────────────────────────────
  getDistrictsByProvince(province_id) {
    return this.districts.filter(d => d.province_id === province_id);
  },
  getLocalLevelsByDistrict(district_id) {
    return this.localLevels.filter(l => l.district_id === district_id);
  },
  getWards(local_level_id) {
    const ll = this.localLevels.find(l => l.id === local_level_id);
    if (!ll) return [];
    return Array.from({length: ll.wards}, (_, i) => i + 1);
  },
  getTeachers(filters = {}) {
    return this.teachers.filter(t => {
      if (filters.province_id && t.province_id !== filters.province_id) return false;
      if (filters.district_id && t.district_id !== filters.district_id) return false;
      if (filters.local_level_id && t.local_level_id !== filters.local_level_id) return false;
      if (filters.ward && t.ward !== filters.ward) return false;
      if (filters.subject && !t.subjects.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()))) return false;
      if (filters.grade && !t.grades.includes(filters.grade)) return false;
      if (filters.mode && !t.mode.includes(filters.mode)) return false;
      if (filters.gender && t.gender !== filters.gender) return false;
      if (filters.max_price && t.price_monthly > filters.max_price) return false;
      if (filters.verified && !t.verified) return false;
      return true;
    });
  },
  getProvinceName(id) {
    return (this.provinces.find(p => p.id === id) || {}).name || '';
  },
  getDistrictName(id) {
    return (this.districts.find(d => d.id === id) || {}).name || '';
  },
  getLocalLevelName(id) {
    return (this.localLevels.find(l => l.id === id) || {}).name || '';
  },
  getTeacherCount(province_id) {
    return this.teachers.filter(t => t.province_id === province_id).length;
  }
};

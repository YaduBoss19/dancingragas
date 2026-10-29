const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

const INSTA_ITEMS = `[
  {
    id: "insta-01",
    type: "reel",
    category: "stage",
    title: "Live Stage Bharatanatyam Recital",
    caption: "Rooted in 21 years of sacred Bharatanatyam discipline. Captivating live stage recital showcasing rhythmic footwork, temple silk, and expressive Abhinaya. #dancingragas #bharatanatyam #stageperformance",
    imageUrl: "/images/instagram/insta_01.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    audio: "Live Stage Bells & Nattuvangam · dancingragasbymalavika",
    likes: "3.4k",
    comments: "186",
    views: "48.2k",
    tag: "Stage Shows",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-02",
    type: "reel",
    category: "workshops",
    title: "International Classical Workshop",
    caption: "Immersive masterclass coaching students on Araimandi posture, mudras, and rhythmic footwork. Empowering the next generation of classical dancers. #danceworkshop #masterclass #classicaldance",
    imageUrl: "/images/instagram/insta_02.jpg",
    videoUrl: "/videos/workshop_reel.mp4",
    audio: "Workshop Rhythm Drills · Dr. Malavika",
    likes: "2.9k",
    comments: "145",
    views: "39.5k",
    tag: "Workshops",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-03",
    type: "reel",
    category: "stage",
    title: "Auditorium Stage Choreography",
    caption: "Dynamic stage choreography presenting intricate rhythm patterns and classical grace under dramatic auditorium illumination. #stageshow #choreography #dr_malavika",
    imageUrl: "/images/instagram/insta_03.jpg",
    videoUrl: "/videos/recital_live_02.mp4",
    audio: "Auditorium Symphony · dancingragasbymalavika",
    likes: "4.1k",
    comments: "220",
    views: "53.7k",
    tag: "Stage Shows",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-04",
    type: "post",
    category: "workshops",
    title: "Institutional Dance Workshop & Training",
    caption: "Hands-on foundation training in classical posture, balance, and rhythm during an academy institutional workshop. #workshops #dancetraining #foundations",
    imageUrl: "/images/instagram/insta_06.jpg",
    audio: "Classical Sitar & Tanpura Drone",
    likes: "2.5k",
    comments: "94",
    views: "33.1k",
    tag: "Workshops",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-05",
    type: "reel",
    category: "music",
    title: "Carnatic Vocal & Shruti Sadhana",
    caption: "16+ years of hereditary vocal lineage under mother Resmi Narayanan. Daily shruti alignment, swara riyaz, and raga bhava. #carnaticmusic #vocal #shruti #ragas",
    imageUrl: "/images/instagram/insta_04.jpg",
    videoUrl: "/videos/performance.mp4",
    audio: "Raga Mayamalavagowla Alapana · Dr. Malavika",
    likes: "2.2k",
    comments: "112",
    views: "31.5k",
    tag: "Music & Dance",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-06",
    type: "post",
    category: "workshops",
    title: "Expressions & Mudras Masterclass",
    caption: "Deep dive into Hastha Mudras and expressive Abhinaya storytelling with Dr. Malavika M. Sunil. #mudras #abhinaya #masterclass",
    imageUrl: "/images/instagram/insta_09.jpg",
    audio: "Abhinaya Classical Tanpura",
    likes: "3.2k",
    comments: "138",
    views: "41.0k",
    tag: "Workshops",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  }
]`;

const newSiteContentBlock = `export const INITIAL_SITE_CONTENT = {
  brand: {
    name: "Dr. Malavika M Sunil",
    brandTitle: "Classical Dance & Music",
    tagline: "Your Passion. Your Pace. Your Personal Coach.",
    logoUrl: "/images/logo_transparent.png",
    phone: "+91 90745 85672",
    directPhone: "+91 90745 85672",
    whatsappNumber: "+919074585672",
    email: "info@malavikasunil.com",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/",
    instagramHandle: "@dancingragasbymalavika",
    address: "Worldwide Online & Kerala / Bangalore, India"
  },
  hero: {
    badge: "Physician (MBBS) & 21-Year Margam Lineage",
    titleLine1: "Your Passion.",
    titleLine2: "Your Pace.",
    titleAccent: "Your Personal Coach.",
    subtitle: "Physician-led classical Bharatanatyam Margam, Carnatic vocal music, and anatomical movement safety mentored directly by Dr. Malavika M. Sunil.",
    videoUrl: "/videos/performance.mp4",
    posterUrl: "/images/hero/hero_slide_01.jpg",
    stats: [
      { label: "Stage Recitals", value: "600+" },
      { label: "Years Classical Lineage", value: "21+" },
      { label: "Shows in Georgia", value: "20+" },
      { label: "Teaching Experience", value: "5+ yrs" }
    ]
  },
  ticker: {
    announcementText: "ADMISSIONS OPEN 2026/27: Online Bharatanatyam Diploma (Yearly Exams & Certificates) • Carnatic Classical Vocal Coaching • 1-on-1 Consultations"
  },
  about: {
    badge: "Principal Guru & Physician",
    title: "Dr. Malavika M. Sunil",
    doctorCredentials: "MBBS Physician & Classical Dancer",
    intro: "Bridging 21 years of sacred Natyashastra Margam discipline with modern anatomical movement kinesiology.",
    philosophy: "No two bodies or voices are identical. In our dedicated coaching, we discard one-size-fits-all pressures. We progress at your exact pace, aligning rhythm, anatomy, and soulful expression so you truly own your art.",
    bio1: "Welcome to a private space where classical dance and music are taught as living arts. I began my Bharatanatyam journey over 21 years ago under my father and master guru, Dr. Sunil Nellay, and trained for 16+ years in Carnatic vocal music under my mother, Resmi Narayanan. At age 12, I was honored with the prestigious CCRT National Scholarship by the Government of India.",
    bio2: "As a medical doctor (MBBS), I approach pedagogy with scientific depth. Every movement, posture, and mudra is guided with an understanding of human anatomy and biomechanics — teaching safe knee alignment in Araimandi, core engagement, and physical longevity.",
    bio3: "Beyond technique lies the heart of art: Bhava and Raga. Whether coaching an aspiring soloist, preparing for yearly diploma examinations, or guiding an adult returning to their childhood dream, each student receives meticulous 1-on-1 focus.",
    paragraphs: [
      "Dr. Malavika M. Sunil represents a rare confluence of classical devotion and medical science. Initiated into Bharatanatyam at the age of four, she underwent rigorous Margam training under venerable gurus, culminating in her prestigious CCRT National Scholarship awarded by the Government of India.",
      "As a practicing Physician (MBBS), Dr. Malavika brings profound anatomical insight into dance pedagogy. Her signature training methodology emphasizes joint alignment, Aramandi knee-angle stability, spine elongation, and breath control—ensuring dancers develop explosive rhythmic stamina without physical wear or joint injury.",
      "Having performed over 600 recitals across India and more than 20 prestigious productions in the Republic of Georgia, her classes welcome both disciplined young aspirants preparing for diploma certifications and adult returners seeking meditative mastery."
    ],
    portraitImage: "/images/malavika_dance_stage.jpg",
    credentials: [
      "CCRT National Cultural Scholar (Govt. of India)",
      "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
      "600+ Solo & Ensemble Stage Performances",
      "20+ International Recitals in Republic of Georgia",
      "Over 5 Years of Structured Pedagogical Mentorship"
    ]
  },
  instagram: ${INSTA_ITEMS},
  admissions: {
    badge: "Selective Mentorship • Admissions 2026/27",
    title: "Admissions Consultation & Audition",
    subtitle: "A private 1-on-1 pedagogical evaluation with Dr. Malavika M. Sunil (MBBS) to assess biomechanical readiness, rhythm affinity, and map the optimal diploma trajectory.",
    expectations: [
      { title: "1-on-1 Artist Evaluation", desc: "Dr. Malavika personally evaluates natural rhythm, postural alignment, and recommends the appropriate diploma or recreational tier." },
      { title: "Zero Equipment Needed", desc: "Simply join in comfortable clothing. Electronic Tanpura drone and practice guides are provided." },
      { title: "International Time Zones", desc: "Sessions scheduled flexibly across India (IST), UAE (GST), Europe (GMT/CET), USA (EST/PST), and Georgia (GET)." },
      { title: "No Up-Front Fee", desc: "Experience the virtual studio with zero up-front financial commitment." }
    ]
  },
  footer: {
    quote: "Move. Learn. Master.",
    copyrightYear: "2026",
    copyrightNotice: "Dr. Malavika M. Sunil. All rights reserved. Private Dance & Music Coaching."
  }
};`;

const regex = /export const INITIAL_SITE_CONTENT = \{[\s\S]*?\};\s*$/;
if (regex.test(dataContent)) {
  dataContent = dataContent.replace(regex, newSiteContentBlock);
  fs.writeFileSync(dataPath, dataContent, 'utf8');
  console.log('initialData.js INITIAL_SITE_CONTENT updated successfully.');
} else {
  console.error('Could not find INITIAL_SITE_CONTENT block.');
}

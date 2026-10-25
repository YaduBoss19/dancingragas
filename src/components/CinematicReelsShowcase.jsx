import React, { useState, useRef, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { playGhungrooChime } from "../utils/talamAudio";
import {
  Play,
  Pause,
  Sparkles,
  Clock,
  Eye,
  Award,
  Film,
  Music,
  GraduationCap,
  Calendar,
  ExternalLink,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Camera,
  Video
} from "lucide-react";

function InstagramIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Complete archive of authentic performances, recitals, concerts, and workshops
const PERFORMANCE_ARCHIVE = [
  // ── CLASSICAL DANCE ──────────────────────────────────────────────
  {
    id: "vid-classical-01",
    title: "Bharatanatyam — Live Stage Performance",
    subtitle: "Sacred Margam Invocations & Intricate Adavu Precision",
    category: "Classical Dance",
    duration: "14:20",
    views: "18.4K",
    date: "Oct 2026",
    thumbnail: "/images/gallery/gallery_01.jpg",
    videoUrl: "/videos/performance.mp4",
    description:
      "A full-length live Margam stage performance featuring intricate Adavu footwork, crisp Aramandi stance, and evocative Abhinaya in traditional temple silk attire.",
    featuredBadge: "Featured Masterwork"
  },
  {
    id: "vid-classical-02",
    title: "Margam Varnam & Expressive Abhinaya Recital",
    subtitle: "Rhythmic Footwork & Deep Emotional Resonance",
    category: "Classical Dance",
    duration: "18:45",
    views: "12.8K",
    date: "Sep 2026",
    thumbnail: "/images/gallery/gallery_02.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    description:
      "Dr. Malavika presents the cornerstone of the Bharatanatyam Margam — the Varnam — harmonizing brisk rhythmic jathis with nuanced emotional storytelling.",
    featuredBadge: "Classical Recital"
  },
  {
    id: "vid-classical-03",
    title: "Alarippu Invocation & Hastha Mudra Showcase",
    subtitle: "Sacred Dedication to Lord Nataraja",
    category: "Classical Dance",
    duration: "08:15",
    views: "9.6K",
    date: "Aug 2026",
    thumbnail: "/images/gallery/gallery_03.jpg",
    videoUrl: "/videos/recital_live_03.mp4",
    description:
      "The traditional opening prayer piece of the Margam repertoire, showcasing precise eye gestures (Drishti Bhedas), neck movements, and foundational postures.",
    featuredBadge: "Temple Invocation"
  },

  // ── CARNATIC MUSIC ───────────────────────────────────────────────
  {
    id: "vid-music-01",
    title: "Carnatic Vocal Shruti Alignment & Raga Alapana",
    subtitle: "16+ Years Hereditary Lineage under Resmi Narayanan",
    category: "Carnatic Music",
    duration: "16:30",
    views: "11.2K",
    date: "Oct 2026",
    thumbnail: "/images/gallery/gallery_04.jpg",
    videoUrl: "/videos/performance.mp4",
    description:
      "Rooted in hereditary musical lineage, this session demonstrates foundational Sa-Pa-Sa' Tanpura alignment, Sarali Varisais, and soulful raga elaboration.",
    featuredBadge: "Vocal Sadhana"
  },
  {
    id: "vid-music-02",
    title: "Geetham & Keerthanam Vocal Concert Recital",
    subtitle: "Devotional Compositions & Rhythmic Precision",
    category: "Carnatic Music",
    duration: "21:10",
    views: "8.7K",
    date: "Sep 2026",
    thumbnail: "/images/gallery/gallery_05.jpg",
    videoUrl: "/videos/recital_live_02.mp4",
    description:
      "Live acoustic vocal recital featuring classic Purandara Dasa and Tyagaraja compositions with pure Shruti discipline and tala clarity.",
    featuredBadge: "Concert Rendition"
  },
  {
    id: "vid-music-03",
    title: "Tala Mathematics & Swara Sadhana for Dancers",
    subtitle: "Connecting Vocal Music with Stage Footwork",
    category: "Carnatic Music",
    duration: "11:45",
    views: "7.9K",
    date: "Aug 2026",
    thumbnail: "/images/gallery/gallery_06.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    description:
      "Exploring the vital bridge between Carnatic rhythmic calculation and dancer footwork across the 7 principal Tala cycles.",
    featuredBadge: "Rhythm Masterclass"
  },

  // ── STAGE PERFORMANCES ───────────────────────────────────────────
  {
    id: "vid-stage-01",
    title: "Grand Auditorium Stage Choreography Production",
    subtitle: "Intricate Rhythm Patterns & Dramatic Illumination",
    category: "Stage Performances",
    duration: "24:50",
    views: "22.1K",
    date: "Oct 2026",
    thumbnail: "/images/gallery/gallery_07.jpg",
    videoUrl: "/videos/recital_live_02.mp4",
    description:
      "An ensemble stage choreography under theatrical illumination, highlighting spatial blocking, dynamic spins (chakkars), and synchrony.",
    featuredBadge: "Auditorium Symphony"
  },
  {
    id: "vid-stage-02",
    title: "Tbilisi International Cultural Festival & Stage Showcase",
    subtitle: "20+ Productions Across Georgia & Global Venues",
    category: "Stage Performances",
    duration: "29:15",
    views: "26.3K",
    date: "Sep 2026",
    thumbnail: "/images/gallery/gallery_08.jpg",
    videoUrl: "/videos/performance.mp4",
    description:
      "Highlights from 20+ stage productions directed and choreographed across Georgia and international venues, introducing classical Indian arts to global audiences.",
    featuredBadge: "International Showcase"
  },
  {
    id: "vid-stage-03",
    title: "Solo Thillana Climax & Pure Rhythmic Nritta",
    subtitle: "The Rhythmic Splendor of Classical Margam",
    category: "Stage Performances",
    duration: "10:15",
    views: "15.4K",
    date: "Aug 2026",
    thumbnail: "/images/gallery/gallery_09.jpg",
    videoUrl: "/videos/recital_live_03.mp4",
    description:
      "The high-energy finale of the Bharatanatyam Margam repertoire celebrating crisp footwork, statuesque poses, and joyous musical energy.",
    featuredBadge: "Stage Climax"
  },

  // ── WORKSHOPS & MASTERCLASSES ────────────────────────────────────
  {
    id: "vid-workshop-01",
    title: "International Masterclass: Araimandi Technique & Formations",
    subtitle: "Biomechanics, Joint Safety & Postural Rigor",
    category: "Workshops & Masterclasses",
    duration: "15:20",
    views: "14.6K",
    date: "Oct 2026",
    thumbnail: "/images/gallery/gallery_10.jpg",
    videoUrl: "/videos/workshop_reel.mp4",
    description:
      "Hands-on masterclass focusing on core Bharatanatyam posture, knee angles, spine alignment, and group stage movement drills.",
    featuredBadge: "Student Workshop"
  },
  {
    id: "vid-workshop-02",
    title: "Youth Classical Dance Foundation Residency",
    subtitle: "Adavu Precision, Mudras & Talam Control",
    category: "Workshops & Masterclasses",
    duration: "13:40",
    views: "10.8K",
    date: "Sep 2026",
    thumbnail: "/images/gallery/gallery_11.jpg",
    videoUrl: "/videos/workshop_reel.mp4",
    description:
      "Highlights from a multi-day youth intensive focusing on Adavu discipline, hand gestures (Hastha Mudras), and musical ear training.",
    featuredBadge: "Foundation Intensive"
  },
  {
    id: "vid-workshop-03",
    title: "Navarasa Abhinaya Clinic: 9 Classical Expressions",
    subtitle: "Facial Aesthetics, Drishti Bhedas & Emotional Truth",
    category: "Workshops & Masterclasses",
    duration: "19:30",
    views: "16.9K",
    date: "Jul 2026",
    thumbnail: "/images/gallery/gallery_12.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    description:
      "A clinical breakdown of the Natyashastra's nine emotional states (Rasas) for stage performers, taught with anatomical and somatic awareness.",
    featuredBadge: "Abhinaya Clinic"
  },

  // ── INTERVIEWS & BEHIND THE SCENES ───────────────────────────────
  {
    id: "vid-bts-01",
    title: "Physician & Artist: Bridging MBBS Medical Science & Natya",
    subtitle: "Dance Kinesiology, Spine Health & Endurance",
    category: "Interviews & Behind the Scenes",
    duration: "17:15",
    views: "31.2K",
    date: "Oct 2026",
    thumbnail: "/images/malavika_portrait.jpg",
    videoUrl: "/videos/performance.mp4",
    description:
      "Dr. Malavika discusses how her medical degree (MBBS) directly informs dance biomechanics, preventing repetitive strain injuries and enhancing dancer stamina.",
    featuredBadge: "Physician Perspective"
  },
  {
    id: "vid-bts-02",
    title: "Behind the Stage: Costume, Temple Silk & Aharya Abhinaya",
    subtitle: "Pre-Performance Preparation & Sacred Rituals",
    category: "Interviews & Behind the Scenes",
    duration: "09:45",
    views: "14.3K",
    date: "Aug 2026",
    thumbnail: "/images/stage_shows/stage_08.jpg",
    videoUrl: "/videos/recital_live_03.mp4",
    description:
      "An intimate look at pre-concert dressing rituals, temple jewelry arrangement, ghungroo tying, and mental focus before stepping under stage spotlights.",
    featuredBadge: "Backstage Access"
  },

  // ── CINEMA & PRODUCTIONS ─────────────────────────────────────────
  {
    id: "vid-cinema-01",
    title: "Malayalam Cinema Archive & Child Artiste Retrospective",
    subtitle: "Memories from Innathe Chinthavishayam, Rasathanthram & Raappakal",
    category: "Cinema & Productions",
    duration: "14:10",
    views: "38.7K",
    date: "Sep 2026",
    thumbnail: "/images/stage_shows/stage_11.jpg",
    videoUrl: "/videos/recital_live_02.mp4",
    description:
      "A reflective retrospective on Dr. Malavika's childhood roles in 5 celebrated Malayalam feature films alongside iconic directors and legends.",
    featuredBadge: "Cinema Heritage"
  },
  {
    id: "vid-cinema-02",
    title: "Contemporary & Semi-Classical Fusion Choreography",
    subtitle: "Expressive Movements Set to Modern Orchestrations",
    category: "Cinema & Productions",
    duration: "12:55",
    views: "19.5K",
    date: "Jul 2026",
    thumbnail: "/images/stage_shows/stage_10.jpg",
    videoUrl: "/videos/performance.mp4",
    description:
      "Blending traditional mudras with lyrical choreography and dynamic spins, tailored for contemporary celebrations and stage galas.",
    featuredBadge: "Fusion Showcase"
  }
];

const CATEGORIES = [
  "All Videos",
  "Classical Dance",
  "Carnatic Music",
  "Stage Performances",
  "Workshops & Masterclasses",
  "Interviews & Behind the Scenes",
  "Cinema & Productions"
];

const CREDENTIAL_HIGHLIGHTS = [
  {
    icon: Award,
    value: "21+ Years",
    label: "Bharatanatyam Margam",
    detail: "Under father Dr. Sunil Nellay"
  },
  {
    icon: Music,
    value: "16+ Years",
    label: "Carnatic Vocal Lineage",
    detail: "Under mother Resmi Narayanan"
  },
  {
    icon: Calendar,
    value: "600+ Stages",
    label: "Classical Concerts",
    detail: "Across India, Georgia & UAE"
  },
  {
    icon: Sparkles,
    value: "CCRT Scholar",
    label: "National Scholarship",
    detail: "Govt. of India (since age 12)"
  },
  {
    icon: Film,
    value: "5 Movies",
    label: "Malayalam Cinema",
    detail: "Celebrated child artiste roles"
  },
  {
    icon: GraduationCap,
    value: "MBBS Physician",
    label: "Dance Kinesiology",
    detail: "Doctor-guided joint safety"
  }
];

// Continuous Classical Stream Items (Infinite Marquee)
const INFINITE_STREAM_ITEMS = [
  {
    id: "stream-01",
    type: "video",
    title: "Live Stage Bharatanatyam Recital",
    subtitle: "Rhythmic Footwork & Temple Silk Adornment",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_01.jpg",
    videoUrl: "/videos/recital_live_01.mp4",
    duration: "Live Recital",
    badge: "Stage Recital"
  },
  {
    id: "stream-02",
    type: "video",
    title: "International Classical Workshop",
    subtitle: "Adavu Precision, Mudras & Aramandi",
    category: "Workshops",
    imageUrl: "/images/workshops/workshop_01.jpg",
    videoUrl: "/videos/workshop_reel.mp4",
    duration: "Masterclass",
    badge: "Workshop Reel"
  },
  {
    id: "stream-03",
    type: "photo",
    title: "Youth Classical Dance Workshop",
    subtitle: "Adavu Drills & Student Formations",
    category: "Workshops",
    imageUrl: "/images/workshops/workshop_02.jpg",
    duration: "Workshop",
    badge: "Foundation Drills"
  },
  {
    id: "stream-04",
    type: "video",
    title: "Auditorium Stage Choreography",
    subtitle: "Intricate Rhythm & Dynamic Grace",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_03.jpg",
    videoUrl: "/videos/recital_live_02.mp4",
    duration: "Auditorium",
    badge: "Live Choreography"
  },
  {
    id: "stream-05",
    type: "photo",
    title: "Carnatic Vocal & Shruti Sadhana",
    subtitle: "16+ Yrs Hereditary Vocal Lineage",
    category: "Music & Dance",
    imageUrl: "/images/music_and_dance/music_01.jpg",
    duration: "16+ Yrs",
    badge: "Hereditary Shruti"
  },
  {
    id: "stream-06",
    type: "photo",
    title: "Temple Recital & Salangai Bells",
    subtitle: "Alarippu Invocation to Nataraja",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_05.jpg",
    duration: "Classical Pose",
    badge: "Sacred Mudra"
  },
  {
    id: "stream-07",
    type: "photo",
    title: "Mudra & Abhinaya Masterclass",
    subtitle: "Navarasa & Hastha Mudras Training",
    category: "Workshops",
    imageUrl: "/images/workshops/workshop_03.jpg",
    duration: "Dr. Malavika",
    badge: "Mudra Workshop"
  },
  {
    id: "stream-08",
    type: "video",
    title: "Tbilisi International Residency",
    subtitle: "20+ Productions Across Georgia",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_06.jpg",
    videoUrl: "/videos/performance.mp4",
    duration: "Stage Symphony",
    badge: "Tbilisi Concert"
  },
  {
    id: "stream-09",
    type: "photo",
    title: "Music & Dance Synergy Session",
    subtitle: "Connecting Tala with Nritta",
    category: "Music & Dance",
    imageUrl: "/images/music_and_dance/music_03.jpg",
    duration: "Carnatic & Dance",
    badge: "Synergy"
  },
  {
    id: "stream-10",
    type: "photo",
    title: "Classical Silk & Stage Presence",
    subtitle: "Auditorium Performance Splendor",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_08.jpg",
    duration: "Live Concert",
    badge: "Aramandi Poise"
  },
  {
    id: "stream-11",
    type: "photo",
    title: "Institutional Workshop Intensive",
    subtitle: "Student Ensemble Synchrony",
    category: "Workshops",
    imageUrl: "/images/workshops/workshop_06.jpg",
    duration: "Ensemble",
    badge: "Group Masterclass"
  },
  {
    id: "stream-12",
    type: "photo",
    title: "Physician & Classical Dancer",
    subtitle: "MBBS Graduation & Dance Synthesis",
    category: "Doctor & Dancer",
    imageUrl: "/images/malavika_portrait.jpg",
    duration: "MBBS Doctor",
    badge: "Medical Graduate"
  },
  {
    id: "stream-13",
    type: "video",
    title: "Solo Classical Stage Recital & Abhinaya",
    subtitle: "Rhythmic Footwork & Expressive Bhava",
    category: "Stage Shows",
    imageUrl: "/images/stage_shows/stage_05.jpg",
    videoUrl: "/videos/recital_live_03.mp4",
    duration: "Solo Stage",
    badge: "Solo Recital"
  }
];

// Curated collection of verified Instagram Posts & Reels for @dancingragasbymalavika
const INSTAGRAM_WALL_ITEMS = [
  {
    id: "insta-01",
    type: "reel",
    category: "stage",
    title: "Live Stage Bharatanatyam Recital",
    caption:
      "Rooted in 21 years of sacred Bharatanatyam discipline. Captivating live stage recital showcasing rhythmic footwork, temple silk, and expressive Abhinaya. #dancingragas #bharatanatyam #stageperformance",
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
    caption:
      "Immersive masterclass coaching students on Araimandi posture, mudras, and rhythmic footwork. Empowering the next generation of classical dancers. #danceworkshop #masterclass #classicaldance",
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
    caption:
      "Dynamic stage choreography presenting intricate rhythm patterns and classical grace under dramatic auditorium illumination. #stageshow #choreography #dr_malavika",
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
    caption:
      "Hands-on foundation training in classical posture, balance, and rhythm during an academy institutional workshop. #workshops #dancetraining #foundations",
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
    caption:
      "16+ years of hereditary vocal lineage under mother Resmi Narayanan. Daily shruti alignment, swara riyaz, and raga bhava. #carnaticmusic #vocal #shruti #ragas",
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
    caption:
      "Deep dive into Hastha Mudras and expressive Abhinaya storytelling with Dr. Malavika M. Sunil. #mudras #abhinaya #masterclass",
    imageUrl: "/images/instagram/insta_09.jpg",
    audio: "Abhinaya Classical Tanpura",
    likes: "3.2k",
    comments: "138",
    views: "41.0k",
    tag: "Workshops",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-07",
    type: "post",
    category: "stage",
    title: "Temple Recital & Salangai Bells",
    caption:
      "Sacred temple recital invoking Lord Nataraja with traditional brass salangai rhythm and silk adornment. #templedance #nataraja #salangai",
    imageUrl: "/images/instagram/insta_05.jpg",
    audio: "Sacred Temple Nadaswaram & Chimes",
    likes: "3.8k",
    comments: "174",
    views: "44.6k",
    tag: "Stage Shows",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-08",
    type: "post",
    category: "music",
    title: "Music & Dance Synergy Masterclass",
    caption:
      "Integrating Carnatic rhythmic tala structures with Bharatanatyam nritta steps in dedicated studio sessions. #carnaticdance #talam #synergy",
    imageUrl: "/images/instagram/insta_08.jpg",
    audio: "Tala Swara Riyaz · Dr. Malavika",
    likes: "2.8k",
    comments: "122",
    views: "37.4k",
    tag: "Music & Dance",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-09",
    type: "post",
    category: "stage",
    title: "Tbilisi International Stage Production",
    caption:
      "International cultural bridge in Georgia: 20+ stage productions and university workshops sharing Indian classical art worldwide. #tbilisi #globaldance #culturaldiplomacy",
    imageUrl: "/images/instagram/insta_07.jpg",
    audio: "Live Stage Symphony · Tbilisi Concert",
    likes: "4.5k",
    comments: "210",
    views: "59.2k",
    tag: "Stage Shows",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  },
  {
    id: "insta-10",
    type: "post",
    category: "workshops",
    title: "Student Ensemble Workshop & Choreography",
    caption:
      "Students collaborating on group formations and stage transitions during an intensive weekend masterclass. #ensemble #groupchoreography #workshops",
    imageUrl: "/images/instagram/insta_10.jpg",
    audio: "Ensemble Footwork Rhythms",
    likes: "2.7k",
    comments: "105",
    views: "35.3k",
    tag: "Workshops",
    instagramUrl: "https://www.instagram.com/dancingragasbymalavika/"
  }
];

// Single card inside the infinite auto-scrolling stream
function InfiniteStreamCard({ item, onSelectVideo, onPhotoClick }) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (item.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlayingPreview(true)).catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (item.type === "video" && videoRef.current) {
      setIsPlayingPreview(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (item.type === "video") {
      onSelectVideo({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        category: item.category,
        duration: item.duration,
        views: "18.4K",
        date: "2026",
        thumbnail: item.imageUrl,
        videoUrl: item.videoUrl,
        description: item.subtitle,
        featuredBadge: item.badge
      });
    } else if (onPhotoClick) {
      onPhotoClick({
        id: item.id,
        title: item.title,
        url: item.imageUrl,
        category: item.category,
        caption: item.subtitle
      });
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="w-[230px] sm:w-[320px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1E1B1B] border border-[#B99A63]/30 shadow-xl group hover:border-[#B99A63] transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative tap-bounce"
    >
      <div className="aspect-[16/11] bg-[#0d0d0d] relative overflow-hidden">
        {/* Approach B: Ambient blurred glow backdrop */}
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
          aria-hidden="true"
        />

        {item.type === "video" && (
          <video
            ref={videoRef}
            src={item.videoUrl || "/videos/performance.mp4"}
            poster={item.imageUrl}
            muted
            loop
            playsInline
            className={`w-full h-full object-contain bg-black/80 transition-opacity duration-500 absolute inset-0 z-10 ${
              isPlayingPreview ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
        )}

        {/* Approach B: Uncropped full foreground photo */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className={`relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ${
            isPlayingPreview ? "opacity-0" : "opacity-100 group-hover:scale-105"
          }`}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/90 via-transparent to-black/20 pointer-events-none z-10" />

        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#151515]/90 text-[#D4AF37] border border-[#B99A63]/40 backdrop-blur-md shadow-xs">
            {item.category}
          </span>
          {item.type === "video" && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>Video</span>
            </span>
          )}
        </div>

        <span className="absolute bottom-2 right-2.5 sm:bottom-2.5 sm:right-3 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] sm:text-[10px] font-bold backdrop-blur-xs border border-white/10 z-10">
          {item.duration}
        </span>
      </div>

      <div className="p-3 sm:p-4 space-y-1 text-left bg-[#181616]">
        <h4 className="text-xs sm:text-sm font-bold font-serif-luxury text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors truncate">
          {item.title}
        </h4>
        <p className="text-[10px] sm:text-xs text-slate-400 truncate font-normal">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
}

// Single Instagram Reel Card with Hover Video Play
function InstagramWallCard({ item, onSelectVideo, onPhotoClick }) {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const videoRef = useRef(null);

  const isVideoItem = Boolean(item.videoUrl && item.type === "reel");

  const handleMouseEnter = () => {
    if (isVideoItem && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlayingPreview(true)).catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsPlayingPreview(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleCardClick = () => {
    if (isVideoItem) {
      onSelectVideo({
        id: item.id,
        title: item.title,
        subtitle: item.caption,
        category: item.tag || item.category,
        duration: "Reel",
        views: item.views,
        date: "2026",
        thumbnail: item.imageUrl,
        videoUrl: item.videoUrl,
        description: item.caption,
        featuredBadge: "Instagram Reel"
      });
    } else if (onPhotoClick) {
      onPhotoClick({
        id: item.id,
        title: item.title,
        url: item.imageUrl,
        category: item.tag || item.category,
        caption: item.caption
      });
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="rounded-3xl overflow-hidden bg-[#1E1B1B] border border-[#B99A63]/30 shadow-xl group hover:border-[#B99A63] transition-all duration-300 flex flex-col justify-between cursor-pointer tap-bounce select-none"
    >
      {/* Card Media (Approach B: Full uncropped letterbox with ambient backdrop) */}
      <div className="aspect-[4/5] bg-[#0d0d0d] relative overflow-hidden flex items-center justify-center">
        {/* Ambient blurred glow so background looks luxurious and natural */}
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
          aria-hidden="true"
        />

        {isVideoItem && (
          <video
            ref={videoRef}
            src={item.videoUrl || "/videos/performance.mp4"}
            poster={item.imageUrl}
            muted
            loop
            playsInline
            className={`w-full h-full object-contain bg-black/80 transition-all duration-500 absolute inset-0 z-10 ${
              isPlayingPreview ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
        )}

        {/* Main uncropped photo: 100% full view, zero face cropping */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className={`relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ${
            isPlayingPreview ? "opacity-0" : "opacity-100 group-hover:scale-105"
          }`}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/25 pointer-events-none z-10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#151515]/90 text-[#D4AF37] border border-[#B99A63]/40 backdrop-blur-md shadow-xs">
            {item.tag || item.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-1 shadow-xs">
            <InstagramIcon className="w-3 h-3" />
            <span>{isVideoItem ? "Reel" : "Post"}</span>
          </span>
        </div>

        {/* Views */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] font-semibold text-white/90 drop-shadow-md">
          <Eye className="w-3.5 h-3.5 text-[#B99A63]" />
          <span>{item.views}</span>
        </div>
      </div>

      {/* Card Info & Caption */}
      <div className="p-4 space-y-2.5 text-left bg-[#181616]">
        <h4 className="text-sm font-bold font-serif-luxury text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors truncate">
          {item.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {item.caption}
        </p>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3 h-3 fill-rose-400" />
              {item.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {item.comments}
            </span>
          </div>

          <a
            href={item.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              playGhungrooChime();
            }}
            className="text-[10px] font-bold text-[#D4AF37] hover:underline flex items-center gap-0.5"
          >
            <span>Watch</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Archive Video Card with silent autoplaying hover teaser loop
 */
function ArchiveVideoGridCard({ video, isCurrent, onSelectVideo }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    if (isHovered && video.videoUrl) {
      // 120ms gentle delay to prevent eager trigger when cursor quickly sweeps across
      timeoutId = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 120);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    return () => clearTimeout(timeoutId);
  }, [isHovered, video.videoUrl]);

  return (
    <div
      onClick={() => onSelectVideo(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group rounded-2xl overflow-hidden bg-[#181616] border transition-all duration-300 cursor-pointer tap-bounce flex flex-col justify-between shadow-lg ${
        isCurrent
          ? "border-[#B99A63] ring-2 ring-[#B99A63]/50 shadow-[#B99A63]/15"
          : "border-[#B99A63]/25 hover:border-[#B99A63]/70 hover:shadow-2xl"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectVideo(video);
        }
      }}
    >
      {/* 16:9 Thumbnail & Video Hover Teaser Container (Approach B: Full Uncropped Letterbox) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0f0e0d] flex items-center justify-center">
        {/* Ambient blurred backdrop for luxury framing */}
        <img
          src={video.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
          aria-hidden="true"
        />

        {/* Uncropped foreground photo: 100% visible, zero face cropping */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:scale-105 ${
            isHovered && video.videoUrl ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />

        {/* 3-Second Silent Autoplay Video Teaser Loop on Desktop Hover */}
        {video.videoUrl && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 z-10 w-full h-full object-contain bg-black/80 transition-opacity duration-300 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />

        <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/75 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase border border-white/10 backdrop-blur-xs">
          {video.category}
        </span>

        {isHovered && video.videoUrl ? (
          <span className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded bg-[#B99A63] text-[#151515] font-mono text-[10px] font-bold tracking-wider uppercase shadow flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#151515]" />
            Preview
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 z-20 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] font-bold tracking-wide border border-white/10">
            {video.duration}
          </span>
        )}

        {/* Play icon: subtley visible on mobile touch, highlighted on hover */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity bg-black/20 sm:bg-black/30 ${
            isHovered ? "opacity-0 pointer-events-none" : "opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#B99A63] text-[#151515] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-[#151515] translate-x-0.5" />
          </div>
        </div>

        {isCurrent && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#B99A63] text-[#151515] text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#151515] animate-ping" />
            <span>Active</span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-bold font-serif-luxury text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 font-normal mt-1 leading-relaxed">
            {video.description}
          </p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#B99A63]" />
            {video.views}
          </span>
          <span>{video.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function CinematicReelsShowcase({
  onExploreClick,
  onMeetArtistClick,
  onPhotoClick
}) {
  const [selectedVideo, setSelectedVideo] = useState(PERFORMANCE_ARCHIVE[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Videos");
  const [videoError, setVideoError] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Infinite marquee pause state
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  // Instagram wall filter
  const [wallFilter, setWallFilter] = useState("all");

  // Expand/collapse states: 2 rows for videos, 1 row for Instagram by default
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllInstagram, setShowAllInstagram] = useState(false);

  // Responsive device check for mobile vs desktop slice limits
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Touch swipe gesture support for mobile 3-panel stage
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const featuredPlayerRef = useRef(null);
  const videoElementRef = useRef(null);

  // Filter video collection
  const filteredVideos =
    activeCategory === "All Videos"
      ? PERFORMANCE_ARCHIVE
      : PERFORMANCE_ARCHIVE.filter((vid) => vid.category === activeCategory);

  // On mobile: 2 rows of 2 items = 4 videos. On PC: 2 rows of 4 items = 8 videos.
  const videoLimit = isMobile ? 4 : 8;
  const visibleVideos = showAllVideos ? filteredVideos : filteredVideos.slice(0, videoLimit);

  // Calculate previous and next video items for the 3D Stage Carousel
  const currentIdx = filteredVideos.findIndex((v) => v.id === selectedVideo.id);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const prevIdx = (safeIdx - 1 + filteredVideos.length) % filteredVideos.length;
  const nextIdx = (safeIdx + 1) % filteredVideos.length;
  const prevVideo = filteredVideos[prevIdx];
  const nextVideo = filteredVideos[nextIdx];

  // Auto-advance preview photo every 4.8 seconds when idle (not playing video and not hovered)
  useEffect(() => {
    if (isPlaying || isHovered || !filteredVideos || filteredVideos.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedVideo((prev) => {
        const idx = filteredVideos.findIndex((v) => v.id === prev.id);
        const nIdx = (idx + 1) % filteredVideos.length;
        return filteredVideos[nIdx];
      });
    }, 4800);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, filteredVideos]);

  // Switch active video in player
  const handleSelectVideo = (video) => {
    playGhungrooChime();
    setVideoError(false);
    setSelectedVideo(video);
    setIsPlaying(true);

    if (featuredPlayerRef.current) {
      featuredPlayerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    setTimeout(() => {
      if (videoElementRef.current) {
        videoElementRef.current.currentTime = 0;
        videoElementRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Auto-play blocked or failed:", err);
            setIsPlaying(false);
          });
      }
    }, 150);
  };

  const handleTouchStart = (e) => {
    if (e.targetTouches && e.targetTouches[0]) {
      setTouchStartX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.targetTouches && e.targetTouches[0]) {
      setTouchEndX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const swipeThreshold = 40;
      if (distance > swipeThreshold && nextVideo) {
        handleSelectVideo(nextVideo);
      } else if (distance < -swipeThreshold && prevVideo) {
        handleSelectVideo(prevVideo);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePlayButtonClick = () => {
    playGhungrooChime();
    setVideoError(false);
    setIsPlaying(true);
    if (videoElementRef.current) {
      videoElementRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Video playback error:", err);
          setVideoError(true);
        });
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsPlaying(false);
  };

  const handleVideoEnded = () => {
    if (!autoPlayNext) {
      setIsPlaying(false);
      return;
    }
    const cIdx = filteredVideos.findIndex((v) => v.id === selectedVideo.id);
    const nIdx = (cIdx + 1) % filteredVideos.length;
    handleSelectVideo(filteredVideos[nIdx]);
  };

  // Filter Instagram wall items
  const filteredWallItems = INSTAGRAM_WALL_ITEMS.filter((item) => {
    if (wallFilter === "workshops") return item.category === "workshops";
    if (wallFilter === "stage") return item.category === "stage";
    if (wallFilter === "music") return item.category === "music";
    if (wallFilter === "reels") return item.type === "reel";
    if (wallFilter === "photos") return item.type === "post";
    return true;
  });

  // On mobile: 2 rows of 2 items = 4 posts. On PC: 1st row = 3 posts.
  const instaLimit = isMobile ? 4 : 3;
  const visibleWallItems = showAllInstagram ? filteredWallItems : filteredWallItems.slice(0, instaLimit);

  return (
    <section
      id="gallery-section"
      className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#121111] text-[#F5F0E8] border-b border-[#A9A49D]/20 relative overflow-hidden select-none"
    >
      {/* Sophisticated Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3B0B14]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#B99A63]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* ═══════════════════════════════════════════════════════════════
            1. SECTION HEADING
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F0E8] font-serif-luxury">
            Performance &amp; <span className="italic text-[#D4AF37]">Gallery</span>
          </h2>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            2. FEATURED 3-VIDEO STAGE (All 3 Videos Exact Same Size on PC; Responsive 2-Col on Mobile)
        ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={featuredPlayerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none"
        >
          {/* ── 3-CARD STAGE: PC SHOWS 3-PANEL THEATRE (3 cols - 6 cols - 3 cols) | MOBILE SHOWS 1 BIG DISPLAY WITH SWIPE ── */}
          <div className="w-full md:grid md:grid-cols-12 md:gap-4 lg:gap-6 items-center">
            {/* ── 1. LEFT CARD (Previous Performance - Hidden on mobile, 3 cols on PC) ── */}
            {prevVideo && (
              <div
                onClick={() => handleSelectVideo(prevVideo)}
                className="hidden md:flex group relative rounded-2xl sm:rounded-3xl overflow-hidden museum-frame p-1 sm:p-2 bg-[#151515]/70 backdrop-blur-md border-2 border-[#B99A63]/40 hover:border-[#B99A63] opacity-85 hover:opacity-100 transition-all duration-300 cursor-pointer shadow-xl col-span-3 flex-col justify-between"
                title={`Previous: ${prevVideo.title}`}
              >
                <div className="museum-frame-inner relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0f0e0d] border border-[#B99A63]/30 flex items-center justify-center">
                  <img
                    src={prevVideo.thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                    aria-hidden="true"
                  />
                  <img
                    src={prevVideo.thumbnail}
                    alt={prevVideo.title}
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-1.5 py-0.5 sm:px-2 rounded-full bg-black/80 text-[#D4AF37] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border border-[#B99A63]/40 shadow-sm backdrop-blur-xs">
                      Previous
                    </span>
                    <span className="px-1 py-0.5 sm:px-1.5 rounded-md bg-black/75 text-slate-300 text-[8px] sm:text-[10px] font-mono border border-white/10">
                      {prevVideo.duration}
                    </span>
                  </div>

                  {/* Single Sleek Transparent Navigation Arrow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 group-hover:bg-black/75 text-white/90 group-hover:text-[#D4AF37] border border-white/25 group-hover:border-[#B99A63] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Bottom Title & Category */}
                  <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2 sm:left-2.5 sm:right-2.5 text-left pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-bold font-serif-luxury text-[#F5F0E8] truncate block drop-shadow-md">
                      {prevVideo.title}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-300 truncate block">
                      {prevVideo.category}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. CENTER CARD: MAIN BIG FEATURED PLAYER (Full Width on Mobile, 6 cols on PC) ── */}
            <div className="w-full col-span-12 md:col-span-6 group relative rounded-2xl sm:rounded-3xl overflow-hidden museum-frame p-1 sm:p-2.5 bg-[#151515]/75 backdrop-blur-md border-2 border-[#B99A63] shadow-2xl transition-all flex flex-col justify-between ring-2 sm:ring-4 ring-[#B99A63]/25">
              <div
                key={selectedVideo.id}
                className="museum-frame-inner relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#181616]/75 backdrop-blur-sm border border-[#B99A63]/50 shadow-inner transition-all duration-500 ease-out animate-in fade-in zoom-in-[0.98]"
              >
                {videoError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-[#181616]/95 z-20 space-y-2.5 sm:space-y-3">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-pulse" />
                    <h4 className="text-base sm:text-lg font-bold font-serif-luxury text-[#F5F0E8]">
                      Video Stream Unavailable
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                      The requested performance recording is currently being archived. Please choose another recital from the gallery below or visit our Instagram archive.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoError(false);
                        setIsPlaying(false);
                      }}
                      className="px-4 py-2 rounded-full bg-[#B99A63] text-[#151515] font-bold text-xs hover:bg-[#cca86d] transition-all cursor-pointer"
                    >
                      Return to Thumbnail
                    </button>
                  </div>
                ) : isPlaying ? (
                  /* Active Video Playback */
                  <div className="w-full h-full relative bg-black">
                    {selectedVideo.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        ref={videoElementRef}
                        src={selectedVideo.videoUrl}
                        poster={selectedVideo.thumbnail}
                        controls
                        autoPlay
                        playsInline
                        onError={handleVideoError}
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-contain bg-black"
                      />
                    )}
                  </div>
                ) : (
                  /* High-Quality Video Thumbnail with Centered Play Button (Translucent styling) */
                  <div
                    onClick={handlePlayButtonClick}
                    className="w-full h-full relative cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${selectedVideo.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePlayButtonClick();
                      }
                    }}
                  >
                    <img
                      src={selectedVideo.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                      aria-hidden="true"
                    />
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-all duration-700 opacity-95 group-hover:opacity-100 group-hover:scale-105"
                      loading="eager"
                    />

                    {/* Atmospheric Dark Translucent Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121111]/80 via-[#121111]/30 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors pointer-events-none z-10" />

                    {/* Top Badges & Autoplay Toggle */}
                    <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none z-10">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#151515]/85 text-[#D4AF37] border border-[#B99A63]/50 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase backdrop-blur-md shadow-md">
                        {selectedVideo.featuredBadge || selectedVideo.category}
                      </span>

                      <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAutoPlayNext((prev) => !prev);
                          }}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 rounded-full text-[8px] sm:text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer backdrop-blur-md border ${
                            autoPlayNext
                              ? "bg-[#B99A63] text-[#151515] border-[#B99A63] shadow-sm hover:bg-[#cca86d]"
                              : "bg-black/70 text-slate-400 border-white/10 hover:text-white"
                          }`}
                          title="Automatically play next video when current finishes"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${autoPlayNext ? "bg-[#151515] animate-ping" : "bg-slate-500"}`} />
                          <span>Autoplay {autoPlayNext ? "ON" : "OFF"}</span>
                        </button>

                        <span className="px-1.5 py-0.5 sm:px-2 rounded-md bg-black/80 text-[#F5F0E8] font-mono text-[9px] sm:text-[10px] font-semibold backdrop-blur-xs flex items-center gap-1 border border-white/10">
                          <Clock className="w-3 h-3 text-[#B99A63]" />
                          {selectedVideo.duration}
                        </span>
                      </div>
                    </div>

                    {/* Centered Luxury Play Button with Breathing Golden Halo */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                        <div className="relative">
                          {/* Golden Breathing Pulse Rings */}
                          <span className="absolute -inset-2 rounded-full bg-[#B99A63]/30 animate-ping opacity-60 pointer-events-none" />
                          <span className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-[#B99A63]/25 via-[#D4AF37]/35 to-[#B99A63]/25 blur-md animate-pulse pointer-events-none" />

                          <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-18 sm:h-18 rounded-full bg-[#B99A63] group-hover:bg-[#cca86d] text-[#151515] flex items-center justify-center shadow-[0_0_30px_rgba(185,154,99,0.5)] transition-all duration-300 group-hover:scale-110 border-2 border-white/50 ring-2 sm:ring-4 ring-[#B99A63]/40">
                            <Play className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 fill-[#151515] translate-x-0.5" />
                          </div>
                        </div>
                        <span className="px-2.5 xs:px-3 sm:px-3.5 py-0.5 rounded-full bg-[#151515]/90 text-[#F5F0E8] text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider border border-[#B99A63]/50 backdrop-blur-md shadow-lg">
                          Play Performance
                        </span>
                      </div>
                    </div>

                    {/* Mobile Only: Transparent Glass Side Arrow Buttons (Click to navigate without text) */}
                    <div className="md:hidden absolute inset-y-0 left-2 flex items-center z-25 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVideo(prevVideo);
                        }}
                        aria-label="Previous performance"
                        className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 active:bg-[#B99A63]/30 text-white/95 border border-white/25 active:border-[#B99A63] flex items-center justify-center backdrop-blur-md active:scale-90 transition-all shadow-xl cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                    <div className="md:hidden absolute inset-y-0 right-2 flex items-center z-25 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVideo(nextVideo);
                        }}
                        aria-label="Next performance"
                        className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 active:bg-[#B99A63]/30 text-white/95 border border-white/25 active:border-[#B99A63] flex items-center justify-center backdrop-blur-md active:scale-90 transition-all shadow-xl cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Bottom Overlay Title Bar */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 pointer-events-none text-left">
                      <h3 className="text-xs sm:text-xl font-bold font-serif-luxury text-[#F5F0E8] drop-shadow-md truncate">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-[9px] sm:text-xs text-slate-300 truncate font-normal">
                        {selectedVideo.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── 3. RIGHT CARD (Next Performance - Hidden on mobile, 3 cols on PC) ── */}
            {nextVideo && (
              <div
                onClick={() => handleSelectVideo(nextVideo)}
                className="hidden md:flex group relative rounded-2xl sm:rounded-3xl overflow-hidden museum-frame p-1 sm:p-2 bg-[#151515]/70 backdrop-blur-md border-2 border-[#B99A63]/40 hover:border-[#B99A63] opacity-85 hover:opacity-100 transition-all duration-300 cursor-pointer shadow-xl col-span-3 flex-col justify-between"
                title={`Next: ${nextVideo.title}`}
              >
                <div className="museum-frame-inner relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0f0e0d] border border-[#B99A63]/30 flex items-center justify-center">
                  <img
                    src={nextVideo.thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                    aria-hidden="true"
                  />
                  <img
                    src={nextVideo.thumbnail}
                    alt={nextVideo.title}
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-1 py-0.5 sm:px-1.5 rounded-md bg-black/75 text-slate-300 text-[8px] sm:text-[10px] font-mono border border-white/10">
                      {nextVideo.duration}
                    </span>
                    <span className="px-1.5 py-0.5 sm:px-2 rounded-full bg-black/80 text-[#D4AF37] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border border-[#B99A63]/40 shadow-sm backdrop-blur-xs">
                      Next Up
                    </span>
                  </div>

                  {/* Single Sleek Transparent Navigation Arrow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 group-hover:bg-black/75 text-white/90 group-hover:text-[#D4AF37] border border-white/25 group-hover:border-[#B99A63] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Bottom Title & Category */}
                  <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2 sm:left-2.5 sm:right-2.5 text-left pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-bold font-serif-luxury text-[#F5F0E8] truncate block drop-shadow-md">
                      {nextVideo.title}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-300 truncate block">
                      {nextVideo.category}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── FEATURED VIDEO METADATA & ACTIONS BAR (YouTube Style, Below Video Row) ── */}
          <div className="w-full p-4 sm:p-6 rounded-2xl bg-[#181616] border border-[#B99A63]/25 flex flex-col md:flex-row md:items-start justify-between gap-4 text-left shadow-lg">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B99A63]/20 text-[#D4AF37] border border-[#B99A63]/40 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                  {selectedVideo.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#B99A63]" />
                  {selectedVideo.views} views
                </span>
                <span className="text-xs text-slate-400">• {selectedVideo.date}</span>
              </div>

              <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold font-serif-luxury text-[#F5F0E8] leading-tight">
                {selectedVideo.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
                {selectedVideo.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-1 md:pt-0 w-full md:w-auto">
              <a
                href="https://www.instagram.com/dancingragasbymalavika/reels/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playGhungrooChime()}
                className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-700/80 via-pink-700/80 to-amber-600/80 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer tap-bounce shadow-md"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram Archive</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              {onMeetArtistClick && (
                <button
                  type="button"
                  onClick={() => {
                    playGhungrooChime();
                    onMeetArtistClick();
                  }}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-full bg-[#1F1C1C] hover:bg-[#2A2626] border border-[#B99A63]/40 text-[#D4AF37] text-xs font-bold transition-all cursor-pointer tap-bounce shadow-md"
                >
                  Meet Dr. Malavika
                </button>
              )}

              {onExploreClick && (
                <button
                  type="button"
                  onClick={() => {
                    playGhungrooChime();
                    onExploreClick();
                  }}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-full bg-[#B99A63] hover:bg-[#cca86d] text-[#151515] text-xs font-bold transition-all cursor-pointer tap-bounce shadow-md"
                >
                  Book Trial
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            3. CONTINUOUS CLASSICAL STREAM (The Infinite Auto-Scrolling Marquee)
            - Placed immediately after the 3-Video Stage per user requirement -
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-6 sm:pt-8 border-t border-[#A9A49D]/20 space-y-6 text-left">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B99A63] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#B99A63]">
                  Continuous Classical Stream
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F5F0E8] mt-1">
                Infinite Photo Gallery &amp; Recital Stream
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Hover any video to preview live or click to load directly into the theater player above.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsMarqueePaused((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1E1B1B] hover:bg-[#252222] border border-[#B99A63]/40 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 cursor-pointer tap-bounce transition-all shadow-sm"
              >
                {isMarqueePaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>Resume Stream</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Stream</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Seamless Infinite Auto-Scrolling Track */}
          <div className="overflow-hidden relative py-2 -mx-4 sm:mx-0 px-4 sm:px-0">
            {/* Gradient Edge Masks for High-End Fade (Narrower on mobile to avoid hiding cards) */}
            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-r from-[#121111] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-l from-[#121111] to-transparent z-20 pointer-events-none" />

            <div
              className={`flex gap-4 sm:gap-6 ${isMarqueePaused ? "pause-marquee" : "animate-infinite-marquee"}`}
            >
              {INFINITE_STREAM_ITEMS.concat(INFINITE_STREAM_ITEMS).map((item, idx) => (
                <InfiniteStreamCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  onSelectVideo={handleSelectVideo}
                  onPhotoClick={onPhotoClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            3. VIDEO CATEGORY FILTERS (Horizontally scrollable on mobile)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B99A63] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Browse by Category
            </span>
            <span className="text-[11px] text-slate-400">
              Showing {filteredVideos.length} performance {filteredVideos.length === 1 ? "video" : "videos"}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playGhungrooChime();
                  setActiveCategory(cat);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer tap-bounce shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#B99A63] text-[#151515] shadow-md shadow-[#B99A63]/30 scale-[1.02]"
                    : "bg-[#1E1B1B] hover:bg-[#282424] text-slate-300 hover:text-white border border-white/10 hover:border-[#B99A63]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            4. RESPONSIVE VIDEO THUMBNAIL GRID (Default 2 Rows: 2 per row on Mobile, 4 per row on PC; Click here for more)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 text-left">
            {visibleVideos.map((video) => (
              <ArchiveVideoGridCard
                key={video.id}
                video={video}
                isCurrent={selectedVideo.id === video.id}
                onSelectVideo={handleSelectVideo}
              />
            ))}
          </div>

          {/* "Click here for more" / "Show Less" Button for Video Grid */}
          {!showAllVideos && filteredVideos.length > videoLimit && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  playGhungrooChime();
                  setShowAllVideos(true);
                }}
                className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#181616] hover:bg-[#25201b] text-[#D4AF37] hover:text-white border border-[#B99A63]/50 hover:border-[#B99A63] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
              >
                <span>Click here for more</span>
                <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          )}

          {showAllVideos && filteredVideos.length > videoLimit && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  playGhungrooChime();
                  setShowAllVideos(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#181616] hover:bg-[#25201b] text-slate-300 hover:text-white border border-white/10 hover:border-[#B99A63]/50 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            5. ACHIEVEMENT HIGHLIGHTS (Compact Understated Gold Strip)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-6 border-t border-[#A9A49D]/20">
          <div className="p-5 sm:p-7 rounded-2xl bg-[#181616] border border-[#B99A63]/30 shadow-xl space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B99A63]" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                  Artistic &amp; Academic Distinction
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Verified performance and institutional credentials of Dr. Malavika M. Sunil
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {CREDENTIAL_HIGHLIGHTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#1F1C1C] border border-white/5 flex flex-col justify-between space-y-1 hover:border-[#B99A63]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-4 h-4 text-[#B99A63]" />
                    </div>
                    <div className="text-base sm:text-lg font-bold font-serif-luxury text-[#F5F0E8] leading-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300 leading-snug">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>



        {/* ═══════════════════════════════════════════════════════════════
            7. INSTAGRAM ARCHIVE & REELS (@dancingragasbymalavika)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-12 border-t border-[#A9A49D]/20 space-y-8 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Official Instagram Broadcast
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury text-[#F5F0E8] mt-1">
                Instagram
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Curated reels, stage moments, and raga sadhana from{" "}
                <a
                  href="https://www.instagram.com/dancingragasbymalavika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  @dancingragasbymalavika
                </a>
              </p>
            </div>

            <a
              href="https://www.instagram.com/dancingragasbymalavika/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playGhungrooChime()}
              className="px-4 py-2 rounded-full bg-[#1E1B1B] hover:bg-[#252222] border border-[#B99A63]/40 text-[#D4AF37] hover:text-[#f5d77f] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer tap-bounce shrink-0 w-fit"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Visit Profile</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>

          {/* Curated Archival Cards Section */}
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => setWallFilter("all")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "all"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                All ({INSTAGRAM_WALL_ITEMS.length})
              </button>

              <button
                type="button"
                onClick={() => setWallFilter("reels")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "reels"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Reels</span>
              </button>

              <button
                type="button"
                onClick={() => setWallFilter("stage")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "stage"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                Stage Shows
              </button>

              <button
                type="button"
                onClick={() => setWallFilter("workshops")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "workshops"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                Workshops
              </button>

              <button
                type="button"
                onClick={() => setWallFilter("music")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "music"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                Music
              </button>

              <button
                type="button"
                onClick={() => setWallFilter("photos")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer tap-bounce whitespace-nowrap ${
                  wallFilter === "photos"
                    ? "bg-[#B99A63] text-[#151515] shadow-sm"
                    : "bg-[#1E1B1B] text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos</span>
              </button>
            </div>

            {/* Instagram Reel & Photo Cards Grid (Default: 2 rows of 2 on Mobile, 1st row of 3 on PC; Click here for more) */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-7">
                {visibleWallItems.map((item) => (
                  <InstagramWallCard
                    key={item.id}
                    item={item}
                    onSelectVideo={handleSelectVideo}
                    onPhotoClick={onPhotoClick}
                  />
                ))}
              </div>

              {/* "Click here for more" / "Show Less" Button for Instagram Grid */}
              {!showAllInstagram && filteredWallItems.length > instaLimit && (
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      playGhungrooChime();
                      setShowAllInstagram(true);
                    }}
                    className="silk-zari-btn px-6 py-2.5 rounded-full bg-[#181616] hover:bg-[#25201b] text-[#D4AF37] hover:text-white border border-[#B99A63]/50 hover:border-[#B99A63] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
                  >
                    <span>Click here for more</span>
                    <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              )}

              {showAllInstagram && filteredWallItems.length > instaLimit && (
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      playGhungrooChime();
                      setShowAllInstagram(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#181616] hover:bg-[#25201b] text-slate-300 hover:text-white border border-white/10 hover:border-[#B99A63]/50 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer tap-bounce"
                  >
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Follow Callout Strip */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#181616] via-[#24050B]/50 to-[#181616] border border-[#B99A63]/30">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
                ig
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold font-serif-luxury text-[#F5F0E8]">
                  Join 10,000+ Classical Dance Enthusiasts
                </h4>
                <p className="text-xs text-slate-400">
                  Follow @dancingragasbymalavika for daily practice tips, raga sadhana &amp; stage clips
                </p>
              </div>
            </div>

            <a
              href="https://www.instagram.com/dancingragasbymalavika/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playGhungrooChime()}
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer tap-bounce shrink-0"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

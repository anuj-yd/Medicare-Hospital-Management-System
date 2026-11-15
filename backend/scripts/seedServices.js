// backend/scripts/seedServices.js
import "dotenv/config";
import mongoose from "mongoose";
import Service from "../models/Service.js";

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not configured in backend/.env");
  process.exit(1);
}

// Generate upcoming 14 days and corresponding time slots
function generateUpcomingServiceSchedule() {
  const dates = [];
  const slots = {};
  const slotPresets = [
    ["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM"],
    ["09:30 AM", "11:00 AM", "12:30 PM", "02:30 PM", "04:00 PM"],
    ["10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "05:00 PM"],
    ["08:30 AM", "10:00 AM", "12:00 PM", "03:00 PM", "04:30 PM"],
  ];

  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
    dates.push(dateKey);
    slots[dateKey] = slotPresets[i % slotPresets.length];
  }
  return { dates, slots };
}

const SERVICES_DATA = [
  {
    name: "General Health Consultation",
    shortDescription: "Comprehensive diagnostic checkup and physician consultation for general medical evaluation.",
    about: "A complete physical evaluation by our senior general physicians. Includes vital signs measurement, symptom analysis, medical history review, and personalized diagnostic recommendations.",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Carry any past medical reports and list of current medications",
      "Please arrive 10 minutes prior to your scheduled consultation",
      "Note down any specific symptoms or questions you wish to discuss with the doctor"
    ],
    available: true,
    totalAppointments: 120,
    completed: 108,
    canceled: 5,
  },
  {
    name: "Dental Cleaning & Polishing",
    shortDescription: "Professional ultrasonic scaling, plaque removal, and fluoride polish for optimal oral hygiene.",
    about: "Thorough oral hygiene procedure performed by our certified dental surgeons. Removes tartar, stains, and calculus deposits to prevent gum disease and preserve enamel brightness.",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Brush and floss gently prior to arrival",
      "Avoid eating hot, spicy, or staining foods for 1 hour after the session",
      "Inform the dentist of any pre-existing tooth sensitivity"
    ],
    available: true,
    totalAppointments: 85,
    completed: 78,
    canceled: 3,
  },
  {
    name: "Full Blood Count (CBC) Test",
    shortDescription: "Complete automated blood cell profiling (RBC, WBC, Hemoglobin, Platelets, Hematocrit).",
    about: "Accurate laboratory automated hemogram testing for early detection of infections, anemia, immunological disorders, and blood clotting parameters.",
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Fast for 6 to 8 hours prior to blood collection if recommended",
      "Drink plenty of water to ensure easy venipuncture",
      "Digital laboratory reports will be dispatched within 4 hours"
    ],
    available: true,
    totalAppointments: 145,
    completed: 138,
    canceled: 2,
  },
  {
    name: "Blood Sugar & Diabetes Panel",
    shortDescription: "Fasting glucose, postprandial blood sugar, and HbA1c 3-month average screening.",
    about: "Specialized endocrine screening measuring daily glycation and quarterly glycemic control to identify prediabetes, monitor ongoing therapy, and prevent diabetic complications.",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Strict fasting of 8-10 hours is mandatory for the fasting sample",
      "Do not take insulin or oral antidiabetic drugs until blood sample is drawn",
      "Follow standard dietary intake before the postprandial draw"
    ],
    available: true,
    totalAppointments: 92,
    completed: 88,
    canceled: 2,
  },
  {
    name: "Digital X-Ray & Imaging Scan",
    shortDescription: "High-resolution digital radiography for chest, spine, joints, and skeletal diagnosis.",
    about: "Low-radiation digital radiography delivering high-definition anatomical images within minutes. Reviewed and reported by board-certified consultant radiologists.",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Wear loose, comfortable clothing without metallic buttons or zippers",
      "Remove all jewelry, piercings, watches, and hairpins prior to the scan",
      "Inform the technician immediately if you are pregnant or suspect pregnancy"
    ],
    available: true,
    totalAppointments: 64,
    completed: 59,
    canceled: 3,
  },
  {
    name: "Physical Therapy & Rehabilitation",
    shortDescription: "Targeted musculoskeletal therapy, posture realignment, and chronic pain management.",
    about: "One-on-one session with licensed physical therapists focusing on joint mobility, neuromuscular re-education, post-operative rehabilitation, and targeted sports injury relief.",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Wear comfortable gym or athletic attire allowing free joint movement",
      "Bring any relevant MRI or X-ray reports with you",
      "Refrain from heavy meals within 1 hour of your therapy session"
    ],
    available: true,
    totalAppointments: 70,
    completed: 65,
    canceled: 2,
  },
  {
    name: "Comprehensive Eye & Vision Exam",
    shortDescription: "Visual acuity testing, digital retina screening, refraction, and intraocular pressure check.",
    about: "Complete optical examination including slit-lamp microscopy, computerized refraction, glaucoma risk assessment, and detailed fundus evaluation for clear sight and ocular health.",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Bring your current eyeglasses and contact lens prescriptions",
      "If pupil dilation is required, bring sunglasses for post-exam light sensitivity",
      "Avoid wearing contact lenses on the day of the examination"
    ],
    available: true,
    totalAppointments: 53,
    completed: 49,
    canceled: 1,
  },
  {
    name: "Full Body Executive Health Checkup",
    shortDescription: "65+ parameters including Complete Blood, Lipid, Liver, Kidney, ECG, and Thyroid profiles.",
    about: "Our comprehensive preventive master package designed for detailed assessment of all major organ systems. Includes complete metabolic panel, 12-lead ECG, ultrasound screening, and a concluding review with our physician.",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Fasting of 10 to 12 hours is strictly required before arrival",
      "Morning appointments recommended (between 08:00 AM - 10:00 AM)",
      "Avoid consuming alcohol or high-fat meals 24 hours prior",
      "Consultation and detailed report discussion included in this package"
    ],
    available: true,
    totalAppointments: 38,
    completed: 35,
    canceled: 1,
  },
];

async function seedServices() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected successfully to MongoDB.\n");

  let inserted = 0;
  let updated = 0;

  for (const s of SERVICES_DATA) {
    const existing = await Service.findOne({ name: s.name });
    const { dates, slots } = generateUpcomingServiceSchedule();

    if (existing) {
      existing.shortDescription = s.shortDescription;
      existing.about = s.about;
      existing.price = s.price;
      existing.imageUrl = s.imageUrl;
      existing.instructions = s.instructions;
      existing.available = s.available;
      existing.totalAppointments = s.totalAppointments;
      existing.completed = s.completed;
      existing.canceled = s.canceled;
      existing.dates = dates;
      existing.slots = slots;

      await existing.save();
      updated += 1;
      console.log(`  🔄 Updated service: ${s.name} (₹${s.price})`);
    } else {
      const newService = new Service({
        ...s,
        dates,
        slots,
      });

      await newService.save();
      inserted += 1;
      console.log(`  ✨ Created service: ${s.name} (₹${s.price})`);
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 Services Seeding Complete!`);
  console.log(`   ✨ Created: ${inserted}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   📅 Generated 14 upcoming days with booking slots for each service`);
  console.log("==========================================\n");

  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB.");
}

seedServices().catch((err) => {
  console.error("❌ Seeding services failed:", err);
  process.exit(1);
});

// backend/scripts/seedDoctors.js
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not configured in backend/.env");
  process.exit(1);
}

// Generate schedule dynamically for the next 14 days starting today
function generateUpcomingSchedule() {
  const schedule = {};
  const slotPresets = [
    ["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM"],
    ["10:00 AM", "11:00 AM", "12:30 PM", "03:00 PM", "04:30 PM"],
    ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "05:00 PM"],
    ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "05:30 PM"],
  ];

  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
    schedule[dateKey] = slotPresets[i % slotPresets.length];
  }
  return schedule;
}

const DOCTORS_DATA = [
  {
    name: "Dr. Aditi Verma",
    email: "aditi.verma@medicare.com",
    specialization: "Dentist",
    imageUrl: "https://images.unsplash.com/photo-1594824813511-570a2491e0a2?w=800&q=80&auto=format&fit=crop",
    experience: "6",
    qualifications: "BDS, MDS (Orthodontics)",
    location: "City Dental Care, Floor 2",
    about: "Specialized in advanced dental procedures, root canals, cosmetic smile designing, and painless orthodontics.",
    fee: 500,
    availability: "Available",
    patients: "1.6k+",
    success: "96%",
    rating: 4.7,
  },
  {
    name: "Dr. Helena Grace",
    email: "helena.grace@medicare.com",
    specialization: "Radiologist",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop",
    experience: "9",
    qualifications: "MBBS, MD (Radiodiagnosis)",
    location: "Metro Diagnostic Wing, Floor 1",
    about: "Expert in neuro-imaging, MRI diagnostics, high-resolution ultrasound, and interventional radiology guidance.",
    fee: 1000,
    availability: "Available",
    patients: "2.3k+",
    success: "95%",
    rating: 4.8,
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@medicare.com",
    specialization: "Orthopedic Surgeon",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80&auto=format&fit=crop",
    experience: "4",
    qualifications: "MBBS, MS (Orthopedics)",
    location: "Joint & Spine Center, Wing C",
    about: "Specialist in arthroscopic joint surgery, sports injury rehabilitation, and trauma reconstruction.",
    fee: 1200,
    availability: "Available",
    patients: "1.5k+",
    success: "92%",
    rating: 4.6,
  },
  {
    name: "Dr. Kabir Malhotra",
    email: "kabir.malhotra@medicare.com",
    specialization: "Nephrologist",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80&auto=format&fit=crop",
    experience: "2",
    qualifications: "MBBS, DM (Nephrology)",
    location: "Renal Care Pavilion, Block B",
    about: "Dedicated nephrologist focusing on clinical dialysis, chronic kidney disease prevention, and post-transplant follow-up.",
    fee: 1600,
    availability: "Available",
    patients: "2.9k+",
    success: "91%",
    rating: 4.6,
  },
  {
    name: "Dr. Lisa Wang",
    email: "lisa.wang@medicare.com",
    specialization: "Gynecologist",
    imageUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=800&q=80&auto=format&fit=crop",
    experience: "11",
    qualifications: "MBBS, DGO, FRCOG",
    location: "Women's Health Center, Floor 3",
    about: "Experienced in high-risk pregnancy care, infertility treatment, reproductive health, and laparoscopic gynecology.",
    fee: 750,
    availability: "Available",
    patients: "2.4k+",
    success: "96%",
    rating: 4.9,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@medicare.com",
    specialization: "Neurologist",
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&auto=format&fit=crop",
    experience: "7",
    qualifications: "MBBS, DM (Neurology)",
    location: "Neuroscience Institute, Floor 4",
    about: "Specialized in stroke rehabilitation, epilepsy management, migraine therapeutics, and neuromuscular disease.",
    fee: 900,
    availability: "Available",
    patients: "1.8k+",
    success: "89%",
    rating: 4.5,
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@medicare.com",
    specialization: "Dermatologist",
    imageUrl: "https://images.unsplash.com/photo-1594824813511-570a2491e0a2?w=800&q=80&auto=format&fit=crop",
    experience: "8",
    qualifications: "MBBS, MD (Dermatology)",
    location: "SkinCare Hub, Green Plaza",
    about: "Clinical and aesthetic dermatologist offering personalized acne regimens, laser treatments, and hair pathology care.",
    fee: 600,
    availability: "Available",
    patients: "2.7k+",
    success: "94%",
    rating: 4.7,
  },
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medicare.com",
    specialization: "Cardiologist",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop",
    experience: "12",
    qualifications: "MBBS, MD (Cardiology)",
    location: "CardioVascular Wing, Block A",
    about: "Senior interventional cardiologist with extensive expertise in coronary angiography, stents, and preventive cardiac wellness.",
    fee: 700,
    availability: "Available",
    patients: "2k+",
    success: "98%",
    rating: 4.9,
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@medicare.com",
    specialization: "Pediatrician",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop",
    experience: "8",
    qualifications: "MBBS, DCH, MD (Pediatrics)",
    location: "Children's Care Center, Floor 1",
    about: "Passionate child health specialist focused on developmental milestones, childhood immunizations, and pediatric wellness.",
    fee: 500,
    availability: "Available",
    patients: "3.2k+",
    success: "97%",
    rating: 4.8,
  },
  {
    name: "Dr. David Kim",
    email: "david.kim@medicare.com",
    specialization: "Oncologist",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80&auto=format&fit=crop",
    experience: "16",
    qualifications: "MBBS, DM (Medical Oncology)",
    location: "Cancer Research Center, Floor 5",
    about: "Expert in precision targeted therapy, immunotherapy, and comprehensive multimodality oncology treatments.",
    fee: 1500,
    availability: "Available",
    patients: "2.9k+",
    success: "93%",
    rating: 4.6,
  },
  {
    name: "Dr. Rohan Mehta",
    email: "rohan.mehta@medicare.com",
    specialization: "ENT Specialist",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
    experience: "9",
    qualifications: "MBBS, MS (ENT)",
    location: "Ear, Nose & Throat Center, Floor 2",
    about: "Treating chronic sinusitis, hearing disorders, voice pathology, and functional endoscopic sinus surgery.",
    fee: 550,
    availability: "Available",
    patients: "1.9k+",
    success: "95%",
    rating: 4.7,
  },
  {
    name: "Dr. Kavita Rao",
    email: "kavita.rao@medicare.com",
    specialization: "General Physician",
    imageUrl: "https://images.unsplash.com/photo-1594824813511-570a2491e0a2?w=800&q=80&auto=format&fit=crop",
    experience: "7",
    qualifications: "MBBS, MD (General Medicine)",
    location: "Outpatient Clinic, Floor 1",
    about: "Primary healthcare physician managing chronic lifestyle conditions like hypertension, diabetes, and acute infections.",
    fee: 400,
    availability: "Available",
    patients: "2.3k+",
    success: "97%",
    rating: 4.8,
  },
];

async function seedDoctors() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected successfully to MongoDB.\n");

  const defaultPassword = "doctor123";
  const defaultPasswordHash = await bcrypt.hash(defaultPassword, 12);

  let inserted = 0;
  let updated = 0;

  for (const docData of DOCTORS_DATA) {
    const emailLC = docData.email.toLowerCase();
    const existing = await Doctor.findOne({ email: emailLC });
    const schedule = generateUpcomingSchedule();

    if (existing) {
      existing.name = docData.name;
      existing.specialization = docData.specialization;
      existing.imageUrl = docData.imageUrl;
      existing.experience = docData.experience;
      existing.qualifications = docData.qualifications;
      existing.location = docData.location;
      existing.about = docData.about;
      existing.fee = docData.fee;
      existing.availability = docData.availability;
      existing.patients = docData.patients;
      existing.success = docData.success;
      existing.rating = docData.rating;
      existing.schedule = schedule;

      await existing.save();
      updated += 1;
      console.log(`  🔄 Updated doctor: ${docData.name} (${docData.specialization})`);
    } else {
      const newDoc = new Doctor({
        ...docData,
        email: emailLC,
        password: defaultPasswordHash,
        schedule,
      });

      await newDoc.save();
      inserted += 1;
      console.log(`  ✨ Created doctor: ${docData.name} (${docData.specialization})`);
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 Seeding Complete!`);
  console.log(`   ✨ Created: ${inserted}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   🔑 Default Doctor Login Password: "${defaultPassword}"`);
  console.log(`   📅 Generated 14 upcoming days of booking slots for each doctor`);
  console.log("==========================================\n");

  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB.");
}

seedDoctors().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

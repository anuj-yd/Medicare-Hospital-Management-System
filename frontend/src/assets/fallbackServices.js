// frontend/src/assets/fallbackServices.js
export const fallbackServices = [
  {
    id: "serv-gen-health",
    _id: "serv-gen-health",
    name: "General Health Consultation",
    shortDescription: "Comprehensive diagnostic checkup and physician consultation for general medical evaluation.",
    about: "A complete physical evaluation by our senior general physicians. Includes vital signs measurement, symptom analysis, medical history review, and personalized diagnostic recommendations.",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Carry any past medical reports and list of current medications",
      "Please arrive 10 minutes prior to your scheduled consultation",
      "Note down any specific symptoms or questions you wish to discuss with the doctor"
    ],
    available: true,
  },
  {
    id: "serv-dental-clean",
    _id: "serv-dental-clean",
    name: "Dental Cleaning & Polishing",
    shortDescription: "Professional ultrasonic scaling, plaque removal, and fluoride polish for optimal oral hygiene.",
    about: "Thorough oral hygiene procedure performed by our certified dental surgeons. Removes tartar, stains, and calculus deposits to prevent gum disease and preserve enamel brightness.",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Brush and floss gently prior to arrival",
      "Avoid eating hot, spicy, or staining foods for 1 hour after the session",
      "Inform the dentist of any pre-existing tooth sensitivity"
    ],
    available: true,
  },
  {
    id: "serv-cbc-test",
    _id: "serv-cbc-test",
    name: "Full Blood Count (CBC) Test",
    shortDescription: "Complete automated blood cell profiling (RBC, WBC, Hemoglobin, Platelets, Hematocrit).",
    about: "Accurate laboratory automated hemogram testing for early detection of infections, anemia, immunological disorders, and blood clotting parameters.",
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Fast for 6 to 8 hours prior to blood collection if recommended",
      "Drink plenty of water to ensure easy venipuncture",
      "Digital laboratory reports will be dispatched within 4 hours"
    ],
    available: true,
  },
  {
    id: "serv-sugar-diabetes",
    _id: "serv-sugar-diabetes",
    name: "Blood Sugar & Diabetes Panel",
    shortDescription: "Fasting glucose, postprandial blood sugar, and HbA1c 3-month average screening.",
    about: "Specialized endocrine screening measuring daily glycation and quarterly glycemic control to identify prediabetes, monitor ongoing therapy, and prevent diabetic complications.",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Strict fasting of 8-10 hours is mandatory for the fasting sample",
      "Do not take insulin or oral antidiabetic drugs until blood sample is drawn",
      "Follow standard dietary intake before the postprandial draw"
    ],
    available: true,
  },
  {
    id: "serv-digital-xray",
    _id: "serv-digital-xray",
    name: "Digital X-Ray & Imaging Scan",
    shortDescription: "High-resolution digital radiography for chest, spine, joints, and skeletal diagnosis.",
    about: "Low-radiation digital radiography delivering high-definition anatomical images within minutes. Reviewed and reported by board-certified consultant radiologists.",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Wear loose, comfortable clothing without metallic buttons or zippers",
      "Remove all jewelry, piercings, watches, and hairpins prior to the scan",
      "Inform the technician immediately if you are pregnant or suspect pregnancy"
    ],
    available: true,
  },
  {
    id: "serv-physical-therapy",
    _id: "serv-physical-therapy",
    name: "Physical Therapy & Rehabilitation",
    shortDescription: "Targeted musculoskeletal therapy, posture realignment, and chronic pain management.",
    about: "One-on-one session with licensed physical therapists focusing on joint mobility, neuromuscular re-education, post-operative rehabilitation, and targeted sports injury relief.",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Wear comfortable gym or athletic attire allowing free joint movement",
      "Bring any relevant MRI or X-ray reports with you",
      "Refrain from heavy meals within 1 hour of your therapy session"
    ],
    available: true,
  },
  {
    id: "serv-eye-exam",
    _id: "serv-eye-exam",
    name: "Comprehensive Eye & Vision Exam",
    shortDescription: "Visual acuity testing, digital retina screening, refraction, and intraocular pressure check.",
    about: "Complete optical examination including slit-lamp microscopy, computerized refraction, glaucoma risk assessment, and detailed fundus evaluation for clear sight and ocular health.",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Bring your current eyeglasses and contact lens prescriptions",
      "If pupil dilation is required, bring sunglasses for post-exam light sensitivity",
      "Avoid wearing contact lenses on the day of the examination"
    ],
    available: true,
  },
  {
    id: "serv-executive-checkup",
    _id: "serv-executive-checkup",
    name: "Full Body Executive Health Checkup",
    shortDescription: "65+ parameters including Complete Blood, Lipid, Liver, Kidney, ECG, and Thyroid profiles.",
    about: "Our comprehensive preventive master package designed for detailed assessment of all major organ systems. Includes complete metabolic panel, 12-lead ECG, ultrasound screening, and a concluding review with our physician.",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop",
    instructions: [
      "Fasting of 10 to 12 hours is strictly required before arrival",
      "Morning appointments recommended (between 08:00 AM - 10:00 AM)",
      "Avoid consuming alcohol or high-fat meals 24 hours prior",
      "Consultation and detailed report discussion included in this package"
    ],
    available: true,
  },
];

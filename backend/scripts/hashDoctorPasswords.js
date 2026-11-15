import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";

const isPasswordHash = (password) =>
  /^\$2[ab]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(password);
const applyChanges = process.argv.includes("--apply");
const backupConfirmed = process.argv.includes("--confirm-backup");

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be configured");
}
if (applyChanges && !backupConfirmed) {
  throw new Error("Back up the database and pass --confirm-backup before applying changes");
}

await mongoose.connect(process.env.MONGO_URI);

let pendingCount = 0;
let migratedCount = 0;
let skippedCount = 0;

try {
  const doctors = Doctor.find({}).select("+password").sort({ _id: 1 }).cursor();

  for await (const doctor of doctors) {
    if (typeof doctor.password !== "string" || !doctor.password) {
      skippedCount += 1;
      continue;
    }

    if (isPasswordHash(doctor.password)) continue;

    pendingCount += 1;
    if (!applyChanges) continue;

    const previousPassword = doctor.password;
    const passwordHash = await bcrypt.hash(previousPassword, 12);
    const result = await Doctor.updateOne(
      { _id: doctor._id, password: previousPassword },
      { $set: { password: passwordHash } },
    );

    if (result.modifiedCount === 1) {
      migratedCount += 1;
    } else {
      skippedCount += 1;
    }
  }

  if (applyChanges) {
    console.info(`Hashed ${migratedCount} doctor password(s); skipped ${skippedCount}.`);
  } else {
    console.info(`Dry run: ${pendingCount} plaintext password(s) would be hashed; skipped ${skippedCount}.`);
    console.info("Back up the database, then rerun with --apply --confirm-backup to migrate passwords.");
  }
} finally {
  await mongoose.disconnect();
}

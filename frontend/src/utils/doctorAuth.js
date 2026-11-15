export function getDoctorAuthHeaders() {
  const token = localStorage.getItem("doctorToken_v1");
  if (!token) {
    throw new Error("Please sign in as a doctor");
  }

  return { Authorization: `Bearer ${token}` };
}

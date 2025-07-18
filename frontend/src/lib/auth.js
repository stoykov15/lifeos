import api from "./api";

// Register user
export const registerUser = async (email, password, confirmPassword, firstName, lastName) => {
  return await api.post("/auth/register", {
    email,
    password,
    confirm_password: confirmPassword,
    first_name: firstName,
    last_name: lastName,
  });
};


// Login user
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  localStorage.setItem("token", res.data.access_token);
  return res.data;
}

// Get current user profile
export async function fetchProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

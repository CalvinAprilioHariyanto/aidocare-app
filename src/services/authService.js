import { mockUsers } from '../data/users';

// In-memory array acting as our mock database for the session
let currentUsers = [...mockUsers];
let nextPatientId = 2; // Since PAT-001 already exists

/**
 * MOCK AUTHENTICATION SERVICE
 * WARNING: This is for local development and demonstration only.
 * DO NOT use this in production. Real applications require secure backend
 * authentication, hashed passwords, and token-based sessions.
 */

export function login(email, password) {
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required."
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  const user = currentUsers.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Invalid email or password."
    };
  }

  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword
  };
}

export function register(userData) {
  const { firstName, lastName, email, phone, password } = userData;

  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      message: "Please fill in all required fields."
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const emailExists = currentUsers.some(u => u.email.toLowerCase() === normalizedEmail);
  
  if (emailExists) {
    return {
      success: false,
      message: "An account with this email already exists."
    };
  }

  // Generate new ID and create patient account
  const newId = `PAT-${String(nextPatientId).padStart(3, '0')}`;
  nextPatientId++;

  const newUser = {
    id: newId,
    role: "patient", // Public registrations are always patients
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : "",
    password: password, // WARNING: Plain text for mock demo only
    
    // Initialize empty profile fields
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    allergies: [],
    medicalConditions: []
  };

  currentUsers.push(newUser);

  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword
  };
}

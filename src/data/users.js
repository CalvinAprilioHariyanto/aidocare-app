// This file contains mock/demo data for development purposes.
// DO NOT use this approach (plain text passwords, local arrays) in production.

export const mockUsers = [
  {
    id: "PAT-001",
    role: "patient",
    firstName: "Calvin",
    lastName: "Patient",
    email: "patient@aidocare.com",
    phone: "+62 812 3456 7890",
    password: "patient123", // WARNING: Plain text for mock demo only
    
    dateOfBirth: "2005-04-12",
    gender: "Male",
    bloodType: "O+",
    
    allergies: [],
    medicalConditions: []
  },
  {
    id: "DOC-001",
    role: "doctor",
    firstName: "Sarah",
    lastName: "Anderson",
    email: "doctor@aidocare.com",
    phone: "+62 811 2345 6789",
    password: "doctor123", // WARNING: Plain text for mock demo only
    
    specialty: "General Medicine",
    licenseNumber: "DOC-2026-001",
    availability: true
  }
];

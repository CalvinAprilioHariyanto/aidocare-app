# Aido Care — Frontend

> A modern healthcare platform designed to connect patients and doctors through a simple, accessible, and user-friendly digital healthcare experience.

Aido Care is a healthcare application that provides patients with access to doctors, appointments, health information, medical records, and notifications. It also provides doctors with tools to manage schedules, patients, medical records, and prescriptions.

---

## Table of Contents

- [Overview](#overview)
- [Problem](#problem)
- [Solution](#solution)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Patient Experience](#patient-experience)
- [Doctor Experience](#doctor-experience)
- [UI/UX Design](#uiux-design)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Testing Accounts](#testing-accounts)
- [Responsive Design](#responsive-design)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [Team Contribution](#team-contribution)
- [Future Development](#future-development)
- [License](#license)

---

# Overview

Aido Care is a digital healthcare platform built to simplify interactions between patients and healthcare providers.

The application provides separate experiences for:

- Patients
- Doctors

Patients can discover doctors, manage appointments, access their health information, and view medical records.

Doctors can manage their schedules, patients, medical records, prescriptions, and account information.

The frontend focuses on creating a clean, professional, accessible, and responsive healthcare experience.

---

# Problem

Traditional healthcare interactions can involve several disconnected processes:

- Finding the right doctor
- Managing appointments
- Keeping track of medical information
- Accessing medical records
- Managing doctor schedules
- Communicating important healthcare updates

These processes can become difficult to manage when information is spread across different systems.

Aido Care addresses these problems by bringing the main healthcare interactions into a centralized digital platform.

---

# Solution

Aido Care provides a centralized healthcare experience for both patients and doctors.

### For Patients

- Doctor discovery
- Doctor profiles
- Appointment booking
- Appointment history
- Appointment management
- Health profile
- Medical records
- Notifications
- Account management

### For Doctors

- Doctor dashboard
- Schedule management
- Patient management
- Patient details
- Medical records
- Prescription management
- Analytics
- Notifications
- Account management

---

# Objectives

The main objectives of the Aido Care frontend are:

1. Provide a simple healthcare experience for patients.
2. Provide doctors with an efficient workspace.
3. Make important healthcare information easy to access.
4. Reduce unnecessary navigation and interaction complexity.
5. Maintain a consistent visual language across the application.
6. Provide responsive experiences across different screen sizes.
7. Integrate securely with the Aido Care backend API.
8. Provide clear navigation and role-based experiences for patients and doctors.

---

# Key Features

## Authentication

- Patient registration
- Patient login
- Doctor login
- JWT authentication
- Protected routes
- Role-based navigation
- Logout
- Persistent authentication state
- Authenticated user information

---

# Patient Portal

## Dashboard

The patient dashboard provides an overview of the patient's healthcare activity.

Features include:

- Welcome section
- Upcoming appointment
- Appointment overview
- Health profile summary
- Medical records overview
- Notifications
- Quick actions

---

## Find Doctor

Patients can discover available doctors.

Features include:

- Doctor list
- Doctor search
- Specialty filtering
- Doctor information
- Doctor availability

---

## Doctor Detail

Patients can view detailed information about a doctor.

Information includes:

- Doctor name
- Specialty
- Professional information
- Availability
- Consultation information

Actions include:

- Book appointment

---

## Appointment Management

Patients can manage their appointments.

Supported actions include:

- Create appointment
- View appointments
- View appointment details
- Reschedule appointment
- Cancel appointment

Appointment states include:

- Pending
- Confirmed
- Completed
- Cancelled

---

## Health Profile

Patients can view and manage their health information.

Information may include:

- Personal information
- Blood type
- Allergies
- Medical conditions
- Current medications
- Emergency information

---

## Medical Records

Patients can access their medical history.

Information may include:

- Consultation date
- Doctor
- Diagnosis
- Medical notes
- Prescription information

---

## Notifications

Patients can view important healthcare notifications.

Examples include:

- Appointment reminders
- Appointment updates
- Medical record updates
- System notifications

---

# Doctor Portal

Doctors have a dedicated portal optimized for healthcare management.

---

## Doctor Dashboard

The dashboard provides a high-level overview of the doctor's activities.

Dashboard information includes:

- Today's appointments
- Completed appointments
- Pending appointments
- Appointments requiring attention
- Recent activity
- Upcoming appointments

Example dashboard statistics:

```text
Appointments          4
Completed             1
Pending               1
Requires Attention    2

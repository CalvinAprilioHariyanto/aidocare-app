import { createContext, useContext, useState, useCallback } from 'react';

const APPOINTMENTS_KEY = 'aido_appointments';

const AppointmentContext = createContext(null);

function readStoredAppointments() {
  try {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistAppointments(appointments) {
  try {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  } catch {
    // Storage unavailable — keep in-memory state only.
  }
}

let nextId = Date.now();
function generateId() {
  nextId += 1;
  return `APT-${nextId}`;
}

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(readStoredAppointments);

  const update = useCallback((updater) => {
    setAppointments((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persistAppointments(next);
      return next;
    });
  }, []);

  const bookAppointment = useCallback((details) => {
    const isConflict = appointments.some(apt => 
      apt.doctorId === details.doctorId &&
      apt.date === details.date &&
      apt.time === details.time &&
      apt.status !== 'cancelled'
    );

    if (isConflict) {
      throw new Error("This time slot is already booked. Please choose another time.");
    }

    const appointment = {
      id: generateId(),
      ...details,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    update((prev) => [appointment, ...prev]);
    return appointment;
  }, [update, appointments]);

  const rescheduleAppointment = useCallback((id, newDate, newTime) => {
    update((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'confirmed' } : apt
      )
    );
  }, [update]);

  const cancelAppointment = useCallback((id) => {
    update((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      )
    );
  }, [update]);

  const getUpcoming = useCallback(() => {
    const now = new Date();
    return appointments
      .filter((apt) => apt.status === 'confirmed' && new Date(`${apt.date}T${apt.time}`) >= now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  }, [appointments]);

  return (
    <AppointmentContext.Provider
      value={{ appointments, bookAppointment, rescheduleAppointment, cancelAppointment, getUpcoming }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}

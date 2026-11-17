import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as appointmentService from '../services/appointmentService';

const AppointmentContext = createContext(null);

function hasToken() {
  try {
    return Boolean(localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token'));
  } catch {
    return false;
  }
}

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(hasToken);
  const [error, setError] = useState(null);

  const reloadAppointments = useCallback(async () => {
    const token = localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token');
    if (!token) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const list = await appointmentService.listAppointments();
      setAppointments(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token');
    if (!token) return;

    appointmentService
      .listAppointments()
      .then((list) => {
        if (active) setAppointments(list);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const bookAppointment = useCallback(async (details) => {
    const payload = {
      doctorId: details.doctorId,
      appointmentDate: details.date || details.appointmentDate,
      startTime: details.time || details.startTime,
      type: details.type,
    };
    const created = await appointmentService.bookAppointment(payload);
    setAppointments((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
    return created;
  }, []);

  const rescheduleAppointment = useCallback(async (id, newDate, newTime) => {
    const updated = await appointmentService.rescheduleAppointment(id, newDate, newTime);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updated, date: newDate, time: newTime, status: 'confirmed' } : apt))
    );
    return updated;
  }, []);

  const cancelAppointment = useCallback(async (id) => {
    const updated = await appointmentService.cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updated, status: 'cancelled' } : apt))
    );
    return updated;
  }, []);

  const getUpcoming = useCallback(() => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const isConfirmed = apt.status?.toLowerCase() === 'confirmed' || apt.status === 'CONFIRMED';
        if (!isConfirmed) return false;
        const aptDateTime = new Date(`${apt.date || apt.appointmentDate}T${apt.time || apt.startTime}`);
        return !isNaN(aptDateTime.getTime()) && aptDateTime >= now;
      })
      .sort((a, b) => new Date(`${a.date || a.appointmentDate}T${a.time || a.startTime}`) - new Date(`${b.date || b.appointmentDate}T${b.time || b.startTime}`));
  }, [appointments]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        getUpcoming,
        reloadAppointments,
      }}
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

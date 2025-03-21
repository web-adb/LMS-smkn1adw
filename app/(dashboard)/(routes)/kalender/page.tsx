"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventContentArg } from "@fullcalendar/core";
import { useModal } from "./hooks/useModal";
import { Modal } from "./components/ui/modal";

interface CalendarEvent extends EventInit {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "loading";
    message: string;
  } | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Fetch events from the API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setNotification({ type: "loading", message: "Memuat event..." });
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(
          data.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            extendedProps: { calendar: event.level },
          }))
        );
        setNotification({ type: "success", message: "Event berhasil dimuat!" });
      } catch (error: any) {
        setNotification({ type: "error", message: error.message });
      } finally {
        setIsLoading(false);
        setTimeout(() => setNotification(null), 3000); // Hilangkan notifikasi setelah 3 detik
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : notification.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <p className="flex items-center gap-2">
              {notification.type === "loading" && (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
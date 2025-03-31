"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg, DateClickArg } from "@fullcalendar/core";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, X, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

interface CalendarEvent extends EventInit {
  extendedProps: {
    calendar: string;
    description?: string;
    location?: string;
    instructor?: string;
  };
}

interface NotificationProps {
  type: "success" | "error" | "loading";
  message: string;
  onClose?: () => void;
  duration?: number;
}

const Notification = ({
  type,
  message,
  onClose,
  duration = 3000
}: NotificationProps) => {
  useEffect(() => {
    if (type !== "loading" && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-6 w-6" />;
      case "error":
        return <AlertCircle className="h-6 w-6" />;
      case "loading":
        return <Loader2 className="h-6 w-6 animate-spin" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800";
      case "error":
        return "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800";
      case "loading":
        return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-800 dark:text-emerald-200";
      case "error":
        return "text-rose-800 dark:text-rose-200";
      case "loading":
        return "text-blue-800 dark:text-blue-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
    >
      <div
        className={`${getColorClasses()} ${getTextColor()} rounded-xl border shadow-lg p-4 max-w-md w-full pointer-events-auto relative`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${getTextColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          {type !== "loading" && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {type !== "loading" && duration > 0 && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b"
          />
        )}
      </div>
    </motion.div>
  );
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "loading";
    message: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateEvents, setDateEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            extendedProps: {
              calendar: event.level,
              description: event.description,
              location: event.location,
              instructor: event.instructor
            },
          }))
        );
        setNotification({ type: "success", message: "Event berhasil dimuat!" });
      } catch (error: any) {
        setNotification({ type: "error", message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.date;
    setSelectedDate(clickedDate);
    
    // Find events for the clicked date
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.start as string);
      return (
        eventDate.getDate() === clickedDate.getDate() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getFullYear() === clickedDate.getFullYear()
      );
    });
    
    setDateEvents(eventsOnDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setDateEvents([]);
  };

  return (
    <div className="p-6 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            duration={notification.type === "loading" ? 0 : 3000}
          />
        )}
      </AnimatePresence>

      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventContent={renderEventContent}
          dateClick={handleDateClick}
          selectable={true}
        />
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {selectedDate?.toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                </div>

                {dateEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="mx-auto h-12 w-12 mb-2" />
                    <p>Tidak ada event pada tanggal ini</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dateEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                          <Clock size={14} />
                          <span>
                            {new Date(event.start as string).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                            {event.end && (
                              <>
                                {' - '}
                                {new Date(event.end as string).toLocaleTimeString('id-ID', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </>
                            )}
                          </span>
                        </div>
                        
                        {event.extendedProps.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <MapPin size={14} />
                            <span>{event.extendedProps.location}</span>
                          </div>
                        )}
                        
                        {event.extendedProps.instructor && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Pengajar: {event.extendedProps.instructor}
                          </div>
                        )}
                        
                        {event.extendedProps.description && (
                          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            <p>{event.extendedProps.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
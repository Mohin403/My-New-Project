import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../types';
import eventService from '../../services/api/eventService';
import ExportButton from '../common/ExportButton';
import { exportEventsToCSV, generatePDFExport } from '../../utils/exportUtils';
import { toast } from 'react-toastify';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isAllDay: false
  });

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Calculate first and last day of month for API query
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Format dates for API
        const startDate = firstDay.toISOString();
        const endDate = lastDay.toISOString();
        
        const fetchedEvents = await eventService.getEvents(startDate, endDate);
        setEvents(fetchedEvents);
      } catch (err) {
        setError('Failed to load events. Please try again.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  // Generate calendar days for the current month view
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      // Last day of the month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDayOfMonth.getDay();
      
      const days: CalendarDay[] = [];
      
      // Add days from previous month to fill the first week
      const daysFromPrevMonth = firstDayOfWeek;
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
        days.push({
          date: new Date(year, month - 1, i),
          isCurrentMonth: false,
          events: []
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({
          date,
          isCurrentMonth: true,
          events: events.filter(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            return (
              (date.getDate() === eventStart.getDate() && 
               date.getMonth() === eventStart.getMonth() && 
               date.getFullYear() === eventStart.getFullYear()) ||
              (date >= eventStart && date <= eventEnd)
            );
          })
        });
      }
      
      // Add days from next month to complete the last week
      const daysToAdd = 42 - days.length; // 6 rows of 7 days
      for (let i = 1; i <= daysToAdd; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
          events: []
        });
      }
      
      setCalendarDays(days);
    };
    
    generateCalendarDays();
  }, [currentDate, events]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle create new event
  const handleCreateEvent = (date?: Date) => {
    const startDate = date || new Date();
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    
    setEventFormData({
      title: '',
      description: '',
      startDate: startDate.toISOString().slice(0, 16),
      endDate: endDate.toISOString().slice(0, 16),
      isAllDay: false
    });
    
    setIsEditMode(false);
    setShowEventForm(true);
  };

  // Handle edit event
  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    setEventFormData({
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      startDate: new Date(selectedEvent.startDate).toISOString().slice(0, 16),
      endDate: new Date(selectedEvent.endDate).toISOString().slice(0, 16),
      isAllDay: selectedEvent.isAllDay
    });
    
    setIsEditMode(true);
    setShowEventModal(false);
    setShowEventForm(true);
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await eventService.deleteEvent(selectedEvent.id);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowEventModal(false);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEventFormData({
      ...eventFormData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  // Handle form submission
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && selectedEvent) {
        // Update existing event
        const updatedEvent = await eventService.updateEvent(selectedEvent.id, {
          ...eventFormData,
          startDate: new Date(eventFormData.startDate).toISOString(),
          endDate: new Date(eventFormData.endDate).toISOString()
        });
        
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ));
        toast.success('Event updated successfully');
      } else {
        // Create new event
        const newEvent = await eventService.createEvent({
          ...eventFormData,
          startDate: new Date(eventFormData.startDate).toISOString(),
          endDate: new Date(eventFormData.endDate).toISOString()
        });
        
        setEvents([...events, newEvent]);
        toast.success('Event created successfully');
      }
      
      setShowEventForm(false);
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error('Failed to save event');
    }
  };

  // Render calendar header with navigation
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <div className="flex items-center">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mx-4">{formatDate(currentDate)}</h2>
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleCreateEvent()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Event
        </button>
        <ExportButton 
          onExportCSV={() => exportEventsToCSV(events)}
          onExportPDF={() => generatePDFExport('events', events)}
          label="Export Events"
        />
      </div>
    </div>
  );

  // Render weekday headers
  const renderWeekdays = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Render calendar grid with days
  const renderCalendarGrid = () => (
    <div className="grid grid-cols-7 gap-1">
      {calendarDays.map((day, index) => (
        <div 
          key={index} 
          className={`min-h-[100px] border p-1 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${new Date().toDateString() === day.date.toDateString() ? 'border-blue-500 border-2' : 'border-gray-200'}`}
          onClick={() => day.isCurrentMonth && handleCreateEvent(day.date)}
        >
          <div className="text-right text-sm font-medium mb-1">
            {day.date.getDate()}
          </div>
          <div className="space-y-1">
            {day.events.slice(0, 3).map(event => (
              <div 
                key={event.id || event.eventId} 
                className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer truncate"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
              >
                {event.title}
              </div>
            ))}
            {day.events.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{day.events.length - 3} more
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render event details modal
  const renderEventModal = () => {
    if (!selectedEvent || !showEventModal) return null;
    
    const startDate = new Date(selectedEvent.startDate);
    const endDate = new Date(selectedEvent.endDate);
    
    const formatEventDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric', 
        minute: 'numeric' 
      }).format(date);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
            <button 
              onClick={() => setShowEventModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedEvent.description && (
              <p className="text-gray-600">{selectedEvent.description}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div>{formatEventDate(startDate)}</div>
                {!selectedEvent.isAllDay && (
                  <div>to {formatEventDate(endDate)}</div>
                )}
                {selectedEvent.isAllDay && <div>(All day)</div>}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleEditEvent}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render event form modal
  const renderEventForm = () => {
    if (!showEventForm) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{isEditMode ? 'Edit Event' : 'Create Event'}</h3>
            <button 
              onClick={() => setShowEventForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventFormData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={eventFormData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isAllDay"
                name="isAllDay"
                checked={eventFormData.isAllDay}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isAllDay" className="text-sm font-medium text-gray-700">All day event</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={eventFormData.startDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={eventFormData.endDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      
      {loading && <div className="text-center py-4">Loading calendar...</div>}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4">
          {renderHeader()}
          {renderWeekdays()}
          {renderCalendarGrid()}
        </div>
      )}
      
      {renderEventModal()}
      {renderEventForm()}
    </div>
  );
};

export default Calendar;
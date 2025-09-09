/**
 * Utility functions for exporting data to CSV and PDF formats
 */

import { Task, Note, CalendarEvent } from '../types';

/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Object mapping field names to display headers
 * @returns CSV string
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  headers: Record<string, string>
): string => {
  if (!data || !data.length) return '';
  
  const headerRow = Object.values(headers).join(',');
  const rows = data.map(item => {
    return Object.keys(headers)
      .map(key => {
        let value = item[key];
        
        // Handle nested objects or special formatting
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          if (value instanceof Date) {
            value = value.toISOString();
          } else {
            value = JSON.stringify(value);
          }
        }
        
        // Escape quotes and wrap in quotes if contains comma
        value = String(value).replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
        
        return value;
      })
      .join(',');
  });
  
  return [headerRow, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 * @param data Array of objects to export
 * @param headers Object mapping field names to display headers
 * @param filename Name of the file to download
 */
export const downloadCSV = <T extends Record<string, any>>(
  data: T[],
  headers: Record<string, string>,
  filename: string
): void => {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export tasks to CSV
 * @param tasks Array of tasks to export
 * @param filename Name of the file to download
 */
export const exportTasksToCSV = (tasks: Task[], filename: string = 'tasks'): void => {
  const headers = {
    title: 'Title',
    description: 'Description',
    status: 'Status',
    priority: 'Priority',
    startDate: 'Start Date',
    endDate: 'End Date',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  };
  
  downloadCSV(tasks, headers, filename);
};

/**
 * Export notes to CSV
 * @param notes Array of notes to export
 * @param filename Name of the file to download
 */
export const exportNotesToCSV = (notes: Note[], filename: string = 'notes'): void => {
  const headers = {
    title: 'Title',
    content: 'Content',
    tags: 'Tags',
    category: 'Category',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  };
  
  // Process tags array to string
  const processedNotes = notes.map(note => ({
    ...note,
    tags: note.tags.join(', ')
  }));
  
  downloadCSV(processedNotes, headers, filename);
};

/**
 * Export calendar events to CSV
 * @param events Array of calendar events to export
 * @param filename Name of the file to download
 */
export const exportEventsToCSV = (events: CalendarEvent[], filename: string = 'events'): void => {
  const headers = {
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    isAllDay: 'All Day',
    createdAt: 'Created At',
    updatedAt: 'Updated At'
  };
  
  downloadCSV(events, headers, filename);
};

/**
 * Generate a simple PDF export (browser print to PDF)
 * @param title Title for the PDF document
 * @param content HTML content to include in the PDF
 */
export const generatePDFExport = (title: string, content: string): void => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export as PDF');
    return;
  }
  
  // Set up the document content
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content}
        <div class="footer">
          Generated on ${new Date().toLocaleString()} by ProductiveHub
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

/**
 * Convert tasks to HTML table for PDF export
 * @param tasks Array of tasks to convert
 * @returns HTML string
 */
export const tasksToHTML = (tasks: Task[]): string => {
  if (!tasks || !tasks.length) return '<p>No tasks to display</p>';
  
  const tableRows = tasks.map(task => `
    <tr>
      <td>${task.title}</td>
      <td>${task.description || ''}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.startDate ? new Date(task.startDate).toLocaleString() : ''}</td>
      <td>${task.endDate ? new Date(task.endDate).toLocaleString() : ''}</td>
    </tr>
  `).join('');
  
  return `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

/**
 * Convert notes to HTML for PDF export
 * @param notes Array of notes to convert
 * @returns HTML string
 */
export const notesToHTML = (notes: Note[]): string => {
  if (!notes || !notes.length) return '<p>No notes to display</p>';
  
  return notes.map(note => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <div>
        <strong>Category:</strong> ${note.category || 'Uncategorized'}
      </div>
      <div>
        <strong>Tags:</strong> ${note.tags.join(', ') || 'None'}
      </div>
      <div>
        <small>Created: ${new Date(note.createdAt).toLocaleString()}</small>
      </div>
    </div>
  `).join('');
};

/**
 * Convert events to HTML table for PDF export
 * @param events Array of calendar events to convert
 * @returns HTML string
 */
export const eventsToHTML = (events: CalendarEvent[]): string => {
  if (!events || !events.length) return '<p>No events to display</p>';
  
  const tableRows = events.map(event => `
    <tr>
      <td>${event.title}</td>
      <td>${event.description || ''}</td>
      <td>${new Date(event.startDate).toLocaleString()}</td>
      <td>${new Date(event.endDate).toLocaleString()}</td>
      <td>${event.isAllDay ? 'Yes' : 'No'}</td>
    </tr>
  `).join('');
  
  return `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>All Day</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

/**
 * Export tasks to PDF
 * @param tasks Array of tasks to export
 * @param title Title for the PDF document
 */
export const exportTasksToPDF = (tasks: Task[], title: string = 'Tasks Report'): void => {
  const content = tasksToHTML(tasks);
  generatePDFExport(title, content);
};

/**
 * Export notes to PDF
 * @param notes Array of notes to export
 * @param title Title for the PDF document
 */
export const exportNotesToPDF = (notes: Note[], title: string = 'Notes Report'): void => {
  const content = notesToHTML(notes);
  generatePDFExport(title, content);
};

/**
 * Export calendar events to PDF
 * @param events Array of calendar events to export
 * @param title Title for the PDF document
 */
export const exportEventsToPDF = (events: CalendarEvent[], title: string = 'Events Report'): void => {
  const content = eventsToHTML(events);
  generatePDFExport(title, content);
};
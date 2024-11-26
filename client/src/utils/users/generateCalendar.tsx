import React, { useState } from 'react';


// export const generateCalendar = (month: number, year: number) => {
export const generateCalendar = (month: number, year: number, selectedDate: Date | null, setSelectedDate: (date: Date) => void) => {

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const dayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
  
    const calendarGrid = [];
    let row = [];
  
    for (let i = 0; i < dayOfWeek; i++) {
      row.push(<td key={i}></td>);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);

      const isToday = new Date(year, month, i).toDateString() === new Date().toDateString();
      const isPastDay = new Date(year, month, i) < new Date();

      const isSelected = selectedDate?.toDateString() === currentDate.toDateString();


  
      row.push(
        <td 
            key={i} 
            // className={`border-none px-3 py-2 cursor-pointer ${isToday ? ' text-red-500' : isPastDay ? 'text-gray-400 ' : ''}`}

            className={`border-none px-3 py-2 cursor-pointer ${isToday ? ' text-red-500' : isPastDay ? 'text-gray-400 ' : ''} ${isSelected ? 'bg-[#f3d281]' : ''}`}
            onClick={() => setSelectedDate(currentDate)} // Handle date click

            >

          <div className={`w-10 h-10 rounded-full flex items-center justify-center  ${isToday || !isPastDay ? 'bg-blue-50 text-violet-700' : ''}`}>
            {i}
          </div>
        </td>
      );
  
      if (row.length === 7) {
        calendarGrid.push(<tr>{row}</tr>);
        row = [];
      }
    }
  
    if (row.length > 0) {
      calendarGrid.push(<tr>{row}</tr>);
    }
  
    return calendarGrid;
  };
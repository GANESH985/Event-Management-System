import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label: string;
  timezone: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  timezone,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [time, setTime] = useState(
    value ? dayjs(value).format('HH:mm') : '09:00'
  );

  const handleDateChange = (date: Date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setSelectedDate(newDate);
    onChange(newDate);
    setShowCalendar(false);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange(newDate);
    }
  };

  const currentMonth = dayjs();
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf('month').day();
  const days = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left text-sm hover:border-gray-400 transition-colors"
          >
            {selectedDate ? dayjs(selectedDate).format('MMM DD, YYYY') : 'Pick a date'}
          </button>

          {showCalendar && (
            <div className="absolute z-20 top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-center">
                  {currentMonth.format('MMMM YYYY')}
                </h3>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div
                    key={day}
                    className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-600"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (day) {
                        const newDate = dayjs()
                          .date(day)
                          .toDate();
                        handleDateChange(newDate);
                      }
                    }}
                    disabled={day === null}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      day === null
                        ? 'invisible'
                        : selectedDate &&
                          dayjs(selectedDate).date() === day
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg">
          <Clock size={16} className="text-gray-600" />
          <input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="text-sm w-20 border-none outline-none"
          />
        </div>
      </div>
    </div>
  );
};

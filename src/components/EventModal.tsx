import React, { useState } from 'react';
import { Event } from '../store/appStore';
import { X } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { eventService } from '../services/api';
import dayjs from 'dayjs';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (event: Event) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    event.startDate ? new Date(event.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    event.endDate ? new Date(event.endDate) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUpdate = async () => {
    setError('');

    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setError('End date must be after start date');
      return;
    }

    setIsLoading(true);
    try {
      const response = await eventService.update(event._id, {
        startDate,
        endDate,
        timezone: event.timezone,
        profiles: event.profiles.map((p) => p._id),
      });

      onUpdate(response.data);
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Profiles</p>
          <p className="text-sm font-medium text-gray-900">
            {event.profiles.length} profile
            {event.profiles.length > 1 ? 's' : ''} selected
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Timezone</p>
          <p className="text-sm font-medium text-gray-900">{event.timezone}</p>
        </div>

        <DateTimePicker
          label="Start Date & Time"
          value={startDate}
          onChange={setStartDate}
          timezone={event.timezone}
        />

        <DateTimePicker
          label="End Date & Time"
          value={endDate}
          onChange={setEndDate}
          timezone={event.timezone}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

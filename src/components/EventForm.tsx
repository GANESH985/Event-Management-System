import React, { useState } from 'react';
import { Profile } from '../store/appStore';
import { ProfileSelector } from './ProfileSelector';
import { DateTimePicker } from './DateTimePicker';
import { getTimezones } from '../utils/timezone';
import { eventService, profileService } from '../services/api';
import dayjs from 'dayjs';

interface EventFormProps {
  profiles: Profile[];
  onEventCreated: (event: unknown) => void;
  onProfileAdded: (profile: unknown) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  profiles,
  onEventCreated,
  onProfileAdded,
}) => {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('UTC');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateEvent = async () => {
    setError('');

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }

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
      const response = await eventService.create({
        profiles: selectedProfiles,
        timezone,
        startDate,
        endDate,
      });

      onEventCreated(response.data);
      setSelectedProfiles([]);
      setTimezone('UTC');
      setStartDate(null);
      setEndDate(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProfile = async (name: string) => {
    try {
      const response = await profileService.create(name, timezone);
      onProfileAdded(response.data);
      setSelectedProfiles([...selectedProfiles, response.data._id]);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMsg);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Event</h2>

      <ProfileSelector
        profiles={profiles}
        selectedProfiles={selectedProfiles}
        onSelectionChange={setSelectedProfiles}
        onAddProfile={handleAddProfile}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-gray-400 transition-colors"
        >
          {getTimezones().map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <DateTimePicker
        label="Start Date & Time"
        value={startDate}
        onChange={setStartDate}
        timezone={timezone}
      />

      <DateTimePicker
        label="End Date & Time"
        value={endDate}
        onChange={setEndDate}
        timezone={timezone}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleCreateEvent}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : '+ Create Event'}
      </button>
    </div>
  );
};

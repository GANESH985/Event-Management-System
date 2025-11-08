import React, { useState } from 'react';
import { Event, Profile } from '../store/appStore';
import { formatDateTimeInTimezone } from '../utils/timezone';
import { Edit, History } from 'lucide-react';
import { EventModal } from './EventModal';
import { UpdateHistoryModal } from './UpdateHistoryModal';

interface EventListProps {
  events: Event[];
  profiles: Profile[];
  currentProfile: Profile | null;
  onEventUpdated: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  profiles,
  currentProfile,
  onEventUpdated,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyEvent, setHistoryEvent] = useState<Event | null>(null);

  const filterProfileTimezone = currentProfile?.timezone || 'UTC';

  const filteredEvents = currentProfile
    ? events.filter((e) => e.profiles.some((p) => p._id === currentProfile._id))
    : events;

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No events found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors last:border-b-0"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {event.title || 'Untitled Event'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {event.profiles.map((p) => p.name).join(', ')}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => {
                    setHistoryEvent(event);
                    setShowHistoryModal(true);
                  }}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="View History"
                >
                  <History size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                Start:{' '}
                <span className="font-medium">
                  {formatDateTimeInTimezone(event.startDate, filterProfileTimezone)}
                </span>
              </p>
              <p>
                End:{' '}
                <span className="font-medium">
                  {formatDateTimeInTimezone(event.endDate, filterProfileTimezone)}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Created:{' '}
                {formatDateTimeInTimezone(event.createdAt, filterProfileTimezone)}
              </p>
              {event.updatedAt !== event.createdAt && (
                <p className="text-xs text-gray-500">
                  Updated:{' '}
                  {formatDateTimeInTimezone(event.updatedAt, filterProfileTimezone)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          onUpdate={onEventUpdated}
        />
      )}

      {historyEvent && (
        <UpdateHistoryModal
          event={historyEvent}
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setHistoryEvent(null);
          }}
          userTimezone={currentProfile?.timezone || 'UTC'}
        />
      )}
    </>
  );
};

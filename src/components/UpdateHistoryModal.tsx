import React from 'react';
import { Event, UpdateLog } from '../store/appStore';
import { X } from 'lucide-react';
import { formatDateTimeInTimezone } from '../utils/timezone';
import dayjs from 'dayjs';

interface UpdateHistoryModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  userTimezone: string;
}

export const UpdateHistoryModal: React.FC<UpdateHistoryModalProps> = ({
  event,
  isOpen,
  onClose,
  userTimezone,
}) => {
  if (!isOpen) return null;

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'None';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (value instanceof Date) {
        return formatDateTimeInTimezone(value, userTimezone);
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Event Update History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {event.updateHistory && event.updateHistory.length > 0 ? (
          <div className="space-y-4">
            {event.updateHistory.map((log, idx) => (
              <div key={idx} className="border-l-4 border-indigo-600 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    {formatDateTimeInTimezone(log.updatedAt, userTimezone)}
                  </span>
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {log.field === 'profiles'
                    ? 'Profiles changed'
                    : log.field === 'startDate'
                    ? 'Start date updated'
                    : log.field === 'endDate'
                    ? 'End date updated'
                    : log.field === 'timezone'
                    ? 'Timezone updated'
                    : `${log.field} updated`}
                </p>

                {log.field !== 'profiles' && (
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p>
                      From:{' '}
                      <span className="font-mono bg-red-50 px-2 py-1 rounded">
                        {formatValue(log.previousValue)}
                      </span>
                    </p>
                    <p>
                      To:{' '}
                      <span className="font-mono bg-green-50 px-2 py-1 rounded">
                        {formatValue(log.newValue)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No update history yet
          </p>
        )}
      </div>
    </div>
  );
};

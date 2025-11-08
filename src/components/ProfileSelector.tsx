import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Profile } from '../store/appStore';

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfiles: string[];
  onSelectionChange: (profileIds: string[]) => void;
  onAddProfile: (name: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedProfiles,
  onSelectionChange,
  onAddProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleToggleProfile = (profileId: string) => {
    const updated = selectedProfiles.includes(profileId)
      ? selectedProfiles.filter((id) => id !== profileId)
      : [...selectedProfiles, profileId];
    onSelectionChange(updated);
  };

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      onAddProfile(newProfileName);
      setNewProfileName('');
      setShowInput(false);
    }
  };

  const selectedProfilesData = profiles.filter((p) =>
    selectedProfiles.includes(p._id)
  );

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profiles
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {selectedProfiles.length > 0
                ? `${selectedProfiles.length} profile${
                    selectedProfiles.length > 1 ? 's' : ''
                  } selected`
                : 'Select profiles...'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {selectedProfilesData.map((profile) => (
                <div
                  key={profile._id}
                  className="flex items-center justify-between bg-indigo-100 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm font-medium text-indigo-900">
                    {profile.name}
                  </span>
                  <button
                    onClick={() => handleToggleProfile(profile._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-200">
                {profiles
                  .filter((p) => !selectedProfiles.includes(p._id))
                  .map((profile) => (
                    <label
                      key={profile._id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProfiles.includes(profile._id)}
                        onChange={() => handleToggleProfile(profile._id)}
                        className="w-4 h-4 rounded accent-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {profile.name}
                      </span>
                    </label>
                  ))}
              </div>

              {!showInput ? (
                <button
                  onClick={() => setShowInput(true)}
                  className="w-full flex items-center justify-center gap-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium mt-2"
                >
                  <Plus size={16} />
                  Add Profile
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Profile name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    autoFocus
                  />
                  <button
                    onClick={handleAddProfile}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

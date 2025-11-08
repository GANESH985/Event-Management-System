import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Profile } from '../store/appStore';
import { profileService } from '../services/api';

interface ProfileSelector2Props {
  profiles: Profile[];
  currentProfile: Profile | null;
  onProfileSelect: (profile: Profile | null) => void;
  onProfileAdded: (profile: Profile) => void;
}

export const ProfileSelector2: React.FC<ProfileSelector2Props> = ({
  profiles,
  currentProfile,
  onProfileSelect,
  onProfileAdded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;

    setIsLoading(true);
    try {
      const response = await profileService.create(newProfileName);
      onProfileAdded(response.data);
      setNewProfileName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span>
          {currentProfile ? currentProfile.name : 'Select current profile...'}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            {profiles.map((profile) => (
              <button
                key={profile._id}
                onClick={() => {
                  onProfileSelect(profile);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentProfile?._id === profile._id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                {profile.name}
              </button>
            ))}

            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium mt-2 border-t border-gray-200 pt-3"
              >
                <Plus size={16} />
                Add Profile
              </button>
            ) : (
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-200">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Profile name"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAddProfile}
                  disabled={isLoading}
                  className="px-2 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { profileService, eventService } from './services/api';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { ProfileSelector2 } from './components/ProfileSelector2';
import { Calendar } from 'lucide-react';

function App() {
  const {
    profiles,
    events,
    currentProfile,
    setProfiles,
    setEvents,
    setCurrentProfile,
    addProfile,
    updateEvent,
  } = useAppStore();

  useEffect(() => {
    loadProfiles();
    loadEvents();
  }, []);

  useEffect(() => {
    if (currentProfile) {
      loadEventsByProfile();
    } else if (profiles.length > 0) {
      loadEvents();
    }
  }, [currentProfile]);

  const loadProfiles = async () => {
    try {
      const response = await profileService.getAll();
      setProfiles(response.data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadEventsByProfile = async () => {
    if (!currentProfile) return;
    try {
      const response = await eventService.getByProfile(currentProfile._id);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleEventCreated = (event: unknown) => {
    loadEvents();
  };

  const handleProfileAdded = (profile: unknown) => {
    addProfile(profile as Parameters<typeof addProfile>[0]);
    loadProfiles();
  };

  const handleEventUpdated = (updatedEvent: unknown) => {
    updateEvent((updatedEvent as { _id: string })._id, updatedEvent as Parameters<typeof updateEvent>[1]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Event Management
                </h1>
                <p className="text-sm text-gray-500">
                  Create and manage events across multiple timezones
                </p>
              </div>
            </div>
            <ProfileSelector2
              profiles={profiles}
              currentProfile={currentProfile}
              onProfileSelect={setCurrentProfile}
              onProfileAdded={handleProfileAdded}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <EventForm
              profiles={profiles}
              onEventCreated={handleEventCreated}
              onProfileAdded={handleProfileAdded}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Events
              </h2>
              {currentProfile && (
                <p className="text-sm text-gray-600">
                  View in Timezone:{' '}
                  <span className="font-medium">{currentProfile.timezone}</span>
                </p>
              )}
            </div>
            <EventList
              events={events}
              profiles={profiles}
              currentProfile={currentProfile}
              onEventUpdated={handleEventUpdated}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

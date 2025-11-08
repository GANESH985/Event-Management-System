import Event from '../models/Event.js';
import Profile from '../models/Profile.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const createEvent = async (req, res) => {
  try {
    const { profiles, timezone: tz, startDate, endDate, title } = req.body;

    if (!profiles || profiles.length === 0) {
      return res.status(400).json({ message: 'At least one profile is required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    const event = new Event({
      title: title || 'Untitled Event',
      profiles,
      timezone: tz || 'UTC',
      startDate: start.toDate(),
      endDate: end.toDate(),
      updateHistory: [],
    });

    const savedEvent = await event.save();
    await savedEvent.populate('profiles');
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('profiles');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const events = await Event.find({ profiles: profileId }).populate('profiles');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { profiles, timezone: tz, startDate, endDate, title } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      if (end.isBefore(start)) {
        return res.status(400).json({ message: 'End date cannot be before start date' });
      }
    }

    const updateLog = [];

    if (title && event.title !== title) {
      updateLog.push({
        field: 'title',
        previousValue: event.title,
        newValue: title,
        updatedAt: new Date(),
        updatedBy: 'user',
      });
      event.title = title;
    }

    if (profiles) {
      const oldProfileIds = event.profiles.map(p => p.toString());
      const newProfileIds = profiles.map(p => p.toString());
      if (JSON.stringify(oldProfileIds.sort()) !== JSON.stringify(newProfileIds.sort())) {
        updateLog.push({
          field: 'profiles',
          previousValue: oldProfileIds,
          newValue: newProfileIds,
          updatedAt: new Date(),
          updatedBy: 'user',
        });
        event.profiles = profiles;
      }
    }

    if (tz && event.timezone !== tz) {
      updateLog.push({
        field: 'timezone',
        previousValue: event.timezone,
        newValue: tz,
        updatedAt: new Date(),
        updatedBy: 'user',
      });
      event.timezone = tz;
    }

    if (startDate) {
      const start = dayjs(startDate).toDate();
      if (event.startDate.getTime() !== start.getTime()) {
        updateLog.push({
          field: 'startDate',
          previousValue: event.startDate,
          newValue: start,
          updatedAt: new Date(),
          updatedBy: 'user',
        });
        event.startDate = start;
      }
    }

    if (endDate) {
      const end = dayjs(endDate).toDate();
      if (event.endDate.getTime() !== end.getTime()) {
        updateLog.push({
          field: 'endDate',
          previousValue: event.endDate,
          newValue: end,
          updatedAt: new Date(),
          updatedBy: 'user',
        });
        event.endDate = end;
      }
    }

    if (updateLog.length > 0) {
      event.updateHistory = [...event.updateHistory, ...updateLog];
    }

    const updatedEvent = await event.save();
    await updatedEvent.populate('profiles');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventUpdateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event.updateHistory || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
import Profile from '../models/Profile.js';

export const createProfile = async (req, res) => {
  try {
    const { name, timezone } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Profile name is required' });
    }

    const profile = new Profile({
      name: name.trim(),
      timezone: timezone || 'UTC',
    });

    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (name) profile.name = name.trim();
    if (timezone) profile.timezone = timezone;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
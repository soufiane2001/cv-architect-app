import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  profileTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  mention: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
}

export interface Volunteer {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  volunteer: Volunteer[];
  hobbies: string;
  references: string;
  permis: string;
  nationalite: string;
  template: string;
  color: string;
}

const DEFAULT_CV: CVData = {
  personalInfo: {
    firstName: '', lastName: '', profileTitle: '',
    email: '', phone: '', address: '',
    linkedin: '', website: '', summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  volunteer: [],
  hobbies: '',
  references: '',
  permis: '',
  nationalite: '',
  template: 'modern',
  color: '#1A5EAB',
};

const STORAGE_KEY = '@cv_data';
const PHOTO_KEY   = '@cv_photo';

export function useCV() {
  const [cvData, setCVData] = useState<CVData>(DEFAULT_CV);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [rawData, rawPhoto] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(PHOTO_KEY),
        ]);
        if (rawData) setCVData(JSON.parse(rawData));
        if (rawPhoto) setPhoto(rawPhoto);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (data: CVData) => {
    setCVData(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const update = useCallback(async (partial: Partial<CVData>) => {
    setCVData(prev => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const savePhoto = useCallback(async (uri: string | null) => {
    setPhoto(uri);
    if (uri) await AsyncStorage.setItem(PHOTO_KEY, uri);
    else await AsyncStorage.removeItem(PHOTO_KEY);
  }, []);

  const reset = useCallback(async () => {
    setCVData(DEFAULT_CV);
    setPhoto(null);
    await AsyncStorage.multiRemove([STORAGE_KEY, PHOTO_KEY]);
  }, []);

  return { cvData, photo, loaded, save, update, savePhoto, reset };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

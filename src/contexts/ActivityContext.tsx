import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActivityContextType {
  activityDays: number;
  incrementActivityDay: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const ACTIVITY_STORAGE_KEY = '@psalter_activity_days';
const LAST_ACTIVITY_DATE_KEY = '@psalter_last_activity_date';

interface ActivityProviderProps {
  children: ReactNode;
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const [activityDays, setActivityDays] = useState(0);

  useEffect(() => {
    initializeActivity();
  }, []);

  const initializeActivity = async () => {
    try {
      // Load saved activity days
      const savedDays = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
      const savedLastDate = await AsyncStorage.getItem(LAST_ACTIVITY_DATE_KEY);

      const today = new Date().toDateString();

      console.log('📊 Activity initialization:');
      console.log('📊 Saved days:', savedDays);
      console.log('📊 Saved last date:', savedLastDate);
      console.log('📊 Today:', today);

      if (savedDays) {
        const days = parseInt(savedDays, 10);
        setActivityDays(days);
        console.log('📊 Loaded activity days:', days);
      }

      // Check if this is a new day
      if (savedLastDate !== today) {
        console.log('📊 New day detected, incrementing activity...');
        await incrementActivityDay();
      } else {
        console.log('📊 Same day, not incrementing activity');
      }
    } catch (error) {
      console.error('📊 Error initializing activity tracking:', error);
    }
  };

  const incrementActivityDay = async () => {
    try {
      const today = new Date().toDateString();
      const savedLastDate = await AsyncStorage.getItem(LAST_ACTIVITY_DATE_KEY);

      console.log('📊 Increment activity check:');
      console.log('📊 Today:', today);
      console.log('📊 Saved last date:', savedLastDate);
      console.log('📊 Current activity days:', activityDays);

      // Only increment if it's a new day
      if (savedLastDate !== today) {
        const newDays = activityDays + 1;
        setActivityDays(newDays);

        await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, newDays.toString());
        await AsyncStorage.setItem(LAST_ACTIVITY_DATE_KEY, today);

        console.log('📊 Activity incremented to:', newDays);
        console.log('📊 Saved new date:', today);
      } else {
        console.log('📊 Same day, not incrementing');
      }
    } catch (error) {
      console.error('📊 Error incrementing activity day:', error);
    }
  };

  const value: ActivityContextType = {
    activityDays,
    incrementActivityDay,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity(): ActivityContextType {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
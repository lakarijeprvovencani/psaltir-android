import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllPsalms, getPsalmById, type Psalm } from '../../lib/supabase';

const DAILY_PSALM_STORAGE_KEY = '@psalter_daily_psalm';
const DAILY_PSALM_DATE_KEY = '@psalter_daily_psalm_date';

interface DailyPsalmData {
  psalmId: number;
  date: string;
}

export function useDailyPsalm() {
  const [psalm, setPsalm] = useState<Psalm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDailyPsalm();
  }, []);

  const loadDailyPsalm = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toDateString();
      
      // Check if we have a psalm for today
      const savedDate = await AsyncStorage.getItem(DAILY_PSALM_DATE_KEY);
      const savedPsalmId = await AsyncStorage.getItem(DAILY_PSALM_STORAGE_KEY);

      if (savedDate === today && savedPsalmId) {
        // We have a psalm for today, load it
        const psalmId = parseInt(savedPsalmId, 10);
        const psalmData = await getPsalmById(psalmId);
        
        if (psalmData) {
          setPsalm(psalmData);
        } else {
          // If psalm doesn't exist anymore, select a new one
          await selectNewDailyPsalm();
        }
      } else {
        // It's a new day or no psalm saved, select a new one
        await selectNewDailyPsalm();
      }
    } catch (err) {
      console.error('Error loading daily psalm:', err);
      setError('Грешка при учитавању псалма дана');
    } finally {
      setLoading(false);
    }
  };

  const selectNewDailyPsalm = async () => {
    try {
      // Get all psalms from database
      const allPsalms = await getAllPsalms();
      
      if (allPsalms.length === 0) {
        setError('Нема доступних псалама');
        return;
      }

      // Select a random psalm
      const randomIndex = Math.floor(Math.random() * allPsalms.length);
      const selectedPsalm = allPsalms[randomIndex];

      // Save the selected psalm and today's date
      const today = new Date().toDateString();
      await AsyncStorage.setItem(DAILY_PSALM_STORAGE_KEY, selectedPsalm.id.toString());
      await AsyncStorage.setItem(DAILY_PSALM_DATE_KEY, today);

      setPsalm(selectedPsalm);
    } catch (err) {
      console.error('Error selecting new daily psalm:', err);
      setError('Грешка при одабиру псалма дана');
    }
  };

  // Function to manually refresh the daily psalm (for testing or admin purposes)
  const refreshDailyPsalm = async () => {
    await selectNewDailyPsalm();
  };

  return {
    psalm,
    loading,
    error,
    refreshDailyPsalm,
  };
}
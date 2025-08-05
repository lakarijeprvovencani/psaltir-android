import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Calendar, Tag, Heart, Trash } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/contexts/ThemeContext';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood: string;
}

const DIARY_STORAGE_KEY = '@psalter_diary_entries';

export default function DiaryScreen() {
  const { currentColors } = useTheme();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [expandedEntries, setExpandedEntries] = useState<string[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
        console.log('📖 Loaded diary entries:', parsedEntries.length);
      }
    } catch (error) {
      console.error('📖 Error loading diary entries:', error);
    }
  };

  const saveEntries = async (newEntries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(newEntries));
      console.log('📖 Saved diary entries:', newEntries.length);
    } catch (error) {
      console.error('📖 Error saving diary entries:', error);
    }
  };

  const handleAddEntry = async () => {
    if (newEntryTitle.trim() && newEntryContent.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        title: newEntryTitle,
        content: newEntryContent,
        date: new Date().toISOString().split('T')[0],
        tags: [],
        mood: '📝'
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      await saveEntries(updatedEntries);
      setNewEntryTitle('');
      setNewEntryContent('');
      setShowNewEntry(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
    console.log('📖 Deleted diary entry:', entryId);
  };

  const toggleEntryExpansion = (entryId: string) => {
    setExpandedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ДУХОВНИ ДНЕВНИК</Text>
        <Text style={[styles.headerSubtitle, { color: currentColors.secondaryText }]}>Забележи своје духовне мисли</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add New Entry Button */}
        <TouchableOpacity 
          style={[styles.addButton, { borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
          onPress={() => setShowNewEntry(!showNewEntry)}
        >
          <LinearGradient
            colors={['#D4AF37', '#B8941F']}
            style={styles.addButtonGradient}
          >
            <Plus size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Нова белешка</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* New Entry Form */}
        {showNewEntry && (
          <View style={[styles.newEntryForm, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <TextInput
              style={[styles.titleInput, { backgroundColor: currentColors.primary, color: currentColors.primaryText, borderColor: currentColors.tertiary }]}
              placeholder="Наслов белешке..."
              placeholderTextColor={currentColors.tertiaryText}
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
            />
            <TextInput
              style={[styles.contentInput, { backgroundColor: currentColors.primary, color: currentColors.primaryText, borderColor: currentColors.tertiary }]}
              placeholder="Твоје мисли и размишљања..."
              placeholderTextColor={currentColors.tertiaryText}
              multiline
              numberOfLines={6}
              value={newEntryContent}
              onChangeText={setNewEntryContent}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: currentColors.accentGold }]}
                onPress={handleAddEntry}
              >
                <Text style={[styles.saveButtonText, { color: currentColors.primary }]}>Сачувај</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: currentColors.tertiary }]}
                onPress={() => setShowNewEntry(false)}
              >
                <Text style={[styles.cancelButtonText, { color: currentColors.secondaryText }]}>Откажи</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.statNumber, { color: currentColors.accentGold }]}>{entries.length}</Text>
            <Text style={[styles.statLabel, { color: currentColors.tertiaryText }]}>Укупно бележака</Text>
          </View>
        </View>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          {entries.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Твоје бележке</Text>
              {entries.map((entry) => {
            const isExpanded = expandedEntries.includes(entry.id);
            const shouldShowExpandButton = entry.content.length > 100; // Show expand if content is longer than 100 chars
            
            return <TouchableOpacity 
              key={entry.id} 
              style={[styles.entryCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
              onPress={() => shouldShowExpandButton && toggleEntryExpansion(entry.id)}
              activeOpacity={shouldShowExpandButton ? 0.7 : 1}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryMood}>{entry.mood}</Text>
                <View style={styles.entryInfo}>
                  <Text style={[styles.entryTitle, { color: currentColors.primaryText }]}>{entry.title}</Text>
                  <View style={styles.entryMeta}>
                    <Calendar size={12} color={currentColors.tertiaryText} />
                    <Text style={[styles.entryDate, { color: currentColors.tertiaryText }]}>{entry.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Trash size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              <Text 
                style={[styles.entryContent, { color: currentColors.secondaryText }]} 
                numberOfLines={isExpanded ? undefined : 3}
              >
                {entry.content}
              </Text>
              {shouldShowExpandButton && (
                <Text style={[styles.expandButton, { color: currentColors.accentGold }]}>
                  {isExpanded ? 'Прикажи мање ↑' : 'Прикажи више ↓'}
                </Text>
              )}
              {entry.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: currentColors.primary }]}>
                      <Tag size={10} color={currentColors.accentGold} />
                      <Text style={[styles.tagText, { color: currentColors.accentGold }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
              })}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: currentColors.primaryText }]}>Нема бележака</Text>
              <Text style={[styles.emptyStateText, { color: currentColors.secondaryText }]}>
                Започните свој духовни дневник додавањем прве белешке
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonGradient: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newEntryForm: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  titleInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
  },
  contentInput: {
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  entriesContainer: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  entryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  entryMood: {
    fontSize: 24,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  entryDate: {
    fontSize: 12,
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  expandButton: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
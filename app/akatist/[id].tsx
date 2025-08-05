import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAkatistById, type Akatist } from '../../lib/supabase';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';

export default function AkatistScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const akatistId = parseInt(id as string);
  const { currentColors } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [akatist, setAkatist] = useState<Akatist | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Load akatist data from Supabase
  React.useEffect(() => {
    loadAkatist();
  }, [akatistId]);

  const loadAkatist = async () => {
    try {
      setLoading(true);
      const data = await getAkatistById(akatistId);
      setAkatist(data);
    } catch (error) {
      console.error('Error loading akatist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!akatist) return;
    
    const favoriteId = `akatist-${akatist.id}`;
    
    if (isFavorite(favoriteId)) {
      await removeFromFavorites(favoriteId);
    } else {
      await addToFavorites({
        id: favoriteId,
        type: 'prayer', // Using prayer type for akatist
        title: akatist.title,
        subtitle: akatist.subtitle,
        route: `/akatist/${akatist.id}`,
        addedAt: new Date().toISOString(),
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>АКАТИСТ</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.loadingText, { color: currentColors.secondaryText }]}>Учитавање акатиста...</Text>
        </View>
      </View>
    );
  }

  if (!akatist) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>АКАТИСТ</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: currentColors.error }]}>Акатист није пронађен</Text>
          <Text style={[styles.errorSubtext, { color: currentColors.tertiaryText }]}>Молимо покушајте поново</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.accentGold} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>АКАТИСТ</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Heart 
            size={24} 
            color={isFavorite(`akatist-${akatist.id}`) ? currentColors.accentGold : currentColors.tertiaryText}
            fill={isFavorite(`akatist-${akatist.id}`) ? currentColors.accentGold : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={[styles.titleSection, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <BookOpen size={32} color={currentColors.accentGold} />
          <Text style={[styles.akatistTitle, { color: currentColors.primaryText }]}>{akatist.title}</Text>
          <Text style={[styles.akatistSubtitle, { color: currentColors.secondaryText }]}>{akatist.subtitle}</Text>
          {akatist.feast_day && (
            <Text style={[styles.feastDay, { color: currentColors.accentGold }]}>Празник: {akatist.feast_day}</Text>
          )}
        </View>

        {/* Font Size Controls */}
        <View style={styles.fontControls}>
          <Text style={[styles.fontLabel, { color: currentColors.secondaryText }]}>Величина текста:</Text>
          <View style={styles.fontButtons}>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 14 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(14)}
            >
              <Text style={[styles.fontButtonText, { color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 16 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(16)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 16, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 18 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(18)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 18, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Akatist Content */}
        <View style={[styles.akatistContentContainer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          {akatist.content.map((verse, index) => (
            <Text
              key={index}
              style={[
                styles.verse,
                { fontSize, color: currentColors.primaryText },
                verse === '' && styles.emptyVerse
              ]}
            >
              {verse}
            </Text>
          ))}
        </View>

        {akatist.note && (
          <View style={[styles.noteContainer, { backgroundColor: currentColors.tertiary, borderLeftColor: currentColors.accentGold }]}>
            <Text style={[styles.noteTitle, { color: currentColors.accentGold }]}>Напомена:</Text>
            <Text style={[styles.noteText, { color: currentColors.secondaryText }]}>{akatist.note}</Text>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={[styles.instructionsTitle, { color: currentColors.accentGold }]}>Упутство за читање акатиста</Text>
          <View style={[styles.instructionsCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Акатист се чита полако и са пажњом
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Прекрстите се пре и после читања
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Размишљајте о значењу речи
            </Text>
            <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
              • Кондак 13 се чита три пута
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    width: 40,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 25,
    borderRadius: 15,
    borderWidth: 3,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  akatistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
    lineHeight: 26,
  },
  akatistSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  feastDay: {
    fontSize: 12,
    fontWeight: '600',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  fontLabel: {
    fontSize: 14,
  },
  fontButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fontButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  fontButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  akatistContentContainer: {
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 25,
  },
  verse: {
    lineHeight: 28,
    marginBottom: 6,
    textAlign: 'left',
    fontFamily: 'serif',
  },
  emptyVerse: {
    marginBottom: 16,
  },
  noteContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 25,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  instructionsSection: {
    marginHorizontal: 20,
    marginBottom: 100,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
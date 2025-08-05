import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, Volume2, Bookmark, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPsalmById, type Psalm } from '../../lib/supabase';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';

export default function PsalmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const psalmId = parseInt(id as string);
  const { currentColors } = useTheme();
  const [fontSize, setFontSize] = useState(18);
  const [psalm, setPsalm] = useState<Psalm | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Load psalm data from Supabase
  React.useEffect(() => {
    loadPsalm();
  }, [psalmId]);

  const loadPsalm = async () => {
    try {
      setLoading(true);
      const data = await getPsalmById(psalmId);
      setPsalm(data);
    } catch (error) {
      console.error('Error loading psalm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!psalm) return;
    
    const favoriteId = `psalm-${psalm.id}`;
    
    if (isFavorite(favoriteId)) {
      await removeFromFavorites(favoriteId);
    } else {
      await addToFavorites({
        id: favoriteId,
        type: 'psalm',
        title: `Псалам ${psalm.id}`,
        subtitle: psalm.title,
        route: `/psalm/${psalm.id}`,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const handlePreviousPsalm = () => {
    if (psalmId > 1) {
      router.replace(`/psalm/${psalmId - 1}`);
    }
  };

  const handleNextPsalm = () => {
    if (psalmId < 150) {
      router.replace(`/psalm/${psalmId + 1}`);
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
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ПСАЛАМ {psalmId}</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.loadingText, { color: currentColors.secondaryText }]}>Учитавање псалма...</Text>
        </View>
      </View>
    );
  }

  if (!psalm) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ПСАЛАМ {psalmId}</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: currentColors.error }]}>Псалам {psalmId} није пронађен</Text>
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
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ПСАЛАМ {psalm.id}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Heart 
            size={24} 
            color={isFavorite(`psalm-${psalm.id}`) ? currentColors.accentGold : currentColors.tertiaryText}
            fill={isFavorite(`psalm-${psalm.id}`) ? currentColors.accentGold : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={[styles.titleSection, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <Text style={[styles.psalmNumber, { color: currentColors.accentGold }]}>Псалам {psalm.id}</Text>
          <Text style={[styles.psalmTitle, { color: currentColors.primaryText }]}>{psalm.title}</Text>
          <Text style={[styles.psalmSubtitle, { color: currentColors.secondaryText }]}>{psalm.subtitle}</Text>
        </View>

        {/* Font Size Controls */}
        <View style={styles.fontControls}>
          <Text style={[styles.fontLabel, { color: currentColors.secondaryText }]}>Величина текста:</Text>
          <View style={styles.fontButtons}>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 16 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(16)}
            >
              <Text style={[styles.fontButtonText, { color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 18 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(18)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 16, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 20 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(20)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 18, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Psalm Content */}
        <View style={[styles.psalmContentContainer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          {psalm.content.map((verse, index) => (
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

        {psalm.note && (
          <View style={[styles.noteContainer, { backgroundColor: currentColors.tertiary, borderLeftColor: currentColors.accentGold }]}>
            <Text style={[styles.noteTitle, { color: currentColors.accentGold }]}>Напомена:</Text>
            <Text style={[styles.noteText, { color: currentColors.secondaryText }]}>{psalm.note}</Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor },
              psalmId <= 1 && styles.navButtonDisabled
            ]}
            onPress={handlePreviousPsalm}
            disabled={psalmId <= 1}
          >
            <ChevronLeft size={20} color={psalmId <= 1 ? currentColors.tertiaryText : currentColors.accentGold} />
            <Text style={[styles.navButtonText, { color: psalmId <= 1 ? currentColors.tertiaryText : currentColors.accentGold }]}>
              Псалам {psalmId - 1}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor },
              psalmId >= 150 && styles.navButtonDisabled
            ]}
            onPress={handleNextPsalm}
            disabled={psalmId >= 150}
          >
            <Text style={[styles.navButtonText, { color: psalmId >= 150 ? currentColors.tertiaryText : currentColors.accentGold }]}>
              Псалам {psalmId + 1}
            </Text>
            <ChevronRight size={20} color={psalmId >= 150 ? currentColors.tertiaryText : currentColors.accentGold} />
          </TouchableOpacity>
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
  psalmNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  psalmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  psalmSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
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
  psalmContentContainer: {
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
    lineHeight: 32,
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
    marginBottom: 100,
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 100,
    gap: 15,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
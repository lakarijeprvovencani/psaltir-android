import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Book, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPsalmsByKathisma, type Psalm } from '../../lib/supabase';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';


export default function KathismaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const kathismaNumber = parseInt(id as string);
  const { currentColors, isLightMode } = useTheme();
  const [psalms, setPsalms] = React.useState<Psalm[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Load psalms for this kathisma
  React.useEffect(() => {
    loadPsalms();
  }, [kathismaNumber]);

  const loadPsalms = async () => {
    try {
      setLoading(true);
      const data = await getPsalmsByKathisma(kathismaNumber);
      // Loaded psalms for kathisma
      setPsalms(data);
    } catch (error) {
      console.error('Error loading psalms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate psalm range for display
  const startPsalm = psalms.length > 0 ? Math.min(...psalms.map(p => p.id)) : 0;
  const endPsalm = psalms.length > 0 ? Math.max(...psalms.map(p => p.id)) : 0;

  const handleToggleFavorite = async () => {
    const favoriteId = `kathisma-${kathismaNumber}`;
    
    if (isFavorite(favoriteId)) {
      await removeFromFavorites(favoriteId);
    } else {
      await addToFavorites({
        id: favoriteId,
        type: 'kathisma',
        title: `${kathismaNumber}. Катизма`,
        subtitle: psalms.length > 0 ? `Псалми ${startPsalm}-${endPsalm}` : '',
        route: `/kathisma/${kathismaNumber}`,
        addedAt: new Date().toISOString(),
      });
    }
  };

  // Choose background image based on theme
  const backgroundImage = isLightMode 
    ? require('../../assets/images/katizma_tamno_na_svetlo.png')
    : require('../../assets/images/katizma_tamno.png');

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <ImageBackground
        key={isLightMode ? 'light-bg' : 'dark-bg'}
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>{kathismaNumber}. КАТИЗМА</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Heart 
              size={24} 
              color={isFavorite(`kathisma-${kathismaNumber}`) ? currentColors.accentGold : currentColors.tertiaryText}
              fill={isFavorite(`kathisma-${kathismaNumber}`) ? currentColors.accentGold : "none"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Kathisma Info */}
          <View style={styles.kathismaInfo}>
            <LinearGradient
              colors={[currentColors.cardBackground, currentColors.tertiary]}
              style={[styles.kathismaInfoCard, { borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
            >
              <Book size={32} color={currentColors.accentGold} />
              <Text style={[styles.kathismaTitle, { color: currentColors.primaryText }]}>{kathismaNumber}. Катизма</Text>
              <Text style={[styles.kathismaRange, { color: currentColors.accentGold }]}>
                {psalms.length > 0 ? `Псалми ${startPsalm}-${endPsalm}` : 'Учитавање...'}
              </Text>
              <Text style={[styles.kathismaDescription, { color: currentColors.secondaryText }]}>
                Изабери псалам који желиш да читаш
              </Text>
            </LinearGradient>
          </View>

          {/* Psalms List */}
          <View style={styles.psalmsContainer}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Псалми у овој катизми</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: currentColors.secondaryText }]}>Учитавање псалама...</Text>
              </View>
            ) : (
              psalms.map((psalm) => (
              <TouchableOpacity 
                key={psalm.id}
                style={[styles.psalmCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
                onPress={() => router.push(`/psalm/${psalm.id}`)}
              >
                <View style={[styles.psalmNumber, { backgroundColor: currentColors.accentGold }]}>
                  <Text style={[styles.psalmNumberText, { color: currentColors.primary }]}>{psalm.id}</Text>
                </View>
                <View style={styles.psalmInfo}>
                  <Text style={[styles.psalmTitle, { color: currentColors.primaryText }]}>
                    Псалам {psalm.id}
                  </Text>
                  <Text style={[styles.psalmSubtitle, { color: currentColors.accentGold }]}>
                    {psalm.subtitle}
                  </Text>
                </View>
                <Text style={[styles.psalmArrow, { color: currentColors.accentGold }]}>›</Text>
              </TouchableOpacity>
              ))
            )}
          </View>

          {/* Reading Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={[styles.instructionsTitle, { color: currentColors.accentGold }]}>Упутство за читање катизме</Text>
            <View style={[styles.instructionsCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
                • Катизма се чита полако и са пажњом
              </Text>
              <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
                • Можете читати све псалме заредом или појединачно
              </Text>
              <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
                • Прекрстите се пре и после читања
              </Text>
              <Text style={[styles.instructionText, { color: currentColors.secondaryText }]}>
                • Размишљајте о значењу речи
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 34,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  kathismaInfo: {
    marginBottom: 25,
  },
  kathismaInfoCard: {
    borderRadius: 15,
    padding: 25,
    borderWidth: 3,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  kathismaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  kathismaRange: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  kathismaDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  psalmsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  psalmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  psalmNumber: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  psalmNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  psalmInfo: {
    flex: 1,
  },
  psalmTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  psalmSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  psalmArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionsSection: {
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
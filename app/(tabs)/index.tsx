import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useDailyPsalm } from '../../src/hooks/useDailyPsalm';
import { ResponsiveTitle } from '../../src/components/ResponsiveTitle';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';

export default function HomeScreen() {
  const router = useRouter();
  const { currentColors, isLightMode } = useTheme();
  const { getFontSize, getSpacing, getPadding, isSmallScreen } = useResponsiveLayout();
  const { psalm: dailyPsalm, loading: psalmLoading, error: psalmError } = useDailyPsalm();
  const [screenError, setScreenError] = useState<string | null>(null);

  // Choose background image based on theme
  const backgroundImage = isLightMode
    ? require('../../assets/images/bela_verzija_ruka.png')
    : require('../../assets/images/covek_ka_bogu.png');

  // Fallback UI component
  const FallbackUI = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <View style={[styles.fallbackContainer, { backgroundColor: currentColors.primary }]}>
      <AlertCircle size={48} color={currentColors.accentGold} />
      <Text style={[styles.fallbackTitle, { color: currentColors.accentGold }]}>
        Дошло је до грешке
      </Text>
      <Text style={[styles.fallbackMessage, { color: currentColors.secondaryText }]}>
        {error}
      </Text>
      <TouchableOpacity
        style={[styles.fallbackButton, { backgroundColor: currentColors.accentGold }]}
        onPress={onRetry}
      >
        <Text style={[styles.fallbackButtonText, { color: currentColors.primary }]}>
          Покушај поново
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Error boundary for this screen
  const handleScreenError = (error: string) => {
    console.error('HomeScreen error:', error);
    setScreenError(error);
  };

  const retryScreen = () => {
    setScreenError(null);
    window.location.reload?.(); // For web, on native this will just reset state
  };

  if (screenError) {
    return <FallbackUI error={screenError} onRetry={retryScreen} />;
  }

  // Handle psalm error with fallback
  if (psalmError && !psalmLoading) {
    return <FallbackUI error="Грешка при учитавању псалма дана" onRetry={retryScreen} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <ImageBackground
        key={isLightMode ? 'light-bg' : 'dark-bg'}
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={[styles.headerTitleContainer, isLightMode && styles.headerTitleContainerLight]}>
              <ResponsiveTitle
                baseFontSize={32}
                minScale={0.6}
                maxScale={1.2}
                color={currentColors.accentGold}
                style={styles.headerTitle}
              >
                ПСАЛТИР
              </ResponsiveTitle>
            </View>
          </View>

          {/* Main Actions */}
          <View style={styles.actionsContainer}>
            {/* Psalm of the Day - Quote Style */}
            <TouchableOpacity 
              style={[styles.psalmOfDayCard, { borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
              onPress={() => {
                if (dailyPsalm) {
                  router.push(`/psalm/${dailyPsalm.id}`);
                }
              }}
              disabled={Boolean(psalmLoading || psalmError || !dailyPsalm)}
            >
              <View style={[styles.psalmOfDayContent, { backgroundColor: currentColors.cardBackground }]}>
                <Text style={[styles.psalmOfDayLabel, { color: currentColors.accentGold }]}>ПСАЛАМ ДАНА</Text>
                {psalmLoading ? (
                  <>
                    <Text style={[styles.psalmOfDayNumber, { color: currentColors.primaryText }]}>Учитавање...</Text>
                    <Text style={[styles.psalmOfDayQuote, { color: currentColors.secondaryText }]}>
                      Одабирамо псалам за данас...
                    </Text>
                  </>
                ) : psalmError ? (
                  <>
                    <Text style={[styles.psalmOfDayNumber, { color: currentColors.primaryText }]}>Грешка</Text>
                    <Text style={[styles.psalmOfDayQuote, { color: currentColors.secondaryText }]}>
                      Није могуће учитати псалам дана
                    </Text>
                  </>
                ) : dailyPsalm ? (
                  <>
                    <Text style={[styles.psalmOfDayNumber, { color: currentColors.primaryText }]}>Псалам {dailyPsalm.id}</Text>
                    <Text style={[styles.psalmOfDayQuote, { color: currentColors.secondaryText }]}>
                      "{dailyPsalm.content[0] || dailyPsalm.title}..."
                    </Text>
                    <Text style={[styles.psalmOfDayAction, { color: currentColors.accentGold }]}>Прочитај цео псалам</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.psalmOfDayNumber, { color: currentColors.primaryText }]}>Псалам дана</Text>
                    <Text style={[styles.psalmOfDayQuote, { color: currentColors.secondaryText }]}>
                      Нема доступних псалама
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: currentColors.borderColor, shadowColor: currentColors.accentGold }]}
              onPress={() => router.push('/psalter')}
            >
              <LinearGradient
                colors={['#D4AF37', '#B8941F', '#5C1A1B']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>📖</Text>
                </View>
                <Text style={styles.actionText}>Отвори Псалтир</Text>
                <Text style={styles.actionSubtext}>150 псалама Давидових</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: currentColors.borderColor, shadowColor: currentColors.accentGold }]}
              onPress={() => router.push('/prayerbook')}
            >
              <LinearGradient
                colors={['#B8941F', '#D4AF37', '#8B2635']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>🙏</Text>
                </View>
                <Text style={styles.actionText}>Отвори Молитвеник</Text>
                <Text style={styles.actionSubtext}>Јутарње и вечерње молитве</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    // ResponsiveTitle komponenta će upravljati fontom
    textAlign: 'center',
    flexShrink: 1,
    width: '100%',
    includeFontPadding: false,
  },
  headerTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerTitleContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
  },
  actionGradient: {
    borderRadius: 13,
    padding: 30,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    letterSpacing: 1,
    textAlign: 'center',
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
    numberOfLines: 2,
  },
  actionSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  psalmOfDayCard: {
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 15,
  },
  psalmOfDayContent: {
    padding: 25,
    borderRadius: 13,
  },
  psalmOfDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 8,
  },
  psalmOfDayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  psalmOfDayQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'left',
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  psalmOfDayAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  fallbackButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  fallbackButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
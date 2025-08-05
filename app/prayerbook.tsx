import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sun, Moon, Heart, Cross, Flame, Shield, BookOpen } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { ResponsiveTitle } from '../src/components/ResponsiveTitle';
import { getAllAkatisti, type Akatist } from '../lib/supabase';

interface PrayerCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  prayers: string[];
}

export default function PrayerbookScreen() {
  const router = useRouter();
  const { currentColors, isLightMode } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = React.useState('prayers');
  const [allAkatisti, setAllAkatisti] = React.useState<Akatist[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Fallback akatisti if database is not available
  const fallbackAkatisti: Akatist[] = [
    {
      id: 1,
      title: 'Акатист Пресветој Богородици',
      subtitle: 'Похвала Пресветој Дјеви Марији',
      content: [],
      category: 'bogorodica'
    },
    {
      id: 2,
      title: 'Акатист Господу Исусу Христу',
      subtitle: 'Преслатком Господу нашем',
      content: [],
      category: 'isus'
    },
    {
      id: 3,
      title: 'Акатист Светој Ксенији Петроградској',
      subtitle: 'Блаженој Ксенији ради Христа јуродивој',
      content: [],
      category: 'ksenia'
    },
    {
      id: 4,
      title: 'Акатист Светом Василију Острошком',
      subtitle: 'Чудотворцу и исцелитељу',
      content: [],
      category: 'vasilije'
    },
    {
      id: 5,
      title: 'Акатист Светом Николају',
      subtitle: 'Чудотворцу и заштитнику',
      content: [],
      category: 'nikolaj'
    }
  ];

  // Load akatist when Akatisti tab is selected
  React.useEffect(() => {
    if (activeTab === 'akatisti') {
      loadAllAkatisti();
    }
  }, [activeTab]);

  const loadAllAkatisti = async () => {
    try {
      setLoading(true);
      const data = await getAllAkatisti(); // Load all akatisti
      // Loaded akatisti from database
      if (data && data.length > 0) {
        setAllAkatisti(data);
      } else {
        // Use fallback data if no data from database
        // No data from database, using fallback
        setAllAkatisti(fallbackAkatisti);
      }
    } catch (error) {
      console.error('Error loading akatisti:', error);
      // Use fallback data on error
              // Error loading from database, using fallback
      setAllAkatisti(fallbackAkatisti);
    } finally {
      setLoading(false);
    }
  };

  const prayerCategories: PrayerCategory[] = [
    {
      id: 'morning',
      title: 'Јутарње молитве',
      subtitle: 'Почетак дана са Богом',
      icon: <Sun size={24} color="#FFFFFF" />,
      color: '#D4AF37',
      prayers: ['Молитва Св. Духу', 'Трисвето', 'Отче наш', 'Верую']
    },
    {
      id: 'evening',
      title: 'Вечерње молитве',
      subtitle: 'Завршетак дана у миру',
      icon: <Moon size={24} color="#FFFFFF" />,
      color: '#5C1A1B',
      prayers: ['Слава Теби Господе', 'Молитва пред спавање', 'Трисвето']
    },
    {
      id: 'illness',
      title: 'У болести',
      subtitle: 'Молитве за исцељење',
      icon: <Heart size={24} color="#FFFFFF" />,
      color: '#8B2635',
      prayers: ['Молитва за болесне']
    },
    {
      id: 'travel',
      title: 'На путовању',
      subtitle: 'Заштита у путу',
      icon: <Shield size={24} color="#FFFFFF" />,
      color: '#2D5AA0',
      prayers: ['Молитва за оне који путују']
    },
    {
      id: 'trinity',
      title: 'Молитва Светој Тројици',
      subtitle: 'Пре читања Псалтира',
      icon: <Cross size={24} color="#FFFFFF" />,
      color: '#8B4513',
      prayers: ['Молитва Светој Тројици пре читања Псалтира']
    },
    {
      id: 'guardian-angel',
      title: 'Молитве Анђелу Чувару',
      subtitle: 'Заштита и вођство',
      icon: <Cross size={24} color="#FFFFFF" />,
      color: '#4B0082',
      prayers: ['Молитва #1', 'Молитва #2', 'Молитва #3']
    },
  ];

  // Use the same background image for both themes
  const backgroundImage = require('../assets/images/molitvenik.png');

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
                      <ResponsiveTitle
              baseFontSize={28}
              minScale={0.6}
              maxScale={1.2}
              color={currentColors.accentGold}
              style={styles.headerTitle}
            >
              МОЛИТВЕНИК
            </ResponsiveTitle>
          <View style={styles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderColor: currentColors.borderColor, backgroundColor: currentColors.accentGold }]}>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('prayers')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'prayers' ? (isLightMode ? '#FFFFFF' : currentColors.primaryText) : currentColors.tertiaryText }]}>
              Молитве
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('akatisti')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'akatisti' ? (isLightMode ? '#FFFFFF' : currentColors.primaryText) : currentColors.tertiaryText }]}>
              Акатисти
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'prayers' ? renderPrayersTab() : renderAkatistiTab()}
        </ScrollView>

      </ImageBackground>
    </View>
  );

  function renderPrayersTab() {
    return (
      <>
        <Text style={[styles.description, { color: isLightMode ? '#FFFFFF' : currentColors.secondaryText }]}>
          Изабери врсту молитве према својој потреби
        </Text>

        <View style={styles.categoriesContainer}>
          {prayerCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[styles.categoryCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
              onPress={() => router.push(`/prayers/${category.id}`)}
            >
              <View style={styles.categoryContent}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {category.icon}
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryTitle, { color: currentColors.primaryText }]}>{category.title}</Text>
                  <Text style={[styles.categorySubtitle, { color: currentColors.secondaryText }]}>{category.subtitle}</Text>
                  <Text style={[styles.prayerCount, { color: currentColors.accentGold }]}>
                    {category.prayers.length} {category.prayers.length === 1 ? 'молитва' : category.prayers.length < 5 ? 'молитве' : 'молитви'}
                  </Text>
                </View>
                <Text style={[styles.categoryArrow, { color: currentColors.accentGold }]}>›</Text>
              </View>
              
              {/* Prayer preview */}
              <View style={styles.prayerPreview}>
                {category.prayers.slice(0, 3).map((prayer, index) => (
                  <View key={index} style={styles.prayerItem}>
                    <Text style={[styles.prayerDot, { color: currentColors.accentGold }]}>•</Text>
                    <Text style={[styles.prayerName, { color: currentColors.tertiaryText }]}>{prayer}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Prayer Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Дневни распоред молитви</Text>
          <View style={[styles.scheduleCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <View style={styles.scheduleItem}>
              <Text style={[
                styles.scheduleTime, 
                { 
                  color: currentColors.accentGold,
                  fontSize: screenWidth < 375 ? 14 : 16,
                  minWidth: screenWidth < 375 ? 45 : 50
                }
              ]}>06:00</Text>
              <Text style={[
                styles.schedulePrayer, 
                { 
                  color: currentColors.secondaryText,
                  fontSize: screenWidth < 375 ? 12 : 14
                }
              ]}>Јутарње молитве</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={[
                styles.scheduleTime, 
                { 
                  color: currentColors.accentGold,
                  fontSize: screenWidth < 375 ? 14 : 16,
                  minWidth: screenWidth < 375 ? 45 : 50
                }
              ]}>12:00</Text>
              <Text style={[
                styles.schedulePrayer, 
                { 
                  color: currentColors.secondaryText,
                  fontSize: screenWidth < 375 ? 12 : 14
                }
              ]}>Подневна молитва</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={[
                styles.scheduleTime, 
                { 
                  color: currentColors.accentGold,
                  fontSize: screenWidth < 375 ? 14 : 16,
                  minWidth: screenWidth < 375 ? 45 : 50
                }
              ]}>18:00</Text>
              <Text style={[
                styles.schedulePrayer, 
                { 
                  color: currentColors.secondaryText,
                  fontSize: screenWidth < 375 ? 12 : 14
                }
              ]}>Вечерње молитве</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={[
                styles.scheduleTime, 
                { 
                  color: currentColors.accentGold,
                  fontSize: screenWidth < 375 ? 14 : 16,
                  minWidth: screenWidth < 375 ? 45 : 50
                }
              ]}>21:00</Text>
              <Text style={[
                styles.schedulePrayer, 
                { 
                  color: currentColors.secondaryText,
                  fontSize: screenWidth < 375 ? 12 : 14
                }
              ]}>Пред спавање</Text>
            </View>
          </View>
        </View>

        {/* Quick Prayers */}
        <View style={styles.quickPrayersSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Кратке молитве</Text>
          <View style={styles.quickPrayersGrid}>
            <TouchableOpacity style={[styles.quickPrayer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              <Text style={[styles.quickPrayerTitle, { color: currentColors.accentGold }]}>Исусова молитва</Text>
              <Text style={[styles.quickPrayerText, { color: currentColors.secondaryText }]}>
                "Господе Исусе Христе, Сине Божји, помилуј ме грешнога"
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickPrayer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              <Text style={[styles.quickPrayerTitle, { color: currentColors.accentGold }]}>Молитва Пресветој Богородици</Text>
              <Text style={[styles.quickPrayerText, { color: currentColors.secondaryText }]}>
                "Пресвета Богородице, спаси нас."
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickPrayer, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              <Text style={[styles.quickPrayerTitle, { color: currentColors.accentGold }]}>Трисвето</Text>
              <Text style={[styles.quickPrayerText, { color: currentColors.secondaryText }]}>
                "Свети Боже, Свети Крепки, Свети Бесмртни, помилуј нас."
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coming Soon Note */}
        <View style={styles.comingSoonSection}>
          <View style={[styles.comingSoonCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.comingSoonTitle, { color: currentColors.accentGold }]}>Ускоро</Text>
            <Text style={[styles.comingSoonText, { color: currentColors.secondaryText }]}>
              Радимо на додавању нових молитви и духовних садржаја. Хвала на стрпљењу!
            </Text>
          </View>
        </View>
      </>
    );
  }

  function renderAkatistiTab() {
    return (
      <>
        <Text style={[styles.description, { color: isLightMode ? '#FFFFFF' : currentColors.secondaryText }]}>
          Изабери акатист за молитву и духовно размишљање
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: currentColors.secondaryText }]}>Учитавање акатиста...</Text>
          </View>
        ) : allAkatisti.length > 0 ? (
          <View style={styles.categoriesContainer}>
            {allAkatisti.map((akatist) => (
              <TouchableOpacity 
                key={akatist.id} 
                style={[styles.akatistCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
                onPress={() => {
                  router.push(`/akatist/${akatist.id}`);
                }}
              >
                {/* Image space - different image for each akatist */}
                <View style={[styles.akatistImageContainer, { backgroundColor: currentColors.tertiary }]}>
                  <Image 
                    source={
                      akatist.id === 1 
                        ? require('../assets/images/bogorodica_2.png')
                        : akatist.id === 2
                        ? require('../assets/images/isus_ikona.png') 
                        : akatist.id === 3
                        ? require('../assets/images/sveta_ksenija_ikona.png') // for Saint Ksenia
                        : akatist.id === 4
                        ? require('../assets/images/sveti_vasilije_ikona.png') // for Saint Vasilije Ostroski
                        : akatist.id === 5
                        ? require('../assets/images/sveti_nikola_ikona.png') // for Saint Nikolaj
                        : require('../assets/images/bogorodica_2.png') // default fallback
                    }
                    style={styles.akatistImage}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Title and arrow */}
                <View style={styles.akatistContent}>
                  <Text style={[styles.akatistTitle, { color: currentColors.primaryText }]}>{akatist.title}</Text>
                  <Text style={[styles.akatistArrow, { color: currentColors.accentGold }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: currentColors.secondaryText }]}>Учитавање акатиста...</Text>
          </View>
        )}

        {/* Coming Soon Note for Akatisti */}
        <View style={styles.comingSoonSection}>
          <View style={[styles.comingSoonCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <Text style={[styles.comingSoonTitle, { color: currentColors.accentGold }]}>Ускоро</Text>
            <Text style={[styles.comingSoonText, { color: currentColors.secondaryText }]}>
              Радимо на додавању више акатиста и функционалности за њихово читање. Хвала на стрпљењу!
            </Text>
          </View>
        </View>
      </>
    );
  }
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
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 34,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  prayerCount: {
    fontSize: 10,
  },
  categoryArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  prayerPreview: {
    paddingLeft: 10,
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prayerDot: {
    marginRight: 8,
    fontSize: 12,
  },
  prayerName: {
    fontSize: 12,
  },
  scheduleSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  scheduleCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 50,
    marginRight: 10,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
    numberOfLines: 1,
  },
  schedulePrayer: {
    fontSize: 14,
    flex: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
    numberOfLines: 1,
  },
  quickPrayersSection: {
    marginBottom: 100,
  },
  quickPrayersGrid: {
    gap: 15,
  },
  quickPrayer: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickPrayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickPrayerText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  comingSoonSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  comingSoonCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  akatistCard: {
    borderRadius: 15,
    padding: 0,
    marginBottom: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  akatistImageContainer: {
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  akatistImage: {
    width: '100%',
    height: '100%',
  },
  akatistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  akatistTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  akatistArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
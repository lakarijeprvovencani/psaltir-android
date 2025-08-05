import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Book, Calendar, Users, Search, X, Filter, AlertCircle } from 'lucide-react-native';
import { getKathismas, searchPsalms, type Kathisma, type Psalm } from '../lib/supabase';
import { useTheme } from '../src/contexts/ThemeContext';
import { ResponsiveTitle } from '../src/components/ResponsiveTitle';

export default function PsalterScreen() {
  const router = useRouter();
  const { currentColors, isLightMode } = useTheme();
  const [activeTab, setActiveTab] = useState('kathisma');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [kathismas, setKathismas] = useState<Kathisma[]>([]);
  const [searchResults, setSearchResults] = useState<Psalm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load kathismas on component mount
  React.useEffect(() => {
    loadKathismas();

    // Cleanup funkcija za memory management
    return () => {
      // Clear state kada se komponenta unmount-uje
      setSearchResults([]);
      setSearchQuery('');
      setKathismas([]);
      setLoading(false);
      setError(null);
    };
  }, []);

  // Handle search
  React.useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadKathismas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKathismas();
      if (data.length === 0) {
        setError('Нема доступних катисми');
      } else {
        setKathismas(data);
      }
    } catch (error) {
      console.error('Error loading kathismas:', error);
      setError('Грешка при учитавању катисми');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchPsalms(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching psalms:', error);
      setError('Грешка при претрази псалама');
    }
  };

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

  const retryLoad = () => {
    setError(null);
    loadKathismas();
  };

  if (error && !loading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <ResponsiveTitle
            baseFontSize={20}
            minScale={0.7}
            maxScale={1.1}
            color={currentColors.accentGold}
            style={styles.headerTitle}
          >
            Псалтир
          </ResponsiveTitle>
        </View>
        <FallbackUI error={error} onRetry={retryLoad} />
      </View>
    );
  }

  // Filter kathismas based on search
  const filteredKathisma = kathismas.filter(kathisma => {
    if (!searchQuery) return true;
    
    // Search by kathisma number
    if (kathisma.id.toString().includes(searchQuery)) return true;
    
    // Search by psalm number
    const psalmNumber = parseInt(searchQuery);
    if (!isNaN(psalmNumber)) {
      return kathisma.psalm_numbers.includes(psalmNumber);
    }
    
    // Search by title
    return kathisma.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const getHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    return text;
  };

  const renderSearchBar = (colors: any) => (
    <View style={[styles.searchContainer, { backgroundColor: colors.secondary, borderBottomColor: colors.tertiary }]}>
      <View style={[styles.searchInputContainer, { backgroundColor: colors.primary, borderColor: colors.borderColor, shadowColor: colors.shadowColor }]}>
        <Search size={18} color={colors.tertiaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.primaryText }]}
          placeholder="Претражи катизме или псалме (нпр. 23, пастир)..."
          placeholderTextColor={colors.tertiaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={18} color={colors.tertiaryText} />
          </TouchableOpacity>
        )}
      </View>
      {searchQuery && (
        <Text style={[styles.searchResultsText, { color: colors.accentGold }]}>
          {activeTab === 'kathisma' 
            ? `Пронађено ${filteredKathisma.length} катисми` 
            : `Пронађено ${searchResults.length} псалама`
          }
        </Text>
      )}
    </View>
  );

  const renderKathismaTab = (colors: any) => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.tabDescription, { color: colors.secondaryText }]}>
        Псалтир је подељен у 20 катизми за недељно читање
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Учитавање катисми...</Text>
        </View>
      ) : (
        filteredKathisma.map((kathisma) => (
        <TouchableOpacity 
          key={kathisma.id} 
          style={[styles.kathismaCard, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor, shadowColor: colors.shadowColor }]}
          onPress={() => router.push(`/kathisma/${kathisma.id}`)}
        >
          <View style={[styles.kathismaNumber, { backgroundColor: colors.accentGold }]}>
            <Text style={[styles.kathismaNumberText, { color: colors.primary }]}>{kathisma.id}</Text>
          </View>
          <View style={styles.kathismaInfo}>
            <Text style={[styles.kathismaTitle, { color: colors.primaryText }]}>{kathisma.title}</Text>
            <Text style={[styles.kathismaPsalms, { color: colors.accentGold }]}>{kathisma.psalms_range}</Text>
            <Text style={[styles.kathismaDescription, { color: colors.tertiaryText }]}>{kathisma.description}</Text>
          </View>
          <View style={styles.kathismaArrowContainer}>
            <Text style={[styles.kathismaArrow, { color: colors.accentGold }]}>›</Text>
          </View>
        </TouchableOpacity>
      )))}
      
      {searchQuery && filteredKathisma.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, { color: colors.secondaryText }]}>
            Нема резултата за "{searchQuery}"
          </Text>
          <Text style={[styles.noResultsSubtext, { color: colors.tertiaryText }]}>Покушајте са другим бројем или називом</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderScheduleTab = (colors: any) => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.tabDescription, { color: colors.secondaryText }]}>
        Када се који псалам чита у богослужбеном контексту
      </Text>
      <View style={[styles.scheduleSection, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor, shadowColor: colors.shadowColor }]}>
        <Text style={[styles.scheduleTitle, { color: colors.accentGold }]}>Јутарња служба</Text>
        <TouchableOpacity onPress={() => router.push('/psalm/3')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 3 - На јутрење</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/51')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 51 - Помилуј ме Боже</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/63')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 63 - Боже мој, к Теби раним</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.scheduleSection, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor, shadowColor: colors.shadowColor }]}>
        <Text style={[styles.scheduleTitle, { color: colors.accentGold }]}>Вечерња служба</Text>
        <TouchableOpacity onPress={() => router.push('/psalm/104')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 104 - Благослови душо моја</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/141')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 141 - Господе возвах</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/30')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Псалм 30 - На Теби Господе упования</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.scheduleSection, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor, shadowColor: colors.shadowColor }]}>
        <Text style={[styles.scheduleTitle, { color: colors.accentGold }]}>Празници</Text>
        <TouchableOpacity onPress={() => router.push('/psalm/110')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Божић - Псалм 110</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/29')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Богојављење - Псалм 29</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/psalm/118')}>
          <Text style={[styles.scheduleItem, { color: colors.secondaryText }]}>• Васкрс - Псалм 118</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSaintsTab = (colors: any) => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.tabDescription, { color: colors.secondaryText }]}>
        Учења светих отаца о духовном значају псалама
      </Text>

      {/* Featured Saint */}
      <View style={styles.featuredSaintContainer}>
        <LinearGradient
          colors={['#D4AF37', '#B8941F', '#812430']}
          style={styles.featuredSaintCard}
        >
          <View style={styles.featuredSaintIcon}>
            <Text style={styles.featuredSaintIconText}>☦</Text>
          </View>
          <Text style={styles.featuredSaintName}>Свети Јован Златоусти</Text>
          <Text style={styles.featuredSaintTitle}>Архиепископ цариградски</Text>
          <Text style={styles.featuredSaintQuote}>
            "Псалми су храна души, покриће тела, лек за болне, утеха за жалосне, 
            радост за здраве. Они изгоне демоне и призивају анђеле."
          </Text>
        </LinearGradient>
      </View>

      {/* Saints List */}
      {/* Свети Василије Велики */}
      <View style={styles.saintGradientContainer}>
        <LinearGradient
          colors={['#D4AF37', '#B8941F', '#812430']}
          style={styles.saintGradientCard}
        >
          <View style={styles.saintGradientIcon}>
            <Text style={styles.saintGradientIconText}>☦</Text>
          </View>
          <Text style={styles.saintGradientName}>Свети Василије Велики</Text>
          <Text style={styles.saintGradientTitle}>Архиепископ кесаријски</Text>
          <Text style={styles.saintGradientQuote}>
            "Псалам је мир душе, уредитељ спокојства, он утишава таласе мисли и умирује бурне страсти. Псалам ствара пријатељства, мири непријатеље, помирује оне који су у завади. Ко може сматрати непријатељем оног са којим је заједно узнео један глас Богу?"
          </Text>
        </LinearGradient>
      </View>

      {/* Свети Јован Дамаскин */}
      <View style={styles.saintGradientContainer}>
        <LinearGradient
          colors={['#B8941F', '#D4AF37', '#812430']}
          style={styles.saintGradientCard}
        >
          <View style={styles.saintGradientIcon}>
            <Text style={styles.saintGradientIconText}>☦</Text>
          </View>
          <Text style={styles.saintGradientName}>Свети Јован Дамаскин</Text>
          <Text style={styles.saintGradientTitle}>Монах и богослов</Text>
          <Text style={styles.saintGradientQuote}>
            "Кроз псалме учимо како да се молимо, како да хвалимо Бога у свим приликама живота. Псалми су школа молитве, у њима налазимо речи за сваку прилику - за радост и жалост, за захвалност и покајање, за прославу и молбу."
          </Text>
        </LinearGradient>
      </View>

      {/* Свети Атанасије Велики */}
      <View style={styles.saintGradientContainer}>
        <LinearGradient
          colors={['#D4AF37', '#B8941F', '#5C1A1B']}
          style={styles.saintGradientCard}
        >
          <View style={styles.saintGradientIcon}>
            <Text style={styles.saintGradientIconText}>☦</Text>
          </View>
          <Text style={styles.saintGradientName}>Свети Атанасије Велики</Text>
          <Text style={styles.saintGradientTitle}>Архиепископ александријски</Text>
          <Text style={styles.saintGradientQuote}>
            "Псалми су огледало душе, у њима свако може да нађе своје стање и осећања. Као што се лице огледа у води, тако се душа огледа у псалмима. У њима налазимо лек за сваку болест душе и храну за духовни раст."
          </Text>
        </LinearGradient>
      </View>

      {/* Свети Григорије Богослов */}
      <View style={styles.saintGradientContainer}>
        <LinearGradient
          colors={['#B8941F', '#D4AF37', '#5C1A1B']}
          style={styles.saintGradientCard}
        >
          <View style={styles.saintGradientIcon}>
            <Text style={styles.saintGradientIconText}>☦</Text>
          </View>
          <Text style={styles.saintGradientName}>Свети Григорије Богослов</Text>
          <Text style={styles.saintGradientTitle}>Архиепископ цариградски</Text>
          <Text style={styles.saintGradientQuote}>
            "У псалмима је сва филозофија, сва историја, сва пророчанства. Они садрже и етику и физику и богословље. Псалми су универзална књига која говори свим људима у свим временима и свим приликама."
          </Text>
        </LinearGradient>
      </View>

      {/* Свети Јустин Ћелијски */}
      <View style={styles.saintGradientContainer}>
        <LinearGradient
          colors={['#D4AF37', '#B8941F', '#8B2635']}
          style={styles.saintGradientCard}
        >
          <View style={styles.saintGradientIcon}>
            <Text style={styles.saintGradientIconText}>☦</Text>
          </View>
          <Text style={styles.saintGradientName}>Свети Јустин Ћелијски</Text>
          <Text style={styles.saintGradientTitle}>Архимандрит и богослов</Text>
          <Text style={styles.saintGradientQuote}>
            "Псалми су молитвеник Цркве, у њима је сва мудрост богопознања. Они су лествица која води од земље до неба, од човека до Бога. Кроз псалме душа учи да говори са Богом језиком љубави и истине."
          </Text>
        </LinearGradient>
      </View>

    </ScrollView>
  );

  // Choose background image based on theme
  const backgroundImage = isLightMode 
    ? require('../assets/images/svetla_pozadina_psaltir.png')
    : require('../assets/images/tamna_pozadina_psaltir.png');

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
              ПСАЛТИР
            </ResponsiveTitle>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => {
              setShowSearchBar(!showSearchBar);
            }}
          >
            <Search size={24} color={showSearchBar ? currentColors.accentGold : (isLightMode ? currentColors.tertiaryText : '#FFFFFF')} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderColor: currentColors.borderColor, backgroundColor: currentColors.accentGold }]}>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('kathisma')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'kathisma' ? (isLightMode ? '#FFFFFF' : currentColors.primaryText) : currentColors.tertiaryText }]}>
              Катизме
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('schedule')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'schedule' ? (isLightMode ? '#FFFFFF' : currentColors.primaryText) : currentColors.tertiaryText }]}>
              Распоред
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('saints')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'saints' ? (isLightMode ? '#FFFFFF' : currentColors.primaryText) : currentColors.tertiaryText }]}>
              Светитељи
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {showSearchBar && renderSearchBar(currentColors)}

        {/* Tab Content */}
        {activeTab === 'kathisma' && renderKathismaTab(currentColors)}
        {activeTab === 'schedule' && renderScheduleTab(currentColors)}
        {activeTab === 'saints' && renderSaintsTab(currentColors)}
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
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchButton: {
    width: 34,
    alignItems: 'center',
    padding: 5,
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
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  kathismaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  kathismaNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  kathismaNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  kathismaInfo: {
    flex: 1,
  },
  kathismaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  kathismaPsalms: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  kathismaDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  kathismaArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  kathismaArrowContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scheduleItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  saintCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: '#812430',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saintHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  saintBasicInfo: {
    flex: 1,
  },
  saintName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: 4,
  },
  saintTitle: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  saintFullQuote: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 15,
    fontStyle: 'italic',
    textAlign: 'justify',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  saintAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  saintAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C0C0C',
  },
  saintMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  saintReference: {
    fontSize: 12,
    color: '#888',
  },
  saintPsalms: {
    fontSize: 10,
    color: '#D4AF37',
    fontWeight: '500',
  },
  featuredSaintQuote: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 0,
    fontStyle: 'italic',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchResultsText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  psalmsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  psalmButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
  },
  psalmButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  featuredSaintContainer: {
    marginBottom: 25,
  },
  featuredSaintCard: {
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredSaintIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  featuredSaintIconText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  featuredSaintName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  featuredSaintTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  featuredSaintButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  featuredSaintButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  saintGradientContainer: {
    marginBottom: 25,
  },
  saintGradientCard: {
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  saintGradientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  saintGradientIconText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  saintGradientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  saintGradientTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  saintGradientQuote: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
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
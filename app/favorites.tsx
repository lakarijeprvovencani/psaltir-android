import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Book, Users, Cross } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import { useFavorites, FavoriteItem } from '../src/contexts/FavoritesContext';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

export default function FavoritesScreen() {
  const router = useRouter();
  const { currentColors } = useTheme();
  const { favorites, removeFromFavorites, getFavoritesByType } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | 'psalm' | 'prayer' | 'kathisma'>('all');

  const getFilteredFavorites = () => {
    if (activeTab === 'all') return favorites;
    return getFavoritesByType(activeTab);
  };

  const getTabIcon = (tab: string) => {
    const iconSize = isSmallScreen ? 16 : 18;
    switch (tab) {
      case 'psalm': return <Book size={iconSize} color={activeTab === tab ? currentColors.primaryText : currentColors.tertiaryText} />;
      case 'prayer': return <Cross size={iconSize} color={activeTab === tab ? currentColors.primaryText : currentColors.tertiaryText} />;
      case 'kathisma': return <Users size={iconSize} color={activeTab === tab ? currentColors.primaryText : currentColors.tertiaryText} />;
      default: return <Heart size={iconSize} color={activeTab === tab ? currentColors.primaryText : currentColors.tertiaryText} />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'psalm': return 'Псалми';
      case 'prayer': return 'Молитве';
      case 'kathisma': return 'Катизме';
      default: return 'Све';
    }
  };

  const getTypeLabel = (type: FavoriteItem['type']) => {
    switch (type) {
      case 'psalm': return 'Псалам';
      case 'prayer': return 'Молитва';
      case 'kathisma': return 'Катизма';
      default: return '';
    }
  };

  const handleItemPress = (item: FavoriteItem) => {
    router.push(item.route as any);
  };

  const handleRemoveFromFavorites = async (id: string) => {
    await removeFromFavorites(id);
  };

  const filteredFavorites = getFilteredFavorites();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.accentGold} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ОМИЉЕНО</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderColor: currentColors.borderColor }]}>
        {['all', 'psalm', 'prayer', 'kathisma'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: currentColors.tertiary }
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            {getTabIcon(tab)}
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? currentColors.primaryText : currentColors.tertiaryText }
            ]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={[currentColors.cardBackground, currentColors.tertiary]}
              style={[styles.emptyCard, { borderColor: currentColors.borderColor }]}
            >
              <Heart size={48} color={currentColors.tertiaryText} />
              <Text style={[styles.emptyTitle, { color: currentColors.primaryText }]}>
                {activeTab === 'all' ? 'Нема омиљених ставки' : `Нема омиљених ${getTabLabel(activeTab).toLowerCase()}`}
              </Text>
              <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
                Додајте псалме и молитве у омиљене кликом на срце иконицу
              </Text>
            </LinearGradient>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>
              {filteredFavorites.length} {activeTab === 'all' ? 'омиљених ставки' : `омиљених ${getTabLabel(activeTab).toLowerCase()}`}
            </Text>
            
            {filteredFavorites.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={[styles.favoriteCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.favoriteContent}>
                  <View style={styles.favoriteInfo}>
                    <Text style={[styles.favoriteType, { color: currentColors.accentGold }]}>
                      {getTypeLabel(item.type)}
                    </Text>
                    <Text style={[styles.favoriteTitle, { color: currentColors.primaryText }]}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={[styles.favoriteSubtitle, { color: currentColors.secondaryText }]}>
                        {item.subtitle}
                      </Text>
                    )}
                    <Text style={[styles.favoriteDate, { color: currentColors.tertiaryText }]}>
                      Додато: {new Date(item.addedAt).toLocaleDateString('sr-RS')}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveFromFavorites(item.id)}
                  >
                    <Heart size={20} color={currentColors.accentGold} fill={currentColors.accentGold} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
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
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 4 : 6,
    borderRadius: 8,
    gap: isSmallScreen ? 3 : 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  favoriteCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteType: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteSubtitle: {
    fontSize: 12,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  favoriteDate: {
    fontSize: 10,
  },
  removeButton: {
    padding: 8,
  },
});
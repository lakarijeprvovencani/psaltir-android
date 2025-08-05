import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Baby, Smartphone, Copy, ExternalLink, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { submitDonation } from '../lib/supabase';

export default function SupportScreen() {
  const router = useRouter();
  const { currentColors } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'babies' | 'app'>('babies');
  const [hasDonated, setHasDonated] = React.useState(false);
  const [donationAmount, setDonationAmount] = React.useState('');
  const [selectedCurrency, setSelectedCurrency] = React.useState<'RSD' | 'EUR'>('RSD');
  const [donationSubmitted, setDonationSubmitted] = React.useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Копирано', `${label} је копиран у clipboard`);
    } catch (error) {
      Alert.alert('Грешка', 'Није могуће копирати текст');
    }
  };

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Грешка', 'Није могуће отворити линк');
      }
    } catch (error) {
      Alert.alert('Грешка', 'Није могуће отворити линк');
    }
  };

  const handleDonationSubmit = async () => {
    if (!donationAmount || !donationAmount.trim()) return;
    
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Грешка', 'Унесите валидан износ');
      return;
    }
    
    try {
      // Submitting donation from UI
      const success = await submitDonation(amount, selectedCurrency);
      if (success) {
        setDonationSubmitted(true);
        // Reset after 5 seconds
        setTimeout(() => {
          setDonationSubmitted(false);
          setHasDonated(false);
          setDonationAmount('');
          setSelectedCurrency('RSD');
        }, 5000);
        // Donation submitted successfully
      } else {
        Alert.alert('Грешка', 'Донација није успешно послата. Проверите интернет везу и покушајте поново.');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      Alert.alert('Грешка', 'Дошло је до грешке при слању донације. Покушајте поново.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.accentGold} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ЗАХВАЛНОСТ И ПОДРШКА</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderColor: currentColors.borderColor }]}>
        {/* TEMPORARILY HIDDEN - UNCOMMENT WHEN BABY DONATION DATA IS READY
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'babies' && { backgroundColor: currentColors.tertiary }
          ]}
          onPress={() => setActiveTab('babies')}
        >
          <Baby size={18} color={activeTab === 'babies' ? currentColors.primaryText : currentColors.tertiaryText} />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'babies' ? currentColors.primaryText : currentColors.tertiaryText }
          ]}>
            Донације за бебе
          </Text>
        </TouchableOpacity>
        */}

        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'app' && { backgroundColor: currentColors.tertiary }
          ]}
          onPress={() => setActiveTab('app')}
        >
          <Smartphone size={18} color={activeTab === 'app' ? currentColors.primaryText : currentColors.tertiaryText} />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'app' ? currentColors.primaryText : currentColors.tertiaryText }
          ]}>
            Подржи развој
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Always show app tab since babies tab is temporarily hidden */}
        {renderAppTab()}
      </ScrollView>
    </View>
  );

  function renderBabiesTab() {
    return (
      <>
        {/* Introduction */}
        <View style={[styles.introCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <View style={styles.introIcon}>
            <Text style={styles.introIconText}>👶</Text>
          </View>
          <Text style={[styles.introTitle, { color: currentColors.accentGold }]}>Донације за превремено рођене бебе</Text>
          <Text style={[styles.introText, { color: currentColors.secondaryText }]}>
            Помозимо онима који живот почињу борбом. Сва средства из ове категорије иду директно за потребе Одељења неонатологије.
          </Text>
        </View>

        {/* Premature Babies Donations */}
        <View style={[styles.donationCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={['#FF6B9D', '#C44569']}
            style={styles.donationHeader}
          >
            <Baby size={32} color="#FFFFFF" />
            <Text style={styles.donationHeaderTitle}>Рачун за донације</Text>
          </LinearGradient>
          
          <View style={styles.donationContent}>
            <View style={styles.accountDetails}>
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>🏥 Назив рачуна:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('Клиника за неонатологију', 'Назив рачуна')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>Клиника за неонатологију</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>💳 Број рачуна:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('xxx-xxx-xx', 'Број рачуна')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>xxx-xxx-xx</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>📄 Прималац:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('Уплате за помоћ превремено рођеним бебама', 'Прималац')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>Уплате за помоћ превремено рођеним бебама</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={[styles.proofNote, { color: currentColors.tertiaryText }]}>
              (Овде можеш касније додати доказ као слику или PDF и поставити линк ка њему.)
            </Text>
          </View>
        </View>

        {/* Donation Tracking */}
        {donationSubmitted ? (
          <View style={[styles.thankYouCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.accentGold, shadowColor: currentColors.shadowColor }]}>
            <LinearGradient
              colors={[currentColors.accentGold, currentColors.accentGoldDark]}
              style={styles.thankYouHeader}
            >
              <Text style={styles.thankYouIcon}>🙏</Text>
              <Text style={styles.thankYouTitle}>Хвала на донацији!</Text>
            </LinearGradient>
            
            <View style={styles.thankYouContent}>
              <Text style={[styles.thankYouText, { color: currentColors.secondaryText }]}>
                Ваша донација је забележена у нашој статистици.
              </Text>
              <Text style={[styles.thankYouBlessing, { color: currentColors.accentGold }]}>
                Нека Вас Господ благослови за добро дело!
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.donationTrackingCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setHasDonated(!hasDonated)}
            >
              <View style={[styles.checkbox, { borderColor: currentColors.accentGold }, hasDonated && { backgroundColor: currentColors.accentGold }]}>
                {hasDonated && <Check size={16} color={currentColors.primary} />}
              </View>
              <Text style={[styles.checkboxText, { color: currentColors.primaryText }]}>
                Већ сам донирао/ла
              </Text>
            </TouchableOpacity>

            {hasDonated && (
              <View style={styles.donationInputSection}>
                <Text style={[styles.inputLabel, { color: currentColors.tertiaryText }]}>
                  Ово није део где уплаћујете, већ само за статистику ако сте већ донирали
                </Text>
                
                <View style={styles.amountInputContainer}>
                  <TextInput
                    style={[styles.amountInput, { backgroundColor: currentColors.primary, color: currentColors.primaryText, borderColor: currentColors.tertiary }]}
                    placeholder="Унесите износ..."
                    placeholderTextColor={currentColors.tertiaryText}
                    value={donationAmount}
                    onChangeText={setDonationAmount}
                    keyboardType="numeric"
                  />
                  
                  <View style={styles.currencyTabs}>
                    <TouchableOpacity 
                      style={[
                        styles.currencyTab,
                        { backgroundColor: selectedCurrency === 'RSD' ? currentColors.accentGold : currentColors.tertiary }
                      ]}
                      onPress={() => setSelectedCurrency('RSD')}
                    >
                      <Text style={[
                        styles.currencyTabText,
                        { color: selectedCurrency === 'RSD' ? currentColors.primary : currentColors.secondaryText }
                      ]}>
                        RSD
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.currencyTab,
                        { backgroundColor: selectedCurrency === 'EUR' ? currentColors.accentGold : currentColors.tertiary }
                      ]}
                      onPress={() => setSelectedCurrency('EUR')}
                    >
                      <Text style={[
                        styles.currencyTabText,
                        { color: selectedCurrency === 'EUR' ? currentColors.primary : currentColors.secondaryText }
                      ]}>
                        EUR
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {donationAmount && donationAmount.trim() && (
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: currentColors.accentGold }]}
                    onPress={handleDonationSubmit}
                  >
                    <Text style={[styles.confirmButtonText, { color: currentColors.primary }]}>
                      Потврди донацију
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
        {/* Final Message */}
        <View style={[styles.finalCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={[currentColors.accentGold, currentColors.accentGoldDark]}
            style={styles.finalHeader}
          >
            <Text style={styles.finalIcon}>🙏</Text>
            <Text style={styles.finalTitle}>Захвалност</Text>
          </LinearGradient>
          
          <View style={styles.finalContent}>
            <Text style={[styles.finalText, { color: currentColors.secondaryText }]}>
              Хвала свакоме ко одвоји време, молитву или прилог за помоћ најмањима.
            </Text>
            <Text style={[styles.finalBlessing, { color: currentColors.accentGold }]}>
              Нека Вас Господ благослови за сваку добру намеру и дело.
            </Text>
          </View>
        </View>
      </>
    );
  }

  function renderAppTab() {
    return (
      <>
        {/* Introduction */}
        <View style={[styles.introCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <View style={styles.introIcon}>
            <Text style={styles.introIconText}>📱</Text>
          </View>
          <Text style={[styles.introTitle, { color: currentColors.accentGold }]}>Подржи развој апликације</Text>
          <Text style={[styles.introText, { color: currentColors.secondaryText }]}>
            Апликација је у потпуности бесплатна за све кориснике.
            Уколико желите, можете дати добровољан допринос како бисмо наставили да је унапређујемо и додајемо нове могућности.
          </Text>
        </View>

        {/* App Development Donations */}
        <View style={[styles.donationCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={['#D4AF37', '#B8941F']}
            style={styles.donationHeader}
          >
            <Smartphone size={32} color="#FFFFFF" />
            <Text style={styles.donationHeaderTitle}>Рачун за донације</Text>
          </LinearGradient>
          
          <View style={styles.donationContent}>
            <View style={styles.accountDetails}>
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>👤 Прималац:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('Немања Лакић (аутор апликације)', 'Прималац')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>Немања Лакић</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>💳 Број рачуна:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('115-0381637250770-31', 'Број рачуна')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>115-0381637250770-31</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>📍 Место:</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard('Инђија', 'Место')}
                >
                  <Text style={[styles.accountValue, { color: currentColors.primaryText }]}>Инђија</Text>
                  <Copy size={16} color={currentColors.accentGold} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.accountItem}>
                <Text style={[styles.accountLabel, { color: currentColors.tertiaryText }]}>💳 PayPal:</Text>
                <TouchableOpacity 
                  style={styles.paypalButton}
                  onPress={() => openLink('https://paypal.me/nemanjalakic')}
                >
                  <LinearGradient
                    colors={['#0070ba', '#003087']}
                    style={styles.paypalGradient}
                  >
                    <Text style={styles.paypalText}>Донирај преко PayPal-а</Text>
                    <ExternalLink size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Voluntary Notice */}
        <View style={[styles.voluntaryCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <View style={styles.voluntaryContent}>
            <Text style={[styles.voluntaryText, { color: currentColors.secondaryText }]}>
              Све донације су потпуно добровољне и служе искључиво за подршку развоју апликације.
            </Text>
          </View>
        </View>

        {/* Final Message */}
        <View style={[styles.finalCard, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
          <LinearGradient
            colors={[currentColors.accentGold, currentColors.accentGoldDark]}
            style={styles.finalHeader}
          >
            <Text style={styles.finalIcon}>💻</Text>
            <Text style={styles.finalTitle}>Захвалност</Text>
          </LinearGradient>
          
          <View style={styles.finalContent}>
            <Text style={[styles.finalText, { color: currentColors.secondaryText }]}>
              Хвала свакоме ко подржава развој ове апликације и помаже да она постане још боља.
            </Text>
            <Text style={[styles.finalBlessing, { color: currentColors.accentGold }]}>
              Нека Вас Господ благослови за сваку добру намеру и дело.
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
  introCard: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  introIcon: {
    marginBottom: 15,
  },
  introIconText: {
    fontSize: 40,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    marginVertical: 25,
    marginHorizontal: 40,
  },
  donationCard: {
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  donationHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  donationContent: {
    padding: 20,
  },
  donationDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    fontWeight: '500',
  },
  donationSubtext: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  accountDetails: {
    marginBottom: 15,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  accountItem: {
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  proofNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
  finalCard: {
    borderRadius: 15,
    marginBottom: 100,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  finalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  finalIcon: {
    fontSize: 24,
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  finalContent: {
    padding: 20,
  },
  finalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  finalBlessing: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  paypalButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  paypalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  paypalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  donationTrackingCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '500',
  },
  donationInputSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.3)',
  },
  inputLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 18,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountInput: {
    flex: 0.6,
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  currencyTabs: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    flex: 0.4,
  },
  currencyTab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  thankYouCard: {
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  thankYouHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    gap: 15,
    justifyContent: 'center',
  },
  thankYouIcon: {
    fontSize: 32,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  thankYouContent: {
    padding: 25,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  thankYouBlessing: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  debugInfo: {
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  voluntaryCard: {
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  voluntaryContent: {
    padding: 20,
    alignItems: 'center',
  },
  voluntaryText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
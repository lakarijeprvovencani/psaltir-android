import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function TermsScreen() {
  const router = useRouter();
  const { isLightMode, currentColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
      <StatusBar
        style={isLightMode ? "dark" : "light"}
        backgroundColor={isLightMode ? "#FFFFFF" : "#0C0C0C"}
      />

      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: currentColors.primary, borderBottomColor: currentColors.borderColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.accentGold} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>УСЛОВИ КОРИШЋЕЊА</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.content, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }]}>

          <View style={styles.section}>
            <Text style={[styles.dateText, { color: currentColors.tertiaryText }]}>Последње ажурирање: 31.07.2025.</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Коришћењем апликације „Псалтир" прихватате следеће услове коришћења.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>1. Прихватање услова</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Коришћењем ове апликације прихватате да ћете се придржавати ових услова коришћења. Ако се не слажете са овим условима, немојте користити апликацију.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>2. Опис услуге</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Апликација „Псалтир" пружа приступ православним духовним текстовима, укључујући псалме, молитве и акатисте. Сви садржаји су јавно доступни и преузети са званичних извора.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>3. Коришћење апликације</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Апликација је намењена личној, некомерцијалној употреби. Забрањено је:
            </Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Комерцијално коришћење садржаја</Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Модификација или репродукција садржаја</Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Коришћење у сврхе које нису духовне</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>4. Интелектуално власништво</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Сви духовни текстови су јавно власништво и припадају православној традицији. Апликација и њен дизајн су заштићени ауторским правима.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>5. Ограничење одговорности</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Апликација се пружа „каква јесте" без гаранција. Не сносимо одговорност за било какве штете настале коришћењем апликације.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>6. Промене услова</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Задржавамо право да променимо ове услове у било ком тренутку. О променама ћемо вас обавестити кроз апликацију.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>7. Контакт</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Ако имате питања о овим условима, контактирајте нас на: <Text style={[styles.contactEmail, { color: currentColors.accentGold }]}>lakicn@icloud.com</Text>
            </Text>
          </View>

          <View style={[styles.footer, { borderTopColor: currentColors.borderColor }]}>
            <Text style={[styles.footerText, { color: currentColors.secondaryText }]}>Последње ажурирање: 31.07.2025.</Text>
            <Text style={[styles.footerText, { color: currentColors.secondaryText }]}>© 2025 Псалтир апликација</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button width
  },
  headerSpacer: {
    width: 40, // Same as back button area
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  content: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 15,
    marginBottom: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  contactEmail: {
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
});
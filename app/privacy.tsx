import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function PrivacyScreen() {
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
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>ПОЛИТИКА ПРИВАТНОСТИ</Text>
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
              Добро пожаловали у апликацију „Псалтир". Ова политика приватности објашњава како прикупљамо, користимо и чувамо ваше информације.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Информације које прикупљамо</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Наша апликација не прикупља личне податке корисника. Сви садржаји се чувају локално на вашем уређају. Једини подаци који се могу чувати су:
            </Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Ваша омиљена молитве и псалми (локално на уређају)</Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Подсетници за молитве (локално на уређају)</Text>
            <Text style={[styles.bulletPoint, { color: currentColors.secondaryText }]}>• Духовни дневник (локално на уређају)</Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Како користимо информације</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Сви подаци се чувају искључиво на вашем уређају и не се шаљу на наше сервере. Апликација ради без интернета и не прикупља никакве личне информације.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Дељење информација</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Не делимо ваше информације са трећим странама јер не прикупљамо никакве личне податке.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Безбедност</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Сви подаци се чувају локално на вашем уређају користећи стандардне iOS и Android механизме за чување података.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Ваша права</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Пошто не прикупљамо личне податке, нема података за брисање или измену. Можете обрисати све податке деинсталирањем апликације.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Промене политике</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Ове политике можемо изменити у будућности. О променама ћемо вас обавестити кроз апликацију.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentColors.accentGold }]}>Контакт</Text>
            <Text style={[styles.sectionText, { color: currentColors.secondaryText }]}>
              Ако имате питања о овој политици приватности, контактирајте нас на: <Text style={[styles.contactEmail, { color: currentColors.accentGold }]}>lakicn@icloud.com</Text>
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
  highlightBox: {
    borderLeftWidth: 4,
    padding: 15,
    marginVertical: 15,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 15,
    lineHeight: 22,
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
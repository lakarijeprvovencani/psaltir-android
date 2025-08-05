import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';

export default function About() {
  const { currentColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.tabBackground }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={currentColors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.primaryText }]}>
          О нама
        </Text>
      </View>



      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.tabContent}>
          <Text style={[styles.aboutText, { color: currentColors.secondaryText }]}>
            Апликација „Псалтир" настала је из искрене жеље да свако, у сваком тренутку, може имати молитвеник крај себе. Сви текстови у апликацији преузети су са јавно доступних извора, без икакве финансијске користи за аутора. Циљ је искључиво духовна подршка и могућност да вера, утеха и молитва буду доступни свима, било где и било када.
          </Text>
          
          <Text style={[styles.aboutText, { color: currentColors.secondaryText, marginTop: 16 }]}>
            Свеки текст је пажљиво одабран и форматиран како би пружио аутентично искуство молитве и читања светих текстова. Апликација поштује православну традицију и служи као дигитални водич кроз богато наслеђе наше вере.
          </Text>
          
          <Text style={[styles.aboutText, { color: currentColors.secondaryText, marginTop: 16 }]}>
            Нека вам ова апликација буде верни пратилац на духовном путу и извор утехе у свим тренуцима живота.
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },

  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
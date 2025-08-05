import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Share2, Sun, Bookmark, Moon, Cross, Shield, Users, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useFavorites } from '../../src/contexts/FavoritesContext';

interface Prayer {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  note?: string;
}

const prayersData: { [key: string]: { title: string; prayers: Prayer[] } } = {
  'morning': {
    title: 'Јутарње молитве',
    prayers: [
      {
        id: 'holy-spirit',
        title: 'Молитва Светоме Духу',
        subtitle: 'Почетак сваке молитве',
        content: [
          'Царе Небески, Утешитељу, Душе Истине,',
          'Који си свуда и све испуњаваш,',
          'Ризнице добара и Даваоче живота,',
          'дођи и усели се у нас,',
          'и очисти нас од сваке нечистоте,',
          'и спаси, Благи, душе наше.',
          '',
          'Амин.'
        ]
      },
      {
        id: 'trisagion',
        title: 'Трисвето',
        subtitle: 'Света песма анђела',
        content: [
          'Свети Боже, Свети Крепки, Свети Бесмртни,',
          'помилуј нас. (трипут)',
          '',
          'Слава Оцу и Сину и Светоме Духу,',
          'и сада и увек и у векове векова. Амин.',
          '',
          'Пресвета Тројице, помилуј нас;',
          'Господе, очисти грехе наше;',
          'Владико, опрости безакоња наша;',
          'Свети, посети и исцели немоћи наше,',
          'имена ради Твојега.',
          '',
          'Господе, помилуј. (трипут)',
          'Слава Оцу и Сину и Светоме Духу,',
          'и сада и увек и у векове векова. Амин.'
        ]
      },
      {
        id: 'our-father',
        title: 'Оче наш',
        subtitle: 'Молитва коју нас је научио Господ',
        content: [
          'Оче наш, Који си на небесима,',
          'да се свети име Твоје,',
          'да дође Царство Твоје,',
          'да буде воља Твоја,',
          'и на земљи као и на небу.',
          'Хлеб наш насушни дај нам данас;',
          'и опрости нам дугове наше,',
          'као што и ми опраштамо дужницима својим,',
          'и не уведи нас у искушење,',
          'но избави нас од злога.',
          '',
          'Амин.'
        ]
      },
      {
        id: 'bogorodice-djevo',
        title: 'Богородице Дјево',
        subtitle: 'Молитва Пресветој Богородици',
        content: [
          'Богородице Дјево, радуј се благодатна Маријо,',
          'Господ је с Тобом;',
          'благословена си међу женама',
          'и благословен је Плод утробе Твоје,',
          'јер си родила Спаситеља душа наших.',
          '',
          'Амин.'
        ]
      },
      {
        id: 'creed',
        title: 'Симбол Вере',
        subtitle: 'Никејско-цариградски символ вере',
        content: [
          'Верујем у једнога Бога, Оца, Сведржитеља, Творца неба и земље и свега видљивог и невидљивог.',
          '',
          'И у једнога Господа Исуса Христа, Сина Божјег, Јединородног, од Оца рођеног пре свих векова; Светлост од Светлости, Бога истинитог од Бога истинитог, рођеног, не створеног, једносуштног Оцу, кроз кога је све постало;',
          '',
          'Који је ради нас људи и ради нашег спасења сишао с небеса, и оваплотио се од Духа Светога и Марије Дјеве и постао човек;',
          '',
          'И Који је распет за нас у време Понтија Пилата, и страдао и био погребен;',
          '',
          'И Који је васкрсао у трећи дан, по Писму;',
          '',
          'И Који се вазнео на небеса и седи са десне стране Оца;',
          '',
          'И Који ће опет доћи са славом, да суди живима и мртвима, Његовом Царству неће бити краја.',
          '',
          'И у Духа Светога, Господа, Животворнога, Који од Оца исходи, Који се са Оцем и Сином заједно поштује и заједно слави, Који је говорио кроз пророке.',
          '',
          'У једну, свету, саборну и апостолску Цркву.',
          '',
          'Исповедам једно крштење за опроштење грехова.',
          '',
          'Чекам васкрсење мртвих.',
          '',
          'И живот будућег века. Амин.'
        ]
      },
      {
        id: 'morning-thanksgiving',
        title: 'Јутарња захвалност',
        subtitle: 'Захваљивање за нови дан',
        content: [
          'Хвала Ти, Господе Боже мој,',
          'што си ме подигао од сна',
          'и дао ми снагу за нови дан.',
          '',
          'Просвети ум мој да разумем вољу Твоју,',
          'отвори срце моје да примим љубав Твоју,',
          'укрепи тело моје да служим Теби.',
          '',
          'Благослови све што ћу данас чинити,',
          'сачувај ме од греха и искушења,',
          'и удостој ме да овај дан проведем',
          'у миру, радости и богобојажљивости.',
          '',
          'Амин.'
        ],
        note: 'Ову молитву треба изговорити чим устанемо из постеље'
      }
    ]
  },
  'evening': {
    title: 'Вечерње молитве',
    prayers: [
      {
        id: 'in-the-name',
        title: 'У име Оца и Сина и Светога Духа',
        subtitle: 'Почетак вечерње молитве',
        content: [
          'У име Оца и Сина и Светога Духа. Амин.',
          '',
          'Молитвама Светих Отаца наших Господе Исусе Христе, Боже наш, помилуј нас. Амин.',
          '',
          'Славе Теби, Боже наш, слава Теби.'
        ]
      },
      {
        id: 'heavenly-king-evening',
        title: 'Царе небесни',
        subtitle: 'Молитва Светоме Духу',
        content: [
          'Царе небесни, Утешитељу, Душе истине, који си свуда и све испуњаваш,',
          'Ризницo добара и Даваоче живота,',
          'приђи и усели се у нас,',
          'очисти нас од сваке нечистоте',
          'и спаси, Благи, душе наше.'
        ]
      },
      {
        id: 'trisagion-evening',
        title: 'Трисвето',
        subtitle: 'Света песма анђела',
        content: [
          'Свети Боже, Свети Крепки, Свети Бесмртни, помилуј нас. (3 пута)',
          '',
          'Слава Оцу и Сину и Светоме Духу, сада и увек и у векове векова. Амин.',
          '',
          'Пресвета Тројице, помилуј нас; Господе, очисти грехе наше; Владико, опрости безакоња наша; Свети, посети и исцели немоћи наше, имена Твога ради.',
          '',
          'Господе, помилуј. (3 пута)',
          '',
          'Слава Оцу и Сину и Светоме Духу, сада и увек и у векове векова. Амин.'
        ]
      },
      {
        id: 'our-father-evening',
        title: 'Оче наш',
        subtitle: 'Молитва коју нас је научио Господ',
        content: [
          'Оче наш Који си на небесима,',
          'да се свети име Твоје,',
          'да дође царство Твоје,',
          'да буде воља Твоја и на земљи као што је на небу;',
          'хлеб наш насушни дај нам данас;',
          'и опрости нам дугове наше као што и ми опраштамо дужницима својим;',
          'и не уведи нас у искушење,',
          'но избави нас од лукавога.',
          '',
          'Господе, помилуј. (12 пута)',
          '',
          'Слава Оцу и Сину и Светоме Духу, сада и увек и у векове векова. Амин.'
        ]
      },
      {
        id: 'come-worship',
        title: 'Приђите, поклонимо се',
        subtitle: 'Позив на поклоњење',
        content: [
          'Приђите, поклонимо се Цару нашему Богу!',
          'Приђите, поклонимо се и припаднимо Христу, Цару нашему Богу!',
          'Приђите, поклонимо се и припаднимо самоме Христу, Цару и Богу нашему!'
        ]
      },
      {
        id: 'psalm-103',
        title: 'Псалм 103',
        subtitle: 'Благосиљај, душо моја, Господа',
        content: [
          '1. Благосиљај, душо моја, Господа! Господе Боже мој, велик си веома, обукао си се у величанство и красоту.',
          '2. Обукао си светлост као хаљину, разапео небо као шатор;',
          '3. Водом си покрио висине своје, облаке положио си да су ти кола, идеш на крилима вјетренијем.',
          '4. Чиниш вјетрове да су ти анђели, пламен огњени да су ти слуге.',
          '5. Утврдио си земљу на темељима њезиним, да се не помјести за вијек вијека.',
          '6. Безданом као хаљином одјенуо си је; на горама стоје воде.',
          '7. Од пријетње твоје бјеже, од громовнога гласа твојега теку.',
          '8. Излазе на горе и силазе у долове, на мјесто које си им основао.',
          '9. Поставио си међу, преко које не прелазе, и не враћају се да покрију земљу.',
          '10. извео си изворе по брдима, између гора теку воде.',
          '11. Напајају све звијери пољске, дивљи магарци гасе жеђ своју.',
          '12. На њима птице небеске живе; кроз гране разлијеже се глас њихов.',
          '13. Напајаш горе с висина својих, плодовима дјела твојих сити се земља.',
          '14. Дајеш да расте трава стоци, и зелен на корист човјеку, да би изводио хљеб из земље.',
          '15. И вино весели срце човјеку, и хлеб срце човјеку кријепи.',
          '16. Сите се дрвета пољска, кедри Ливански, које си посадио.',
          '17. На њима птице вију гнијезда; рода стоји пред њима.',
          '18. Горе високе дивокозама, камен је уточиште зечевима.',
          '19. Створио си мјесец да показује времена, сунце познаје запад свој.',
          '20. Распростиреш таму, и бива ноћ, по којој излази све звијерје дубравно;',
          '21. Лавови ричу за плијеном, и траже од Бога храну себи.',
          '22.Сунце гране, и они се сакривају и лијежу у ложе своје.',
          '23. Излази човјек на посао свој, и на рад свој до вечера.',
          '24. Како су велика дјела твоја, Господе! Све си премудро створио; пуна је земља твари твојих.',
          '25. Гле, море је велико и широко, ту гмижу без броја створења мала и велика.',
          '26. Ту лађе плове, кит, којега си створио да се игра по њему.',
          '27. Све чека тебе, да им дадеш храну на вријеме.',
          '28. Дајеш им – примају; отвориш руку своју – све се испуњава радошћу.',
          '29. Одвратиш лице своје – жалосте се; узмеш им дух – гину, и у прах свој враћају се;',
          '30. Пошаљеш дух свој – постају, и обнављаш лице земљи.',
          '31. Нека је слава Господу увијек; нек се весели Господ за дјела своја.',
          '32. Он погледа на земљу, и она се тресе; дотакне се гора, и диме се.',
          '33. Пјеваћу Господу за живота својега; пјеваћу Богу мојему докле сам год.',
          '34. Нека му буде мила бесједа моја; веселићу се о Господу.',
          '35. Нека ишчезну гријешници са земље и безбожници; нека их не буде више! Благосиљај, душо моја, Господа! Алилуја!'
        ]
      },
      {
        id: 'short-prayer',
        title: 'Краћа молитва',
        subtitle: 'Молитва за опроштај и мир',
        content: [
          'Господе Боже наш опрости ми као благ и човекољубив све што сагреших данас: речју, делом и помишљу.',
          'Даруј ми миран и спокојан сан.',
          'Пошаљи ми анђела Твога, Чувара, да ме закриљује и чува од свакога зла.',
          'Јер Ти си чувар душа и тела наших, и Теби узносимо славу: Оцу и Сину и Светоме Духу, сада и увек и у све векове. Амин.'
        ]
      },
      {
        id: 'psalm-140',
        title: 'Псалм 140',
        subtitle: 'Господе, зовем к теби',
        content: [
          '1. Господе, зовем к теби, услиши ме, чуј глас мољења мојега, кад зовем к теби.',
          '2. Нек се управи молитва моја као кад пред тобом, дизање руку мојих као принос вечерњи.',
          '3. Постави, Господе, стражу код језика мојега, чувај врата уста мојих.',
          '4. Не дај срцу мојему да застрани на зле помисли, да чини дјела безбожна с људима који поступају неправедно; и да се не убројим у редове њихове.',
          '5. Нека ме мучи праведник у милости, нека ме кара; нека се помазује глава моја уљем грешника, јер је и молитва моја против жеља њихових.',
          '6. Расуше се по каменијем врлетима судије њихове.',
          '7. Као кад ко сијече и теше, тако се разлијетеше кости њихове до чељусти пакленијех.',
          '8. Али су к теби Господе, Господе, управљене очи моје, у тебе се уздам, немој одбацити душе моје.',
          '9. Сачувај ме од замке, коју ми метнуше, од лукавства онијех, који чине безакоње',
          '10. Пашће у мреже своје безбожници, а ја ћу један проћи.'
        ]
      },
      {
        id: 'chrysostom-prayer',
        title: 'Молитва Светог Јована Златоуста',
        subtitle: 'Молитва за опроштај и благодат',
        content: [
          'Господе, не лиши ме Твога небесног добра.',
          'Господе, избави ме од вечних мука.',
          'Господе, ако сам згрешио умом, помишљу, речју или делом, опрости ми.',
          'Господе избави ме од сваког незнања, заборава, малодушности и окамењене неосетљивости.',
          'Господе, избави ме од сваког искушења.',
          'Господе, просвети моје срце, које помрачи зла жеља.',
          'Господе, ја згреших као човек, а Ти видећи слабост душе моје помилуј ме као Бог милостиви.',
          'Господе, пошаљи ми у помоћ твоју благодат да прослављам свето име Твоје.',
          'Господе, Исусе Христе, запиши мене, слугу Твога у књигу живота и даруј ми добар свршетак.',
          'Господе Боже мој, ако и ништа добро не учиних пред Тобом, дај ми да добро починем.',
          'Господе, покропи срце моје росом благодати Твоје.',
          'Господе неба и земље, опомени се у царству Томе и мене, грешног слуге Твог, хладног и нечистог.'
        ]
      },
      {
        id: 'night-prayer-chrysostom',
        title: 'Ноћна молитва Светог Јована Златоуста',
        subtitle: 'Молитва пред спавање',
        content: [
          'Господе, прими ме у покајању.',
          'Господе, не остави ме.',
          'Господе, не допусти да паднем у невољу.',
          'Господе, дај ми сузе и сећање на смрт, смртни помен и скрушено кајање.',
          'Господе дај ми помисао, да исповедам грехове своје.',
          'Господе, дај ми смиреност, непорочну чистоту и послушност.',
          'Господе, удостој ме да Те љубим свом душом својом и мишљу, и да у свему вршим вољу Твоју.',
          'Господе, заштити ме од рђавих људи, злих духова и страсти, и од свега осталог непристојног.',
          'Господе, знам да чиниш оно што хоћеш, нека буде воља Твоја и у мени грешном јер си благословен навек века. Амин.'
        ]
      }
    ]
  },
  'illness': {
    title: 'У болести',
    prayers: [
      {
        id: 'healing-prayer',
        title: 'Молитва за исцељење болесника',
        subtitle: 'Молитва за болесника и болесницу',
        content: [
          '(молитва за болесника)',
          '',
          'О, Премилосрдни Боже, Оче, Сине и Свети Душе, у нераздељној Тројици обожавани и слављени, погледај милосрдно на слугу Твога ________ (име болесника), болешћу обузетог и отпусти му сва сагрешења његова; подај му исцељење од болести, поврати му здравље и снагу телесну, подари му дуговечан живот у благостању, Твоја светска и небеска добра, да би заједно са нама приносио благодарне молитве Теби, Свемилосрдном Богу и Саздатељу мојему.',
          '',
          'Пресвета Богородице, помози ми свесилним заступништвом својим да умолим Сина Твога, Бога мојега, да исцели слугу Божијег ________ (име болесника).',
          '',
          'Сви свети и Ангели Господњи, молите Бога за болесног слугу Његовог ________ (име болесника). Амин.',
          '',
          '(молитва за болесницу)',
          '',
          'О, Премилосрдни Боже, Оче, Сине и Свети Душе, у нераздељној Тројици обожавани и слављени, погледај милосрдно на слушкињу Твоју ________ (име болеснице), болешћу обузете и отпусти јој сва сагрешења њена; подај јој исцељење од болести, поврати јој здравље и снагу телесну, подари јој дуговечан живот у благостању, Твоја светска и небеска добра, да би заједно са нама приносила благодарне молитве Теби, Свемилосрдном Богу и Саздатељу мојему.',
          '',
          'Пресвета Богородице, помози ми свесилним заступништвом својим да умолим Сина Твога, Бога мојега, да исцели слушкињу Божију ________ (име болеснице).',
          '',
          'Сви свети и Ангели Господњи, молите Бога за болесну слушкињу Његову ________ (име болеснице). Амин.'
        ]
      }
    ]
  },
  'travel': {
    title: 'На путовању',
    prayers: [
      {
        id: 'travel-prayer',
        title: 'Молитва за оне који путују',
        subtitle: 'Молитва за заштиту на путу',
        content: [
          'Тропар, глас 2:',
          'Ти који си Пут и Истина, Христе, пошаљи за сапутника Ангела Свога слугама Својим сада, као некада Товији, да их чува и неповредне сачувана славу Твоју од свакога зла у свакој доброј срећи, молитвама Богородице, једини Човекољупче.',
          '',
          'Кондак, глас 2:',
          'Луки и Клеопи сапутник био Си, ходи сада заједно са слугама Твојим који да путују желе, од сваке их зле напасти избављајући. Јер Ти као Човекољубац све можеш.',
          '',
          'Молитва:',
          'Господе Исусе Христе, Боже наш, Истинити и Живи, Који си изволео да путујеш са тобожњим оцем Својим Јосифом и Пречистом Дјевом Мајком Својом у Египат и Који си сапутник Луки и Клеопи био! И сада Те смерно молимо, Владико Пресвети, са слугама Својим путуј благодатно. И као слуги Твоме Товији Ангела Чувара пошаљи, да нас чува и избавља од свакога злог нападаја видивих и невидивих непријатеља и на испуњавање заповести Твојих упућује, и да нас мирно и срећно и здраво проведе и безметежно кући врати. И дај слугама Твојим да сву своју добру намеру за благоугађање Теби срећно у славу Богу испуне. Јер Твоје је да милујеш и спасаваш нас и Теби славу узносимо са Беспочетним Оцем Твојим и са Пресветим и Благим и Животворним Твојим Духом, сада и свагда и у векове векова. Амин.'
        ]
      }
    ]
  },
  'trinity': {
    title: 'Молитва Светој Тројици',
    prayers: [
      {
        id: 'trinity-prayer',
        title: 'Молитва Светој Тројици пре читања Псалтира',
        content: [
          'Пресвета Тројице, Боже наш и Створитељу свега света, похитај и управи срце моје, да почнем с разумом а довршим добрим делима читање ове надахнуте књиге,',
          'коју Свети Дух кроз уста Давидова прогласи, а коју ја недостојни хоћу сада да читам.',
          '',
          'Познајући своје незнање, припадам к Теби, и молим Ти се, и твоје помоћи просим:',
          'Господе, управи ум мој и укрепи срце моје, да ми не буде устима тешко читати,',
          'но да ми се разум весели речима ове књиге.',
          '',
          'Помози ми, Господе, да оно што научим применим на добра дела,',
          'како би ме моја добра дела ставила с десне стране на Страшном Суду Христовом, са изабраним твојим.',
          '',
          'А сада, благослови Господе, да с уздисајем, читам овако:',
          '',
          '– Приђите поклонимо се Цару нашем Богу!',
          '– Приђите поклонимо се Христу Цару нашему Богу!',
          '– Приђите поклонимо се самоме Христу, Цару Богу нашему!'
        ]
      }
    ]
  },
  'guardian-angel': {
    title: 'Молитве Анђелу Чувару',
    prayers: [
      {
        id: 'guardian-angel-1',
        title: 'Молитва #1',
        content: [
          'Анђеле Божији, Чувару мој свети, који си ми од Бога дат као заштитник, просвети ме данас и сачувај од сваког зла, ка добрим делима упути и на пут спасења управи ме.',
          '',
          'Амин.'
        ]
      },
      {
        id: 'guardian-angel-2',
        title: 'Молитва #2',
        content: [
          'Анђеле Христов, чувару мој свети и покровитељу душе и тела мога,',
          'опрости ми све што Ти сагреших у данашњи дан и избави ме од свакога зла непријатељског ми противника,',
          'да не бих никаквим грехом разгневио Бога мог,',
          'но моли се за мене грешног и недостојног слугу,',
          'да ме покажеш достојна доброте и милости Свесвете Тројице и Матере Господа мога Исуса Христа и свих Светих.',
          '',
          'Амин.'
        ]
      },
      {
        id: 'guardian-angel-3',
        title: 'Молитва #3',
        content: [
          'Свети Анђеле Христов, падајући ничице пред тобом молим ти се, Чувару мој свети, који си мени грешноме дат од светога крштења, да ми чуваш душу и тело.',
          '',
          'Својом лењошћу и својим рђавим навикама ја разгневих твоју пречисту светлост,',
          'и отерах те од себе свим гадним делима, лажима, клеветама, завишћу, осуђивањем, охолошћу, непокорношћу,',
          'мржњом на браћу, злопамћењем, среброљубљем, прељубом, јарошћу, тврдичлуком,',
          'ненаситим преједањем, опијањем, брбљањем, рђавим и лукавим мислима, гордељивошћу,',
          'и похотљивим беснилом, имајући вољу за сваку телесну пожуду.',
          '',
          'О, да зле наклоности моје, какве нема ни у неразумних животиња!',
          'Та како можеш погледати на мене, или приступити мени као смрдљивом псу?',
          'Каквим ћеш очима, Анђеле Христов, погледати на мене када сам се ужасно заплео у одвратна дела?',
          'Та како ћу већ моћи да молим опроштај за своја горка, зла и рђава дела, у која падам даноноћно и сваког часа?',
          '',
          'Но молим ти се, падајући ничице пред тобом, Чувару мој свети,',
          'смилуј се на мене грешног и недостојног слугу свог (име);',
          'буди ми помоћник и заштитник од мог злог противника, светим твојим молитвама,',
          'и учини ме учесником у царству Божјем са свима Светима, свагда, и сада и увек и кроза све векове.',
          '',
          'Амин.'
        ]
      }
    ]
  }
};

const getCategoryIcon = (categoryId: string, size: number, color: string) => {
  switch (categoryId) {
    case 'morning':
      return <Sun size={size} color={color} />;
    case 'evening':
      return <Moon size={size} color={color} />;
    case 'illness':
      return <Heart size={size} color={color} />;
    case 'travel':
      return <Shield size={size} color={color} />;
    case 'family':
      return <Users size={size} color={color} />;
    case 'special':
      return <Cross size={size} color={color} />;
    case 'trinity':
      return <Cross size={size} color={color} />;
    case 'guardian-angel':
      return <Cross size={size} color={color} />;
    default:
      return <Sun size={size} color={color} />;
  }
};

export default function PrayersScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const { currentColors } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const categoryData = prayersData[category as string];

  if (!categoryData) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={currentColors.accentGold} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>Молитве нису пронађене</Text>
        </View>
      </View>
    );
  }

  const toggleFavorite = async (prayer: Prayer) => {
    const favoriteId = `prayer-${prayer.id}`;
    
    if (isFavorite(favoriteId)) {
      await removeFromFavorites(favoriteId);
    } else {
      await addToFavorites({
        id: favoriteId,
        type: 'prayer',
        title: prayer.title,
        subtitle: prayer.subtitle,
        route: `/prayers/${category}`,
        addedAt: new Date().toISOString(),
      });
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
        <Text style={[styles.headerTitle, { color: currentColors.accentGold }]}>{categoryData.title}</Text>
        <View style={styles.headerActions}>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <LinearGradient
            colors={[currentColors.cardBackground, currentColors.tertiary]}
            style={[styles.categoryHeaderCard, { borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}
          >
            {getCategoryIcon(category as string, 32, currentColors.accentGold)}
            <Text style={[styles.categoryTitle, { color: currentColors.primaryText }]}>{categoryData.title}</Text>
            <Text style={[styles.categorySubtitle, { color: currentColors.secondaryText }]}>
              Почетак дана са Богом у молитви и захвалности
            </Text>
          </LinearGradient>
        </View>

        {/* Font Size Controls */}
        <View style={styles.fontControls}>
          <Text style={[styles.fontLabel, { color: currentColors.secondaryText }]}>Величина текста:</Text>
          <View style={styles.fontButtons}>
            <TouchableOpacity 
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 14 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(14)}
            >
              <Text style={[styles.fontButtonText, { color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 16 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(16)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 16, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.fontButton, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor }, fontSize === 18 && { borderColor: currentColors.accentGold, shadowColor: currentColors.accentGold }]}
              onPress={() => setFontSize(18)}
            >
              <Text style={[styles.fontButtonText, { fontSize: 18, color: currentColors.primaryText }]}>А</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Prayers */}
        {categoryData.prayers.map((prayer, index) => (
          <View key={prayer.id} style={styles.prayerContainer}>
            <View style={styles.prayerHeader}>
              <View style={[styles.prayerNumber, { backgroundColor: currentColors.accentGold }]}>
                <Text style={[styles.prayerNumberText, { color: currentColors.primary }]}>{index + 1}</Text>
              </View>
              <View style={styles.prayerTitleContainer}>
                <Text style={[styles.prayerTitle, { color: currentColors.accentGold }]}>{prayer.title}</Text>
                {prayer.subtitle && (
                  <Text style={[styles.prayerSubtitle, { color: currentColors.secondaryText }]}>{prayer.subtitle}</Text>
                )}
              </View>
              <View style={styles.prayerActions}>
                <TouchableOpacity 
                  style={styles.prayerActionButton}
                  onPress={() => toggleFavorite(prayer)}
                >
                  <Heart 
                    size={18} 
                    color={isFavorite(`prayer-${prayer.id}`) ? currentColors.accentGold : currentColors.tertiaryText} 
                    fill={isFavorite(`prayer-${prayer.id}`) ? currentColors.accentGold : "none"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.prayerContent, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.borderColor, shadowColor: currentColors.shadowColor }]}>
              {prayer.content.map((line, lineIndex) => (
                <Text 
                  key={lineIndex} 
                  style={[
                    styles.prayerLine, 
                    { fontSize, color: currentColors.primaryText },
                    line === '' && styles.emptyLine
                  ]}
                >
                  {line}
                </Text>
              ))}
            </View>

            {prayer.note && (
              <View style={[styles.prayerNote, { backgroundColor: currentColors.tertiary, borderLeftColor: currentColors.accentGold }]}>
                <Text style={[styles.prayerNoteText, { color: currentColors.accentGold }]}>{prayer.note}</Text>
              </View>
            )}

            {index < categoryData.prayers.length - 1 && (
              <View style={[styles.prayerDivider, { backgroundColor: currentColors.tertiary }]} />
            )}
          </View>
        ))}



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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryHeader: {
    marginBottom: 25,
  },
  categoryHeaderCard: {
    borderRadius: 15,
    padding: 25,
    borderWidth: 3,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  categorySubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  fontButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  prayerContainer: {
    marginBottom: 30,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  prayerNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  prayerNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  prayerTitleContainer: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  prayerSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  prayerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  prayerActionButton: {
    padding: 5,
  },
  prayerContent: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    marginLeft: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  prayerLine: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  emptyLine: {
    marginBottom: 12,
  },
  prayerNote: {
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginLeft: 50,
    borderLeftWidth: 3,
  },
  prayerNoteText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  prayerDivider: {
    height: 1,
    marginTop: 20,
    marginLeft: 50,
  },

});
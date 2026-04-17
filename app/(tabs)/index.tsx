import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, TEMPLATES } from '@/constants/theme';

const LOGO = require('@/assets/logo.png');
import AdBanner from '@/components/AdBanner';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    label: '7 modèles',
    desc: 'Moderne, professionnel, créatif, ATS — adaptés à chaque secteur.',
    img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
  },
  {
    label: 'PDF instantané',
    desc: 'Exportez en PDF haute qualité en un tap, prêt à envoyer.',
    img: 'https://images.unsplash.com/photo-1568658152580-f3364e1e3b21?w=400&q=80',
  },
  {
    label: 'ATS Compatible',
    desc: 'Passez les filtres automatiques des recruteurs sans effort.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
  },
];

const TEMPLATE_COLORS: Record<string, string> = {
  modern: '#1A5EAB',
  professional: '#1F2937',
  creative: '#7C3AED',
  simple: '#374151',
  canadian: '#D00000',
  europass: '#003399',
  ats: '#111111',
};

const STEPS = [
  { n: '01', title: 'Vos infos', desc: 'Remplissez le formulaire guidé en 4 étapes simples.' },
  { n: '02', title: 'Choisissez', desc: 'Sélectionnez un modèle et une couleur de marque.' },
  { n: '03', title: 'Prévisualisez', desc: "Vérifiez le rendu final avant d'exporter." },
  { n: '04', title: 'Exportez', desc: 'Téléchargez le PDF ou partagez directement.' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Top bar */}
      <View style={s.topbar}>
        <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
      </View>

      {/* Hero */}
      <View style={s.hero}>
        <View style={s.heroBadge}>
          <Text style={s.heroBadgeText}>GRATUIT · SANS INSCRIPTION</Text>
        </View>
        <Text style={s.heroTitle}>Votre CV{'\n'}professionnel{'\n'}en minutes.</Text>
        <Text style={s.heroSub}>
          Créez un CV percutant avec 7 modèles adaptés aux standards français, québécois et européens.
        </Text>
        <TouchableOpacity style={s.ctaPrimary} onPress={() => router.push('/builder')} activeOpacity={0.85}>
          <Text style={s.ctaPrimaryText}>Créer mon CV →</Text>
        </TouchableOpacity>
        <Text style={s.heroNote}>Plus de 12 000 CVs créés · Noté 4.8/5</Text>
      </View>

      {/* Banner ad — after hero */}
      <AdBanner style={{ marginVertical: 2 }} />

      <View style={s.divider} />

      {/* Features */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>FONCTIONNALITÉS</Text>
        <Text style={s.sectionTitle}>Tout ce qu'il vous faut.</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={s.featureCard}>
            <Image source={{ uri: f.img }} style={s.featureImg} />
            <View style={s.featureBody}>
              <Text style={s.featureLabel}>{f.label}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Banner ad — after features */}
      <AdBanner style={{ marginVertical: 2 }} />

      {/* Templates */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>MODÈLES</Text>
        <Text style={s.sectionTitle}>7 templates,{'\n'}un style.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.templatesScroll} contentContainerStyle={s.templatesContent}>
          {TEMPLATES.map((tpl) => (
            <TouchableOpacity
              key={tpl.key}
              style={s.tplCard}
              onPress={() => router.push('/builder')}
              activeOpacity={0.85}
            >
              <View style={[s.tplThumb, { borderTopColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary }]}>
                <View style={[s.tplBar, { width: '80%', backgroundColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary, opacity: 0.9 }]} />
                <View style={[s.tplBar, { width: '55%', marginTop: 5 }]} />
                <View style={[s.tplBar, { width: '65%', marginTop: 3 }]} />
                <View style={[s.tplBar, { width: '45%', marginTop: 3 }]} />
              </View>
              <View style={s.tplInfo}>
                <Text style={s.tplName}>{tpl.label}</Text>
                <Text style={s.tplBadge}>{tpl.badge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.divider} />

      {/* How it works */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>COMMENT ÇA MARCHE</Text>
        <Text style={s.sectionTitle}>Simple et rapide.</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepNum}>
              <Text style={s.stepNumText}>{step.n}</Text>
            </View>
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Banner ad — after how it works */}
      <AdBanner style={{ marginVertical: 2 }} />

      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { v: '12K+', l: 'CVs créés' },
          { v: '4.8', l: 'Note moyenne' },
          { v: '7', l: 'Modèles' },
        ].map((stat, i) => (
          <View key={i} style={s.statItem}>
            <Text style={s.statValue}>{stat.v}</Text>
            <Text style={s.statLabel}>{stat.l}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      {/* CTA bottom */}
      <View style={s.section}>
        <Text style={s.ctaTitle}>Prêt à décrocher{'\n'}votre prochain emploi ?</Text>
        <TouchableOpacity style={s.ctaPrimary} onPress={() => router.push('/builder')} activeOpacity={0.85}>
          <Text style={s.ctaPrimaryText}>Commencer gratuitement →</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper },
  scroll: { paddingBottom: Spacing.xl },

  topbar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
    backgroundColor: Colors.paper,
  },
  logoImg: {
    height: 36,
    width: 160,
  },

  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  heroBadge: {
    borderWidth: 1,
    borderColor: Colors.rule2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  heroBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.ink3,
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: 'Inter-Black',
    fontSize: 40,
    color: Colors.ink,
    lineHeight: 44,
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  heroSub: {
    fontSize: FontSize.base,
    color: Colors.ink2,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  ctaPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: Spacing.xl,
    alignSelf: 'flex-start',
  },
  ctaPrimaryText: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.base,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  heroNote: {
    marginTop: Spacing.md,
    fontSize: FontSize.xs,
    color: Colors.ink3,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.rule,
    marginHorizontal: Spacing.lg,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.ink3,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Inter-Black',
    fontSize: FontSize.xl,
    color: Colors.ink,
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
    lineHeight: 30,
  },

  featureCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.rule,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  featureImg: {
    width: 100,
    height: 90,
  },
  featureBody: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  featureLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.sm,
    color: Colors.ink,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: FontSize.xs,
    color: Colors.ink2,
    lineHeight: 18,
  },

  templatesScroll: { marginHorizontal: -Spacing.lg },
  templatesContent: { paddingHorizontal: Spacing.lg, gap: 12 },
  tplCard: {
    width: 130,
    borderWidth: 1,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  tplThumb: {
    height: 100,
    backgroundColor: Colors.surface2,
    padding: 14,
    borderTopWidth: 3,
  },
  tplBar: {
    height: 5,
    backgroundColor: Colors.rule2,
  },
  tplInfo: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.rule,
  },
  tplName: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.ink,
  },
  tplBadge: {
    fontSize: 10,
    color: Colors.ink3,
    marginTop: 2,
  },

  stepRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  stepNumText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: Colors.primary,
  },
  stepBody: { flex: 1 },
  stepTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.base,
    color: Colors.ink,
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
    lineHeight: 20,
  },

  statsRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.rule,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Black',
    fontSize: FontSize.xl,
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.ink3,
    marginTop: 2,
  },

  ctaTitle: {
    fontFamily: 'Inter-Black',
    fontSize: FontSize.xl,
    color: Colors.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: Spacing.lg,
  },
});

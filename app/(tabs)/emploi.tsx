import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import AdBanner from '@/components/AdBanner';

const CATEGORIES = ['Tous', 'CV', 'Emploi', 'Entretien', 'Linkedin'];

const ARTICLES = [
  {
    cat: 'CV',
    title: 'Les 7 erreurs fatales qui font rejeter votre CV',
    intro: 'Chaque année, des milliers de candidatures compétentes sont ignorées pour des raisons évitables.',
    tips: [
      'Photo non professionnelle ou absente selon les standards du pays',
      'Adresse e-mail peu sérieuse (ex. : coolboy94@…)',
      'Objectif professionnel générique sans ciblage',
      'Fautes d\'orthographe non corrigées',
      'Format illisible sur mobile ou par les logiciels ATS',
    ],
    cta: '→ Utilisez un modèle ATS Compatible',
  },
  {
    cat: 'Emploi',
    title: 'Comment décrocher un emploi en France en 2025',
    intro: 'Le marché de l\'emploi français évolue rapidement. Voici les stratégies qui fonctionnent.',
    tips: [
      'Personnalisez votre CV pour chaque offre',
      'Utilisez France Travail, LinkedIn et Welcome to the Jungle',
      'Réseautez activement — 70 % des postes ne sont pas publiés',
      'Envoyez des candidatures spontanées ciblées',
    ],
    cta: '→ Créez votre CV Moderne',
  },
  {
    cat: 'Emploi',
    title: 'Trouver un emploi au Québec : guide pour francophones',
    intro: 'S\'installer et travailler au Québec demande une adaptation du format CV et des démarches.',
    tips: [
      'Le CV québécois ne contient pas de photo ni d\'informations personnelles',
      'Privilégiez un format chronologique inverse',
      'Mentionnez votre autorisation de travail dès le départ',
      'Joignez une lettre de motivation courte et directe',
    ],
    cta: '→ Essayez le modèle Canadien',
  },
  {
    cat: 'CV',
    title: 'CV ATS : comment passer les filtres automatiques',
    intro: 'Plus de 75 % des grandes entreprises utilisent des logiciels ATS. Voici comment les contourner.',
    tips: [
      'Utilisez des mots-clés exacts de l\'offre d\'emploi',
      'Évitez tableaux, colonnes et images dans la section principale',
      'Utilisez des titres de section standards (Expérience, Formation…)',
      'Format .PDF ou .DOCX propre, sans en-tête complexe',
    ],
    cta: '→ Utiliser le modèle ATS',
  },
  {
    cat: 'Entretien',
    title: '10 questions pièges en entretien et comment y répondre',
    intro: 'Préparez les questions difficiles pour montrer votre meilleur profil.',
    tips: [
      '"Parlez-moi de vous" — Structurez en 3 parties : passé, présent, futur',
      '"Vos points faibles ?" — Choisissez un vrai défaut que vous avez travaillé',
      '"Pourquoi nous ?" — Citez des éléments précis de l\'entreprise',
      '"Prétentions salariales ?" — Donnez une fourchette basée sur le marché',
    ],
    cta: '→ Préparez votre CV d\'abord',
  },
  {
    cat: 'Linkedin',
    title: 'Optimiser son profil LinkedIn pour être recruté',
    intro: 'Un profil LinkedIn bien optimisé peut multiplier par 5 vos contacts recruteurs.',
    tips: [
      'Photo professionnelle et bannière de marque',
      'Titre percutant avec mots-clés métier',
      'Résumé en mode storytelling à la première personne',
      'Compétences validées par vos collègues',
      'Activer "Ouvert aux opportunités" en mode discret',
    ],
    cta: '→ Créer un CV assorti',
  },
];

const FAQ = [
  { q: 'CVGratuit Builder est-il vraiment gratuit ?', a: 'Oui, totalement. Aucun compte requis, aucun paiement caché. Créez et exportez autant de CVs que vous voulez.' },
  { q: 'Puis-je créer un CV en français canadien ?', a: 'Absolument. Le modèle "Canadien" respecte les standards québécois : sans photo, sans informations personnelles superflues, format nord-américain.' },
  { q: 'Mes données sont-elles sauvegardées ?', a: 'Toutes vos données restent sur votre appareil. Nous n\'utilisons aucun serveur externe pour stocker vos informations personnelles.' },
];

export default function EmploiScreen() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = activeCategory === 'Tous'
    ? ARTICLES
    : ARTICLES.filter(a => a.cat === activeCategory);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerLabel}>RESSOURCES</Text>
        <Text style={s.headerTitle}>Conseils Emploi{'\n'}& CV 2025</Text>
        <Text style={s.headerSub}>
          Guides pratiques pour francophones de France, Québec, Belgique et Suisse.
        </Text>
      </View>

      <View style={s.divider} />

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[s.filterTab, activeCategory === cat && s.filterTabActive]}
            activeOpacity={0.7}
          >
            <Text style={[s.filterTabText, activeCategory === cat && s.filterTabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.divider} />

      {/* Articles */}
      <View style={s.articlesContainer}>
        {filtered.map((article, i) => (
          <View key={i}>
            <View style={s.articleCard}>
              <Text style={s.articleCat}>{article.cat.toUpperCase()}</Text>
              <Text style={s.articleTitle}>{article.title}</Text>
              <Text style={s.articleIntro}>{article.intro}</Text>
              <View style={s.tipsList}>
                {article.tips.map((tip, j) => (
                  <View key={j} style={s.tipRow}>
                    <Text style={s.tipDash}>—</Text>
                    <Text style={s.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
              <Text style={s.articleCta}>{article.cta}</Text>
              {i < filtered.length - 1 && <View style={s.articleDivider} />}
            </View>
            {/* Banner ad every 3 articles */}
            {(i + 1) % 3 === 0 && i < filtered.length - 1 && (
              <AdBanner style={{ marginBottom: 8 }} />
            )}
          </View>
        ))}
      </View>

      {/* Banner ad — between articles and FAQ */}
      <AdBanner style={{ marginVertical: 2 }} />

      {/* FAQ */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>FAQ</Text>
        <Text style={s.sectionTitle}>Questions fréquentes</Text>
        {FAQ.map((item, i) => (
          <View key={i} style={s.faqItem}>
            <TouchableOpacity
              style={s.faqQuestion}
              onPress={() => setOpenFaq(openFaq === i ? null : i)}
              activeOpacity={0.7}
            >
              <Text style={s.faqQ}>{item.q}</Text>
              <Text style={s.faqToggle}>{openFaq === i ? '−' : '+'}</Text>
            </TouchableOpacity>
            {openFaq === i && (
              <View style={s.faqAnswer}>
                <Text style={s.faqA}>{item.a}</Text>
              </View>
            )}
            <View style={s.faqDivider} />
          </View>
        ))}
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper },
  scroll: {},

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },
  headerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.ink3,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Inter-Black',
    fontSize: 34,
    color: Colors.ink,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: Spacing.sm,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.rule,
  },

  filterScroll: { backgroundColor: Colors.paper },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.rule,
  },
  filterTabActive: {
    borderColor: Colors.ink,
    backgroundColor: Colors.ink,
  },
  filterTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: FontSize.sm,
    color: Colors.ink2,
  },
  filterTabTextActive: {
    color: Colors.white,
  },

  articlesContainer: {
    paddingHorizontal: Spacing.lg,
  },

  articleCard: {
    paddingVertical: Spacing.xl,
  },
  articleCat: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  articleTitle: {
    fontFamily: 'Inter-Black',
    fontSize: FontSize.lg,
    color: Colors.ink,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: Spacing.sm,
  },
  articleIntro: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },
  tipsList: { marginBottom: Spacing.md },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 7,
    alignItems: 'flex-start',
  },
  tipDash: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginRight: 8,
    lineHeight: 21,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.ink2,
    lineHeight: 21,
  },
  articleCta: {
    fontFamily: 'Inter-Medium',
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  articleDivider: {
    height: 1,
    backgroundColor: Colors.rule,
    marginTop: Spacing.md,
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
  },

  faqItem: {},
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  faqQ: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.sm,
    color: Colors.ink,
    lineHeight: 20,
    marginRight: Spacing.sm,
  },
  faqToggle: {
    fontSize: 22,
    color: Colors.ink3,
    lineHeight: 24,
  },
  faqAnswer: {
    paddingBottom: Spacing.md,
  },
  faqA: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
    lineHeight: 21,
  },
  faqDivider: {
    height: 1,
    backgroundColor: Colors.rule,
  },
});

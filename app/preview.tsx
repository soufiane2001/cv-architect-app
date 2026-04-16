import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert, Platform, Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, TEMPLATES, PALETTE } from '@/constants/theme';
import { useCV } from '@/hooks/useCV';
import { buildCVHtml } from '@/utils/cvTemplates';
import AdBanner from '@/components/AdBanner';
import AdVideoModal from '@/components/AdVideoModal';

const TEMPLATE_COLORS: Record<string, string> = {
  modern: '#1A5EAB', professional: '#1F2937', creative: '#7C3AED',
  simple: '#374151', canadian: '#D00000', europass: '#003399', ats: '#111111',
};

export default function PreviewScreen() {
  const router = useRouter();
  const { cvData, photo, update } = useCV();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showAdVideo, setShowAdVideo] = useState(false);
  const webviewRef = useRef<any>(null);

  const html = buildCVHtml(cvData, photo);

  // Step 1: tap PDF → show video ad
  const requestExport = () => {
    setShowAdVideo(true);
  };

  // Step 2: ad completed → generate & share PDF
  const handleAdComplete = async () => {
    setShowAdVideo(false);
    try {
      setExporting(true);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const firstName = cvData.personalInfo.firstName || 'CV';
      const lastName  = cvData.personalInfo.lastName  || '';
      const canShare  = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Partager votre CV',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF prêt', `Fichier : CV_${firstName}_${lastName}.pdf`);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de générer le PDF. Réessayez.');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = async () => {
    try { await Print.printAsync({ html }); }
    catch { Alert.alert('Erreur', 'Impression impossible.'); }
  };

  return (
    <View style={s.root}>
      {/* Top toolbar */}
      <View style={s.toolbar}>
        <TouchableOpacity onPress={() => setShowTemplates(true)} style={s.toolBtn} activeOpacity={0.8}>
          <Text style={s.toolBtnIcon}>⊞</Text>
          <Text style={s.toolBtnLabel}>Modèle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowColors(true)} style={s.toolBtn} activeOpacity={0.8}>
          <View style={[s.colorDot, { backgroundColor: cvData.color }]} />
          <Text style={s.toolBtnLabel}>Couleur</Text>
        </TouchableOpacity>
        <View style={s.toolSep} />
        <TouchableOpacity
          onPress={requestExport}
          style={[s.toolBtn, s.toolBtnPrimary]}
          activeOpacity={0.85}
          disabled={exporting}
        >
          {exporting
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <Text style={s.toolBtnPrimaryText}>↓ PDF</Text>
          }
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity onPress={handlePrint} style={s.toolBtn} activeOpacity={0.8}>
            <Text style={s.toolBtnIcon}>⎙</Text>
            <Text style={s.toolBtnLabel}>Imprimer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.push('/builder')} style={s.toolBtn} activeOpacity={0.8}>
          <Text style={s.toolBtnIcon}>✎</Text>
          <Text style={s.toolBtnLabel}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Banner ad — top of preview */}
      <AdBanner />

      {/* WebView */}
      <View style={s.webviewContainer}>
        {loading && (
          <View style={s.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={s.loadingText}>Génération du CV...</Text>
          </View>
        )}
        <WebView
          ref={webviewRef}
          source={{ html }}
          style={s.webview}
          onLoadEnd={() => setLoading(false)}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          originWhitelist={['*']}
          javaScriptEnabled
          scalesPageToFit={Platform.OS === 'android'}
        />
      </View>

      {/* 10s video ad modal before PDF download */}
      <AdVideoModal
        visible={showAdVideo}
        onComplete={handleAdComplete}
        onDismiss={() => setShowAdVideo(false)}
      />

      {/* Template selector modal */}
      <Modal visible={showTemplates} animationType="slide" transparent onRequestClose={() => setShowTemplates(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Choisir un modèle</Text>
              <TouchableOpacity onPress={() => setShowTemplates(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={s.modalClose}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TEMPLATES.map(tpl => (
                <TouchableOpacity
                  key={tpl.key}
                  onPress={() => { update({ template: tpl.key }); setShowTemplates(false); setLoading(true); }}
                  style={[s.tplRow, cvData.template === tpl.key && s.tplRowActive]}
                  activeOpacity={0.8}
                >
                  <View style={[s.tplThumb, { borderTopColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary }]}>
                    <View style={[s.tplBar, { width: '80%', backgroundColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary, opacity: 0.8 }]} />
                    <View style={[s.tplBar, { width: '55%', marginTop: 4 }]} />
                    <View style={[s.tplBar, { width: '65%', marginTop: 3 }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.tplName}>{tpl.label}</Text>
                    <Text style={s.tplBadge}>{tpl.badge}</Text>
                  </View>
                  {cvData.template === tpl.key && <Text style={s.tplCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Color selector modal */}
      <Modal visible={showColors} animationType="slide" transparent onRequestClose={() => setShowColors(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { paddingBottom: Spacing.xl }]}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Couleur principale</Text>
              <TouchableOpacity onPress={() => setShowColors(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={s.modalClose}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.modalSub}>S'applique aux titres, accents et barres du CV.</Text>
            <View style={s.palette}>
              {PALETTE.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => { update({ color }); setShowColors(false); setLoading(true); }}
                  style={[s.paletteDot, { backgroundColor: color }, cvData.color === color && s.paletteDotActive]}
                  activeOpacity={0.8}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
    backgroundColor: Colors.paper,
    gap: 4,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 52,
  },
  toolBtnIcon: { fontSize: 17, color: Colors.ink2, lineHeight: 20 },
  toolBtnLabel: { fontSize: 10, color: Colors.ink3, marginTop: 2 },
  toolBtnPrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    minWidth: 64,
  },
  toolBtnPrimaryText: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.white },
  toolSep: { flex: 1 },
  colorDot: { width: 18, height: 18, borderWidth: 1, borderColor: Colors.rule2 },

  webviewContainer: { flex: 1, backgroundColor: Colors.surface2 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: { fontSize: FontSize.sm, color: Colors.ink3, marginTop: Spacing.sm },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.paper,
    borderTopWidth: 1,
    borderTopColor: Colors.rule,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
  },
  modalTitle: { fontFamily: 'Inter-Bold', fontSize: FontSize.base, color: Colors.ink },
  modalClose: { fontSize: 24, color: Colors.ink3, lineHeight: 28 },
  modalSub: { fontSize: FontSize.sm, color: Colors.ink3, marginBottom: Spacing.lg },

  tplRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  tplRowActive: { borderColor: Colors.primary },
  tplThumb: {
    width: 56, height: 65,
    backgroundColor: Colors.surface2,
    padding: 8,
    borderTopWidth: 3,
  },
  tplBar: { height: 4, backgroundColor: Colors.rule2 },
  tplName: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.ink },
  tplBadge: { fontSize: FontSize.xs, color: Colors.ink3, marginTop: 2 },
  tplCheck: { fontFamily: 'Inter-Bold', fontSize: 16, color: Colors.primary },

  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingTop: Spacing.sm },
  paletteDot: { width: 44, height: 44, borderWidth: 1, borderColor: 'transparent' },
  paletteDotActive: { borderWidth: 3, borderColor: Colors.ink },
});

import { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, Image, KeyboardAvoidingView, Platform, Switch, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, Spacing, TEMPLATES, PALETTE } from '@/constants/theme';
import { useCV, uid, CVData, Experience, Education, Language, Certification } from '@/hooks/useCV';
import AdBanner from '@/components/AdBanner';

const STEPS = ['Identité', 'Parcours', 'Compétences', 'Style'];

// ─── helpers ──────────────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

function Field({
  label, value, onChangeText, placeholder, multiline, keyboardType, numberOfLines,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: any; numberOfLines?: number;
}) {
  return (
    <View style={s.field}>
      <Label>{label}</Label>
      <TextInput
        style={[s.input, multiline && { height: (numberOfLines ?? 3) * 22 + 16, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor={Colors.ink3}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

// ─── Month/Year date picker ───────────────────────────────────────────────────

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function DatePickerField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [selMonth, setSelMonth] = useState(0);
  const [selYear, setSelYear] = useState(new Date().getFullYear());

  const openPicker = () => {
    const parts = value ? value.split('/') : [];
    setSelMonth(parts[0] ? parseInt(parts[0], 10) - 1 : new Date().getMonth());
    setSelYear(parts[1] ? parseInt(parts[1], 10) : new Date().getFullYear());
    setVisible(true);
  };

  const confirm = () => {
    const mm = String(selMonth + 1).padStart(2, '0');
    onChange(`${mm}/${selYear}`);
    setVisible(false);
  };

  return (
    <View style={s.field}>
      <Label>{label}</Label>
      <TouchableOpacity style={s.dateBtn} onPress={openPicker} activeOpacity={0.7}>
        <Text style={[s.dateBtnText, !value && { color: Colors.ink3 }]}>{value || 'MM/AAAA'}</Text>
        <Text style={s.dateBtnChevron}>▾</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={s.dpBackdrop}>
          <View style={s.dpCard}>
            <View style={s.dpYearRow}>
              <TouchableOpacity onPress={() => setSelYear(y => y - 1)} style={s.dpArrow} activeOpacity={0.7}>
                <Text style={s.dpArrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={s.dpYearText}>{selYear}</Text>
              <TouchableOpacity onPress={() => setSelYear(y => y + 1)} style={s.dpArrow} activeOpacity={0.7}>
                <Text style={s.dpArrowText}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={s.dpMonthGrid}>
              {MONTHS_FR.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.dpMonthCell, selMonth === i && s.dpMonthCellActive]}
                  onPress={() => setSelMonth(i)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.dpMonthText, selMonth === i && s.dpMonthTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.dpActions}>
              <TouchableOpacity onPress={() => { onChange(''); setVisible(false); }} style={s.dpClearBtn} activeOpacity={0.8}>
                <Text style={s.dpClearText}>Effacer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirm} style={s.dpConfirmBtn} activeOpacity={0.8}>
                <Text style={s.dpConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Step 1 : personal info + photo ──────────────────────────────────────────

function StepIdentity({ cvData, update, photo, savePhoto }: any) {
  const info = cvData.personalInfo;
  const set = (key: string) => (val: string) => update({ personalInfo: { ...info, [key]: val } });

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission requise', 'Autorisez l\'accès à votre galerie.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].base64
        ? `data:image/jpeg;base64,${result.assets[0].base64}`
        : result.assets[0].uri;
      savePhoto(uri);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Photo */}
      <View style={s.photoSection}>
        <TouchableOpacity onPress={pickPhoto} style={s.photoZone} activeOpacity={0.8}>
          {photo
            ? <Image source={{ uri: photo }} style={s.photoPreview} />
            : (
              <View style={s.photoPlaceholder}>
                <Text style={s.photoPlaceholderIcon}>+</Text>
                <Text style={s.photoPlaceholderText}>Ajouter une photo</Text>
              </View>
            )
          }
        </TouchableOpacity>
        {photo && (
          <TouchableOpacity onPress={() => savePhoto(null)} style={s.photoRemove} activeOpacity={0.7}>
            <Text style={s.photoRemoveText}>Supprimer</Text>
          </TouchableOpacity>
        )}
      </View>

      <Field label="PRÉNOM" value={info.firstName} onChangeText={set('firstName')} placeholder="Jean" />
      <Field label="NOM" value={info.lastName} onChangeText={set('lastName')} placeholder="Dupont" />
      <Field label="TITRE DU POSTE" value={info.profileTitle} onChangeText={set('profileTitle')} placeholder="Développeur Full-Stack" />
      <Field label="E-MAIL" value={info.email} onChangeText={set('email')} placeholder="jean@exemple.fr" keyboardType="email-address" />
      <Field label="TÉLÉPHONE" value={info.phone} onChangeText={set('phone')} placeholder="+33 6 00 00 00 00" keyboardType="phone-pad" />
      <Field label="ADRESSE" value={info.address} onChangeText={set('address')} placeholder="Paris, France" />
      <Field label="LINKEDIN" value={info.linkedin} onChangeText={set('linkedin')} placeholder="linkedin.com/in/jean-dupont" />
      <Field label="SITE WEB" value={info.website} onChangeText={set('website')} placeholder="monportfolio.fr" />
      <Field label="NATIONALITÉ" value={cvData.nationalite} onChangeText={(v: string) => update({ nationalite: v })} placeholder="Française" />
      <Field label="PERMIS DE CONDUIRE" value={cvData.permis} onChangeText={(v: string) => update({ permis: v })} placeholder="B" />
      <Field
        label="PROFIL / RÉSUMÉ"
        value={info.summary}
        onChangeText={set('summary')}
        placeholder="Développeur passionné avec 5 ans d'expérience..."
        multiline
        numberOfLines={4}
      />
    </ScrollView>
  );
}

// ─── Step 2 : experience + education ────────────────────────────────────────

function ExperienceEntry({ exp, onChange, onRemove }: { exp: Experience; onChange: (e: Experience) => void; onRemove: () => void }) {
  const set = (key: keyof Experience) => (val: any) => onChange({ ...exp, [key]: val });
  return (
    <View style={s.entryBlock}>
      <View style={s.entryHeader}>
        <Text style={s.entryTitle}>{exp.jobTitle || 'Nouvelle expérience'}</Text>
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
          <Text style={s.entryRemove}>Supprimer</Text>
        </TouchableOpacity>
      </View>
      <Field label="INTITULÉ DU POSTE" value={exp.jobTitle} onChangeText={set('jobTitle')} placeholder="Développeur Web" />
      <Field label="ENTREPRISE" value={exp.company} onChangeText={set('company')} placeholder="Acme Corp" />
      <Field label="LIEU" value={exp.location} onChangeText={set('location')} placeholder="Paris, France" />
      <View style={s.dateRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <DatePickerField label="DÉBUT" value={exp.startDate} onChange={set('startDate')} />
        </View>
        {!exp.current && (
          <View style={{ flex: 1 }}>
            <DatePickerField label="FIN" value={exp.endDate} onChange={set('endDate')} />
          </View>
        )}
      </View>
      <View style={s.switchRow}>
        <Text style={s.switchLabel}>Poste actuel</Text>
        <Switch
          value={exp.current}
          onValueChange={set('current')}
          trackColor={{ true: Colors.primary, false: Colors.rule2 }}
          thumbColor={Colors.white}
        />
      </View>
      <Field label="DESCRIPTION" value={exp.description} onChangeText={set('description')} placeholder="Développement d'applications..." multiline numberOfLines={3} />
    </View>
  );
}

function EducationEntry({ edu, onChange, onRemove }: { edu: Education; onChange: (e: Education) => void; onRemove: () => void }) {
  const set = (key: keyof Education) => (val: any) => onChange({ ...edu, [key]: val });
  return (
    <View style={s.entryBlock}>
      <View style={s.entryHeader}>
        <Text style={s.entryTitle}>{edu.degree || 'Nouvelle formation'}</Text>
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
          <Text style={s.entryRemove}>Supprimer</Text>
        </TouchableOpacity>
      </View>
      <Field label="DIPLÔME" value={edu.degree} onChangeText={set('degree')} placeholder="Master Informatique" />
      <Field label="ÉTABLISSEMENT" value={edu.school} onChangeText={set('school')} placeholder="Université Paris Cité" />
      <Field label="MENTION" value={edu.mention} onChangeText={set('mention')} placeholder="Très bien" />
      <View style={s.dateRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <DatePickerField label="DÉBUT" value={edu.startDate} onChange={set('startDate')} />
        </View>
        {!edu.current && (
          <View style={{ flex: 1 }}>
            <DatePickerField label="FIN" value={edu.endDate} onChange={set('endDate')} />
          </View>
        )}
      </View>
      <View style={s.switchRow}>
        <Text style={s.switchLabel}>En cours</Text>
        <Switch
          value={edu.current}
          onValueChange={set('current')}
          trackColor={{ true: Colors.primary, false: Colors.rule2 }}
          thumbColor={Colors.white}
        />
      </View>
      <Field label="DESCRIPTION" value={edu.description} onChangeText={set('description')} placeholder="Spécialisation en IA..." multiline numberOfLines={2} />
    </View>
  );
}

function StepParcours({ cvData, update }: any) {
  const addExp = () => update({ experience: [...cvData.experience, { id: uid(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }] });
  const editExp = (i: number) => (e: Experience) => { const arr = [...cvData.experience]; arr[i] = e; update({ experience: arr }); };
  const removeExp = (i: number) => { const arr = cvData.experience.filter((_: any, idx: number) => idx !== i); update({ experience: arr }); };

  const addEdu = () => update({ education: [...cvData.education, { id: uid(), degree: '', school: '', mention: '', startDate: '', endDate: '', current: false, description: '' }] });
  const editEdu = (i: number) => (e: Education) => { const arr = [...cvData.education]; arr[i] = e; update({ education: arr }); };
  const removeEdu = (i: number) => { const arr = cvData.education.filter((_: any, idx: number) => idx !== i); update({ education: arr }); };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Expériences</Text>
        <TouchableOpacity onPress={addExp} style={s.addBtn} activeOpacity={0.8}>
          <Text style={s.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      {cvData.experience.map((exp: Experience, i: number) => (
        <ExperienceEntry key={exp.id} exp={exp} onChange={editExp(i)} onRemove={() => removeExp(i)} />
      ))}
      {cvData.experience.length === 0 && <Text style={s.emptyNote}>Aucune expérience ajoutée.</Text>}

      <View style={[s.sectionHeader, { marginTop: Spacing.xl }]}>
        <Text style={s.sectionTitle}>Formations</Text>
        <TouchableOpacity onPress={addEdu} style={s.addBtn} activeOpacity={0.8}>
          <Text style={s.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      {cvData.education.map((edu: Education, i: number) => (
        <EducationEntry key={edu.id} edu={edu} onChange={editEdu(i)} onRemove={() => removeEdu(i)} />
      ))}
      {cvData.education.length === 0 && <Text style={s.emptyNote}>Aucune formation ajoutée.</Text>}
    </ScrollView>
  );
}

// ─── Step 3 : skills, languages, certifications, extras ──────────────────────

function SkillTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={s.skillTag}>
      <Text style={s.skillTagText}>{label}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={s.skillTagX}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const LEVELS = ['Débutant', 'Intermédiaire', 'Courant', 'Bilingue', 'Natif'];

function StepCompetences({ cvData, update }: any) {
  const [skillInput, setSkillInput] = useState('');
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState('Courant');
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certDate, setCertDate] = useState('');

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const skills = [...cvData.skills];
    val.split(',').map(s => s.trim()).filter(Boolean).forEach(s => { if (!skills.includes(s)) skills.push(s); });
    update({ skills });
    setSkillInput('');
  };
  const removeSkill = (i: number) => update({ skills: cvData.skills.filter((_: string, idx: number) => idx !== i) });

  const addLang = () => {
    if (!langName.trim()) return;
    update({ languages: [...cvData.languages, { id: uid(), name: langName.trim(), level: langLevel }] });
    setLangName('');
  };
  const removeLang = (i: number) => update({ languages: cvData.languages.filter((_: Language, idx: number) => idx !== i) });

  const addCert = () => {
    if (!certName.trim()) return;
    update({ certifications: [...cvData.certifications, { id: uid(), name: certName.trim(), organization: certOrg.trim(), date: certDate.trim() }] });
    setCertName(''); setCertOrg(''); setCertDate('');
  };
  const removeCert = (i: number) => update({ certifications: cvData.certifications.filter((_: Certification, idx: number) => idx !== i) });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Skills */}
      <Text style={s.sectionTitle}>Compétences</Text>
      <View style={s.skillInputRow}>
        <TextInput
          style={[s.input, { flex: 1, marginRight: 8 }]}
          value={skillInput}
          onChangeText={setSkillInput}
          placeholder="React, Python, Excel…"
          placeholderTextColor={Colors.ink3}
          onSubmitEditing={addSkill}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addSkill} style={s.addInlineBtn} activeOpacity={0.8}>
          <Text style={s.addInlineBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.inputHint}>Séparez par des virgules ou ajoutez une à la fois.</Text>
      <View style={s.skillTags}>
        {cvData.skills.map((sk: string, i: number) => (
          <SkillTag key={i} label={sk} onRemove={() => removeSkill(i)} />
        ))}
      </View>

      {/* Languages */}
      <Text style={[s.sectionTitle, { marginTop: Spacing.xl }]}>Langues</Text>
      <View style={s.langInputRow}>
        <TextInput
          style={[s.input, { flex: 1, marginRight: 8 }]}
          value={langName}
          onChangeText={setLangName}
          placeholder="Anglais"
          placeholderTextColor={Colors.ink3}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          {LEVELS.map(lv => (
            <TouchableOpacity
              key={lv}
              onPress={() => setLangLevel(lv)}
              style={[s.levelChip, langLevel === lv && s.levelChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[s.levelChipText, langLevel === lv && s.levelChipTextActive]}>{lv}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity onPress={addLang} style={[s.addBtn, { marginBottom: Spacing.md }]} activeOpacity={0.8}>
        <Text style={s.addBtnText}>+ Ajouter la langue</Text>
      </TouchableOpacity>
      {cvData.languages.map((lang: Language, i: number) => (
        <View key={lang.id} style={s.langRow}>
          <Text style={s.langName}>{lang.name}</Text>
          <Text style={s.langLevel}>{lang.level}</Text>
          <TouchableOpacity onPress={() => removeLang(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.entryRemove}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Certifications */}
      <Text style={[s.sectionTitle, { marginTop: Spacing.xl }]}>Certifications</Text>
      <Field label="NOM" value={certName} onChangeText={setCertName} placeholder="AWS Certified Developer" />
      <Field label="ORGANISME" value={certOrg} onChangeText={setCertOrg} placeholder="Amazon Web Services" />
      <DatePickerField label="DATE" value={certDate} onChange={setCertDate} />
      <TouchableOpacity onPress={addCert} style={[s.addBtn, { marginBottom: Spacing.md }]} activeOpacity={0.8}>
        <Text style={s.addBtnText}>+ Ajouter la certification</Text>
      </TouchableOpacity>
      {cvData.certifications.map((cert: Certification, i: number) => (
        <View key={cert.id} style={s.certRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.certName}>{cert.name}</Text>
            {cert.organization ? <Text style={s.certOrg}>{cert.organization}</Text> : null}
          </View>
          <TouchableOpacity onPress={() => removeCert(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.entryRemove}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Extras */}
      <Text style={[s.sectionTitle, { marginTop: Spacing.xl }]}>Autres informations</Text>
      <Field label="LOISIRS & INTÉRÊTS" value={cvData.hobbies} onChangeText={(v: string) => update({ hobbies: v })} placeholder="Photographie, randonnée, lecture..." multiline numberOfLines={2} />
      <Field label="RÉFÉRENCES" value={cvData.references} onChangeText={(v: string) => update({ references: v })} placeholder="Disponibles sur demande" />
    </ScrollView>
  );
}

// ─── Step 4 : template + color ───────────────────────────────────────────────

const TEMPLATE_COLORS: Record<string, string> = {
  modern: '#1A5EAB', professional: '#1F2937', creative: '#7C3AED',
  simple: '#374151', canadian: '#D00000', europass: '#003399', ats: '#111111',
};

function StepStyle({ cvData, update }: any) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={s.sectionTitle}>Modèle de CV</Text>
      {TEMPLATES.map(tpl => (
        <TouchableOpacity
          key={tpl.key}
          onPress={() => update({ template: tpl.key })}
          style={[s.tplRow, cvData.template === tpl.key && s.tplRowActive]}
          activeOpacity={0.8}
        >
          <View style={[s.tplRowThumb, { borderTopColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary }]}>
            <View style={[s.tplRowBar, { width: '80%', backgroundColor: TEMPLATE_COLORS[tpl.key] ?? Colors.primary, opacity: 0.8 }]} />
            <View style={[s.tplRowBar, { width: '55%', marginTop: 4 }]} />
            <View style={[s.tplRowBar, { width: '65%', marginTop: 3 }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.tplRowName}>{tpl.label}</Text>
            <Text style={s.tplRowBadge}>{tpl.badge}</Text>
          </View>
          {cvData.template === tpl.key && <Text style={s.tplRowCheck}>✓</Text>}
        </TouchableOpacity>
      ))}

      <Text style={[s.sectionTitle, { marginTop: Spacing.xl }]}>Couleur principale</Text>
      <View style={s.palette}>
        {PALETTE.map(color => (
          <TouchableOpacity
            key={color}
            onPress={() => update({ color })}
            style={[s.colorDot, { backgroundColor: color }, cvData.color === color && s.colorDotActive]}
            activeOpacity={0.8}
          />
        ))}
      </View>
      <Text style={s.inputHint}>La couleur s'applique aux titres, accents et barres selon le modèle.</Text>
    </ScrollView>
  );
}

// ─── Main builder screen ──────────────────────────────────────────────────────

export default function BuilderScreen() {
  const router = useRouter();
  const { cvData, photo, update, savePhoto, save } = useCV();
  const [step, setStep] = useState(0);

  const goNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      await save(cvData);
      router.push('/preview');
    }
  };

  const goPrev = () => {
    if (step > 0) setStep(s => s - 1);
    else router.back();
  };

  const stepProps = { cvData, update, photo, savePhoto };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.paper }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Step indicator */}
      <View style={s.stepBar}>
        {STEPS.map((label, i) => (
          <TouchableOpacity key={i} onPress={() => setStep(i)} style={s.stepItem} activeOpacity={0.7}>
            <View style={[s.stepDot, i === step && s.stepDotActive, i < step && s.stepDotDone]}>
              <Text style={[s.stepDotText, (i === step || i < step) && s.stepDotTextActive]}>
                {i < step ? '✓' : String(i + 1)}
              </Text>
            </View>
            <Text style={[s.stepLabel, i === step && s.stepLabelActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.stepProgress}>
        <View style={[s.stepProgressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
      </View>

      {/* Content */}
      <View style={s.content}>
        {step === 0 && <StepIdentity {...stepProps} />}
        {step === 1 && <StepParcours {...stepProps} />}
        {step === 2 && <StepCompetences {...stepProps} />}
        {step === 3 && <StepStyle {...stepProps} />}
      </View>

      {/* Banner ad — above navigation */}
      <AdBanner />

      {/* Navigation */}
      <View style={s.navBar}>
        <TouchableOpacity onPress={goPrev} style={s.navBack} activeOpacity={0.8}>
          <Text style={s.navBackText}>← {step === 0 ? 'Quitter' : 'Retour'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goNext} style={s.navNext} activeOpacity={0.85}>
          <Text style={s.navNextText}>
            {step < STEPS.length - 1 ? 'Suivant →' : 'Aperçu →'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  // Step bar
  stepBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
  },
  stepItem: { flex: 1, alignItems: 'center' },
  stepDot: {
    width: 28, height: 28,
    borderWidth: 1.5, borderColor: Colors.rule2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepDotDone: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepDotText: { fontFamily: 'Inter-Bold', fontSize: 12, color: Colors.ink3 },
  stepDotTextActive: { color: Colors.white },
  stepLabel: { fontSize: 10, color: Colors.ink3, textAlign: 'center' },
  stepLabelActive: { fontFamily: 'Inter-Bold', color: Colors.primary },

  stepProgress: {
    height: 2,
    backgroundColor: Colors.rule,
  },
  stepProgressFill: {
    height: 2,
    backgroundColor: Colors.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },

  // Nav bar
  navBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.rule,
    backgroundColor: Colors.paper,
    gap: 12,
  },
  navBack: {
    flex: 1,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.rule2,
    alignItems: 'center',
  },
  navBackText: { fontFamily: 'Inter-Medium', fontSize: FontSize.sm, color: Colors.ink2 },
  navNext: {
    flex: 2,
    paddingVertical: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  navNextText: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.white },

  // Form
  field: { marginBottom: Spacing.md },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.ink3,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.sm,
    color: Colors.ink,
  },
  inputHint: {
    fontSize: 11,
    color: Colors.ink3,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },

  // Photo
  photoSection: { alignItems: 'center', paddingVertical: Spacing.lg },
  photoZone: {
    width: 120, height: 120,
    borderWidth: 1.5,
    borderColor: Colors.rule2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: Colors.surface2,
  },
  photoPreview: { width: 120, height: 120 },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderIcon: { fontSize: 28, color: Colors.ink3 },
  photoPlaceholderText: { fontSize: 11, color: Colors.ink3, marginTop: 4 },
  photoRemove: { marginTop: Spacing.sm },
  photoRemoveText: { fontSize: FontSize.sm, color: Colors.error },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.base,
    color: Colors.ink,
    marginBottom: Spacing.md,
  },
  addBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addBtnText: { fontFamily: 'Inter-Medium', fontSize: FontSize.sm, color: Colors.primary },

  emptyNote: {
    fontSize: FontSize.sm,
    color: Colors.ink3,
    marginBottom: Spacing.md,
  },

  // Entry blocks
  entryBlock: {
    borderWidth: 1,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  entryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FontSize.sm,
    color: Colors.ink,
    flex: 1,
  },
  entryRemove: {
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  dateRow: { flexDirection: 'row' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
  },

  // Skills
  skillInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addInlineBtn: {
    width: 44, height: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addInlineBtnText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.white,
    lineHeight: 28,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  skillTagText: { fontFamily: 'Inter-Medium', fontSize: FontSize.sm, color: Colors.primary },
  skillTagX: { fontSize: 16, color: Colors.primary, lineHeight: 18 },

  // Languages
  langInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: 8 },
  levelChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.rule,
    marginRight: 6,
  },
  levelChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  levelChipText: { fontSize: 11, color: Colors.ink3 },
  levelChipTextActive: { color: Colors.white },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
    gap: 12,
  },
  langName: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.ink, flex: 1 },
  langLevel: { fontSize: FontSize.sm, color: Colors.ink3 },

  // Certifications
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
  },
  certName: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.ink },
  certOrg: { fontSize: FontSize.xs, color: Colors.ink3 },

  // Template selection
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
  tplRowThumb: {
    width: 60, height: 70,
    backgroundColor: Colors.surface2,
    padding: 8,
    borderTopWidth: 3,
  },
  tplRowBar: { height: 4, backgroundColor: Colors.rule2 },
  tplRowName: { fontFamily: 'Inter-Bold', fontSize: FontSize.sm, color: Colors.ink },
  tplRowBadge: { fontSize: FontSize.xs, color: Colors.ink3, marginTop: 2 },
  tplRowCheck: { fontFamily: 'Inter-Bold', fontSize: 16, color: Colors.primary },

  // Palette
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.sm,
  },
  colorDot: {
    width: 36, height: 36,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: Colors.ink,
  },

  // Date picker field button
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateBtnText: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.sm,
    color: Colors.ink,
  },
  dateBtnChevron: {
    fontSize: 12,
    color: Colors.ink3,
  },

  // Date picker modal
  dpBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dpCard: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  dpYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: 24,
  },
  dpArrow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dpArrowText: {
    fontSize: 24,
    color: Colors.primary,
    lineHeight: 28,
  },
  dpYearText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.ink,
    minWidth: 64,
    textAlign: 'center',
  },
  dpMonthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  dpMonthCell: {
    width: '22%',
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.rule,
  },
  dpMonthCellActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dpMonthText: {
    fontSize: FontSize.sm,
    color: Colors.ink2,
    fontFamily: 'Inter-Medium',
  },
  dpMonthTextActive: {
    color: Colors.white,
  },
  dpActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dpClearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.rule,
  },
  dpClearText: {
    fontSize: FontSize.sm,
    color: Colors.ink3,
    fontFamily: 'Inter-Medium',
  },
  dpConfirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: Colors.primary,
  },
  dpConfirmText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontFamily: 'Inter-Medium',
  },
});

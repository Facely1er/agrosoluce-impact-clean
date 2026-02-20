import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  BookOpen,
  Shield,
  Globe,
  Users,
  Award,
  Target,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Download,
  RotateCcw,
  Clock,
  XCircle,
  Satellite,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { saveBuyerEUDRAssessment } from '@/lib/api/buyersApi';

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = 'en' | 'fr';
type View = 'start' | 'manual' | 'assessment' | 'results';
type RiskLevel = 'low' | 'standard' | 'high';
type CompanySize = 'large' | 'sme' | 'micro';

interface CompanyInfo {
  'company-name': string;
  'primary-commodity': string;
  'secondary-commodities': string[];
  'source-countries': string[];
  'company-size': CompanySize | '';
  'supply-chain-role': string[];
  'annual-volume': string;
  'years-in-business': string;
}

interface Gap {
  id: string;
  section: string;
  title: string;
  priority: 'critical' | 'high' | 'medium';
  action: string;
}

interface AssessmentResults {
  scores: Record<string, number>;
  gaps: Record<string, Gap[]>;
  criticalGaps: Gap[];
  overallScore: number;
  riskLevel: RiskLevel;
  complianceDeadline: string;
  daysRemaining: number;
  companyProfile: CompanyInfo;
  commodity: string;
  certificationBenefit: number;
  actionPlan: Gap[];
}

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    title: 'EUDR Self-Assessment',
    subtitle: 'EU Regulation 2023/1115 Compliance Tool',
    description: 'Evaluate your readiness for the EU Deforestation Regulation. Get a compliance score, identify critical gaps, and receive a tailored action plan.',
    startAssessment: 'Start Assessment',
    userManual: 'User Manual',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'View My Results',
    downloadReport: 'Download Report',
    startOver: 'Start New Assessment',
    saving: 'Saving…',
    saved: 'Assessment saved',
    errorSaving: 'Could not save assessment',
    commodities: { cocoa: 'Cocoa & Chocolate', coffee: 'Coffee', 'palm-oil': 'Palm Oil', soya: 'Soya Products', cattle: 'Cattle Products', wood: 'Wood Products', rubber: 'Natural Rubber' },
    riskLabels: { low: 'Low Risk', standard: 'Standard Risk', high: 'High Risk' },
    riskColors: { low: 'green', standard: 'yellow', high: 'red' },
    complianceLevels: [
      { label: 'EU Compliant', range: '85–100%', color: 'green' },
      { label: 'Largely Compliant', range: '70–84%', color: 'blue' },
      { label: 'Partially Compliant', range: '50–69%', color: 'yellow' },
      { label: 'Major Gaps', range: '30–49%', color: 'orange' },
      { label: 'Critical Non-Compliance', range: '0–29%', color: 'red' },
    ],
    deadlines: { large: 'December 30, 2024', sme: 'June 30, 2025', micro: 'December 30, 2025' },
    sections: ['Company Profile', 'Certifications', 'Due Diligence', 'Traceability', 'Deforestation Monitoring', 'Stakeholder Engagement', 'Documentation & Reporting'],
  },
  fr: {
    title: 'Auto-Évaluation EUDR',
    subtitle: 'Outil de Conformité au Règlement UE 2023/1115',
    description: 'Évaluez votre préparation au Règlement UE sur la Déforestation. Obtenez un score de conformité, identifiez les lacunes critiques et recevez un plan d\'action personnalisé.',
    startAssessment: 'Commencer l\'évaluation',
    userManual: 'Manuel d\'utilisation',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Voir mes résultats',
    downloadReport: 'Télécharger le rapport',
    startOver: 'Nouvelle évaluation',
    saving: 'Sauvegarde…',
    saved: 'Évaluation sauvegardée',
    errorSaving: 'Impossible de sauvegarder',
    commodities: { cocoa: 'Cacao et Chocolat', coffee: 'Café', 'palm-oil': 'Huile de Palme', soya: 'Produits de Soja', cattle: 'Produits Bovins', wood: 'Produits du Bois', rubber: 'Caoutchouc Naturel' },
    riskLabels: { low: 'Risque Faible', standard: 'Risque Standard', high: 'Risque Élevé' },
    riskColors: { low: 'green', standard: 'yellow', high: 'red' },
    complianceLevels: [
      { label: 'Conforme UE', range: '85–100%', color: 'green' },
      { label: 'Largement Conforme', range: '70–84%', color: 'blue' },
      { label: 'Partiellement Conforme', range: '50–69%', color: 'yellow' },
      { label: 'Lacunes Majeures', range: '30–49%', color: 'orange' },
      { label: 'Non-Conformité Critique', range: '0–29%', color: 'red' },
    ],
    deadlines: { large: '30 décembre 2024', sme: '30 juin 2025', micro: '30 décembre 2025' },
    sections: ['Profil Entreprise', 'Certifications', 'Diligence Raisonnée', 'Traçabilité', 'Surveillance Déforestation', 'Engagement Parties Prenantes', 'Documentation & Rapports'],
  },
} as const;

// ─── Assessment Questions ─────────────────────────────────────────────────────

interface Question {
  id: string;
  text: { en: string; fr: string };
  type: 'radio' | 'checkbox' | 'select' | 'text';
  options?: { value: string; label: { en: string; fr: string }; score: number }[];
  weight: number;
  isCritical?: boolean;
}

interface Section {
  id: string;
  weight: number;
  questions: Question[];
}

const ASSESSMENT_SECTIONS: Section[] = [
  {
    id: 'profile',
    weight: 0,
    questions: [
      {
        id: 'primary-commodity',
        text: { en: 'What is your primary commodity?', fr: 'Quelle est votre matière première principale ?' },
        type: 'select',
        weight: 0,
        options: [
          { value: 'cocoa', label: { en: 'Cocoa & Chocolate', fr: 'Cacao et Chocolat' }, score: 0 },
          { value: 'coffee', label: { en: 'Coffee', fr: 'Café' }, score: 0 },
          { value: 'palm-oil', label: { en: 'Palm Oil', fr: 'Huile de Palme' }, score: 0 },
          { value: 'soya', label: { en: 'Soya Products', fr: 'Produits de Soja' }, score: 0 },
          { value: 'cattle', label: { en: 'Cattle Products', fr: 'Produits Bovins' }, score: 0 },
          { value: 'wood', label: { en: 'Wood Products', fr: 'Produits du Bois' }, score: 0 },
          { value: 'rubber', label: { en: 'Natural Rubber', fr: 'Caoutchouc Naturel' }, score: 0 },
        ],
      },
      {
        id: 'company-size',
        text: { en: 'What is your company size?', fr: 'Quelle est la taille de votre entreprise ?' },
        type: 'radio',
        weight: 0,
        options: [
          { value: 'large', label: { en: 'Large (revenue > €40M)', fr: 'Grande (CA > 40 M€)' }, score: 0 },
          { value: 'sme', label: { en: 'SME (revenue €10–40M)', fr: 'PME (CA 10–40 M€)' }, score: 0 },
          { value: 'micro', label: { en: 'Micro (revenue < €10M)', fr: 'Micro (CA < 10 M€)' }, score: 0 },
        ],
      },
      {
        id: 'supply-chain-role',
        text: { en: 'What is your role in the supply chain? (select all that apply)', fr: 'Quel est votre rôle dans la chaîne d\'approvisionnement ? (sélectionner tout ce qui s\'applique)' },
        type: 'checkbox',
        weight: 0,
        options: [
          { value: 'operator', label: { en: 'Operator (place goods on EU market)', fr: 'Opérateur (mise sur le marché UE)' }, score: 0 },
          { value: 'trader', label: { en: 'Trader (buy & sell within EU)', fr: 'Négociant (achat et vente dans l\'UE)' }, score: 0 },
          { value: 'importer', label: { en: 'Importer', fr: 'Importateur' }, score: 0 },
          { value: 'manufacturer', label: { en: 'Manufacturer / Processor', fr: 'Fabricant / Transformateur' }, score: 0 },
          { value: 'retailer', label: { en: 'Retailer', fr: 'Détaillant' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'certifications',
    weight: 15,
    questions: [
      {
        id: 'cert-exists',
        text: { en: 'Do you hold any current sustainability certification relevant to EUDR?', fr: 'Détenez-vous une certification de durabilité actuelle pertinente pour l\'EUDR ?' },
        type: 'radio',
        weight: 20,
        isCritical: false,
        options: [
          { value: 'yes-full', label: { en: 'Yes – full supply chain coverage', fr: 'Oui – couverture totale de la chaîne' }, score: 100 },
          { value: 'yes-partial', label: { en: 'Yes – partial coverage only', fr: 'Oui – couverture partielle seulement' }, score: 60 },
          { value: 'in-progress', label: { en: 'Certification in progress', fr: 'Certification en cours' }, score: 30 },
          { value: 'no', label: { en: 'No certification', fr: 'Aucune certification' }, score: 0 },
        ],
      },
      {
        id: 'cert-type',
        text: { en: 'Which certifications do you hold? (select all that apply)', fr: 'Quelles certifications détenez-vous ?' },
        type: 'checkbox',
        weight: 15,
        options: [
          { value: 'rainforest-alliance', label: { en: 'Rainforest Alliance', fr: 'Rainforest Alliance' }, score: 80 },
          { value: 'fair-trade', label: { en: 'Fair Trade', fr: 'Fair Trade' }, score: 70 },
          { value: 'rspo', label: { en: 'RSPO (Palm Oil)', fr: 'RSPO (Huile de palme)' }, score: 90 },
          { value: 'fsc', label: { en: 'FSC (Wood/Forestry)', fr: 'FSC (Bois/Foresterie)' }, score: 90 },
          { value: 'rtrs', label: { en: 'RTRS (Soya)', fr: 'RTRS (Soja)' }, score: 85 },
          { value: 'organic-eu', label: { en: 'EU Organic', fr: 'Agriculture biologique UE' }, score: 60 },
          { value: 'none', label: { en: 'None', fr: 'Aucune' }, score: 0 },
        ],
      },
      {
        id: 'cert-chain-of-custody',
        text: { en: 'Do you have a chain of custody certification?', fr: 'Avez-vous une certification de chaîne de custody ?' },
        type: 'radio',
        weight: 15,
        options: [
          { value: 'yes', label: { en: 'Yes', fr: 'Oui' }, score: 100 },
          { value: 'partial', label: { en: 'Partial / in progress', fr: 'Partielle / en cours' }, score: 50 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'due-diligence',
    weight: 25,
    questions: [
      {
        id: 'dd-policy',
        text: { en: 'Do you have a formal written deforestation-free policy?', fr: 'Disposez-vous d\'une politique écrite formelle sans déforestation ?' },
        type: 'radio',
        weight: 30,
        isCritical: true,
        options: [
          { value: 'yes-public', label: { en: 'Yes – publicly available', fr: 'Oui – publiquement disponible' }, score: 100 },
          { value: 'yes-internal', label: { en: 'Yes – internal policy only', fr: 'Oui – politique interne uniquement' }, score: 70 },
          { value: 'developing', label: { en: 'Currently developing', fr: 'En cours d\'élaboration' }, score: 30 },
          { value: 'no', label: { en: 'No policy exists', fr: 'Aucune politique' }, score: 0 },
        ],
      },
      {
        id: 'dd-risk-assessment',
        text: { en: 'Do you conduct a documented risk assessment of your supply chain?', fr: 'Effectuez-vous une évaluation documentée des risques de votre chaîne d\'approvisionnement ?' },
        type: 'radio',
        weight: 30,
        isCritical: true,
        options: [
          { value: 'yes-comprehensive', label: { en: 'Yes – comprehensive and documented', fr: 'Oui – complète et documentée' }, score: 100 },
          { value: 'yes-informal', label: { en: 'Yes – but informal', fr: 'Oui – mais informelle' }, score: 50 },
          { value: 'developing', label: { en: 'Developing methodology', fr: 'Méthodologie en développement' }, score: 20 },
          { value: 'no', label: { en: 'No risk assessment', fr: 'Aucune évaluation des risques' }, score: 0 },
        ],
      },
      {
        id: 'dd-mitigation',
        text: { en: 'Do you have mitigation measures for identified deforestation risks?', fr: 'Avez-vous des mesures d\'atténuation pour les risques de déforestation identifiés ?' },
        type: 'radio',
        weight: 20,
        options: [
          { value: 'yes-implemented', label: { en: 'Yes – implemented and monitored', fr: 'Oui – mises en œuvre et surveillées' }, score: 100 },
          { value: 'yes-partial', label: { en: 'Yes – partially implemented', fr: 'Oui – partiellement mises en œuvre' }, score: 60 },
          { value: 'planned', label: { en: 'Planned but not yet implemented', fr: 'Prévues mais pas encore mises en œuvre' }, score: 20 },
          { value: 'no', label: { en: 'No mitigation measures', fr: 'Aucune mesure d\'atténuation' }, score: 0 },
        ],
      },
      {
        id: 'dd-monitoring',
        text: { en: 'Do you have a monitoring and corrective action procedure?', fr: 'Disposez-vous d\'une procédure de surveillance et d\'action corrective ?' },
        type: 'radio',
        weight: 20,
        options: [
          { value: 'yes', label: { en: 'Yes – formal procedure in place', fr: 'Oui – procédure formelle en place' }, score: 100 },
          { value: 'informal', label: { en: 'Informal process', fr: 'Processus informel' }, score: 40 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'traceability',
    weight: 25,
    questions: [
      {
        id: 'trace-gps',
        text: { en: 'Do you collect GPS coordinates (≥6 decimal places) for all production plots?', fr: 'Collectez-vous des coordonnées GPS (≥6 décimales) pour toutes les parcelles de production ?' },
        type: 'radio',
        weight: 35,
        isCritical: true,
        options: [
          { value: 'yes-all', label: { en: 'Yes – for 100% of supply volume', fr: 'Oui – pour 100% du volume' }, score: 100 },
          { value: 'yes-majority', label: { en: 'Yes – for >75% of supply', fr: 'Oui – pour >75% de l\'approvisionnement' }, score: 70 },
          { value: 'yes-some', label: { en: 'Yes – for <75% of supply', fr: 'Oui – pour <75% de l\'approvisionnement' }, score: 35 },
          { value: 'collecting', label: { en: 'Currently collecting', fr: 'En cours de collecte' }, score: 15 },
          { value: 'no', label: { en: 'No GPS data', fr: 'Pas de données GPS' }, score: 0 },
        ],
      },
      {
        id: 'trace-mapping',
        text: { en: 'Can you map your supply chain to the farm/plantation level?', fr: 'Pouvez-vous cartographier votre chaîne d\'approvisionnement jusqu\'au niveau de la ferme/plantation ?' },
        type: 'radio',
        weight: 30,
        isCritical: true,
        options: [
          { value: 'yes-full', label: { en: 'Yes – complete farm-level mapping', fr: 'Oui – cartographie complète au niveau de la ferme' }, score: 100 },
          { value: 'yes-partial', label: { en: 'Yes – partial (cooperative/region level)', fr: 'Oui – partielle (niveau coopérative/région)' }, score: 50 },
          { value: 'developing', label: { en: 'Developing capability', fr: 'Capacité en développement' }, score: 20 },
          { value: 'no', label: { en: 'No farm-level traceability', fr: 'Aucune traçabilité au niveau de la ferme' }, score: 0 },
        ],
      },
      {
        id: 'trace-production-dates',
        text: { en: 'Can you verify that production occurred after December 31, 2020 (EUDR cut-off)?', fr: 'Pouvez-vous vérifier que la production a eu lieu après le 31 décembre 2020 (date limite EUDR) ?' },
        type: 'radio',
        weight: 25,
        isCritical: true,
        options: [
          { value: 'yes-documented', label: { en: 'Yes – fully documented', fr: 'Oui – entièrement documenté' }, score: 100 },
          { value: 'yes-partial', label: { en: 'Yes – partially documented', fr: 'Oui – partiellement documenté' }, score: 50 },
          { value: 'no', label: { en: 'Cannot verify production dates', fr: 'Impossible de vérifier les dates de production' }, score: 0 },
        ],
      },
      {
        id: 'trace-volume',
        text: { en: 'Do you track volumes and perform mass balance reconciliation?', fr: 'Suivez-vous les volumes et effectuez-vous une réconciliation du bilan massique ?' },
        type: 'radio',
        weight: 10,
        options: [
          { value: 'yes', label: { en: 'Yes – systematic tracking', fr: 'Oui – suivi systématique' }, score: 100 },
          { value: 'partial', label: { en: 'Partial tracking', fr: 'Suivi partiel' }, score: 50 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'monitoring',
    weight: 15,
    questions: [
      {
        id: 'mon-satellite',
        text: { en: 'Do you use satellite monitoring to verify no deforestation in supply areas?', fr: 'Utilisez-vous la surveillance par satellite pour vérifier l\'absence de déforestation dans les zones d\'approvisionnement ?' },
        type: 'radio',
        weight: 40,
        isCritical: true,
        options: [
          { value: 'yes-realtime', label: { en: 'Yes – near real-time monitoring', fr: 'Oui – surveillance quasi temps réel' }, score: 100 },
          { value: 'yes-periodic', label: { en: 'Yes – periodic (≥2x/year)', fr: 'Oui – périodique (≥2x/an)' }, score: 75 },
          { value: 'yes-annual', label: { en: 'Yes – annual', fr: 'Oui – annuelle' }, score: 50 },
          { value: 'planning', label: { en: 'Planning to implement', fr: 'Prévu' }, score: 15 },
          { value: 'no', label: { en: 'No satellite monitoring', fr: 'Aucune surveillance par satellite' }, score: 0 },
        ],
      },
      {
        id: 'mon-alerts',
        text: { en: 'Do you have a deforestation alert system?', fr: 'Disposez-vous d\'un système d\'alerte déforestation ?' },
        type: 'radio',
        weight: 35,
        options: [
          { value: 'yes-automated', label: { en: 'Yes – automated alerts', fr: 'Oui – alertes automatisées' }, score: 100 },
          { value: 'yes-manual', label: { en: 'Yes – manual review', fr: 'Oui – revue manuelle' }, score: 60 },
          { value: 'no', label: { en: 'No alert system', fr: 'Aucun système d\'alerte' }, score: 0 },
        ],
      },
      {
        id: 'mon-ground-verify',
        text: { en: 'Do you conduct ground verification of satellite findings?', fr: 'Effectuez-vous une vérification au sol des résultats satellite ?' },
        type: 'radio',
        weight: 25,
        options: [
          { value: 'yes', label: { en: 'Yes – systematic ground verification', fr: 'Oui – vérification systématique au sol' }, score: 100 },
          { value: 'sometimes', label: { en: 'Sometimes / case by case', fr: 'Parfois / au cas par cas' }, score: 50 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'stakeholders',
    weight: 10,
    questions: [
      {
        id: 'sh-farmer-training',
        text: { en: 'Do you provide farmers with training on sustainable practices and EUDR requirements?', fr: 'Fournissez-vous aux agriculteurs une formation sur les pratiques durables et les exigences EUDR ?' },
        type: 'radio',
        weight: 35,
        options: [
          { value: 'yes-regular', label: { en: 'Yes – regular, structured training', fr: 'Oui – formation régulière et structurée' }, score: 100 },
          { value: 'yes-occasional', label: { en: 'Yes – occasional', fr: 'Oui – occasionnelle' }, score: 60 },
          { value: 'developing', label: { en: 'Developing program', fr: 'Programme en développement' }, score: 20 },
          { value: 'no', label: { en: 'No training', fr: 'Aucune formation' }, score: 0 },
        ],
      },
      {
        id: 'sh-grievance',
        text: { en: 'Do you have a community grievance mechanism?', fr: 'Disposez-vous d\'un mécanisme de réclamation communautaire ?' },
        type: 'radio',
        weight: 35,
        options: [
          { value: 'yes-formal', label: { en: 'Yes – formal and accessible', fr: 'Oui – formel et accessible' }, score: 100 },
          { value: 'yes-informal', label: { en: 'Yes – informal channel', fr: 'Oui – canal informel' }, score: 50 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
      {
        id: 'sh-incentives',
        text: { en: 'Do you provide financial incentives or premiums for compliance?', fr: 'Fournissez-vous des incitations financières ou des primes pour la conformité ?' },
        type: 'radio',
        weight: 30,
        options: [
          { value: 'yes', label: { en: 'Yes', fr: 'Oui' }, score: 100 },
          { value: 'planned', label: { en: 'Planned', fr: 'Prévu' }, score: 30 },
          { value: 'no', label: { en: 'No', fr: 'Non' }, score: 0 },
        ],
      },
    ],
  },
  {
    id: 'documentation',
    weight: 10,
    questions: [
      {
        id: 'doc-system',
        text: { en: 'Do you have a comprehensive documentation management system?', fr: 'Disposez-vous d\'un système complet de gestion documentaire ?' },
        type: 'radio',
        weight: 30,
        isCritical: true,
        options: [
          { value: 'yes-digital', label: { en: 'Yes – digital, structured system', fr: 'Oui – système numérique structuré' }, score: 100 },
          { value: 'yes-mixed', label: { en: 'Yes – mixed digital/paper', fr: 'Oui – numérique/papier mixte' }, score: 60 },
          { value: 'yes-paper', label: { en: 'Yes – paper-based only', fr: 'Oui – papier uniquement' }, score: 30 },
          { value: 'no', label: { en: 'No formal system', fr: 'Aucun système formel' }, score: 0 },
        ],
      },
      {
        id: 'doc-due-diligence-statements',
        text: { en: 'Are you prepared to submit due diligence statements for each commodity shipment to the EU?', fr: 'Êtes-vous prêt à soumettre des déclarations de diligence raisonnée pour chaque expédition vers l\'UE ?' },
        type: 'radio',
        weight: 40,
        isCritical: true,
        options: [
          { value: 'yes-ready', label: { en: 'Yes – fully ready', fr: 'Oui – entièrement prêt' }, score: 100 },
          { value: 'yes-partial', label: { en: 'Working on it', fr: 'En cours' }, score: 40 },
          { value: 'no', label: { en: 'No – not yet prepared', fr: 'Non – pas encore prêt' }, score: 0 },
        ],
      },
      {
        id: 'doc-audit',
        text: { en: 'Do you conduct internal audits of your EUDR compliance systems?', fr: 'Effectuez-vous des audits internes de vos systèmes de conformité EUDR ?' },
        type: 'radio',
        weight: 30,
        options: [
          { value: 'yes-regular', label: { en: 'Yes – annually or more', fr: 'Oui – annuellement ou plus' }, score: 100 },
          { value: 'yes-adhoc', label: { en: 'Yes – ad hoc', fr: 'Oui – ponctuel' }, score: 50 },
          { value: 'no', label: { en: 'No internal audits', fr: 'Aucun audit interne' }, score: 0 },
        ],
      },
    ],
  },
];

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function calculateResults(
  responses: Record<string, string | string[]>,
  companyInfo: CompanyInfo,
  lang: Language
): AssessmentResults {
  const sectionScores: Record<string, number> = {};
  const allGaps: Record<string, Gap[]> = {};

  for (const section of ASSESSMENT_SECTIONS) {
    if (section.id === 'profile') continue;

    let sectionTotal = 0;
    let sectionWeight = 0;
    const gaps: Gap[] = [];

    for (const question of section.questions) {
      const response = responses[question.id];
      if (!response) continue;

      let questionScore = 0;
      if (question.type === 'radio' || question.type === 'select') {
        const opt = question.options?.find(o => o.value === response);
        questionScore = opt?.score ?? 0;
      } else if (question.type === 'checkbox' && Array.isArray(response)) {
        if (response.includes('none') || response.length === 0) {
          questionScore = 0;
        } else {
          const scores = (response as string[]).map(v => {
            const opt = question.options?.find(o => o.value === v);
            return opt?.score ?? 0;
          });
          questionScore = Math.min(100, scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1));
        }
      }

      sectionTotal += questionScore * question.weight;
      sectionWeight += question.weight;

      if (questionScore < 50 && question.isCritical) {
        gaps.push({
          id: question.id,
          section: section.id,
          title: question.text[lang],
          priority: questionScore === 0 ? 'critical' : 'high',
          action: getGapAction(question.id, lang),
        });
      } else if (questionScore < 50) {
        gaps.push({
          id: question.id,
          section: section.id,
          title: question.text[lang],
          priority: 'medium',
          action: getGapAction(question.id, lang),
        });
      }
    }

    const score = sectionWeight > 0 ? Math.round(sectionTotal / sectionWeight) : 0;
    sectionScores[section.id] = score;
    if (gaps.length > 0) allGaps[section.id] = gaps;
  }

  // Weighted overall score
  let totalWeightedScore = 0;
  let totalWeight = 0;
  for (const section of ASSESSMENT_SECTIONS) {
    if (section.id === 'profile' || section.weight === 0) continue;
    totalWeightedScore += (sectionScores[section.id] ?? 0) * section.weight;
    totalWeight += section.weight;
  }
  const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  const criticalGaps = Object.values(allGaps).flat().filter(g => g.priority === 'critical');
  const actionPlan = Object.values(allGaps).flat().sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2 };
    return order[a.priority] - order[b.priority];
  });

  // Risk level
  let riskLevel: RiskLevel = 'low';
  if (overallScore < 50 || criticalGaps.length >= 3) riskLevel = 'high';
  else if (overallScore < 70 || criticalGaps.length >= 1) riskLevel = 'standard';

  // Compliance deadline
  const size = companyInfo['company-size'];
  const t = TRANSLATIONS[lang];
  const complianceDeadline = size === 'large' ? t.deadlines.large : size === 'sme' ? t.deadlines.sme : t.deadlines.micro;
  const targetDate = size === 'large' ? new Date('2024-12-30') : size === 'sme' ? new Date('2025-06-30') : new Date('2025-12-30');
  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - Date.now()) / 86400000));

  // Certification benefit
  const certExists = responses['cert-exists'] as string;
  const certBonus = certExists === 'yes-full' ? 10 : certExists === 'yes-partial' ? 5 : 0;

  return {
    scores: sectionScores,
    gaps: allGaps,
    criticalGaps,
    overallScore: Math.min(100, overallScore + certBonus),
    riskLevel,
    complianceDeadline,
    daysRemaining,
    companyProfile: companyInfo,
    commodity: companyInfo['primary-commodity'],
    certificationBenefit: certBonus,
    actionPlan,
  };
}

function getGapAction(questionId: string, lang: Language): string {
  const actions: Record<string, { en: string; fr: string }> = {
    'dd-policy': { en: 'Develop and publish a formal deforestation-free policy', fr: 'Élaborer et publier une politique formelle sans déforestation' },
    'dd-risk-assessment': { en: 'Implement a documented supply chain risk assessment methodology', fr: 'Mettre en place une méthodologie documentée d\'évaluation des risques de la chaîne d\'approvisionnement' },
    'trace-gps': { en: 'Implement GPS coordinate collection for all production plots (≥6 decimal places)', fr: 'Mettre en place la collecte de coordonnées GPS pour toutes les parcelles de production (≥6 décimales)' },
    'trace-mapping': { en: 'Develop full supply chain mapping to farm/plot level', fr: 'Développer la cartographie complète de la chaîne d\'approvisionnement jusqu\'au niveau de la ferme/parcelle' },
    'trace-production-dates': { en: 'Document production dates to verify EUDR cut-off compliance (post-Dec 31, 2020)', fr: 'Documenter les dates de production pour vérifier la conformité à la date limite EUDR (après le 31 déc. 2020)' },
    'mon-satellite': { en: 'Subscribe to a satellite deforestation monitoring service', fr: 'S\'abonner à un service de surveillance satellitaire de la déforestation' },
    'doc-system': { en: 'Implement a structured digital documentation management system', fr: 'Mettre en place un système numérique structuré de gestion documentaire' },
    'doc-due-diligence-statements': { en: 'Prepare processes to issue EUDR due diligence statements per shipment', fr: 'Préparer les processus pour émettre des déclarations de diligence raisonnée EUDR par expédition' },
    'cert-exists': { en: 'Pursue relevant sustainability certification (e.g., Rainforest Alliance, FSC, RSPO)', fr: 'Obtenir une certification de durabilité pertinente (ex. Rainforest Alliance, FSC, RSPO)' },
    'sh-farmer-training': { en: 'Develop a structured farmer training program on EUDR requirements', fr: 'Développer un programme structuré de formation des agriculteurs sur les exigences EUDR' },
    'sh-grievance': { en: 'Establish a formal community grievance mechanism', fr: 'Établir un mécanisme formel de réclamation communautaire' },
    'mon-alerts': { en: 'Set up deforestation alert monitoring (e.g., Global Forest Watch)', fr: 'Mettre en place une surveillance des alertes de déforestation (ex. Global Forest Watch)' },
    'dd-mitigation': { en: 'Define and implement mitigation measures for identified deforestation risks', fr: 'Définir et mettre en œuvre des mesures d\'atténuation pour les risques de déforestation identifiés' },
    'doc-audit': { en: 'Establish an annual internal EUDR compliance audit process', fr: 'Établir un processus annuel d\'audit interne de conformité EUDR' },
  };
  return actions[questionId]?.[lang] ?? (lang === 'en' ? 'Review and improve this area' : 'Examiner et améliorer ce domaine');
}

// ─── Score Badge ──────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 85) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', ring: 'ring-green-400' };
  if (score >= 70) return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', ring: 'ring-blue-400' };
  if (score >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', ring: 'ring-yellow-400' };
  if (score >= 30) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', ring: 'ring-orange-400' };
  return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', ring: 'ring-red-400' };
}

function getComplianceLabel(score: number, lang: Language): string {
  const levels = TRANSLATIONS[lang].complianceLevels;
  if (score >= 85) return levels[0].label;
  if (score >= 70) return levels[1].label;
  if (score >= 50) return levels[2].label;
  if (score >= 30) return levels[3].label;
  return levels[4].label;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BuyerEUDRAssessment() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('start');
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [activeManual, setActiveManual] = useState('overview');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    'company-name': '',
    'primary-commodity': '',
    'secondary-commodities': [],
    'source-countries': [],
    'company-size': '',
    'supply-chain-role': [],
    'annual-volume': '',
    'years-in-business': '',
  });
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const t = TRANSLATIONS[lang];

  // Assessment sections excluding profile (section 0 is handled separately)
  const scoredSections = ASSESSMENT_SECTIONS.filter(s => s.id !== 'profile');
  const profileSection = ASSESSMENT_SECTIONS.find(s => s.id === 'profile')!;

  const handleResponse = useCallback((questionId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    // Sync profile fields
    if (['primary-commodity', 'company-size'].includes(questionId)) {
      setCompanyInfo(prev => ({ ...prev, [questionId]: value as string }));
    }
    if (questionId === 'supply-chain-role') {
      setCompanyInfo(prev => ({ ...prev, 'supply-chain-role': value as string[] }));
    }
  }, []);

  const handleCheckboxChange = useCallback((questionId: string, optionValue: string, checked: boolean) => {
    setResponses(prev => {
      const current = (prev[questionId] as string[]) || [];
      let updated: string[];
      if (checked) {
        if (optionValue === 'none') {
          updated = ['none'];
        } else {
          updated = [...current.filter(v => v !== 'none'), optionValue];
        }
      } else {
        updated = current.filter(v => v !== optionValue);
      }
      if (questionId === 'supply-chain-role') {
        setCompanyInfo(c => ({ ...c, 'supply-chain-role': updated }));
      }
      return { ...prev, [questionId]: updated };
    });
  }, []);

  const handleSubmitAssessment = useCallback(async () => {
    const calc = calculateResults(responses, companyInfo, lang);
    setResults(calc);
    setView('results');

    // Persist to Supabase
    setSaveStatus('saving');
    try {
      const { error } = await saveBuyerEUDRAssessment({
        company_name: companyInfo['company-name'],
        primary_commodity: companyInfo['primary-commodity'],
        company_size: companyInfo['company-size'] as CompanySize,
        source_countries: companyInfo['source-countries'],
        supply_chain_role: companyInfo['supply-chain-role'],
        annual_volume: companyInfo['annual-volume'],
        years_in_business: companyInfo['years-in-business'],
        secondary_commodities: companyInfo['secondary-commodities'],
        responses,
        overall_score: calc.overallScore,
        risk_level: calc.riskLevel,
        section_scores: calc.scores,
        critical_gaps: calc.criticalGaps,
        action_plan: calc.actionPlan,
        certification_benefit: calc.certificationBenefit,
        compliance_deadline: calc.complianceDeadline,
        days_remaining: calc.daysRemaining,
        language: lang,
      });
      setSaveStatus(error ? 'error' : 'saved');
    } catch {
      setSaveStatus('error');
    }
  }, [responses, companyInfo, lang]);

  const handleDownloadReport = useCallback(() => {
    if (!results) return;
    const report = {
      meta: { tool: 'AgroSoluce EUDR Self-Assessment', regulation: 'EU 2023/1115', date: new Date().toISOString(), language: lang },
      company: companyInfo,
      results: {
        overallScore: results.overallScore,
        riskLevel: results.riskLevel,
        complianceLabel: getComplianceLabel(results.overallScore, lang),
        complianceDeadline: results.complianceDeadline,
        daysRemaining: results.daysRemaining,
        sectionScores: results.scores,
        criticalGaps: results.criticalGaps,
        actionPlan: results.actionPlan,
        certificationBenefit: results.certificationBenefit,
      },
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eudr-assessment-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, companyInfo, lang]);

  const resetAssessment = () => {
    setView('start');
    setCurrentSection(0);
    setResponses({});
    setCompanyInfo({ 'company-name': '', 'primary-commodity': '', 'secondary-commodities': [], 'source-countries': [], 'company-size': '', 'supply-chain-role': [], 'annual-volume': '', 'years-in-business': '' });
    setResults(null);
    setSaveStatus('idle');
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderQuestion = (question: Question) => {
    const value = responses[question.id];

    if (question.type === 'radio') {
      return (
        <div className="space-y-3">
          {question.options?.map(opt => (
            <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${value === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={e => handleResponse(question.id, e.target.value)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-800">{opt.label[lang]}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === 'select') {
      return (
        <select
          value={(value as string) || ''}
          onChange={e => handleResponse(question.id, e.target.value)}
          aria-label={question.text[lang]}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{lang === 'en' ? '— Select —' : '— Sélectionner —'}</option>
          {question.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label[lang]}</option>
          ))}
        </select>
      );
    }

    if (question.type === 'checkbox') {
      const checked = (value as string[]) || [];
      return (
        <div className="space-y-3">
          {question.options?.map(opt => (
            <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked.includes(opt.value) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={checked.includes(opt.value)}
                onChange={e => handleCheckboxChange(question.id, opt.value, e.target.checked)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-800">{opt.label[lang]}</span>
            </label>
          ))}
        </div>
      );
    }

    if (question.type === 'text') {
      return (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={e => handleResponse(question.id, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={lang === 'en' ? 'Your answer…' : 'Votre réponse…'}
        />
      );
    }

    return null;
  };

  // ── Views ───────────────────────────────────────────────────────────────────

  if (view === 'start') {
    return (
      <PageShell breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Buyers', path: '/buyers' },
        { label: 'Buyer Portal', path: '/buyer' },
        { label: 'EUDR Assessment' },
      ]} containerClassName="max-w-5xl">
        <div>

          {/* Language toggle */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              {(['en', 'fr'] as Language[]).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 text-sm font-medium transition-colors ${lang === l ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Hero */}
          <div className="bg-gradient-to-r from-green-600 via-primary-700 to-blue-600 rounded-xl shadow-xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-4 border border-white/20">
                <Shield className="h-4 w-4" />
                <span>EU Regulation 2023/1115</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.title}</h1>
              <p className="text-lg text-white/90 max-w-2xl leading-relaxed">{t.description}</p>
            </div>
          </div>

          {/* Regulation Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">{lang === 'en' ? 'EU Regulation Now in Effect — Due Diligence Required' : 'Règlement UE en Vigueur — Diligence Raisonnée Requise'}</h3>
                <p className="text-amber-800 text-sm">{lang === 'en' ? 'All operators placing covered commodities on the EU market must implement due diligence systems.' : 'Tous les opérateurs plaçant des matières premières couvertes sur le marché UE doivent mettre en place des systèmes de diligence raisonnée.'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: lang === 'en' ? 'Large Enterprises' : 'Grandes Entreprises', revenue: lang === 'en' ? 'Revenue > €40M' : 'CA > 40 M€', deadline: t.deadlines.large, color: 'red' },
                { label: lang === 'en' ? 'SMEs' : 'PME', revenue: lang === 'en' ? 'Revenue €10–40M' : 'CA 10–40 M€', deadline: t.deadlines.sme, color: 'yellow' },
                { label: lang === 'en' ? 'Micro Enterprises' : 'Micro-Entreprises', revenue: lang === 'en' ? 'Revenue < €10M' : 'CA < 10 M€', deadline: t.deadlines.micro, color: 'green' },
              ].map((item, i) => (
                <div key={i} className={`bg-white rounded-lg p-4 border-l-4 ${item.color === 'red' ? 'border-red-500' : item.color === 'yellow' ? 'border-yellow-500' : 'border-green-500'}`}>
                  <div className={`text-sm font-semibold ${item.color === 'red' ? 'text-red-800' : item.color === 'yellow' ? 'text-yellow-800' : 'text-green-800'}`}>{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.revenue}</div>
                  <div className={`text-sm font-bold mt-1 ${item.color === 'red' ? 'text-red-900' : item.color === 'yellow' ? 'text-yellow-900' : 'text-green-900'}`}>{item.deadline}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Covered commodities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{lang === 'en' ? 'Covered Commodities' : 'Matières Premières Couvertes'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { key: 'cocoa', icon: '🍫', risk: 'High' },
                { key: 'coffee', icon: '☕', risk: 'Medium-High' },
                { key: 'palm-oil', icon: '🌴', risk: 'Very High' },
                { key: 'soya', icon: '🌱', risk: 'High' },
                { key: 'cattle', icon: '🐄', risk: 'Very High' },
                { key: 'wood', icon: '🌳', risk: 'High' },
                { key: 'rubber', icon: '🛞', risk: 'Medium-High' },
              ].map(c => (
                <div key={c.key} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="text-xs font-medium text-gray-800">{t.commodities[c.key as keyof typeof t.commodities]}</div>
                  <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block ${c.risk === 'Very High' ? 'bg-red-100 text-red-700' : c.risk === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.risk}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll get */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: <BarChart3 className="h-6 w-6 text-blue-600" />, title: lang === 'en' ? 'Compliance Score' : 'Score de Conformité', desc: lang === 'en' ? 'Overall % score with section-by-section breakdown and risk level' : 'Score % global avec répartition par section et niveau de risque', bg: 'bg-blue-50', border: 'border-blue-200' },
              { icon: <AlertTriangle className="h-6 w-6 text-orange-600" />, title: lang === 'en' ? 'Critical Gaps' : 'Lacunes Critiques', desc: lang === 'en' ? 'Immediate actions needed to reach basic EUDR compliance' : 'Actions immédiates nécessaires pour atteindre la conformité EUDR de base', bg: 'bg-orange-50', border: 'border-orange-200' },
              { icon: <Target className="h-6 w-6 text-green-600" />, title: lang === 'en' ? 'Action Plan' : 'Plan d\'Action', desc: lang === 'en' ? 'Priority-ranked recommendations with commodity-specific guidance' : 'Recommandations classées par priorité avec conseils spécifiques aux matières premières', bg: 'bg-green-50', border: 'border-green-200' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-5`}>
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setView('assessment')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-primary-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Play className="h-5 w-5" />
              {t.startAssessment}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('manual')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              {t.userManual}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            {lang === 'en' ? 'Based on EU Regulation 2023/1115. Takes approximately 15–20 minutes.' : 'Basé sur le Règlement UE 2023/1115. Environ 15–20 minutes.'}
          </p>
        </div>
      </PageShell>
    );
  }

  if (view === 'manual') {
    const manualSections = [
      { id: 'overview', icon: <BookOpen className="w-4 h-4" />, label: lang === 'en' ? 'Overview' : 'Aperçu' },
      { id: 'areas', icon: <BarChart3 className="w-4 h-4" />, label: lang === 'en' ? 'Assessment Areas' : 'Domaines d\'Évaluation' },
      { id: 'scoring', icon: <Target className="w-4 h-4" />, label: lang === 'en' ? 'Scoring System' : 'Système de Notation' },
      { id: 'compliance', icon: <Shield className="w-4 h-4" />, label: lang === 'en' ? 'EU Compliance' : 'Conformité UE' },
      { id: 'faq', icon: <Info className="w-4 h-4" />, label: 'FAQ' },
    ];
    const faqItems = [
      { q: lang === 'en' ? 'What is this tool?' : 'Qu\'est-ce que cet outil ?', a: lang === 'en' ? 'A self-assessment tool for buyers to evaluate their EU Deforestation Regulation (2023/1115) readiness across 7 key compliance areas.' : 'Un outil d\'auto-évaluation pour les acheteurs afin d\'évaluer leur préparation au Règlement UE sur la déforestation (2023/1115) dans 7 domaines clés.' },
      { q: lang === 'en' ? 'How long does it take?' : 'Combien de temps dure l\'évaluation ?', a: lang === 'en' ? 'Approximately 15–20 minutes for a complete assessment. Results are instant.' : 'Environ 15 à 20 minutes pour une évaluation complète. Les résultats sont immédiats.' },
      { q: lang === 'en' ? 'What commodities are covered?' : 'Quelles matières premières sont couvertes ?', a: lang === 'en' ? 'All 7 EU regulation commodities: Cocoa, Coffee, Palm Oil, Soya, Cattle, Wood, and Natural Rubber.' : 'Les 7 matières premières du règlement UE : Cacao, Café, Huile de Palme, Soja, Bovins, Bois et Caoutchouc Naturel.' },
      { q: lang === 'en' ? 'Are my answers saved?' : 'Mes réponses sont-elles sauvegardées ?', a: lang === 'en' ? 'Yes – your assessment results are saved to your account when you complete it. You can also download a JSON report.' : 'Oui – vos résultats d\'évaluation sont enregistrés sur votre compte à la fin. Vous pouvez aussi télécharger un rapport JSON.' },
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('start')} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
              <ArrowLeft className="h-4 w-4" /> {t.back}
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-gray-900">{lang === 'en' ? 'User Manual' : 'Manuel d\'Utilisation'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              {(['en', 'fr'] as Language[]).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs font-medium ${lang === l ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setView('assessment')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              <Play className="h-3.5 w-3.5" /> {t.startAssessment}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
          <aside className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sticky top-6">
              <nav className="space-y-1">
                {manualSections.map(s => (
                  <button key={s.id} onClick={() => setActiveManual(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${activeManual === s.id ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
            {activeManual === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{lang === 'en' ? 'Assessment Overview' : 'Aperçu de l\'Évaluation'}</h2>
                <p className="text-gray-600 mb-6">{lang === 'en' ? 'The AgroSoluce EUDR Self-Assessment helps buyers evaluate their readiness for EU Regulation 2023/1115. Complete 7 sections to receive a compliance score, identify critical gaps, and generate a prioritised action plan.' : 'L\'auto-évaluation EUDR AgroSoluce aide les acheteurs à évaluer leur préparation au Règlement UE 2023/1115. Complétez 7 sections pour recevoir un score de conformité, identifier les lacunes critiques et générer un plan d\'action priorisé.'}</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{lang === 'en' ? 'Key Features' : 'Fonctionnalités Clés'}</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {(lang === 'en' ? ['7 comprehensive assessment sections', 'Commodity-specific scoring', 'Certification benefit analysis', 'Priority action plan', 'Bilingual (EN/FR)', 'Results saved to your account'] : ['7 sections d\'évaluation complètes', 'Notation spécifique aux matières premières', 'Analyse des avantages de certification', 'Plan d\'action prioritaire', 'Bilingue (EN/FR)', 'Résultats sauvegardés sur votre compte']).map((f, i) => (
                        <li key={i} className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">{lang === 'en' ? 'Who Should Use This' : 'Qui Devrait Utiliser Cet Outil'}</h3>
                    <ul className="space-y-1 text-sm text-green-800">
                      {(lang === 'en' ? ['Commodity traders & importers', 'Food & beverage manufacturers', 'Retailers sourcing covered commodities', 'Supply chain managers', 'Sustainability professionals'] : ['Négociants et importateurs de matières premières', 'Fabricants de produits alimentaires', 'Détaillants approvisionnant des matières premières couvertes', 'Gestionnaires de chaîne d\'approvisionnement', 'Professionnels de la durabilité']).map((u, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-green-600 mt-0.5">•</span>{u}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeManual === 'areas' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{lang === 'en' ? 'Assessment Areas' : 'Domaines d\'Évaluation'}</h2>
                <p className="text-gray-600 mb-6">{lang === 'en' ? 'The assessment covers 7 critical areas weighted by their importance for deforestation-free supply chains.' : 'L\'évaluation couvre 7 domaines critiques pondérés par leur importance pour les chaînes d\'approvisionnement sans déforestation.'}</p>
                <div className="space-y-4">
                  {[
                    { icon: <Users className="w-5 h-5" />, title: lang === 'en' ? '1. Company & Commodity Profile' : '1. Profil Entreprise & Matières Premières', desc: lang === 'en' ? 'Establishes context — company size (determines deadline), commodity (determines risk level), supply chain role.' : 'Établit le contexte — taille de l\'entreprise (détermine le délai), matière première (détermine le niveau de risque), rôle dans la chaîne.', weight: lang === 'en' ? 'Context only' : 'Contexte uniquement' },
                    { icon: <Award className="w-5 h-5" />, title: lang === 'en' ? '2. Certifications & Standards (15%)' : '2. Certifications & Normes (15%)', desc: lang === 'en' ? 'Existing sustainability certifications (RA, RSPO, FSC, Fair Trade, etc.) and chain of custody status.' : 'Certifications de durabilité existantes (RA, RSPO, FSC, Fair Trade, etc.) et statut de chaîne de custody.', weight: '15%' },
                    { icon: <Shield className="w-5 h-5" />, title: lang === 'en' ? '3. Due Diligence System (25%)' : '3. Système de Diligence Raisonnée (25%)', desc: lang === 'en' ? 'Core EUDR requirement: deforestation-free policy, risk assessment, mitigation measures, monitoring.' : 'Exigence centrale de l\'EUDR : politique sans déforestation, évaluation des risques, mesures d\'atténuation, surveillance.', weight: '25%' },
                    { icon: <Globe className="w-5 h-5" />, title: lang === 'en' ? '4. Supply Chain Traceability (25%)' : '4. Traçabilité de la Chaîne (25%)', desc: lang === 'en' ? 'GPS coordinates (≥6 decimal places), farm-level supply chain mapping, production dates (post-2020), volume tracking.' : 'Coordonnées GPS (≥6 décimales), cartographie au niveau de la ferme, dates de production (après 2020), suivi des volumes.', weight: '25%' },
                    { icon: <Satellite className="w-5 h-5" />, title: lang === 'en' ? '5. Deforestation Monitoring (15%)' : '5. Surveillance Déforestation (15%)', desc: lang === 'en' ? 'Satellite monitoring services, alert systems for early detection, ground verification protocols.' : 'Services de surveillance par satellite, systèmes d\'alerte pour la détection précoce, protocoles de vérification au sol.', weight: '15%' },
                    { icon: <Users className="w-5 h-5" />, title: lang === 'en' ? '6. Stakeholder Engagement (10%)' : '6. Engagement des Parties Prenantes (10%)', desc: lang === 'en' ? 'Farmer training programs, community grievance mechanisms, financial incentives for compliance.' : 'Programmes de formation des agriculteurs, mécanismes de réclamation communautaire, incitations financières.', weight: '10%' },
                    { icon: <FileText className="w-5 h-5" />, title: lang === 'en' ? '7. Documentation & Reporting (10%)' : '7. Documentation & Rapports (10%)', desc: lang === 'en' ? 'Documentation management system, due diligence statements per shipment, internal audit controls.' : 'Système de gestion documentaire, déclarations de diligence raisonnée par expédition, contrôles d\'audit interne.', weight: '10%' },
                  ].map((area, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-primary-600">{area.icon}</div>
                        <h3 className="font-semibold text-gray-900">{area.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{area.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeManual === 'scoring' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{lang === 'en' ? 'Scoring System' : 'Système de Notation'}</h2>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{lang === 'en' ? 'Compliance Levels' : 'Niveaux de Conformité'}</h3>
                    <div className="space-y-2">
                      {t.complianceLevels.map((level, i) => (
                        <div key={i} className={`flex items-center justify-between p-2.5 rounded text-sm ${['bg-green-50', 'bg-blue-50', 'bg-yellow-50', 'bg-orange-50', 'bg-red-50'][i]}`}>
                          <span className={`font-medium ${['text-green-800', 'text-blue-800', 'text-yellow-800', 'text-orange-800', 'text-red-800'][i]}`}>{level.label}</span>
                          <span className={`${['text-green-600', 'text-blue-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'][i]}`}>{level.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{lang === 'en' ? 'Risk Levels' : 'Niveaux de Risque'}</h3>
                    <div className="space-y-2">
                      {[
                        { label: lang === 'en' ? 'Low Risk' : 'Risque Faible', desc: lang === 'en' ? 'Score ≥70%, few critical gaps' : 'Score ≥70%, peu de lacunes critiques', color: 'green' },
                        { label: lang === 'en' ? 'Standard Risk' : 'Risque Standard', desc: lang === 'en' ? 'Score 50–69% or 1–2 critical gaps' : 'Score 50–69% ou 1–2 lacunes critiques', color: 'yellow' },
                        { label: lang === 'en' ? 'High Risk' : 'Risque Élevé', desc: lang === 'en' ? 'Score <50% or ≥3 critical gaps' : 'Score <50% ou ≥3 lacunes critiques', color: 'red' },
                      ].map((r, i) => (
                        <div key={i} className={`p-2.5 rounded ${r.color === 'green' ? 'bg-green-50' : r.color === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                          <div className={`font-medium text-sm ${r.color === 'green' ? 'text-green-800' : r.color === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>{r.label}</div>
                          <div className={`text-xs ${r.color === 'green' ? 'text-green-600' : r.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{r.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeManual === 'compliance' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{lang === 'en' ? 'EU Compliance Requirements' : 'Exigences de Conformité UE'}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{lang === 'en' ? 'Core Requirements' : 'Exigences de Base'}</h3>
                    <div className="space-y-3">
                      {(lang === 'en' ? [
                        { title: 'Due Diligence System', desc: 'Formal system to assess and mitigate deforestation risks' },
                        { title: 'GPS Coordinates', desc: 'Precise location data for all production areas (≥6 decimal places)' },
                        { title: 'Production Dates', desc: 'Proof of production after December 31, 2020' },
                        { title: 'Due Diligence Statements', desc: 'Mandatory for each commodity shipment to the EU' },
                      ] : [
                        { title: 'Système de Diligence Raisonnée', desc: 'Système formel pour évaluer et atténuer les risques de déforestation' },
                        { title: 'Coordonnées GPS', desc: 'Données de localisation précises pour toutes les zones de production (≥6 décimales)' },
                        { title: 'Dates de Production', desc: 'Preuve de production après le 31 décembre 2020' },
                        { title: 'Déclarations de Diligence Raisonnée', desc: 'Obligatoires pour chaque expédition de matières premières vers l\'UE' },
                      ]).map((req, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div><div className="font-medium text-sm text-gray-800">{req.title}</div><div className="text-xs text-gray-600">{req.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{lang === 'en' ? 'Penalties for Non-Compliance' : 'Pénalités pour Non-Conformité'}</h3>
                    <div className="space-y-3">
                      {(lang === 'en' ? [
                        { title: 'Financial Penalties', desc: 'Up to 4% of annual EU turnover' },
                        { title: 'Market Exclusion', desc: 'Temporary ban from EU market access' },
                        { title: 'Confiscation', desc: 'Seizure of non-compliant products' },
                        { title: 'Reputational Damage', desc: 'Public disclosure of violations' },
                      ] : [
                        { title: 'Pénalités Financières', desc: 'Jusqu\'à 4% du chiffre d\'affaires annuel UE' },
                        { title: 'Exclusion du Marché', desc: 'Exclusion temporaire du marché UE' },
                        { title: 'Confiscation', desc: 'Saisie des produits non conformes' },
                        { title: 'Dommages Réputationnels', desc: 'Divulgation publique des violations' },
                      ]).map((p, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div><div className="font-medium text-sm text-gray-800">{p.title}</div><div className="text-xs text-gray-600">{p.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeManual === 'faq' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => setExpandedFaq(expandedFaq === String(i) ? null : String(i))} className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <span className="font-medium text-sm text-gray-900">{item.q}</span>
                        {expandedFaq === String(i) ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      </button>
                      {expandedFaq === String(i) && <div className="px-4 pb-3 text-sm text-gray-600">{item.a}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  if (view === 'assessment') {
    // Section 0 = Profile (separate treatment), sections 1–6 = scored sections
    const isProfileSection = currentSection === 0;
    const section = isProfileSection ? profileSection : scoredSections[currentSection - 1];
    const totalSteps = 1 + scoredSections.length;
    const progress = Math.round((currentSection / (totalSteps - 1)) * 100);

    const canProceed = section.questions.every(q => {
      if (q.type === 'checkbox') {
        const val = responses[q.id] as string[] | undefined;
        return val && val.length > 0;
      }
      return !!responses[q.id];
    });

    const sectionLabels = [lang === 'en' ? 'Company Profile' : 'Profil Entreprise', ...t.sections.slice(1)];

    return (
      <PageShell noBreadcrumbs containerClassName="max-w-3xl">
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => currentSection === 0 ? setView('start') : setCurrentSection(s => s - 1)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
              <ArrowLeft className="h-4 w-4" /> {currentSection === 0 ? t.back : t.previous}
            </button>
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded border border-gray-200 overflow-hidden text-xs">
                {(['en', 'fr'] as Language[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 font-medium ${lang === l ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
              <span className="text-sm text-gray-500">{lang === 'en' ? `Step ${currentSection + 1} of ${totalSteps}` : `Étape ${currentSection + 1} sur ${totalSteps}`}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{sectionLabels[currentSection]}</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {sectionLabels.map((label, i) => (
                <div key={i} className={`text-xs ${i <= currentSection ? 'text-primary-600 font-medium' : 'text-gray-400'} hidden sm:block`} style={{ width: `${100 / totalSteps}%`, textAlign: 'center' }}>
                  {i < currentSection ? '✓' : i === currentSection ? '●' : '○'}
                </div>
              ))}
            </div>
          </div>

          {/* Section card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2.5 rounded-lg">
                {isProfileSection ? <Users className="h-5 w-5 text-primary-600" /> : [<Award />, <Shield />, <Globe />, <Satellite />, <Users />, <FileText />][currentSection - 1] && React.cloneElement([<Award className="h-5 w-5 text-primary-600" />, <Shield className="h-5 w-5 text-primary-600" />, <Globe className="h-5 w-5 text-primary-600" />, <Satellite className="h-5 w-5 text-primary-600" />, <Users className="h-5 w-5 text-primary-600" />, <FileText className="h-5 w-5 text-primary-600" />][currentSection - 1])}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{sectionLabels[currentSection]}</h2>
                {!isProfileSection && section.weight > 0 && (
                  <span className="text-xs text-gray-500">{lang === 'en' ? `${section.weight}% of total score` : `${section.weight}% du score total`}</span>
                )}
              </div>
            </div>

            {/* Company name text field on profile section */}
            {isProfileSection && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'en' ? 'Company name' : 'Nom de l\'entreprise'} <span className="text-gray-400 font-normal">{lang === 'en' ? '(optional)' : '(optionnel)'}</span>
                </label>
                <input
                  type="text"
                  value={companyInfo['company-name']}
                  onChange={e => setCompanyInfo(prev => ({ ...prev, 'company-name': e.target.value }))}
                  placeholder={lang === 'en' ? 'Your company name' : 'Nom de votre entreprise'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div className="space-y-8">
              {section.questions.map(question => (
                <div key={question.id}>
                  <div className="flex items-start gap-2 mb-3">
                    <p className="text-sm font-medium text-gray-800 flex-1">{question.text[lang]}</p>
                    {question.isCritical && (
                      <span className="flex-shrink-0 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        {lang === 'en' ? 'Critical' : 'Critique'}
                      </span>
                    )}
                  </div>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {lang === 'en' ? `${currentSection + 1} / ${totalSteps}` : `${currentSection + 1} / ${totalSteps}`}
            </span>
            {currentSection < totalSteps - 1 ? (
              <button
                onClick={() => setCurrentSection(s => s + 1)}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${canProceed ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {t.next} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${canProceed ? 'bg-gradient-to-r from-green-600 to-primary-600 text-white hover:from-green-700 hover:to-primary-700 shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                <CheckCircle className="h-4 w-4" /> {t.submit}
              </button>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Results view
  if (view === 'results' && results) {
    const scoreColors = getScoreColor(results.overallScore);
    const complianceLabel = getComplianceLabel(results.overallScore, lang);

    return (
      <PageShell breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Buyer Portal', path: '/buyer' },
        { label: lang === 'en' ? 'EUDR Assessment Results' : 'Résultats EUDR' },
      ]} containerClassName="max-w-4xl">
        <div>

          {/* Save status */}
          {saveStatus !== 'idle' && (
            <div className={`mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' : saveStatus === 'saved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {saveStatus === 'saving' && <Clock className="h-4 w-4 animate-spin" />}
              {saveStatus === 'saved' && <CheckCircle className="h-4 w-4" />}
              {saveStatus === 'error' && <XCircle className="h-4 w-4" />}
              {saveStatus === 'saving' ? t.saving : saveStatus === 'saved' ? t.saved : t.errorSaving}
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-700 to-green-600 rounded-xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">{lang === 'en' ? 'EUDR Assessment Results' : 'Résultats de l\'Évaluation EUDR'}</h1>
                {companyInfo['company-name'] && <p className="text-white/80 text-sm">{companyInfo['company-name']}</p>}
                <p className="text-white/70 text-xs mt-1">{new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownloadReport} className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm transition-colors border border-white/20">
                  <Download className="h-4 w-4" /> {t.downloadReport}
                </button>
              </div>
            </div>
          </div>

          {/* Score summary */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {/* Overall score */}
            <div className={`${scoreColors.bg} border ${scoreColors.border} rounded-xl p-6 text-center`}>
              <div className={`text-5xl font-black ${scoreColors.text} mb-1`}>{results.overallScore}%</div>
              <div className={`text-sm font-semibold ${scoreColors.text} mb-1`}>{complianceLabel}</div>
              <div className="text-xs text-gray-600">{lang === 'en' ? 'Overall Compliance' : 'Conformité Globale'}</div>
            </div>
            {/* Risk level */}
            <div className={`${results.riskLevel === 'low' ? 'bg-green-50 border-green-200' : results.riskLevel === 'standard' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-xl p-6 text-center`}>
              <div className={`text-3xl font-black mb-1 ${results.riskLevel === 'low' ? 'text-green-700' : results.riskLevel === 'standard' ? 'text-yellow-700' : 'text-red-700'}`}>
                {results.riskLevel === 'low' ? '🟢' : results.riskLevel === 'standard' ? '🟡' : '🔴'}
              </div>
              <div className={`text-sm font-semibold mb-1 ${results.riskLevel === 'low' ? 'text-green-800' : results.riskLevel === 'standard' ? 'text-yellow-800' : 'text-red-800'}`}>{t.riskLabels[results.riskLevel]}</div>
              <div className="text-xs text-gray-600">{lang === 'en' ? 'Risk Level' : 'Niveau de Risque'}</div>
            </div>
            {/* Deadline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className={`h-8 w-8 ${results.daysRemaining > 180 ? 'text-green-500' : results.daysRemaining > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-sm font-semibold mb-1 ${results.daysRemaining > 180 ? 'text-green-700' : results.daysRemaining > 60 ? 'text-yellow-700' : 'text-red-700'}`}>
                {results.daysRemaining > 0 ? `${results.daysRemaining} ${lang === 'en' ? 'days remaining' : 'jours restants'}` : lang === 'en' ? 'Deadline passed' : 'Délai dépassé'}
              </div>
              <div className="text-xs text-gray-600">{results.complianceDeadline}</div>
            </div>
          </div>

          {/* Section scores */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{lang === 'en' ? 'Section Scores' : 'Scores par Section'}</h2>
            <div className="space-y-3">
              {scoredSections.map((section, i) => {
                const score = results.scores[section.id] ?? 0;
                const sc = getScoreColor(score);
                return (
                  <div key={section.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t.sections[i + 1]}</span>
                      <span className={`text-sm font-bold ${sc.text}`}>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-700 ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-blue-500' : score >= 50 ? 'bg-yellow-500' : score >= 30 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {results.certificationBenefit > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <Award className="h-4 w-4 flex-shrink-0" />
                <span>{lang === 'en' ? `+${results.certificationBenefit}% certification bonus applied` : `+${results.certificationBenefit}% bonus de certification appliqué`}</span>
              </div>
            )}
          </div>

          {/* Critical gaps */}
          {results.criticalGaps.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                {lang === 'en' ? `${results.criticalGaps.length} Critical Gap${results.criticalGaps.length > 1 ? 's' : ''}` : `${results.criticalGaps.length} Lacune${results.criticalGaps.length > 1 ? 's' : ''} Critique${results.criticalGaps.length > 1 ? 's' : ''}`}
              </h2>
              <p className="text-sm text-red-800 mb-4">{lang === 'en' ? 'These must be addressed immediately to achieve basic EUDR compliance.' : 'Ces éléments doivent être traités immédiatement pour atteindre la conformité EUDR de base.'}</p>
              <div className="space-y-3">
                {results.criticalGaps.map((gap, i) => (
                  <div key={i} className="bg-white border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{gap.title}</div>
                        <div className="text-xs text-gray-600">{lang === 'en' ? 'Action: ' : 'Action : '}<span className="text-gray-800">{gap.action}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action plan */}
          {results.actionPlan.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-600" />
                {lang === 'en' ? 'Prioritised Action Plan' : 'Plan d\'Action Priorisé'}
              </h2>
              <div className="space-y-3">
                {results.actionPlan.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${item.priority === 'critical' ? 'bg-red-50 border-red-200' : item.priority === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${item.priority === 'critical' ? 'bg-red-200 text-red-800' : item.priority === 'high' ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className={`text-xs font-semibold uppercase mb-0.5 ${item.priority === 'critical' ? 'text-red-700' : item.priority === 'high' ? 'text-orange-700' : 'text-yellow-700'}`}>{item.priority}</div>
                      <div className="text-sm text-gray-800">{item.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleDownloadReport} className="flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              <Download className="h-4 w-4" /> {t.downloadReport}
            </button>
            <Link to="/buyer/request" className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <ArrowRight className="h-4 w-4" />
              {lang === 'en' ? 'Find EUDR-Ready Cooperatives' : 'Trouver des Coopératives Prêtes EUDR'}
            </Link>
            <button onClick={resetAssessment} className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <RotateCcw className="h-4 w-4" /> {t.startOver}
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return null;
}

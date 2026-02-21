/**
 * Mobile app translations – English & French
 * Keys used by RoleSelector, dashboards, and settings.
 */

export type Language = 'en' | 'fr';

export interface MobileTranslations {
  app: {
    title: string;
    subtitle: string;
    fieldOps: string;
  };
  roles: {
    ermits: string;
    ermitsDesc: string;
    cooperative: string;
    cooperativeDesc: string;
    farmer: string;
    farmerDesc: string;
  };
  nav: {
    overview: string;
    cooperatives: string;
    compliance: string;
    alerts: string;
    dashboard: string;
    members: string;
    farmersFirst: string;
    childLabor: string;
    sales: string;
    home: string;
    training: string;
    declarations: string;
    help: string;
  };
  common: {
    loading: string;
    live: string;
    ready: string;
    inProgress: string;
    add: string;
    new: string;
    submit: string;
    view: string;
    switchRole: string;
    changeLanguage: string;
    noCooperatives: string;
    noMembers: string;
    noAssessments: string;
    noTraining: string;
    noDeclarations: string;
    noCompliance: string;
    goToErmits: string;
    openBuyerPortal: string;
    setupWizard: string;
    viewMembers: string;
    assessments: string;
    activeMembers: string;
    trainingSessions: string;
    complianceItems: string;
    needAttention: string;
    quickActions: string;
    memberDirectory: string;
    cooperativeDirectory: string;
    systemOverview: string;
    eudrAssessments: string;
    onboardedCooperatives: string;
    actionRequired: string;
    pendingDeclarations: string;
    availableTraining: string;
    trainingPrograms: string;
    myDeclarations: string;
    progress: string;
    submitted: string;
    pending: string;
    completion: string;
    needHelp: string;
    callCooperative: string;
    sendMessage: string;
    trainingVideos: string;
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    english: string;
    french: string;
    aboutCooperative: string;
    cooperativeLabel: string;
    regNumber: string;
    buyers: string;
    complianceStatus: string;
    farmersFirstOverview: string;
    registeredMembers: string;
    attendees: string;
    orderManagement: string;
    buyerPortalDesc: string;
    noFarmerProfile: string;
    noPendingTraining: string;
    everythingUpToDate: string;
    noTrainingAvailable: string;
    noDeclarationsOnRecord: string;
    contactCoopManager: string;
    messageSupport: string;
    watchVideos: string;
  };
}

const en: MobileTranslations = {
  app: {
    title: 'AgroSoluce Intelligence',
    subtitle: 'Field Operations Platform',
    fieldOps: 'Field Operations',
  },
  roles: {
    ermits: 'ERMITS Team',
    ermitsDesc: 'Command Center • Monitor cooperatives • Compliance oversight',
    cooperative: 'Cooperative Manager',
    cooperativeDesc: 'Operations Dashboard • Member management • Compliance tracking',
    farmer: 'Farmer',
    farmerDesc: 'Field App • Data collection • Training access • Offline capable',
  },
  nav: {
    overview: 'Overview',
    cooperatives: 'Cooperatives',
    compliance: 'Compliance',
    alerts: 'Alerts',
    dashboard: 'Dashboard',
    members: 'Members',
    farmersFirst: 'FF',
    childLabor: 'CL',
    sales: 'Sales',
    home: 'Home',
    training: 'Training',
    declarations: 'Declarations',
    help: 'Help',
  },
  common: {
    loading: 'Loading…',
    live: 'Live',
    ready: 'Ready',
    inProgress: 'In Progress',
    add: 'Add',
    new: 'New',
    submit: 'Submit',
    view: 'View',
    switchRole: 'Switch role',
    changeLanguage: 'Change language',
    noCooperatives: 'No cooperatives found.',
    noMembers: 'No members registered yet.',
    noAssessments: 'No assessments recorded for this cooperative.',
    noTraining: 'No training sessions scheduled.',
    noDeclarations: 'No declarations on record.',
    noCompliance: 'No compliance records found.',
    goToErmits: 'Go to ERMITS Directory',
    openBuyerPortal: 'Open Buyer Portal',
    setupWizard: 'Setup Wizard',
    viewMembers: 'View Members',
    assessments: 'Assessments',
    activeMembers: 'Active Members',
    trainingSessions: 'Training Sessions',
    complianceItems: 'Compliance Items',
    needAttention: 'need attention',
    quickActions: 'Quick Actions',
    memberDirectory: 'Member Directory',
    cooperativeDirectory: 'Cooperative Directory',
    systemOverview: 'System Overview',
    eudrAssessments: 'EUDR Assessments',
    onboardedCooperatives: 'Onboarded Cooperatives',
    actionRequired: 'Action Required',
    pendingDeclarations: 'Pending Declarations',
    availableTraining: 'Available Training',
    trainingPrograms: 'Training Programs',
    myDeclarations: 'My Declarations',
    progress: 'Progress',
    submitted: 'Submitted',
    pending: 'Pending',
    completion: 'Completion',
    needHelp: 'Need Help?',
    callCooperative: 'Call Cooperative',
    sendMessage: 'Send Message',
    trainingVideos: 'Training Videos',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    english: 'English',
    french: 'Français',
    aboutCooperative: 'About Your Cooperative',
    cooperativeLabel: 'Cooperative',
    regNumber: 'Reg. Number',
    buyers: 'Buyer Portal',
    complianceStatus: 'Compliance Status',
    farmersFirstOverview: 'Farmers First Overview',
    registeredMembers: 'Registered Members',
    attendees: 'attendees',
    orderManagement: 'Order management is available on the full web platform.',
    buyerPortalDesc: 'Connect with verified buyers looking for certified cooperatives.',
    noFarmerProfile: 'No farmer profile selected. Please log in or scan your farmer QR code to access your field app.',
    noPendingTraining: 'Everything is up to date. No pending declarations or training.',
    noTrainingAvailable: 'No training sessions available from your cooperative yet.',
    noDeclarationsOnRecord: 'No declarations on record.',
    contactCoopManager: 'Contact your cooperative manager',
    messageSupport: 'Send a message to support',
    watchVideos: 'Watch instructional videos',
  },
};

const fr: MobileTranslations = {
  app: {
    title: 'AgroSoluce Intelligence',
    subtitle: 'Plateforme Opérations de Terrain',
    fieldOps: 'Opérations de terrain',
  },
  roles: {
    ermits: 'Équipe ERMITS',
    ermitsDesc: 'Centre de commande • Suivi des coopératives • Conformité',
    cooperative: 'Responsable Coopérative',
    cooperativeDesc: 'Tableau de bord • Gestion des membres • Suivi conformité',
    farmer: 'Agriculteur',
    farmerDesc: 'App terrain • Collecte de données • Formations • Hors ligne',
  },
  nav: {
    overview: 'Vue d\'ensemble',
    cooperatives: 'Coopératives',
    compliance: 'Conformité',
    alerts: 'Alertes',
    dashboard: 'Tableau de bord',
    members: 'Membres',
    farmersFirst: 'FF',
    childLabor: 'CL',
    sales: 'Ventes',
    home: 'Accueil',
    training: 'Formation',
    declarations: 'Déclarations',
    help: 'Aide',
  },
  common: {
    loading: 'Chargement…',
    live: 'En direct',
    ready: 'Prêt',
    inProgress: 'En cours',
    add: 'Ajouter',
    new: 'Nouveau',
    submit: 'Soumettre',
    view: 'Voir',
    switchRole: 'Changer de rôle',
    changeLanguage: 'Changer la langue',
    noCooperatives: 'Aucune coopérative trouvée.',
    noMembers: 'Aucun membre enregistré.',
    noAssessments: 'Aucune évaluation pour cette coopérative.',
    noTraining: 'Aucune session de formation prévue.',
    noDeclarations: 'Aucune déclaration enregistrée.',
    noCompliance: 'Aucun enregistrement de conformité.',
    goToErmits: 'Aller à l\'annuaire ERMITS',
    openBuyerPortal: 'Ouvrir le portail acheteurs',
    setupWizard: 'Assistant de configuration',
    viewMembers: 'Voir les membres',
    assessments: 'Évaluations',
    activeMembers: 'Membres actifs',
    trainingSessions: 'Sessions de formation',
    complianceItems: 'Points de conformité',
    needAttention: 'à traiter',
    quickActions: 'Actions rapides',
    memberDirectory: 'Annuaire des membres',
    cooperativeDirectory: 'Annuaire des coopératives',
    systemOverview: 'Vue d\'ensemble',
    eudrAssessments: 'Évaluations EUDR',
    onboardedCooperatives: 'Coopératives intégrées',
    actionRequired: 'Action requise',
    pendingDeclarations: 'Déclarations en attente',
    availableTraining: 'Formations disponibles',
    trainingPrograms: 'Programmes de formation',
    myDeclarations: 'Mes déclarations',
    progress: 'Progression',
    submitted: 'Soumis',
    pending: 'En attente',
    completion: 'Complétion',
    needHelp: 'Besoin d\'aide ?',
    callCooperative: 'Appeler la coopérative',
    sendMessage: 'Envoyer un message',
    trainingVideos: 'Vidéos de formation',
    language: 'Langue',
    theme: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    english: 'English',
    french: 'Français',
    aboutCooperative: 'Votre coopérative',
    cooperativeLabel: 'Coopérative',
    regNumber: 'N° d\'enregistrement',
    buyers: 'Portail acheteurs',
    complianceStatus: 'État de conformité',
    farmersFirstOverview: 'Vue Farmers First',
    registeredMembers: 'Membres enregistrés',
    attendees: 'participants',
    orderManagement: 'La gestion des commandes est disponible sur la plateforme web.',
    buyerPortalDesc: 'Connectez-vous avec des acheteurs vérifiés recherchant des coopératives certifiées.',
    noFarmerProfile: 'Aucun profil agriculteur. Connectez-vous ou scannez le QR code pour accéder à l\'app terrain.',
    noPendingTraining: 'Tout est à jour. Aucune déclaration ou formation en attente.',
    noTrainingAvailable: 'Aucune session de formation disponible pour votre coopérative.',
    noDeclarationsOnRecord: 'Aucune déclaration enregistrée.',
    contactCoopManager: 'Contacter le responsable de votre coopérative',
    messageSupport: 'Envoyer un message au support',
    watchVideos: 'Vidéos d\'instruction',
  },
};

export const translations: Record<Language, MobileTranslations> = { en, fr };

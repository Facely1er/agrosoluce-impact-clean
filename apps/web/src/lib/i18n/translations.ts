/**
 * Translation files for AgroSoluce
 * Bilingual support: English (EN) and French (FR)
 */

export type Language = 'en' | 'fr';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    map: string;
    cooperatives: string;
    directory: string;
    buyers: string;
    cooperativeSpace: string;
    compliance: string;
    partners: string;
    about: string;
    more: string;
    healthImpact: string;
    healthIntelligence: string;
    analytics: string;
    complianceTools: string;
    pilotPrograms: string;
    main: string;
    theme: string;
    language: string;
    /** Dropdown menu titles */
    dataAndDirectory: string;
    healthAndAnalytics: string;
    partnersAndPrograms: string;
    aggregatedDashboard: string;
    hwi: string;
    changeLanguage: string;
    english: string;
    french: string;
    enShort: string;
    frShort: string;
    closeMenu: string;
    openMenu: string;
    themeDark: string;
    themeLight: string;
    frameworkDemo: string;
  };

  // Not found (404)
  notFound: {
    title: string;
    description: string;
    goHome: string;
    browseDirectory: string;
  };

  // Monitoring / Compliance Tools landing
  monitoring: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    intro: string;
    platformNote: string;
    viewDashboard: string;
    newAssessment: string;
    documentationTracking: string;
    documentationTrackingDesc: string;
    farmerEngagement: string;
    farmerEngagementDesc: string;
    progressMonitoring: string;
    progressMonitoringDesc: string;
    riskAssessment: string;
    riskAssessmentDesc: string;
    certificationTracking: string;
    certificationTrackingDesc: string;
    regionalAnalysis: string;
    regionalAnalysisDesc: string;
    whatYouCanMonitor: string;
    documentationCoverageRate: string;
    averageReadinessScore: string;
  };

  // Health Impact Overview page
  healthImpactOverview: {
    breadcrumb: string;
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    conceptTitle: string;
    conceptP1: string;
    conceptP2: string;
    keyInsight: string;
    keyInsightText: string;
    dataSourceTitle: string;
    vracBullet1: string;
    vracBullet2: string;
    vracBullet3: string;
    vracBullet4: string;
    caseStudyTitle: string;
    antimalarialSurge: string;
    productionDecline: string;
    cocoaHarvest: string;
    weekLag: string;
    healthToProduction: string;
    caseStudyBody: string;
    viewRegionalMap: string;
    healthIntelligenceDashboard: string;
    platformFeatures: string;
    businessValue: string;
    forCommodityTraders: string;
    forCommodityTradersDesc: string;
    forProcessors: string;
    forProcessorsDesc: string;
    keyFeatures: {
      regionalMap: { title: string; description: string; linkText: string };
      regionalHealth: { title: string; description: string; linkText: string };
      cooperativeWorkspaces: { title: string; description: string; linkText: string };
      timeLag: { title: string; description: string; linkText: string };
      academicResearch: { title: string; description: string; linkText: string };
    };
    partnerships: { name: string; description: string }[];
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    saving: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    download: string;
    upload: string;
    export: string;
    import: string;
    view: string;
  };

  // Footer
  footer: {
    contact: string;
    principles: string;
    copyright: string;
    navigation: string;
    about: string;
    resources: string;
    aboutUs: string;
    whatWeDo: string;
    whoItsFor: string;
    partners: string;
    directory: string;
    regulatoryReferences: string;
    ngoRegistry: string;
    dueCarePrinciples: string;
    tagline: string;
    description: string;
    logoAlt: string;
    sourceIntelligence: string;
    byErmits: string;
  };

  // Compliance
  compliance: {
    dashboard: string;
    assessments: string;
    newAssessment: string;
    complianceScore: string;
    violations: string;
    certifications: string;
    schoolEnrollment: string;
  };

  // Cooperative
  cooperative: {
    verified: string;
    pending: string;
    region: string;
    department: string;
    sector: string;
    contact: string;
    loading: string;
    notEvaluated: string;
  };

  // Landing Page
  landing: {
    hero: {
      tagline: string;
      title: string;
      subtitle: string;
      description: string;
      ctaCooperatives: string;
      ctaBuyer: string;
      freeNote: string;
    };
    stats: {
      productCategories: string;
      regions: string;
      regionsNote: string;
      complianceFrameworks: string;
    };
    challenges: {
      tagline: string;
      title: string;
      subtitle: string;
      regulatory: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      environmental: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      social: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
    };
    value: {
      tagline: string;
      title: string;
      subtitle: string;
    };
    outcomes: {
      title: string;
      subtitle: string;
      buyerConnections: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
        cta: string;
      };
      readiness: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
      coverage: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
      assessment: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
        cta: string;
      };
      evidence: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
      compliance: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
        cta: string;
      };
      farmersFirst: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
      traceability: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
      gaps: {
        title: string;
        feature: string;
        outcome1: string;
        outcome2: string;
        outcome3: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      buttonCooperatives: string;
      buttonBuyer: string;
    };
    quickLinks: {
      title: string;
      subtitle: string;
      forBuyers: {
        title: string;
        description: string;
        learnMore: string;
      };
      forPartners: {
        title: string;
        description: string;
        learnMore: string;
      };
      whatWeDo: {
        title: string;
        description: string;
        learnMore: string;
      };
    };
    carousel: {
      item1: string;
      item2: string;
      item3: string;
    };
    heroSubtitle: {
      line1: string;
      line2: string;
    };
  };

  // About Page
  about: {
    title: string;
    subtitle: string;
    why: {
      title: string;
      subtitle: string;
      problem: {
        title: string;
        question1: string;
        question2: string;
        question3: string;
        reality: string;
      };
      solution: {
        title: string;
        point1: string;
        point2: string;
        point3: string;
        point4: string;
      };
    };
    whatNot: {
      title: string;
      subtitle: string;
      points: string[];
      footer: string;
    };
    designPrinciples: {
      title: string;
      subtitle: string;
      farmerFirst: {
        title: string;
        description: string;
      };
      progress: {
        title: string;
        description: string;
      };
      transparency: {
        title: string;
        description: string;
      };
      process: {
        title: string;
        description: string;
      };
    };
    oneSentence: string;
    cta: {
      explore: string;
      learnMore: string;
    };
  };

  // What We Do Page
  whatWeDo: {
    title: string;
    subtitle: string;
    features: {
      visibility: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      coverage: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      dueDiligence: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
        cta: string;
      };
      farmersFirst: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      progress: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
        cta: string;
      };
    };
    footer: string;
    cta: string;
  };

  // Who It's For Page
  whoItsFor: {
    title: string;
    subtitle: string;
    audiences: {
      cooperatives: {
        title: string;
        benefit1: string;
        benefit2: string;
        benefit3: string;
        benefit4: string;
        cta: string;
      };
      buyers: {
        title: string;
        benefit1: string;
        benefit2: string;
        benefit3: string;
        benefit4: string;
        cta: string;
      };
      partners: {
        title: string;
        benefit1: string;
        benefit2: string;
        benefit3: string;
        benefit4: string;
        cta: string;
      };
    };
    disclaimer: string;
  };

  // Buyer Landing Page
  buyerLanding: {
    hero: {
      tagline: string;
      title: string;
      subtitle: string;
      description: string;
    };
    problem: {
      title: string;
      subtitle: string;
      points: string[];
      solution: string;
    };
    how: {
      title: string;
    };
    features: {
      discover: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      coverage: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      engagement: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      progress: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
    };
    whatGet: {
      title: string;
      youGet: {
        title: string;
        points: string[];
      };
      youDont: {
        title: string;
        points: string[];
      };
      footer: string;
    };
    why: {
      title: string;
      points: string[];
    };
    cta: {
      explore: string;
      pilot: string;
    };
    disclaimer: string;
  };

  // Cooperative Space Landing
  cooperativeSpace: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      evidence: {
        title: string;
        description: string;
      };
      coverage: {
        title: string;
        description: string;
      };
      compliance: {
        title: string;
        description: string;
      };
      farmersFirst: {
        title: string;
        description: string;
      };
      enablement: {
        title: string;
        description: string;
      };
      producers: {
        title: string;
        description: string;
      };
    };
    benefits: {
      title: string;
      documentation: {
        title: string;
        description: string;
      };
      gapAnalysis: {
        title: string;
        description: string;
      };
      enablement: {
        title: string;
        description: string;
      };
      transparency: {
        title: string;
        description: string;
      };
      traceability: {
        title: string;
        description: string;
      };
      compliance: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      findCooperative: string;
      learnMore: string;
      freeNote: string;
    };
    info: {
      title: string;
      description1: string;
      description2: string;
    };
    links: {
      lookingFor: string;
      browseDirectory: string;
      buyerPortal: string;
      about: string;
    };
  };
  // Workspace
  workspace: {
    aboutThisWorkspace: string;
    pilotId: string;
    pilotLabel: string;
    pilotLabelOptional: string;
    enterPilotId: string;
    enterPilotLabel: string;
    languageNotes: string;
    backToDirectory: string;
    exploreDirectory: string;
    cooperativeIdRequired: string;
    loadingWorkspace: string;
    cooperativeWorkspace: string;
    manageComplianceJourney: string;
    documentationEvidenceEnablement: string;
    workspaceDescription: string;
    publicAccess: string;
    evidenceManagement: string;
    evidenceManagementDesc: string;
    coverageTracking: string;
    coverageTrackingDesc: string;
    gapAnalysis: string;
    gapAnalysisDesc: string;
    enablement: string;
    enablementDesc: string;
    whatWorkspaceProvides: string;
    documentationManagement: string;
    documentationManagementDesc: string;
    coverageMetrics: string;
    coverageMetricsDesc: string;
    complianceReadiness: string;
    complianceReadinessDesc: string;
    gapIdentification: string;
    gapIdentificationDesc: string;
    enablementResources: string;
    enablementResourcesDesc: string;
    farmerEngagement: string;
    farmerEngagementDesc: string;
    workspaceNote: string;
    workspaceNoteDetail: string;
    workspaceNoteDetail2: string;
    tabs: {
      overview: string;
      evidence: string;
      coverage: string;
      gaps: string;
      enablement: string;
      farmersFirst: string;
      assessment: string;
    };
    overview: {
      pilot: string;
      none: string;
      farmersFirstSnapshot: string;
      farmersFirstSnapshotDesc: string;
      viewFullDashboard: string;
      onboarding: string;
      declarations: string;
      training: string;
      impactData: string;
      baselineSet: string;
      noBaseline: string;
      noFarmersFirstData: string;
      selfAssessment: string;
      selfAssessmentDesc: string;
      viewAssessment: string;
      startAssessment: string;
      loadingAssessment: string;
      noAssessmentCompleted: string;
      score: string;
      completed: string;
      selfAssessmentNote: string;
      dueDiligenceSummary: string;
      dueDiligenceSummaryDesc: string;
      exportSummary: string;
      exporting: string;
      readinessStatus: string;
      createSnapshot: string;
      creating: string;
      noReadinessSnapshot: string;
      createFirstSnapshot: string;
      snapshotHistory: string;
      currentStatus: string;
      lastUpdated: string;
      snapshotReason: string;
      readinessNote: string;
      countryContext: string;
      landTenureOverview: string;
      commonlyAcceptedDocuments: string;
      knownLimitations: string;
      publicSources: string;
      informationalContentOnly: string;
      countryContextNote: string;
      commodityContext: string;
      typicalSupplyChain: string;
      commonDocumentPatterns: string;
      buyerExpectationsSummary: string;
      knownChallenges: string;
      referenceLinks: string;
      commodityContextNote: string;
      regulatoryContext: string;
      regulatoryContextNote: string;
      loadingOverview: string;
      errorLoadingOverview: string;
      retry: string;
    };
    evidence: {
      evidenceDocuments: string;
      uploadDocument: string;
      uploadNewDocument: string;
      documentType: string;
      title: string;
      issuer: string;
      issueDate: string;
      expirationDate: string;
      file: string;
      selectType: string;
      documentTitle: string;
      issuingOrganization: string;
      uploading: string;
      closeUploadForm: string;
      loadingDocuments: string;
      noDocumentsUploaded: string;
      uploadFirstEvidence: string;
      evidenceType: string;
      dates: string;
      status: string;
      unverified: string;
      issued: string;
      expires: string;
      uploaded: string;
      areYouSureDelete: string;
      errorDeleting: string;
    };
    coverage: {
      documentCoverage: string;
      coverageSummary: string;
      requiredDocumentsTotal: string;
      requiredDocumentsPresent: string;
      coveragePercentage: string;
      lastUpdated: string;
      requiredDocumentTypes: string;
      noRequiredDocumentTypes: string;
      present: string;
      missing: string;
      loadingCoverage: string;
      errorLoadingCoverage: string;
      refresh: string;
    };
    gaps: {
      loadingGapAnalysis: string;
      errorLoadingGap: string;
      currentDocumentationGaps: string;
      whyCommonlyRequested: string;
      typicalNextSteps: string;
      noDocumentationGaps: string;
      allExpectedDocumentTypes: string;
      informationalDueDiligence: string;
      finalDecisionsRemain: string;
    };
    enablementTab: {
      loadingEnablement: string;
      whatBuyersUsuallyRequest: string;
      currentPilotExpectations: string;
      expectedDocumentTypes: string;
      noSpecificDocumentRequirements: string;
      noActivePilotScope: string;
      howInformationUsed: string;
      farmerDeclarationsSummary: string;
      loadingDocumentStatus: string;
      documentationProvided: string;
      farmerGuidance: string;
      farmerGuidanceDesc: string;
      importantNote: string;
      contentIntended: string;
      doesNotReplaceLegal: string;
      explanation: string;
      whatIsUsuallyAcceptable: string;
      commonMisunderstandings: string;
      fieldOfficerToolkit: string;
      fieldOfficerToolkitDesc: string;
      guidanceNotRules: string;
      toolkitProvides: string;
      downloadFieldToolkit: string;
      preparingDownload: string;
      farmerProtectionPrinciples: string;
      learnAboutAgroSoluce: string;
      viewFarmerProtectionPrinciples: string;
      exportEnablementData: string;
      exportingEnablement: string;
    };
  };

  // Pilot
  pilot: {
    backToDirectory: string;
    exploreDirectory: string;
    pilotIdRequired: string;
    emptyDashboard: string;
    emptyDashboardDescription: string;
    verifyPilotId: string;
  };

  // Directory
  directory: {
    languageNotes: string;
    aboutThisReference: string;
    aboutThisRegistry: string;
  };

  // Cooperative Workspace Landing (no data)
  cooperativeWorkspaceLanding: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      evidence: {
        title: string;
        description: string;
      };
      coverage: {
        title: string;
        description: string;
      };
      compliance: {
        title: string;
        description: string;
      };
      farmersFirst: {
        title: string;
        description: string;
      };
    };
    benefits: {
      title: string;
      documentation: {
        title: string;
        description: string;
      };
      gapAnalysis: {
        title: string;
        description: string;
      };
      enablement: {
        title: string;
        description: string;
      };
      transparency: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      register: string;
      learnMore: string;
      freeNote: string;
    };
    additional: {
      alreadyRegistered: string;
      errorMessage: string;
      checkDirectory: string;
    };
  };
  // Partner Landing Page
  partnerLanding: {
    hero: {
      tagline: string;
      title: string;
      subtitle: string;
      description: string;
    };
    challenge: {
      title: string;
      subtitle: string;
      points: string[];
      solution: string;
    };
    how: {
      title: string;
    };
    features: {
      baselines: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      monitoring: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
        point4: string;
      };
      progress: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
      views: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
      };
    };
    whatIs: {
      title: string;
      is: {
        title: string;
        points: string[];
      };
      isNot: {
        title: string;
        points: string[];
      };
    };
    why: {
      title: string;
      points: string[];
    };
    cta: {
      pilot: string;
      explore: string;
    };
    disclaimer: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      map: 'Map',
      cooperatives: 'Cooperatives',
      directory: 'Directory',
      buyers: 'Buyers',
      cooperativeSpace: 'Cooperative Space',
      compliance: 'Monitoring',
      partners: 'Partners & NGOs',
      about: 'About',
      more: 'More',
      healthImpact: 'Health & Impact',
      healthIntelligence: 'Health Intelligence',
      analytics: 'Analytics',
      complianceTools: 'Compliance Tools',
      pilotPrograms: 'Pilot Programs',
      main: 'Main',
      theme: 'Theme',
      language: 'Language',
      dataAndDirectory: 'Data & Directory',
      healthAndAnalytics: 'Health & Analytics',
      partnersAndPrograms: 'Partners & Programs',
      aggregatedDashboard: 'Aggregated Dashboard',
      hwi: 'Household Welfare Index',
      changeLanguage: 'Change language',
      english: '🇬🇧 English',
      french: '🇫🇷 Français',
      enShort: '🇬🇧 EN',
      frShort: '🇫🇷 FR',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
      themeDark: 'Dark',
      themeLight: 'Light',
      frameworkDemo: 'Framework Demo',
    },
    notFound: {
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
      goHome: 'Go Home',
      browseDirectory: 'Browse Directory',
    },
    monitoring: {
      breadcrumb: 'Monitoring',
      badge: 'Compliance & Monitoring',
      title: 'Child Labor Monitoring & Compliance',
      subtitle: 'Track documentation, self-assessments, and improvement efforts across agricultural cooperatives',
      intro: 'AgroSoluce™ supports learning, monitoring, and improvement — not marketing narratives. Our monitoring platform helps cooperatives, buyers, and partners track child labor prevention efforts, documentation coverage, and compliance readiness across supply chains.',
      platformNote: 'AgroSoluce™ supports learning, monitoring, and improvement — not marketing narratives.',
      viewDashboard: 'View Dashboard',
      newAssessment: 'New Assessment',
      documentationTracking: 'Documentation Tracking',
      documentationTrackingDesc: 'Monitor documentation coverage rates, track self-assessment scores, and identify gaps in compliance readiness across cooperatives.',
      farmerEngagement: 'Farmer Engagement',
      farmerEngagementDesc: 'Track farmer-level activities at cooperative scale, including training participation, declarations, and baseline indicators.',
      progressMonitoring: 'Progress Monitoring',
      progressMonitoringDesc: 'Track progress over time with readiness scores, violation trends, and improvement plans.',
      riskAssessment: 'Risk Assessment',
      riskAssessmentDesc: 'Identify and prioritize child labor risks at the cooperative and community level.',
      certificationTracking: 'Certification Tracking',
      certificationTrackingDesc: 'Monitor certification status and alignment with due diligence requirements.',
      regionalAnalysis: 'Regional Analysis',
      regionalAnalysisDesc: 'Compare readiness and compliance metrics across regions and commodities.',
      whatYouCanMonitor: 'What You Can Monitor',
      documentationCoverageRate: 'Documentation Coverage Rate',
      averageReadinessScore: 'Average Readiness Score',
    },
    healthImpactOverview: {
      breadcrumb: 'Health & Impact',
      badge: 'Health-Agriculture Impact Analysis',
      heroTitle: 'Health and Agricultural Productivity',
      heroSubtitle: 'Pharmacy surveillance (VRAC) in cocoa regions provides a workforce health proxy; a 3–4 week lag to harvest impact is documented in research. Use it alongside satellite and production data for impact analysis.',
      conceptTitle: 'Understanding the Health-Agriculture Correlation',
      conceptP1: 'Agricultural productivity in cocoa-growing regions is fundamentally tied to workforce health. When malaria surges affect farmers and their families, harvest efficiency drops dramatically.',
      conceptP2: 'Satellite monitoring tracks forest cover and land use; workforce health factors that affect production capacity are observed via complementary data such as pharmacy surveillance.',
      keyInsight: 'Key Insight',
      keyInsightText: 'Malaria reduces harvest efficiency by 40-60% during acute episodes. VRAC pharmacy data detects these surges weeks before they impact production.',
      dataSourceTitle: 'The Data Source',
      vracBullet1: 'VRAC (Veille Régionale Anti-Contrefaçon) - Pharmacy surveillance network',
      vracBullet2: 'Tracks antimalarial sales across cocoa-producing regions',
      vracBullet3: 'Real-time proxy for workforce health burden',
      vracBullet4: 'Complements satellite and weather data',
      caseStudyTitle: 'Case Study: Gontougo Malaria Surge',
      antimalarialSurge: 'Antimalarial Surge',
      productionDecline: 'Production Decline',
      cocoaHarvest: 'Cocoa harvest',
      weekLag: 'Week Lag',
      healthToProduction: 'Health → Production',
      caseStudyBody: 'The Gontougo region experienced a dramatic malaria surge between August and December 2024, with antimalarial sales spiking to 10 times normal levels. Three to four weeks later, cocoa production declined by 24% — a clear demonstration of how workforce health directly impacts agricultural output.',
      viewRegionalMap: 'View Regional Map',
      healthIntelligenceDashboard: 'Health Intelligence Dashboard',
      platformFeatures: 'Platform Features',
      businessValue: 'Business Value',
      forCommodityTraders: 'For Commodity Traders',
      forCommodityTradersDesc: 'Early warning signals for supply disruptions, enabling proactive hedging and logistics planning.',
      forProcessors: 'For Processors',
      forProcessorsDesc: 'Production impact visibility to align procurement and capacity planning with health trends.',
      keyFeatures: {
        regionalMap: { title: 'Regional Map', description: 'Cooperatives and health by region: map view with health layers and heatmap', linkText: 'Explore Map' },
        regionalHealth: { title: 'Regional Health Index', description: 'Track antimalarial share by pharmacy and period across cocoa-growing regions', linkText: 'View Health Intelligence' },
        cooperativeWorkspaces: { title: 'Cooperative Workspaces', description: 'Health data integrated with production metrics for individual cooperatives', linkText: 'Browse Cooperatives' },
        timeLag: { title: 'Time-Lag Analysis', description: 'Correlation between malaria surges and harvest efficiency decline', linkText: 'View time-lag analysis' },
        academicResearch: { title: 'Academic Research', description: 'Validated by studies on cocoa farmers in Côte d\'Ivoire and Nigeria', linkText: 'View Research' },
      },
      partnerships: [
        { name: 'Marcus Weather', description: 'Weather + workforce health integration' },
        { name: 'Satelligence', description: 'Satellite + health monitoring' },
        { name: 'EarthDaily Agro', description: 'Yield models + labor productivity' },
      ],
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      download: 'Download',
      upload: 'Upload',
      export: 'Export',
      import: 'Import',
      view: 'View',
    },
    footer: {
      contact: 'Contact',
      principles: 'Principles',
      copyright: 'All rights reserved',
      navigation: 'Navigation',
      about: 'About',
      resources: 'Resources',
      aboutUs: 'About Us',
      whatWeDo: 'What We Do',
      whoItsFor: 'Who It\'s For',
      partners: 'Partners',
      directory: 'Directory',
      regulatoryReferences: 'Regulatory References',
      ngoRegistry: 'NGO Registry',
      dueCarePrinciples: 'Due Care Principles',
      tagline: 'Farmer-first due diligence for deforestation-free, responsible sourcing',
      description: 'Making farmer engagement, documentation, and progress visible across supply chains',
      logoAlt: 'AgroSoluce Logo',
      sourceIntelligence: 'Source Intelligence',
      byErmits: 'by ERMITS',
    },
    compliance: {
      dashboard: 'Child Labor Monitoring Dashboard',
      assessments: 'Assessments',
      newAssessment: 'New Assessment',
      complianceScore: 'Readiness Score',
      violations: 'Violations',
      certifications: 'Certifications',
      schoolEnrollment: 'School Enrollment',
    },
    cooperative: {
      verified: 'Verified',
      pending: 'Pending',
      region: 'Region',
      department: 'Department',
      sector: 'Sector',
      contact: 'Contact',
      loading: 'Loading...',
      notEvaluated: 'Not Evaluated',
    },
    landing: {
    hero: {
      tagline: 'Farmer-first due diligence for deforestation-free, responsible sourcing',
      title: 'AgroSoluce™',
      subtitle: 'Making Farmer Engagement, Documentation Coverage, and Improvement Efforts Visible',
      description: 'AgroSoluce™ helps cooperatives, buyers, and partners see real farmer engagement, documentation, and progress — without overstating readiness or replacing audits. From farmer to cooperative to buyer, we support credible, EUDR-aligned due diligence across agricultural supply chains.',
      ctaCooperatives: 'Explore Cooperatives',
      ctaBuyer: 'Buyer Portal',
      freeNote: 'Free for cooperatives • Transparent • Progress-focused',
    },
      stats: {
        productCategories: 'Product Categories',
        regions: 'Regions in Ivory Coast',
        regionsNote: 'Accurately counted',
        complianceFrameworks: 'Compliance Frameworks',
      },
      challenges: {
        tagline: 'The Challenges We Address',
        title: 'Facing Critical Pressures',
        subtitle: 'West African agricultural cooperatives navigate an increasingly complex landscape where regulatory requirements, environmental threats, and social responsibilities intersect — creating both risks and opportunities.',
        regulatory: {
          title: 'Regulatory Pressure',
          description: 'New regulations are transforming global supply chains, demanding unprecedented levels of documentation, traceability, and due diligence from cooperatives.',
          point1: 'EUDR mandates deforestation-free supply chains with complete traceability, requiring detailed documentation that many cooperatives find challenging to produce',
          point2: 'Child labor due diligence requirements can create market access barriers for cooperatives without systematic risk assessment and remediation tracking',
          point3: 'Buyers increasingly demand comprehensive documentation portfolios, with potential exclusion from European markets for those unable to provide required evidence',
        },
        environmental: {
          title: 'Environmental Challenges',
          description: 'Climate change and deforestation threaten both agricultural productivity and market access, creating urgent need for environmental documentation and risk management.',
          point1: 'Deforestation-linked agriculture faces potential European market exclusion under EUDR regulations, affecting many cooperatives and farmers across West Africa',
          point2: 'Climate change impacts crop yields and farmer livelihoods across West Africa, requiring adaptation strategies and documentation of environmental practices',
          point3: 'Protected area overlap and biodiversity loss create documentation requirements and reputation risks that can impact market access',
        },
        social: {
          title: 'Social Challenges',
          description: 'Ensuring ethical supply chains while maintaining farmer livelihoods requires balancing regulatory requirements with community needs.',
          point1: 'Child labor remains a critical concern, with zero-tolerance policies from major buyers requiring systematic risk assessment and remediation',
          point2: 'Smallholder farmers struggle with poverty, limiting their ability to invest in documentation, training, and process improvements needed for market access',
          point3: 'Limited access to technology and training creates barriers to meeting new regulatory requirements, potentially excluding vulnerable communities from global markets',
        },
      },
      value: {
        tagline: 'Value We Bring',
        title: 'Transforming Challenges into Opportunities',
        subtitle: 'AgroSoluce™ helps cooperatives turn regulatory pressure, environmental risks, and social challenges into pathways for market access, improved documentation, and stronger buyer relationships — all while supporting farmer livelihoods and forest preservation efforts.',
      },
      outcomes: {
        title: 'Value Delivered',
        subtitle: 'How we help cooperatives address challenges and work toward their goals',
        buyerConnections: {
          title: 'Market Access & Buyer Connections',
          feature: 'Support market access by connecting with buyers who value transparency, documentation readiness, and sustainable sourcing practices',
          outcome1: 'Connect with buyers requiring EUDR-aligned documentation and child-labor-free supply chain evidence',
          outcome2: 'Showcase your documentation readiness and due diligence efforts through transparent self-reported information and assessments',
          outcome3: 'Expand your reach to sustainability-focused global partners who value progressive improvement and transparency',
          cta: 'Access matching',
        },
        readiness: {
          title: 'EUDR Readiness & Documentation',
          feature: 'Systematically organize and build the documentation and evidence portfolio needed to support EUDR requirements and demonstrate readiness to buyers',
          outcome1: 'Track progress from not_ready to buyer_ready status with clear, actionable milestones and documentation checkpoints',
          outcome2: 'Maintain an evidence history showing continuous improvement in documentation coverage and due diligence efforts',
          outcome3: 'Identify and prioritize documentation gaps to help prevent them from becoming barriers to market access',
        },
        coverage: {
          title: 'Deforestation Risk Mitigation',
          feature: 'Support market access efforts by documenting deforestation-free supply chains with comprehensive farmer and plot coverage',
          outcome1: 'Document farmer and plot coverage to show supply chain transparency and traceability',
          outcome2: 'Use GPS geolocation to document plot locations relative to deforestation risk zones and protected areas',
          outcome3: 'Organize an evidence portfolio showing environmental stewardship efforts, protected area awareness, and deforestation risk management activities',
        },
        assessment: {
          title: 'Documentation Gap Identification',
          feature: 'Understand where you stand and what documentation or processes may need improvement to support regulatory requirements',
          outcome1: 'Complete a comprehensive self-assessment of your documentation status across EUDR, child labor due diligence, and other regulatory frameworks',
          outcome2: 'Receive a prioritized action plan based on documentation gaps, risk factors, and potential market access impact',
          outcome3: 'Track improvement over time with progress indicators showing documentation growth and readiness evolution',
          cta: 'Start assessment',
        },
        evidence: {
          title: 'Regulatory Documentation Management',
          feature: 'Organize and structure the evidence portfolio that buyers and regulators may require for market access and due diligence',
          outcome1: 'Organize all regulatory documentation (EUDR-related, child labor due diligence, certifications) in one centralized location',
          outcome2: 'Structure documentation with appropriate metadata, timestamps, and self-reported status information to support buyer requirements',
          outcome3: 'Help reduce market exclusion risk by maintaining organized, accessible documentation records that support due diligence processes',
        },
        compliance: {
          title: 'Child Labor Risk Management',
          feature: 'Support zero tolerance for child labor through systematic risk assessment and remediation tracking while supporting farmer livelihoods',
          outcome1: 'Conduct systematic self-assessments to identify and document child labor risks in your supply chain',
          outcome2: 'Track remediation actions and efforts to address child labor risks while maintaining farmer income and community stability',
          outcome3: 'Support buyer trust-building through transparent risk tracking, remediation documentation, and certification management',
          cta: 'View dashboard',
        },
        farmersFirst: {
          title: 'Farmer Livelihood Protection',
          feature: 'Support efforts to ensure that meeting regulatory requirements and building documentation supports rather than harms smallholder farmer communities',
          outcome1: 'Register farmers systematically to track training, support, and engagement at the cooperative level',
          outcome2: 'Track farmer engagement to help ensure that documentation and due diligence requirements don\'t exclude vulnerable communities from supply chains',
          outcome3: 'Track social impact indicators to show how meeting regulatory requirements and farmer welfare efforts can be pursued together',
        },
        traceability: {
          title: 'Supply Chain Transparency',
          feature: 'Support EUDR traceability requirements by documenting and tracking products from plot to market',
          outcome1: 'Document the supply chain from individual plots to final sale with transfer records and origin mapping',
          outcome2: 'Provide buyers with origin mapping and documentation of deforestation-free sourcing practices',
          outcome3: 'Maintain documentation records that support regulatory due diligence and buyer verification processes',
        },
        gaps: {
          title: 'Targeted Improvement Guidance',
          feature: 'Get specific, actionable guidance to help close documentation and process gaps',
          outcome1: 'Identify missing documentation or processes to help prevent them from becoming barriers to market access',
          outcome2: 'Receive step-by-step guidance tailored to your specific documentation gaps and regulatory requirements',
          outcome3: 'Access resources and tools that support building required documentation and processes',
        },
      },
      cta: {
        title: 'Join the Mission',
        subtitle: 'Together, we can build sustainable, transparent supply chains that support farmers, forests, and future generations while meeting regulatory requirements',
        buttonCooperatives: 'Explore Cooperatives',
        buttonBuyer: 'Buyer Portal',
      },
      quickLinks: {
        title: 'Learn More',
        subtitle: 'Explore how AgroSoluce™ supports responsible sourcing for different audiences',
        forBuyers: {
          title: 'For Buyers',
          description: 'Understand what exists, what is missing, and where to focus due diligence',
          learnMore: 'Learn more',
        },
        forPartners: {
          title: 'For NGOs & Partners',
          description: 'Make farmer-level progress visible without distorting reality',
          learnMore: 'Learn more',
        },
        whatWeDo: {
          title: 'What We Do',
          description: 'See how AgroSoluce™ supports responsible sourcing through transparency',
          learnMore: 'Learn more',
        },
      },
      carousel: {
        item1: 'We help cooperatives and buyers see real farmer engagement, documentation, and progress.',
        item2: 'Transparent progress — without overstating readiness or replacing audits.',
        item3: 'From farmer to cooperative to buyer: credible, EUDR-aligned due diligence across the supply chain.',
      },
      heroSubtitle: {
        line1: 'Making Farmer Engagement, Documentation Coverage,',
        line2: 'and Improvement Efforts Visible',
      },
    },
    about: {
      title: 'About AgroSoluce™',
      subtitle: 'Farmer-first due diligence for deforestation-free, responsible sourcing',
      why: {
        title: 'Why AgroSoluce™ Exists',
        subtitle: 'Responsible sourcing is no longer optional — but most tools still ask impossible questions that don\'t reflect reality in real supply chains.',
        problem: {
          title: 'The Problem with Traditional Tools',
          question1: 'Are you fully compliant?',
          question2: 'Do you certify this cooperative?',
          question3: 'Can you guarantee zero risk?',
          reality: 'In real supply chains, those answers don\'t exist.',
        },
        solution: {
          title: 'AgroSoluce™ Reflects Reality',
          point1: 'Uneven documentation',
          point2: 'Gradual improvements',
          point3: 'Real people on the ground',
          point4: 'Continuous due diligence — not one-time declarations',
        },
      },
      whatNot: {
        title: 'What AgroSoluce™ Is Not',
        subtitle: 'To be clear, AgroSoluce™:',
        points: [
          'is not a certification body',
          'does not declare EUDR or labor compliance',
          'does not replace audits, field visits, or satellite analysis',
          'does not guarantee outcomes',
        ],
        footer: 'It supports decisions — it does not replace responsibility.',
      },
      designPrinciples: {
        title: 'Our Design Principles',
        subtitle: 'The values that guide how we build AgroSoluce™',
        farmerFirst: {
          title: 'Farmer-first, not document-first',
          description: 'We start from the farmer and structure reality at the cooperative level, ensuring farmer engagement is visible without exposing sensitive personal data.',
        },
        progress: {
          title: 'Progress over perfection',
          description: 'We track gradual improvements and readiness over time, recognizing that building documentation and meeting regulatory requirements is a journey, not a destination.',
        },
        transparency: {
          title: 'Transparency without over-claiming',
          description: 'We show what exists, what is missing, and where further verification may be required — without false compliance claims.',
        },
        process: {
          title: 'Due diligence as a process, not a badge',
          description: 'We support continuous due diligence efforts, enabling ongoing oversight and documentation building rather than one-off verification checks.',
        },
      },
      oneSentence: 'AgroSoluce™ makes farmer engagement, documentation coverage, and improvement efforts visible — responsibly, progressively, and without false compliance claims.',
      cta: {
        explore: 'Explore Cooperatives',
        learnMore: 'Learn What We Do',
      },
    },
    whatWeDo: {
      title: 'What AgroSoluce™ Does',
      subtitle: 'Supporting Responsible Sourcing Through Transparency',
      features: {
        visibility: {
          title: '1. Make Cooperatives Visible',
          description: 'AgroSoluce™ provides a structured directory of agricultural cooperatives, showing who they are, where they operate, what crops they produce, and what information is available today.',
          point1: 'No inflated claims. No black boxes.',
          point2: 'Stable, shareable cooperative profiles',
          point3: 'Clear visibility into identity and sourcing context',
        },
        coverage: {
          title: '2. Show Documentation Coverage — Not Compliance',
          description: 'Instead of binary labels, AgroSoluce™ displays documentation coverage indicators: Limited, Partial, Substantial.',
          point1: 'Help buyers understand what exists, what is missing, and where further verification may be required',
          point2: 'Avoid false compliance claims while showing real progress',
          point3: 'Support informed due diligence decisions based on actual documentation',
        },
        dueDiligence: {
          title: '3. Support EUDR & Child-Labor Due Diligence',
          description: 'AgroSoluce™ supports due diligence by structuring cooperative identity and sourcing context, highlighting documentation gaps, surfacing farmer engagement signals, and tracking improvement efforts over time.',
          point1: 'Provide operational foundation required to perform due diligence responsibly',
          point2: 'AgroSoluce™ does not certify compliance — it supports the process',
          point3: 'Enable continuous due diligence, not one-time declarations',
          cta: 'View Compliance Dashboard',
        },
        farmersFirst: {
          title: '4. Put Farmers First',
          description: 'AgroSoluce™ connects farmer-level actions to cooperative-level insight through a Farmers First toolkit, supporting farmer onboarding, training participation tracking, declarations and attestations, and baseline and progress indicators.',
          point1: 'Make farmer engagement visible — without exposing sensitive personal data',
          point2: 'Track farmer-level activities at cooperative scale',
          point3: 'Support behavior-based risk assessment, not just paperwork',
        },
        progress: {
          title: '5. Track Progress, Not Just Promises',
          description: 'AgroSoluce™ records readiness snapshots and self-assessments over time, enabling transparent progress tracking, honest gap identification, and meaningful follow-up actions.',
          point1: 'All assessments are explicitly self-reported and non-certifying',
          point2: 'Enable buyers to demonstrate ongoing oversight, not one-off checks',
          point3: 'Support evidence-aware reporting, not inflated claims',
          cta: 'Start Assessment',
        },
      },
      footer: 'AgroSoluce™ provides the operational foundation required to perform due diligence responsibly — without false compliance claims.',
      cta: 'Explore the Cooperative Directory',
    },
    whoItsFor: {
      title: 'Who AgroSoluce™ Is For',
      subtitle: 'Designed for cooperatives, buyers, and partners working toward responsible sourcing',
      audiences: {
        cooperatives: {
          title: 'For Cooperatives',
          benefit1: 'Organize documentation clearly',
          benefit2: 'Demonstrate effort, not perfection',
          benefit3: 'Prioritize next steps without guesswork',
          benefit4: 'Build trust with buyers and partners',
          cta: 'Access Your Workspace',
        },
        buyers: {
          title: 'For Buyers & Sourcing Teams',
          benefit1: 'Discover cooperatives transparently',
          benefit2: 'Understand what information exists today',
          benefit3: 'Identify where enhanced due diligence is needed',
          benefit4: 'Support engagement instead of exclusion',
          cta: 'Explore Buyer Portal',
        },
        partners: {
          title: 'For NGOs & Partners',
          benefit1: 'Monitor improvement efforts across programs or pilots',
          benefit2: 'Track farmer engagement at cooperative scale',
          benefit3: 'Work from a shared, evidence-aware baseline',
          benefit4: 'Support learning, monitoring, and improvement — not marketing narratives',
          cta: 'Contact Us',
        },
      },
      disclaimer: 'AgroSoluce™ supports due diligence and transparency efforts. Information shown may include self-reported data and does not constitute certification, regulatory approval, or verified compliance.',
    },
    buyerLanding: {
      hero: {
        tagline: 'For Buyers & Sourcing Teams',
        title: 'AgroSoluce™ for Buyers',
        subtitle: 'Responsible Sourcing Starts With Visibility — Not Assumptions',
        description: 'AgroSoluce™ helps buyers understand what exists, what is missing, and where to focus due diligence — without forcing cooperatives into false compliance claims. We provide a structured, farmer-first view of cooperatives so sourcing decisions are based on transparency and progress, not guesswork.',
      },
      problem: {
        title: 'The Buyer Problem',
        subtitle: 'Sourcing teams are under pressure to:',
        points: [
          'support EUDR and labor-risk due diligence',
          'demonstrate responsible sourcing',
          'and make decisions with incomplete information',
        ],
        solution: 'What\'s missing is not another certification — it\'s clear visibility into reality.',
      },
      how: {
        title: 'How AgroSoluce™ Supports Buyer Due Diligence',
      },
      features: {
        discover: {
          title: '1. Discover Cooperatives Transparently',
          description: 'Explore a structured directory of agricultural cooperatives with identity and sourcing context, crop and regional information, and stable, shareable profiles.',
          point1: 'No hidden scoring. No black boxes.',
          point2: 'Clear visibility into cooperative identity and sourcing context',
          point3: 'Stable, shareable profiles for due diligence workflows',
        },
        coverage: {
          title: '2. See Documentation Coverage (Not Binary Compliance)',
          description: 'AgroSoluce™ displays documentation coverage as Limited, Partial, or Substantial. This helps buyers quickly assess readiness to engage, need for enhanced due diligence, and where further verification is required.',
          point1: 'Understand what information exists today',
          point2: 'Identify where enhanced due diligence is needed',
          point3: 'Make informed decisions based on actual documentation status',
        },
        engagement: {
          title: '3. Understand Farmer Engagement',
          description: 'Beyond documents, AgroSoluce™ shows whether farmers are onboarded, training participation at cooperative level, and declarations and engagement activity over time.',
          point1: 'Support behavior-based risk assessment, not just paperwork',
          point2: 'See farmer-level engagement signals at cooperative scale',
          point3: 'Track engagement activity over time',
        },
        progress: {
          title: '4. Track Progress Over Time',
          description: 'AgroSoluce™ records readiness snapshots, cooperative self-assessments, and visible improvements and remaining gaps.',
          point1: 'Enable buyers to demonstrate ongoing oversight, not one-off checks',
          point2: 'Observe improvement trajectories and remaining gaps',
          point3: 'Support evidence-aware reporting and due diligence documentation',
        },
      },
      whatGet: {
        title: 'What Buyers Get (and What They Don\'t)',
        youGet: {
          title: 'You get:',
          points: [
            'structured, comparable cooperative profiles',
            'transparency on information coverage',
            'visibility into farmer-level engagement',
          ],
        },
        youDont: {
          title: 'You don\'t get:',
          points: [
            'compliance guarantees',
            'automated risk determinations',
            'certification badges',
          ],
        },
        footer: 'AgroSoluce™ supports your due diligence — it does not replace it.',
      },
      why: {
        title: 'Why Buyers Use AgroSoluce™',
        points: [
          'Reduce sourcing blind spots',
          'Prioritize engagement instead of exclusion',
          'Prepare audits and field verification more efficiently',
          'Support responsible sourcing without over-claiming',
        ],
      },
      cta: {
        explore: 'Explore the Directory',
        pilot: 'Join a Buyer Pilot',
      },
      disclaimer: 'AgroSoluce™ supports due diligence processes. All information may include self-reported data and does not constitute certification or regulatory approval.',
    },
    partnerLanding: {
      hero: {
        tagline: 'For NGOs & Program Partners',
        title: 'AgroSoluce™ for NGOs & Program Partners',
        subtitle: 'Make Farmer-Level Progress Visible — Without Distorting Reality',
        description: 'AgroSoluce™ helps NGOs and partners monitor, structure, and support improvement efforts across cooperatives — starting from farmers and aggregating to programs and pilots. We focus on what is happening, not what is claimed.',
      },
      challenge: {
        title: 'The NGO & Program Challenge',
        subtitle: 'Programs often struggle to:',
        points: [
          'track progress consistently across cooperatives',
          'compare efforts fairly without oversimplification',
          'report transparently without inflating outcomes',
        ],
        solution: 'AgroSoluce™ was built to support learning, monitoring, and improvement — not marketing narratives.',
      },
      how: {
        title: 'How AgroSoluce™ Supports Programs',
      },
      features: {
        baselines: {
          title: '1. Structured Cooperative Baselines',
          description: 'AgroSoluce™ establishes a common baseline across cooperatives: identity and sourcing context, documentation coverage, and farmer engagement visibility.',
          point1: 'Create a shared language between partners',
          point2: 'Enable fair comparison across cooperatives',
          point3: 'Establish evidence-aware starting points',
        },
        monitoring: {
          title: '2. Farmer-First Monitoring',
          description: 'AgroSoluce™ tracks farmer onboarding activities, training events, declarations and participation, and baseline vs progress indicators.',
          point1: 'Farmer engagement becomes observable, not anecdotal',
          point2: 'Track farmer-level activities at cooperative scale',
          point3: 'Monitor training participation and engagement over time',
          point4: 'Support evidence-based program evaluation',
        },
        progress: {
          title: '3. Progress Tracking Without Pressure',
          description: 'Programs can record readiness snapshots over time, observe improvement trajectories, and identify where additional support is needed.',
          point1: 'No forced scores. No all-or-nothing labels.',
          point2: 'Track gradual improvements honestly',
          point3: 'Identify where additional support is needed',
        },
        views: {
          title: '4. Pilot & Portfolio Views',
          description: 'AgroSoluce™ enables grouping cooperatives into pilots or programs, viewing aggregate indicators, and drilling down to cooperative-level reality when needed.',
          point1: 'Support evidence-aware reporting, not inflated claims',
          point2: 'View aggregate progress across programs',
          point3: 'Drill down to cooperative-level detail when needed',
        },
      },
      whatIs: {
        title: 'What AgroSoluce™ Is (and Is Not)',
        is: {
          title: 'AgroSoluce™ is:',
          points: [
            'a transparency and monitoring platform',
            'a due-diligence support tool',
            'a farmer-first program visibility layer',
          ],
        },
        isNot: {
          title: 'AgroSoluce™ is not:',
          points: [
            'a certification scheme',
            'an audit engine',
            'an outcome guarantor',
          ],
        },
      },
      why: {
        title: 'Why NGOs & Partners Use AgroSoluce™',
        points: [
          'Strengthen program credibility',
          'Align cooperatives around realistic improvement paths',
          'Share structured insights with buyers and funders',
          'Reduce reporting friction without losing nuance',
        ],
      },
      cta: {
        pilot: 'Start a Program Pilot',
        explore: 'Explore Cooperatives',
      },
      disclaimer: 'AgroSoluce™ supports monitoring and due diligence efforts. It does not certify outcomes or replace independent verification.',
    },
    cooperativeSpace: {
      hero: {
        title: 'Cooperative Space',
        subtitle: 'Your dedicated workspace to manage compliance, documentation, and farmer engagement',
        description: 'Access your cooperative dashboard to track progress, manage evidence, and make your compliance journey visible to buyers.',
      },
      features: {
        evidence: {
          title: 'Evidence Management',
          description: 'Upload and organize compliance documentation, including land rights, farmer registrations, and certificates.',
        },
        coverage: {
          title: 'Coverage Tracking',
          description: 'Monitor your documentation coverage metrics and see how complete your evidence collection is.',
        },
        compliance: {
          title: 'Compliance Readiness',
          description: 'View readiness scores and maturity levels for EUDR, CMMC, and other regulatory frameworks.',
        },
        farmersFirst: {
          title: 'Farmers First',
          description: 'Track and manage farmer registrations, training programs, and engagement initiatives.',
        },
        enablement: {
          title: 'Enablement Resources',
          description: 'Access toolkits, templates, and guidance documents to improve your documentation practices.',
        },
        producers: {
          title: 'Producer Management',
          description: 'Manage your producers, track their documentation, and monitor compliance at scale.',
        },
      },
      benefits: {
        title: 'What You\'ll Have Access To',
        documentation: {
          title: 'Documentation Management',
          description: 'Upload, organize, and manage proof documents for compliance and due diligence.',
        },
        gapAnalysis: {
          title: 'Gap Analysis',
          description: 'Identify missing documentation with specific guidance on what\'s needed.',
        },
        enablement: {
          title: 'Enablement Resources',
          description: 'Access toolkits, templates, and guidance documents to improve your practices.',
        },
        transparency: {
          title: 'Transparency and Visibility',
          description: 'Make your progress visible to buyers and partners while maintaining transparency.',
        },
        traceability: {
          title: 'Traceability Tracking',
          description: 'Track batches, products, and supply chain information for complete traceability.',
        },
        compliance: {
          title: 'Compliance Dashboard',
          description: 'Monitor your compliance status and readiness across multiple regulatory frameworks.',
        },
      },
      cta: {
        title: 'Ready to Access Your Cooperative Space?',
        subtitle: 'Sign in or register your cooperative to unlock the full power of AgroSoluce™ workspace tools.',
        findCooperative: 'Find Your Cooperative',
        learnMore: 'Learn More',
        freeNote: 'Free for cooperatives • Transparent • Progress-focused',
      },
      info: {
        title: 'About the Cooperative Space',
        description1: 'The Cooperative Space is designed to help cooperatives make their documentation and compliance efforts visible and transparent. By uploading evidence and tracking coverage, you enable buyers and partners to understand your current state and progress.',
        description2: 'This platform does not replace audits or certifications. Instead, it provides a transparent view of what exists, what is missing, and where to focus improvement efforts. We start from the farmer, structure reality at the cooperative level, and support credible EUDR-aligned due diligence.',
      },
      links: {
        lookingFor: 'Looking for something else?',
        browseDirectory: 'Browse Cooperative Directory',
        buyerPortal: 'Buyer Portal',
        about: 'About AgroSoluce',
      },
    },
    workspace: {
      aboutThisWorkspace: 'About This Workspace',
      pilotId: 'Pilot ID',
      pilotLabel: 'Pilot Label',
      pilotLabelOptional: 'Pilot Label (Optional)',
      enterPilotId: 'Enter pilot ID (e.g., pilot-001)',
      enterPilotLabel: 'Enter pilot label (e.g., Pilot A)',
      languageNotes: 'Language Notes',
      backToDirectory: 'Back to Directory',
      exploreDirectory: 'Explore Directory',
      cooperativeIdRequired: 'Cooperative ID is required',
      loadingWorkspace: 'Loading workspace...',
      cooperativeWorkspace: 'Cooperative Workspace',
      manageComplianceJourney: 'Manage Your Cooperative\'s Compliance Journey',
      documentationEvidenceEnablement: 'Documentation, Evidence, and Enablement Management',
      workspaceDescription: 'This workspace provides cooperatives with tools to manage documentation coverage, track compliance readiness, upload evidence, identify gaps, and access enablement resources. Make your progress visible to buyers and partners while maintaining transparency about your current state.',
      publicAccess: 'Public Access',
      evidenceManagement: 'Evidence Management',
      evidenceManagementDesc: 'Upload and organize compliance documentation',
      coverageTracking: 'Coverage Tracking',
      coverageTrackingDesc: 'Monitor documentation coverage metrics',
      gapAnalysis: 'Gap Analysis',
      gapAnalysisDesc: 'Identify missing documentation and guidance',
      enablement: 'Enablement',
      enablementDesc: 'Access tools and resources for improvement',
      whatWorkspaceProvides: 'What This Workspace Provides',
      documentationManagement: 'Documentation Management',
      documentationManagementDesc: 'Upload, organize, and manage evidence documents including land rights, farmer registrations, traceability records, and compliance certificates.',
      coverageMetrics: 'Coverage Metrics',
      coverageMetricsDesc: 'Track your documentation coverage across different categories and see how complete your evidence collection is.',
      complianceReadiness: 'Compliance Readiness',
      complianceReadinessDesc: 'View readiness scores and maturity levels for EUDR, CMMC, and other regulatory frameworks based on your documentation.',
      gapIdentification: 'Gap Identification',
      gapIdentificationDesc: 'Identify missing documentation with specific guidance on what\'s needed and how to obtain it.',
      enablementResources: 'Enablement Resources',
      enablementResourcesDesc: 'Access toolkits, templates, and guidance materials to help improve your documentation and compliance practices.',
      farmerEngagement: 'Farmer Engagement',
      farmerEngagementDesc: 'Track and manage farmer registrations, training programs, and engagement initiatives through the Farmers First dashboard.',
      workspaceNote: 'This workspace is designed to help cooperatives make their documentation and compliance efforts visible and transparent. By uploading evidence and tracking coverage, you enable buyers and partners to understand your current state and progress.',
      workspaceNoteDetail: 'This platform does not replace audits or certifications.',
      workspaceNoteDetail2: 'Instead, it provides a transparent view of what exists, what\'s missing, and where to focus improvement efforts. We start from the farmer, structure reality at the cooperative level, and support credible EUDR-aligned due diligence.',
      tabs: {
        overview: 'Overview',
        evidence: 'Evidence',
        coverage: 'Coverage',
        gaps: 'Gaps & Guidance',
        enablement: 'Enablement',
        farmersFirst: 'Farmers First',
        assessment: 'Assessment',
      },
      overview: {
        pilot: 'Pilot:',
        none: 'none',
        farmersFirstSnapshot: 'Farmers First Snapshot',
        farmersFirstSnapshotDesc: 'Overview of farmers onboarding, declarations, training, and impact tracking',
        viewFullDashboard: 'View Full Dashboard →',
        onboarding: 'Onboarding',
        declarations: 'Declarations',
        training: 'Training',
        impactData: 'Impact Data',
        baselineSet: 'Baseline set',
        noBaseline: 'No baseline',
        noFarmersFirstData: 'No Farmers First data available',
        selfAssessment: 'Self-Assessment',
        selfAssessmentDesc: 'Latest self-assessment results (not a certification or compliance determination)',
        viewAssessment: 'View Assessment →',
        startAssessment: 'Start Assessment →',
        loadingAssessment: 'Loading assessment...',
        noAssessmentCompleted: 'No assessment completed yet',
        score: 'Score',
        completed: 'Completed',
        selfAssessmentNote: 'Self-assessment (not certified)',
        dueDiligenceSummary: 'Due-Diligence Summary',
        dueDiligenceSummaryDesc: 'Export a comprehensive summary of cooperative information',
        exportSummary: 'Export Summary',
        exporting: 'Exporting...',
        readinessStatus: 'Readiness Status',
        createSnapshot: 'Create Snapshot',
        creating: 'Creating...',
        noReadinessSnapshot: 'No readiness snapshot available',
        createFirstSnapshot: 'Create First Snapshot',
        snapshotHistory: 'Snapshot History',
        currentStatus: 'Current Status',
        lastUpdated: 'Last Updated',
        snapshotReason: 'Snapshot Reason',
        readinessNote: 'This is an internal readiness shorthand based on documentation coverage. It is not a compliance determination.',
        countryContext: 'Country Context',
        landTenureOverview: 'Land Tenure Overview',
        commonlyAcceptedDocuments: 'Commonly Accepted Documents',
        knownLimitations: 'Known Limitations',
        publicSources: 'Public Sources',
        informationalContentOnly: 'Informational Content Only',
        countryContextNote: 'This country context information is provided for reference purposes only. It describes common practices and limitations but does not evaluate compliance or make determinations about specific cooperatives or farmers.',
        commodityContext: 'Commodity Context (Informational)',
        typicalSupplyChain: 'Typical Supply Chain',
        commonDocumentPatterns: 'Common Document Patterns',
        buyerExpectationsSummary: 'Buyer Expectations Summary',
        knownChallenges: 'Known Challenges',
        referenceLinks: 'Reference Links',
        commodityContextNote: 'This commodity context information is provided for reference purposes only. It describes common patterns and expectations but does not evaluate adequacy, sufficiency, or compliance of any specific cooperative\'s documentation.',
        regulatoryContext: 'Regulatory Context (Informational)',
        regulatoryContextNote: 'This section provides regulatory context only. Determination of compliance and due care remains the responsibility of the buyer.',
        loadingOverview: 'Loading overview...',
        errorLoadingOverview: 'Error loading overview:',
        retry: 'Retry',
      },
      evidence: {
        evidenceDocuments: 'Evidence Documents',
        uploadDocument: 'Upload Document',
        uploadNewDocument: 'Upload New Document',
        documentType: 'Document Type',
        title: 'Title',
        issuer: 'Issuer',
        issueDate: 'Issue Date',
        expirationDate: 'Expiration Date (Optional)',
        file: 'File',
        selectType: 'Select type',
        documentTitle: 'Document title',
        issuingOrganization: 'Issuing organization',
        uploading: 'Uploading...',
        closeUploadForm: 'Close upload form',
        loadingDocuments: 'Loading documents...',
        noDocumentsUploaded: 'No documents uploaded',
        uploadFirstEvidence: 'Upload your first evidence document to get started',
        evidenceType: 'Evidence Type',
        dates: 'Dates',
        status: 'Status',
        unverified: 'Unverified',
        issued: 'Issued:',
        expires: 'Expires:',
        uploaded: 'Uploaded:',
        areYouSureDelete: 'Are you sure you want to delete this document?',
        errorDeleting: 'Error deleting document:',
      },
      coverage: {
        documentCoverage: 'Document Coverage',
        coverageSummary: 'Coverage Summary',
        requiredDocumentsTotal: 'Required Documents Total',
        requiredDocumentsPresent: 'Required Documents Present',
        coveragePercentage: 'Coverage Percentage',
        lastUpdated: 'Last updated:',
        requiredDocumentTypes: 'Required Document Types',
        noRequiredDocumentTypes: 'No required document types configured',
        present: 'Present',
        missing: 'Missing',
        loadingCoverage: 'Loading coverage metrics...',
        errorLoadingCoverage: 'Error loading coverage data:',
        refresh: 'Refresh',
      },
      gaps: {
        loadingGapAnalysis: 'Loading gap analysis...',
        errorLoadingGap: 'Error loading gap data:',
        currentDocumentationGaps: 'Current Documentation Gaps',
        whyCommonlyRequested: 'Why This Is Commonly Requested',
        typicalNextSteps: 'Typical Next Steps',
        noDocumentationGaps: 'No Documentation Gaps',
        allExpectedDocumentTypes: 'All expected document types have evidence documents present.',
        informationalDueDiligence: 'Informational due-diligence support',
        finalDecisionsRemain: 'This information is provided for reference only. Final decisions remain with the buyer.',
      },
      enablementTab: {
        loadingEnablement: 'Loading enablement information...',
        whatBuyersUsuallyRequest: 'What Buyers Usually Request',
        currentPilotExpectations: 'Current Pilot Expectations',
        expectedDocumentTypes: 'Expected document types for pilot:',
        noSpecificDocumentRequirements: 'No specific document requirements configured for this pilot.',
        noActivePilotScope: 'No active pilot scope.',
        howInformationUsed: 'How This Information Is Used',
        farmerDeclarationsSummary: 'Farmer Declarations Summary',
        loadingDocumentStatus: 'Loading document status...',
        documentationProvided: 'Documentation provided by cooperative',
        farmerGuidance: 'Farmer Guidance (for Field Use)',
        farmerGuidanceDesc: 'Plain language explanations to help you discuss documentation requirements with farmers. These explanations are designed to be supportive and clear, helping farmers understand what is needed and what is acceptable.',
        importantNote: 'Important Note',
        contentIntended: 'This content is intended to support discussions with farmers.',
        doesNotReplaceLegal: 'It does not replace legal advice.',
        explanation: 'Explanation',
        whatIsUsuallyAcceptable: 'What is Usually Acceptable',
        commonMisunderstandings: 'Common Misunderstandings',
        fieldOfficerToolkit: 'Field Officer Toolkit',
        fieldOfficerToolkitDesc: 'Access practical guidance and checklists for field officers and cooperative administrators. This toolkit includes information about why documentation is requested, acceptable document examples, declaration explanations, and field checklists to help with documentation collection.',
        guidanceNotRules: 'Guidance, not rules',
        toolkitProvides: 'This toolkit provides informational guidance only. It does not establish requirements or make determinations.',
        downloadFieldToolkit: 'Download Field Toolkit (PDF/JSON)',
        preparingDownload: 'Preparing download...',
        farmerProtectionPrinciples: 'Farmer Protection Principles',
        learnAboutAgroSoluce: 'Learn about AgroSoluce™\'s approach to protecting farmer privacy, reducing audit burden, and ensuring responsible data use.',
        viewFarmerProtectionPrinciples: 'View Farmer Protection Principles',
        exportEnablementData: 'Export Enablement Data',
        exportingEnablement: 'Exporting...',
      },
    },
    pilot: {
      backToDirectory: 'Back to Directory',
      exploreDirectory: 'Explore Directory',
      pilotIdRequired: 'Pilot ID is required',
      emptyDashboard: 'This pilot dashboard is currently empty.',
      emptyDashboardDescription: 'This could mean the pilot is new, cooperatives haven\'t been assigned yet, or the pilot ID is incorrect.',
      verifyPilotId: 'If you believe this pilot should contain data, please verify the pilot ID or contact support.',
    },
    directory: {
      languageNotes: 'Language Notes',
      aboutThisReference: 'About This Reference',
      aboutThisRegistry: 'About This Registry',
    },
    cooperativeWorkspaceLanding: {
      hero: {
        title: 'Welcome to the Cooperative Space',
        subtitle: 'Your cooperative workspace is ready, but we need to register your cooperative first.',
        description: 'Register your cooperative to access documentation management, compliance tracking, and farmer engagement tools.',
      },
      features: {
        evidence: {
          title: 'Evidence Management',
          description: 'Upload and organize compliance documentation, including land rights, farmer registrations, and certificates.',
        },
        coverage: {
          title: 'Coverage Tracking',
          description: 'Monitor your documentation coverage metrics and see how complete your evidence collection is.',
        },
        compliance: {
          title: 'Compliance Readiness',
          description: 'View readiness scores and maturity levels for EUDR, CMMC, and other regulatory frameworks.',
        },
        farmersFirst: {
          title: 'Farmers First',
          description: 'Track and manage farmer registrations, training programs, and engagement initiatives.',
        },
      },
      benefits: {
        title: 'What You\'ll Have Access To',
        documentation: {
          title: 'Documentation Management',
          description: 'Upload, organize, and manage proof documents for compliance and due diligence.',
        },
        gapAnalysis: {
          title: 'Gap Analysis',
          description: 'Identify missing documentation with specific guidance on what\'s needed.',
        },
        enablement: {
          title: 'Enablement Resources',
          description: 'Access toolkits, templates, and guidance documents to improve your practices.',
        },
        transparency: {
          title: 'Transparency and Visibility',
          description: 'Make your progress visible to buyers and partners while maintaining transparency.',
        },
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Register your cooperative to unlock the full power of AgroSoluce™ workspace tools.',
        register: 'Register Your Cooperative',
        learnMore: 'Learn More',
        freeNote: 'Free for cooperatives • Transparent • Progress-focused',
      },
      additional: {
        alreadyRegistered: 'Already registered? Make sure you\'re using the correct cooperative ID.',
        errorMessage: 'If you think this is an error, please contact support or check the',
        checkDirectory: 'Cooperative Directory',
      },
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      map: 'Carte',
      cooperatives: 'Coopératives',
      directory: 'Répertoire',
      buyers: 'Acheteurs',
      cooperativeSpace: 'Espace Coopérative',
      compliance: 'Suivi',
      partners: 'Partenaires & ONG',
      about: 'À Propos',
      more: 'Plus',
      healthImpact: 'Santé & Impact',
      healthIntelligence: 'Intelligence Santé',
      analytics: 'Analytiques',
      complianceTools: 'Outils de Conformité',
      pilotPrograms: 'Programmes Pilotes',
      main: 'Principal',
      theme: 'Thème',
      language: 'Langue',
      dataAndDirectory: 'Données & Répertoire',
      healthAndAnalytics: 'Santé & Analytiques',
      partnersAndPrograms: 'Partenaires & Programmes',
      aggregatedDashboard: 'Tableau de bord agrégé',
      hwi: 'Indice de Bien-être des Ménages',
      changeLanguage: 'Changer de langue',
      english: '🇬🇧 English',
      french: '🇫🇷 Français',
      enShort: '🇬🇧 EN',
      frShort: '🇫🇷 FR',
      closeMenu: 'Fermer le menu',
      openMenu: 'Ouvrir le menu',
      themeDark: 'Sombre',
      themeLight: 'Clair',
      frameworkDemo: 'Démo Cadre',
    },
    notFound: {
      title: 'Page introuvable',
      description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
      goHome: 'Retour à l\'accueil',
      browseDirectory: 'Parcourir le répertoire',
    },
    monitoring: {
      breadcrumb: 'Suivi',
      badge: 'Conformité & Suivi',
      title: 'Suivi du travail des enfants et conformité',
      subtitle: 'Suivre la documentation, les auto-évaluations et les efforts d\'amélioration des coopératives agricoles',
      intro: 'AgroSoluce™ favorise l\'apprentissage, le suivi et l\'amélioration — pas les récits marketing. Notre plateforme aide les coopératives, acheteurs et partenaires à suivre les efforts de prévention du travail des enfants, la couverture documentaire et la préparation à la conformité.',
      platformNote: 'AgroSoluce™ favorise l\'apprentissage, le suivi et l\'amélioration.',
      viewDashboard: 'Voir le tableau de bord',
      newAssessment: 'Nouvelle évaluation',
      documentationTracking: 'Suivi de la documentation',
      documentationTrackingDesc: 'Suivre les taux de couverture documentaire, les scores d\'auto-évaluation et identifier les lacunes de conformité.',
      farmerEngagement: 'Engagement des agriculteurs',
      farmerEngagementDesc: 'Suivre les activités au niveau des agriculteurs à l\'échelle des coopératives : formation, déclarations, indicateurs de base.',
      progressMonitoring: 'Suivi des progrès',
      progressMonitoringDesc: 'Suivre l\'évolution des scores de préparation, des tendances des violations et des plans d\'amélioration.',
      riskAssessment: 'Évaluation des risques',
      riskAssessmentDesc: 'Identifier et prioriser les risques de travail des enfants au niveau coopérative et communautaire.',
      certificationTracking: 'Suivi des certifications',
      certificationTrackingDesc: 'Suivre le statut des certifications et l\'alignement avec les exigences de diligence raisonnable.',
      regionalAnalysis: 'Analyse régionale',
      regionalAnalysisDesc: 'Comparer la préparation et la conformité entre régions et filières.',
      whatYouCanMonitor: 'Ce que vous pouvez suivre',
      documentationCoverageRate: 'Taux de couverture documentaire',
      averageReadinessScore: 'Score de préparation moyen',
    },
    healthImpactOverview: {
      breadcrumb: 'Santé & Impact',
      badge: 'Analyse Impact Santé–Agriculture',
      heroTitle: 'Santé et productivité agricole',
      heroSubtitle: 'La surveillance pharmaceutique (VRAC) dans les régions cacaoyères fournit un indicateur de santé de la main-d\'œuvre ; un décalage de 3 à 4 semaines sur l\'impact des récoltes est documenté. À utiliser avec les données satellite et de production.',
      conceptTitle: 'Comprendre la corrélation santé–agriculture',
      conceptP1: 'La productivité agricole dans les régions cacaoyères est fondamentalement liée à la santé de la main-d\'œuvre. Lorsque le paludisme affecte les agriculteurs et leurs familles, l\'efficacité des récoltes chute.',
      conceptP2: 'Le suivi satellite couvre la couverture forestière et l\'usage des sols ; les facteurs de santé affectant la capacité de production sont observés via des données complémentaires comme la surveillance pharmaceutique.',
      keyInsight: 'Point clé',
      keyInsightText: 'Le paludisme réduit l\'efficacité des récoltes de 40 à 60 % pendant les épisodes aigus. Les données VRAC détectent ces pics des semaines avant l\'impact sur la production.',
      dataSourceTitle: 'Source des données',
      vracBullet1: 'VRAC (Veille Régionale Anti-Contrefaçon) — Réseau de surveillance pharmaceutique',
      vracBullet2: 'Suivi des ventes d\'antipaludéens dans les régions cacaoyères',
      vracBullet3: 'Indicateur en temps réel du fardeau sanitaire',
      vracBullet4: 'Complète les données satellite et météo',
      caseStudyTitle: 'Étude de cas : Pic paludisme Gontougo',
      antimalarialSurge: 'Pic antipaludéens',
      productionDecline: 'Baisse de production',
      cocoaHarvest: 'Récolte cacao',
      weekLag: 'Décalage (semaines)',
      healthToProduction: 'Santé → Production',
      caseStudyBody: 'La région de Gontougo a connu un pic de paludisme entre août et décembre 2024, avec des ventes d\'antipaludéens multipliées par 10. Trois à quatre semaines plus tard, la production de cacao a baissé de 24 % — démontrant l\'impact direct de la santé sur la production agricole.',
      viewRegionalMap: 'Voir la carte régionale',
      healthIntelligenceDashboard: 'Tableau de bord Intelligence Santé',
      platformFeatures: 'Fonctionnalités de la plateforme',
      businessValue: 'Valeur pour l\'entreprise',
      forCommodityTraders: 'Pour les négociants',
      forCommodityTradersDesc: 'Signaux d\'alerte pour les perturbations d\'approvisionnement et la planification logistique.',
      forProcessors: 'Pour les transformateurs',
      forProcessorsDesc: 'Visibilité de l\'impact production pour aligner approvisionnement et capacité sur les tendances sanitaires.',
      keyFeatures: {
        regionalMap: { title: 'Carte régionale', description: 'Cooperatives et santé par région : carte avec couches santé et heatmap', linkText: 'Explorer la carte' },
        regionalHealth: { title: 'Indice santé régional', description: 'Suivi de la part antipaludéens par pharmacie et période', linkText: 'Voir l\'intelligence santé' },
        cooperativeWorkspaces: { title: 'Espaces coopératives', description: 'Données santé intégrées aux indicateurs de production', linkText: 'Parcourir les coopératives' },
        timeLag: { title: 'Analyse décalage', description: 'Corrélation entre pics de paludisme et baisse d\'efficacité des récoltes', linkText: 'Voir l\'analyse' },
        academicResearch: { title: 'Recherche académique', description: 'Validé par des études sur les producteurs de cacao en Côte d\'Ivoire et au Nigeria', linkText: 'Voir la recherche' },
      },
      partnerships: [
        { name: 'Marcus Weather', description: 'Météo et santé de la main-d\'œuvre' },
        { name: 'Satelligence', description: 'Satellite et suivi sanitaire' },
        { name: 'EarthDaily Agro', description: 'Modèles de rendement et productivité du travail' },
      ],
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      search: 'Rechercher',
      filter: 'Filtrer',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre',
      reset: 'Réinitialiser',
      download: 'Télécharger',
      upload: 'Téléverser',
      export: 'Exporter',
      import: 'Importer',
      view: 'Voir',
    },
    footer: {
      contact: 'Contact',
      principles: 'Principes',
      copyright: 'Tous droits réservés',
      navigation: 'Navigation',
      about: 'À Propos',
      resources: 'Ressources',
      aboutUs: 'À Propos de Nous',
      whatWeDo: 'Ce Que Nous Faisons',
      whoItsFor: 'Pour Qui',
      partners: 'Partenaires',
      directory: 'Répertoire',
      regulatoryReferences: 'Références Réglementaires',
      ngoRegistry: 'Registre des ONG',
      dueCarePrinciples: 'Principes de Diligence Raisonnable',
      tagline: 'Diligence raisonnable axée sur l\'agriculteur pour un approvisionnement sans déforestation et responsable',
      description: 'Rendre visible l\'engagement des agriculteurs, la documentation et les progrès tout au long de la chaîne d\'approvisionnement',
      logoAlt: 'Logo AgroSoluce',
      sourceIntelligence: 'Intelligence des Sources',
      byErmits: 'par ERMITS',
    },
    compliance: {
      dashboard: 'Tableau de bord de suivi du travail des enfants',
      assessments: 'Évaluations',
      newAssessment: 'Nouvelle évaluation',
      complianceScore: 'Score de préparation',
      violations: 'Violations',
      certifications: 'Certifications',
      schoolEnrollment: 'Scolarisation',
    },
    cooperative: {
      verified: 'Vérifié',
      pending: 'En attente',
      region: 'Région',
      department: 'Département',
      sector: 'Secteur',
      contact: 'Contact',
      loading: 'Chargement...',
      notEvaluated: 'Non évalué',
    },
    landing: {
      hero: {
        tagline: 'Autonomiser l\'Agriculture Durable en Afrique de l\'Ouest',
        title: 'AgroSoluce™',
        subtitle: 'Naviguer la Conformité Réglementaire, la Protection Environnementale et la Responsabilité Sociale',
        description: 'Une plateforme axée sur la mission qui aide les coopératives ouest-africaines à répondre aux exigences de l\'EUDR, à lutter contre la déforestation, à éliminer le travail des enfants et à accéder aux marchés mondiaux tout en protégeant les moyens de subsistance des agriculteurs et en préservant notre planète.',
        ctaCooperatives: 'Explorer les Coopératives',
        ctaBuyer: 'Espace Acheteur',
        freeNote: 'Gratuit pour les coopératives • Sécurisé • Conforme aux réglementations',
      },
      stats: {
        productCategories: 'Catégories de Produits',
        regions: 'Régions en Côte d\'Ivoire',
        regionsNote: 'Comptage précis',
        complianceFrameworks: 'Cadres de Conformité',
      },
      challenges: {
        tagline: 'Les Défis que Nous Relevons',
        title: 'Face aux Pressions Critiques',
        subtitle: 'Les coopératives agricoles ouest-africaines naviguent dans un paysage de plus en plus complexe d\'exigences réglementaires, de menaces environnementales et de responsabilités sociales.',
        regulatory: {
          title: 'Pression Réglementaire',
          description: 'De nouvelles réglementations transforment les chaînes d\'approvisionnement mondiales, exigeant des niveaux sans précédent de documentation et de diligence raisonnable.',
          point1: 'L\'EUDR exige des chaînes d\'approvisionnement sans déforestation avec traçabilité complète d\'ici 2025',
          point2: 'Les exigences de diligence raisonnable sur le travail des enfants menacent l\'accès au marché pour les coopératives non conformes',
          point3: 'Les acheteurs exigent une documentation de conformité complète ou risquent l\'exclusion des marchés européens',
        },
        environmental: {
          title: 'Défis Environnementaux',
          description: 'Le changement climatique et la déforestation menacent à la fois la productivité agricole et l\'accès au marché.',
          point1: 'La déforestation liée à l\'agriculture risque l\'exclusion du marché européen sous les réglementations EUDR',
          point2: 'Le changement climatique affecte les rendements des cultures et les moyens de subsistance des agriculteurs en Afrique de l\'Ouest',
          point3: 'Le chevauchement des zones protégées et la perte de biodiversité créent des risques de conformité et de réputation',
        },
        social: {
          title: 'Défis Sociaux',
          description: 'Assurer des chaînes d\'approvisionnement éthiques tout en maintenant les moyens de subsistance des agriculteurs nécessite un équilibre délicat.',
          point1: 'Le travail des enfants reste une préoccupation critique, avec des politiques de tolérance zéro des principaux acheteurs',
          point2: 'Les petits exploitants agricoles luttent contre la pauvreté, limitant leur capacité à investir dans la conformité',
          point3: 'L\'accès limité à la technologie et à la formation crée des obstacles pour répondre aux nouvelles exigences',
        },
      },
      value: {
        tagline: 'Valeur que Nous Apportons',
        title: 'Transformer les Défis en Opportunités',
        subtitle: 'Notre plateforme apporte une valeur mesurable en aidant les coopératives à naviguer la conformité, protéger l\'environnement et améliorer les résultats sociaux tout en accédant aux marchés mondiaux.',
      },
      outcomes: {
        title: 'Valeur Mesurable Apportée',
        subtitle: 'Comment nous aidons les coopératives à surmonter les défis et atteindre leurs objectifs',
        buyerConnections: {
          title: 'Accès au Marché & Connexions Acheteurs',
          feature: 'Surmontez l\'exclusion du marché en vous connectant avec des acheteurs qui valorisent la conformité et la durabilité',
          outcome1: 'Accédez à des acheteurs premium exigeant des chaînes d\'approvisionnement alignées EUDR et sans travail des enfants',
          outcome2: 'Démontrez votre préparation à la conformité grâce à une documentation vérifiée et des évaluations',
          outcome3: 'Élargissez votre portée au-delà des acheteurs traditionnels vers des partenaires mondiaux axés sur la durabilité',
          cta: 'Accéder au matching',
        },
        readiness: {
          title: 'Préparation à la Conformité EUDR',
          feature: 'Transformez-vous de non conforme à prêt pour les acheteurs, répondant systématiquement aux exigences EUDR',
          outcome1: 'Progressez du statut not_ready à buyer_ready avec des jalons clairs et actionnables',
          outcome2: 'Construisez un historique de preuves démontrant une amélioration continue de la conformité',
          outcome3: 'Identifiez et priorisez les gaps de conformité avant qu\'ils ne bloquent l\'accès au marché',
        },
        coverage: {
          title: 'Atténuation des Risques de Déforestation',
          feature: 'Protégez l\'accès au marché en prouvant des chaînes d\'approvisionnement sans déforestation avec une couverture complète',
          outcome1: 'Documentez la couverture des agriculteurs et parcelles pour démontrer la transparence de la chaîne',
          outcome2: 'Utilisez la géolocalisation GPS pour prouver que les parcelles sont en dehors des zones à risque de déforestation',
          outcome3: 'Construisez un portefeuille de preuves montrant la conformité aux zones protégées et la gestion environnementale',
        },
        assessment: {
          title: 'Identification des Gaps de Conformité',
          feature: 'Comprenez exactement où vous en êtes et ce qui doit être amélioré pour répondre aux exigences réglementaires',
          outcome1: 'Obtenez une évaluation complète du statut de conformité dans tous les cadres réglementaires',
          outcome2: 'Recevez un plan d\'action priorisé basé sur le risque et l\'impact sur l\'accès au marché',
          outcome3: 'Suivez l\'amélioration dans le temps avec des indicateurs de progrès mesurables',
          cta: 'Commencer l\'évaluation',
        },
        evidence: {
          title: 'Documentation Réglementaire',
          feature: 'Construisez le portefeuille de preuves que les acheteurs et régulateurs exigent pour l\'accès au marché',
          outcome1: 'Organisez tous les documents de conformité (EUDR, travail des enfants, certifications) en un seul endroit',
          outcome2: 'Assurez-vous que la documentation répond aux exigences des acheteurs avec des métadonnées et vérifications appropriées',
          outcome3: 'Réduisez le risque d\'exclusion du marché en maintenant des dossiers de conformité complets et accessibles',
        },
        compliance: {
          title: 'Élimination du Travail des Enfants',
          feature: 'Démontrez une tolérance zéro pour le travail des enfants tout en soutenant les moyens de subsistance des agriculteurs',
          outcome1: 'Menez des évaluations systématiques pour identifier et traiter les risques de travail des enfants',
          outcome2: 'Suivez les actions de remédiation qui protègent les enfants tout en maintenant le revenu des agriculteurs',
          outcome3: 'Renforcez la confiance des acheteurs grâce à un suivi transparent et une gestion des certifications',
          cta: 'Voir le tableau de bord',
        },
        farmersFirst: {
          title: 'Protection des Moyens de Subsistance des Agriculteurs',
          feature: 'Assurez-vous que les améliorations de conformité soutiennent plutôt que nuisent aux communautés de petits exploitants',
          outcome1: 'Enregistrez les agriculteurs systématiquement pour leur fournir formation et soutien',
          outcome2: 'Suivez l\'engagement des agriculteurs pour garantir que les mesures de conformité n\'excluent pas les communautés vulnérables',
          outcome3: 'Mesurez l\'impact social pour démontrer que conformité et bien-être des agriculteurs vont de pair',
        },
        traceability: {
          title: 'Transparence de la Chaîne d\'Approvisionnement',
          feature: 'Répondez aux exigences de traçabilité EUDR en suivant les produits de la parcelle au marché',
          outcome1: 'Documentez la chaîne d\'approvisionnement complète des parcelles individuelles à la vente finale',
          outcome2: 'Fournissez aux acheteurs une cartographie d\'origine prouvant un approvisionnement sans déforestation',
          outcome3: 'Créez une piste d\'audit qui satisfait les exigences de diligence raisonnable réglementaire',
        },
        gaps: {
          title: 'Guidance d\'Amélioration Ciblée',
          feature: 'Obtenez des conseils spécifiques et actionnables pour combler efficacement les gaps de conformité',
          outcome1: 'Identifiez automatiquement la documentation manquante avant qu\'elle ne bloque l\'accès au marché',
          outcome2: 'Recevez des conseils étape par étape adaptés à vos gaps de conformité spécifiques',
          outcome3: 'Accédez à des ressources et outils qui vous aident à répondre aux exigences sans submerger votre équipe',
        },
      },
      cta: {
        title: 'Rejoignez la Mission',
        subtitle: 'Ensemble, nous pouvons construire des chaînes d\'approvisionnement durables et conformes qui protègent les agriculteurs, les forêts et les générations futures',
        buttonCooperatives: 'Explorer les Coopératives',
        buttonBuyer: 'Espace Acheteur',
      },
      quickLinks: {
        title: 'En Savoir Plus',
        subtitle: 'Découvrez comment AgroSoluce™ soutient l\'approvisionnement responsable pour différents publics',
        forBuyers: {
          title: 'Pour les Acheteurs',
          description: 'Comprenez ce qui existe, ce qui manque et où se concentrer sur la diligence raisonnable',
          learnMore: 'En savoir plus',
        },
        forPartners: {
          title: 'Pour les ONG & Partenaires',
          description: 'Rendez visible le progrès au niveau des agriculteurs sans déformer la réalité',
          learnMore: 'En savoir plus',
        },
        whatWeDo: {
          title: 'Ce Que Nous Faisons',
          description: 'Découvrez comment AgroSoluce™ soutient l\'approvisionnement responsable par la transparence',
          learnMore: 'En savoir plus',
        },
      },
      carousel: {
        item1: 'Nous aidons les coopératives et les acheteurs à voir l\'engagement réel des agriculteurs, la documentation et les progrès.',
        item2: 'Progrès transparent — sans exagérer la préparation ni remplacer les audits.',
        item3: 'De l\'agriculteur à la coopérative et à l\'acheteur : une diligence raisonnable crédible et alignée EUDR sur toute la chaîne.',
      },
      heroSubtitle: {
        line1: 'Rendre Visible l\'Engagement des Agriculteurs, la Couverture de la Documentation,',
        line2: 'et les Efforts d\'Amélioration',
      },
    },
    about: {
      title: 'À Propos d\'AgroSoluce™',
      subtitle: 'Diligence raisonnable axée sur l\'agriculteur pour un approvisionnement sans déforestation et responsable',
      why: {
        title: 'Pourquoi AgroSoluce™ Existe',
        subtitle: 'L\'approvisionnement responsable n\'est plus optionnel — mais la plupart des outils posent encore des questions impossibles qui ne reflètent pas la réalité des chaînes d\'approvisionnement réelles.',
        problem: {
          title: 'Le Problème avec les Outils Traditionnels',
          question1: 'Êtes-vous entièrement conforme?',
          question2: 'Certifiez-vous cette coopérative?',
          question3: 'Pouvez-vous garantir zéro risque?',
          reality: 'Dans les chaînes d\'approvisionnement réelles, ces réponses n\'existent pas.',
        },
        solution: {
          title: 'AgroSoluce™ Reflète la Réalité',
          point1: 'Documentation inégale',
          point2: 'Améliorations graduelles',
          point3: 'Vraies personnes sur le terrain',
          point4: 'Diligence raisonnable continue — pas de déclarations ponctuelles',
        },
      },
      whatNot: {
        title: 'Ce qu\'AgroSoluce™ N\'est Pas',
        subtitle: 'Pour être clair, AgroSoluce™:',
        points: [
          'n\'est pas un organisme de certification',
          'ne déclare pas la conformité EUDR ou du travail',
          'ne remplace pas les audits, visites sur le terrain ou analyses satellitaires',
          'ne garantit pas les résultats',
        ],
        footer: 'Il soutient les décisions — il ne remplace pas la responsabilité.',
      },
      designPrinciples: {
        title: 'Nos Principes de Conception',
        subtitle: 'Les valeurs qui guident la construction d\'AgroSoluce™',
        farmerFirst: {
          title: 'Agriculteurs d\'abord, pas documents d\'abord',
          description: 'Nous commençons par l\'agriculteur et structurons la réalité au niveau de la coopérative, garantissant que l\'engagement des agriculteurs est visible sans exposer de données personnelles sensibles.',
        },
        progress: {
          title: 'Progrès plutôt que perfection',
          description: 'Nous suivons les améliorations graduelles et la préparation dans le temps, reconnaissant que la conformité est un voyage, pas une destination.',
        },
        transparency: {
          title: 'Transparence sans exagération',
          description: 'Nous montrons ce qui existe, ce qui manque et où une vérification supplémentaire peut être requise — sans fausses déclarations de conformité.',
        },
        process: {
          title: 'Diligence raisonnable comme processus, pas comme badge',
          description: 'Nous soutenons les efforts continus de diligence raisonnable, permettant une surveillance continue plutôt que des contrôles de conformité ponctuels.',
        },
      },
      oneSentence: 'AgroSoluce™ rend visible l\'engagement des agriculteurs, la couverture de la documentation et les efforts d\'amélioration — de manière responsable, progressive et sans fausses déclarations de conformité.',
      cta: {
        explore: 'Explorer les Coopératives',
        learnMore: 'Découvrir Ce Que Nous Faisons',
      },
    },
    whatWeDo: {
      title: 'Ce Qu\'AgroSoluce™ Fait',
      subtitle: 'Soutenir l\'Approvisionnement Responsable par la Transparence',
      features: {
        visibility: {
          title: '1. Rendre les Coopératives Visibles',
          description: 'AgroSoluce™ fournit un répertoire structuré de coopératives agricoles, montrant qui elles sont, où elles opèrent, quelles cultures elles produisent et quelles informations sont disponibles aujourd\'hui.',
          point1: 'Pas de déclarations exagérées. Pas de boîtes noires.',
          point2: 'Profils de coopératives stables et partageables',
          point3: 'Visibilité claire de l\'identité et du contexte d\'approvisionnement',
        },
        coverage: {
          title: '2. Montrer la Couverture de Documentation — Pas la Conformité',
          description: 'Au lieu d\'étiquettes binaires, AgroSoluce™ affiche des indicateurs de couverture de documentation: Limité, Partiel, Substantiel.',
          point1: 'Aider les acheteurs à comprendre ce qui existe, ce qui manque et où une vérification supplémentaire peut être requise',
          point2: 'Éviter les fausses déclarations de conformité tout en montrant de vrais progrès',
          point3: 'Soutenir des décisions de diligence raisonnable éclairées basées sur la documentation réelle',
        },
        dueDiligence: {
          title: '3. Soutenir la Diligence Raisonnable EUDR & Travail des Enfants',
          description: 'AgroSoluce™ soutient la diligence raisonnable en structurant l\'identité de la coopérative et le contexte d\'approvisionnement, en mettant en évidence les lacunes de documentation, en révélant les signaux d\'engagement des agriculteurs et en suivant les efforts d\'amélioration dans le temps.',
          point1: 'Fournir la base opérationnelle requise pour effectuer la diligence raisonnable de manière responsable',
          point2: 'AgroSoluce™ ne certifie pas la conformité — il soutient le processus',
          point3: 'Permettre une diligence raisonnable continue, pas des déclarations ponctuelles',
          cta: 'Voir le Tableau de Bord',
        },
        farmersFirst: {
          title: '4. Mettre les Agriculteurs en Premier',
          description: 'AgroSoluce™ connecte les actions au niveau des agriculteurs aux informations au niveau de la coopérative grâce à un toolkit Farmers First, soutenant l\'intégration des agriculteurs, le suivi de la participation à la formation, les déclarations et attestations, et les indicateurs de base et de progrès.',
          point1: 'Rendre l\'engagement des agriculteurs visible — sans exposer de données personnelles sensibles',
          point2: 'Suivre les activités au niveau des agriculteurs à l\'échelle de la coopérative',
          point3: 'Soutenir l\'évaluation des risques basée sur le comportement, pas seulement sur les documents',
        },
        progress: {
          title: '5. Suivre le Progrès, Pas Seulement les Promesses',
          description: 'AgroSoluce™ enregistre des instantanés de préparation et des auto-évaluations dans le temps, permettant un suivi transparent des progrès, une identification honnête des lacunes et des actions de suivi significatives.',
          point1: 'Toutes les évaluations sont explicitement auto-déclarées et non certifiantes',
          point2: 'Permettre aux acheteurs de démontrer une surveillance continue, pas des contrôles ponctuels',
          point3: 'Soutenir un reporting basé sur des preuves, pas des déclarations exagérées',
          cta: 'Commencer l\'Évaluation',
        },
      },
      footer: 'AgroSoluce™ fournit la base opérationnelle requise pour effectuer la diligence raisonnable de manière responsable — sans fausses déclarations de conformité.',
      cta: 'Explorer le Répertoire des Coopératives',
    },
    whoItsFor: {
      title: 'Pour Qui est AgroSoluce™',
      subtitle: 'Conçu pour les coopératives, acheteurs et partenaires travaillant vers un approvisionnement responsable',
      audiences: {
        cooperatives: {
          title: 'Pour les Coopératives',
          benefit1: 'Organiser la documentation clairement',
          benefit2: 'Démontrer l\'effort, pas la perfection',
          benefit3: 'Prioriser les prochaines étapes sans deviner',
          benefit4: 'Construire la confiance avec les acheteurs et partenaires',
          cta: 'Accéder à Votre Espace de Travail',
        },
        buyers: {
          title: 'Pour les Acheteurs & Équipes d\'Approvisionnement',
          benefit1: 'Découvrir les coopératives de manière transparente',
          benefit2: 'Comprendre quelles informations existent aujourd\'hui',
          benefit3: 'Identifier où une diligence raisonnable renforcée est nécessaire',
          benefit4: 'Soutenir l\'engagement plutôt que l\'exclusion',
          cta: 'Explorer le Portail Acheteur',
        },
        partners: {
          title: 'Pour les ONG & Partenaires',
          benefit1: 'Surveiller les efforts d\'amélioration dans les programmes ou pilotes',
          benefit2: 'Suivre l\'engagement des agriculteurs à l\'échelle de la coopérative',
          benefit3: 'Travailler à partir d\'une base commune basée sur des preuves',
          benefit4: 'Soutenir l\'apprentissage, la surveillance et l\'amélioration — pas les récits marketing',
          cta: 'Nous Contacter',
        },
      },
      disclaimer: 'AgroSoluce™ soutient les efforts de diligence raisonnable et de transparence. Les informations affichées peuvent inclure des données auto-déclarées et ne constituent pas une certification, une approbation réglementaire ou une conformité vérifiée.',
    },
    buyerLanding: {
      hero: {
        tagline: 'Pour les Acheteurs & Équipes d\'Approvisionnement',
        title: 'AgroSoluce™ pour les Acheteurs',
        subtitle: 'L\'Approvisionnement Responsable Commence par la Visibilité — Pas les Hypothèses',
        description: 'AgroSoluce™ aide les acheteurs à comprendre ce qui existe, ce qui manque et où se concentrer sur la diligence raisonnable — sans forcer les coopératives à faire de fausses déclarations de conformité. Nous fournissons une vue structurée, axée sur les agriculteurs, des coopératives afin que les décisions d\'approvisionnement soient basées sur la transparence et le progrès, pas sur des suppositions.',
      },
      problem: {
        title: 'Le Problème des Acheteurs',
        subtitle: 'Les équipes d\'approvisionnement sont sous pression pour:',
        points: [
          'soutenir la diligence raisonnable EUDR et les risques de travail',
          'démontrer un approvisionnement responsable',
          'et prendre des décisions avec des informations incomplètes',
        ],
        solution: 'Ce qui manque n\'est pas une autre certification — c\'est une visibilité claire sur la réalité.',
      },
      how: {
        title: 'Comment AgroSoluce™ Soutient la Diligence Raisonnable des Acheteurs',
      },
      features: {
        discover: {
          title: '1. Découvrir les Coopératives de Manière Transparente',
          description: 'Explorez un répertoire structuré de coopératives agricoles avec identité et contexte d\'approvisionnement, informations sur les cultures et régions, et profils stables et partageables.',
          point1: 'Pas de scoring caché. Pas de boîtes noires.',
          point2: 'Visibilité claire de l\'identité de la coopérative et du contexte d\'approvisionnement',
          point3: 'Profils stables et partageables pour les workflows de diligence raisonnable',
        },
        coverage: {
          title: '2. Voir la Couverture de Documentation (Pas la Conformité Binaire)',
          description: 'AgroSoluce™ affiche la couverture de documentation comme Limité, Partiel ou Substantiel. Cela aide les acheteurs à évaluer rapidement la préparation à l\'engagement, le besoin de diligence raisonnable renforcée et où une vérification supplémentaire est requise.',
          point1: 'Comprendre quelles informations existent aujourd\'hui',
          point2: 'Identifier où une diligence raisonnable renforcée est nécessaire',
          point3: 'Prendre des décisions éclairées basées sur le statut réel de la documentation',
        },
        engagement: {
          title: '3. Comprendre l\'Engagement des Agriculteurs',
          description: 'Au-delà des documents, AgroSoluce™ montre si les agriculteurs sont intégrés, la participation à la formation au niveau de la coopérative, et les déclarations et activités d\'engagement dans le temps.',
          point1: 'Soutenir l\'évaluation des risques basée sur le comportement, pas seulement sur les documents',
          point2: 'Voir les signaux d\'engagement au niveau des agriculteurs à l\'échelle de la coopérative',
          point3: 'Suivre l\'activité d\'engagement dans le temps',
        },
        progress: {
          title: '4. Suivre le Progrès dans le Temps',
          description: 'AgroSoluce™ enregistre des instantanés de préparation, des auto-évaluations de coopératives, et des améliorations visibles et lacunes restantes.',
          point1: 'Permettre aux acheteurs de démontrer une surveillance continue, pas des contrôles ponctuels',
          point2: 'Observer les trajectoires d\'amélioration et les lacunes restantes',
          point3: 'Soutenir le reporting basé sur des preuves et la documentation de diligence raisonnable',
        },
      },
      whatGet: {
        title: 'Ce Que les Acheteurs Obtiennent (et Ce Qu\'ils N\'Obtiennent Pas)',
        youGet: {
          title: 'Vous obtenez:',
          points: [
            'profils de coopératives structurés et comparables',
            'transparence sur la couverture des informations',
            'visibilité sur l\'engagement au niveau des agriculteurs',
          ],
        },
        youDont: {
          title: 'Vous n\'obtenez pas:',
          points: [
            'garanties de conformité',
            'déterminations de risque automatisées',
            'badges de certification',
          ],
        },
        footer: 'AgroSoluce™ soutient votre diligence raisonnable — il ne la remplace pas.',
      },
      why: {
        title: 'Pourquoi les Acheteurs Utilisent AgroSoluce™',
        points: [
          'Réduire les angles morts d\'approvisionnement',
          'Prioriser l\'engagement plutôt que l\'exclusion',
          'Préparer les audits et vérifications sur le terrain plus efficacement',
          'Soutenir un approvisionnement responsable sans exagération',
        ],
      },
      cta: {
        explore: 'Explorer le Répertoire',
        pilot: 'Rejoindre un Pilote Acheteur',
      },
      disclaimer: 'AgroSoluce™ soutient les processus de diligence raisonnable. Toutes les informations peuvent inclure des données auto-déclarées et ne constituent pas une certification ou une approbation réglementaire.',
    },
    partnerLanding: {
      hero: {
        tagline: 'Pour les ONG & Partenaires de Programme',
        title: 'AgroSoluce™ pour les ONG & Partenaires de Programme',
        subtitle: 'Rendre Visible le Progrès au Niveau des Agriculteurs — Sans Déformer la Réalité',
        description: 'AgroSoluce™ aide les ONG et partenaires à surveiller, structurer et soutenir les efforts d\'amélioration dans les coopératives — en commençant par les agriculteurs et en agrégant aux programmes et pilotes. Nous nous concentrons sur ce qui se passe, pas sur ce qui est revendiqué.',
      },
      challenge: {
        title: 'Le Défi des ONG & Programmes',
        subtitle: 'Les programmes ont souvent du mal à:',
        points: [
          'suivre les progrès de manière cohérente dans les coopératives',
          'comparer les efforts équitablement sans simplification excessive',
          'rapporter de manière transparente sans exagérer les résultats',
        ],
        solution: 'AgroSoluce™ a été construit pour soutenir l\'apprentissage, la surveillance et l\'amélioration — pas les récits marketing.',
      },
      how: {
        title: 'Comment AgroSoluce™ Soutient les Programmes',
      },
      features: {
        baselines: {
          title: '1. Bases de Coopératives Structurées',
          description: 'AgroSoluce™ établit une base commune dans les coopératives: identité et contexte d\'approvisionnement, couverture de documentation, et visibilité de l\'engagement des agriculteurs.',
          point1: 'Créer un langage commun entre partenaires',
          point2: 'Permettre une comparaison équitable entre coopératives',
          point3: 'Établir des points de départ basés sur des preuves',
        },
        monitoring: {
          title: '2. Surveillance Axée sur les Agriculteurs',
          description: 'AgroSoluce™ suit les activités d\'intégration des agriculteurs, les événements de formation, les déclarations et la participation, et les indicateurs de base vs progrès.',
          point1: 'L\'engagement des agriculteurs devient observable, pas anecdotique',
          point2: 'Suivre les activités au niveau des agriculteurs à l\'échelle de la coopérative',
          point3: 'Surveiller la participation à la formation et l\'engagement dans le temps',
          point4: 'Soutenir l\'évaluation de programme basée sur des preuves',
        },
        progress: {
          title: '3. Suivi des Progrès Sans Pression',
          description: 'Les programmes peuvent enregistrer des instantanés de préparation dans le temps, observer les trajectoires d\'amélioration et identifier où un soutien supplémentaire est nécessaire.',
          point1: 'Pas de scores forcés. Pas d\'étiquettes tout ou rien.',
          point2: 'Suivre les améliorations graduelles honnêtement',
          point3: 'Identifier où un soutien supplémentaire est nécessaire',
        },
        views: {
          title: '4. Vues Pilote & Portefeuille',
          description: 'AgroSoluce™ permet de regrouper les coopératives en pilotes ou programmes, de visualiser des indicateurs agrégés et de descendre à la réalité au niveau de la coopérative lorsque nécessaire.',
          point1: 'Soutenir un reporting basé sur des preuves, pas des déclarations exagérées',
          point2: 'Visualiser les progrès agrégés dans les programmes',
          point3: 'Descendre au détail au niveau de la coopérative lorsque nécessaire',
        },
      },
      whatIs: {
        title: 'Ce Qu\'AgroSoluce™ Est (et N\'Est Pas)',
        is: {
          title: 'AgroSoluce™ est:',
          points: [
            'une plateforme de transparence et de surveillance',
            'un outil de soutien à la diligence raisonnable',
            'une couche de visibilité de programme axée sur les agriculteurs',
          ],
        },
        isNot: {
          title: 'AgroSoluce™ n\'est pas:',
          points: [
            'un système de certification',
            'un moteur d\'audit',
            'un garant de résultats',
          ],
        },
      },
      why: {
        title: 'Pourquoi les ONG & Partenaires Utilisent AgroSoluce™',
        points: [
          'Renforcer la crédibilité du programme',
          'Aligner les coopératives autour de chemins d\'amélioration réalistes',
          'Partager des informations structurées avec les acheteurs et bailleurs de fonds',
          'Réduire les frictions de reporting sans perdre la nuance',
        ],
      },
      cta: {
        pilot: 'Démarrer un Pilote de Programme',
        explore: 'Explorer les Coopératives',
      },
      disclaimer: 'AgroSoluce™ soutient les efforts de surveillance et de diligence raisonnable. Il ne certifie pas les résultats ni ne remplace la vérification indépendante.',
    },
    cooperativeSpace: {
      hero: {
        title: 'Espace Coopérative',
        subtitle: 'Votre espace de travail dédié pour gérer la conformité, la documentation et l\'engagement des agriculteurs',
        description: 'Accédez à votre tableau de bord coopératif pour suivre les progrès, gérer les preuves et rendre votre parcours de conformité visible aux acheteurs.',
      },
      features: {
        evidence: {
          title: 'Gestion des Preuves',
          description: 'Téléchargez et organisez la documentation de conformité, y compris les droits fonciers, les enregistrements d\'agriculteurs et les certificats.',
        },
        coverage: {
          title: 'Suivi de la Couverture',
          description: 'Surveillez vos métriques de couverture de documentation et voyez à quel point votre collection de preuves est complète.',
        },
        compliance: {
          title: 'Préparation à la Conformité',
          description: 'Consultez les scores de préparation et les niveaux de maturité pour EUDR, CMMC et autres cadres réglementaires.',
        },
        farmersFirst: {
          title: 'Agriculteurs en Premier',
          description: 'Suivez et gérez les enregistrements d\'agriculteurs, les programmes de formation et les initiatives d\'engagement.',
        },
        enablement: {
          title: 'Ressources d\'Autonomisation',
          description: 'Accédez à des boîtes à outils, modèles et documents d\'orientation pour améliorer vos pratiques de documentation.',
        },
        producers: {
          title: 'Gestion des Producteurs',
          description: 'Gérez vos producteurs, suivez leur documentation et surveillez la conformité à grande échelle.',
        },
      },
      benefits: {
        title: 'À Quoi Vous Aurez Accès',
        documentation: {
          title: 'Gestion de la Documentation',
          description: 'Téléchargez, organisez et gérez les documents de preuve pour la conformité et la diligence raisonnable.',
        },
        gapAnalysis: {
          title: 'Analyse des Lacunes',
          description: 'Identifiez la documentation manquante avec des conseils spécifiques sur ce qui est nécessaire.',
        },
        enablement: {
          title: 'Ressources d\'Autonomisation',
          description: 'Accédez à des boîtes à outils, modèles et documents d\'orientation pour améliorer vos pratiques.',
        },
        transparency: {
          title: 'Transparence et Visibilité',
          description: 'Rendez vos progrès visibles aux acheteurs et partenaires tout en maintenant la transparence.',
        },
        traceability: {
          title: 'Suivi de la Traçabilité',
          description: 'Suivez les lots, produits et informations de la chaîne d\'approvisionnement pour une traçabilité complète.',
        },
        compliance: {
          title: 'Tableau de Bord de Conformité',
          description: 'Surveillez votre statut de conformité et votre préparation dans plusieurs cadres réglementaires.',
        },
      },
      cta: {
        title: 'Prêt à Accéder à Votre Espace Coopérative?',
        subtitle: 'Connectez-vous ou enregistrez votre coopérative pour débloquer toute la puissance des outils d\'espace de travail AgroSoluce™.',
        findCooperative: 'Trouver Votre Coopérative',
        learnMore: 'En Savoir Plus',
        freeNote: 'Gratuit pour les coopératives • Transparent • Axé sur le progrès',
      },
      info: {
        title: 'À Propos de l\'Espace Coopérative',
        description1: 'L\'Espace Coopérative est conçu pour aider les coopératives à rendre leurs efforts de documentation et de conformité visibles et transparents. En téléchargeant des preuves et en suivant la couverture, vous permettez aux acheteurs et partenaires de comprendre votre état actuel et vos progrès.',
        description2: 'Cette plateforme ne remplace pas les audits ou certifications. Au lieu de cela, elle fournit une vue transparente de ce qui existe, ce qui manque et où concentrer les efforts d\'amélioration. Nous commençons par l\'agriculteur, structurons la réalité au niveau de la coopérative et soutenons une diligence raisonnable crédible alignée sur l\'EUDR.',
      },
      links: {
        lookingFor: 'Vous cherchez autre chose?',
        browseDirectory: 'Parcourir le Répertoire des Coopératives',
        buyerPortal: 'Portail Acheteur',
        about: 'À Propos d\'AgroSoluce',
      },
    },
    workspace: {
      aboutThisWorkspace: 'À Propos de Cet Espace de Travail',
      pilotId: 'ID du Pilote',
      pilotLabel: 'Libellé du Pilote',
      pilotLabelOptional: 'Libellé du Pilote (Optionnel)',
      enterPilotId: 'Entrez l\'ID du pilote (ex: pilot-001)',
      enterPilotLabel: 'Entrez le libellé du pilote (ex: Pilote A)',
      languageNotes: 'Notes Linguistiques',
      backToDirectory: 'Retour au Répertoire',
      exploreDirectory: 'Explorer le Répertoire',
      cooperativeIdRequired: 'L\'ID de la coopérative est requis',
      loadingWorkspace: 'Chargement de l\'espace de travail...',
      cooperativeWorkspace: 'Espace de Travail Coopératif',
      manageComplianceJourney: 'Gérez le Parcours de Conformité de Votre Coopérative',
      documentationEvidenceEnablement: 'Gestion de la Documentation, des Preuves et de l\'Autonomisation',
      workspaceDescription: 'Cet espace de travail fournit aux coopératives des outils pour gérer la couverture de la documentation, suivre l\'état de préparation à la conformité, télécharger des preuves, identifier les lacunes et accéder aux ressources d\'autonomisation. Rendez votre progression visible aux acheteurs et aux partenaires tout en maintenant la transparence sur votre état actuel.',
      publicAccess: 'Accès Public',
      evidenceManagement: 'Gestion des Preuves',
      evidenceManagementDesc: 'Télécharger et organiser la documentation de conformité',
      coverageTracking: 'Suivi de la Couverture',
      coverageTrackingDesc: 'Surveiller les métriques de couverture de la documentation',
      gapAnalysis: 'Analyse des Lacunes',
      gapAnalysisDesc: 'Identifier la documentation manquante et les conseils',
      enablement: 'Autonomisation',
      enablementDesc: 'Accéder aux outils et ressources pour l\'amélioration',
      whatWorkspaceProvides: 'Ce Que Cet Espace de Travail Fournit',
      documentationManagement: 'Gestion de la Documentation',
      documentationManagementDesc: 'Télécharger, organiser et gérer les documents de preuve, y compris les droits fonciers, les inscriptions des agriculteurs, les dossiers de traçabilité et les certificats de conformité.',
      coverageMetrics: 'Métriques de Couverture',
      coverageMetricsDesc: 'Suivez votre couverture de documentation dans différentes catégories et voyez à quel point votre collection de preuves est complète.',
      complianceReadiness: 'État de Préparation à la Conformité',
      complianceReadinessDesc: 'Consultez les scores de préparation et les niveaux de maturité pour EUDR, CMMC et d\'autres cadres réglementaires basés sur votre documentation.',
      gapIdentification: 'Identification des Lacunes',
      gapIdentificationDesc: 'Identifiez la documentation manquante avec des conseils spécifiques sur ce qui est nécessaire et comment l\'obtenir.',
      enablementResources: 'Ressources d\'Autonomisation',
      enablementResourcesDesc: 'Accédez aux trousses d\'outils, modèles et documents d\'orientation pour aider à améliorer vos pratiques de documentation et de conformité.',
      farmerEngagement: 'Engagement des Agriculteurs',
      farmerEngagementDesc: 'Suivez et gérez les inscriptions des agriculteurs, les programmes de formation et les initiatives d\'engagement via le tableau de bord Farmers First.',
      workspaceNote: 'Cet espace de travail est conçu pour aider les coopératives à rendre leurs efforts de documentation et de conformité visibles et transparents. En téléchargeant des preuves et en suivant la couverture, vous permettez aux acheteurs et aux partenaires de comprendre votre état actuel et votre progression.',
      workspaceNoteDetail: 'Cette plateforme ne remplace pas les audits ou les certifications.',
      workspaceNoteDetail2: 'Au lieu de cela, elle fournit une vue transparente de ce qui existe, de ce qui manque et où concentrer les efforts d\'amélioration. Nous commençons par l\'agriculteur, structurons la réalité au niveau de la coopérative et soutenons une diligence raisonnable crédible alignée sur l\'EUDR.',
      tabs: {
        overview: 'Vue d\'ensemble',
        evidence: 'Preuves',
        coverage: 'Couverture',
        gaps: 'Lacunes et Orientation',
        enablement: 'Autonomisation',
        farmersFirst: 'Farmers First',
        assessment: 'Évaluation',
      },
      overview: {
        pilot: 'Pilote:',
        none: 'aucun',
        farmersFirstSnapshot: 'Aperçu Farmers First',
        farmersFirstSnapshotDesc: 'Aperçu de l\'intégration des agriculteurs, des déclarations, de la formation et du suivi de l\'impact',
        viewFullDashboard: 'Voir le Tableau de Bord Complet →',
        onboarding: 'Intégration',
        declarations: 'Déclarations',
        training: 'Formation',
        impactData: 'Données d\'Impact',
        baselineSet: 'Référence définie',
        noBaseline: 'Pas de référence',
        noFarmersFirstData: 'Aucune donnée Farmers First disponible',
        selfAssessment: 'Auto-Évaluation',
        selfAssessmentDesc: 'Derniers résultats d\'auto-évaluation (pas une certification ou une détermination de conformité)',
        viewAssessment: 'Voir l\'Évaluation →',
        startAssessment: 'Commencer l\'Évaluation →',
        loadingAssessment: 'Chargement de l\'évaluation...',
        noAssessmentCompleted: 'Aucune évaluation complétée',
        score: 'Score',
        completed: 'Terminé',
        selfAssessmentNote: 'Auto-évaluation (non certifiée)',
        dueDiligenceSummary: 'Résumé de Diligence Raisonnable',
        dueDiligenceSummaryDesc: 'Exporter un résumé complet des informations de la coopérative',
        exportSummary: 'Exporter le Résumé',
        exporting: 'Exportation...',
        readinessStatus: 'État de Préparation',
        createSnapshot: 'Créer un Instantané',
        creating: 'Création...',
        noReadinessSnapshot: 'Aucun instantané de préparation disponible',
        createFirstSnapshot: 'Créer le Premier Instantané',
        snapshotHistory: 'Historique des Instantanés',
        currentStatus: 'Statut Actuel',
        lastUpdated: 'Dernière Mise à Jour',
        snapshotReason: 'Raison de l\'Instantané',
        readinessNote: 'Il s\'agit d\'un raccourci de préparation interne basé sur la couverture de la documentation. Ce n\'est pas une détermination de conformité.',
        countryContext: 'Contexte du Pays',
        landTenureOverview: 'Aperçu de la Tenure Foncière',
        commonlyAcceptedDocuments: 'Documents Communément Acceptés',
        knownLimitations: 'Limitations Connues',
        publicSources: 'Sources Publiques',
        informationalContentOnly: 'Contenu Informel Uniquement',
        countryContextNote: 'Ces informations sur le contexte du pays sont fournies uniquement à titre de référence. Elles décrivent les pratiques courantes et les limitations mais n\'évaluent pas la conformité ou ne font pas de déterminations sur des coopératives ou des agriculteurs spécifiques.',
        commodityContext: 'Contexte de la Matière Première (Informel)',
        typicalSupplyChain: 'Chaîne d\'Approvisionnement Typique',
        commonDocumentPatterns: 'Modèles de Documents Communs',
        buyerExpectationsSummary: 'Résumé des Attentes des Acheteurs',
        knownChallenges: 'Défis Connus',
        referenceLinks: 'Liens de Référence',
        commodityContextNote: 'Ces informations sur le contexte de la matière première sont fournies uniquement à titre de référence. Elles décrivent les modèles et attentes courants mais n\'évaluent pas l\'adéquation, la suffisance ou la conformité de la documentation d\'une coopérative spécifique.',
        regulatoryContext: 'Contexte Réglementaire (Informel)',
        regulatoryContextNote: 'Cette section fournit uniquement le contexte réglementaire. La détermination de la conformité et du soin dû reste la responsabilité de l\'acheteur.',
        loadingOverview: 'Chargement de la vue d\'ensemble...',
        errorLoadingOverview: 'Erreur lors du chargement de la vue d\'ensemble:',
        retry: 'Réessayer',
      },
      evidence: {
        evidenceDocuments: 'Documents de Preuve',
        uploadDocument: 'Télécharger un Document',
        uploadNewDocument: 'Télécharger un Nouveau Document',
        documentType: 'Type de Document',
        title: 'Titre',
        issuer: 'Émetteur',
        issueDate: 'Date d\'Émission',
        expirationDate: 'Date d\'Expiration (Optionnelle)',
        file: 'Fichier',
        selectType: 'Sélectionner le type',
        documentTitle: 'Titre du document',
        issuingOrganization: 'Organisation émettrice',
        uploading: 'Téléchargement...',
        closeUploadForm: 'Fermer le formulaire de téléchargement',
        loadingDocuments: 'Chargement des documents...',
        noDocumentsUploaded: 'Aucun document téléchargé',
        uploadFirstEvidence: 'Téléchargez votre premier document de preuve pour commencer',
        evidenceType: 'Type de Preuve',
        dates: 'Dates',
        status: 'Statut',
        unverified: 'Non vérifié',
        issued: 'Émis:',
        expires: 'Expire:',
        uploaded: 'Téléchargé:',
        areYouSureDelete: 'Êtes-vous sûr de vouloir supprimer ce document?',
        errorDeleting: 'Erreur lors de la suppression du document:',
      },
      coverage: {
        documentCoverage: 'Couverture des Documents',
        coverageSummary: 'Résumé de la Couverture',
        requiredDocumentsTotal: 'Total des Documents Requis',
        requiredDocumentsPresent: 'Documents Requis Présents',
        coveragePercentage: 'Pourcentage de Couverture',
        lastUpdated: 'Dernière mise à jour:',
        requiredDocumentTypes: 'Types de Documents Requis',
        noRequiredDocumentTypes: 'Aucun type de document requis configuré',
        present: 'Présent',
        missing: 'Manquant',
        loadingCoverage: 'Chargement des métriques de couverture...',
        errorLoadingCoverage: 'Erreur lors du chargement des données de couverture:',
        refresh: 'Actualiser',
      },
      gaps: {
        loadingGapAnalysis: 'Chargement de l\'analyse des lacunes...',
        errorLoadingGap: 'Erreur lors du chargement des données de lacunes:',
        currentDocumentationGaps: 'Lacunes de Documentation Actuelles',
        whyCommonlyRequested: 'Pourquoi C\'est Communément Demandé',
        typicalNextSteps: 'Étapes Typiques Suivantes',
        noDocumentationGaps: 'Aucune Lacune de Documentation',
        allExpectedDocumentTypes: 'Tous les types de documents attendus ont des documents de preuve présents.',
        informationalDueDiligence: 'Support informel de diligence raisonnable',
        finalDecisionsRemain: 'Ces informations sont fournies uniquement à titre de référence. Les décisions finales restent avec l\'acheteur.',
      },
      enablementTab: {
        loadingEnablement: 'Chargement des informations d\'autonomisation...',
        whatBuyersUsuallyRequest: 'Ce Que les Acheteurs Demandent Habituellement',
        currentPilotExpectations: 'Attentes du Pilote Actuel',
        expectedDocumentTypes: 'Types de documents attendus pour le pilote:',
        noSpecificDocumentRequirements: 'Aucune exigence de document spécifique configurée pour ce pilote.',
        noActivePilotScope: 'Aucune portée de pilote active.',
        howInformationUsed: 'Comment Ces Informations Sont Utilisées',
        farmerDeclarationsSummary: 'Résumé des Déclarations des Agriculteurs',
        loadingDocumentStatus: 'Chargement du statut des documents...',
        documentationProvided: 'Documentation fournie par la coopérative',
        farmerGuidance: 'Orientation des Agriculteurs (pour Usage sur le Terrain)',
        farmerGuidanceDesc: 'Explications en langage simple pour vous aider à discuter des exigences de documentation avec les agriculteurs. Ces explications sont conçues pour être utiles et claires, aidant les agriculteurs à comprendre ce qui est nécessaire et ce qui est acceptable.',
        importantNote: 'Note Importante',
        contentIntended: 'Ce contenu est destiné à soutenir les discussions avec les agriculteurs.',
        doesNotReplaceLegal: 'Il ne remplace pas les conseils juridiques.',
        explanation: 'Explication',
        whatIsUsuallyAcceptable: 'Ce Qui Est Habituellement Acceptable',
        commonMisunderstandings: 'Malentendus Courants',
        fieldOfficerToolkit: 'Trousse d\'Outils de l\'Agent de Terrain',
        fieldOfficerToolkitDesc: 'Accédez à des conseils pratiques et à des listes de contrôle pour les agents de terrain et les administrateurs de coopératives. Cette trousse d\'outils comprend des informations sur pourquoi la documentation est demandée, des exemples de documents acceptables, des explications de déclarations et des listes de contrôle sur le terrain pour aider à la collecte de documentation.',
        guidanceNotRules: 'Orientation, pas de règles',
        toolkitProvides: 'Cette trousse d\'outils fournit uniquement des conseils informatifs. Elle n\'établit pas d\'exigences ou ne fait pas de déterminations.',
        downloadFieldToolkit: 'Télécharger la Trousse d\'Outils de Terrain (PDF/JSON)',
        preparingDownload: 'Préparation du téléchargement...',
        farmerProtectionPrinciples: 'Principes de Protection des Agriculteurs',
        learnAboutAgroSoluce: 'Découvrez l\'approche d\'AgroSoluce™ pour protéger la vie privée des agriculteurs, réduire la charge d\'audit et assurer une utilisation responsable des données.',
        viewFarmerProtectionPrinciples: 'Voir les Principes de Protection des Agriculteurs',
        exportEnablementData: 'Exporter les Données d\'Autonomisation',
        exportingEnablement: 'Exportation...',
      },
    },
    pilot: {
      backToDirectory: 'Retour au Répertoire',
      exploreDirectory: 'Explorer le Répertoire',
      pilotIdRequired: 'L\'ID du pilote est requis',
      emptyDashboard: 'Ce tableau de bord de pilote est actuellement vide.',
      emptyDashboardDescription: 'Cela peut signifier que le pilote est nouveau, que les coopératives n\'ont pas encore été assignées, ou que l\'ID du pilote est incorrect.',
      verifyPilotId: 'Si vous pensez que ce pilote devrait contenir des données, veuillez vérifier l\'ID du pilote ou contacter le support.',
    },
    directory: {
      languageNotes: 'Notes Linguistiques',
      aboutThisReference: 'À Propos de Cette Référence',
      aboutThisRegistry: 'À Propos de Ce Registre',
    },
    cooperativeWorkspaceLanding: {
      hero: {
        title: 'Bienvenue dans l\'Espace Coopérative',
        subtitle: 'Votre espace de travail coopératif est prêt, mais nous devons d\'abord enregistrer votre coopérative.',
        description: 'Enregistrez votre coopérative pour accéder à la gestion de la documentation, au suivi de la conformité et aux outils d\'engagement des agriculteurs.',
      },
      features: {
        evidence: {
          title: 'Gestion des Preuves',
          description: 'Téléchargez et organisez la documentation de conformité, y compris les droits fonciers, les enregistrements d\'agriculteurs et les certificats.',
        },
        coverage: {
          title: 'Suivi de la Couverture',
          description: 'Surveillez vos métriques de couverture de documentation et voyez à quel point votre collection de preuves est complète.',
        },
        compliance: {
          title: 'Préparation à la Conformité',
          description: 'Consultez les scores de préparation et les niveaux de maturité pour EUDR, CMMC et autres cadres réglementaires.',
        },
        farmersFirst: {
          title: 'Agriculteurs en Premier',
          description: 'Suivez et gérez les enregistrements d\'agriculteurs, les programmes de formation et les initiatives d\'engagement.',
        },
      },
      benefits: {
        title: 'À Quoi Vous Aurez Accès',
        documentation: {
          title: 'Gestion de la Documentation',
          description: 'Téléchargez, organisez et gérez les documents de preuve pour la conformité et la diligence raisonnable.',
        },
        gapAnalysis: {
          title: 'Analyse des Lacunes',
          description: 'Identifiez la documentation manquante avec des conseils spécifiques sur ce qui est nécessaire.',
        },
        enablement: {
          title: 'Ressources d\'Autonomisation',
          description: 'Accédez à des boîtes à outils, modèles et documents d\'orientation pour améliorer vos pratiques.',
        },
        transparency: {
          title: 'Transparence et Visibilité',
          description: 'Rendez vos progrès visibles aux acheteurs et partenaires tout en maintenant la transparence.',
        },
      },
      cta: {
        title: 'Prêt à Commencer?',
        subtitle: 'Enregistrez votre coopérative pour débloquer toute la puissance des outils d\'espace de travail AgroSoluce™.',
        register: 'Enregistrer Votre Coopérative',
        learnMore: 'En Savoir Plus',
        freeNote: 'Gratuit pour les coopératives • Transparent • Axé sur le progrès',
      },
      additional: {
        alreadyRegistered: 'Déjà enregistré? Assurez-vous d\'utiliser le bon identifiant de coopérative.',
        errorMessage: 'Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter le support ou consulter le',
        checkDirectory: 'Répertoire des Coopératives',
      },
    },
  },
};


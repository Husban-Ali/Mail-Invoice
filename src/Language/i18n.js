import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // 👈 Add this line
  .use(initReactI18next)
  .init({
    resources: {
        en: {
            translation: {
                appName: "Mail Invoices",

                // Sidebar
              sidebar: {
  home: "home",
  emailSetup: "email Setup",
  dataRetrieval: "data Retrieval",
  scrapedData: "scraped Data",
  rulesAutomation: "rules & automation",
  masterData: "master data",
  suppliers: "suppliers",  
  export: "export",        
  userManagement: "user management",
  account: "account",      
  help: "Help and Documentation",
},
                hero: {
  title: "Auto–Collect, Parse & Export Invoices From Email",
  subtitle:
    "Connect to one or more email accounts (Gmail, Outlook/Microsoft 365, generic IMAP). Detect invoices in incoming mail, classify each as an e-invoice (XML formats such as XRechnung/Factur-X/ZUGFeRD) or PDF invoice, extract key data, and store results. Provide a Supplier Directory (company name, address, country, VAT ID, contacts, email) built from invoices + emails with de-duplication, validation, and audit. Label/folder messages automatically and optionally forward them. Offer customizable exports (per-screen data and supplier master data) plus two standard 'export everything' presets. Full audit trail, role-based access, scheduling, and idempotent operations.",
  button: "Schedule a Demo"
},

                filters: {
                    title: "Filters",
                    date: "Date",
                    today: "Today",
                    last7days: "Last 7 days",
                    supplier: "Supplier",
                    status: "Status",
                    parsed: "Parsed",
                    pending: "Pending",
                    error: "Error"
                },

                // Connect Component
                connect: {
                    title: "Connect New Account",
                    prev: "previous",
                    next: "Next",
                    finishBtn: "Finish",
                    connectMailbox: "connect mailbox",
                    addRule: "add rule",
                    steps: {
                        chooseProvider: "Choose Provider",
                        authenticate: "Authenticate",
                        selectFolders: "Select Folders",
                        filters: "Filters",
                        finish: "Finish"
                    }
                },

 statsCards: {
      emailsProcessed: "emails processed today",
      emailsPending: "emails pending today",
      emailsFailed: "emails failed today",
    },
               

                statusCard: {
                    first: "first",
                    last: "last",
                    supplierTitle: "supplier",
                    supplierSubtitle: "format Sent",
                    emailTitle: "already sending via email",
                    emailSubtitle: "not yet sending via email"
                },
                // ChartsSection
                charts: {
                    invoicesCrawled: "Invoices Crawled by This Tool",
                    invoiceFormats: "Invoice File Formats",
                    crawledTool: "Crawled via Tool",
                    otherTools: "Other Tools",
                    pdf: "PDF",
                    xml: "XML Invoices",
                    xlsx: "XLSX",
                    others: "Others",
                },
                dataRetrieval: {
                    statusTitle: "Data Retrieval Status",
                    enable: "Enable",
                    disable: "Disable",
                    offTitle: "Retrieval Is Currently OFF",
                    offDescription: `[Enable Retrieval] to start fetching invoices.
        Once enabled, you can configure:
        - Schedule (frequency)
        - File types (PDF, XML)
        - View retrieval logs`
                },
                invoicesTable: {
                    title: "scraped data (Invoices)",
                    date: "date",
                    company: "company",
                    invoice: "invoice #",
                    amount: "amount",
                    format: "format",
                    status: "status",
                    actions: "actions",
                    parsed: "parsed",
                    pending: "pending",
                    assigned: "assigned",
                    approved: "approved",
                    error: "error",
                    noResults: "No data found",
                    download: "Download",
                    assign: "Assign"
                },
                  dashboard: {
    "title": "Automating Financial",
    "subtitle": "Workflows From Email",
  "description": "Connect mailboxes; detect & classify PDF and XML e-invoices; extract invoice data; build a validated supplier directory with deduplication and audit; automate labeling/forwarding and provide customizable exports.",
  "feature1": { "title": "Connect Mailboxes (Gmail, Outlook/Microsoft 365, IMAP)", "desc": "Connect to one or more email accounts and ingest invoices from multiple inboxes." },
  "feature2": { "title": "Invoice Detection & Extraction", "desc": "Detect PDF vs XML e-invoices (XRechnung, Factur-X, ZUGFeRD), extract key fields and store structured results." },
  "feature3": { "title": "Supplier Directory (Deduplication & Validation)", "desc": "Build and maintain supplier master data (name, address, country, VAT ID, contacts, email) with de-duplication and validation, plus audit history." },
  "feature4": { "title": "Labeling, Forwarding & Exports", "desc": "Automatically label/folder messages, optionally forward to bookkeeping, and offer customizable exports including two 'export everything' presets." },
    "learnMore": "Learn More",
    "cta": "View All Features"
  },

   resources: {
    "title": "Practical Tools & Knowledge",
    "description": "Guides, compliance notes (XRechnung, Factur-X, ZUGFeRD), blog updates, and a help center keep your team informed and ready.",
    "cta": "View All Resources",
    "item1": {
      "title": "Insights & Industry Updates",
      "desc": "Auto-detect PDF & XML invoices, clean vendor data, apply rules, and deliver ready-to-use exports to your accounting systems."
    },
    "item2": {
      "title": "Stay Aligned with Standards",
      "desc": "Auto-detect PDF & XML invoices, clean vendor data, apply rules, and deliver ready-to-use exports to your accounting systems."
    }
  },
  pricing: {
  title: "Plans that grow with your needs",
  subtitle:
    "From free mailbox monitoring to enterprise-grade automation with SSO and custom compliance, choose a plan that matches your invoice volume and integration level.",
  tagline: "Simple, Scalable, Transparent",

  plans: {
    free: {
      name: "Free",
      price: "$0",
      button: "Get started for free",
      features: [
        "1 connected mailbox (Gmail/Outlook/IMAP)",
        "Up to 250 invoices per month",
        "PDF + XML detection with OCR",
        "Basic exports (CSV, Excel)",
        "Basic support",
      ],
    },
    pro: {
      name: "Pro",
      price: "$48",
      button: "Sign up now",
      features: [
        "Up to 5 mailboxes",
        "5,000 invoices per month",
        "OCR + XML parsing (Factur-X, XRechnung, ZUGFeRD support)",
        "Advanced exports (CSV, Excel, JSON, PDF)",
        "Supplier directory & dedupe",
        "Rules & automation",
        "Detailed usage analytics",
        "Priority email support",
      ],
    },
    business: {
      name: "Business",
      price: "$199",
      button: "Sign up now",
      features: [
        "Unlimited mailboxes",
        "50,000 invoices per month",
        "200GB storage",
        "Advanced vendor engine (multi-condition & TIN matching)",
        "OCR + AI dedupe with bulk uploads",
        "Advanced exports, SFTP, Webhooks, Accounting integrations",
        "Full audit trail (RBAC, roles-based access)",
        "Data retention & compliance options",
        "Priority support with SLA response",
      ],
    },
  },
  mostPopular: "Most Popular",
},

        

                logs: {
                    title: "Logs",
                    timings: "Timings",
                    provider: "Provider",
                    status: "Status",
                    success: "{{count}} invoices retrieved successfully",
                    parsed: "{{count}} invoices parsed",
                    error: "ERROR - Authentication expired"
                },
                connectedAccounts: {
                    title: "Connected Accounts",
                    connectNew: "Connect New Account",
                    provider: "Provider",
                    email: "Email Address",
                    status: "Status",
                    lastSync: "Last Sync",
                    actions: "Actions",
                    reconnect: "Reconnect",
                    remove: "Remove",
                    statuses: {
                        connected: "Connected",
                        error: "Error",
                        pending: "Pending",
                        reconnect: "Reconnect"
                    }
                },

                schedule: {
                    title: "Data Retrieval Schedule",
                    frequency: "Frequency",
                    every15: "Every 15 minutes",
                    every30: "Every 30 minutes",
                    hourly: "Hourly",
                    nextRun: "Next Run",
                    runNow: "Run Now"
                },
                
                tableActions: {
  assign: "Assign",
  approve: "Approve",
  export: "Export",
  delete: "Delete"
},
 footer: {
            description:
              "Connect inboxes (Gmail, Outlook, IMAP), auto-detect PDF & XML invoices, clean vendor data.",
            quickLinks: "Quick Links",
            about: "About",
            features: "Features",
            resources: "Resources",
            contact: "Contact",
          },

                fileTypes: {
                    title: "File Types to Retrieve",
                    pdf: "PDF",
                    xml: "XML",
                    others: "Others"
                },
                stats: {
  total: "Total",
  parsed: "Parsed",
  errors: "Errors",
  pending: "Pending"
},
                timeMetrics: {
                    thisWeek: "This Week",
                    thisMonth: "This Month",
                    thisYear: "This Year"
                },
                rulesAutomation: {
                    title: "Rules & Automation",
                    addNewRule: "Add New Rule",
                    name: "Name",
                    trigger: "Trigger",
                    action: "Action",
                    status: "Status",
                    active: "Active",
                    inactive: "Inactive",
                    loading: "Loading...",
                    noRules: "No rules defined",
                    edit: "Edit",
                    duplicate: "Duplicate",
                    delete: "Delete",
                    close: "Close"
                },
                masterData: {
                    title: "Master Data",
                    subtitle: "Manage foundational data like suppliers and, in the future, products, tax codes, and categories.",
                    suppliers: "Suppliers",
                    suppliersDesc: "Directory, details, contacts, merge, review queue, and keyword matching for emails.",
                    openSuppliers: "Open Suppliers",
                    products: "Products (coming soon)",
                    productsDesc: "Standardize product catalog and mappings.",
                    taxCodes: "Tax Codes (coming soon)",
                    taxCodesDesc: "Define tax codes and validation rules.",
                    categories: "Categories (coming soon)",
                    categoriesDesc: "Set up spend categories and mappings.",
                    notAvailable: "Not Available"
                },
                suppliers: {
                    title: "Suppliers",
                    name: "Name",
                    status: "Status",
                    details: "Supplier Details",
                    supplier: "Supplier",
                    taxId: "Tax ID",
                    country: "Country",
                    category: "Category",
                    add: "Add",
                    editInfo: "Edit Info",
                    merge: "Merge",
                    findDuplicates: "Find Duplicates",
                    blockSupplier: "Block Supplier",
                    delete: "Delete",
                    editSupplierInfo: "Edit Supplier Info",
                    saveChanges: "Save Changes",
                    cancel: "Cancel",
                    mergeSuppliers: "Merge Suppliers",
                    merging: "You are merging:",
                    result: "Result:",
                    keepFirst: "Keep first selected as main record",
                    combineInvoices: "Combine invoices and tags",
                    archiveDuplicates: "Archive duplicate records",
                    blockSuppliers: "Block Suppliers",
                    confirmBlock: "Are you sure you want to block the following suppliers?",
                    confirmBlockBtn: "Confirm Block",
                    duplicateGroups: "Possible Duplicate Groups",
                    group: "Group",
                    records: "records",
                    selectMerge: "Select & Merge",
                    select: "Select",
                    merged: "Merged",
                    blocked: "Blocked"
                },
                account: {
                    title: "Account Settings",
                    subtitle: "Manage your account information",
                    fullName: "Full Name",
                    email: "Email Address",
                    emailNote: "Email cannot be changed",
                    phone: "Phone Number (Optional)",
                    editProfile: "Edit Profile",
                    saveChanges: "Save Changes",
                    cancel: "Cancel",
                    security: "Security",
                    changePassword: "Change Password",
                    changePasswordDesc: "Update your password to keep your account secure",
                    twoFactor: "Two-Factor Authentication",
                    twoFactorDesc: "Add an extra layer of security to your account",
                    loading: "Loading profile...",
                    updateSuccess: "Profile updated successfully!",
                    updateFailed: "Failed to update profile",
                    loadFailed: "Failed to load profile"
                },
                export: {
                    title: "Exports",
                    newTemplate: "New Template",
                    createPresets: "Create Presets",
                    close: "Close",
                    templateName: "Template name",
                    entity: "Entity",
                    format: "Format",
                    fields: "Fields",
                    fieldsPlaceholder: "Fields (comma-separated)",
                    actions: "Actions",
                    saveTemplate: "Save Template",
                    saving: "Saving…",
                    loading: "Loading…",
                    noTemplates: "No templates yet",
                    run: "Run",
                    running: "Running…",
                    delete: "Delete",
                    recentRuns: "Recent runs",
                    runAdhoc: "Run Ad-hoc",
                    noRuns: "No runs yet",
                    name: "Name",
                    status: "Status",
                    rows: "Rows",
                    finished: "Finished",
                    download: "Download",
                    adHoc: "(ad-hoc)",
                    invoices: "Invoices",
                    suppliers: "Suppliers",
                    rules: "Rules",
                    completed: "Completed",
                    failed: "Failed",
                    noFile: "No file"
                },
                userManagement: {
                    title: "User Management",
                    name: "Name",
                    email: "Email",
                    status: "Status",
                    actions: "Actions",
                    loading: "Loading...",
                    loadFailed: "Failed to load users",
                    active: "Active",
                    inactive: "Inactive",
                    blocked: "Blocked"
                },
                about: {
                    hero: {
                        title: "About Our Journey",
                        subtitle: "We're a passionate team building innovative digital solutions to simplify your workflow."
                    },
                    mission: {
                        title: "What Drives Us",
                        subtitle: "We believe in crafting software that makes everyday work simpler, faster, and smarter.",
                        ourMission: "Our Mission",
                        ourMissionDesc: "To empower teams and individuals through accessible and impactful software solutions.",
                        ourVision: "Our Vision",
                        ourVisionDesc: "To become a global leader in innovation-driven digital transformation."
                    },
                    team: {
                        title: "Meet Our Team",
                        founder: "Founder & CEO",
                        designer: "UI/UX Designer",
                        developer: "Lead Developer"
                    }
                },
                features: {
                    hero: {
                        title: "Powerful Features to Supercharge Your Workflow",
                        subtitle: "Discover tools designed to make your work faster, smarter, and more collaborative."
                    },
                    core: {
                        title: "Key Features",
                        subtitle: "Each feature is built to save you time, enhance productivity, and bring simplicity to complex workflows.",
                        performance: { title: "Fast Performance", desc: "Optimized for speed, ensuring smooth experiences even with large datasets." },
                        secure: { title: "Secure by Design", desc: "Your data is protected with the latest encryption and privacy standards." },
                        collaboration: { title: "Collaboration Tools", desc: "Work with your team in real time with shared dashboards and activity tracking." },
                        analytics: { title: "Advanced Analytics", desc: "Visualize insights instantly with detailed charts and custom reports." },
                        cloud: { title: "Cloud Integrated", desc: "Seamlessly connect with cloud services to keep your workflow in sync." },
                        workflows: { title: "Customizable Workflows", desc: "Adapt the platform to your needs with flexible configuration options." }
                    },
                    highlight: {
                        title: "Seamless Integration",
                        desc: "Connect your favorite tools like Slack, Google Drive, and Notion in seconds. Our integrations keep everything in sync—so you can focus on creating, not switching tabs.",
                        learnMore: "Learn More"
                    }
                },
                contact: {
                    title: "Get in Touch With Us",
                    subtitle: "Have questions, feedback, or ideas? We'd love to hear from you. Reach out and our team will get back to you as soon as possible.",
                    address: "Address",
                    phone: "Phone",
                    email: "Email",
                    formName: "Your Name",
                    formNamePlaceholder: "Enter your name",
                    formEmail: "Email Address",
                    formEmailPlaceholder: "Enter your email",
                    formMessage: "Message",
                    formMessagePlaceholder: "Write your message...",
                    sendButton: "Send Message"
                },
                resourcesPage: {
                    title: "Resources",
                    subtitle: "Discover helpful tools, guides, and communities to accelerate your learning and productivity.",
                    designGuidelines: { title: "Design Guidelines", desc: "Explore UI/UX best practices and modern design systems for your next project." },
                    devTools: { title: "Development Tools", desc: "A curated list of tools and frameworks that streamline your workflow." },
                    learning: { title: "Learning Materials", desc: "Access free and premium resources to sharpen your coding and design skills." },
                    community: { title: "Community Forums", desc: "Join communities and discussions to share ideas and grow together." },
                    learnMore: "Learn More"
                }

            },
        },

        de: {
            translation: {
                appName: "Mail-Rechnungen",

                // Sidebar
               sidebar: {
  home: "Startseite",
  emailSetup: "E-Mail Einrichtung",
  dataRetrieval: "Datenabruf",
  scrapedData: "Gescrapte Daten",
  rulesAutomation: "Regeln & Automatisierung",
  masterData: "Stammdaten",
  suppliers: "Lieferanten", // ✅ lowercase plural
  export: "Export",         // ✅ lowercase
  userManagement: "Benutzerverwaltung",
  account: "Konto",         // ✅ singular lowercase
  help: "Hilfe und Dokumentation",
},
                statusCard: {
                    first: "Erste",
                    last: "Letzte",
                    supplierTitle: "Lieferant",
                    supplierSubtitle: "Gesendetes Format",
                    emailTitle: "Bereits per E-Mail gesendet",
                    emailSubtitle: "Noch nicht per E-Mail gesendet"
                },
                stats: {
  total: "Gesamt",
  parsed: "Analysiert",
  errors: "Fehler",
  pending: "Ausstehend"
},
                timeMetrics: {
                    thisWeek: "Diese Woche",
                    thisMonth: "Dieser Monat",
                    thisYear: "Dieses Jahr"
                },
                rulesAutomation: {
                    title: "Regeln & Automatisierung",
                    addNewRule: "Neue Regel hinzufügen",
                    name: "Name",
                    trigger: "Auslöser",
                    action: "Aktion",
                    status: "Status",
                    active: "Aktiv",
                    inactive: "Inaktiv",
                    loading: "Laden...",
                    noRules: "Keine Regeln definiert",
                    edit: "Bearbeiten",
                    duplicate: "Duplizieren",
                    delete: "Löschen",
                    close: "Schließen"
                },
                masterData: {
                    title: "Stammdaten",
                    subtitle: "Verwalten Sie grundlegende Daten wie Lieferanten und zukünftig Produkte, Steuercodes und Kategorien.",
                    suppliers: "Lieferanten",
                    suppliersDesc: "Verzeichnis, Details, Kontakte, Zusammenführung, Prüfungswarteschlange und Keyword-Matching für E-Mails.",
                    openSuppliers: "Lieferanten öffnen",
                    products: "Produkte (demnächst)",
                    productsDesc: "Produktkatalog und Zuordnungen standardisieren.",
                    taxCodes: "Steuercodes (demnächst)",
                    taxCodesDesc: "Steuercodes und Validierungsregeln definieren.",
                    categories: "Kategorien (demnächst)",
                    categoriesDesc: "Ausgabenkategorien und Zuordnungen einrichten.",
                    notAvailable: "Nicht verfügbar"
                },
                suppliers: {
                    title: "Lieferanten",
                    name: "Name",
                    status: "Status",
                    details: "Lieferantendetails",
                    supplier: "Lieferant",
                    taxId: "Steuer-ID",
                    country: "Land",
                    category: "Kategorie",
                    add: "Hinzufügen",
                    editInfo: "Info bearbeiten",
                    merge: "Zusammenführen",
                    findDuplicates: "Duplikate finden",
                    blockSupplier: "Lieferant blockieren",
                    delete: "Löschen",
                    editSupplierInfo: "Lieferanteninfo bearbeiten",
                    saveChanges: "Änderungen speichern",
                    cancel: "Abbrechen",
                    mergeSuppliers: "Lieferanten zusammenführen",
                    merging: "Sie führen zusammen:",
                    result: "Ergebnis:",
                    keepFirst: "Erste Auswahl als Hauptdatensatz behalten",
                    combineInvoices: "Rechnungen und Tags kombinieren",
                    archiveDuplicates: "Duplizierte Datensätze archivieren",
                    blockSuppliers: "Lieferanten blockieren",
                    confirmBlock: "Möchten Sie die folgenden Lieferanten wirklich blockieren?",
                    confirmBlockBtn: "Blockierung bestätigen",
                    duplicateGroups: "Mögliche Duplikate-Gruppen",
                    group: "Gruppe",
                    records: "Datensätze",
                    selectMerge: "Auswählen & Zusammenführen",
                    select: "Auswählen",
                    merged: "Zusammengeführt",
                    blocked: "Blockiert"
                },
                account: {
                    title: "Kontoeinstellungen",
                    subtitle: "Verwalten Sie Ihre Kontoinformationen",
                    fullName: "Vollständiger Name",
                    email: "E-Mail-Adresse",
                    emailNote: "E-Mail kann nicht geändert werden",
                    phone: "Telefonnummer (Optional)",
                    editProfile: "Profil bearbeiten",
                    saveChanges: "Änderungen speichern",
                    cancel: "Abbrechen",
                    security: "Sicherheit",
                    changePassword: "Passwort ändern",
                    changePasswordDesc: "Aktualisieren Sie Ihr Passwort, um Ihr Konto zu schützen",
                    twoFactor: "Zwei-Faktor-Authentifizierung",
                    twoFactorDesc: "Fügen Sie eine zusätzliche Sicherheitsebene zu Ihrem Konto hinzu",
                    loading: "Profil wird geladen...",
                    updateSuccess: "Profil erfolgreich aktualisiert!",
                    updateFailed: "Profil-Aktualisierung fehlgeschlagen",
                    loadFailed: "Profil konnte nicht geladen werden"
                },
                export: {
                    title: "Exporte",
                    newTemplate: "Neue Vorlage",
                    createPresets: "Voreinstellungen erstellen",
                    close: "Schließen",
                    templateName: "Vorlagenname",
                    entity: "Entität",
                    format: "Format",
                    fields: "Felder",
                    fieldsPlaceholder: "Felder (durch Komma getrennt)",
                    actions: "Aktionen",
                    saveTemplate: "Vorlage speichern",
                    saving: "Speichern…",
                    loading: "Laden…",
                    noTemplates: "Noch keine Vorlagen",
                    run: "Ausführen",
                    running: "Läuft…",
                    delete: "Löschen",
                    recentRuns: "Letzte Ausführungen",
                    runAdhoc: "Ad-hoc ausführen",
                    noRuns: "Noch keine Ausführungen",
                    name: "Name",
                    status: "Status",
                    rows: "Zeilen",
                    finished: "Abgeschlossen",
                    download: "Herunterladen",
                    adHoc: "(ad-hoc)",
                    invoices: "Rechnungen",
                    suppliers: "Lieferanten",
                    rules: "Regeln",
                    completed: "Abgeschlossen",
                    failed: "Fehlgeschlagen",
                    noFile: "Keine Datei"
                },
                userManagement: {
                    title: "Benutzerverwaltung",
                    name: "Name",
                    email: "E-Mail",
                    status: "Status",
                    actions: "Aktionen",
                    loading: "Laden...",
                    loadFailed: "Benutzer konnten nicht geladen werden",
                    active: "Aktiv",
                    inactive: "Inaktiv",
                    blocked: "Blockiert"
                },
                about: {
                    hero: {
                        title: "Über unsere Reise",
                        subtitle: "Wir sind ein leidenschaftliches Team, das innovative digitale Lösungen entwickelt, um Ihren Arbeitsablauf zu vereinfachen."
                    },
                    mission: {
                        title: "Was uns antreibt",
                        subtitle: "Wir glauben daran, Software zu entwickeln, die die tägliche Arbeit einfacher, schneller und intelligenter macht.",
                        ourMission: "Unsere Mission",
                        ourMissionDesc: "Teams und Einzelpersonen durch zugängliche und wirkungsvolle Softwarelsungen zu stärken.",
                        ourVision: "Unsere Vision",
                        ourVisionDesc: "Ein globaler Führer in innovationsgetriebener digitaler Transformation zu werden."
                    },
                    team: {
                        title: "Lernen Sie unser Team kennen",
                        founder: "Gründer & CEO",
                        designer: "UI/UX Designer",
                        developer: "Lead-Entwickler"
                    }
                },
                features: {
                    hero: {
                        title: "Leistungsstarke Funktionen zur Optimierung Ihres Workflows",
                        subtitle: "Entdecken Sie Tools, die Ihre Arbeit schneller, intelligenter und kollaborativer machen."
                    },
                    core: {
                        title: "Hauptfunktionen",
                        subtitle: "Jede Funktion wurde entwickelt, um Ihnen Zeit zu sparen, die Produktivität zu steigern und komplexe Arbeitsabläufe zu vereinfachen.",
                        performance: { title: "Schnelle Leistung", desc: "Optimiert für Geschwindigkeit und sorgt für reibungslose Erlebnisse auch bei großen Datensätzen." },
                        secure: { title: "Sicher im Design", desc: "Ihre Daten sind mit den neuesten Verschlüsselungs- und Datenschutzstandards geschützt." },
                        collaboration: { title: "Kollaborationstools", desc: "Arbeiten Sie in Echtzeit mit Ihrem Team mit gemeinsamen Dashboards und Aktivitätsverfolgung." },
                        analytics: { title: "Erweiterte Analysen", desc: "Visualisieren Sie Einblicke sofort mit detaillierten Diagrammen und benutzerdefinierten Berichten." },
                        cloud: { title: "Cloud-integriert", desc: "Verbinden Sie sich nahtlos mit Cloud-Diensten, um Ihren Workflow synchron zu halten." },
                        workflows: { title: "Anpassbare Workflows", desc: "Passen Sie die Plattform mit flexiblen Konfigurationsoptionen an Ihre Bedürfnisse an." }
                    },
                    highlight: {
                        title: "Nahtlose Integration",
                        desc: "Verbinden Sie Ihre Lieblingswerkzeuge wie Slack, Google Drive und Notion in Sekunden. Unsere Integrationen halten alles synchron—damit Sie sich auf das Erstellen konzentrieren können, nicht auf das Wechseln von Tabs.",
                        learnMore: "Mehr erfahren"
                    }
                },
                contact: {
                    title: "Kontaktieren Sie uns",
                    subtitle: "Haben Sie Fragen, Feedback oder Ideen? Wir würden gerne von Ihnen hören. Melden Sie sich und unser Team wird sich so schnell wie möglich bei Ihnen melden.",
                    address: "Adresse",
                    phone: "Telefon",
                    email: "E-Mail",
                    formName: "Ihr Name",
                    formNamePlaceholder: "Geben Sie Ihren Namen ein",
                    formEmail: "E-Mail-Adresse",
                    formEmailPlaceholder: "Geben Sie Ihre E-Mail ein",
                    formMessage: "Nachricht",
                    formMessagePlaceholder: "Schreiben Sie Ihre Nachricht...",
                    sendButton: "Nachricht senden"
                },
                resourcesPage: {
                    title: "Ressourcen",
                    subtitle: "Entdecken Sie hilfreiche Tools, Leitfäden und Communities, um Ihr Lernen und Ihre Produktivität zu beschleunigen.",
                    designGuidelines: { title: "Design-Richtlinien", desc: "Erkunden Sie UI/UX-Best Practices und moderne Designsysteme für Ihr nächstes Projekt." },
                    devTools: { title: "Entwicklungstools", desc: "Eine kuratierte Liste von Tools und Frameworks, die Ihren Workflow optimieren." },
                    learning: { title: "Lernmaterialien", desc: "Greifen Sie auf kostenlose und Premium-Ressourcen zu, um Ihre Programmier- und Designfähigkeiten zu schärfen." },
                    community: { title: "Community-Foren", desc: "Treten Sie Communities und Diskussionen bei, um Ideen auszutauschen und gemeinsam zu wachsen." },
                    learnMore: "Mehr erfahren"
                },

                dataRetrieval: {
                    statusTitle: "Datenabruf-Status",
                    enable: "Aktivieren",
                    disable: "Deaktivieren",
                    offTitle: "Abruf ist derzeit AUS",
                    offDescription: `[Abruf aktivieren], um mit dem Abrufen von Rechnungen zu beginnen.
Nach der Aktivierung können Sie konfigurieren:
- Zeitplan (Häufigkeit)
- Dateitypen (PDF, XML)
- Abrufprotokolle anzeigen`
                },
                invoicesTable: {
                    title: "Gesammelte Daten (Rechnungen)",
                    date: "Datum",
                    company: "Firma",
                    invoice: "Rechnungsnummer",
                    amount: "Betrag",
                    format: "Format",
                    status: "Status",
                    actions: "Aktionen",
                    parsed: "Analysiert",
                    pending: "Ausstehend",
                    assigned: "Zugewiesen",
                    approved: "Genehmigt",
                    error: "Fehler",
                    noResults: "Keine Daten gefunden",
                    download: "Herunterladen",
                    assign: "Zuweisen"
                },

                hero: {
  title: "Automatisches Sammeln, Analysieren & Exportieren von Rechnungen aus E-Mails",
  subtitle:
    "Intelligente Rechnungsverarbeitung direkt aus Ihrem Posteingang. Verbinden Sie Postfächer (Gmail, Outlook, IMAP), erkennen Sie automatisch PDF- und XML-Rechnungen, bereinigen Sie Lieferantendaten, wenden Sie Regeln an und exportieren Sie fertige Daten in Ihre Buchhaltungssysteme. Sparen Sie Stunden manueller Arbeit – revisionssicher.",
  button: "Demo vereinbaren"
},
 
   dashboard: {
    "title": "Automatisierung Finanzielle",
    "subtitle": "Arbeitsabläufe aus E-Mails",
    "description": "Mail Invoices erfasst PDF- und XML-E-Rechnungen aus Gmail, Outlook oder IMAP mit intelligenter OCR.",
    "feature1": { "title": "Mehrkonten-Erfassung", "desc": "Verfolgen Sie Ihren Fortschritt und steigern Sie Ihre Motivation jeden Tag." },
    "feature2": { "title": "Intelligente Rechnungserkennung", "desc": "Setzen und verfolgen Sie Ziele mit klaren Aufgabenaufteilungen." },
    "feature3": { "title": "Lieferantenverzeichnis & Dublettenprüfung", "desc": "Sorgen Sie für tägliche Sicherheit durch stärkere Verschlüsselung." },
    "feature4": { "title": "Regeln & Automatisierung", "desc": "Erreichen Sie die wichtigsten Ziele und Fristen mühelos." },
    "learnMore": "Mehr erfahren",
    "cta": "Alle Funktionen anzeigen"
  },
                
                connect: {
                    title: "Neues Konto verbinden",
                    prev: "Zurück",
                    next: "Weiter",
                    finishBtn: "Fertigstellen",
                    connectMailbox: "Postfach verbinden",
                    addRule: "Regel hinzufügen",
                    steps: {
                        chooseProvider: "Anbieter auswählen",
                        authenticate: "Authentifizieren",
                        selectFolders: "Ordner auswählen",
                        filters: "Filter",
                        finish: "Abschließen"
                    }
                },

                connectedAccounts: {
                    title: "Verbundene Konten",
                    connectNew: "Neues Konto verbinden",
                    provider: "Anbieter",
                    email: "E-Mail-Adresse",
                    status: "Status",
                    lastSync: "Letzte Synchronisierung",
                    actions: "Aktionen",
                    reconnect: "Erneut verbinden",
                    remove: "Entfernen",
                    statuses: {
                        connected: "Verbunden",
                        error: "Fehler",
                        pending: "Ausstehend",
                        reconnect: "Erneut verbinden"
                    }
                },
                // StatsCards Component
                 statsCards: {
      emailsProcessed: "Heute verarbeitete E-Mails",
      emailsPending: "Heute ausstehende E-Mails",
      emailsFailed: "Heute fehlgeschlagene E-Mails",
    },
                fileTypes: {
                    title: "Dateitypen zum Abrufen",
                    pdf: "PDF",
                    xml: "XML",
                    others: "Andere"
                },


                // ChartsSection
                charts: {
                    invoicesCrawled: "Von diesem Tool gecrawlte Rechnungen",
                    invoiceFormats: "Rechnungsdateiformate",
                    crawledTool: "Gecrawlt über Tool",
                    otherTools: "Andere Tools",
                    pdf: "PDF",
                    xml: "XML-Rechnungen",
                    xlsx: "XLSX",
                    others: "Andere",
                },

                // RecentInvoicesTable
                schedule: {
                    title: "Abrufzeitplan",
                    frequency: "Häufigkeit",
                    every15: "Alle 15 Minuten",
                    every30: "Alle 30 Minuten",
                    hourly: "Stündlich",
                    nextRun: "Nächster Lauf",
                    runNow: "Jetzt ausführen"
                },
                 footer: {
            description:
              "Postfächer verbinden (Gmail, Outlook, IMAP), PDF- & XML-Rechnungen automatisch erkennen, Lieferantendaten bereinigen.",
            quickLinks: "Schnellzugriff",
            about: "Über uns",
            features: "Funktionen",
            resources: "Ressourcen",
            contact: "Kontakt",
          },
                logs: {
                    title: "Protokolle",
                    timings: "Zeit",
                    provider: "Anbieter",
                    status: "Status",
                    success: "{{count}} Rechnungen erfolgreich abgerufen",
                    parsed: "{{count}} Rechnungen analysiert",
                    error: "FEHLER - Authentifizierung abgelaufen"
                },
                filters: {
                    title: "Filter",
                    date: "Datum",
                    today: "Heute",
                    last7days: "Letzte 7 Tage",
                    supplier: "Lieferant",
                    status: "Status",
                    parsed: "Analysiert",
                    pending: "Ausstehend",
                    error: "Fehler"
                },
                  pricing: {
  title: "Pläne, die mit Ihren Anforderungen wachsen",
  subtitle:
    "Von kostenlosem Posteingangs-Monitoring bis hin zur Enterprise-Automatisierung mit SSO und Compliance – wählen Sie den Plan, der zu Ihrem Rechnungsvolumen passt.",
  tagline: "Einfach, Skalierbar, Transparent",

  plans: {
    free: {
      name: "Kostenlos",
      price: "$0",
      button: "Kostenlos starten",
      features: [
        "1 verbundenes Postfach (Gmail/Outlook/IMAP)",
        "Bis zu 250 Rechnungen pro Monat",
        "PDF + XML-Erkennung mit OCR",
        "Basis-Exporte (CSV, Excel)",
        "Basis-Support",
      ],
    },
    pro: {
      name: "Pro",
      price: "$48",
      button: "Jetzt registrieren",
      features: [
        "Bis zu 5 Postfächer",
        "5.000 Rechnungen pro Monat",
        "OCR + XML-Parsing (Factur-X, XRechnung, ZUGFeRD-Unterstützung)",
        "Erweiterte Exporte (CSV, Excel, JSON, PDF)",
        "Lieferantenverzeichnis & Dublettenprüfung",
        "Regeln & Automatisierung",
        "Detaillierte Nutzungsanalysen",
        "Priorisierter E-Mail-Support",
      ],
    },
    business: {
      name: "Business",
      price: "$199",
      button: "Jetzt registrieren",
      features: [
        "Unbegrenzte Postfächer",
        "50.000 Rechnungen pro Monat",
        "200 GB Speicherplatz",
        "Erweiterte Lieferanten-Engine (mehrere Bedingungen & TIN-Abgleich)",
        "OCR + KI-Deduplizierung mit Massen-Uploads",
        "Erweiterte Exporte, SFTP, Webhooks, Buchhaltungsintegrationen",
        "Vollständige Prüfprotokolle (RBAC, rollenbasierter Zugriff)",
        "Datenaufbewahrung & Compliance-Optionen",
        "Priorisierter Support mit SLA-Antwortzeit",
      ],
    },
  },
  mostPopular: "Am beliebtesten",
},

        
                
  resources: {
    "title": "Praktische Werkzeuge & Wissen",
    "description": "Leitfäden, Compliance-Hinweise (XRechnung, Factur-X, ZUGFeRD), Blog-Updates und ein Help Center halten Ihr Team informiert und bereit.",
    "cta": "Alle Ressourcen anzeigen",
    "item1": {
      "title": "Einblicke & Branchenneuigkeiten",
      "desc": "Erkennen Sie automatisch PDF- und XML-Rechnungen, bereinigen Sie Lieferantendaten, wenden Sie Regeln an und liefern Sie exportfertige Ergebnisse."
    },
    "item2": {
      "title": "Bleiben Sie mit Standards im Einklang",
      "desc": "Erkennen Sie automatisch PDF- und XML-Rechnungen, bereinigen Sie Lieferantendaten, wenden Sie Regeln an und liefern Sie exportfertige Ergebnisse."
    }
  },
                tableActions: {
  assign: "Zuweisen",
  approve: "Genehmigen",
  export: "Exportieren",
  delete: "Löschen"
}

            },
        },
    },
detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    
    fallbackLng: "en",
    debug: false,

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

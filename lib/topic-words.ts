import type { CEFRLevel } from "@/app/api/vocabulary/topic/route";

/** Curated vocabulary database: 10 words × 6 CEFR levels × 18 topics = 1,080 words */
export const topicWords: Record<string, Record<CEFRLevel, string[]>> = {
  animals: {
    A1: ["cat", "dog", "bird", "fish", "horse", "cow", "pig", "duck", "frog", "bee"],
    A2: ["lion", "tiger", "bear", "wolf", "snake", "rabbit", "monkey", "eagle", "shark", "whale"],
    B1: ["dolphin", "penguin", "parrot", "crocodile", "cheetah", "giraffe", "gorilla", "octopus", "flamingo", "koala"],
    B2: ["rhinoceros", "hippopotamus", "chameleon", "platypus", "wolverine", "armadillo", "narwhal", "capybara", "pangolin", "mandrill"],
    C1: ["marsupial", "vertebrate", "amphibian", "crustacean", "carnivore", "herbivore", "omnivore", "nocturnal", "predator", "symbiosis"],
    C2: ["taxonomy", "phylogeny", "ethology", "morphology", "ornithology", "herpetology", "biodiversity", "mutualism", "commensalism", "speciation"],
  },

  food: {
    A1: ["bread", "rice", "milk", "egg", "meat", "fruit", "cake", "soup", "juice", "water"],
    A2: ["coffee", "pizza", "chicken", "salad", "cheese", "butter", "sugar", "cookie", "yogurt", "noodle"],
    B1: ["cuisine", "recipe", "avocado", "marinate", "seasoning", "beverage", "appetizer", "ingredient", "portion", "dessert"],
    B2: ["fermentation", "caramelization", "garnish", "prosciutto", "ceviche", "soufflé", "umami", "entrée", "julienne", "infusion"],
    C1: ["gastronomy", "delicacy", "artisan", "provenance", "macerate", "blanch", "braise", "emulsify", "terroir", "marinade"],
    C2: ["charcuterie", "sommelier", "amuse-bouche", "deglaze", "chiffonade", "brunoise", "consommé", "roux", "beurre", "mirepoix"],
  },

  technology: {
    A1: ["phone", "computer", "screen", "email", "app", "data", "code", "file", "game", "chat"],
    A2: ["download", "password", "keyboard", "website", "software", "hardware", "network", "browser", "update", "backup"],
    B1: ["algorithm", "database", "encryption", "interface", "bandwidth", "prototype", "deployment", "debugging", "backend", "frontend"],
    B2: ["blockchain", "framework", "repository", "microservices", "latency", "scalability", "authentication", "containerization", "middleware", "refactoring"],
    C1: ["concurrency", "recursion", "polymorphism", "orchestration", "observability", "idempotent", "throughput", "abstraction", "heuristic", "deterministic"],
    C2: ["Byzantine", "homomorphic", "sharding", "memoization", "probabilistic", "cryptographic", "immutable", "parallelism", "asynchronous", "transactional"],
  },

  travel: {
    A1: ["hotel", "bus", "train", "car", "map", "ticket", "airport", "flight", "passport", "bag"],
    A2: ["luggage", "beach", "museum", "booking", "currency", "visa", "journey", "tourist", "hostel", "guide"],
    B1: ["excursion", "layover", "accommodation", "sightseeing", "departure", "souvenir", "backpacker", "destination", "resort", "transit"],
    B2: ["nomadic", "expedition", "repatriation", "embarkation", "archipelago", "peninsula", "immerse", "itinerant", "traverse", "detour"],
    C1: ["peregrination", "sojourn", "cosmopolitan", "expatriate", "pilgrimage", "wanderlust", "transient", "wayfarer", "globetrotter", "odyssey"],
    C2: ["peripatetic", "travelogue", "ethnographic", "transmigration", "hegira", "transhumance", "circumnavigate", "reconnaissance", "meander", "diaspora"],
  },

  business: {
    A1: ["buy", "sell", "job", "money", "office", "manager", "customer", "product", "market", "trade"],
    A2: ["profit", "salary", "budget", "contract", "invoice", "meeting", "service", "employee", "company", "report"],
    B1: ["revenue", "negotiate", "stakeholder", "investment", "startup", "quarterly", "overhead", "benchmark", "acquisition", "dividend"],
    B2: ["leverage", "arbitrage", "portfolio", "liquidity", "prospectus", "amortization", "depreciation", "equity", "fiduciary", "syndication"],
    C1: ["oligopoly", "monetization", "conglomerate", "valuation", "mercantile", "paradigm", "collateral", "securitization", "entrepreneurship", "capitalism"],
    C2: ["Keynesian", "antitrust", "promissory", "perpetuity", "consignment", "encumbrance", "receivable", "debenture", "usufruct", "restitution"],
  },

  health: {
    A1: ["sick", "pain", "doctor", "sleep", "eat", "run", "walk", "rest", "blood", "heart"],
    A2: ["healthy", "exercise", "vitamin", "diet", "weight", "muscle", "stomach", "nurse", "hospital", "medicine"],
    B1: ["metabolism", "immune", "inflammation", "hydration", "diagnosis", "supplement", "sedentary", "cardiovascular", "therapy", "rehabilitation"],
    B2: ["pathology", "prognosis", "antibody", "chromosome", "cortisol", "serotonin", "adrenaline", "neurological", "endocrine", "lymphocyte"],
    C1: ["epidemiology", "pharmacology", "etiology", "immunosuppression", "carcinogen", "prophylactic", "palliative", "coagulation", "atrophy", "hypertension"],
    C2: ["cytokine", "anaphylaxis", "apoptosis", "homeostasis", "neurodegeneration", "pharmacokinetics", "proteomics", "genomics", "mitochondrial", "neuropathology"],
  },

  nature: {
    A1: ["tree", "water", "sun", "rain", "flower", "sky", "rock", "sea", "wind", "soil"],
    A2: ["forest", "mountain", "river", "cloud", "storm", "season", "desert", "island", "grass", "volcano"],
    B1: ["ecosystem", "glacier", "erosion", "canopy", "hibernate", "drought", "watershed", "habitat", "migration", "biodiversity"],
    B2: ["tectonic", "permafrost", "biome", "aquifer", "eutrophication", "photosynthesis", "deforestation", "monsoon", "stalactite", "savanna"],
    C1: ["lithosphere", "hydrosphere", "cryosphere", "geomorphology", "stratosphere", "phytoplankton", "sediment", "biogeochemistry", "dendrochronology", "lichen"],
    C2: ["pedology", "paleoecology", "biostratigraphy", "chemoautotroph", "thermocline", "phenology", "cladistics", "trophic", "alluvium", "isostasy"],
  },

  emotions: {
    A1: ["happy", "sad", "angry", "scared", "love", "cry", "laugh", "smile", "worry", "hope"],
    A2: ["excited", "nervous", "surprised", "confused", "proud", "ashamed", "lonely", "grateful", "bored", "curious"],
    B1: ["melancholy", "ecstatic", "nostalgic", "apprehensive", "compassion", "serene", "resentment", "gratitude", "empathy", "jealousy"],
    B2: ["indignant", "ambivalent", "disillusionment", "elation", "introspective", "vulnerability", "resilience", "schadenfreude", "catharsis", "apprehension"],
    C1: ["existential", "equanimity", "rumination", "stoicism", "transcendence", "sublimation", "alienation", "angst", "euphoria", "dissonance"],
    C2: ["lachrymose", "lugubrious", "disconsolate", "ineffable", "languorous", "lassitude", "pusillanimous", "fugacious", "ephemeral", "inchoate"],
  },

  sports: {
    A1: ["run", "swim", "jump", "kick", "ball", "game", "team", "win", "play", "race"],
    A2: ["soccer", "tennis", "basketball", "cycling", "boxing", "athlete", "coach", "stadium", "trophy", "fitness"],
    B1: ["tournament", "champion", "endurance", "agility", "competitive", "referee", "penalty", "strategy", "league", "technique"],
    B2: ["perseverance", "biomechanics", "rehabilitation", "physiotherapy", "anaerobic", "aerobic", "disqualify", "tactical", "knockout", "provisional"],
    C1: ["stamina", "tenacity", "sportsmanship", "camaraderie", "fortitude", "accolade", "adversity", "periodization", "neuromuscular", "kinesthetic"],
    C2: ["hypertrophy", "glycogen", "proprioception", "ergonomics", "tendinopathy", "plyometric", "catabolism", "myofibril", "sarcomere", "lactate"],
  },

  science: {
    A1: ["star", "moon", "water", "fire", "rock", "plant", "grow", "test", "light", "heat"],
    A2: ["atom", "force", "energy", "gravity", "molecule", "oxygen", "carbon", "matter", "wave", "chemical"],
    B1: ["hypothesis", "experiment", "laboratory", "nucleus", "electron", "protein", "evolution", "catalyst", "compound", "photon"],
    B2: ["quantum", "electromagnetic", "thermodynamics", "radioactive", "chromosome", "entropy", "isotope", "polymer", "spectroscopy", "electrolysis"],
    C1: ["stoichiometry", "chromatography", "biochemistry", "neurochemistry", "crystallography", "subatomic", "oxidation", "mitosis", "osmosis", "diffraction"],
    C2: ["eigenvalue", "stochastic", "bioluminescence", "epigenetics", "proteomics", "metabolomics", "bioinformatics", "phenotype", "genotype", "nucleosynthesis"],
  },

  arts: {
    A1: ["draw", "paint", "sing", "dance", "color", "art", "book", "film", "show", "picture"],
    A2: ["sculpture", "portrait", "gallery", "theater", "concert", "cinema", "novel", "poetry", "cartoon", "photograph"],
    B1: ["perspective", "composition", "abstract", "Renaissance", "baroque", "symphony", "narrative", "aesthetic", "genre", "improvise"],
    B2: ["surrealism", "cubism", "allegory", "chiaroscuro", "expressionism", "avant-garde", "motif", "soliloquy", "iconography", "leitmotif"],
    C1: ["semiotics", "postmodernism", "deconstruction", "hermeneutics", "ekphrasis", "metafiction", "pastiche", "bricolage", "phenomenology", "dialectics"],
    C2: ["teleology", "apophenia", "synesthesia", "palimpsest", "exegesis", "ontology", "defamiliarization", "apocryphal", "episteme", "praxis"],
  },

  music: {
    A1: ["song", "sing", "guitar", "piano", "drum", "dance", "loud", "sound", "note", "beat"],
    A2: ["concert", "melody", "rhythm", "orchestra", "band", "album", "lyrics", "tempo", "choir", "bass"],
    B1: ["harmony", "chord", "composition", "improvise", "percussion", "conductor", "acoustic", "notation", "serenade", "amplify"],
    B2: ["counterpoint", "polyphony", "dissonance", "syncopation", "modulation", "cadenza", "pizzicato", "timbre", "staccato", "arpeggio"],
    C1: ["tonality", "microtonality", "aleatory", "glissando", "ostinato", "atonality", "dodecaphony", "contrapuntal", "chromatic", "enharmonic"],
    C2: ["melisma", "polytonality", "spectralism", "heterophony", "microtonal", "transcription", "orchestration", "neoclassicism", "minimalism", "serialism"],
  },

  education: {
    A1: ["school", "learn", "read", "write", "teacher", "student", "book", "class", "study", "test"],
    A2: ["university", "graduate", "diploma", "homework", "lecture", "library", "exam", "scholarship", "lesson", "knowledge"],
    B1: ["curriculum", "pedagogy", "dissertation", "seminar", "assessment", "methodology", "literacy", "numeracy", "internship", "tuition"],
    B2: ["epistemology", "constructivism", "metacognition", "scaffolding", "formative", "accreditation", "differentiation", "immersive", "consortium", "pedagogue"],
    C1: ["heuristics", "andragogy", "dialectical", "socratic", "positivism", "empiricism", "ontological", "praxis", "reductionism", "behaviorism"],
    C2: ["epistemic", "teleological", "propaedeutic", "apodeictic", "eudaimonia", "apotheosis", "syllogism", "aporia", "hermeneutic", "phenomenological"],
  },

  fashion: {
    A1: ["dress", "shirt", "shoe", "hat", "coat", "wear", "color", "style", "fabric", "design"],
    A2: ["fashion", "trend", "designer", "boutique", "casual", "formal", "accessory", "wardrobe", "vintage", "brand"],
    B1: ["couture", "silhouette", "textile", "collection", "runway", "aesthetic", "sustainable", "tailored", "monochrome", "bespoke"],
    B2: ["avant-garde", "draping", "embroidery", "opulent", "sartorial", "gossamer", "taffeta", "jacquard", "deconstructed", "minimalist"],
    C1: ["herringbone", "organza", "grosgrain", "broderie", "chenille", "toile", "passementerie", "haberdashery", "couturier", "mercerization"],
    C2: ["ruching", "trapunto", "smocking", "paillette", "tambour", "pelisse", "polonaise", "watteau", "reticella", "baldric"],
  },

  finance: {
    A1: ["money", "pay", "buy", "cost", "save", "bank", "cash", "price", "spend", "rich"],
    A2: ["loan", "tax", "invest", "budget", "salary", "profit", "debt", "credit", "interest", "account"],
    B1: ["revenue", "dividend", "portfolio", "equity", "mortgage", "inflation", "recession", "depreciation", "liquidity", "hedging"],
    B2: ["derivative", "arbitrage", "leverage", "amortization", "collateral", "securitization", "prospectus", "fiduciary", "debenture", "encumbrance"],
    C1: ["quantitative", "monetary", "fiscal", "Keynesian", "oligopoly", "econometric", "macroeconomics", "microeconomics", "monetarism", "stagflation"],
    C2: ["promissory", "usufruct", "hypothecation", "novation", "subrogation", "conveyance", "garnishment", "restitution", "indemnification", "subordination"],
  },

  psychology: {
    A1: ["think", "feel", "happy", "sad", "mind", "brain", "love", "fear", "dream", "mood"],
    A2: ["emotion", "behavior", "memory", "stress", "anxiety", "therapy", "depression", "phobia", "habit", "personality"],
    B1: ["cognition", "perception", "motivation", "subconscious", "empathy", "resilience", "trauma", "introspection", "reinforcement", "conditioning"],
    B2: ["psychoanalysis", "neuroplasticity", "archetype", "projection", "sublimation", "dissociation", "transference", "alexithymia", "abreaction", "repression"],
    C1: ["phenomenological", "constructivist", "solipsism", "determinism", "reductionism", "gestalt", "metacognition", "apperception", "behaviorism", "psychodynamic"],
    C2: ["apophenia", "pareidolia", "proprioception", "interoception", "noumenal", "confabulation", "depersonalization", "derealization", "dissociative", "hypermnesia"],
  },

  space: {
    A1: ["star", "moon", "sun", "sky", "planet", "rocket", "astronaut", "earth", "light", "dark"],
    A2: ["galaxy", "satellite", "meteor", "comet", "telescope", "orbit", "gravity", "asteroid", "universe", "solar"],
    B1: ["supernova", "constellation", "atmosphere", "radiation", "velocity", "nebula", "eclipse", "cosmic", "launch", "gravitational"],
    B2: ["wormhole", "exoplanet", "singularity", "antimatter", "fusion", "fission", "spectroscopy", "redshift", "interstellar", "dark matter"],
    C1: ["quasar", "pulsar", "parsec", "neutrino", "magnetar", "accretion", "baryonic", "cosmological", "relativistic", "photonic"],
    C2: ["nucleosynthesis", "photoionization", "synchrotron", "astrodynamics", "perihelion", "aphelion", "heliosphere", "magnetosphere", "geodesic", "cosmogony"],
  },

  law: {
    A1: ["law", "rule", "right", "court", "judge", "crime", "police", "fair", "case", "ban"],
    A2: ["lawyer", "jury", "verdict", "witness", "appeal", "contract", "fine", "sentence", "arrest", "defendant"],
    B1: ["legislation", "judiciary", "prosecution", "constitution", "tribunal", "arbitration", "liability", "jurisdiction", "negligence", "statute"],
    B2: ["jurisprudence", "subpoena", "tort", "indictment", "acquittal", "precedent", "injunction", "affidavit", "covenant", "habeas"],
    C1: ["tortious", "culpable", "exculpatory", "incriminate", "adjudicate", "promissory", "malfeasance", "indemnification", "rescission", "jurisprudential"],
    C2: ["disenfranchise", "extradition", "deposition", "impeachment", "usurpation", "remand", "exonerate", "interrogatory", "injunctive", "subrogation"],
  },
};

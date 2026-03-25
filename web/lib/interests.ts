export interface Interest {
  slug: string;
  name: string;
  category: string;
  description: string;
  related: string[];
}

export const interestCategories = [
  "Music",
  "Food & Drink",
  "Making & Crafting",
  "Literature & Writing",
  "Gaming",
  "Science & Nature",
  "Philosophy & Ideas",
  "Outdoor & Adventure",
  "Art & Visual",
  "Collecting & Curation",
] as const;

export const interests: Interest[] = [
  // ── Music ──────────────────────────────────────────────────────────────────
  {
    slug: "lo-fi-music-production",
    name: "Lo-Fi Music Production",
    category: "Music",
    description:
      "Creating music with warm, imperfect textures — dusty samples, tape hiss, detuned keys. Lo-fi production is as much a philosophy as a technique.",
    related: ["vintage-synthesizers", "cassette-culture", "vaporwave"],
  },
  {
    slug: "vintage-synthesizers",
    name: "Vintage Synthesizers",
    category: "Music",
    description:
      "The world of analog oscillators, patch cables, and machines that sound like nothing made today. From Moogs to Rolands to obscure Soviet gear.",
    related: ["modular-synthesis", "lo-fi-music-production", "electronic-music-history"],
  },
  {
    slug: "modular-synthesis",
    name: "Modular Synthesis",
    category: "Music",
    description:
      "Building sound from first principles — voltage-controlled modules, Eurorack systems, and the endless rabbit hole of patch design.",
    related: ["vintage-synthesizers", "experimental-composition", "lo-fi-music-production"],
  },
  {
    slug: "cassette-culture",
    name: "Cassette Culture",
    category: "Music",
    description:
      "Tapes as both medium and aesthetic — from lo-fi home recordings to underground tape labels, cassette trading, and the warm crunch of analog noise.",
    related: ["lo-fi-music-production", "analog-photography", "obsolete-media"],
  },
  {
    slug: "field-recording",
    name: "Field Recording",
    category: "Music",
    description:
      "Capturing the sounds of the world — rain on leaves, factory floors, distant trains. The art of listening carefully and preserving what others walk past.",
    related: ["experimental-composition", "bird-watching", "urban-exploration"],
  },
  {
    slug: "microtonal-music",
    name: "Microtonal Music",
    category: "Music",
    description:
      "Music that lives between the notes — tuning systems that divide the octave into 31, 72, or any number of steps. A complete rethinking of harmony.",
    related: ["experimental-composition", "music-theory", "modular-synthesis"],
  },
  {
    slug: "experimental-composition",
    name: "Experimental Composition",
    category: "Music",
    description:
      "Composition that rejects convention — graphic scores, aleatoric processes, extended techniques, and the blurry line between music and sound art.",
    related: ["microtonal-music", "noise-music", "field-recording"],
  },
  {
    slug: "noise-music",
    name: "Noise Music",
    category: "Music",
    description:
      "Where distortion, feedback, and pure signal intensity are the vocabulary. From Merzbow to harsh noise walls — music made from everything usually called not-music.",
    related: ["experimental-composition", "modular-synthesis", "cassette-culture"],
  },
  {
    slug: "vaporwave",
    name: "Vaporwave",
    category: "Music",
    description:
      "The internet's strangest music genre — slowed, chopped 80s corporate muzak turned melancholic. As much a visual aesthetic and cultural critique as a sound.",
    related: ["lo-fi-music-production", "cassette-culture", "obsolete-media"],
  },
  {
    slug: "jazz-transcription",
    name: "Jazz Transcription",
    category: "Music",
    description:
      "The practice of writing down — and learning by ear — solos from Miles, Coltrane, Monk. The deepest possible way to understand improvisation.",
    related: ["music-theory", "classical-guitar", "experimental-composition"],
  },
  {
    slug: "music-theory",
    name: "Advanced Music Theory",
    category: "Music",
    description:
      "Serialism, neo-Riemannian theory, spectral music, microtonality. The academic side of understanding why music does what it does to you.",
    related: ["jazz-transcription", "microtonal-music", "classical-guitar"],
  },
  {
    slug: "chiptune",
    name: "Chiptune & 8-Bit Music",
    category: "Music",
    description:
      "Making music with the sound chips of old computers and game consoles — Game Boy, NES, SID chip. Constraint as creative engine.",
    related: ["retro-game-collecting", "game-modding", "lo-fi-music-production"],
  },
  {
    slug: "electronic-music-history",
    name: "Electronic Music History",
    category: "Music",
    description:
      "Theremin to Stockhausen to Kraftwerk to Detroit techno — the full arc of how electricity became music.",
    related: ["vintage-synthesizers", "experimental-composition", "modular-synthesis"],
  },
  {
    slug: "classical-guitar",
    name: "Classical Guitar",
    category: "Music",
    description:
      "The repertoire of Villa-Lobos, Tárrega, and Segovia; the technique of fingerstyle playing; and the meditative practice of learning a piece for months.",
    related: ["music-theory", "jazz-transcription", "luthiery"],
  },

  // ── Food & Drink ───────────────────────────────────────────────────────────
  {
    slug: "sourdough-baking",
    name: "Sourdough Baking",
    category: "Food & Drink",
    description:
      "Wild yeast, long ferments, and the obsessive pursuit of crumb structure. Sourdough baking is part science, part ritual, part way of keeping time.",
    related: ["fermentation", "food-science", "traditional-bread-making"],
  },
  {
    slug: "fermentation",
    name: "Fermentation",
    category: "Food & Drink",
    description:
      "Kimchi, miso, kombucha, kefir — the ancient art of letting microbes do the work. Fermentation sits at the intersection of science, patience, and flavor.",
    related: ["sourdough-baking", "wild-foraging", "food-science"],
  },
  {
    slug: "molecular-gastronomy",
    name: "Molecular Gastronomy",
    category: "Food & Drink",
    description:
      "Spherification, gels, foams, and the science of why food behaves the way it does. Cooking as controlled experiment.",
    related: ["food-science", "fermentation", "zero-waste-cooking"],
  },
  {
    slug: "wild-foraging",
    name: "Wild Foraging",
    category: "Food & Drink",
    description:
      "Finding and identifying edible plants, fungi, and berries in the wild. Part botany, part mycology, part practical survival skill.",
    related: ["mycology", "botany", "fermentation"],
  },
  {
    slug: "coffee-roasting",
    name: "Home Coffee Roasting",
    category: "Food & Drink",
    description:
      "Roasting green beans at home — understanding Maillard reactions, first crack, and why the same bean from a different roast tastes entirely different.",
    related: ["food-science", "sourdough-baking", "fermentation"],
  },
  {
    slug: "mead-brewing",
    name: "Mead Brewing",
    category: "Food & Drink",
    description:
      "Honey wine — the oldest fermented drink in human history, now experiencing a craft revival. From traditional meads to fruit and spice melomels.",
    related: ["fermentation", "natural-wine", "wild-foraging"],
  },
  {
    slug: "food-science",
    name: "Food Science",
    category: "Food & Drink",
    description:
      "The chemistry, physics, and biology behind cooking. Understanding emulsification, caramelization, and protein denaturation makes everything taste better.",
    related: ["molecular-gastronomy", "fermentation", "sourdough-baking"],
  },
  {
    slug: "natural-wine",
    name: "Natural Wine",
    category: "Food & Drink",
    description:
      "Low-intervention wines made from organic grapes with minimal sulfites. Funky, alive, and deeply divisive — the punk rock of the wine world.",
    related: ["fermentation", "wild-foraging", "food-science"],
  },
  {
    slug: "traditional-bread-making",
    name: "Traditional Bread Making",
    category: "Food & Drink",
    description:
      "Levain, poolish, biga — the ancient techniques of professional bakers. Bread as cultural artifact and daily practice.",
    related: ["sourdough-baking", "food-science", "fermentation"],
  },

  // ── Making & Crafting ──────────────────────────────────────────────────────
  {
    slug: "vintage-bicycle-restoration",
    name: "Vintage Bicycle Restoration",
    category: "Making & Crafting",
    description:
      "Finding neglected steel frames from the 70s and 80s, stripping them back, and rebuilding them to ride again. Part mechanical, part historical research.",
    related: ["watchmaking", "typewriter-restoration", "vintage-electronics-restoration"],
  },
  {
    slug: "watchmaking",
    name: "Watchmaking & Watch Repair",
    category: "Making & Crafting",
    description:
      "Servicing, repairing, and sometimes building mechanical watches. Working at 0.1mm scale with hundreds of components — the ultimate test of patience and precision.",
    related: ["vintage-bicycle-restoration", "metalsmithing", "typewriter-restoration"],
  },
  {
    slug: "leatherworking",
    name: "Leatherworking",
    category: "Making & Crafting",
    description:
      "Hand-stitching, tooling, and dyeing leather to make objects meant to last decades. A craft where tools and techniques haven't changed much in centuries.",
    related: ["bookbinding", "knife-making", "natural-dyeing"],
  },
  {
    slug: "bookbinding",
    name: "Bookbinding",
    category: "Making & Crafting",
    description:
      "Constructing books by hand — Coptic stitching, case binding, Japanese stab binding. Making containers for words that will outlast the words themselves.",
    related: ["letterpress-printing", "leatherworking", "zine-making"],
  },
  {
    slug: "luthiery",
    name: "Luthiery & Guitar Building",
    category: "Making & Crafting",
    description:
      "Building stringed instruments from raw wood — understanding bracing patterns, acoustics, and the months it takes for an instrument to find its voice.",
    related: ["classical-guitar", "woodworking", "knife-making"],
  },
  {
    slug: "knife-making",
    name: "Knife Making",
    category: "Making & Crafting",
    description:
      "Forging or stock-removal blade work, handle fitting, heat treatment. Making a tool that's both functional and beautiful from raw steel.",
    related: ["metalsmithing", "woodworking", "leatherworking"],
  },
  {
    slug: "letterpress-printing",
    name: "Letterpress Printing",
    category: "Making & Crafting",
    description:
      "Printing with metal type and relief plates under pressure. The satisfying deboss, the smell of ink, and the connection to centuries of print culture.",
    related: ["bookbinding", "risograph-printing", "zine-making"],
  },
  {
    slug: "pottery",
    name: "Pottery & Ceramics",
    category: "Making & Crafting",
    description:
      "Throwing, handbuilding, glazing, and firing — clay as a material that records every decision you made and reveals them in the kiln.",
    related: ["natural-dyeing", "woodworking", "metalsmithing"],
  },
  {
    slug: "weaving",
    name: "Hand Weaving",
    category: "Making & Crafting",
    description:
      "Warp and weft, floor looms and rigid heddles. Weaving is one of humanity's oldest technologies and still rewards deep study.",
    related: ["natural-dyeing", "bookbinding", "pottery"],
  },
  {
    slug: "typewriter-restoration",
    name: "Typewriter Restoration",
    category: "Making & Crafting",
    description:
      "Cleaning, repairing, and restoring mechanical typewriters. Each machine is a specific object from a specific era, with its own feel and history.",
    related: ["vintage-bicycle-restoration", "vintage-electronics-restoration", "letterpress-printing"],
  },
  {
    slug: "vintage-electronics-restoration",
    name: "Vintage Electronics Restoration",
    category: "Making & Crafting",
    description:
      "Recapping old amplifiers, repairing vintage radio equipment, and bringing mid-century electronics back to life. Practical history of technology.",
    related: ["vintage-synthesizers", "typewriter-restoration", "amateur-radio"],
  },
  {
    slug: "woodworking",
    name: "Fine Woodworking",
    category: "Making & Crafting",
    description:
      "Hand tool woodworking, joinery, furniture making — working with grain and understanding how wood moves. Slow, precise, and deeply satisfying.",
    related: ["luthiery", "knife-making", "pottery"],
  },
  {
    slug: "natural-dyeing",
    name: "Natural Dyeing & Textiles",
    category: "Making & Crafting",
    description:
      "Extracting color from plants, minerals, and insects to dye fiber. Madder, indigo, weld — and the mordants that fix the color permanently.",
    related: ["weaving", "wild-foraging", "botany"],
  },
  {
    slug: "metalsmithing",
    name: "Metalsmithing & Jewelry",
    category: "Making & Crafting",
    description:
      "Fabricating and forming metal — sawing, soldering, raising, forging. Making objects from raw sheet and wire that will last generations.",
    related: ["knife-making", "watchmaking", "pottery"],
  },

  // ── Literature & Writing ───────────────────────────────────────────────────
  {
    slug: "weird-fiction",
    name: "Weird Fiction",
    category: "Literature & Writing",
    description:
      "Lovecraft, Ligotti, Jeff VanderMeer — fiction where the horror is cosmic, unknowable, and philosophical. The genre about the limits of human understanding.",
    related: ["sci-fi-criticism", "surrealist-writing", "japanese-literature"],
  },
  {
    slug: "literary-translation",
    name: "Literary Translation",
    category: "Literature & Writing",
    description:
      "The impossible, essential work of carrying a novel's soul from one language to another. The translator as invisible collaborator and creative force.",
    related: ["slavic-literature", "japanese-literature", "linguistics"],
  },
  {
    slug: "small-press-publishing",
    name: "Small Press Publishing",
    category: "Literature & Writing",
    description:
      "Poetry collections, artist books, chapbooks — publishing on your own terms for readers who pay attention. The world outside the big five.",
    related: ["zine-making", "letterpress-printing", "bookbinding"],
  },
  {
    slug: "zine-making",
    name: "Zine Making",
    category: "Literature & Writing",
    description:
      "Self-publishing at its most raw — photocopied, hand-stapled, distributed at shows or through the mail. Zines as personal expression and underground culture.",
    related: ["small-press-publishing", "risograph-printing", "letterpress-printing"],
  },
  {
    slug: "sci-fi-criticism",
    name: "Science Fiction Criticism",
    category: "Literature & Writing",
    description:
      "Reading SF as literature and cultural artifact. Ursula Le Guin, Octavia Butler, Kim Stanley Robinson — fiction that thinks seriously about the future.",
    related: ["weird-fiction", "philosophy-of-mind", "surrealist-writing"],
  },
  {
    slug: "poetry",
    name: "Poetry & Poetics",
    category: "Literature & Writing",
    description:
      "Reading, writing, and thinking about what makes a poem work. Contemporary poetry, formal verse, and everything in between.",
    related: ["surrealist-writing", "literary-translation", "linguistics"],
  },
  {
    slug: "surrealist-writing",
    name: "Surrealist Writing",
    category: "Literature & Writing",
    description:
      "Automatic writing, dreamlike logic, images that bypass rational thought. The literary tradition from Breton to Borges to contemporary experimental fiction.",
    related: ["weird-fiction", "poetry", "sci-fi-criticism"],
  },
  {
    slug: "slavic-literature",
    name: "Slavic Literature",
    category: "Literature & Writing",
    description:
      "Tolstoy, Dostoevsky, Bulgakov, Szymborska — the vast tradition of writing from Russia, Poland, the Czech lands, and beyond.",
    related: ["literary-translation", "japanese-literature", "philosophy-of-mind"],
  },
  {
    slug: "japanese-literature",
    name: "Japanese Literature",
    category: "Literature & Writing",
    description:
      "From classical mono no aware to Mishima, Kawabata, Murakami and the new wave of contemporary Japanese writers. A completely different way of building a narrative.",
    related: ["literary-translation", "slavic-literature", "weird-fiction"],
  },
  {
    slug: "interactive-fiction-writing",
    name: "Interactive Fiction Writing",
    category: "Literature & Writing",
    description:
      "Writing games where narrative and player choice coexist — parser IF, Twine, and the long tradition from Adventure to Disco Elysium.",
    related: ["text-adventure-games", "zine-making", "surrealist-writing"],
  },

  // ── Gaming ─────────────────────────────────────────────────────────────────
  {
    slug: "speedrunning",
    name: "Speedrunning",
    category: "Gaming",
    description:
      "Completing games as fast as possible through route optimization, glitch exploitation, and thousands of repetitions. A community built on precision and sharing.",
    related: ["game-preservation", "game-modding", "retro-game-collecting"],
  },
  {
    slug: "game-preservation",
    name: "Video Game Preservation",
    category: "Gaming",
    description:
      "Archiving games before they disappear — dumping ROMs, preserving unreleased prototypes, documenting lost titles. A race against digital entropy.",
    related: ["speedrunning", "retro-game-collecting", "obsolete-media"],
  },
  {
    slug: "tabletop-rpg-design",
    name: "Tabletop RPG Design",
    category: "Gaming",
    description:
      "Writing and designing your own tabletop games — mechanics, world-building, layout. The indie TTRPG scene has exploded into genuine artistry.",
    related: ["zine-making", "interactive-fiction-writing", "board-game-design"],
  },
  {
    slug: "chess-openings",
    name: "Chess Opening Theory",
    category: "Gaming",
    description:
      "The deep forest of chess theory — why every move in the first 20 has been analyzed to branching variations. The intersection of memory, pattern, and creativity.",
    related: ["competitive-puzzle-games", "logic", "board-game-design"],
  },
  {
    slug: "retro-game-collecting",
    name: "Retro Game Collecting",
    category: "Gaming",
    description:
      "Hunting for physical cartridges, CIB games, and obscure hardware. The intersection of nostalgia, history, and the anxiety of digital preservation.",
    related: ["game-preservation", "vintage-electronics-restoration", "obsolete-media"],
  },
  {
    slug: "roguelikes",
    name: "Roguelikes & Roguelites",
    category: "Gaming",
    description:
      "Procedurally generated dungeons, permadeath, and the philosophy of meaningful failure. From Nethack to Hades — a design tradition, not just a genre.",
    related: ["board-game-design", "speedrunning", "text-adventure-games"],
  },
  {
    slug: "board-game-design",
    name: "Board Game Design",
    category: "Gaming",
    description:
      "Mechanism design, player interaction, and the physical artifact. Modern board games are some of the most sophisticated interactive design happening right now.",
    related: ["tabletop-rpg-design", "roguelikes", "chess-openings"],
  },
  {
    slug: "text-adventure-games",
    name: "Text Adventure Games",
    category: "Gaming",
    description:
      "Parser-based IF, MUDs, the Inform and TADS traditions — games built entirely from words and the imagination they activate.",
    related: ["interactive-fiction-writing", "roguelikes", "weird-fiction"],
  },
  {
    slug: "game-modding",
    name: "Game Modding",
    category: "Gaming",
    description:
      "Taking apart existing games and rebuilding them — total conversions, balance mods, and the modding communities that keep games alive for decades.",
    related: ["speedrunning", "game-preservation", "chiptune"],
  },
  {
    slug: "competitive-puzzle-games",
    name: "Competitive Puzzle Games",
    category: "Gaming",
    description:
      "Tetris, Puyo Puyo, puzzle-platformers played at high level — the competitive depth hiding inside games that look casual.",
    related: ["chess-openings", "speedrunning", "roguelikes"],
  },

  // ── Science & Nature ───────────────────────────────────────────────────────
  {
    slug: "amateur-radio",
    name: "Amateur Radio",
    category: "Science & Nature",
    description:
      "Building your own antennas and transceivers, talking to people across the world on bands no one else uses. Radio as a way of understanding the electromagnetic world.",
    related: ["vintage-electronics-restoration", "citizen-science", "space-weather"],
  },
  {
    slug: "mycology",
    name: "Mycology & Mushroom Foraging",
    category: "Science & Nature",
    description:
      "The kingdom Fungi — identifying species in the field, understanding mycelial networks, and the strange beauty of organisms that are neither plant nor animal.",
    related: ["wild-foraging", "botany", "citizen-science"],
  },
  {
    slug: "astrophotography",
    name: "Astrophotography",
    category: "Science & Nature",
    description:
      "Photographing nebulae, galaxies, and planets. Stacking exposures to reveal light that traveled for millions of years, now captured through a lens in your backyard.",
    related: ["amateur-astronomy", "telescope-making", "darkroom-photography"],
  },
  {
    slug: "bird-watching",
    name: "Birding & Ornithology",
    category: "Science & Nature",
    description:
      "Learning to identify hundreds of species by sight and sound — the quiet, obsessive practice that turns any outdoor walk into a quest.",
    related: ["field-recording", "citizen-science", "botany"],
  },
  {
    slug: "telescope-making",
    name: "Amateur Telescope Making",
    category: "Science & Nature",
    description:
      "Grinding mirrors, building mountings, and testing optics — making the instruments that let you see for yourself. A tradition going back to John Dobson.",
    related: ["amateur-astronomy", "astrophotography", "citizen-science"],
  },
  {
    slug: "citizen-science",
    name: "Citizen Science",
    category: "Science & Nature",
    description:
      "Contributing real data to scientific research — counting birds, monitoring water quality, classifying galaxies. Amateur participation in genuine research.",
    related: ["bird-watching", "mycology", "amateur-seismology"],
  },
  {
    slug: "entomology",
    name: "Entomology",
    category: "Science & Nature",
    description:
      "The study of insects — collecting, pinning, and identifying the 90% of animal species that are arthropods. Often an obsession that starts in childhood.",
    related: ["botany", "mycology", "citizen-science"],
  },
  {
    slug: "botany",
    name: "Amateur Botany",
    category: "Science & Nature",
    description:
      "Plant identification, phenology, and the extraordinary complexity of photosynthetic life. Learning to read the landscape through its plants.",
    related: ["wild-foraging", "natural-dyeing", "bird-watching"],
  },
  {
    slug: "cave-exploration",
    name: "Caving & Speleology",
    category: "Science & Nature",
    description:
      "Crawling through passages no one has mapped, finding underground rivers and crystal formations. One of the last genuinely unexplored frontiers.",
    related: ["geology-field-work", "citizen-science", "bushcraft"],
  },
  {
    slug: "amateur-astronomy",
    name: "Amateur Astronomy",
    category: "Science & Nature",
    description:
      "Visual observing from your backyard — learning the sky, hunting down Messier objects, and experiencing the scale of the universe firsthand.",
    related: ["astrophotography", "telescope-making", "space-weather"],
  },
  {
    slug: "space-weather",
    name: "Space Weather & Aurora Chasing",
    category: "Science & Nature",
    description:
      "Monitoring solar activity, forecasting geomagnetic storms, and traveling north to see the aurora. The intersection of physics and pure spectacle.",
    related: ["amateur-astronomy", "amateur-radio", "citizen-science"],
  },
  {
    slug: "geology-field-work",
    name: "Geology & Rock Collecting",
    category: "Science & Nature",
    description:
      "Reading rock formations, finding fossils, and understanding how the planet has assembled and reassembled itself over billions of years.",
    related: ["cave-exploration", "wild-foraging", "citizen-science"],
  },
  {
    slug: "amateur-seismology",
    name: "Amateur Seismology",
    category: "Science & Nature",
    description:
      "Building or buying seismometers and monitoring ground motion at home — detecting distant earthquakes, local quarry blasts, and the hum of the planet.",
    related: ["citizen-science", "amateur-radio", "geology-field-work"],
  },

  // ── Philosophy & Ideas ─────────────────────────────────────────────────────
  {
    slug: "philosophy-of-mind",
    name: "Philosophy of Mind",
    category: "Philosophy & Ideas",
    description:
      "Consciousness, qualia, the hard problem, functionalism — the questions about inner experience that resist scientific resolution.",
    related: ["consciousness-studies", "epistemology", "linguistics"],
  },
  {
    slug: "stoicism",
    name: "Stoicism & Applied Philosophy",
    category: "Philosophy & Ideas",
    description:
      "Marcus Aurelius, Epictetus, and the practical tradition of ancient philosophy. Using ideas to actually change how you respond to the world.",
    related: ["moral-philosophy", "epistemology", "phenomenology"],
  },
  {
    slug: "phenomenology",
    name: "Phenomenology",
    category: "Philosophy & Ideas",
    description:
      "Husserl, Heidegger, Merleau-Ponty — the philosophical tradition of starting from lived experience rather than abstract theory.",
    related: ["philosophy-of-mind", "consciousness-studies", "linguistics"],
  },
  {
    slug: "linguistics",
    name: "Linguistics & Language",
    category: "Philosophy & Ideas",
    description:
      "How language works — syntax, semantics, historical change, endangered languages, and the Sapir-Whorf debate. Language as the window into thought.",
    related: ["literary-translation", "philosophy-of-language", "semiotics"],
  },
  {
    slug: "semiotics",
    name: "Semiotics",
    category: "Philosophy & Ideas",
    description:
      "The study of signs and symbols — Peirce, Saussure, Barthes. How meaning is made and how signs always slip away from what they're supposed to represent.",
    related: ["linguistics", "philosophy-of-language", "sci-fi-criticism"],
  },
  {
    slug: "moral-philosophy",
    name: "Moral Philosophy & Ethics",
    category: "Philosophy & Ideas",
    description:
      "Consequentialism, virtue ethics, deontology, and the hard cases none of them fully resolve. Taking ethics seriously as a practice, not just a hobby.",
    related: ["stoicism", "epistemology", "philosophy-of-mind"],
  },
  {
    slug: "epistemology",
    name: "Epistemology",
    category: "Philosophy & Ideas",
    description:
      "The theory of knowledge — how do we know what we know? What counts as justification? What are the limits of certainty?",
    related: ["philosophy-of-mind", "logic", "moral-philosophy"],
  },
  {
    slug: "philosophy-of-language",
    name: "Philosophy of Language",
    category: "Philosophy & Ideas",
    description:
      "Frege, Russell, Wittgenstein, Kripke — how words refer, what sentences mean, and why language matters for everything else in philosophy.",
    related: ["linguistics", "semiotics", "epistemology"],
  },
  {
    slug: "consciousness-studies",
    name: "Consciousness Studies",
    category: "Philosophy & Ideas",
    description:
      "The intersection of neuroscience, philosophy, and cognitive science. What is experience? Why is there something it's like to be you?",
    related: ["philosophy-of-mind", "phenomenology", "complexity-theory"],
  },
  {
    slug: "logic",
    name: "Mathematical Logic",
    category: "Philosophy & Ideas",
    description:
      "Gödel's theorems, model theory, proof theory — the formal foundations of mathematics and their surprising philosophical implications.",
    related: ["epistemology", "complexity-theory", "philosophy-of-mind"],
  },
  {
    slug: "complexity-theory",
    name: "Complexity Theory",
    category: "Philosophy & Ideas",
    description:
      "Emergence, self-organization, complex adaptive systems. How simple rules produce irreducible complexity — from ant colonies to consciousness.",
    related: ["consciousness-studies", "logic", "citizen-science"],
  },

  // ── Outdoor & Adventure ────────────────────────────────────────────────────
  {
    slug: "packrafting",
    name: "Packrafting",
    category: "Outdoor & Adventure",
    description:
      "Lightweight inflatable boats carried in a backpack — opening up remote river systems that are otherwise inaccessible. Expedition travel in a bag.",
    related: ["sea-kayaking", "thru-hiking", "bushcraft"],
  },
  {
    slug: "urban-exploration",
    name: "Urban Exploration",
    category: "Outdoor & Adventure",
    description:
      "Exploring abandoned buildings, drainage systems, and off-limits infrastructure. The archaeology of the recent past in places the city forgot.",
    related: ["darkroom-photography", "street-photography", "geology-field-work"],
  },
  {
    slug: "bushcraft",
    name: "Bushcraft & Wilderness Skills",
    category: "Outdoor & Adventure",
    description:
      "Fire by friction, shelter building, plant identification, navigation by stars. The practical skills for spending time in the wild without modern gear.",
    related: ["wild-foraging", "thru-hiking", "cave-exploration"],
  },
  {
    slug: "orienteering",
    name: "Orienteering & Navigation",
    category: "Outdoor & Adventure",
    description:
      "Cross-country navigation with map and compass — a competitive sport and a way of reading landscape. The original wayfinding, practiced seriously.",
    related: ["thru-hiking", "bushcraft", "citizen-science"],
  },
  {
    slug: "storm-chasing",
    name: "Storm Chasing",
    category: "Outdoor & Adventure",
    description:
      "Intercepting supercell thunderstorms and tornadoes across the plains. Part meteorology, part risk management, part confrontation with scale.",
    related: ["space-weather", "citizen-science", "amateur-seismology"],
  },
  {
    slug: "sea-kayaking",
    name: "Sea Kayaking",
    category: "Outdoor & Adventure",
    description:
      "Extended open-water passages, tidal planning, and the meditative rhythm of paddle and wave. Exploring coastlines unavailable to any other mode of travel.",
    related: ["packrafting", "wild-swimming", "thru-hiking"],
  },
  {
    slug: "trad-climbing",
    name: "Trad Rock Climbing",
    category: "Outdoor & Adventure",
    description:
      "Placing your own protection in crack systems and removing it after. Climbing where the only safety net is the gear you put in yourself.",
    related: ["cave-exploration", "ice-climbing", "bushcraft"],
  },
  {
    slug: "wild-swimming",
    name: "Wild Swimming",
    category: "Outdoor & Adventure",
    description:
      "Swimming in rivers, lakes, and the sea — the cold shock, the silence, and the strange freedom of water that doesn't belong to anyone.",
    related: ["sea-kayaking", "packrafting", "thru-hiking"],
  },
  {
    slug: "thru-hiking",
    name: "Thru-Hiking & Long Trails",
    category: "Outdoor & Adventure",
    description:
      "Walking the AT, PCT, CDT, or other long trails end-to-end. The logistical puzzle, the physical test, and what happens to your mind over months of walking.",
    related: ["bushcraft", "orienteering", "packrafting"],
  },
  {
    slug: "ice-climbing",
    name: "Ice Climbing & Mountaineering",
    category: "Outdoor & Adventure",
    description:
      "Moving on frozen waterfalls and alpine faces — front-pointing, ice tool placement, and the particular clarity of cold, commitment, and exposure.",
    related: ["trad-climbing", "cave-exploration", "bushcraft"],
  },

  // ── Art & Visual ───────────────────────────────────────────────────────────
  {
    slug: "risograph-printing",
    name: "Risograph Printing",
    category: "Art & Visual",
    description:
      "Printing with stencil-based machines that produce beautifully imperfect, layered colors. The choice of every indie comic artist and zine maker who cares about the object.",
    related: ["letterpress-printing", "zine-making", "analog-photography"],
  },
  {
    slug: "darkroom-photography",
    name: "Darkroom Photography",
    category: "Art & Visual",
    description:
      "Film, developer, fixer, and red light — the chemical process of making photographic images by hand. Watching an image emerge in the tray is still magic.",
    related: ["analog-photography", "astrophotography", "urban-exploration"],
  },
  {
    slug: "analog-photography",
    name: "Analog Photography & Film",
    category: "Art & Visual",
    description:
      "Shooting on film — 35mm, medium format, large format. The constraint of a roll, the grain, the colors of specific emulsions, and the wait.",
    related: ["darkroom-photography", "vintage-cameras", "street-photography"],
  },
  {
    slug: "botanical-illustration",
    name: "Botanical Illustration",
    category: "Art & Visual",
    description:
      "Scientific illustration of plants combining accuracy and beauty. The tradition from Renaissance herbals to Kew Gardens — art in the service of knowledge.",
    related: ["botany", "natural-dyeing", "watercolor"],
  },
  {
    slug: "watercolor",
    name: "Watercolor Painting",
    category: "Art & Visual",
    description:
      "Working with the hardest forgiving medium — wet-on-wet, glazing, and the irreversibility that makes every decision matter.",
    related: ["botanical-illustration", "darkroom-photography", "printmaking"],
  },
  {
    slug: "printmaking",
    name: "Printmaking",
    category: "Art & Visual",
    description:
      "Etching, lithography, woodblock, screen printing — making multiples by hand. Each print is unique, each matrix is a record of every mark.",
    related: ["risograph-printing", "letterpress-printing", "bookbinding"],
  },
  {
    slug: "street-photography",
    name: "Street Photography",
    category: "Art & Visual",
    description:
      "The decisive moment, found compositions, and the ethics of photographing strangers. The tradition from Cartier-Bresson to Vivian Maier.",
    related: ["analog-photography", "urban-exploration", "darkroom-photography"],
  },
  {
    slug: "pixel-art",
    name: "Pixel Art",
    category: "Art & Visual",
    description:
      "Making images at the resolution of early video games — every pixel deliberate, massive complexity built from tiny decisions.",
    related: ["chiptune", "retro-game-collecting", "game-modding"],
  },
  {
    slug: "hand-drawn-animation",
    name: "Hand-Drawn Animation",
    category: "Art & Visual",
    description:
      "Frame-by-frame animation — understanding arcs, squash-and-stretch, and the way movement can communicate personality. An art form of pure labor and love.",
    related: ["pixel-art", "printmaking", "botanical-illustration"],
  },

  // ── Collecting & Curation ──────────────────────────────────────────────────
  {
    slug: "vinyl-records",
    name: "Vinyl Record Collecting",
    category: "Collecting & Curation",
    description:
      "Crate digging, pressings, condition grading, and the ritual of playing a record. Vinyl collecting is about the object as much as the music.",
    related: ["vintage-synthesizers", "lo-fi-music-production", "cassette-culture"],
  },
  {
    slug: "vintage-cameras",
    name: "Vintage Camera Collecting",
    category: "Collecting & Curation",
    description:
      "Rangefinders, TLRs, large format view cameras — collecting the physical instruments of photography. Often the first step toward actually using them.",
    related: ["analog-photography", "darkroom-photography", "vintage-electronics-restoration"],
  },
  {
    slug: "rare-books",
    name: "Rare Book Collecting",
    category: "Collecting & Curation",
    description:
      "First editions, fore-edge paintings, incunabula, and the hunt for significant texts in physical form. Books as cultural artifacts with their own afterlives.",
    related: ["bookbinding", "small-press-publishing", "maps-and-cartography"],
  },
  {
    slug: "maps-and-cartography",
    name: "Antique Maps & Cartography",
    category: "Collecting & Curation",
    description:
      "Collecting historic maps as objects — the errors, projections, sea monsters, and blank spaces that reveal how people understood the world at a given moment.",
    related: ["rare-books", "geology-field-work", "orienteering"],
  },
  {
    slug: "obsolete-media",
    name: "Obsolete & Dead Media",
    category: "Collecting & Curation",
    description:
      "Betamax, laserdisc, 8-track, Minidisc — collecting and preserving media formats that lost the format wars. A museum of technological almost-wases.",
    related: ["game-preservation", "cassette-culture", "vintage-electronics-restoration"],
  },
  {
    slug: "scientific-instruments",
    name: "Antique Scientific Instruments",
    category: "Collecting & Curation",
    description:
      "Sextants, surveying theodolites, microscopes, and calculating devices. Each instrument represents someone trying to measure the world more precisely.",
    related: ["maps-and-cartography", "telescope-making", "watchmaking"],
  },
  {
    slug: "vintage-cookbooks",
    name: "Vintage Cookbook Collecting",
    category: "Collecting & Curation",
    description:
      "Cookbooks as historical documents — the assumptions about labor, class, and available ingredients encoded in recipes from other eras.",
    related: ["rare-books", "food-science", "traditional-bread-making"],
  },
];

export function getInterestBySlug(slug: string): Interest | undefined {
  return interests.find((i) => i.slug === slug);
}

export function getRelatedInterests(interest: Interest): Interest[] {
  return interest.related
    .map((slug) => interests.find((i) => i.slug === slug))
    .filter((i): i is Interest => i !== undefined);
}

export function getInterestsByCategory(category: string): Interest[] {
  return interests.filter((i) => i.category === category);
}

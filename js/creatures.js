
/* =========================================
   ASTRAKSH — CREATURE DATABASE
========================================= */

const CREATURES = [
    // =====================================
    // TIER 1 — PRAKRITI (COMMON)
    // =====================================

    {
        id: "vanaketu",
        name: "Vanaketu",
        tier: "prakriti",
        tierName: "Prakriti",
        rarity: "Common",
        inspiration: "Dandaka forest and forest guardians",
        ability: "Vana Kavach",
        description:
            "Summons roots and leaves to create a protective shield.",
        image: "./Assets/Tier 1/1. Vanaketu.png",
        number: "001"
    },

    {
        id: "setuka",
        name: "Setuka",
        tier: "prakriti",
        tierName: "Prakriti",
        rarity: "Common",
        inspiration: "The construction of Ram Setu",
        ability: "Setu Path",
        description:
            "Forms a temporary bridge of glowing stones across a gap.",
        image: "./Assets/Tier 1/2. Setuka.png",
        number: "002"
    },

    {
        id: "jalnaga",
        name: "Jalnaga",
        tier: "prakriti",
        tierName: "Prakriti",
        rarity: "Common",
        inspiration: "Naga traditions and sacred water symbolism",
        ability: "Jala Vartul",
        description:
            "Spins a ring of water around itself for protection.",
        image: "./Assets/Tier 1/3. Jalnaga.png",
        number: "003"
    },

    {
        id: "marutika",
        name: "Marutika",
        tier: "prakriti",
        tierName: "Prakriti",
        rarity: "Common",
        inspiration: "Indian wind folklore and the power of the monsoon",
        ability: "Pavan Jhatka",
        description:
            "Releases a gust that pushes obstacles away.",
        image: "./Assets/Tier 1/4. Marutika.png",
        number: "004"
    },

    // =====================================
    // TIER 2 — VEER (RARE)
    // =====================================

    {
        id: "gandhivak",
        name: "Gandhivak",
        tier: "veer",
        tierName: "Veer",
        rarity: "Rare",
        inspiration: "Arjuna's legendary bow, Gandiva",
        ability: "Shara Prabha",
        description:
            "Releases a fan of radiant energy arrows.",
        image: "./Assets/Tier 2/1. Gandhivak.png",
        number: "005"
    },

    {
        id: "rathaveg",
        name: "Rathaveg",
        tier: "veer",
        tierName: "Veer",
        rarity: "Rare",
        inspiration: "The legendary chariots of the Indian epics",
        ability: "Saarathi Dash",
        description:
            "Charges forward in a burst of speed, leaving a trail of light.",
        image: "./Assets/Tier 2/2. Rathaveg.png",
        number: "006"
    },

    {
        id: "vyuhraksh",
        name: "Vyuhraksh",
        tier: "veer",
        tierName: "Veer",
        rarity: "Rare",
        inspiration:
            "The Chakravyuha battle formation in the Mahabharata",
        ability: "Vyuh Kavach",
        description:
            "Creates a rotating ring of shields.",
        image: "./Assets/Tier 2/3. Vyuhraksh.png",
        number: "007"
    },

    // =====================================
    // TIER 3 — DIVYA (LEGENDARY)
    // =====================================

    {
        id: "astrajyot",
        name: "Astrajyot",
        tier: "divya",
        tierName: "Divya",
        rarity: "Legendary",
        inspiration: "The celestial astras described in Indian epics",
        ability: "Divya Kavach",
        description:
            "Generates a radiant barrier that absorbs an incoming energy burst.",
        image: "./Assets/Tier 3/1. Astrajyot.png",
        number: "008"
    },

    {
        id: "anantya",
        name: "Anantya",
        tier: "divya",
        tierName: "Divya",
        rarity: "Legendary",
        inspiration:
            "Ananta and the symbolism of infinity and cosmic cycles",
        ability: "Ananta Loop",
        description:
            "Creates a cosmic field that slows moving objects within it.",
        image: "./Assets/Tier 3/2. Anantya.png",
        number: "009"
    }
];

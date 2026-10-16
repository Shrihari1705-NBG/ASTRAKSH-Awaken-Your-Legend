
/* =========================================
   ASTRAKSH — RANDOM CREATURE GENERATOR
========================================= */

// Probability assigned to each tier
const TIER_PROBABILITIES = [
    { tier: "prakriti", chance: 60 },
    { tier: "veer", chance: 30 },
    { tier: "divya", chance: 10 }
];

/**
 * Select a tier according to its probability.
 * Returns: "prakriti", "veer", or "divya"
 */
function selectRandomTier() {
    const roll = Math.random() * 100;

    let cumulativeChance = 0;

    for (const item of TIER_PROBABILITIES) {
        cumulativeChance += item.chance;

        if (roll < cumulativeChance) {
            return item.tier;
        }
    }

    // Safety fallback
    return "prakriti";
}

/**
 * Select a random creature from a particular tier.
 */
function selectCreatureFromTier(tier) {
    const availableCreatures = CREATURES.filter(
        creature => creature.tier === tier
    );

    if (availableCreatures.length === 0) {
        throw new Error(`No creatures found for tier: ${tier}`);
    }

    const randomIndex = Math.floor(
        Math.random() * availableCreatures.length
    );

    return availableCreatures[randomIndex];
}

/**
 * Generate a random creature.
 * First selects the tier, then a creature within that tier.
 */
function generateRandomCreature() {
    const selectedTier = selectRandomTier();

    return selectCreatureFromTier(selectedTier);
}

/**
 * Optional helper for testing tier probabilities.
 */
function getTierDistribution() {
    return TIER_PROBABILITIES.map(item => ({
        tier: item.tier,
        chance: item.chance
    }));
}

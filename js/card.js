
/* =========================================
   ASTRAKSH — CARD RENDERER
   With interactive 3D flip animation
========================================= */

/**
 * Escape user-provided text before inserting it into HTML.
 */
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

/** Auto-flip timer reference (managed globally so it can be cleared) */
let _cardAutoFlipTimer = null;
let _cardAutoFlipInterval = null;

/**
 * Clears any running auto-flip timers.
 */
function clearCardAutoFlip() {
    if (_cardAutoFlipTimer) { clearTimeout(_cardAutoFlipTimer); _cardAutoFlipTimer = null; }
    if (_cardAutoFlipInterval) { clearInterval(_cardAutoFlipInterval); _cardAutoFlipInterval = null; }
}

/**
 * Starts the auto-flip cycle: after `delay` ms, toggle the card every `interval` ms.
 * Defaults to 10 seconds (10000ms).
 */
function startCardAutoFlip(delay = 10000, interval = 10000) {
    clearCardAutoFlip();

    const flipper = document.querySelector(".card-flipper");
    if (!flipper) return;

    _cardAutoFlipTimer = setTimeout(() => {
        // First auto-flip after delay
        flipper.classList.toggle("is-flipped");

        // Then continuously flip every interval
        _cardAutoFlipInterval = setInterval(() => {
            flipper.classList.toggle("is-flipped");
        }, interval);
    }, delay);
}

/**
 * Ensures the card is showing the front face (used before download).
 */
function flipCardToFront() {
    const flipper = document.querySelector(".card-flipper");
    if (flipper) flipper.classList.remove("is-flipped");
}

/**
 * Render a creature's collectible card with front & back faces.
 * Front: artwork, identity, owner info.
 * Back: creature lore, ability, inspiration, stats.
 *
 * @param {Object} creature - Selected creature object
 * @param {Object} participant - Participant details
 */
function renderCreatureCard(creature, participant = {}) {
    const container = document.querySelector("#creature-card-container");

    if (!container || !creature) {
        console.error("Card container or creature is missing.");
        return;
    }

    clearCardAutoFlip();

    const participantName = participant.name || "Your Name";
    const collegeName = participant.college || "Your College";

    const safeName = escapeHTML(participantName);
    const safeCollege = escapeHTML(collegeName);
    const imageSrc = creature.image;

    // Tier-themed icon for the back
    const tierIcons = { prakriti: "🌿", veer: "⚔️", divya: "✦" };
    const tierIcon = tierIcons[creature.tier] || "✦";

    const cardHTML = `
        <div class="card-flip-container">
            <div class="card-flipper" role="button" tabindex="0" aria-label="Tap to flip card">

                <!-- ====== FRONT FACE ====== -->
                <article class="creature-card card-face card-front" data-tier="${creature.tier}">
                    <div class="creature-card__frame">

                        <header class="creature-card__header">
                            <span class="creature-card__brand">ASTRAKSH</span>
                            <span class="creature-card__rarity">
                                ${escapeHTML(creature.rarity)}
                            </span>
                        </header>

                        <h3 class="creature-card__name">
                            ${escapeHTML(creature.name)}
                        </h3>

                        <div class="creature-card__artwork">
                            <img
                                class="creature-card__image"
                                src="${escapeHTML(imageSrc)}"
                                alt="${escapeHTML(creature.name)} card artwork"
                            >
                        </div>

                        <p class="creature-card__type">
                            <span class="type-gem" aria-hidden="true">✦</span>
                            ${escapeHTML(creature.tierName)}
                            <span class="type-gem" aria-hidden="true">✦</span>
                        </p>

                        <section class="creature-card__owner">
                            <div class="creature-card__owner-body">
                                <div class="creature-card__owner-info">
                                    <p class="creature-card__owner-label">
                                        Creature Unlocked By
                                    </p>
                                    <p class="creature-card__owner-name">${safeName}</p>
                                    <p class="creature-card__owner-college">${safeCollege}</p>
                                </div>
                                <div class="creature-card__owner-badge">
                                    <img
                                        class="creature-card__tss-logo"
                                        src="./Assets/Other Assets/TSS_Logo.png"
                                        alt="TSS Logo"
                                    >
                                </div>
                            </div>
                        </section>

                        <footer class="creature-card__footer">
                            <span>AWAKEN YOUR LEGEND</span>
                            <span class="creature-card__number">
                                AK-${escapeHTML(creature.number)}
                            </span>
                        </footer>

                    </div>

                    <div class="card-flip-hint">
                        <span class="flip-hint-icon" aria-hidden="true">↻</span>
                        <span>Tap to reveal lore</span>
                    </div>
                </article>

                <!-- ====== BACK FACE ====== -->
                <article class="creature-card card-face card-back" data-tier="${creature.tier}">
                    <div class="creature-card__frame card-back__frame">

                        <header class="creature-card__header">
                            <span class="creature-card__brand">ASTRAKSH</span>
                            <span class="creature-card__rarity">
                                ${escapeHTML(creature.rarity)}
                            </span>
                        </header>

                        <div class="card-back__content">

                            <div class="card-back__tier-icon" aria-hidden="true">
                                ${tierIcon}
                            </div>

                            <h3 class="card-back__creature-name">
                                ${escapeHTML(creature.name)}
                            </h3>

                            <p class="card-back__tier-label">
                                <span class="type-gem" aria-hidden="true">✦</span>
                                ${escapeHTML(creature.tierName)} Realm
                                <span class="type-gem" aria-hidden="true">✦</span>
                            </p>

                            <div class="card-back__divider" aria-hidden="true"></div>

                            <div class="card-back__stat">
                                <span class="card-back__stat-label">⚡ Signature Ability</span>
                                <span class="card-back__stat-value">${escapeHTML(creature.ability)}</span>
                            </div>

                            <p class="card-back__description">
                                "${escapeHTML(creature.description)}"
                            </p>

                            <div class="card-back__divider" aria-hidden="true"></div>

                            <div class="card-back__stat">
                                <span class="card-back__stat-label">📜 Mythic Inspiration</span>
                                <span class="card-back__stat-value card-back__inspiration">${escapeHTML(creature.inspiration)}</span>
                            </div>

                            <div class="card-back__divider" aria-hidden="true"></div>

                            <div class="card-back__owner-mini">
                                <p class="card-back__owner-label">Guardian of</p>
                                <p class="card-back__owner-name">${safeName}</p>
                                <p class="card-back__owner-college">${safeCollege}</p>
                            </div>

                        </div>

                        <footer class="creature-card__footer">
                            <span>AWAKEN YOUR LEGEND</span>
                            <span class="creature-card__number">
                                AK-${escapeHTML(creature.number)}
                            </span>
                        </footer>

                    </div>

                    <div class="card-flip-hint">
                        <span class="flip-hint-icon" aria-hidden="true">↻</span>
                        <span>Tap to see artwork</span>
                    </div>
                </article>

            </div>
        </div>
    `;

    container.innerHTML = cardHTML;

    // Handle missing artwork without breaking the card.
    const image = container.querySelector(".creature-card__image");
    if (image) {
        image.addEventListener("error", () => {
            const artwork = image.parentElement;
            artwork.innerHTML = `
                <div class="creature-card__image-fallback">
                    Artwork unavailable<br>
                    <small>${escapeHTML(creature.name)}</small>
                </div>
            `;
        }, { once: true });
    }

    // Wire up click/tap to flip
    const flipper = container.querySelector(".card-flipper");
    if (flipper) {
        // Tap / Click flips immediately and restarts the 10s auto-timer
        flipper.addEventListener("click", () => {
            flipper.classList.toggle("is-flipped");
            startCardAutoFlip(10000, 10000);
        });

        // Keyboard accessible (Enter or Space)
        flipper.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flipper.classList.toggle("is-flipped");
                startCardAutoFlip(10000, 10000);
            }
        });

        // Hover pause on desktop so reader can read lore without sudden flip
        flipper.addEventListener("mouseenter", () => {
            clearCardAutoFlip();
        });
        flipper.addEventListener("mouseleave", () => {
            startCardAutoFlip(10000, 10000);
        });
    }

    // Start auto-flip cycle: spins after 10 seconds, and repeats every 10 seconds
    startCardAutoFlip(10000, 10000);
}

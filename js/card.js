
/* =========================================
   ASTRAKSH — CARD RENDERER
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

/**
 * Render a creature's collectible card.
 * Minimalist design focused on artwork, identity, and logo theme.
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

    const participantName = participant.name || "Your Name";
    const collegeName = participant.college || "Your College";

    const safeName = escapeHTML(participantName);
    const safeCollege = escapeHTML(collegeName);

    const hasCustomPhoto = Boolean(participant.customImage || creature.customImage);
    const imageSrc = participant.customImage || creature.customImage || creature.image;
    const photoClass = hasCustomPhoto ? " creature-card__image is-custom-photo" : " creature-card__image";

    const cardHTML = `
        <article class="creature-card" data-tier="${creature.tier}">
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
                        class="${photoClass}"
                        src="${escapeHTML(imageSrc)}"
                        alt="${escapeHTML(creature.name)} card artwork"
                    >
                    ${hasCustomPhoto ? '<span class="custom-photo-badge">📷 Custom Portrait</span>' : ''}
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
        </article>
    `;

    container.innerHTML = cardHTML;

    // Handle missing artwork without breaking the card.
    const image = container.querySelector(".creature-card__image");

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

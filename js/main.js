
/* =========================================
   ASTRAKSH — MAIN APPLICATION CONTROLLER
   With 3-Roll Chance Constraint & Persistence
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Check for ?reset in URL (e.g. http://localhost:8080/?reset)
    if (new URLSearchParams(window.location.search).has("reset")) {
        localStorage.removeItem("astraksh_chances_remaining");
        localStorage.removeItem("astraksh_saved_creature");
        localStorage.removeItem("astraksh_participant_name");
        localStorage.removeItem("astraksh_participant_college");
        window.location.replace(window.location.pathname);
        return;
    }

    const MAX_CHANCES = 3;
    const STORAGE_KEY_CHANCES = "astraksh_chances_remaining";
    const STORAGE_KEY_CREATURE = "astraksh_saved_creature";
    const STORAGE_KEY_NAME = "astraksh_participant_name";
    const STORAGE_KEY_COLLEGE = "astraksh_participant_college";

    // Expose quick reset function on window for easy developer testing in console
    window.resetChances = () => {
        localStorage.removeItem(STORAGE_KEY_CHANCES);
        localStorage.removeItem(STORAGE_KEY_CREATURE);
        window.location.reload();
    };

    window.resetAstraKsh = () => {
        localStorage.clear();
        window.location.reload();
    };

    const generateButton = document.querySelector("#generate-btn");
    const statusMessage = document.querySelector("#status-message");
    const chancesCount = document.querySelector("#chances-count");

    const creatureResult = document.querySelector("#creature-result");
    const personalizeSection = document.querySelector("#personalize");

    const participantForm = document.querySelector("#participant-form");
    const participantNameInput = document.querySelector("#participant-name");
    const collegeNameInput = document.querySelector("#college-name");

    const downloadActions = document.querySelector("#download-actions");
    const downloadButton = document.querySelector("#download-btn");

    let selectedCreature = null;

    /**
     * Get remaining chances from localStorage (default: 3).
     */
    function getRemainingChances() {
        const stored = localStorage.getItem(STORAGE_KEY_CHANCES);
        if (stored === null) {
            return MAX_CHANCES;
        }
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? MAX_CHANCES : Math.max(0, Math.min(MAX_CHANCES, parsed));
    }

    /**
     * Updates the UI elements reflecting chances left.
     */
    function updateChancesUI(chances) {
        if (chancesCount) {
            chancesCount.textContent = `${chances}/${MAX_CHANCES}`;
        }

        // Update pip indicators
        for (let i = 1; i <= MAX_CHANCES; i++) {
            const pip = document.querySelector(`#pip-1, #pip-2, #pip-3`[i - 1] ? document.querySelector(`#pip-${i}`) : null);
            if (pip) {
                // If chances is 2: pip-3 is used, pip-1 and pip-2 active
                if (i > chances) {
                    pip.classList.add("used");
                } else {
                    pip.classList.remove("used");
                }
            }
        }

        if (!generateButton) return;

        if (chances <= 0) {
            generateButton.disabled = true;
            generateButton.innerHTML =
                '<span>No Chances Left (0/3)</span> <span class="btn-symbol" aria-hidden="true">🔒</span>';
            if (selectedCreature && statusMessage) {
                statusMessage.innerHTML =
                    '✦ All 3 chances used! Your legend is sealed. Inscribe your details and download your card.';
            }
        } else if (selectedCreature) {
            generateButton.disabled = false;
            generateButton.innerHTML =
                `<span>Awaken Another Creature (${chances} left)</span> <span class="btn-symbol" aria-hidden="true">✧</span>`;
        } else {
            generateButton.disabled = false;
            generateButton.innerHTML =
                `<span>Awaken My Creature (${chances} left)</span> <span class="btn-symbol" aria-hidden="true">✧</span>`;
        }
    }

    /**
     * Updates card participant details in real-time.
     */
    function updateCardIdentity() {
        if (!selectedCreature) return;
        const name = participantNameInput?.value.trim() || "Your Name";
        const college = collegeNameInput?.value.trim() || "Your College";

        const ownerNameEl = document.querySelector(".creature-card__owner-name");
        const ownerCollegeEl = document.querySelector(".creature-card__owner-college");

        if (ownerNameEl) ownerNameEl.textContent = name;
        if (ownerCollegeEl) ownerCollegeEl.textContent = college;
    }

    // Live update and save participant info while typing
    participantNameInput?.addEventListener("input", () => {
        updateCardIdentity();
        localStorage.setItem(STORAGE_KEY_NAME, participantNameInput.value);
    });

    collegeNameInput?.addEventListener("input", () => {
        updateCardIdentity();
        localStorage.setItem(STORAGE_KEY_COLLEGE, collegeNameInput.value);
    });

    // Handle creature awakening
    generateButton?.addEventListener("click", () => {
        let chances = getRemainingChances();

        if (chances <= 0) {
            updateChancesUI(0);
            if (statusMessage) {
                statusMessage.innerHTML = '✦ You have exhausted all 3 chances!';
            }
            return;
        }

        try {
            // Deduct chance and persist immediately
            chances -= 1;
            localStorage.setItem(STORAGE_KEY_CHANCES, chances);

            selectedCreature = generateRandomCreature();
            localStorage.setItem(STORAGE_KEY_CREATURE, JSON.stringify(selectedCreature));

            const currentName = participantNameInput?.value.trim() || "Your Name";
            const currentCollege = collegeNameInput?.value.trim() || "Your College";

            renderCreatureCard(selectedCreature, {
                name: currentName,
                college: currentCollege
            });

            creatureResult.hidden = false;
            personalizeSection.hidden = false;
            if (downloadActions) downloadActions.hidden = false;

            // Trigger reveal animation
            creatureResult.classList.remove("is-revealing");
            void creatureResult.offsetWidth; // Force reflow
            creatureResult.classList.add("is-revealing");

            const tierRarity = selectedCreature.rarity || selectedCreature.tierName;
            if (chances > 0) {
                statusMessage.innerHTML =
                    `✦ Awakened <strong>${selectedCreature.name}</strong> (${tierRarity})! ${chances} chance${chances === 1 ? '' : 's'} remaining.`;
            } else {
                statusMessage.innerHTML =
                    `✦ Awakened <strong>${selectedCreature.name}</strong> (${tierRarity})! All chances used — your mythic guardian is sealed!`;
            }

            // Update button and counter UI
            updateChancesUI(chances);

            // Smooth scroll into view
            creatureResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            console.error("Creature generation failed:", error);
            if (statusMessage) {
                statusMessage.textContent =
                    "Something went wrong while awakening your creature. Please try again.";
            }
        }
    });

    // Handle form submit (Personalize button)
    participantForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!selectedCreature) {
            statusMessage.textContent =
                "Please awaken a creature before personalizing your card.";
            return;
        }

        const participantName = participantNameInput.value.trim() || "Legend";
        const collegeName = collegeNameInput.value.trim() || "AstraKsh Realm";

        localStorage.setItem(STORAGE_KEY_NAME, participantName);
        localStorage.setItem(STORAGE_KEY_COLLEGE, collegeName);

        renderCreatureCard(selectedCreature, {
            name: participantName,
            college: collegeName
        });

        if (downloadActions) downloadActions.hidden = false;

        statusMessage.innerHTML =
            `✦ Card personalized for <strong>${participantName}</strong>! Ready to download.`;

        downloadButton?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    // Download the personalized card as a PNG
    downloadButton?.addEventListener("click", async () => {
        if (!selectedCreature) {
            statusMessage.textContent =
                "Awaken a creature before downloading your card.";
            return;
        }

        try {
            await downloadCreatureCard();
        } catch (error) {
            console.error("Card download failed:", error);
            statusMessage.textContent =
                "Unable to download your card. Please try again.";
        }
    });

    // Initialize state on page load (handles browser refresh)
    (function initializeState() {
        // Restore name and college if previously entered
        const savedName = localStorage.getItem(STORAGE_KEY_NAME);
        if (savedName && participantNameInput) {
            participantNameInput.value = savedName;
        }

        const savedCollege = localStorage.getItem(STORAGE_KEY_COLLEGE);
        if (savedCollege && collegeNameInput) {
            collegeNameInput.value = savedCollege;
        }

        const chances = getRemainingChances();

        // Restore previously generated creature if page refreshed
        const savedCreatureJson = localStorage.getItem(STORAGE_KEY_CREATURE);
        if (savedCreatureJson) {
            try {
                selectedCreature = JSON.parse(savedCreatureJson);
                const currentName = participantNameInput?.value.trim() || "Your Name";
                const currentCollege = collegeNameInput?.value.trim() || "Your College";

                renderCreatureCard(selectedCreature, {
                    name: currentName,
                    college: currentCollege
                });

                creatureResult.hidden = false;
                personalizeSection.hidden = false;
                if (downloadActions) downloadActions.hidden = false;

                const tierRarity = selectedCreature.rarity || selectedCreature.tierName;
                if (chances > 0) {
                    statusMessage.innerHTML =
                        `✦ Your active guardian is <strong>${selectedCreature.name}</strong> (${tierRarity}). ${chances} chance${chances === 1 ? '' : 's'} remaining.`;
                } else {
                    statusMessage.innerHTML =
                        `✦ Your final guardian is <strong>${selectedCreature.name}</strong> (${tierRarity}). All 3 chances have been used.`;
                }
            } catch (err) {
                console.warn("Could not restore saved creature:", err);
            }
        }

        // Sync UI with current chances
        updateChancesUI(chances);
    })();
});

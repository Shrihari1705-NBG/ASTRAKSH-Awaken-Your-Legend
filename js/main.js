
/* =========================================
   ASTRAKSH — MAIN APPLICATION CONTROLLER
   With 3-Roll Chance Constraint & Form Validation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Check for ?reset or ?clear in URL (e.g. http://localhost:8080/?reset)
    if (new URLSearchParams(window.location.search).has("reset") || new URLSearchParams(window.location.search).has("clear")) {
        localStorage.clear();
        window.location.replace(window.location.pathname);
        return;
    }

    const MAX_CHANCES = 3;
    const STORAGE_KEY_CHANCES = "astraksh_chances_remaining";
    const STORAGE_KEY_CREATURE = "astraksh_saved_creature";
    const STORAGE_KEY_NAME = "astraksh_participant_name";
    const STORAGE_KEY_COLLEGE = "astraksh_participant_college";
    const STORAGE_KEY_COLLECTION = "astraksh_card_collection";
    const STORAGE_KEY_ACTIVE_INDEX = "astraksh_active_card_index";

    const generateButton = document.querySelector("#generate-btn");
    const statusMessage = document.querySelector("#status-message");
    const chancesCount = document.querySelector("#chances-count");

    const creatureResult = document.querySelector("#creature-result");
    const personalizeSection = document.querySelector("#personalize");

    const participantNameInput = document.querySelector("#participant-name");
    const collegeNameInput = document.querySelector("#college-name");

    const downloadActions = document.querySelector("#download-actions");
    const downloadButton = document.querySelector("#download-btn");
    const downloadPreviewNote = document.querySelector(".download-card-preview-note");

    // Collection UI elements
    const collectionBar = document.querySelector("#collection-bar");
    const collectionCount = document.querySelector("#collection-count");
    const collectionGrid = document.querySelector("#collection-grid");


    let selectedCreature = null;
    let isAwakening = false;
    let cardCollection = [];
    let activeCollectionIndex = 0;

    /**
     * Preloads core images and manages the initial page loading screen.
     */
    function initPageLoader() {
        const pageLoader = document.querySelector("#page-loader");
        const loaderProgressBar = document.querySelector("#loader-progress-bar");
        const loaderPercent = document.querySelector("#loader-percent");
        const loaderStatusText = document.querySelector("#loader-status-text");

        if (!pageLoader) return;

        // Collect essential assets to preload
        const coreAssets = [
            "./Assets/Other Assets/Background.png",
            "./Assets/Other Assets/Logo.png",
            "./Assets/Other Assets/TSS_Logo.png"
        ];

        // Include all 9 creature images from the database
        if (typeof CREATURES !== "undefined" && Array.isArray(CREATURES)) {
            CREATURES.forEach(c => {
                if (c.image && !coreAssets.includes(c.image)) {
                    coreAssets.push(c.image);
                }
            });
        }

        const totalAssets = coreAssets.length;
        let loadedCount = 0;
        const startTime = Date.now();
        const MIN_DISPLAY_TIME_MS = 1400;

        const statusPhrases = [
            "Aligning Celestial Astras...",
            "Drawing Ancient Energy...",
            "Awakening Creature Realms...",
            "Preparing the Sacred Altar...",
            "Enter AstraKsh."
        ];

        let isCompleted = false;
        function completeLoading() {
            if (isCompleted) return;
            isCompleted = true;

            const elapsed = Date.now() - startTime;
            const remainingWait = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed);

            setTimeout(() => {
                if (loaderProgressBar) loaderProgressBar.style.width = "100%";
                if (loaderPercent) loaderPercent.textContent = "100%";
                if (loaderStatusText) loaderStatusText.textContent = "Realms Aligned. Enter AstraKsh.";

                setTimeout(() => {
                    pageLoader.classList.add("loader-hidden");
                    setTimeout(() => {
                        pageLoader.remove();
                    }, 480);
                }, 280);
            }, remainingWait);
        }

        function updateProgress() {
            loadedCount++;
            const rawProgress = (loadedCount / totalAssets) * 100;
            const progress = Math.min(100, Math.round(rawProgress));

            if (loaderProgressBar) {
                loaderProgressBar.style.width = `${progress}%`;
            }
            if (loaderPercent) {
                loaderPercent.textContent = `${progress}%`;
            }

            if (loaderStatusText) {
                const phraseIndex = Math.min(
                    statusPhrases.length - 1,
                    Math.floor((progress / 100) * statusPhrases.length)
                );
                loaderStatusText.textContent = statusPhrases[phraseIndex];
            }

            if (loadedCount >= totalAssets) {
                completeLoading();
            }
        }

        // Start preloading images
        coreAssets.forEach(src => {
            const img = new Image();
            img.onload = updateProgress;
            img.onerror = updateProgress;
            img.src = src;
        });

        // Safety fallback: dismiss after 4.5s max
        setTimeout(completeLoading, 4500);
    }

    // Launch page preloader
    initPageLoader();

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
     * Validates that both participant name and college are filled.
     * Toggles the download button enabled/disabled state accordingly.
     */
    function validateParticipantDetails() {
        const name = participantNameInput?.value.trim() || "";
        const college = collegeNameInput?.value.trim() || "";
        const isComplete = name.length > 0 && college.length > 0;

        if (downloadButton) {
            if (!isComplete) {
                downloadButton.disabled = true;
                downloadButton.innerHTML =
                    '<span class="download-icon" aria-hidden="true">🔒</span><span>Enter Details to Download</span>';
                if (downloadPreviewNote) {
                    downloadPreviewNote.innerHTML =
                        '<span style="color: var(--color-primary-light);">✍ Enter your name & college above to unlock card download</span>';
                }
            } else {
                downloadButton.disabled = false;
                downloadButton.innerHTML =
                    '<span class="download-icon" aria-hidden="true">📥</span><span>Download My Card</span>';
                if (downloadPreviewNote) {
                    downloadPreviewNote.innerHTML =
                        '<span>✨ Ready to save your high-resolution card</span>';
                }
            }
        }

        return isComplete;
    }

    /**
     * Updates the UI elements reflecting chances left.
     */
    function updateChancesUI(chances) {
        if (chancesCount) {
            chancesCount.textContent = `${chances}/${MAX_CHANCES}`;
        }

        // Update pip indicators cleanly without invalid selector calls
        for (let i = 1; i <= MAX_CHANCES; i++) {
            const pip = document.querySelector(`#pip-${i}`);
            if (pip) {
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
                    '✦ All 3 chances used! Inscribe your details below and download your card.';
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

        // Update front face owner info
        document.querySelectorAll(".creature-card__owner-name").forEach(el => el.textContent = name);
        document.querySelectorAll(".creature-card__owner-college").forEach(el => el.textContent = college);

        // Update back face owner info
        document.querySelectorAll(".card-back__owner-name").forEach(el => el.textContent = name);
        document.querySelectorAll(".card-back__owner-college").forEach(el => el.textContent = college);
    }

    // Live update and save participant info while typing
    participantNameInput?.addEventListener("input", () => {
        updateCardIdentity();
        localStorage.setItem(STORAGE_KEY_NAME, participantNameInput.value);
        validateParticipantDetails();
    });

    collegeNameInput?.addEventListener("input", () => {
        updateCardIdentity();
        localStorage.setItem(STORAGE_KEY_COLLEGE, collegeNameInput.value);
        validateParticipantDetails();
    });


    /**
     * Persists the collection and current active index to localStorage.
     */
    function saveCollectionState() {
        localStorage.setItem(STORAGE_KEY_COLLECTION, JSON.stringify(cardCollection));
        localStorage.setItem(STORAGE_KEY_ACTIVE_INDEX, activeCollectionIndex);
        if (cardCollection[activeCollectionIndex]) {
            localStorage.setItem(
                STORAGE_KEY_CREATURE,
                JSON.stringify(cardCollection[activeCollectionIndex].creature)
            );
        }
    }

    /**
     * Sets the currently active card from the collection and re-renders the card and controls.
     */
    function setActiveCard(index) {
        if (index < 0 || index >= cardCollection.length) return;
        activeCollectionIndex = index;
        const currentRecord = cardCollection[index];
        selectedCreature = currentRecord.creature;

        saveCollectionState();

        const currentName = participantNameInput?.value.trim() || "Your Name";
        const currentCollege = collegeNameInput?.value.trim() || "Your College";

        renderCreatureCard(selectedCreature, {
            name: currentName,
            college: currentCollege
        });

        renderCollectionGallery();
        validateParticipantDetails();
    }

    /**
     * Downloads a specific card from the collection.
     */
    async function downloadSpecificCard(index) {
        if (!validateParticipantDetails()) {
            if (participantNameInput && !participantNameInput.value.trim()) {
                participantNameInput.focus();
            } else if (collegeNameInput) {
                collegeNameInput.focus();
            }
            return;
        }

        if (index !== activeCollectionIndex) {
            setActiveCard(index);
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        await downloadCreatureCard();
    }

    /**
     * Renders the interactive Awakened Collection gallery.
     */
    function renderCollectionGallery() {
        if (!collectionBar || !collectionGrid) return;

        if (cardCollection.length === 0) {
            collectionBar.hidden = true;
            return;
        }

        collectionBar.hidden = false;
        if (collectionCount) {
            collectionCount.textContent = `${cardCollection.length} / ${MAX_CHANCES} Awakened`;
        }

        collectionGrid.innerHTML = "";

        cardCollection.forEach((card, idx) => {
            const item = document.createElement("div");
            item.className = `collection-item${idx === activeCollectionIndex ? " is-active" : ""}`;
            item.setAttribute("data-index", idx);

            const thumbSrc = card.creature.image;
            const tierLower = (card.creature.tier || "prakriti").toLowerCase();

            item.innerHTML = `
                ${idx === activeCollectionIndex ? '<span class="collection-item__active-tag">Active</span>' : ''}
                <img src="${thumbSrc}" alt="${card.creature.name}" class="collection-item__thumb">
                <span class="collection-item__name">${card.creature.name}</span>
                <span class="collection-item__tier" data-tier="${tierLower}">${card.creature.rarity || card.creature.tierName}</span>
                <div class="collection-item__actions">
                    <button type="button" class="collection-mini-btn collection-view-btn" data-index="${idx}">
                        👁️ View
                    </button>
                    <button type="button" class="collection-mini-btn collection-download-btn" data-index="${idx}">
                        📥 Save
                    </button>
                </div>
            `;

            // Clicking card body or view button switches active card
            item.addEventListener("click", (e) => {
                if (e.target.closest(".collection-download-btn")) {
                    e.stopPropagation();
                    downloadSpecificCard(idx);
                } else {
                    setActiveCard(idx);
                    const cardContainer = document.querySelector("#creature-card-container");
                    if (cardContainer) {
                        cardContainer.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            });

            collectionGrid.appendChild(item);
        });
    }

    /**
     * Resets the entire card collection, restores all awakening chances,
     * clears participant inputs, and purges all persisted card data.
     */
    function resetAllStats(showConfirm = false) {
        if (showConfirm && !confirm("Are you sure you want to reset your card collection and restore all 3 awakening chances?")) {
            return;
        }

        localStorage.removeItem(STORAGE_KEY_CHANCES);
        localStorage.removeItem(STORAGE_KEY_CREATURE);
        localStorage.removeItem(STORAGE_KEY_COLLECTION);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_INDEX);
        localStorage.removeItem(STORAGE_KEY_NAME);
        localStorage.removeItem(STORAGE_KEY_COLLEGE);

        cardCollection = [];
        activeCollectionIndex = 0;
        selectedCreature = null;

        if (participantNameInput) participantNameInput.value = "";
        if (collegeNameInput) collegeNameInput.value = "";

        if (creatureResult) creatureResult.hidden = true;
        if (personalizeSection) personalizeSection.hidden = true;
        if (downloadActions) downloadActions.hidden = true;
        if (collectionBar) collectionBar.hidden = true;

        const cardContainer = document.querySelector("#creature-card-container");
        if (cardContainer) cardContainer.innerHTML = "";

        updateChancesUI(MAX_CHANCES);

        if (statusMessage) {
            statusMessage.innerHTML = "✦ Card collection reset. All 3 chances restored! Your journey begins anew.";
        }

        validateParticipantDetails();
    }



    // Expose quick reset functions on window for console use
    window.resetAllStats = () => resetAllStats(false);
    window.resetChances = () => resetAllStats(false);
    window.resetAstraKsh = () => {
        localStorage.clear();
        window.location.reload();
    };


    /**
     * Renders the sealed mythic mystery card inside #creature-card-container during awakening.
     */
    function renderMysteryCard() {
        const container = document.querySelector("#creature-card-container");
        if (!container) return;

        container.innerHTML = `
            <article class="creature-card mystery-card" data-tier="divya">
                <div class="creature-card__frame">
                    <header class="creature-card__header">
                        <span class="creature-card__brand">ASTRAKSH</span>
                        <span class="creature-card__rarity mystery-pulse-badge">✦ AWAKENING ✦</span>
                    </header>

                    <h3 class="creature-card__name mystery-title">
                        <span id="mystery-card-name">Drawing Astral Form...</span>
                    </h3>

                    <div class="creature-card__artwork mystery-artwork">
                        <div class="mystery-vortex">
                            <div class="mystery-chakra chakra-outer"></div>
                            <div class="mystery-chakra chakra-mid"></div>
                            <div class="mystery-chakra chakra-inner"></div>
                            <div class="mystery-glyph">✦</div>
                        </div>
                        <div class="mystery-scan-line"></div>
                    </div>

                    <p class="creature-card__type mystery-type">
                        <span class="type-gem" aria-hidden="true">✦</span>
                        <span id="mystery-realm-text">Connecting to Celestial Plane</span>
                        <span class="type-gem" aria-hidden="true">✦</span>
                    </p>

                    <section class="creature-card__owner mystery-owner">
                        <div class="creature-card__owner-body">
                            <div class="creature-card__owner-info">
                                <p class="creature-card__owner-label">Awakening Sequence</p>
                                <p class="mystery-subtext" id="mystery-subtext">Aligning ancient astral energies...</p>
                            </div>
                            <div class="creature-card__owner-badge">
                                <img class="creature-card__tss-logo" src="./Assets/Other Assets/TSS_Logo.png" alt="TSS Logo">
                            </div>
                        </div>
                        <div class="mystery-bar-track">
                            <div class="mystery-bar-fill"></div>
                        </div>
                    </section>

                    <footer class="creature-card__footer">
                        <span>AWAKEN YOUR LEGEND</span>
                        <span class="creature-card__number">AK-???</span>
                    </footer>
                </div>
            </article>
        `;
    }

    // Handle creature awakening with celestial summoning ritual & image preloading
    generateButton?.addEventListener("click", async () => {
        if (isAwakening) return;

        let chances = getRemainingChances();

        if (chances <= 0) {
            updateChancesUI(0);
            if (statusMessage) {
                statusMessage.innerHTML = '✦ You have exhausted all 3 chances!';
            }
            return;
        }

        isAwakening = true;

        try {
            // Select candidate creature
            const candidateCreature = generateRandomCreature();

            // Set button to channeling state
            generateButton.disabled = true;
            generateButton.innerHTML =
                '<span class="spinner" aria-hidden="true">✧</span> <span>Awakening Guardian...</span>';

            // Altar disc enters overdrive spinning
            const altarDisc = document.querySelector(".altar-disc");
            if (altarDisc) altarDisc.classList.add("is-summoning");

            // Hide personalization section during summon
            personalizeSection.hidden = true;

            // Render sealed mystery card directly in the card frame
            renderMysteryCard();
            creatureResult.hidden = false;

            // Smooth scroll to the mystery card
            creatureResult.scrollIntoView({ behavior: "smooth", block: "center" });

            if (statusMessage) {
                statusMessage.innerHTML = '✦ Channeling cosmic energy from the celestial realms...';
            }

            // Preload the candidate creature image explicitly into browser cache
            const imagePreloadPromise = new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = candidateCreature.image;
                if (img.complete) resolve();
            });

            // Dynamic chanting updates inside the card
            const timer1 = setTimeout(() => {
                if (isAwakening) {
                    const mysteryCardName = document.querySelector("#mystery-card-name");
                    const mysteryRealmText = document.querySelector("#mystery-realm-text");
                    const mysterySubtext = document.querySelector("#mystery-subtext");
                    if (mysteryCardName) mysteryCardName.textContent = "Resonating Realm...";
                    if (mysteryRealmText) mysteryRealmText.textContent = `${candidateCreature.tierName} Realm Affinity`;
                    if (mysterySubtext) mysterySubtext.textContent = `Channeling ${candidateCreature.rarity} tier vibrational power...`;
                }
            }, 750);

            const timer2 = setTimeout(() => {
                if (isAwakening) {
                    const mysteryCardName = document.querySelector("#mystery-card-name");
                    const mysterySubtext = document.querySelector("#mystery-subtext");
                    if (mysteryCardName) mysteryCardName.textContent = `Awakening ${candidateCreature.name}...`;
                    if (mysterySubtext) mysterySubtext.textContent = "Forging divine soul into physical collectible card...";
                }
            }, 1550);

            // Wait ~2.3 seconds AND ensure creature image is fully preloaded
            const minRitualDuration = new Promise(resolve => setTimeout(resolve, 2300));
            await Promise.all([imagePreloadPromise, minRitualDuration]);

            clearTimeout(timer1);
            clearTimeout(timer2);

            // Golden celestial flash burst on the mystery card
            const mysteryCardEl = document.querySelector(".mystery-card");
            if (mysteryCardEl) {
                mysteryCardEl.classList.add("card-burst-reveal");
            }
            await new Promise(resolve => setTimeout(resolve, 280));

            // Deduct chance
            chances -= 1;
            localStorage.setItem(STORAGE_KEY_CHANCES, chances);

            // Add new card to the collection
            const newRecord = {
                id: "card_" + Date.now(),
                creature: candidateCreature,
                awakenedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            cardCollection.push(newRecord);
            activeCollectionIndex = cardCollection.length - 1;
            selectedCreature = candidateCreature;

            saveCollectionState();

            // Set active card view
            setActiveCard(activeCollectionIndex);

            if (altarDisc) {
                altarDisc.classList.remove("is-summoning");
            }

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
                    `✦ Awakened <strong>${selectedCreature.name}</strong> (${tierRarity})! All 3 chances used — your mythic guardian is sealed!`;
            }

            // Update button and counter UI
            updateChancesUI(chances);

            // Validate details to set download button state
            validateParticipantDetails();

            // Smooth scroll into view
            creatureResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            console.error("Creature awakening failed:", error);
            if (statusMessage) {
                statusMessage.textContent =
                    "Something went wrong while awakening your creature. Please try again.";
            }
            const altarDisc = document.querySelector(".altar-disc");
            if (altarDisc) altarDisc.classList.remove("is-summoning");
            updateChancesUI(getRemainingChances());
        } finally {
            isAwakening = false;
        }
    });

    // Download the currently active personalized card as a PNG
    downloadButton?.addEventListener("click", async () => {
        if (!selectedCreature) {
            if (statusMessage) {
                statusMessage.textContent = "Awaken a creature before downloading your card.";
            }
            return;
        }

        if (!validateParticipantDetails()) {
            if (participantNameInput && !participantNameInput.value.trim()) {
                participantNameInput.focus();
            } else if (collegeNameInput) {
                collegeNameInput.focus();
            }
            return;
        }

        try {
            await downloadCreatureCard();
        } catch (error) {
            console.error("Card download failed:", error);
            if (statusMessage) {
                statusMessage.textContent = "Unable to download your card. Please try again.";
            }
        }
    });

    // Initialize state on page load (handles browser refresh)
    (function initializeState() {
        // Auto-reset when schema/state reset is requested
        const STORAGE_VERSION_KEY = "astraksh_data_version";
        const CURRENT_STORAGE_VERSION = "2026.2";

        if (localStorage.getItem(STORAGE_VERSION_KEY) !== CURRENT_STORAGE_VERSION) {
            localStorage.clear();
            localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        }

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

        // Restore card collection from localStorage
        const savedCollectionJson = localStorage.getItem(STORAGE_KEY_COLLECTION);
        if (savedCollectionJson) {
            try {
                cardCollection = JSON.parse(savedCollectionJson);
                const savedIndex = parseInt(localStorage.getItem(STORAGE_KEY_ACTIVE_INDEX) || "0", 10);
                activeCollectionIndex = (savedIndex >= 0 && savedIndex < cardCollection.length) ? savedIndex : 0;
            } catch (err) {
                console.warn("Could not parse saved collection:", err);
                cardCollection = [];
            }
        }

        // Migrate legacy single saved creature if present and collection empty
        if (cardCollection.length === 0) {
            const legacyCreatureJson = localStorage.getItem(STORAGE_KEY_CREATURE);
            if (legacyCreatureJson) {
                try {
                    const legacyCreature = JSON.parse(legacyCreatureJson);
                    cardCollection = [{
                        id: "card_legacy",
                        creature: legacyCreature,
                        awakenedAt: "Saved"
                    }];
                    activeCollectionIndex = 0;
                    saveCollectionState();
                } catch (err) {
                    console.warn("Could not parse legacy creature:", err);
                }
            }
        }

        // If collection has cards, render active card & gallery
        if (cardCollection.length > 0) {
            creatureResult.hidden = false;
            personalizeSection.hidden = false;
            if (downloadActions) downloadActions.hidden = false;

            setActiveCard(activeCollectionIndex);

            const activeCard = cardCollection[activeCollectionIndex];
            const tierRarity = activeCard.creature.rarity || activeCard.creature.tierName;
            if (chances > 0) {
                statusMessage.innerHTML =
                    `✦ Active guardian: <strong>${activeCard.creature.name}</strong> (${tierRarity}). ${chances} chance${chances === 1 ? '' : 's'} remaining.`;
            } else {
                statusMessage.innerHTML =
                    `✦ Active guardian: <strong>${activeCard.creature.name}</strong> (${tierRarity}). All 3 chances have been used.`;
            }
        }

        // Sync UI with current chances
        updateChancesUI(chances);

        // Validate participant details to ensure download button is appropriately locked
        validateParticipantDetails();
    })();
});

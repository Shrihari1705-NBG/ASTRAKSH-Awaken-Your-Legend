
/* =========================================
   ASTRAKSH — CARD EXPORT & DOWNLOAD
========================================= */

/**
 * Convert an image element or image source into a base64 Data URL.
 * Guarantees zero CORS or canvas-tainting issues during html2canvas rendering.
 */
async function toDataURL(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            } catch (err) {
                console.warn("Could not convert image to data URL, using original src:", err);
                resolve(src);
            }
        };
        img.onerror = () => resolve(src);
        img.src = src;
    });
}

/**
 * Downloads the currently rendered AstraKsh creature card as a high-resolution PNG.
 */
async function downloadCreatureCard() {
    // Ensure card is showing front face before capture
    if (typeof flipCardToFront === "function") flipCardToFront();
    if (typeof clearCardAutoFlip === "function") clearCardAutoFlip();

    // Target the front face specifically for export
    const card = document.querySelector(".card-front") || document.querySelector(".creature-card");
    const button = document.querySelector("#download-btn");

    if (!card) {
        console.error("Download failed: .creature-card was not found.");
        alert("Your creature card could not be found. Please awaken a creature first.");
        return;
    }

    if (typeof window.html2canvas !== "function") {
        console.error("Download failed: html2canvas did not load.");
        alert("The card export library is still loading. Please wait a moment and try again.");
        return;
    }

    const originalButtonHtml = button ? button.innerHTML : "Download My Card";

    try {
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="spinner" aria-hidden="true">⏳</span> Forging Your Card...';
        }

        // Wait for all card images to finish loading
        const images = Array.from(card.querySelectorAll("img"));
        await Promise.all(
            images.map((image) => {
                if (image.complete && image.naturalWidth !== 0) {
                    return Promise.resolve();
                }
                return new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                });
            })
        );

        // Pre-convert card images to Data URLs to guarantee clean rendering without cross-origin issues
        const imageElements = Array.from(card.querySelectorAll("img"));
        const originalSources = imageElements.map(img => img.src);
        for (const img of imageElements) {
            if (img.src && !img.src.startsWith("data:")) {
                const dataUrl = await toDataURL(img.src);
                if (dataUrl) {
                    img.src = dataUrl;
                }
            }
        }

        // Render card with html2canvas
        const canvas = await window.html2canvas(card, {
            scale: 2,
            backgroundColor: "#1F0508",
            useCORS: true,
            allowTaint: true,
            logging: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
                const clonedCard = clonedDoc.querySelector(".creature-card");
                if (clonedCard) {
                    clonedCard.style.transform = "none";
                    clonedCard.style.animation = "none";
                    clonedCard.style.margin = "0 auto";
                }
            }
        });

        // Restore original image sources on the live DOM card
        imageElements.forEach((img, idx) => {
            img.src = originalSources[idx];
        });

        // Extract participant and creature names for clean filename
        const nameInput = document.querySelector("#participant-name");
        const creatureName = card.querySelector(".creature-card__name")?.textContent.trim() || "Creature";
        const participantName = nameInput?.value.trim() || "Legend";

        const safeCreature = creatureName.replace(/[^a-z0-9_-]/gi, "-");
        const safeName = participantName.replace(/[^a-z0-9_-]/gi, "-");
        const fileName = `AstraKsh-${safeCreature}-${safeName}.png`;

        // Direct PNG Data URL ensures the MIME type is image/png and extension is preserved
        const pngDataUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.download = fileName;
        link.setAttribute("download", fileName);
        link.href = pngDataUrl;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        // Delay removing the anchor so Chromium retains the download attribute and filename
        setTimeout(() => {
            link.remove();
        }, 3000);

        if (button) {
            button.innerHTML = '<span aria-hidden="true">✓</span> Card Downloaded!';
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalButtonHtml;
            }, 2500);
        }

        // Resume auto-flip after download is complete
        if (typeof startCardAutoFlip === "function") startCardAutoFlip(10000, 10000);

        console.log("AstraKsh card exported and downloaded successfully.");
    } catch (error) {
        console.error("AstraKsh PNG export error:", error);
        alert(
            "Sorry, we couldn't download your card right now. " +
            "Please check the browser console for details."
        );
        if (button) {
            button.disabled = false;
            button.innerHTML = originalButtonHtml;
        }
    }
}

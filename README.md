
<div align="center">

<img src="./Assets/Other Assets/Logo.png" alt="AstraKsh — Awaken Your Legend" width="720">

# ASTRAKSH
### Awaken Your Legend

**An Interactive Experience for HackFusion 2.0**

*An Indian myth-inspired universe of extraordinary creatures, ancient inspirations, and collectible legends.*

[About AstraKsh](#-about-astraksh) · [How It Works](#-how-it-works) · [Getting Started](#-getting-started)

![HackFusion 2.0](https://img.shields.io/badge/Event-HackFusion%202.0-8B1E24?style=for-the-badge)
![Creature Discovery](https://img.shields.io/badge/Experience-Creature%20Discovery-D9A441?style=for-the-badge)
![Collectible Cards](https://img.shields.io/badge/Feature-Collectible%20Cards-7652C7?style=for-the-badge)

</div>

---

## ✦ About AstraKsh

**AstraKsh — Awaken Your Legend** is an interactive creature-discovery experience created for **HackFusion 2.0**.

Enter a myth-inspired universe where every participant can discover an original mythical creature, explore its unique abilities, and claim a personalized digital collectible card.

Inspired by Indian mythology, folklore, nature guardians, epic battles, celestial forces, and cosmic symbolism, AstraKsh transforms event participation into a memorable digital experience.

> **Discover your creature. Claim your card. Share your legend.**

The creatures are original fantasy creations inspired by Indian cultural and mythological motifs, rather than direct depictions of revered deities.

## ⚔️ The Three Realms of Power

Every creature belongs to one of three realms, each with its own rarity and identity.

| Realm | Rarity | Probability | Description |
|:---|:---|:---:|:---|
| 🌿 **Prakriti** | Common | **60%** | Guardians of forests, rivers, nature, and the elements. |
| 🛡️ **Veer** | Rare | **30%** | Powerful beings inspired by legendary quests and epic battles. |
| ✨ **Divya** | Legendary | **10%** | Extraordinary creatures inspired by celestial forces and cosmic legends. |

The generator first selects a realm according to the configured probabilities, then randomly chooses a creature from that realm.

> **Note:** These probabilities are implemented in frontend JavaScript. The current system is designed for an interactive event experience and is not a tamper-proof reward or lottery system.

## 🐉 How It Works

The participant journey is simple:

1. **Enter the universe** — open AstraKsh through the event website or QR code.
2. **Awaken your creature** — generate a random creature from one of the three realms.
3. **Discover its powers** — explore the creature's artwork, rarity, special ability, and inspiration.
4. **Claim your identity** — enter your name and college.
5. **Forge your collectible** — personalize the creature card with your details.
6. **Download and share** — export your personalized card as a PNG image.

Each participant can take their own piece of the AstraKsh universe beyond HackFusion 2.0.

## 🪄 Meet the Creatures

The current roster features nine original creatures inspired by Indian mythology and folklore.

| Creature | Realm | Inspiration |
|:---|:---|:---|
| **Vanaketu** | Prakriti | Forest guardians and nature protection |
| **Setuka** | Prakriti | Legendary bridge-building imagery |
| **Jalnaga** | Prakriti | Naga traditions and sacred water |
| **Marutika** | Prakriti | Wind, storms, and monsoon folklore |
| **Gandhivak** | Veer | The legendary bow Gandiva |
| **Rathaveg** | Veer | The grandeur and speed of epic chariots |
| **Vyuhraksh** | Veer | The Chakravyuha battle formation |
| **Astrajyot** | Divya | Celestial astras and radiant protection |
| **Anantya** | Divya | Infinity and cosmic cycles associated with Ananta |

Each creature has its own artwork, ability, description, inspiration, rarity, and collectible card number.

## 🎴 Collectible Card Features

- Original creature artwork.
- Three rarity tiers with distinct visual identities.
- Creature name, special ability, and description.
- Mythological inspiration.
- Personalized participant name and college.
- PNG card export for social media sharing.
- Responsive interface for desktop and mobile browsers.

## 🎨 Visual Identity

AstraKsh follows a dark, cinematic mythic-fantasy aesthetic inspired by the atmosphere of HackFusion 2.0.

| Color | Hex Code | Purpose |
|:---|:---|:---|
| Midnight Indigo | `#101426` | Primary background |
| Antique Gold | `#D9A441` | Highlights and buttons |
| Electric Cyan | `#35D9E8` | Magical accents |
| Royal Violet | `#7652C7` | Cosmic accents |
| Ivory | `#F5F0E8` | Primary text |
| Slate Blue | `#AAB6D0` | Secondary text |
| Prakriti Green | `#39865B` | Common tier |
| Veer Blue | `#397BCE` | Rare tier |
| Divya Violet | `#A45BD7` | Legendary tier |

The design combines ornate mythological imagery, crimson-and-gold accents, dramatic backgrounds, and modern typography.

## 🧰 Tech Stack

- **HTML5** — website structure.
- **CSS3** — layouts, responsive styling, colors, and animations.
- **Vanilla JavaScript** — creature generation, card rendering, and form interactions.
- **html2canvas** — client-side rendering of the card for PNG export.
- **Google Fonts** — Cinzel and Rajdhani.

AstraKsh currently operates as a frontend application. Creature selection, participant personalization, and card generation run in the browser. A backend or database is not required for the current workflow.

## 📁 Project Structure

```text
Participants-ID-card/
├── index.html
├── creatures.md
├── Assets/
│   ├── Other Assets/
│   │   └── Logo.png
│   ├── Tier 1/
│   ├── Tier 2/
│   └── Tier 3/
├── css/
│   ├── animations.css
│   ├── cards.css
│   └── styles.css
└── js/
    ├── card.js
    ├── creatures.js
    ├── download.js
    ├── generator.js
    ├── html2canvas.min.js
    └── main.js
```

### File Responsibilities

| File | Purpose |
|:---|:---|
| `index.html` | Main page structure, UI elements, and script loading |
| `Assets/Other Assets/Logo.png` | AstraKsh branding and logo |
| `Assets/Tier 1/` | Prakriti creature artwork |
| `Assets/Tier 2/` | Veer creature artwork |
| `Assets/Tier 3/` | Divya creature artwork |
| `css/styles.css` | Global styles, layout, and responsive design |
| `css/cards.css` | Collectible card appearance |
| `css/animations.css` | Animations and visual effects |
| `js/creatures.js` | Creature information and artwork paths |
| `js/generator.js` | Random realm and creature selection |
| `js/card.js` | Card rendering and participant personalization |
| `js/download.js` | PNG export functionality |
| `js/html2canvas.min.js` | Locally stored HTML-to-canvas library |
| `js/main.js` | Connects the UI, form, generator, and download actions |
| `creatures.md` | Supporting creature and tier documentation |

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- [Visual Studio Code](https://code.visualstudio.com/).
- The Live Server extension, or another local static web server.

### Run the Project Locally

1. Clone or download the repository.
2. Open the `Participants-ID-card` folder in Visual Studio Code.
3. Confirm that the `Assets`, `css`, and `js` folders are present.
4. Launch `index.html` using **Live Server**.
5. Click **Awaken Your Creature** to generate a creature.
6. Enter your name and college.
7. Personalize the card and test the PNG download.

Ensure that the artwork paths in `js/creatures.js` match the actual asset filenames and folder names. Use a local server instead of opening the HTML file directly.

### PNG Export

AstraKsh uses html2canvas to render the collectible card as a PNG.

The library is stored locally at `js/html2canvas.min.js`. Confirm that `index.html` references this file using the correct relative path and that it loads before `js/download.js` executes.

If exporting fails, inspect the browser console. Some modern CSS color functions may require compatible fallback styles for the export renderer.

## 🔭 Future Scope

Potential improvements include:

- Backend support for persistent creature claims.
- Unique participant IDs and QR-based entry.
- A database for creature ownership and event analytics.
- A public **Wall of Legends** displaying claimed creatures.
- Improved mobile export and social media sharing.
- Additional creatures, abilities, artwork, and collectible variations.

These are possible future enhancements, not features claimed to be implemented in the current version.

## 🤝 Contributing

Want to improve AstraKsh?

1. Preserve the existing visual identity and rarity system.
2. Use original creature concepts and appropriate artwork.
3. Update creature data and verify all asset paths.
4. Test generation, personalization, and PNG export after making changes.
5. Keep the experience responsive and accessible.

## 🏛️ Created for HackFusion 2.0

AstraKsh brings together mythology-inspired creativity, interactive web development, and personalized digital collectibles to create a distinctive event experience.

Every participant discovers a legend. Every card tells a story.

<div align="center">

### ✦ YOUR LEGEND AWAITS ✦

**ASTRAKSH — AWAKEN YOUR LEGEND**

*An interactive creature universe created for HackFusion 2.0.*

</div>

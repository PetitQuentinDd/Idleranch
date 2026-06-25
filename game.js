// game.js
let gameState = {
    money: 10000,
    eggCost: 5000,
    activeTeam: [],
    reserve: [],
    pension: [null, null],
    eggProgressMoney: 0,
    activeEggIncubation: null,
    items: {
        pierreEau: 0, pierreFeu: 0, pierreFoudre: 0, pierreLune: 0, pierrePlante: 0, pierreSoleil: 0,
        peauMetal: 0, rocheRoyale: 0, ecailleDraco: 0, bonbonSimple: 0, bonbonSuper: 0, bonbonMax: 0
    },
    discoveredPokemon: [],
    activeExpedition: null,
    claimedCodes: [],
    unlockedAchievements: [],
    earnedAchievements: [],
    areneCooldowns: {},
    lastSaveTime: Date.now()
};

let multiReleaseMode = false;
let selectedForRelease = [];
let combatInterval = null;
let itemSelectionneActuel = null;
let slotEnCoursDeSelection = null;




function showNotification(text) {
    let container = document.getElementById("game-container"); if (!container) return;
    let oldNotify = document.querySelector(".game-notification"); if (oldNotify) oldNotify.remove();
    let div = document.createElement("div"); div.className = "game-notification"; div.innerText = text;
    container.appendChild(div); setTimeout(() => { div.remove(); }, 4000);
}

function showNewPokemonModal(pokemonName, pokemonImage) {
    let ancienneModale = document.getElementById("new-pokemon-pokedex-modal");
    if (ancienneModale) ancienneModale.remove();

    let modal = document.createElement("div");
    modal.id = "new-pokemon-pokedex-modal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 5000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(3px);";

    let content = document.createElement("div");
    content.style.cssText = "background: #1e293b; width: 100%; max-width: 300px; border-radius: 12px; border: 3px solid #79eddf; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 0 20px rgba(121, 237, 223, 0.4); animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);";

    content.innerHTML = `
        <div style="font-size: 11px; font-weight: bold; color: #79eddf; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">✨ NOUVELLE ENTRÉE POKÉDEX ✨</div>
        <div style="font-size: 18px; font-weight: 800; color: white; margin-bottom: 15px;">${pokemonName}</div>
        <div style="background: #0f172a; width: 120px; height: 120px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid #334155; margin-bottom: 20px; padding: 10px; box-sizing: border-box;">
            <img src="${pokemonImage}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">
        </div>
        <button onclick="document.getElementById('new-pokemon-pokedex-modal').remove()" style="background: linear-gradient(135deg, #79eddf, #3b82f6); color: #0f172a; font-weight: bold; border: none; border-radius: 6px; padding: 8px 24px; font-size: 12px; cursor: pointer; text-transform: uppercase; width: 100%; transition: transform 0.1s;">Génial !</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
}

function toggleSac(show) {
    let modal = document.getElementById("poche-sac-modal"); if (modal) modal.style.display = show ? "flex" : "none";
}

function selectionnerObjetPourAction(itemId) {
    itemSelectionneActuel = itemId; toggleSac(false); openTab('tab-stock');
    showNotification(`🎒 Ciblez un Pokémon de la réserve pour lui appliquer ${ITEMS_CONFIG[itemId].name}`);
}

function appliquerObjetAuPokemon(reserveIndex, itemId) {
    let p = gameState.reserve[reserveIndex]; let config = ITEMS_CONFIG[itemId];
    if (!p || !config || gameState.items[itemId] <= 0) return;

    if (config.type === "candy") {
        p.incomePerMin = Math.round(p.incomePerMin * config.multiplier); gameState.items[itemId]--;
        showNotification(`🍬 ${p.name} mange un ${config.name} ! Ses bénéfices augmentent !`);
    }
    else if (config.type === "evolution") {
        if (p.name === "Évoli" || p.evolutionCondition === "special_eevee") {
            if (itemId === "pierreEau" || itemId === "pierreFeu" || itemId === "pierreFoudre") {
                gameState.items[itemId]--;
                let targetName = (itemId === "pierreEau") ? "Aquali" : (itemId === "pierreFeu") ? "Pyroli" : "Voltali";
                let evoData = POKEDEX.kanto.evolutions[targetName];
                if (evoData) {
                    p.name = evoData.name; p.image = evoData.image;
                    p.incomePerMin = p.isBaby ? Math.floor(evoData.incomePerMin * 1.25) : evoData.incomePerMin;
                    p.evolutionCondition = null; p.nextForm = null; p.itemNeeded = null; p.evolutionLevel = null;
                    discoverPokemon(evoData.name); showNotification(`✨ Évoli évolue en ${p.name} !`);
                }
            } else { showNotification("Cette pierre n'a aucun effet sur Évoli."); }
        }
        else {
            let localEvoConfig = POKEDEX.kanto.evolutions[p.name] || POKEDEX.johto.evolutions[p.name];
            if (localEvoConfig && localEvoConfig.evolutionCondition === "item" && localEvoConfig.itemNeeded === itemId) {
                let nextFormName = localEvoConfig.nextForm;
                let evoData = POKEDEX.kanto.evolutions[nextFormName] || POKEDEX.johto.evolutions[nextFormName];
                if (evoData) {
                    gameState.items[itemId]--;
                    p.name = evoData.name; p.image = evoData.image;
                    p.incomePerMin = p.isBaby ? Math.floor(evoData.incomePerMin * 1.25) : evoData.incomePerMin;
                    p.evolutionCondition = evoData.evolutionCondition || null; p.nextForm = evoData.nextForm || null;
                    p.itemNeeded = evoData.itemNeeded || null; p.evolutionLevel = evoData.evolutionLevel || null;
                    discoverPokemon(evoData.name); showNotification(`✨ Évolution réussie en ${p.name} !`);
                }
            } else if (p.evolutionCondition === "item" && p.itemNeeded === itemId) {
                let evoData = POKEDEX.kanto.evolutions[p.nextForm] || POKEDEX.johto.evolutions[p.nextForm];
                if (evoData) {
                    gameState.items[itemId]--;
                    p.name = evoData.name; p.image = evoData.image;
                    p.incomePerMin = p.isBaby ? Math.floor(evoData.incomePerMin * 1.25) : evoData.incomePerMin;
                    p.evolutionCondition = evoData.evolutionCondition || null; p.nextForm = evoData.nextForm || null;
                    p.itemNeeded = evoData.itemNeeded || null; p.evolutionLevel = evoData.evolutionLevel || null;
                    discoverPokemon(evoData.name); showNotification(`✨ Évolution réussie en ${p.name} !`);
                }
            } else { showNotification("Cet objet n'a aucun effet sur ce Pokémon."); }
        }
    }
    itemSelectionneActuel = null; saveGame(); updateUI();
}

function ouvrirSelectionPension(slotIndex) {
    if (gameState.reserve.length === 0) {
        showNotification("Vous n'avez aucun Pokémon dans votre réserve à placer !");
        return;
    }

    slotEnCoursDeSelection = slotIndex;

    let ancienneModale = document.getElementById("pension-selection-modal");
    if (ancienneModale) ancienneModale.remove();

    let modal = document.createElement("div");
    modal.id = "pension-selection-modal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3500; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;";

    let content = document.createElement("div");
    content.style.cssText = "background: #1e293b; width: 100%; max-width: 340px; border-radius: 8px; border: 2px solid #e11d48; display: flex; flex-direction: column; max-height: 80vh;";

    content.innerHTML = `
        <div style="background: #0f172a; padding: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
            <span style="font-weight: bold; color: white; font-size: 13px;">❤️ Placer un parent (Slot ${slotIndex + 1})</span>
            <button onclick="document.getElementById('pension-selection-modal').remove()" style="background: #ef4444; color: white; border: none; border-radius: 4px; width: 22px; height: 22px; font-weight: bold; cursor: pointer;">✕</button>
        </div>
        <div id="pension-choices-container" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; overflow-y: auto; background: #0b0f19; flex: 1;"></div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    let choicesContainer = document.getElementById("pension-choices-container");
    gameState.reserve.forEach((m, idx) => {
        let card = document.createElement("div");
        card.style.cssText = "background: #1a1f2c; border: 1px solid #4a5568; border-radius: 6px; padding: 6px; width: calc(33.33% - 6px); display: flex; flex-direction: column; align-items: center; cursor: pointer; text-align: center;";
        card.innerHTML = `
            <img src="${m.image}" style="width: 40px; height: 40px; object-fit: contain;">
            <div style="color: white; font-size: 9px; font-weight: bold; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${m.name}</div>
            <div style="color: #94a3b8; font-size: 8px;">Lvl ${m.level}</div>
        `;
        card.onclick = () => validerChoixPension(idx);
        choicesContainer.appendChild(card);
    });
}

function validerChoixPension(reserveIndex) {
    let p = gameState.reserve[reserveIndex];
    if (!p || slotEnCoursDeSelection === null) return;

    gameState.pension[slotEnCoursDeSelection] = gameState.reserve.splice(reserveIndex, 1)[0];
    showNotification(`❤️ ${p.name} est placé au Slot ${slotEnCoursDeSelection + 1} !`);

    slotEnCoursDeSelection = null;
    let modal = document.getElementById("pension-selection-modal");
    if (modal) modal.remove();

    saveGame(); updateUI();
}

function retirerDePension(slotIndex) {
    // Vérification : Bloque le retrait si une incubation est active
    if (gameState.activeEggIncubation) {
        showNotification("⚠️ Impossible de retirer un parent tant que l'incubation est en cours !");
        return;
    }

    let p = gameState.pension[slotIndex]; 
    if (!p) return;
    
    gameState.reserve.push(p); 
    gameState.pension[slotIndex] = null;
    showNotification(`🏡 ${p.name} retourne dans la réserve.`);
    sortReserveByID(); 
    saveGame(); 
    updateUI();
}

// --- LOGIQUE INCUBATEUR ---
function estCompatible(p1, p2) {
        const legendaires = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", 
                     "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi",
                     "Regirock", "Regice", "Registeel", "Latias", "Latios", 
                     "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys"];
    if (legendaires.includes(p1.name) || legendaires.includes(p2.name)) return false;
    if (p1.name === "Métamorph" || p2.name === "Métamorph") return true;
    return p1.name === p2.name;
}

function lancerIncubation() {
    let p1 = gameState.pension[0];
    let p2 = gameState.pension[1];

    if (!p1 || !p2) { showNotification("Il faut 2 Pokémon en pension !"); return; }
    if (!estCompatible(p1, p2)) { showNotification("❌ Ces Pokémon ne sont pas compatibles ! (Même espèce requise, ou Métamorph. Légendaires exclus)."); return; }
    if (gameState.activeEggIncubation) { showNotification("Une incubation est déjà en cours !"); return; }

    gameState.activeEggIncubation = { progress: 0 };
    showNotification("🧪 Incubation lancée ! Générez 50 000 PO pour obtenir l'œuf.");
    saveGame(); updateUI();
}

function recupererOeuf() {
    if (!gameState.activeEggIncubation || gameState.activeEggIncubation.progress < 50000) return;

    // 1. Identifier quel parent n'est PAS Métamorph
    let parent1 = gameState.pension[0];
    let parent2 = gameState.pension[1];
    
    // Si parent1 est Métamorph, on prend parent2, sinon on prend parent1
    let parentCible = (parent1.name === "Métamorph") ? parent2 : parent1;
    
    // 2. Création du bébé
    let bebe = { 
        id: Date.now() + Math.random(), 
        name: parentCible.name, 
        image: parentCible.image, 
        level: 1, 
        // Bonus de 25% sur l'income comme tu le souhaitais
        incomePerMin: Math.floor(parentCible.incomePerMin * 1.25), 
        onExpedition: false,
        isBaby: true // <--- IMPORTANT : Active le cadre rose
    };

    gameState.reserve.push(bebe);
    gameState.activeEggIncubation = null; 
    
    showNotification(`🐣 Félicitations ! L'œuf a éclos en un bébé ${bebe.name} !`);
    
    discoverPokemon(bebe.name); 
    sortReserveByID(); 
    saveGame(); 
    updateUI();
}
function generateRandomStats(baseValue) {
    let randomMod = Math.random() * (1.20 - 0.85) + 0.85;
    return Math.floor(baseValue * randomMod);
}

function calculateTickIncome(m) {
    let lvlBonus = (m.level - 1) * 2; return Math.floor((m.incomePerMin + lvlBonus) / 6);
}

function sortReserveByID() {
    gameState.reserve.sort((a, b) => {
        let pA = POKEDEX_LIST.find(p => p.name === a.name);
        let pB = POKEDEX_LIST.find(p => p.name === b.name);
        return (pA ? parseInt(pA.id) : 999) - (pB ? parseInt(pB.id) : 999);
    });
}

function checkAchievements() {
    ACHIEVEMENTS_CONFIG.forEach(ach => {
        if (!gameState.unlockedAchievements.includes(ach.id) && !gameState.earnedAchievements.includes(ach.id) && ach.check()) {
            gameState.earnedAchievements.push(ach.id);
            showNotification(`🏆 NOUVEAU SUCCÈS : [${ach.title}] ! Allez dans vos succès !`);
            saveGame(); updateUI();
        }
    });
}

function réclamerSucces(id) {
    if (!gameState.earnedAchievements.includes(id)) return;
    let ach = ACHIEVEMENTS_CONFIG.find(a => a.id === id); if (!ach) return;

    gameState.unlockedAchievements.push(id);
    gameState.earnedAchievements = gameState.earnedAchievements.filter(a => a !== id);

    let finalIncome = generateRandomStats(ach.monster.incomePerMin);
    let p = { ...ach.monster, incomePerMin: finalIncome, id: Date.now() + Math.random() };
    gameState.reserve.push(p); discoverPokemon(p.name); sortReserveByID();

    showNotification(`🎁 Récompense récupérée ! ${p.name} rejoint votre réserve.`);
    saveGame(); updateUI();
}

function discoverPokemon(name) {
    if (!gameState.discoveredPokemon.includes(name)) {
        gameState.discoveredPokemon.push(name);
        let lookup = POKEDEX_LIST.find(p => p.name === name);
        let fallbackImage = lookup ? lookup.image : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
        showNewPokemonModal(name, fallbackImage);
    }
    checkAchievements(); saveGame();
}

function buyEgg(region) {
    if (!region) region = 'kanto';

    if (region === 'johto') {
        if (!gameState.unlockedAchievements.includes("leg_mewtwo")) {
            showNotification("🔒 Boutique Johto bloquée ! Réclamez d'abord le succès Mewtwo."); return;
        }
    }

    let cost = (region === 'johto') ? 8000 : 5000;

    if (gameState.money >= cost) {
        gameState.money -= cost;
        let pool = [...POKEDEX[region].commun, ...POKEDEX[region].rare];
        let rolled = pool[Math.floor(Math.random() * pool.length)];
        let finalIncome = generateRandomStats(rolled.incomePerMin);

        let p = {
            id: Date.now() + Math.random(), name: rolled.name, image: rolled.image, nextForm: rolled.nextForm || null,
            level: 1, xp: 0, xpNeeded: 100, incomePerMin: finalIncome, evolutionCondition: rolled.evolutionCondition || null,
            itemNeeded: rolled.itemNeeded || null, evolutionLevel: rolled.evolutionLevel || null, onExpedition: false
        };
        if (gameState.activeTeam.length < 6) gameState.activeTeam.push(p); else gameState.reserve.push(p);
        showNotification(`🥚 Boutique : Un œuf éclot en un magnifique ${p.name} !`);
        discoverPokemon(p.name); sortReserveByID(); saveGame(); updateUI();
    } else { showNotification("Pas assez d'argent !"); }
}

function saveGame() { gameState.lastSaveTime = Date.now(); localStorage.setItem("pokemonBreeder_save", JSON.stringify(gameState)); }

function checkStarterOffer() {
    if (gameState.activeTeam.length === 0 && gameState.reserve.length === 0) {
        let starters = [
            { name: "Bulbizarre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif", incomePerMin: 180, nextForm: "Herbizarre", evolutionCondition: "level", evolutionLevel: 16 },
            { name: "Salamèche", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif", incomePerMin: 180, nextForm: "Reptincel", evolutionCondition: "level", evolutionLevel: 16 },
            { name: "Carapuce", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif", incomePerMin: 180, nextForm: "Carabaffe", evolutionCondition: "level", evolutionLevel: 16 }
        ];
        let randomStarter = starters[Math.floor(Math.random() * starters.length)];
        let finalIncome = generateRandomStats(randomStarter.incomePerMin);
        let p = { id: Date.now() + Math.random(), name: randomStarter.name, image: randomStarter.image, nextForm: randomStarter.nextForm, level: 1, xp: 0, xpNeeded: 100, incomePerMin: finalIncome, evolutionCondition: randomStarter.evolutionCondition, evolutionLevel: randomStarter.evolutionLevel, onExpedition: false };
        gameState.activeTeam.push(p); discoverPokemon(p.name);
    }
}

function processOfflineProgress() {
    let now = Date.now(); let elapsedMs = now - gameState.lastSaveTime; let totalTicks = Math.floor(elapsedMs / 10000);
    if (totalTicks > 0) {
        let earnedMoney = 0;
        gameState.activeTeam.forEach(m => {
            // L'XP est gagnée pour tous les Pokémon même en hors-ligne
            m.xp += 25 * totalTicks; while (m.xp >= m.xpNeeded) { m.xp -= m.xpNeeded; m.level++; m.xpNeeded = m.level * 100; }
            
            // L'argent seulement pour ceux au ranch
            if (!m.onExpedition) {
                earnedMoney += (calculateTickIncome(m) * totalTicks) * 0.20;
            }
        });
        if (earnedMoney > 0) { gameState.money += earnedMoney; showNotification(`💤 Retour ! +${Math.floor(earnedMoney)} PO.`); }
    }
    gameState.lastSaveTime = now; saveGame();
}

function loadGame() {
    let data = localStorage.getItem("pokemonBreeder_save");
    if (data) {
        try {
            gameState = JSON.parse(data);
            if (!gameState.items) gameState.items = {};
            if (!gameState.pension) gameState.pension = [null, null];
            if (gameState.eggProgressMoney === undefined) gameState.eggProgressMoney = 0;
            const objetsAttendus = ["pierreEau", "pierreFeu", "pierreFoudre", "pierreLune", "pierrePlante", "pierreSoleil", "peauMetal", "rocheRoyale", "ecailleDraco", "bonbonSimple", "bonbonSuper", "bonbonMax"];
            objetsAttendus.forEach(o => { if (gameState.items[o] === undefined) gameState.items[o] = 0; });
            if (!gameState.discoveredPokemon) gameState.discoveredPokemon = []; if (!gameState.claimedCodes) gameState.claimedCodes = [];
            if (!gameState.unlockedAchievements) gameState.unlockedAchievements = [];
            if (!gameState.earnedAchievements) gameState.earnedAchievements = [];
            if (!gameState.areneCooldowns) gameState.areneCooldowns = {};
        } catch (e) { localStorage.removeItem("pokemonBreeder_save"); }
    }
    checkStarterOffer(); sortReserveByID(); processOfflineProgress();
}

function hardResetGame() { if (confirm("🚨 Supprimer définitivement votre sauvegarde ?")) { localStorage.removeItem("pokemonBreeder_save"); location.reload(); } }


function toggleMultiReleaseMode() { multiReleaseMode = !multiReleaseMode; selectedForRelease = []; updateUI(); }

function confirmMultiRelease() {
    if (selectedForRelease.length === 0) { toggleMultiReleaseMode(); return; }
    if (confirm(`🗑️ Relâcher ces ${selectedForRelease.length} Pokémon ?`)) {
        gameState.reserve = gameState.reserve.filter(m => !selectedForRelease.includes(m.id));
        selectedForRelease = []; multiReleaseMode = false; saveGame(); updateUI();
    }
}

function useEvolutionItem(id) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id); if (idx === -1 || gameState.activeTeam[idx].onExpedition) return;
    let m = gameState.activeTeam[idx]; let stoneType = m.itemNeeded; if (gameState.items[stoneType] <= 0) return;

    let config = POKEDEX.kanto.evolutions[m.nextForm] || POKEDEX.johto.evolutions[m.nextForm];
    if (config) {
        gameState.items[stoneType]--; let potentialRatio = m.incomePerMin / (m.incomePerMin / 1.5);
        m.name = config.name; m.image = config.image; m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio);
        m.evolutionCondition = config.evolutionCondition || null; m.nextForm = config.nextForm || null;
        m.evolutionLevel = config.evolutionLevel || null; m.itemNeeded = config.itemNeeded || null;
        discoverPokemon(config.name); saveGame(); updateUI();
    }
}

function triggerEeveeEvolution(id, item) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id); if (idx === -1 || gameState.activeTeam[idx].onExpedition) return;
    if (gameState.items[item] <= 0) { showNotification("Tu n'as pas cette pierre !"); return; }

    gameState.items[item]--;
    let name = (item === "pierreEau") ? "Aquali" : (item === "pierreFeu") ? "Pyroli" : "Voltali";
    let config = POKEDEX.kanto.evolutions[name]; let m = gameState.activeTeam[idx]; let potentialRatio = m.incomePerMin / 240;

    m.name = config.name; m.image = config.image; m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio);
    m.evolutionCondition = null; m.nextForm = null; m.evolutionLevel = null; m.itemNeeded = null;
    discoverPokemon(config.name); saveGame(); updateUI();
}

function updateJohtoButtonVisuals() {
    let buttons = document.querySelectorAll("#tab-oeufs button, .zone-card button, button");
    let targetBtn = null;
    buttons.forEach(btn => {
        let attr = btn.getAttribute("onclick");
        if (attr && attr.includes("'johto'")) { targetBtn = btn; }
    });

    if (targetBtn) {
        let mewtwoReclame = gameState.unlockedAchievements.includes("leg_mewtwo");
        if (!mewtwoReclame) {
            targetBtn.style.opacity = "0.4"; targetBtn.style.cursor = "not-allowed";
            targetBtn.style.background = "#334155"; targetBtn.style.border = "1px solid #475569";
            targetBtn.innerText = "🔒 BLOQUÉ (Requis: Mewtwo)";
        } else {
            targetBtn.style.opacity = "1"; targetBtn.style.cursor = "pointer";
            targetBtn.style.background = ""; targetBtn.style.border = "";
            targetBtn.innerText = "ACHETER (8000 PO)";
        }
    }
}

function evolveMonster(id) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id); if (idx === -1) return;
    let m = gameState.activeTeam[idx];
    let config = POKEDEX.kanto.evolutions[m.nextForm] || POKEDEX.johto.evolutions[m.nextForm];
    if (config) {
        let basePreviousForm = [...POKEDEX.kanto.commun, ...POKEDEX.kanto.rare, ...POKEDEX.johto.commun, ...POKEDEX.johto.rare].find(p => p.name === m.name) || POKEDEX.kanto.evolutions[m.name] || POKEDEX.johto.evolutions[m.name];
        let potentialRatio = m.incomePerMin / (basePreviousForm ? basePreviousForm.incomePerMin : m.incomePerMin);
        m.name = config.name; m.image = config.image; m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio);
        m.evolutionLevel = config.evolutionLevel || null; m.nextForm = config.nextForm || null; m.evolutionCondition = config.evolutionCondition || null;
        discoverPokemon(config.name); saveGame(); updateUI();
    }
}

function startExpedition(id) {
    if (gameState.activeExpedition) return;
    let free = gameState.activeTeam.filter(m => !m.onExpedition); if (free.length === 0) return;
    let z = ZONES.find(zone => zone.id === id);
    gameState.activeTeam.forEach(m => m.onExpedition = true);
    gameState.activeExpedition = { zoneId: id, endTime: Date.now() + (z.duration * 1000), count: free.length };
    saveGame(); updateUI();
}

// game.js
function checkExpeditionEnd() {
    if (gameState.activeExpedition && Date.now() >= gameState.activeExpedition.endTime) {
        gameState.activeTeam.forEach(m => m.onExpedition = false); 
        
        let z = ZONES.find(zone => zone.id === gameState.activeExpedition.zoneId);
        let nbPierres = 0;
        let nbBonbons = 0;
        let pierresDispos = ["pierreEau", "pierreFeu", "pierreFoudre", "pierreLune", "pierrePlante", "pierreSoleil"];
        let multiplier = z.lootWeight; 

        for (let i = 0; i < gameState.activeExpedition.count; i++) {
            if (Math.random() > (0.6 - (multiplier * 0.05))) { 
                let p = pierresDispos[Math.floor(Math.random() * pierresDispos.length)];
                gameState.items[p] += multiplier; 
                nbPierres += multiplier;
            } else {
                let amount = (Math.floor(Math.random() * 3) + 1) * multiplier; 
                gameState.items.bonbonSimple += amount;
                nbBonbons += amount;
            }
        }
        showNotification(`🧭 ${z.name} terminée ! Butin : ${nbPierres} Pierre(s), ${nbBonbons} Bonbon(s).`); 
        gameState.activeExpedition = null; 
        saveGame(); updateUI();
    }
}
function initAreneUI() {
    let container = document.getElementById("arene-selection"); if (!container) return;
    container.innerHTML = ""; if (!gameState.areneCooldowns) gameState.areneCooldowns = {};
    const now = Date.now();

    CHAMPIONS.forEach(c => {
        const timePassed = now - (gameState.areneCooldowns[c.id] || 0); const isLocked = timePassed < 21600000;
        let btnText = "DÉFIER", disabledAttr = "";
        if (isLocked) {
            const hours = Math.floor((21600000 - timePassed) / 3600000); const minutes = Math.floor(((21600000 - timePassed) % 3600000) / 60000);
            btnText = `🔒 ${hours}h${minutes}m`; disabledAttr = "disabled";
        }
        let div = document.createElement("div"); div.className = "champion-card";
        div.innerHTML = `<div><h4 style="color:white; margin:0; font-size:11px;">🏆 ${c.name}</h4><p style="margin:2px 0 0 0; font-size:9px; color:#94a3b8;">PV: ${c.hp} | ATK: ${c.atk}/s</p></div><button class="champion-btn" ${disabledAttr} onclick="startCombat('${c.id}')">${btnText}</button>`;
        container.appendChild(div);
    });
}

// --- NOUVELLES RÉCOMPENSES D'ARÈNE ---
function startCombat(id) {
    if (combatInterval) clearInterval(combatInterval); if (gameState.activeTeam.length === 0) { showNotification("Ton enclos est vide !"); return; }
    let boss = CHAMPIONS.find(c => c.id === id);
    let playerMaxHp = gameState.activeTeam.reduce((sum, m) => sum + (m.level * 25), 0);
    let playerAtk = gameState.activeTeam.reduce((sum, m) => sum + calculateTickIncome(m), 0) * 2;
    let pHp = playerMaxHp, bHp = boss.hp;

    document.getElementById("arene-selection").style.display = "none";
    document.getElementById("arene-combat-box").style.display = "block";
    document.getElementById("boss-name").innerText = boss.name;

    combatInterval = setInterval(() => {
        bHp -= playerAtk; pHp -= boss.atk;
        document.getElementById("player-hp").innerText = Math.max(0, pHp); document.getElementById("boss-hp").innerText = Math.max(0, bHp);

        if (bHp <= 0) {
            clearInterval(combatInterval); combatInterval = null;
            gameState.areneCooldowns[boss.id] = Date.now();

            // Les nouvelles récompenses
            gameState.money += boss.rewardMoney;
            gameState.items[boss.rewardStone]++;
            gameState.items.bonbonMax++;

            showNotification(`🎉 VICTOIRE ! +10000 PO, +1 ${ITEMS_CONFIG[boss.rewardStone].name}, et +1 Bonbon Max !`);
            endCombat();
        } else if (pHp <= 0) {
            clearInterval(combatInterval); combatInterval = null;
            showNotification(`❌ Défaite... Votre équipe doit monter en niveau.`);
            endCombat();
        }
    }, 1000);
}

function endCombat() {
    document.getElementById("arene-selection").style.display = "block"; document.getElementById("arene-combat-box").style.display = "none";
    saveGame(); initAreneUI(); updateUI();
}

function switchZone(id, loc) {
    if (loc === 'team') {
        let idx = gameState.activeTeam.findIndex(m => m.id === id);
        if (idx !== -1 && !gameState.activeTeam[idx].onExpedition) { gameState.reserve.push(gameState.activeTeam.splice(idx, 1)[0]); sortReserveByID(); }
    } else {
        if (gameState.activeTeam.length >= 6) { showNotification("Enclos plein ! Max 6."); return; }
        let idx = gameState.reserve.findIndex(m => m.id === id); if (idx !== -1) gameState.activeTeam.push(gameState.reserve.splice(idx, 1)[0]);
    }
    saveGame(); updateUI();
}

function createCard(m, loc) {
    let div = document.createElement("div");
    let isLegendary = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi"].includes(m.name);
    
    // Correction : on utilise POKEDEX.kanto et POKEDEX.johto correctement
    let isRare = m.incomePerMin >= 200 || 
                 (POKEDEX.kanto.rare.some(p => p.name === m.name)) || 
                 (POKEDEX.johto.rare.some(p => p.name === m.name));

    let babyClass = m.isBaby ? 'baby-border' : '';
    div.className = `monster-card ${m.onExpedition ? 'on-expedition' : ''} ${isLegendary ? 'legend-border' : isRare ? 'rare-border' : ''} ${babyClass}`;
    
    let isReadyForLevelEvo = (m.nextForm && !m.onExpedition && loc === 'team' && m.evolutionCondition === "level" && m.level >= m.evolutionLevel);

    div.onclick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
        if (itemSelectionneActuel !== null && loc === 'reserve') {
            let reserveIdx = gameState.reserve.findIndex(p => p.id === m.id);
            if (reserveIdx !== -1) { appliquerObjetAuPokemon(reserveIdx, itemSelectionneActuel); return; }
        }
        if (loc === 'reserve' && multiReleaseMode) {
            let checkbox = div.querySelector(".release-checkbox");
            if (checkbox) { checkbox.checked = !checkbox.checked; triggerCheckboxSelection(m.id, checkbox.checked, div); }
        } else if (loc === 'reserve') {
            switchZone(m.id, loc);
        } else if (isReadyForLevelEvo) { 
            evolveMonster(m.id); 
        } else { 
            switchZone(m.id, loc); 
        }
    };

    let tick = calculateTickIncome(m);
    let affichagePO = m.isBaby ? `⭐ +${tick} PO` : `+${tick} PO`;

    div.innerHTML = `<div class="monster-image-container"><img src="${m.image}"></div><div class="monster-info"><div class="monster-name ${isReadyForLevelEvo ? 'gold-evo-text' : ''}">${m.name}</div><div class="monster-xp">Lvl ${m.level}</div><div class="monster-income">${affichagePO}</div></div>`;

    // ... (garde le reste de ta fonction pour les boutons d'évolution comme avant)
    return div;
}
function triggerCheckboxSelection(id, checked, cardElement) {
    if (checked) { if (!selectedForRelease.includes(id)) selectedForRelease.push(id); cardElement.style.backgroundColor = "rgba(239, 68, 68, 0.3)"; }
    else { selectedForRelease = selectedForRelease.filter(sid => sid !== id); cardElement.style.backgroundColor = ""; }
    if (document.getElementById("confirm-release-btn")) document.getElementById("confirm-release-btn").innerText = selectedForRelease.length > 0 ? `CONFIRMER (${selectedForRelease.length})` : "ANNULER";
}

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    if (tabId === 'tab-ranch' && document.getElementById('tab-enclos')) {
        document.getElementById('tab-enclos').classList.add('active');
    } else if (document.getElementById(tabId)) {
        document.getElementById(tabId).classList.add('active');
    }

    let navBtn = document.getElementById('nav-' + tabId);
    if (!navBtn && tabId === 'tab-ranch') navBtn = document.getElementById('nav-tab-enclos');
    if (!navBtn && tabId === 'tab-stock') navBtn = document.getElementById('nav-tab-stock');
    if (!navBtn && tabId === 'tab-pokedex') navBtn = document.getElementById('nav-tab-pokedex');
    if (!navBtn && tabId === 'tab-map') navBtn = document.getElementById('nav-tab-map');
    if (!navBtn && tabId === 'tab-oeufs') navBtn = document.getElementById('nav-tab-oeufs');

    if (navBtn) navBtn.classList.add('active');
}

function updateUI() {
    if (document.getElementById("money")) document.getElementById("money").innerText = Math.floor(gameState.money);
    if (document.getElementById("team-count")) document.getElementById("team-count").innerText = gameState.activeTeam.length;

    let teamBox = document.getElementById("active-team");
    if (teamBox) { teamBox.innerHTML = ""; gameState.activeTeam.forEach(m => teamBox.appendChild(createCard(m, 'team'))); }

    let stockTab = document.getElementById("tab-stock");
    if (stockTab) {
        let actionBox = document.getElementById("multi-release-actions");
        if (!actionBox) { actionBox = document.createElement("div"); actionBox.id = "multi-release-actions"; actionBox.style.cssText = "display:flex; gap:10px; margin-bottom:8px;"; stockTab.insertBefore(actionBox, stockTab.firstChild); }
        actionBox.innerHTML = "";
        if (!multiReleaseMode) {
            let btn = document.createElement("button"); btn.className = "zone-btn"; btn.style.padding = "6px 12px"; btn.innerText = "🗑️ MODE LIBÉRATION"; btn.onclick = toggleMultiReleaseMode; actionBox.appendChild(btn);
        } else {
            let bC = document.createElement("button"); bC.id = "confirm-release-btn"; bC.className = "champion-btn"; bC.style.padding = "6px 12px"; bC.innerText = "ANNULER"; bC.onclick = confirmMultiRelease;
            let bR = document.createElement("button"); bR.className = "zone-btn"; bR.style.cssText = "padding:6px 12px; background:#4a5568; color:white;"; bR.innerText = "RETOUR"; bR.onclick = toggleMultiReleaseMode;
            actionBox.appendChild(bC); actionBox.appendChild(bR);
        }
    }

    let resBox = document.getElementById("reserve");
    if (resBox) { resBox.innerHTML = ""; gameState.reserve.forEach((m, idx) => resBox.appendChild(createCard(m, 'reserve'))); }

    let grid = document.getElementById("pokedex-grid");
    if (grid) {
        grid.innerHTML = "";
        POKEDEX_LIST.forEach(p => {
            let has = gameState.discoveredPokemon.includes(p.name);
            let div = document.createElement("div"); div.className = `pokedex-entry ${has ? '' : 'locked'}`;
            div.innerHTML = `<span class="pokedex-number">#${p.id}</span><img src="${p.image}"><div class="pokemon-name-tag">${has ? p.name : "???"}</div>`; grid.appendChild(div);
        });
    }
    if (document.getElementById("pokedex-count-ratio")) document.getElementById("pokedex-count-ratio").innerText = `${gameState.discoveredPokemon.length} / ${POKEDEX_LIST.length}`;
    if (document.getElementById("pokedex-progress-fill")) document.getElementById("pokedex-progress-fill").style.width = `${(gameState.discoveredPokemon.length / POKEDEX_LIST.length) * 100}%`;

    let succesBox = document.getElementById("succes-list-container");
    if (succesBox) {
        succesBox.innerHTML = "";
        ACHIEVEMENTS_CONFIG.forEach(ach => {
            let isEarned = gameState.earnedAchievements.includes(ach.id);
            let isClaimed = gameState.unlockedAchievements.includes(ach.id);

            let div = document.createElement("div");
            if (isClaimed) {
                div.className = "achievement-box unlocked";
                div.innerHTML = `<div class="achievement-title done">🏆 [RÉCLAMÉ] ${ach.title}</div><div class="achievement-desc">${ach.desc}</div>`;
            } else if (isEarned) {
                div.className = "achievement-box";
                div.style.cssText = "border: 2px solid #f59e0b; background: rgba(245, 158, 11, 0.1); cursor: pointer; animation: pulse 1.5s infinite;";
                div.innerHTML = `<div class="achievement-title" style="color: #f59e0b; font-weight:bold;">🎁 [CLIQUEZ POUR RÉCLAMER] ${ach.title}</div><div class="achievement-desc" style="color: white;">Félicitations ! Touchez cette case pour recevoir ${ach.monster.name} !</div>`;
                div.onclick = () => réclamerSucces(ach.id);
            } else {
                div.className = "achievement-box";
                div.innerHTML = `<div class="achievement-title">🔒 ${ach.title}</div><div class="achievement-desc">${ach.desc}</div>`;
            }
            succesBox.appendChild(div);
        });
    }

    let invContainer = document.getElementById("inventory-container");
    if (invContainer) {
        invContainer.innerHTML = ""; let aDesObjets = false;
        Object.keys(ITEMS_CONFIG).forEach(itemId => {
            let count = gameState.items[itemId] || 0;
            if (count > 0) {
                aDesObjets = true; let itemDiv = document.createElement("div");
                itemDiv.style.cssText = "background: #1e293b; padding: 6px; border-radius: 4px; font-size: 11px; display: flex; align-items: center; gap: 6px; width: calc(50% - 4px); cursor: pointer; box-sizing: border-box;";
                itemDiv.innerHTML = `<img src="${ITEMS_CONFIG[itemId].image}" style="width:20px; height:20px; object-fit:contain;"> <span style="color:white; font-size:10px;">${ITEMS_CONFIG[itemId].name}</span> <b style="color:#f59e0b; margin-left:auto;">x${count}</b>`;
                itemDiv.onclick = () => selectionnerObjetPourAction(itemId); invContainer.appendChild(itemDiv);
            }
        });
        if (!aDesObjets) invContainer.innerHTML = `<span style="color:#475569; font-style:italic; font-size:11px; width:100%; text-align:center; padding: 10px 0;">Votre sac est vide...</span>`;
    }

    for (let i = 0; i < 2; i++) {
        let slotEl = document.getElementById(`pension-slot-${i + 1}`);
        if (slotEl) {
            let p = gameState.pension[i];
            if (p) {
                slotEl.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; width:100%;">
                        <img src="${p.image}" style="width:50px; height:50px; object-fit:contain;">
                        <span style="color:white; font-size:8px; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%; font-weight:bold;">${p.name}</span>
                    </div>
                `;
                slotEl.style.border = "2px solid #e11d48";
                slotEl.onclick = () => retirerDePension(i);
            } else {
                slotEl.innerHTML = `<span style="color: #475569; font-size: 24px;">+</span>`;
                slotEl.style.border = "2px dashed #475569";
                slotEl.onclick = () => ouvrirSelectionPension(i);
            }
        }
    }

    let incubUI = document.getElementById("incubateur-ui");
    if (incubUI) {
        if (gameState.activeEggIncubation) {
            let p = gameState.activeEggIncubation.progress;
            let pct = Math.min((p / 50000) * 100, 100);

            incubUI.innerHTML = `
                <div style="margin: 10px 0;">
                    <div style="background: #0f172a; height: 15px; border-radius: 8px; overflow: hidden; border: 1px solid #475569;">
                        <div style="width: ${pct}%; background: #fbbf24; height: 100%; transition: width 0.5s;"></div>
                    </div>
                    <p style="font-size: 11px; color: white; margin-top: 5px;">Progression : ${Math.floor(p)} / 50 000 PO</p>
                    ${p >= 50000 ? '<button onclick="recupererOeuf()" class="champion-btn" style="background:#22c55e; width:100%; margin-top:5px;">🐣 RÉCUPÉRER L\'ŒUF</button>' : '<button disabled class="champion-btn" style="background:#334155; width:100%; margin-top:5px; color:#94a3b8;">INCUBATION EN COURS...</button>'}
                </div>
            `;
        } else {
            incubUI.innerHTML = "";
        }
    }

    updateJohtoButtonVisuals();
}

loadGame();

window.onload = function () {
    let zonesBox = document.getElementById("zones-container");
    if (zonesBox) {
        zonesBox.innerHTML = "";
        ZONES.forEach(z => {
            let div = document.createElement("div"); div.className = "zone-card";
            div.innerHTML = `<div><h4 style="color:white; margin:0; font-size:12px;">🗺️ ${z.name}</h4><p style="margin:2px 0 0 0; font-size:10px; color:#94a3b8;">${z.desc}</p></div><button class="zone-btn" onclick="startExpedition(${z.id})">🧭</button>`;
            zonesBox.appendChild(div);
        });
    }

    // Timer des expéditions
    setInterval(() => {
        if (gameState.activeExpedition) {
            let rem = Math.ceil((gameState.activeExpedition.endTime - Date.now()) / 1000);
            if (document.getElementById("expeditions-active-box")) document.getElementById("expeditions-active-box").style.display = "block";
            if (document.getElementById("expedition-timer")) document.getElementById("expedition-timer").innerText = rem > 0 ? `${Math.floor(rem / 60)}:${(rem % 60).toString().padStart(2, '0')}` : "Fini !";
        } else { 
            if (document.getElementById("expeditions-active-box")) document.getElementById("expeditions-active-box").style.display = "none"; 
        }
    }, 1000);

    // Tick de revenus et progression XP
    setInterval(() => {
        let gainsDuTick = 0;
        
        gameState.activeTeam.forEach(m => {
            // 1. L'XP augmente TOUJOURS, même si le Pokémon est en expédition
            m.xp += 25;
            while (m.xp >= m.xpNeeded) { 
                m.xp -= m.xpNeeded; 
                m.level++; 
                m.xpNeeded = m.level * 100; 
            }
            
            // 2. L'argent n'est généré que si le Pokémon n'est pas en expédition
            if (!m.onExpedition) {
                gainsDuTick += calculateTickIncome(m);
            }
        });

        // 3. Application des gains
        gameState.money += gainsDuTick;

        if (gameState.activeEggIncubation) {
            gameState.activeEggIncubation.progress += gainsDuTick;
            if (gameState.activeEggIncubation.progress > 50000) {
                gameState.activeEggIncubation.progress = 50000;
            }
        }

        checkAchievements(); 
        checkExpeditionEnd(); 
        saveGame(); 
        updateUI();
    }, 10000);

    setInterval(() => { initAreneUI(); }, 60000);
    initAreneUI(); 
    updateUI();
};
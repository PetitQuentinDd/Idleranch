// events.js - Succès basés sur la progression du Pokédex

const ACHIEVEMENTS_CONFIG = [
    {
        id: "leg_artikodin", title: "Collectionneur (50)", desc: "Débloquer 50 Pokémon pour obtenir Artikodin.",
        check: () => gameState.discoveredPokemon.length >= 50,
        monster: { name: "Artikodin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/144.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 450, onExpedition: false }
    },
    {
        id: "leg_electhor", title: "Collectionneur (80)", desc: "Débloquer 80 Pokémon pour obtenir Électhor.",
        check: () => gameState.discoveredPokemon.length >= 80,
        monster: { name: "Électhor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/145.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 460, onExpedition: false }
    },
    {
        id: "leg_sulfura", title: "Collectionneur (110)", desc: "Débloquer 110 Pokémon pour obtenir Sulfura.",
        check: () => gameState.discoveredPokemon.length >= 110,
        monster: { name: "Sulfura", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/146.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 440, onExpedition: false }
    },
    {
        id: "leg_mewtwo", title: "L'Expert (150)", desc: "Débloquer 120 Pokémon pour obtenir Mewtwo.",
        check: () => gameState.discoveredPokemon.length >= 120,
        monster: { name: "Mewtwo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif", level: 70, xp: 0, xpNeeded: 7000, incomePerMin: 490, onExpedition: false }
    },
    {
        id: "leg_mew", title: "Le Maître (200)", desc: "Débloquer 150 Pokémon pour obtenir Mew.",
        check: () => gameState.discoveredPokemon.length >= 150,
        monster: { name: "Mew", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif", level: 5, xp: 0, xpNeeded: 500, incomePerMin: 500, onExpedition: false }
    },
    //  Suite des paliers de progression
{
    id: "leg_raikou", title: "Maître de la Foudre (210)", desc: "Débloquer 210 Pokémon pour obtenir Raikou.",
    check: () => gameState.discoveredPokemon.length >= 210,
    monster: { name: "Raikou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/243.gif", level: 60, xp: 0, xpNeeded: 6000, incomePerMin: 500, onExpedition: false }
},
{
    id: "leg_entei", title: "Gardien du Volcan (220)", desc: "Débloquer 220 Pokémon pour obtenir Entei.",
    check: () => gameState.discoveredPokemon.length >= 220,
    monster: { name: "Entei", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/244.gif", level: 60, xp: 0, xpNeeded: 6000, incomePerMin: 500, onExpedition: false }
},
{
    id: "leg_suicune", title: "Purificateur des Eaux (230)", desc: "Débloquer 230 Pokémon pour obtenir Suicune.",
    check: () => gameState.discoveredPokemon.length >= 230,
    monster: { name: "Suicune", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/245.gif", level: 60, xp: 0, xpNeeded: 6000, incomePerMin: 500, onExpedition: false }
},
{
    id: "leg_lugia", title: "Gardien des Abysses (240)", desc: "Débloquer 240 Pokémon pour obtenir Lugia.",
    check: () => gameState.discoveredPokemon.length >= 240,
    monster: { name: "Lugia", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/249.gif", level: 80, xp: 0, xpNeeded: 8000, incomePerMin: 550, onExpedition: false }
},
{
    id: "leg_hooh", title: "Légende du Ciel (250)", desc: "Débloquer 250 Pokémon pour obtenir Ho-Oh.",
    check: () => gameState.discoveredPokemon.length >= 250,
    monster: { name: "Ho-Oh", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/250.gif", level: 80, xp: 0, xpNeeded: 8000, incomePerMin: 560, onExpedition: false }
},
{
    id: "leg_regirock", title: "Gardien de Pierre (260)", desc: "Débloquer 260 Pokémon pour obtenir Regirock.",
    check: () => gameState.discoveredPokemon.length >= 260,
    monster: { name: "Regirock", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/377.gif", level: 60, xp: 0, xpNeeded: 8000, incomePerMin: 600, onExpedition: false }
},
{
    id: "leg_regice", title: "Gardien des Glaces (270)", desc: "Débloquer 270 Pokémon pour obtenir Regice.",
    check: () => gameState.discoveredPokemon.length >= 270,
    monster: { name: "Regice", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/378.gif", level: 60, xp: 0, xpNeeded: 8000, incomePerMin: 600, onExpedition: false }
},
{
    id: "leg_registeel", title: "Gardien d'Acier (280)", desc: "Débloquer 280 Pokémon pour obtenir Registeel.",
    check: () => gameState.discoveredPokemon.length >= 280,
    monster: { name: "Registeel", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/379.gif", level: 60, xp: 0, xpNeeded: 8000, incomePerMin: 600, onExpedition: false }
},
{
    id: "leg_latias", title: "Sœur Éon (290)", desc: "Débloquer 290 Pokémon pour obtenir Latias.",
    check: () => gameState.discoveredPokemon.length >= 290,
    monster: { name: "Latias", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/380.gif", level: 70, xp: 0, xpNeeded: 9000, incomePerMin: 650, onExpedition: false }
},
{
    id: "leg_latios", title: "Frère Éon (300)", desc: "Débloquer 300 Pokémon pour obtenir Latios.",
    check: () => gameState.discoveredPokemon.length >= 300,
    monster: { name: "Latios", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/381.gif", level: 70, xp: 0, xpNeeded: 9000, incomePerMin: 650, onExpedition: false }
},
{
    id: "leg_kyogre", title: "Maître des Océans (310)", desc: "Débloquer 310 Pokémon pour obtenir Kyogre.",
    check: () => gameState.discoveredPokemon.length >= 310,
    monster: { name: "Kyogre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/382.gif", level: 80, xp: 0, xpNeeded: 10000, incomePerMin: 700, onExpedition: false }
},
{
    id: "leg_groudon", title: "Maître des Continents (320)", desc: "Débloquer 320 Pokémon pour obtenir Groudon.",
    check: () => gameState.discoveredPokemon.length >= 320,
    monster: { name: "Groudon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/383.gif", level: 80, xp: 0, xpNeeded: 10000, incomePerMin: 700, onExpedition: false }
},
{
    id: "leg_rayquaza", title: "Gardien des Cieux (330)", desc: "Débloquer 330 Pokémon pour obtenir Rayquaza.",
    check: () => gameState.discoveredPokemon.length >= 330,
    monster: { name: "Rayquaza", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/384.gif", level: 90, xp: 0, xpNeeded: 12000, incomePerMin: 800, onExpedition: false }
},
{
    id: "leg_jirachi", title: "Étoile des Vœux (350)", desc: "Débloquer 350 Pokémon pour obtenir Jirachi.",
    check: () => gameState.discoveredPokemon.length >= 350,
    monster: { name: "Jirachi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/385.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 600, onExpedition: false }
}

];
function claimPromoCode() {
    let input = document.getElementById("promo-input-field"); 
    let code = input.value.trim().toUpperCase(); 
    if (!code) return;
    
    if (gameState.claimedCodes.includes(code)) { 
        showNotification("Code déjà utilisé !"); 
        input.value = ""; 
        return; 
    }

    if (code === "WELCOME") {
        let finalIncome = generateRandomStats(180);
        let p = { id: Date.now() + Math.random(), name: "Pikachu (Casquette)", image: "https://www.smogon.com/dex/media/sprites/xy/pikachu-starter.gif", level: 10, xp: 0, xpNeeded: 1000, incomePerMin: finalIncome, onExpedition: false };
        if (gameState.activeTeam.length < 6) gameState.activeTeam.push(p); else gameState.reserve.push(p);
        gameState.claimedCodes.push(code); discoverPokemon("Pikachu"); sortReserveByID(); showNotification(`🎉 Cadeau : ${p.name}`);
    } 
    else if (code === "RICHESSE") {
        gameState.money += 5000; 
        gameState.claimedCodes.push(code); 
        showNotification(`💰 +5000 PO !`);
    } 
    else if (code === "DESOLE") {
        gameState.money += 50000; 
        gameState.claimedCodes.push(code); 
        showNotification(`💰 +500000 PO !`);
        gameState.items.bonbonMax += 8;
    } 
    if (code === "EXTRAPOKEMON") {
    // Vérifie si le joueur a déjà utilisé ce code
    if (gameState.claimedCodes.includes("EXTRAPOKEMON")) {
        showNotification("❌ Ce code a déjà été utilisé !");
    } else {
        let finalIncome = generateRandomStats(750); // Revenu élevé pour un légendaire
        let p = { 
            id: Date.now() + Math.random(), 
            name: "Deoxys", 
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/386.gif", 
            level: 50, 
            xp: 0, 
            xpNeeded: 8000, 
            incomePerMin: finalIncome, 
            onExpedition: false 
        };
        
        if (gameState.activeTeam.length < 6) {
            gameState.activeTeam.push(p); 
        } else {
            gameState.reserve.push(p);
        }
        
        gameState.claimedCodes.push(code); 
        discoverPokemon("Deoxys"); 
        sortReserveByID(); 
        saveGame();
        updateUI();
        showNotification(`👽 Cadeau : Un mystérieux ${p.name} apparaît !`);
    }
}
    else if (code === "PRECIEUSELAURA") {
        let cadeauxLaura = [
            { name: "Canarticho", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png", incomePerMin: 180 },
            { name: "Kicklee", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png", incomePerMin: 200 },
            { name: "Tygnon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png", incomePerMin: 200 },
            { name: "Levainard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png", incomePerMin: 250 },
            { name: "Miaouss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png", incomePerMin: 150, nextForm: "Persian", evolutionCondition: "level", evolutionLevel: 28 }
        ];

        cadeauxLaura.forEach(poke => {
            let finalIncome = generateRandomStats(poke.incomePerMin);
            let p = { id: Date.now() + Math.random(), name: poke.name, image: poke.image, nextForm: poke.nextForm || null, level: 1, xp: 0, xpNeeded: 100, incomePerMin: finalIncome, evolutionCondition: poke.evolutionCondition || null, evolutionLevel: poke.evolutionLevel || null, onExpedition: false };
            gameState.reserve.push(p);
            discoverPokemon(p.name);
        });

        gameState.items.bonbonMax += 6;
        gameState.claimedCodes.push(code); 
        sortReserveByID(); 
        showNotification(`🎉 Code accepté ! Canarticho, Kicklee, Tygnon, Levainard, Miaouss et 6 Bonbons Max ajoutés !`);
    } 
    else if (code === "TOHJOGIOVANNI") {
        let finalIncome = generateRandomStats(520);
        let p = { id: Date.now() + Math.random(), name: "Celebi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/251.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: finalIncome, onExpedition: false };

        if (gameState.activeTeam.length < 6) gameState.activeTeam.push(p); else gameState.reserve.push(p);

        gameState.claimedCodes.push(code); 
        discoverPokemon("Celebi"); 
        sortReserveByID(); 
        showNotification(`🌿 Code accepté ! Le légendaire Celebi rejoint votre ranch !`);
    }
    else { 
        showNotification("Code inconnu..."); 
    }
    
    input.value = ""; 
    saveGame(); 
    updateUI();


}

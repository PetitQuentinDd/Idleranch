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

const ITEMS_CONFIG = {
    pierreEau: { name: "Pierre Eau", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png", type: "evolution" },
    pierreFeu: { name: "Pierre Feu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png", type: "evolution" },
    pierreFoudre: { name: "Pierre Foudre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png", type: "evolution" },
    pierreLune: { name: "Pierre Lune", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png", type: "evolution" },
    pierrePlante: { name: "Pierre Plante", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png", type: "evolution" },
    pierreSoleil: { name: "Pierre Soleil", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png", type: "evolution" },
    peauMetal: { name: "Peau Métal", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png", type: "evolution" },
    rocheRoyale: { name: "Roche Royale", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png", type: "evolution" },
    ecailleDraco: { name: "Écaille Draco", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png", type: "evolution" },
    bonbonSimple: { name: "Bonbon Simple", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png", type: "candy", multiplier: 1.10 },
    bonbonSuper: { name: "Super Bonbon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lumiose-galette.png", type: "candy", multiplier: 1.25 },
    bonbonMax: { name: "Bonbon Max", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-honey.png", type: "candy", multiplier: 1.50 }
};
const POKEDEX_LIST = [
    { id: "001", name: "Bulbizarre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" },
    { id: "002", name: "Herbizarre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png" },
    { id: "003", name: "Florizarre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png" },
    { id: "004", name: "Salamèche", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" },
    { id: "005", name: "Reptincel", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png" },
    { id: "006", name: "Dracaufeu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
    { id: "007", name: "Carapuce", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" },
    { id: "008", name: "Carabaffe", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png" },
    { id: "009", name: "Tortank", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png" },
    { id: "010", name: "Chenipan", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png" },
    { id: "011", name: "Chrysacier", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png" },
    { id: "012", name: "Papilusion", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png" },
    { id: "013", name: "Aspicot", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png" },
    { id: "014", name: "Coconfort", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png" },
    { id: "015", name: "Dardargnan", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png" },
    { id: "016", name: "Roucool", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png" },
    { id: "017", name: "Roucoups", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png" },
    { id: "018", name: "Roucarnage", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png" },
    { id: "019", name: "Rattata", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png" },
    { id: "020", name: "Rattatac", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png" },
    { id: "021", name: "Piafabec", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png" },
    { id: "022", name: "Rapasdepic", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/22.png" },
    { id: "023", name: "Abo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png" },
    { id: "024", name: "Arbok", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png" },
    { id: "025", name: "Pikachu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
    { id: "026", name: "Raichu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png" },
    { id: "027", name: "Sabelette", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png" },
    { id: "028", name: "Sablaireau", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png" },
    { id: "029", name: "Nidoran♀", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/29.png" },
    { id: "030", name: "Nidorina", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/30.png" },
    { id: "031", name: "Nidoqueen", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png" },
    { id: "032", name: "Nidoran♂", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/32.png" },
    { id: "033", name: "Nidorino", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/33.png" },
    { id: "034", name: "Nidoking", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png" },
    { id: "035", name: "Mélofée", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png" },
    { id: "036", name: "Mélodelfe", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png" },
    { id: "037", name: "Goupix", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png" },
    { id: "038", name: "Feunard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png" },
    { id: "039", name: "Rondoudou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png" },
    { id: "040", name: "Grodoudou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png" },
    { id: "041", name: "Nosferapti", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png" },
    { id: "042", name: "Nosferalto", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/42.png" },
    { id: "043", name: "Mystherbe", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/43.png" },
    { id: "044", name: "Ortide", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/44.png" },
    { id: "045", name: "Rafflesia", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/45.png" },
    { id: "046", name: "Paras", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/46.png" },
    { id: "047", name: "Parasect", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/47.png" },
    { id: "048", name: "Mimitoss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/48.png" },
    { id: "049", name: "Aéromite", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/49.png" },
    { id: "050", name: "Taupiqueur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png" },
    { id: "051", name: "Triopikeur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png" },
    { id: "052", name: "Miaouss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png" },
    { id: "053", name: "Persian", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png" },
    { id: "054", name: "Psykokwak", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" },
    { id: "055", name: "Akwakwak", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png" },
    { id: "056", name: "Férosinge", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png" },
    { id: "057", name: "Colossinge", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png" },
    { id: "058", name: "Caninos", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png" },
    { id: "059", name: "Arcanin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png" },
    { id: "060", name: "Ptitard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png" },
    { id: "061", name: "Tétarte", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/61.png" },
    { id: "062", name: "Tartard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png" },
    { id: "063", name: "Abra", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png" },
    { id: "064", name: "Kadabra", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png" },
    { id: "065", name: "Alakazam", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png" },
    { id: "066", name: "Machoc", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png" },
    { id: "067", name: "Machopeur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png" },
    { id: "068", name: "Mackogneur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png" },
    { id: "069", name: "Chétiflor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png" },
    { id: "070", name: "Boustiflor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png" },
    { id: "071", name: "Empiflor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png" },
    { id: "072", name: "Tentacool", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/72.png" },
    { id: "073", name: "Tentacruel", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png" },
    { id: "074", name: "Racaillou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png" },
    { id: "075", name: "Gravalanch", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png" },
    { id: "076", name: "Grolem", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png" },
    { id: "077", name: "Ponyta", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png" },
    { id: "078", name: "Galopa", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png" },
    { id: "079", name: "Ramoloss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png" },
    { id: "080", name: "Flagadoss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png" },
    { id: "081", name: "Magnéti", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png" },
    { id: "082", name: "Magnéton", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png" },
    { id: "083", name: "Canarticho", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png" },
    { id: "084", name: "Doduo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/84.png" },
    { id: "085", name: "Dodrio", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/85.png" },
    { id: "086", name: "Otaria", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/86.png" },
    { id: "087", name: "Lamantine", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png" },
    { id: "088", name: "Tadmorv", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png" },
    { id: "089", name: "Grotadmorv", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png" },
    { id: "090", name: "Kokiyas", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png" },
    { id: "091", name: "Crustabri", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png" },
    { id: "092", name: "Fantominus", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png" },
    { id: "093", name: "Spectrum", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png" },
    { id: "094", name: "Ectoplasma", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" },
    { id: "095", name: "Onix", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png" },
    { id: "096", name: "Soporifik", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png" },
    { id: "097", name: "Hypnomade", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png" },
    { id: "098", name: "Krabby", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/98.png" },
    { id: "099", name: "Krabboss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png" },
    { id: "100", name: "Voltorbe", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png" },
    { id: "101", name: "Électrode", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png" },
    { id: "102", name: "Noeunoeuf", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png" },
    { id: "103", name: "Noadkoko", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png" },
    { id: "104", name: "Oselet", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png" },
    { id: "105", name: "Ossatueur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png" },
    { id: "106", name: "Kicklee", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png" },
    { id: "107", name: "Tygnon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png" },
    { id: "108", name: "Excelangue", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/108.png" },
    { id: "109", name: "Smogo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png" },
    { id: "110", name: "Smogogo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png" },
    { id: "111", name: "Rhinocorne", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/111.png" },
    { id: "112", name: "Rhinoféros", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png" },
    { id: "113", name: "Levainard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png" },
    { id: "114", name: "Saquedeneu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png" },
    { id: "115", name: "Kangourex", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png" },
    { id: "116", name: "Hypotrempe", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png" },
    { id: "117", name: "Hypocéan", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/117.png" },
    { id: "118", name: "Poissirène", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/118.png" },
    { id: "119", name: "Poissoroy", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/119.png" },
    { id: "120", name: "Stari", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png" },
    { id: "121", name: "Staross", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png" },
    { id: "122", name: "M. Mime", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png" },
    { id: "123", name: "Insecateur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png" },
    { id: "124", name: "Lippoutou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png" },
    { id: "125", name: "Élektek", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png" },
    { id: "126", name: "Magmar", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png" },
    { id: "127", name: "Scarabrute", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png" },
    { id: "128", name: "Tauros", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png" },
    { id: "129", name: "Magicarp", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" },
    { id: "130", name: "Léviator", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png" },
    { id: "131", name: "Lokhlass", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png" },
    { id: "132", name: "Métamorph", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" },
    { id: "133", name: "Évoli", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png" },
    { id: "134", name: "Aquali", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png" },
    { id: "135", name: "Voltali", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png" },
    { id: "136", name: "Pyroli", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png" },
    { id: "137", name: "Porygon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png" },
    { id: "138", name: "Amonita", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/138.png" },
    { id: "139", name: "Amonistar", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/139.png" },
    { id: "140", name: "Kabuto", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/140.png" },
    { id: "141", name: "Kabutops", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png" },
    { id: "142", name: "Ptéra", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png" },
    { id: "143", name: "Ronflex", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" },
    { id: "144", name: "Artikodin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png" },
    { id: "145", name: "Électhor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png" },
    { id: "146", name: "Sulfura", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png" },
    { id: "147", name: "Minidraco", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png" },
    { id: "148", name: "Draco", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png" },
    { id: "149", name: "Dracolosse", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" },
    { id: "150", name: "Mewtwo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" },
    { id: "151", name: "Mew", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png" },
    { id: "152", name: "Germignon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png" },
    { id: "153", name: "Macronium", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png" },
    { id: "154", name: "Méganium", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png" },
    { id: "155", name: "Héricendre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png" },
    { id: "156", name: "Feurisson", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/156.png" },
    { id: "157", name: "Typhlosion", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png" },
    { id: "158", name: "Kaiminus", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png" },
    { id: "159", name: "Crocrodil", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png" },
    { id: "160", name: "Aligatueur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png" },
    { id: "161", name: "Fouinette", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/161.png" },
    { id: "162", name: "Fouinar", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/162.png" },
    { id: "163", name: "Hoothoot", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/163.png" },
    { id: "164", name: "Noarfang", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/164.png" },
    { id: "165", name: "Coxy", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/165.png" },
    { id: "166", name: "Coxyclaque", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/166.png" },
    { id: "167", name: "Mimigal", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/167.png" },
    { id: "168", name: "Migalos", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png" },
    { id: "169", name: "Nostenfer", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png" },
    { id: "170", name: "Loupio", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/170.png" },
    { id: "171", name: "Lanturn", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/171.png" },
    { id: "172", name: "Pichu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png" },
    { id: "173", name: "Mélo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/173.png" },
    { id: "174", name: "Toudoudou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png" },
    { id: "175", name: "Togepi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png" },
    { id: "176", name: "Togetic", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/176.png" },
    { id: "177", name: "Natu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/177.png" },
    { id: "178", name: "Xatu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/178.png" },
    { id: "179", name: "Wattouat", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png" },
    { id: "180", name: "Lainergie", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png" },
    { id: "181", name: "Pharamp", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png" },
    { id: "182", name: "Joliflor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/182.png" },
    { id: "183", name: "Marill", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/183.png" },
    { id: "184", name: "Azumarill", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png" },
    { id: "185", name: "Simularbre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png" },
    { id: "186", name: "Tarpaud", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/186.png" },
    { id: "187", name: "Granivol", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/187.png" },
    { id: "188", name: "Floravol", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/188.png" },
    { id: "189", name: "Cotovol", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/189.png" },
    { id: "190", name: "Capumain", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/190.png" },
    { id: "191", name: "Tournegrin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/191.png" },
    { id: "192", name: "Héliatronc", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/192.png" },
    { id: "193", name: "Yanma", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/193.png" },
    { id: "194", name: "Axoloto", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/194.png" },
    { id: "195", name: "Maraiste", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/195.png" },
    { id: "196", name: "Mentali", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png" },
    { id: "197", name: "Noctali", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png" },
    { id: "198", name: "Cornèbre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/198.png" },
    { id: "199", name: "Roigada", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png" },
    { id: "200", name: "Feuforêve", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png" },
    { id: "201", name: "Unown", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png" },
    { id: "202", name: "Qulbutoké", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/202.png" },
    { id: "203", name: "Girafarig", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/203.png" },
    { id: "204", name: "Pomdepik", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/204.png" },
    { id: "205", name: "Forretress", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/205.png" },
    { id: "206", name: "Insolourdo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/206.png" },
    { id: "207", name: "Scorplane", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/207.png" },
    { id: "208", name: "Steelix", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png" },
    { id: "209", name: "Snubbull", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/209.png" },
    { id: "210", name: "Granbull", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/210.png" },
    { id: "211", name: "Qwilfish", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/211.png" },
    { id: "212", name: "Cizayox", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png" },
    { id: "213", name: "Caratroc", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/213.png" },
    { id: "214", name: "Scarhino", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png" },
    { id: "215", name: "Farfuret", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png" },
    { id: "216", name: "Teddiursa", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/216.png" },
    { id: "217", name: "Ursaring", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/217.png" },
    { id: "218", name: "Limagma", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/218.png" },
    { id: "219", name: "Volcaropod", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/219.png" },
    { id: "220", name: "Marcacrin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/220.png" },
    { id: "221", name: "Cochignon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/221.png" },
    { id: "222", name: "Corayon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/222.png" },
    { id: "223", name: "Rémoraid", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/223.png" },
    { id: "224", name: "Octillery", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/224.png" },
    { id: "225", name: "Cadoizo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png" },
    { id: "226", name: "Démanta", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/226.png" },
    { id: "227", name: "Airmure", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png" },
    { id: "228", name: "Malosse", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png" },
    { id: "229", name: "Démolosse", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png" },
    { id: "230", name: "Hyporoi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/230.png" },
    { id: "231", name: "Phanpy", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/231.png" },
    { id: "232", name: "Donphan", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/232.png" },
    { id: "233", name: "Porygon2", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/233.png" },
    { id: "234", name: "Cerfrousse", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/234.png" },
    { id: "235", name: "Queulorior", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/235.png" },
    { id: "236", name: "Debugant", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/236.png" },
    { id: "237", name: "Kapoera", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/237.png" },
    { id: "238", name: "Lippouti", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/238.png" },
    { id: "239", name: "Élekid", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/239.png" },
    { id: "240", name: "Magby", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/240.png" },
    { id: "241", name: "Écrémeuh", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/241.png" },
    { id: "242", name: "Leuphorie", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/242.png" },
    { id: "243", name: "Raikou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png" },
    { id: "244", name: "Entei", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png" },
    { id: "245", name: "Suicune", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png" },
    { id: "246", name: "Embrylex", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png" },
    { id: "247", name: "Ymphect", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png" },
    { id: "248", name: "Tyranocif", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png" },
    { id: "249", name: "Lugia", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" },
    { id: "250", name: "Ho-Oh", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png" },
    { id: "251", name: "Celebi", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png" }
];
// Les zones servent de décor et de durée d'expédition (le butin est maintenant défini aléatoirement dans checkExpeditionEnd)
const ZONES = [
    { id: 0, name: "Forêt de Jade", duration: 1200, desc: "Exploration Courte (20 min)" },
    { id: 1, name: "Mont Sélénite", duration: 2700, desc: "Exploration Longue (45 min)" }
];

// Arènes beaucoup plus accessibles et logiques
const CHAMPIONS = [
    { id: "pierre", name: "Pierre (Niv recomm. 15+)", hp: 2000, atk: 50, rewardMoney: 10000, rewardStone: "pierreFeu" },
    { id: "ondine", name: "Ondine (Niv recomm. 30+)", hp: 5000, atk: 120, rewardMoney: 10000, rewardStone: "pierreEau" },
    { id: "major_bob", name: "M. Bob (Niv recomm. 45+)", hp: 9000, atk: 250, rewardMoney: 10000, rewardStone: "pierreFoudre" },
    { id: "erika", name: "Erika (Niv recomm. 60+)", hp: 15000, atk: 400, rewardMoney: 10000, rewardStone: "pierreLune" },
    { id: "koga", name: "Koga (Niv recomm. 75+)", hp: 25000, atk: 600, rewardMoney: 10000, rewardStone: "pierrePlante" },
    { id: "morgane", name: "Morgane (Niv recomm. 90+)", hp: 40000, atk: 900, rewardMoney: 10000, rewardStone: "pierreLune" },
    { id: "auguste", name: "Auguste (Niv recomm. 100+)", hp: 60000, atk: 1300, rewardMoney: 10000, rewardStone: "pierreFeu" },
    { id: "giovanni", name: "Giovanni (Niv recomm. 120+)", hp: 90000, atk: 2000, rewardMoney: 10000, rewardStone: "pierrePlante" }
];

const ACHIEVEMENTS_CONFIG = [
    {
        id: "leg_artikodin", title: "Le Gardien d'Aquali", desc: "Obtenir Aquali pour débloquer Artikodin.",
        check: () => [...gameState.activeTeam, ...gameState.reserve].some(p => p.name === "Aquali"),
        monster: { name: "Artikodin", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/144.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 450, onExpedition: false }
    },
    {
        id: "leg_electhor", title: "L'Éclair de Voltali", desc: "Obtenir Voltali pour débloquer Électhor.",
        check: () => [...gameState.activeTeam, ...gameState.reserve].some(p => p.name === "Voltali"),
        monster: { name: "Électhor", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/145.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 460, onExpedition: false }
    },
    {
        id: "leg_sulfura", title: "La Flamme de Pyroli", desc: "Obtenir Pyroli pour débloquer Sulfura.",
        check: () => [...gameState.activeTeam, ...gameState.reserve].some(p => p.name === "Pyroli"),
        monster: { name: "Sulfura", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/146.gif", level: 50, xp: 0, xpNeeded: 5000, incomePerMin: 440, onExpedition: false }
    },
    {
        id: "leg_mewtwo", title: "Le Clone Idéal", desc: "Avoir débloqué au moins 120 Pokémon uniques.",
        check: () => gameState.discoveredPokemon.length >= 120,
        monster: { name: "Mewtwo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif", level: 70, xp: 0, xpNeeded: 7000, incomePerMin: 490, onExpedition: false }
    },
    {
        id: "leg_mew", title: "Le Mythe Originel", desc: "Avoir débloqué au moins 150 Pokémon uniques.",
        check: () => gameState.discoveredPokemon.length >= 150,
        monster: { name: "Mew", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif", level: 5, xp: 0, xpNeeded: 500, incomePerMin: 500, onExpedition: false }
    }
];

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
    const legendaires = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi"];
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

    // On récupère le parent (priorité au slot 1, sinon slot 2)
    let parent = gameState.pension[0] || gameState.pension[1];
    
    // On crée le bébé à partir du parent
    let bebe = { 
        id: Date.now() + Math.random(), 
        name: parent.name, 
        image: parent.image, 
        level: 1, 
        incomePerMin: Math.floor(generateRandomStats(150) * 1.25),
        onExpedition: false 
    };

    gameState.reserve.push(bebe);
    gameState.activeEggIncubation = null; // On libère l'incubateur
    
    showNotification(`🐣 Félicitations ! ${parent.name} a pondu un œuf qui a éclos en ${bebe.name} !`);
    
    discoverPokemon(parent.name); 
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
            if (!m.onExpedition) {
                let tickIncome = calculateTickIncome(m); earnedMoney += (tickIncome * totalTicks) * 0.20;
                m.xp += 25 * totalTicks; while (m.xp >= m.xpNeeded) { m.xp -= m.xpNeeded; m.level++; m.xpNeeded = m.level * 100; }
            }
        });
        if (earnedMoney > 0) {
            gameState.money += earnedMoney;
            showNotification(`💤 Retour ! Abs de ${(elapsedMs / 60000).toFixed(1)}m. 💰 +${Math.floor(earnedMoney)} PO.`);
        }
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
    // --- NOUVEAU CODE PROMO SPÉCIAL ---
    else if (code === "PRECIEUSELAURA") {
        // Liste des cadeaux
        let cadeauxLaura = [
            { name: "Canarticho", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png", incomePerMin: 180 },
            { name: "Kicklee", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png", incomePerMin: 200 },
            { name: "Tygnon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png", incomePerMin: 200 },
            { name: "Levainard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png", incomePerMin: 250 },
            { name: "Miaouss", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png", incomePerMin: 150, nextForm: "Persian", evolutionCondition: "level", evolutionLevel: 28 }
        ];

        // On ajoute les 5 Pokémon directement dans la réserve du joueur
        cadeauxLaura.forEach(poke => {
            let finalIncome = generateRandomStats(poke.incomePerMin);
            let p = { 
                id: Date.now() + Math.random(), 
                name: poke.name, 
                image: poke.image, 
                nextForm: poke.nextForm || null, 
                level: 1, xp: 0, xpNeeded: 100, 
                incomePerMin: finalIncome, 
                evolutionCondition: poke.evolutionCondition || null, 
                evolutionLevel: poke.evolutionLevel || null, 
                onExpedition: false 
            };
            gameState.reserve.push(p);
            discoverPokemon(p.name);
        });

        // On ajoute les 6 Bonbons Max
        gameState.items.bonbonMax += 6;
        gameState.claimedCodes.push(code); 
        sortReserveByID(); 
        
        showNotification(`🎉 Code accepté ! Canarticho, Kicklee, Tygnon, Levainard, Miaouss et 6 Bonbons Max ont été ajoutés à votre compte !`);
    } 
    else { 
        showNotification("Code inconnu..."); 
    }
    
    input.value = ""; 
    saveGame(); 
    updateUI();
}
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

function checkExpeditionEnd() {
    if (gameState.activeExpedition && Date.now() >= gameState.activeExpedition.endTime) {
        // 1. Les Pokémon rentrent automatiquement au ranch
        gameState.activeTeam.forEach(m => m.onExpedition = false); 
        
        // 2. Calcul du butin
        let nbPierres = 0;
        let nbBonbons = 0;
        let pierresDispos = ["pierreEau", "pierreFeu", "pierreFoudre", "pierreLune", "pierrePlante", "pierreSoleil"];

        for (let i = 0; i < gameState.activeExpedition.count; i++) {
            if (Math.random() > 0.5) {
                let p = pierresDispos[Math.floor(Math.random() * pierresDispos.length)];
                gameState.items[p]++;
                nbPierres++;
            } else {
                let amount = Math.floor(Math.random() * 2) + 2; 
                gameState.items.bonbonSimple += amount;
                nbBonbons += amount;
            }
        }
        
        let msg = `🧭 Expédition terminée ! Vos Pokémon sont rentrés au ranch et travaillent à nouveau. Butin : `;
        if (nbPierres > 0) msg += `${nbPierres} Pierre(s). `;
        if (nbBonbons > 0) msg += `${nbBonbons} Bonbon(s) Simple.`;
        
        showNotification(msg); 
        gameState.activeExpedition = null; 
        saveGame(); 
        updateUI();
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
    let isRare = m.incomePerMin >= 200 || (POKEDEX && ((POKEDEX.kanto && POKEDEX.kanto.rare.some(p => p.name === m.name)) || (POKEDEX.johto && POKEDEX.johto.rare.some(p => p.name === m.name))));

    div.className = `monster-card ${m.onExpedition ? 'on-expedition' : ''} ${isLegendary ? 'legend-border' : isRare ? 'rare-border' : ''}`;
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
        } else if (isReadyForLevelEvo) { evolveMonster(m.id); }
        else { switchZone(m.id, loc); }
    };

    let tick = calculateTickIncome(m);
    let affichagePO = m.isBaby ? `⭐ +${tick} PO` : `+${tick} PO`;

    div.innerHTML = `<div class="monster-image-container"><img src="${m.image}"></div><div class="monster-info"><div class="monster-name ${isReadyForLevelEvo ? 'gold-evo-text' : ''}">${m.name}</div><div class="monster-xp">Lvl ${m.level}</div><div class="monster-income">${affichagePO}</div></div>`;

    if ((m.evolutionCondition === "special_eevee" || m.name === "Évoli") && loc === 'team' && !m.onExpedition) {
        let c = document.createElement("div"); c.className = "monster-actions";
        ["pierreEau", "pierreFeu", "pierreFoudre"].forEach((st, idx) => {
            let b = document.createElement("button"); b.className = `action-btn ${gameState.items[st] > 0 ? 'evo-ready' : 'evo-locked'}`;
            b.innerText = ["💧", "🔥", "⚡"][idx]; b.onclick = (ev) => { ev.stopPropagation(); triggerEeveeEvolution(m.id, st); }; c.appendChild(b);
        }); div.appendChild(c);
    } else if (m.evolutionCondition === "item" && loc === 'team' && !m.onExpedition && gameState.items[m.itemNeeded] > 0) {
        let emoji = { pierreFoudre: "⚡", pierreFeu: "🔥", pierreLune: "🌙", pierreEau: "💧", pierrePlante: "🍃", pierreSoleil: "☀️" }[m.itemNeeded] || "💎";
        let b = document.createElement("button"); b.className = "evolve-btn evo-ready"; b.innerText = `ÉVOLUER (${emoji})`;
        b.onclick = (ev) => { ev.stopPropagation(); useEvolutionItem(m.id); }; div.appendChild(b);
    }
    if (loc === 'reserve' && multiReleaseMode) {
        let isChecked = selectedForRelease.includes(m.id);
        let chk = document.createElement("input"); chk.type = "checkbox"; chk.className = "release-checkbox";
        chk.style.cssText = "position:absolute; top:2px; right:2px; z-index:12;"; chk.checked = isChecked;
        chk.onchange = (ev) => { triggerCheckboxSelection(m.id, ev.target.checked, div); }; div.appendChild(chk);
    }
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

    setInterval(() => {
        if (gameState.activeExpedition) {
            let rem = Math.ceil((gameState.activeExpedition.endTime - Date.now()) / 1000);
            if (document.getElementById("expeditions-active-box")) document.getElementById("expeditions-active-box").style.display = "block";
            if (document.getElementById("expedition-timer")) document.getElementById("expedition-timer").innerText = rem > 0 ? `${Math.floor(rem / 60)}:${(rem % 60).toString().padStart(2, '0')}` : "Fini !";
        } else { if (document.getElementById("expeditions-active-box")) document.getElementById("expeditions-active-box").style.display = "none"; }
    }, 1000);

    setInterval(() => {
        let gainsDuTick = 0;
        gameState.activeTeam.forEach(m => {
            if (!m.onExpedition) {
                let tickIncome = calculateTickIncome(m);
                gainsDuTick += tickIncome;
                m.xp += 25;
                while (m.xp >= m.xpNeeded) { m.xp -= m.xpNeeded; m.level++; m.xpNeeded = m.level * 100; }
            }
        });

        gameState.money += gainsDuTick;

        if (gameState.activeEggIncubation) {
            gameState.activeEggIncubation.progress += gainsDuTick;
            if (gameState.activeEggIncubation.progress > 50000) {
                gameState.activeEggIncubation.progress = 50000;
            }
        }

        checkAchievements(); checkExpeditionEnd(); saveGame(); updateUI();
    }, 10000);

    setInterval(() => { initAreneUI(); }, 60000);
    initAreneUI(); updateUI();
};

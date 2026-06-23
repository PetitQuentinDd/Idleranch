// game.js
let gameState = {
    money: 10000,    
    eggCost: 5000,  
    activeTeam: [], 
    reserve: [],    
    items: { pierreEau: 0, pierreFeu: 0, pierreFoudre: 0, pierreLune: 0, pierrePlante: 0 }, 
    discoveredPokemon: [],      
    activeExpedition: null,
    claimedCodes: [], 
    unlockedAchievements: [],
    areneCooldowns: {},
    lastSaveTime: Date.now() 
};

// Variables globales pour gérer la sélection multiple dans la réserve
let multiReleaseMode = false;
let selectedForRelease = [];
let combatInterval = null;

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
    { id: "151", name: "Mew", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png" }
];

const ZONES = [
    { id: 0, name: "Forêt de Jade", duration: 1200, desc: "Exploration (20 min)", pool: ["pierreEau", "pierrePlante", "pierreFoudre"] },
    { id: 1, name: "Mont Sélénite", duration: 2700, desc: "Exploration (45 min)", pool: ["pierreEau", "pierreFeu", "pierreFoudre", "pierreLune"] }
];

const CHAMPIONS = [
    { id: "pierre", name: "Pierre (Badge Roche)", hp: 12000, atk: 25, rewardMoney: 3000, rewardStone: "pierreFeu" },
    { id: "ondine", name: "Ondine (Badge Cascade)", hp: 28000, atk: 55, rewardMoney: 5000, rewardStone: "pierreEau" },
    { id: "major_bob", name: "Major Bob (Badge Foudre)", hp: 60000, atk: 110, rewardMoney: 8000, rewardStone: "pierreFoudre" },
    { id: "erika", name: "Erika (Badge Prisme)", hp: 130000, atk: 250, rewardMoney: 12000, rewardStone: "pierreLune" },
    { id: "koga", name: "Koga (Badge Ame)", hp: 250000, atk: 450, rewardMoney: 18000, rewardStone: "pierrePlante" },
    { id: "morgane", name: "Morgane (Badge Marais)", hp: 500000, atk: 800, rewardMoney: 25000, rewardStone: "pierreLune" },
    { id: "auguste", name: "Auguste (Badge Volcan)", hp: 1000000, atk: 1500, rewardMoney: 35000, rewardStone: "pierreFeu" },
    { id: "giovanni", name: "Giovanni (Badge Terre)", hp: 2500000, atk: 3000, rewardMoney: 5000, rewardStone: "pierrePlante" }
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
    let container = document.getElementById("game-container");
    if (!container) return;
    let oldNotify = document.querySelector(".game-notification");
    if (oldNotify) oldNotify.remove();
    let div = document.createElement("div");
    div.className = "game-notification";
    div.innerText = text;
    container.appendChild(div);
    setTimeout(() => { div.remove(); }, 4000);
}

function generateRandomStats(baseValue) {
    let minModifier = 0.85; 
    let maxModifier = 1.20; 
    let randomMod = Math.random() * (maxModifier - minModifier) + minModifier;
    return Math.floor(baseValue * randomMod);
}

function calculateTickIncome(m) {
    let lvlBonus = (m.level - 1) * 2;
    return Math.floor((m.incomePerMin + lvlBonus) / 6);
}

function sortReserveByID() {
    gameState.reserve.sort((a, b) => {
        let pA = POKEDEX_LIST.find(p => p.name === a.name);
        let pB = POKEDEX_LIST.find(p => p.name === b.name);
        let idA = pA ? parseInt(pA.id) : 999;
        let idB = pB ? parseInt(pB.id) : 999;
        return idA - idB;
    });
}

function checkAchievements() {
    ACHIEVEMENTS_CONFIG.forEach(ach => {
        if (!gameState.unlockedAchievements.includes(ach.id) && ach.check()) {
            gameState.unlockedAchievements.push(ach.id);
            let finalIncome = generateRandomStats(ach.monster.incomePerMin);
            let p = { ...ach.monster, incomePerMin: finalIncome, id: Date.now() + Math.random() };
            gameState.reserve.push(p);
            if (!gameState.discoveredPokemon.includes(p.name)) { 
                gameState.discoveredPokemon.push(p.name); 
            }
            sortReserveByID();
            showNotification(`🏆 SUCCÈS : [${ach.title}] !\n${p.name} rejoint votre Réserve !`);
            saveGame();
        }
    });
}

function discoverPokemon(name) { 
    if (!gameState.discoveredPokemon.includes(name)) { 
        gameState.discoveredPokemon.push(name); 
    } 
    checkAchievements();
    saveGame();
}

function saveGame() { 
    gameState.lastSaveTime = Date.now(); 
    localStorage.setItem("pokemonBreeder_save", JSON.stringify(gameState)); 
}

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
        gameState.activeTeam.push(p);
        discoverPokemon(p.name);
    }
}

function processOfflineProgress() {
    let now = Date.now();
    let elapsedMs = now - gameState.lastSaveTime;
    let totalTicks = Math.floor(elapsedMs / 10000); 

    if (totalTicks > 0) {
        let earnedMoney = 0;
        gameState.activeTeam.forEach(m => {
            if (!m.onExpedition) {
                let tickIncome = calculateTickIncome(m);
                earnedMoney += (tickIncome * totalTicks) * 0.20;
                let totalXpGained = 25 * totalTicks;
                m.xp += totalXpGained;
                while (m.xp >= m.xpNeeded) {
                    m.xp -= m.xpNeeded;
                    m.level++;
                    m.xpNeeded = m.level * 100;
                }
            }
        });
        if (earnedMoney > 0) {
            gameState.money += earnedMoney;
            showNotification(`💤 Retour ! Abs de ${(elapsedMs/60000).toFixed(1)}m. 💰 +${Math.floor(earnedMoney)} PO (Malus Hors-ligne 20%).`);
        }
    }
    gameState.lastSaveTime = now;
    saveGame();
}

function loadGame() {
    let data = localStorage.getItem("pokemonBreeder_save");
    if (data) {
        try {
            gameState = JSON.parse(data);
            if (!gameState.items) gameState.items = { pierreEau: 0, pierreFeu: 0, pierreFoudre: 0, pierreLune: 0, pierrePlante: 0 };
            if (!gameState.items.pierrePlante) gameState.items.pierrePlante = 0;
            if (!gameState.discoveredPokemon) gameState.discoveredPokemon = [];
            if (!gameState.claimedCodes) gameState.claimedCodes = [];
            if (!gameState.unlockedAchievements) gameState.unlockedAchievements = [];
            if (!gameState.areneCooldowns) gameState.areneCooldowns = {};
        } catch (e) {
            localStorage.removeItem("pokemonBreeder_save");
        }
    }
    checkStarterOffer(); 
    sortReserveByID();
    processOfflineProgress();
}

function hardResetGame() {
    if (confirm("🚨 Supprimer définitivement votre sauvegarde ?")) {
        localStorage.removeItem("pokemonBreeder_save");
        location.reload(); 
    }
}

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
        let p = { 
            id: Date.now() + Math.random(), 
            name: "Pikachu (Casquette)", 
            image: "https://www.smogon.com/dex/media/sprites/xy/pikachu-starter.gif", 
            level: 10, 
            xp: 0, 
            xpNeeded: 1000, 
            incomePerMin: finalIncome, 
            onExpedition: false 
        };
        if (gameState.activeTeam.length < 6) gameState.activeTeam.push(p); else gameState.reserve.push(p);
        gameState.claimedCodes.push(code);
        discoverPokemon("Pikachu"); 
        sortReserveByID();
        showNotification(`🎉 Code validé ! Cadeau : ${p.name}`);
    } 
    else if (code === "RICHESSE") {
        let moneyGift = 5000;
        gameState.money += moneyGift;
        gameState.claimedCodes.push(code);
        showNotification(`💰 Code validé ! +${moneyGift} PO !`);
    }
    else if (code === "STARTERFIRE") {
        let finalIncome = generateRandomStats(180);
        let p = { 
            id: Date.now() + Math.random(), 
            name: "Salamèche", 
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif", 
            level: 5, 
            xp: 0, 
            xpNeeded: 500, 
            incomePerMin: finalIncome, 
            nextForm: "Reptincel",
            evolutionCondition: "level",
            evolutionLevel: 16,
            onExpedition: false 
        };
        if (gameState.activeTeam.length < 6) gameState.activeTeam.push(p); else gameState.reserve.push(p);
        gameState.claimedCodes.push(code);
        discoverPokemon(p.name); 
        sortReserveByID();
        showNotification(`🎉 Code validé ! Un ${p.name} rejoint votre ranch !`);
    } 
    else if (code === "FIXPLANTE") {
        gameState.activeTeam.forEach(m => { if (m.name === "Noeunoeuf") m.itemNeeded = "pierrePlante"; });
        gameState.reserve.forEach(m => { if (m.name === "Noeunoeuf") m.itemNeeded = "pierrePlante"; });
        showNotification("🍃 Noeunoeuf mis à jour avec la Pierre Plante !");
    }
    else {
        showNotification("Code inconnu...");
    }

    input.value = "";
    saveGame(); 
    updateUI();
}

function buyEgg() {
    if (gameState.money >= 5000) {
        gameState.money -= 5000;
        let pool = [...POKEDEX.kanto.commun, ...POKEDEX.kanto.rare];
        let rolled = pool[Math.floor(Math.random() * pool.length)];
        
        let finalIncome = generateRandomStats(rolled.incomePerMin);

        let p = { 
            id: Date.now() + Math.random(), 
            name: rolled.name, 
            image: rolled.image, 
            nextForm: rolled.nextForm, 
            level: 1, 
            xp: 0, 
            xpNeeded: 100, 
            incomePerMin: finalIncome, 
            evolutionCondition: rolled.evolutionCondition || null, 
            itemNeeded: rolled.itemNeeded || null, 
            evolutionLevel: rolled.evolutionLevel || null, 
            onExpedition: false 
        };
        
        if (gameState.activeTeam.length < 6) {
            gameState.activeTeam.push(p);
        } else {
            gameState.reserve.push(p);
        }
        showNotification(`🥚 Éclosion ! Un magnifique ${p.name} (+${p.incomePerMin} PO/m) rejoint votre Ranch !`);
        
        discoverPokemon(p.name); 
        sortReserveByID(); 
        saveGame(); 
        updateUI();
    } else { 
        showNotification("Pas assez d'argent !"); 
    }
}

function toggleMultiReleaseMode() {
    multiReleaseMode = !multiReleaseMode;
    selectedForRelease = [];
    updateUI();
}

function confirmMultiRelease() {
    if (selectedForRelease.length === 0) {
        toggleMultiReleaseMode();
        return;
    }
    if (confirm(`🗑️ Êtes-vous sûr de vouloir relâcher ces ${selectedForRelease.length} Pokémon ?`)) {
        gameState.reserve = gameState.reserve.filter(m => !selectedForRelease.includes(m.id));
        showNotification(`✨ ${selectedForRelease.length} Pokémon ont été relâchés.`);
        selectedForRelease = [];
        multiReleaseMode = false;
        saveGame();
        updateUI();
    }
}

function useEvolutionItem(id) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id);
    if (idx === -1 || gameState.activeTeam[idx].onExpedition) return;
    
    let m = gameState.activeTeam[idx];
    let stoneType = m.itemNeeded;
    
    if (gameState.items[stoneType] <= 0) { 
        let stoneNames = { pierreFeu: "Pierre Feu", pierreFoudre: "Pierre Foudre", pierreLune: "Pierre Lune", pierreEau: "Pierre Eau", pierrePlante: "Pierre Plante" };
        showNotification(`Pas de ${stoneNames[stoneType] || "Pierre"} en stock !`); 
        return; 
    }
    
    gameState.items[stoneType]--;
    let config = POKEDEX.kanto.evolutions[m.nextForm];
    
    if (config) {
        let basePreviousForm = [...POKEDEX.kanto.commun, ...POKEDEX.kanto.rare].find(p => p.nextForm === config.name) || POKEDEX.kanto.evolutions[m.name];
        let previousBaseIncome = basePreviousForm ? basePreviousForm.incomePerMin : m.incomePerMin;
        let potentialRatio = m.incomePerMin / previousBaseIncome;

        m.name = config.name; 
        m.image = config.image; 
        m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio); 
        m.evolutionCondition = config.evolutionCondition || null; 
        m.nextForm = config.nextForm || null; 
        m.evolutionLevel = config.evolutionLevel || null; 
        m.itemNeeded = config.itemNeeded || null;
        
        discoverPokemon(m.name); 
        saveGame(); 
        updateUI();
    }
}

function triggerEeveeEvolution(id, item) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id);
    if (idx === -1 || gameState.activeTeam[idx].onExpedition) return;
    if (gameState.items[item] <= 0) { showNotification("Tu n'as pas cette pierre !"); return; }
    
    gameState.items[item]--;
    let name = (item === "pierreEau") ? "Aquali" : (item === "pierreFeu") ? "Pyroli" : "Voltali";
    let config = POKEDEX.kanto.evolutions[name];
    
    let m = gameState.activeTeam[idx];
    let potentialRatio = m.incomePerMin / 240;

    m.name = config.name; 
    m.image = config.image; 
    m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio); 
    m.evolutionCondition = null; m.nextForm = null; m.evolutionLevel = null; m.itemNeeded = null;
    discoverPokemon(m.name); saveGame(); updateUI();
}

function evolveMonster(id) {
    let idx = gameState.activeTeam.findIndex(m => m.id === id); if (idx === -1) return;
    let m = gameState.activeTeam[idx]; let config = POKEDEX.kanto.evolutions[m.nextForm];
    if (config) {
        let basePreviousForm = [...POKEDEX.kanto.commun, ...POKEDEX.kanto.rare].find(p => p.name === m.name) || POKEDEX.kanto.evolutions[m.name];
        let previousBaseIncome = basePreviousForm ? basePreviousForm.incomePerMin : m.incomePerMin;
        let potentialRatio = m.incomePerMin / previousBaseIncome;

        m.name = config.name; 
        m.image = config.image; 
        m.incomePerMin = Math.floor(config.incomePerMin * potentialRatio); 
        m.evolutionLevel = config.evolutionLevel || null; m.nextForm = config.nextForm || null; m.evolutionCondition = config.evolutionCondition || null;
        discoverPokemon(m.name); saveGame(); updateUI();
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
        let z = ZONES.find(zone => zone.id === gameState.activeExpedition.zoneId);
        gameState.activeTeam.forEach(m => m.onExpedition = false); 
        let str = "";
        for (let i = 0; i < gameState.activeExpedition.count; i++) {
            let r = z.pool[Math.floor(Math.random() * z.pool.length)];
            gameState.items[r]++; str += `1x ${r} `;
        }
        showNotification(`🧭 Expédition finie ! Butin : ${str}`); gameState.activeExpedition = null; saveGame(); updateUI();
    }
}

function initAreneUI() {
    let container = document.getElementById("arene-selection");
    if (!container) return;
    container.innerHTML = "";
    
    if (!gameState.areneCooldowns) gameState.areneCooldowns = {};
    const ARENE_COOLDOWN_MS = 6 * 60 * 60 * 1000; 
    const now = Date.now();

    CHAMPIONS.forEach(c => {
        const lastWinTime = gameState.areneCooldowns[c.id] || 0;
        const timePassed = now - lastWinTime;
        const isLocked = timePassed < ARENE_COOLDOWN_MS;
        
        let btnText = "DÉFIER";
        let disabledAttr = "";

        if (isLocked) {
            const timeLeftMs = ARENE_COOLDOWN_MS - timePassed;
            const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
            btnText = `🔒 ${hours}h${minutes}m`;
            disabledAttr = "disabled";
        }

        let div = document.createElement("div");
        div.className = "champion-card";
        div.innerHTML = `
            <div>
                <h4 style="color:white; margin:0; font-size:11px;">🏆 ${c.name}</h4>
                <p style="margin:2px 0 0 0; font-size:9px; color:#94a3b8;">PV: ${c.hp} | ATK: ${c.atk}/s</p>
            </div>
            <button class="champion-btn" ${disabledAttr} onclick="startCombat('${c.id}')">${btnText}</button>
        `;
        container.appendChild(div);
    });
}

function startCombat(id) {
    if (combatInterval) clearInterval(combatInterval);
    if (gameState.activeTeam.length === 0) { showNotification("Ton enclos est vide !"); return; }

    let boss = CHAMPIONS.find(c => c.id === id);
    let playerMaxHp = gameState.activeTeam.reduce((sum, m) => sum + (m.level * 25), 0);
    let playerAtk = gameState.activeTeam.reduce((sum, m) => sum + calculateTickIncome(m), 0) * 2;

    let pHp = playerMaxHp;
    let bHp = boss.hp;

    document.getElementById("arene-selection").style.display = "none";
    document.getElementById("arene-combat-box").style.display = "block";
    document.getElementById("boss-name").innerText = boss.name;
    document.getElementById("combat-log").innerText = "Le combat commence ! ⚔️";

    combatInterval = setInterval(() => {
        bHp -= playerAtk;
        pHp -= boss.atk;

        document.getElementById("player-hp").innerText = Math.max(0, pHp);
        document.getElementById("boss-hp").innerText = Math.max(0, bHp);
        document.getElementById("combat-log").innerText = `Vous infligez ${playerAtk} dégâts ! Le boss riposte à ${boss.atk}.`;

        if (bHp <= 0) {
            clearInterval(combatInterval);
            combatInterval = null;
            
            if (!gameState.areneCooldowns) gameState.areneCooldowns = {};
            gameState.areneCooldowns[boss.id] = Date.now();

            gameState.money += boss.rewardMoney;
            gameState.items[boss.rewardStone]++;
            showNotification(`🎉 VICTOIRE ! +${boss.rewardMoney} PO et 1x ${boss.rewardStone}. Recharge 6h active.`);
            endCombat();
        } 
        else if (pHp <= 0) {
            clearInterval(combatInterval);
            combatInterval = null;
            showNotification(`❌ Défaite... Entraînez vos Pokémon au ranch !`);
            endCombat();
        }
    }, 1000);
}

function endCombat() {
    document.getElementById("arene-selection").style.display = "block";
    document.getElementById("arene-combat-box").style.display = "none";
    saveGame();
    initAreneUI(); 
    updateUI();
}

function switchZone(id, loc) {
    if (loc === 'team') {
        let idx = gameState.activeTeam.findIndex(m => m.id === id);
        if (idx !== -1 && !gameState.activeTeam[idx].onExpedition) {
            gameState.reserve.push(gameState.activeTeam.splice(idx, 1)[0]);
            sortReserveByID(); 
        }
    } else {
        if (gameState.activeTeam.length >= 6) { showNotification("Enclos plein ! Max 6."); return; }
        let idx = gameState.reserve.findIndex(m => m.id === id);
        if (idx !== -1) gameState.activeTeam.push(gameState.reserve.splice(idx, 1)[0]);
    }
    saveGame(); updateUI();
}

function createCard(m, loc) {
    let div = document.createElement("div"); 
    
    let rarityClass = "";
    let isLegendary = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew"].includes(m.name);
    let isRare = m.incomePerMin >= 200 || (POKEDEX && POKEDEX.kanto && POKEDEX.kanto.rare.some(p => p.name === m.name));

    if (isLegendary) rarityClass = "legend-border";
    else if (isRare) rarityClass = "rare-border";

    div.className = `monster-card ${m.onExpedition ? 'on-expedition' : ''} ${rarityClass}`;
    
    // Détection si prêt pour l'évolution par niveau
    let isReadyForLevelEvo = (m.nextForm && !m.onExpedition && loc === 'team' && m.evolutionCondition === "level" && m.level >= m.evolutionLevel);

    // MODIFIÉ : Quand le joueur clique sur une carte dont le nom est doré, elle évolue directement !
    div.onclick = (e) => { 
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
        
        if (loc === 'reserve' && multiReleaseMode) {
            let checkbox = div.querySelector(".release-checkbox");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                triggerCheckboxSelection(m.id, checkbox.checked, div);
            }
        } else if (isReadyForLevelEvo) {
            // Évolution au clic direct sur la carte dorée !
            evolveMonster(m.id);
        } else {
            switchZone(m.id, loc); 
        }
    };

    let tick = calculateTickIncome(m);
    
    // MODIFIÉ : On ajoute la classe CSS 'gold-evo-text' si le Pokémon a le niveau pour évoluer
    let nameClass = isReadyForLevelEvo ? "monster-name gold-evo-text" : "monster-name";
    
    div.innerHTML = `<div class="monster-image-container"><img src="${m.image}"></div><div class="monster-info"><div class="${nameClass}">${m.name}</div><div class="monster-xp">Lvl ${m.level}</div><div class="monster-income">+${tick} PO</div></div>`;
    
    // --- BOUTONS POUR LES PIERRES (RESTE EN PLACE ET EN COULEURS) ---
    if ((m.evolutionCondition === "special_eevee" || m.name === "Évoli") && loc === 'team' && !m.onExpedition) {
        let c = document.createElement("div"); c.className = "monster-actions";
        
        let bW = document.createElement("button"); 
        bW.className = `action-btn ${gameState.items.pierreEau > 0 ? 'evo-ready' : 'evo-locked'}`; 
        bW.innerText = "💧"; bW.onclick = (ev) => { ev.stopPropagation(); triggerEeveeEvolution(m.id, "pierreEau"); };
        
        let bF = document.createElement("button"); 
        bF.className = `action-btn ${gameState.items.pierreFeu > 0 ? 'evo-ready' : 'evo-locked'}`; 
        bF.innerText = "🔥"; bF.onclick = (ev) => { ev.stopPropagation(); triggerEeveeEvolution(m.id, "pierreFeu"); };
        
        let bT = document.createElement("button"); 
        bT.className = `action-btn ${gameState.items.pierreFoudre > 0 ? 'evo-ready' : 'evo-locked'}`; 
        bT.innerText = "⚡"; bT.onclick = (ev) => { ev.stopPropagation(); triggerEeveeEvolution(m.id, "pierreFoudre"); };
        
        c.appendChild(bW); c.appendChild(bF); c.appendChild(bT); div.appendChild(c);
    } 
    else if (m.evolutionCondition === "item" && loc === 'team' && !m.onExpedition) {
        let stoneEmojis = { pierreFoudre: "⚡", pierreFeu: "🔥", pierreLune: "🌙", pierreEau: "💧", pierrePlante: "🍃" };
        let emoji = stoneEmojis[m.itemNeeded] || "💎";
        
        let hasItem = gameState.items[m.itemNeeded] > 0;
        let b = document.createElement("button"); 
        b.className = `evolve-btn ${hasItem ? 'evo-ready' : 'evo-locked'}`; 
        b.innerText = `ÉVOLUER (${emoji})`; 
        b.onclick = (ev) => { ev.stopPropagation(); useEvolutionItem(m.id); }; 
        div.appendChild(b);
    }
    // NOTE : Le bloc "else if (m.nextForm ...)" gérant le bouton blanc par niveau a été entièrement supprimé d'ici !

    if (loc === 'reserve' && multiReleaseMode) {
        let isChecked = selectedForRelease.includes(m.id);
        let chk = document.createElement("input");
        chk.type = "checkbox";
        chk.className = "release-checkbox";
        chk.style.position = "absolute";
        chk.style.top = "2px";
        chk.style.right = "2px";
        chk.style.zIndex = "12";
        chk.checked = isChecked;
        if (isChecked) div.style.backgroundColor = "rgba(239, 68, 68, 0.3)";
        chk.onchange = (ev) => { triggerCheckboxSelection(m.id, ev.target.checked, div); };
        div.appendChild(chk);
    }
    return div;
}

function triggerCheckboxSelection(id, checked, cardElement) {
    if (checked) {
        if (!selectedForRelease.includes(id)) selectedForRelease.push(id);
        cardElement.style.backgroundColor = "rgba(239, 68, 68, 0.3)";
    } else {
        selectedForRelease = selectedForRelease.filter(sid => sid !== id);
        cardElement.style.backgroundColor = "";
    }
    let btn = document.getElementById("confirm-release-btn");
    if(btn) btn.innerText = selectedForRelease.length > 0 ? `CONFIRMER (${selectedForRelease.length})` : "ANNULER";
}

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if(document.getElementById(tabId)) document.getElementById(tabId).classList.add('active');
    
    if (tabId === 'tab-stock') {
        if(document.getElementById('nav-tab-stock')) document.getElementById('nav-tab-stock').classList.add('active');
    } else {
        if(document.getElementById('nav-' + tabId)) document.getElementById('nav-' + tabId).classList.add('active');
    }
}

function updateUI() {
    if (document.getElementById("money")) {
        document.getElementById("money").innerText = Math.floor(gameState.money);
    }
    
    if (document.getElementById("count-pierreEau")) document.getElementById("count-pierreEau").innerText = gameState.items.pierreEau || 0;
    if (document.getElementById("count-pierreFeu")) document.getElementById("count-pierreFeu").innerText = gameState.items.pierreFeu || 0;
    if (document.getElementById("count-pierreFoudre")) document.getElementById("count-pierreFoudre").innerText = gameState.items.pierreFoudre || 0;
    
    let luneText = document.getElementById("count-pierreLune");
    if(luneText) luneText.innerText = gameState.items.pierreLune || 0;

    let planteText = document.getElementById("count-pierrePlante");
    if(planteText) planteText.innerText = gameState.items.pierrePlante || 0;
    
    if (document.getElementById("bag-pierreEau")) document.getElementById("bag-pierreEau").innerText = gameState.items.pierreEau || 0;
    if (document.getElementById("bag-pierreFeu")) document.getElementById("bag-pierreFeu").innerText = gameState.items.pierreFeu || 0;
    if (document.getElementById("bag-pierreFoudre")) document.getElementById("bag-pierreFoudre").innerText = gameState.items.pierreFoudre || 0;
    if (document.getElementById("bag-pierreLune")) document.getElementById("bag-pierreLune").innerText = gameState.items.pierreLune || 0;
    if (document.getElementById("bag-pierrePlante")) document.getElementById("bag-pierrePlante").innerText = gameState.items.pierrePlante || 0;

    if (document.getElementById("team-count")) {
        document.getElementById("team-count").innerText = gameState.activeTeam.length;
    }

    let teamBox = document.getElementById("active-team"); 
    if (teamBox) {
        teamBox.innerHTML = "";
        gameState.activeTeam.forEach(m => teamBox.appendChild(createCard(m, 'team')));
    }

    let stockTab = document.getElementById("tab-stock");
    if (stockTab) {
        let actionBox = document.getElementById("multi-release-actions");
        if (!actionBox) {
            actionBox = document.createElement("div");
            actionBox.id = "multi-release-actions";
            actionBox.style.display = "flex";
            actionBox.style.gap = "10px";
            actionBox.style.marginBottom = "8px";
            stockTab.insertBefore(actionBox, stockTab.firstChild);
        }
        
        actionBox.innerHTML = "";
        if (!multiReleaseMode) {
            let btn = document.createElement("button");
            btn.className = "zone-btn";
            btn.style.padding = "6px 12px";
            btn.innerText = "🗑️ MODE LIBÉRATION";
            btn.onclick = toggleMultiReleaseMode;
            actionBox.appendChild(btn);
        } else {
            let btnConfirm = document.createElement("button");
            btnConfirm.id = "confirm-release-btn";
            btnConfirm.className = "champion-btn";
            btnConfirm.style.padding = "6px 12px";
            btnConfirm.innerText = selectedForRelease.length > 0 ? `CONFIRMER (${selectedForRelease.length})` : "ANNULER";
            btnConfirm.onclick = confirmMultiRelease;
            
            let btnCancel = document.createElement("button");
            btnCancel.className = "zone-btn";
            btnCancel.style.padding = "6px 12px";
            btnCancel.style.background = "#4a5568";
            btnCancel.style.color = "white";
            btnCancel.innerText = "RETOUR";
            btnCancel.onclick = toggleMultiReleaseMode;

            actionBox.appendChild(btnConfirm);
            actionBox.appendChild(btnCancel);
        }
    }

    let resBox = document.getElementById("reserve"); 
    if (resBox) {
        resBox.innerHTML = ""; 
        gameState.reserve.forEach(m => resBox.appendChild(createCard(m, 'reserve')));
    }

    let grid = document.getElementById("pokedex-grid");
    if (grid) {
        grid.innerHTML = "";
        POKEDEX_LIST.forEach(p => {
            let has = gameState.discoveredPokemon.includes(p.name);
            let div = document.createElement("div"); div.className = `pokedex-entry ${has ? '' : 'locked'}`;
            div.innerHTML = `<span class="pokedex-number">#${p.id}</span><img src="${p.image}"><div class="pokemon-name-tag">${has ? p.name : "???"}</div>`;
            grid.appendChild(div);
        });
    }
    if (document.getElementById("pokedex-count-ratio")) {
        document.getElementById("pokedex-count-ratio").innerText = `${gameState.discoveredPokemon.length} / ${POKEDEX_LIST.length}`;
    }
    if (document.getElementById("pokedex-progress-fill")) {
        document.getElementById("pokedex-progress-fill").style.width = `${(gameState.discoveredPokemon.length / POKEDEX_LIST.length) * 100}%`;
    }

    let succesBox = document.getElementById("succes-list-container");
    if (succesBox) {
        succesBox.innerHTML = "";
        ACHIEVEMENTS_CONFIG.forEach(ach => {
            let done = gameState.unlockedAchievements.includes(ach.id);
            let div = document.createElement("div");
            div.className = `achievement-box ${done ? 'unlocked' : ''}`;
            div.innerHTML = `
                <div class="achievement-title ${done ? 'done' : ''}">
                    ${done ? '🏆 [REÇU]' : '🔒'} ${ach.title}
                </div>
                <div class="achievement-desc">${ach.desc}</div>
            `;
            succesBox.appendChild(div);
        });
    }
}

loadGame();

window.onload = function() {
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
            if (document.getElementById("expedition-timer")) document.getElementById("expedition-timer").innerText = rem > 0 ? `${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')}` : "Fini !";
        } else { 
            if (document.getElementById("expeditions-active-box")) document.getElementById("expeditions-active-box").style.display = "none"; 
        }
    }, 1000);

    setInterval(() => {
        gameState.activeTeam.forEach(m => {
            if (!m.onExpedition) {
                gameState.money += calculateTickIncome(m); 
                m.xp += 25;
                while (m.xp >= m.xpNeeded) { 
                    m.xp -= m.xpNeeded; 
                    m.level++; 
                    m.xpNeeded = m.level * 100; 
                }
            }
        });
        checkAchievements();
        checkExpeditionEnd();
        saveGame(); 
        updateUI();
    }, 10000);

    setInterval(() => {
        initAreneUI();
    }, 60000);

    initAreneUI();
    updateUI();
};
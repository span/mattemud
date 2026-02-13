/**
 * World Data - Spelvärlden
 */

const WORLD_DATA = {
  "rooms": [

    // ═══════════════════════════════════════════
    // ZON 1: AKADEMIN (Addition intro)
    // ═══════════════════════════════════════════

    {
      "id": "akademin_hall",
      "name": "Trollkarlsakademins Hall",
      "description": "Du står i den stora hallen i Trollkarlsakademin. Facklor fladdrar på väggarna och golvet är täckt av mystiska symboler. En gammal trollkarl med långt vitt skägg står vid en pelare och ler mot dig.",
      "first_visit_text": "Välkommen, unga lärling! Jag är Mästare Numerus. För att bli en riktig trollkarl måste du lära dig talens magi. Låt oss börja med något enkelt!",
      "exits": {
        "norr": "akademin_bibliotek",
        "öster": "akademin_ovningsrum"
      },
      "items": [],
      "ascii_art": "      *\n     /|\\\n    / | \\\n   /  |  \\\n      |\n     /|\\\n    / | \\\n   /  |  \\\n      |\n     / \\\n    /   \\"
    },
    {
      "id": "akademin_ovningsrum",
      "name": "Övningsrummet",
      "description": "Ett runt rum med kritcirklar på golvet. Här tränar lärlingarna sin magi. På väggen hänger en tavla med siffror.",
      "first_visit_text": "En röst ekar: 'Bevisa att du kan räkna för att få din första trollstav!'",
      "exits": {
        "väster": "akademin_hall"
      },
      "items": ["Trollstav (låst)"],
      "challenge": {
        "id": "addition_1",
        "category": "addition",
        "difficulty": 1,
        "description": "Magiska siffror lyser på tavlan. Lös dem för att få trollstaven!",
        "reward_xp": 20,
        "reward_gold": 10
      }
    },
    {
      "id": "akademin_bibliotek",
      "name": "Biblioteket",
      "description": "Höga bokhyllor fyllda med magiska böcker. Damm dansar i ljuset från de höga fönstren. En liten bok lyser svagt på ett bord.",
      "exits": {
        "söder": "akademin_hall",
        "norr": "akademin_port"
      },
      "items": ["Magisk anteckningsbok"],
      "challenge": {
        "id": "addition_2",
        "category": "addition",
        "difficulty": 2,
        "description": "Boken vill att du visar att du kan räkna innan den öppnar sig!",
        "reward_xp": 25,
        "reward_gold": 15
      }
    },
    {
      "id": "akademin_port",
      "name": "Akademins Port",
      "description": "Den stora porten ut från akademin. Bortom ligger Räkneriket och ditt äventyr!",
      "first_visit_text": "Mästare Numerus dyker upp: 'Innan du går ut måste du visa att du kan räkna. Räkneriket är farligt för den som inte kan sin matte!'",
      "exits": {
        "söder": "akademin_bibliotek",
        "norr": "tallandet_vag"
      },
      "monster": {
        "id": "portvakt_golem",
        "name": "Sten-Golemen",
        "description": "STOPP! Lös mitt tal så släpper jag förbi dig!",
        "ascii_art": "     _____\n    /     \\\n   | O   O |\n    \\  __  /\n     |    |\n  ___|    |___\n |   |    |   |\n |   |    |   |\n |___|    |___|\n     |    |\n     |____|\n    /|    |\\\n   / |    | \\",
        "challenge_category": "addition",
        "challenge_difficulty": 2,
        "reward_xp": 50,
        "reward_gold": 25,
        "defeat_message": "Golemens ögon slocknar och den kliver åt sidan..."
      }
    },

    // ═══════════════════════════════════════════
    // ZON 2: TALLANDET (Addition & Subtraktion)
    // ═══════════════════════════════════════════

    {
      "id": "tallandet_vag",
      "name": "Vägen till Tallandet",
      "description": "En dammig väg leder genom ett landskap av flytande siffror. Gigantiska plus- och minustecken svävar i luften.",
      "first_visit_text": "Du har lämnat akademin! Här börjar Tallandet, där talen lever sitt eget liv. Var försiktig!",
      "exits": {
        "söder": "akademin_port",
        "norr": "tallandet_bro",
        "öster": "tallandet_glanta"
      },
      "items": ["Läkande dryck", "Guldmynt (10)", "Räknedosa"]
    },
    {
      "id": "tallandet_glanta",
      "name": "Siffergläntan",
      "description": "En fridfull glänta där stora siffror dansar i en ring. En vänlig siffra viftar åt dig.",
      "exits": {
        "väster": "tallandet_vag"
      },
      "items": ["Guldmynt (5)"],
      "challenge": {
        "id": "addition_tiotal",
        "category": "addition",
        "difficulty": 3,
        "description": "Siffrorna vill leka! Kan du lägga ihop tiotal?",
        "reward_xp": 30,
        "reward_gold": 20,
        "required": false
      }
    },
    {
      "id": "tallandet_bro",
      "name": "Talbron",
      "description": "En bro byggd av gigantiska siffror spänner över en djup ravin. Under bron hör du ekon av bortglömda tal.",
      "first_visit_text": "En skylt varnar: 'VARNING! TROLLET KRÄVER BETALNING!'",
      "exits": {
        "söder": "tallandet_vag",
        "norr": "tallandet_grottan"
      },
      "monster": {
        "id": "brotrollet",
        "name": "Brotrollet Minus",
        "description": "Hehehe! Min bro, mina regler! Kan du räkna minus?",
        "ascii_art": "       ,,,\n      (o o)\n  ooO--(_)--Ooo\n     |     |\n     | ~~~ |\n     |     |\n    /|     |\\\n   / |     | \\\n  /  |_____|  \\",
        "challenge_category": "subtraction",
        "challenge_difficulty": 2,
        "reward_xp": 50,
        "reward_gold": 25,
        "defeat_message": "Trollet kliar sig i huvudet: 'Du...du är smartare än jag! PASSERA då!'"
      }
    },
    {
      "id": "tallandet_grottan",
      "name": "Talens Grotta",
      "description": "En glittrande grotta där kristaller i form av siffror lyser i mörkret. Längst in ser du något stort röra sig...",
      "exits": {
        "söder": "tallandet_bro",
        "norr": "multi_entre"
      },
      "items": ["Guldmynt (15)"],
      "monster": {
        "id": "taldraken",
        "name": "Taldraken",
        "description": "VRÅÅÅL! Jag vaktar talen! Visa att du kan minus med stora tal!",
        "ascii_art": "                 __        _\n                /  \\      // \\\n               |    \\____//   |\n               |              |\n              /   __  __  __  \\\n             |   /  \\/  \\/  \\  |\n       ^     |   \\__/\\__/\\__/  |     ^\n      / \\    |                 |    / \\\n     /   \\   |   ~~~~~~~~~~~   |   /   \\\n    | 0 0 |  |  (  RÄKNA!    ) |  | 0 0 |\n     \\ = /    \\               /    \\ = /\n      |W|      \\             /      |W|\n      |||       \\___________/       |||",
        "challenge_category": "subtraction",
        "challenge_difficulty": 3,
        "reward_xp": 70,
        "reward_gold": 35,
        "defeat_message": "Draken böjer på huvudet: 'Snyggt räknat! Du får passera.'"
      }
    },

    // ═══════════════════════════════════════════
    // ZON 3: MULTIPLIKATIONSSKOGEN (Tabell 0-10)
    // ═══════════════════════════════════════════

    {
      "id": "multi_entre",
      "name": "Multiplikationsskogens Entré",
      "description": "Träden här har grenar som delar sig i perfekta mönster. Varje träd har ett '×' inristat i barken. Djupt in i skogen hörs mystiska ljud.",
      "first_visit_text": "En vis uggla hoar: 'Hoooo! Välkommen till Multiplikationsskogen! Här bor tabellernas väktare. Du måste besegra dem en i taget!'",
      "exits": {
        "söder": "tallandet_grottan",
        "norr": "multi_0"
      },
      "items": ["Trolldryck", "Guldmynt (20)", "Räknedosa"]
    },

    // --- 0:ANS TABELL: Tomhetens Trädgård ---
    {
      "id": "multi_0",
      "name": "Tomhetens Trädgård",
      "description": "En märklig trädgård där ingenting växer ordentligt. Blomrabatterna är tomma, frukten på träden försvinner när man tar i dem. En spöklik figur svävar bland de tomma buskarna.",
      "first_visit_text": "Allt som rör vid noll... försvinner! Nollans magi är enkel men viktig att förstå.",
      "exits": {
        "söder": "multi_entre",
        "norr": "multi_1"
      },
      "monster": {
        "id": "nollspöket",
        "name": "Nollspöket",
        "description": "OoOoOo! Jag är NOLL! Allt jag rör vid blir... INGENTING!",
        "ascii_art": "      ___\n     / 0 \\\n    |     |\n    | o o |\n    |  O  |\n     \\___/\n      | |\n     /| |\\\n    ~ | | ~\n      | |\n     ~   ~",
        "challenge_category": "multiplication",
        "challenge_difficulty": 0,
        "reward_xp": 40,
        "reward_gold": 20,
        "defeat_message": "Nollspöket bleknar: 'Du förstår nollans hemlighet... allt gånger noll är noll!'"
      }
    },

    // --- 1:ANS TABELL: Spegelpalatset ---
    {
      "id": "multi_1",
      "name": "Spegelpalatset",
      "description": "Ett palats fullt av speglar. Allt du ser reflekteras exakt som det är. En varelse som ser ut precis som dig själv blockerar vägen.",
      "first_visit_text": "I Spegelpalatset förblir allt sig själv! Ettans gånger-tabell ändrar ingenting.",
      "exits": {
        "söder": "multi_0",
        "norr": "multi_2"
      },
      "items": ["Guldmynt (10)"],
      "monster": {
        "id": "spegelansen",
        "name": "Spegelansen",
        "description": "Jag kopierar allt! 1 gånger vad som helst... förblir samma sak!",
        "ascii_art": "    _______\n   |       |\n   | | 1 | |\n   | |   | |\n   | | ? | |\n   | |   | |\n   | |___| |\n   |_______|",
        "challenge_category": "multiplication",
        "challenge_difficulty": 1,
        "reward_xp": 40,
        "reward_gold": 20,
        "defeat_message": "Spegelansen ler: 'Du ser? Ettans tabell är lätt som en plätt!'"
      }
    },

    // --- 2:ANS TABELL: Dubbelträsket ---
    {
      "id": "multi_2",
      "name": "Dubbelträsket",
      "description": "Allt här finns i par! Två stenar, två träd, två paddor som kväker i kör. Vattnet bubblar i grupper om två.",
      "first_visit_text": "Allt dubblas här! Kan du dubbla tal lika snabbt som Dubbelansen?",
      "exits": {
        "söder": "multi_1",
        "öster": "multi_2_ovning",
        "norr": "multi_5"
      },
      "monster": {
        "id": "dubbelansen",
        "name": "Dubbelansen",
        "description": "JAG SER DUBBELT! Och det borde DU också kunna!",
        "ascii_art": "    _    _\n   (o)  (o)\n    |    |\n    |____|  \n   /|    |\\\n  / | ×2 | \\\n /  |    |  \\\n    |    |\n   /|    |\\\n  / |____| \\",
        "challenge_category": "multiplication",
        "challenge_difficulty": 2,
        "reward_xp": 50,
        "reward_gold": 25,
        "defeat_message": "Dubbelansen nickar: 'Bra jobbat! Du kan dina dubblor!'"
      }
    },
    {
      "id": "multi_2_ovning",
      "name": "Dubbelstenen",
      "description": "En stor sten med tvåans tabell inristad. Siffrorna glöder svagt. Perfekt ställe att öva!",
      "exits": {
        "väster": "multi_2"
      },
      "items": ["Guldmynt (5)"],
      "challenge": {
        "id": "multi_2_extra",
        "category": "multiplication",
        "difficulty": 2,
        "description": "Stenen pulserar! Öva på tvåans tabell!",
        "reward_xp": 25,
        "reward_gold": 15,
        "required": false
      }
    },

    // --- 5:ANS TABELL: Femfingerskogen ---
    {
      "id": "multi_5",
      "name": "Femfingerskogen",
      "description": "Träden har exakt fem grenar var. Svampar växer i grupper om fem. En varelse med fem armar vaktar stigen.",
      "exits": {
        "söder": "multi_2",
        "öster": "multi_5_ovning",
        "norr": "multi_10"
      },
      "monster": {
        "id": "femlingen",
        "name": "Femlingen",
        "description": "FEM fingrar, FEM tår, FEM chanser! Kan du femans tabell?",
        "ascii_art": "     ___\n    /   \\\n   | 5 5 |\n    \\_-_/\n   --|--\n  /  |  \\\n /  /|\\  \\\n   / | \\\n  /  |  \\\n |   |   |",
        "challenge_category": "multiplication",
        "challenge_difficulty": 5,
        "reward_xp": 55,
        "reward_gold": 25,
        "defeat_message": "Femlingen ger dig en high five: 'Snyggt! Ge mig fem!'"
      }
    },
    {
      "id": "multi_5_ovning",
      "name": "Femkronan",
      "description": "Fem guldmynt ligger i en cirkel på marken. De snurrar och visar olika tal ur femans tabell.",
      "exits": {
        "väster": "multi_5"
      },
      "items": ["Guldmynt (10)"],
      "challenge": {
        "id": "multi_5_extra",
        "category": "multiplication",
        "difficulty": 5,
        "description": "Mynten snurrar! Kan du alla tal i femans tabell?",
        "reward_xp": 25,
        "reward_gold": 15,
        "required": false
      }
    },

    // --- 10:ANS TABELL: Tiotalstornet ---
    {
      "id": "multi_10",
      "name": "Tiotalstornet",
      "description": "Ett högt torn byggt av block med siffran 10. Från toppen kan du se hela skogen. En väktare i rustning står vid dörren.",
      "exits": {
        "söder": "multi_5",
        "norr": "multi_3"
      },
      "items": ["Läkande dryck"],
      "monster": {
        "id": "nollmastaren",
        "name": "Nollmästaren",
        "description": "Jag är NOLLMÄSTAREN! Tians tabell - lägg till en nolla!",
        "ascii_art": "      ___\n     / 0 \\\n    | 0 0 |\n     \\___/\n      |||\n   ___|||___\n  |  10 10  |\n  |_________|\n      |||\n     /|||\\\n    / ||| \\",
        "challenge_category": "multiplication",
        "challenge_difficulty": 10,
        "reward_xp": 55,
        "reward_gold": 25,
        "defeat_message": "Nollmästaren bugar: 'Nollan är din vän! Gå vidare!'"
      }
    },

    // --- 3:ANS TABELL: Trevägen ---
    {
      "id": "multi_3",
      "name": "Trevägen",
      "description": "Stigen delar sig alltid i tre. Tre fåglar sjunger, tre stenar bildar en triangel. En treögd varelse stirrar på dig.",
      "exits": {
        "söder": "multi_10",
        "öster": "multi_3_ovning",
        "norr": "multi_4"
      },
      "monster": {
        "id": "trion",
        "name": "Trion",
        "description": "Tre ögon ser allt! Tre munnar frågar! Kan du treans tabell?",
        "ascii_art": "      _\n     /3\\\n    / 3 \\\n   | 3 3 |\n    \\   /\n     |3|\n    /|3|\\\n   / |3| \\\n  /  |3|  \\\n     |3|\n    /   \\",
        "challenge_category": "multiplication",
        "challenge_difficulty": 3,
        "reward_xp": 60,
        "reward_gold": 30,
        "defeat_message": "Trion klappar i alla tre händerna: 'Tredje gången gillt... du klarade det!'"
      }
    },
    {
      "id": "multi_3_ovning",
      "name": "Triangelplatsen",
      "description": "Tre stenar i en triangel. Varje sten visar ett tal ur treans tabell. Perfekt för att öva!",
      "exits": {
        "väster": "multi_3"
      },
      "items": ["Guldmynt (10)"],
      "challenge": {
        "id": "multi_3_extra",
        "category": "multiplication",
        "difficulty": 3,
        "description": "Triangeln glöder! Öva på treans tabell!",
        "reward_xp": 30,
        "reward_gold": 15,
        "required": false
      }
    },

    // --- 4:ANS TABELL: Fyrkanten ---
    {
      "id": "multi_4",
      "name": "Fyrkanten",
      "description": "Allt är fyrkantigt här. Fyrkantiga stenar, fyrkantiga buskar, till och med molnen ser fyrkantiga ut. En blockvakt står i vägen.",
      "exits": {
        "söder": "multi_3",
        "öster": "multi_4_ovning",
        "norr": "multi_6"
      },
      "monster": {
        "id": "fyrkantingen",
        "name": "Fyrkantansen",
        "description": "Fyra sidor, fyra hörn, fyra chanser! Visa vad du kan!",
        "ascii_art": "   _________\n  |         |\n  |  4 × 4  |\n  |   = ?   |\n  |  [o  o] |\n  |   \\__/  |\n  |_________|",
        "challenge_category": "multiplication",
        "challenge_difficulty": 4,
        "reward_xp": 65,
        "reward_gold": 30,
        "defeat_message": "Fyrkantansen vecklar ut sig: 'Rätt i alla fyra hörn! Bra jobbat!'"
      }
    },
    {
      "id": "multi_4_ovning",
      "name": "Fyrklövern",
      "description": "En magisk fyrklöver med fyrans tabell skriven på varje blad. Att hitta den ger tur!",
      "exits": {
        "väster": "multi_4"
      },
      "items": ["Lyckosant (fyrklöver)"],
      "challenge": {
        "id": "multi_4_extra",
        "category": "multiplication",
        "difficulty": 4,
        "description": "Fyrklövern vibrerar! Öva på fyrans tabell!",
        "reward_xp": 30,
        "reward_gold": 15,
        "required": false
      }
    },

    // --- 6:ANS TABELL: Bikupan ---
    {
      "id": "multi_6",
      "name": "Bikupan",
      "description": "Marken är täckt av hexagoner, precis som en bikupa. Bin surrar runt och bildar mönster av sexor. En stor insekt vaktar vägen.",
      "exits": {
        "söder": "multi_4",
        "öster": "multi_6_ovning",
        "norr": "multi_7"
      },
      "monster": {
        "id": "hexan",
        "name": "Bidrottningen Hexa",
        "description": "BZZZ! Sex ben, sex vingar! Sexans tabell är knepig! BZZZ!",
        "ascii_art": "     / \\\n    / 6 \\\n   |     |\n   | 6 6 |\n    \\   /\n  /--\\_/--\\\n |   / \\   |\n  \\_/   \\_/\n   |     |\n   |_____|",
        "challenge_category": "multiplication",
        "challenge_difficulty": 6,
        "reward_xp": 75,
        "reward_gold": 35,
        "defeat_message": "Bidrottningen surrar nöjt: 'BZZZ! Du klarade sexans tabell! Inte illa!'"
      }
    },
    {
      "id": "multi_6_ovning",
      "name": "Honungskällan",
      "description": "En källa av gyllene honung. Varje droppe innehåller ett tal ur sexans tabell.",
      "exits": {
        "väster": "multi_6"
      },
      "items": ["Honungsburk (+20 HP)"],
      "challenge": {
        "id": "multi_6_extra",
        "category": "multiplication",
        "difficulty": 6,
        "description": "Honungen bubblar! Öva på sexans tabell!",
        "reward_xp": 35,
        "reward_gold": 20,
        "required": false
      }
    },

    // --- 7:ANS TABELL: Sjustjärnan ---
    {
      "id": "multi_7",
      "name": "Stjärnklippan",
      "description": "Sju stjärnor lyser på himlen trots att det är dag. Sju facklor bildar en cirkel. En mystisk figur svävar i mitten.",
      "exits": {
        "söder": "multi_6",
        "öster": "multi_7_ovning",
        "norr": "multi_8"
      },
      "monster": {
        "id": "sjustjarnan",
        "name": "Sjustjärnan",
        "description": "Sju dagar, sju stjärnor, sju frågor! Sjuans tabell är magisk!",
        "ascii_art": "       *\n      /|\\\n     / | \\\n    *  |  *\n   /\\  |  /\\\n  /  \\ | /  \\\n *    \\|/    *\n  \\   /|\\   /\n   \\ / | \\ /\n    *  |  *\n       *",
        "challenge_category": "multiplication",
        "challenge_difficulty": 7,
        "reward_xp": 80,
        "reward_gold": 40,
        "defeat_message": "Sjustjärnan lyser starkt: 'Alla sju stjärnor lyser för DIG!'"
      }
    },
    {
      "id": "multi_7_ovning",
      "name": "Veckodagsbrunnen",
      "description": "En brunn med sju hinkar, en för varje veckodag. Varje hink innehåller ett tal ur sjuans tabell.",
      "exits": {
        "väster": "multi_7"
      },
      "items": ["Guldmynt (15)", "Räknedosa"],
      "challenge": {
        "id": "multi_7_extra",
        "category": "multiplication",
        "difficulty": 7,
        "description": "Hinkarna skramlar! Öva på sjuans tabell!",
        "reward_xp": 35,
        "reward_gold": 20,
        "required": false
      }
    },

    // --- 8:ANS TABELL: Spindelnästet ---
    {
      "id": "multi_8",
      "name": "Spindelnästet",
      "description": "En klippa täckt av spindelväv. Åtta ögon stirrar på dig från mörkret. Spindelväven bildar mönster av åttor.",
      "exits": {
        "söder": "multi_7",
        "öster": "multi_8_ovning",
        "norr": "multi_9"
      },
      "monster": {
        "id": "spindeldrott",
        "name": "Spindeldrottningen Oktavia",
        "description": "Ssssss! Med åtta ben räknar jag snabbt! Kan DU hänga med?",
        "ascii_art": "    /\\  /\\\n   /  \\/  \\\n   | 8||8 |\n    \\    /\n     \\  /\n   /|||||||\\\n  / ||||||| \\\n /  ||||||| \\\n    |  |  |\n   /|  |  |\\\n  / |  |  | \\",
        "challenge_category": "multiplication",
        "challenge_difficulty": 8,
        "reward_xp": 85,
        "reward_gold": 40,
        "defeat_message": "Spindeln spinner: 'Du vann helt rättvist... eller ska jag säga 8 gånger 8 = 64? Hihihi!'"
      }
    },
    {
      "id": "multi_8_ovning",
      "name": "Åttabensgrottan",
      "description": "En liten grotta full av spindelvävar som bildar åttans tabell. Lite läskigt men perfekt för att öva.",
      "exits": {
        "väster": "multi_8"
      },
      "items": ["Läkande dryck"],
      "challenge": {
        "id": "multi_8_extra",
        "category": "multiplication",
        "difficulty": 8,
        "description": "Spindelväven vibrerar! Öva på åttans tabell!",
        "reward_xp": 40,
        "reward_gold": 20,
        "required": false
      }
    },

    // --- 9:ANS TABELL: Niornas Näste ---
    {
      "id": "multi_9",
      "name": "Niornas Näste",
      "description": "Nio torn reser sig i en cirkel. Siffran 9 är inristad överallt. En mäktig varelse med nio svansar vaktar den sista stigen.",
      "first_visit_text": "Du är nästan genom skogen! Men nians tabell är den svåraste av alla... Tips: siffrorna i svaret bildar alltid 9 tillsammans! (1+8=9, 2+7=9...)",
      "exits": {
        "söder": "multi_8",
        "öster": "multi_9_ovning",
        "norr": "multi_boss"
      },
      "monster": {
        "id": "niovansen",
        "name": "Niovansen",
        "description": "NIO svansar, NIO liv! Nians tabell är den tuffaste!",
        "ascii_art": "       9\n      /|\\\n     / | \\\n    /  |  \\\n   9   9   9\n    \\  |  /\n     \\ | /\n    [o   o]\n     \\999/\n      |||\n     /|||\\\n    9 999 9",
        "challenge_category": "multiplication",
        "challenge_difficulty": 9,
        "reward_xp": 90,
        "reward_gold": 45,
        "defeat_message": "Niovansen svänger sina svansar: 'Nians tabell! Du är en riktig tabellmästare!'"
      }
    },
    {
      "id": "multi_9_ovning",
      "name": "Niotalet",
      "description": "Nio ljus brinner i en ring. Varje ljus visar ett tal ur nians tabell. Kom ihåg: siffrorna i svaret ger alltid 9!",
      "exits": {
        "väster": "multi_9"
      },
      "items": ["Guldmynt (20)"],
      "challenge": {
        "id": "multi_9_extra",
        "category": "multiplication",
        "difficulty": 9,
        "description": "Ljusen fladdrar! Öva på nians tabell!",
        "reward_xp": 40,
        "reward_gold": 25,
        "required": false
      }
    },

    // --- BLANDAD BOSS ---
    {
      "id": "multi_boss",
      "name": "Tabellmästarens Sal",
      "description": "En enorm sal med alla multiplikationstabellerna inristade i golvet. I mitten sitter en gestalt på en tron av siffror.",
      "first_visit_text": "Tabellmästaren reser sig: 'Du har besegrat alla mina väktare en och en. Men kan du ALLA tabeller blandat?'",
      "exits": {
        "söder": "multi_9",
        "norr": "division_entre"
      },
      "monster": {
        "id": "tabellmastaren",
        "name": "Tabellmästaren",
        "description": "Jag blandar ALLA tabeller! 2:ans, 5:ans, 9:ans... ALLT!",
        "ascii_art": "      ___\n     /   \\\n    | × × |\n     \\___/\n    __|__\n   |  ×  |\n   | 2-9 |\n   |_____|\n    |   |\n   /|   |\\\n  / |   | \\\n /  |   |  \\",
        "challenge_category": "multiplication",
        "challenge_difficulty": 11,
        "reward_xp": 120,
        "reward_gold": 60,
        "defeat_message": "Tabellmästaren bugar djupt: 'Du KAN alla tabeller! Jag är imponerad!'"
      }
    },

    // ═══════════════════════════════════════════
    // ZON 4: DIVISIONSDALEN
    // ═══════════════════════════════════════════

    {
      "id": "division_entre",
      "name": "Divisionens Dal",
      "description": "Landskapet framför dig är uppdelat i lika stora bitar, som en tårta skuren i perfekta skivor. Allt handlar om att dela lika här.",
      "first_visit_text": "En skylt: 'Välkommen till Divisionens Dal! Här lär du dig dela upp tal. Tänk baklänges - division är gånger åt andra hållet!'",
      "exits": {
        "söder": "multi_boss",
        "öster": "division_bron",
        "norr": "division_boss"
      },
      "items": ["Läkande dryck", "Guldmynt (25)", "Räknedosa"]
    },
    {
      "id": "division_bron",
      "name": "Delningsbron",
      "description": "En bro där varje planka är märkt med divisionstecken. Lugnt vatten flyter under bron.",
      "exits": {
        "väster": "division_entre"
      },
      "items": ["Guldmynt (10)"],
      "challenge": {
        "id": "division_enkel",
        "category": "division",
        "difficulty": 1,
        "description": "Plankorna vill att du delar upp tal! Tänk på dina tabeller!",
        "reward_xp": 60,
        "reward_gold": 30,
        "required": false
      }
    },
    {
      "id": "division_boss",
      "name": "Restberget",
      "description": "Ett berg där klipporna inte går jämnt upp. Överallt ser du rest-bitar som inte passade in. En tjock varelse sitter på toppen.",
      "first_visit_text": "Resttrollet fnissar: 'Här blir det inte alltid jämnt! Ibland blir det lite KVAR!'",
      "exits": {
        "söder": "division_entre",
        "norr": "forvirringens_port"
      },
      "monster": {
        "id": "resttrollet",
        "name": "Resttrollet",
        "description": "HAHA! Mina tal går ALDRIG jämnt ut! Kan du räkna med REST?",
        "ascii_art": "      ___\n     / R \\\n    | o o |\n    |  ÷  |\n     \\___/\n    __|__\n   | REST |\n   |  ?   |\n   |______|\n    |    |\n   /|    |\\\n  / |____| \\",
        "challenge_category": "division",
        "challenge_difficulty": 3,
        "reward_xp": 100,
        "reward_gold": 50,
        "defeat_message": "Resttrollet applåderar: 'Du klarade till och med resten! Snyggt jobbat!'"
      }
    },

    // ═══════════════════════════════════════════
    // ZON 5: SLUTET
    // ═══════════════════════════════════════════

    {
      "id": "forvirringens_port",
      "name": "Mattetrollkarlens Tron",
      "description": "Du står i en gyllene sal. Siffror och symboler dansar i luften runt dig. Mästare Numerus väntar med ett stort leende.",
      "first_visit_text": "Mästare Numerus klappar i händerna: 'Du har klarat ALLA prövningar! Addition, subtraktion, alla gångertabeller OCH division! Du är nu en RIKTIG Mattetrollkarl! Räkneriket är stolt över dig!'",
      "exits": {
        "söder": "division_boss"
      },
      "items": ["Mattetrollkarlens Diplom", "Guldmynt (100)"],
      "ascii_art": "   _______________\n  |  ___________  |\n  | |           | |\n  | |   ★   ★   | |\n  | |     +     | |\n  | |   ★   ★   | |\n  | |___________| |\n  |      [ ]      |\n  |_______O_______|"
    }
  ]
};

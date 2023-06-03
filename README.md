# kalorie


# Strategie
Nejprve jsou udělány kvalitní kalorické tabulky, které umožní uživatelům zapisovat potraviny, jídla a aktivity.
Potom, až bude dostatečně velká klientela, může přijít čas na billing.
Nejprve by se mohl billing jmenovat jako Podpořit a Premium členství, potom by se postupem času mohlo osekat
pamatování si potravin a záznamů v deníku.

Mohli by se do systému taky nalákat rlzní výživoví specialisté se svými recepty, kteří by si mohli platit zviditelnění
jejich produktů.



# Jira

## Vytvoření kostry fungující aplikace
1. Podpora pro více uživatelů, zatím jen v databázi
2. Do systému se dá přihlásit přes Seznam.cz
3. Ze systíému se dá odhlásit, a dá se pamatovat přihlášení
4. Uživatel může přidávat a upravovat svoje vlastní potraviny
5. Uživatel vidí v tomto stádiu zatím jen Bílkoviny, Sacharidy, Tuky a vlákninu
6. V systému existuje Administrátor, který může modifikovat všechny potraviny
7. Dají se myší přesouvat záznamy v deníku z místa na místo. V DB je potřeba k tomu vytvořit field, a nějaký asi Watch který sleduje posloupnost a podle toho mění order parametr.

Cílem vlastně je mít hotovu fungující kostru aplikace, již použitelnou. Možná e by se dalo říct že už stabilní,
která se dá nasadit na produkci do provozu.

## Dodání základních potravin
1. Dodání základních potravin ze Slovenské databáze
2. Dodání přídavných potravin OpenFoodData
3. Podpora pro sůl, vlákninu, nasycené mastné kyseliny zatím jen v databázi, ale neposílá se ven
4. Potraviny jsou dodány tak, že každý má svého uživatele, který je vlastní
5. Potraviny tabulka obsahuje field Kolekce "Základní", a OpenFoodDaty Typ "OpenFood", a od uživatelů kolekce např. "Jiří Kačírek"

Cílem zde vlastně je mít už hotou fungující a použitelnou kostru aplikace, a obohatit její funkčnost
o přítomnost základních potravin. Aplikace by měla být nasaditelná do produkce, tedy data by měla být hotová.


## Dodělání přídavných věcí nutných k základnímu používání aplikace
1. V databázi existuje pro uživatele tabulka Settings, kde se ukládají nastavení
2. V Potraviny si může uživatel zobrazit jen jeho vlastní potraviny
3. V Nastavení si může uživatel vypínat a zapínat kolekce potravin jiných uživatelů
4. V Nastavení se dají vypínat a zapínat zobrazované nutrienty
5. Dá se přihlásit přes Facebook
6. Dá se přihlásit přes Google

Cílem je, aby se aplikace dala plně využívat, ale zatím neobsahovala nějaké opinionated nadbytečné funkce.

## Další vylepšení
1. V Nastavení se dá měnit pořadí nutrientů
2. V Nastavení se dají vypínat a zapínat chody, které se zobrazují v Option. Když člověk chce jen Celý den, tak zmizí Option box.
3. V Nastavení se chodům dá měnit jméno, např.
4. V Nastavení uživatel vidí kvalitu jednotlivých kolekcí, které chce zapínat
5. Podpora pro vyvoření temporary nepřihlášeného uživatele, jakéhosi Guesta, který si chce jen vyzkoušet aplikaci.
   Guest je vlastně vytvořen automaticky, je přítomen field created, guest je uložen v browser Session. Je potřeba Guesty
   pravidelně mazat, např. 1x za týden. Pokud se user přihlásí, tak se udělá merge dat vyrobených jako guest.


Cílem zde je vlastně dodávt jednotlivá vylepšení, které se dají dodávat samostatně.


# Jak funguje token
Neprihlaseny uzivatel vstoupi na web a vidi tlacitko Prihlasit. Klikne na prihlasit a do session se mu vlozi token.
Uzivatel co uz ma v session token vstoupi na web a vidi tlacitko odhlasit. To tlacitko by melo nejakym zpusobem invalidovat token. Ale to se mi nechce delat.
To je pracne. Takze po kliknuti na odhlasit se ten token jen smaze z local storage. No ale v podstate timto ten token prestal existovat.
S kazdym requestem se priklada token ze session do Authentication hlavicky.
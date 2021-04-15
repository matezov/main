(NetBeans project)

Feladat:

Kiszúrós amőba
Készítsünk programot, amellyel a közismert amőba játék következő változatát játszhatjuk. Adott egy n × n-es tábla, amelyen a két játékos felváltva X, illetve O jeleket helyez el. Csak olyan mezőre tehetünk jelet, amely még üres. A játék akkor ér véget, ha betelik a tábla (döntetlen), vagy valamelyik játékos kirak 5 egymással szomszédos jelet vízszintesen, függőlegesen vagy átlósan. A program minden lépésnél jelezze, hogy melyik játékos következik, és a tábla egy üres mezőjét kijelölve helyezhessük el a megfelelő jelet. A kiszúrás a játékban az, hogy ha egy játékos eléri a 3 egymással szomszédos jelet, akkor a program automatikusan törli egy jelét egy véletlenszerűen kiválasztott pozícióról (nem biztos, hogy a hármasból), ha pedig 4 egymással szomszédos jelet ér el, akkor pedig kettőt. A program biztosítson lehetőséget új játék kezdésére a táblaméret megadásával (6×6, 10×10, 14×14), és ismerje fel, ha vége a játéknak. Ekkor jelenítse meg, hogy melyik játékos győzött (ha nem lett döntetlen), majd kezdjen automatikusan új játékot.

Megoldási terv:

A játék megvalósításakor elkülönítjük a játék megvalósításáért és megjelenítéséért felelős modulokat.
Egy játékos akkor nyer, ha kirak 5 egymással szomszédos mezőt átlósan, vagy vízszintesen. Azonban, ha egymás mellett összegyűjt 3-at, akkor töröljük egy véletlenszerű mezőjét, ha 4-et, akkor 2-őt is.
Megvalósítás
A Tabla osztály egy mátrix segítségével reprezentálja a játéktábla mezőit, annak folyamatos eseményeit. Három különböző típus van: X, O, NINCS; ez a Jatekos felsorolással lett létrehozva. A játék kezdetekor a mátrix összes mezője NINCS szimbólummal töltődik fel, a kezdőjátékos mindig X, érvényes lépés esetén a következő játékos jöhet (O), az aktuális játékos mindig el van tárolva a Tabla osztályban, ugyanez szimulálja a lépéseket, keresi a győztest, döntetlen helyzetet, vagy „szúr ki” vele.
Megjelenítés
Az Ablak osztály felelős a megjelenítésért, megnyitáskor a közepes pálya fogad minket, új játékot ugyanazon a pályán a játéktábla feletti sorban van bármikor lehetőségünk az Új játék gombra kattintva, de a játék menüjében a pályaméret menüpont segítségévek megjelenik a pályaválasztás lehetősége, ugyanitt természetesen ki is léphetünk a játékból a kilépés gombra kattintva.

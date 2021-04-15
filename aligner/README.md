CPP beadandó feladat:

Az aligner osztály template, aminek a
template paramétere meghatározza, hogy milyen elemeket tartalmazó
vector-ok igazításáért felel a típus. Maga az aligner nem tudja, hogy az
eligazítás mit is jelent, ezért ezt az altípusokra fogja bízni:
center_aligner-rel  középre, a left_aligner-rel balra, a right_aligner-rel
jobbra, a justified_aligner-rel sorkizártra lehet igazítani az aligner-hez
adott vector-okat. Az align-nak ténylegesen azokkal a vektorokkal kell
dolgoznia, amiket hozzáadtunk, azokért fog felelni. A count művelete
megadja, hogy hány vektort érint az igazítás. Az igazítások után az összes
vektor mérete megegyezik, alapértelmezett a template paraméter default
konstruáltjával tölti fel a vektorokat megfelelően, illetve létezik a
set_filler metódus, amivel ez átállítható. Az eligazítás a leghosszabb
vektorhoz igazodik.
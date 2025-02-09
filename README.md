# QR Code generator

Basato su [questo](https://www.thonky.com/qr-code-tutorial/) link.

Creato con Typescript


## Come usarlo
1. Creare la cartella "js", allo stesso livello della cartella "ts"
2. Eseguire i seguenti comandi(in cmd diversi) per generare i file js:
    1. tsc --watch --p classes.tsconfig.json
    2. tsc --watch --p enums.tsconfig.json
    3. tsc --watch --p graphic.tsconfig.json
    4. tsc --watch --p helpers.tsconfig.json
    5. tsc --watch --p script.tsconfig.json
    6. tsc --watch --p static.tsconfig.json
3. Aprire il file html tramite un server (per esempio Live Server di VSCode)


## Note
1. Il file "tsconfig.json" è stato lasciato in quanto VSCode inizia a generare errori se non c'è il file (in quanto non riesce a capire quali file .ts sono "referenziati" tra di loro)
2. I comandi del punto 2 di "Come usarlo" genereranno sicuramente errori. Se vengono creati i file js è possibile ignorare questi errori. Il problema principale è il fatto che alcuni file ts fanno riferimento a funzioni presenti in altri, ma il --watch è configurato per "compilare" a cartelle. Non riuscendo a trovare il codice presente in altre cartelle va in errore
3. Mancano ancora alcune funzionalità, prima o poi, se avrà voglia le implementerò
LINEE GUIDA - PROVA PRATICA
Academy aziendale:
gestione di percorsi formativi
OBIETTIVO DELLA PROVA
La prova è finalizzata a valutare la capacità dell’esaminando di progettare e
sviluppare una applicazione web full stack funzionante, con autenticazione,
gestione di dati relazionali, interazione tra frontend e backend tramite API e
persistenza su database.
L’applicazione deve essere valutabile principalmente per il comportamento
osservabile dall’utente tramite il frontend: le pagine devono consentire di
svolgere i casi d’uso richiesti, rispettando le regole funzionali, le validazioni e
le autorizzazioni previste.
PRINCIPIO GENERALE SULLE SPECIFICHE
Le specifiche funzionali sono vincolanti: l’applicazione deve consentire agli
utenti di svolgere correttamente le operazioni richieste.
Le indicazioni tecniche, il modello dei dati suggerito e gli esempi di endpoint API
rappresentano una possibile soluzione implementativa. Il candidato può adottare
scelte diverse, purché il risultato sia funzionalmente equivalente, coerente,
testabile e adeguato ai requisiti della prova.
REQUISITI GENERALI
L’applicazione deve prevedere:
• Separazione tra frontend e backend;
• Frontend web realizzato con tecnologia client-side rendering (CSR);
• Backend applicativo che espone API consumate dal frontend;
• Database relazionale per la persistenza dei dati;
• Autenticazione degli utenti;
• Autorizzazione basata sui ruoli e sui dati di competenza dell’utente;
• Validazione lato server dei dati ricevuti;
• Un set iniziale di dati realistici, sufficiente per testare tutti i casi
d’uso previsti;
• Uno strumento per il test delle API, come Swagger, Postman,
Insomnia o equivalente;
• Codice organizzato, leggibile e coerente con le buone pratiche
del framework scelto.
Non è obbligatorio utilizzare uno specifico linguaggio,
framework o database relazionale.
DESCRIZIONE DEL CASO D’USO
Un’azienda vuole dotarsi di una piattaforma interna per gestire i percorsi formativi
dei dipendenti, per supportare il progetto dell’Academy aziendale.
I referenti Academy devono poter creare corsi interni, organizzarli per categoria
e assegnarli ai dipendenti.
I dipendenti devono poter consultare i corsi assegnati, vedere le scadenze e
segnare un corso come completato quando hanno concluso l’attività prevista.
Il sistema deve inoltre consentire ai referenti Academy di consultare lo stato di
avanzamento della formazione interna, con dati aggregati per mese e categoria.
UTENTI E RUOLI
Il sistema prevede i seguenti ruoli applicativi.
DIPENDENTE
Può:
• Accedere all’applicazione
• Visualizzare i corsi assegnati a sé
• Filtrare i propri corsi per stato e categoria
• Visualizzare il dettaglio di un corso assegnato
• Segnare un corso assegnato come completato
• Visualizzare le proprie scadenze formative
REFERENTE ACADEMY
Può:
• Accedere all’applicazione
• Gestire il catalogo dei corsi
• Visualizzare l’elenco dei dipendenti
• Assegnare corsi ai dipendenti
• Visualizzare tutte le assegnazioni
• Filtrare le assegnazioni per stato, categoria e dipendente
• Modificare o annullare una assegnazione
• Visualizzare statistiche e riepiloghi sui completamenti
Per ciascun ruolo devono essere rispettate le operazioni consentite e le limitazioni
indicate nella descrizione del caso d’uso e nelle regole di sicurezza.
REQUISITI DELL’INTERFACCIA UTENTE
L’interfaccia utente deve essere chiara, coerente nello stile e facilmente
navigabile.
Le pagine principali devono essere accessibili da un menu o da una navigazione
equivalente. Dopo il login, l’utente deve visualizzare solo le funzionalità
compatibili con il proprio ruolo.
L’applicazione deve gestire in modo comprensibile:
• Messaggi di errore;
• Messaggi di conferma;
• Validazioni dei form;
• Stati delle entità;
• Eventuali operazioni non consentite all’utente corrente.
PAGINE E FUNZIONALITÀ DA SVILUPPARE
L’applicazione deve prevedere almeno le seguenti pagine o sezioni funzionalmente
equivalenti.
HOME / LOGIN
La pagina iniziale deve consentire agli utenti di autenticarsi.
In caso di credenziali errate, l’applicazione deve mostrare un messaggio di errore
comprensibile.
DASHBOARD
Dopo il login, l’utente deve accedere a una dashboard coerente con il proprio ruolo.
La dashboard deve consentire l’accesso alle funzionalità principali disponibili
per l’utente autenticato.
AREA DIPENDENTE
L’area dipendente deve consentire di:
• Visualizzare l’elenco dei corsi assegnati al dipendente
• Filtrare i corsi per stato, categoria e scadenza
• Visualizzare il dettaglio di un corso assegnato
• Segnare un corso come completato
• Visualizzare i corsi completati
• Visualizzare i corsi non ancora completati o scaduti.
Per ogni corso assegnato devono essere visibili almeno:
• Titolo del corso
• Categoria
• Durata prevista
• Data di assegnazione
• Data di scadenza
• Stato
• Eventuale data di completamento.
AREA REFERENTE ACADEMY
L’area del referente Academy deve consentire di:
• Visualizzare il catalogo dei corsi
• Creare un nuovo corso
• Modificare un corso
• Disattivare o eliminare un corso, se consentito
• Visualizzare l’elenco delle assegnazioni
• Assegnare un corso a un dipendente
• Modificare o annullare una assegnazione
• Filtrare le assegnazioni per dipendente, corso, categoria e stato.
GESTIONE CATALOGO CORSI
Il referente Academy deve poter gestire i corsi disponibili nell’Academy.
Per ogni corso devono essere visibili almeno:
• Titolo
• Descrizione
• Categoria
• Durata prevista in ore
• Eventuale obbligatorietà
• Stato del corso, attivo o non attivo.
Un corso non attivo non deve essere proposto per nuove assegnazioni.
GESTIONE ASSEGNAZIONI
Il referente Academy deve poter assegnare corsi ai dipendenti.
Per ogni assegnazione devono essere visibili almeno:
• Dipendente
• Corso
• Data di assegnazione
• Data di scadenza
• Stato
• Eventuale data di completamento.
RIEPILOGO E STATISTICHE
L’area del referente Academy deve includere una pagina di riepilogo che mostri
dati aggregati sullo stato della formazione.
La pagina deve consentire almeno di visualizzare, per mese e categoria:
• Numero di corsi assegnati
• Numero di corsi completati
• Percentuale di completamento.
Devono essere previsti filtri almeno per:
• Mese o periodo
• Categoria
• Dipendente, se applicabile.
I dati possono essere presentati in forma tabellare e, opzionalmente, grafica.
Le funzionalità di ricerca, filtro, riepilogo o statistica indicate nel caso d’uso
sono parte integrante della prova e devono essere accessibili dall’interfaccia
utente, secondo le autorizzazioni previste.
REQUISITI FUNZIONALI OBBLIGATORI
Devono essere implementate almeno le seguenti regole funzionali.
• Solo gli utenti autenticati possono accedere alle pagine riservate
• Un dipendente può vedere solo i corsi assegnati a sé
• Un referente Academy può vedere tutti i corsi e tutte le assegnazioni
• Solo un referente Academy può creare, modificare o disattivare corsi
• Solo un referente Academy può assegnare corsi ai dipendenti
• Un dipendente può segnare come completati solo i corsi assegnati a sé
• Un corso non può essere eliminato se ha assegnazioni collegate
• Un corso non attivo non può essere usato per nuove assegnazioni
• Le statistiche devono essere visibili solo ai referenti Academy
Le regole funzionali devono essere rispettate sia nell’interfaccia utente sia nel
backend. Non è sufficiente nascondere un pulsante nel frontend: il backend deve
impedire le operazioni non consentite.
STATI DELL’ASSEGNAZIONE
I possibili stati di una assegnazione sono:
• Assegnato
• Completato
• Scaduto
• Annullato
È possibile utilizzare nomi equivalenti, purché la logica funzionale
sia chiara e coerente.
RICERCA, FILTRI, RIEPILOGHI E STATISTICHE
L’applicazione deve consentire le ricerche e i filtri previsti dal caso d’uso.
Inoltre deve prevedere le funzionalità di riepilogo o statistica richieste dalla
traccia. Tali funzionalità non devono essere considerate opzionali o esterne alla
prova, ma parte del comportamento atteso dell’applicazione.
L’area del referente Academy deve includere una pagina di riepilogo che mostri
dati aggregati sullo stato della formazione.
La pagina deve consentire almeno di visualizzare, per mese e categoria:
• Numero di corsi assegnati
• Numero di corsi completati
• Percentuale di completamento
Devono essere previsti filtri almeno per:
• Mese o periodo
• Categoria
• Dipendente, se applicabile.
I dati possono essere presentati in forma tabellare e, opzionalmente, grafica.
VALIDAZIONI
Devono essere applicate almeno le seguenti validazioni lato server.
• L’email dell’utente deve essere obbligatoria e univoca
• La password non può essere vuota
• Un corso deve avere un titolo
• Un corso deve avere una categoria
• La durata prevista di un corso deve essere maggiore di zero
• Una assegnazione deve essere associata a un corso
• Una assegnazione deve essere associata a un dipendente
• La data di scadenza non può essere precedente alla data di assegnazione
• La data di completamento, se presente, non può essere precedente alla data
di assegnazione
• Lo stato dell’assegnazione deve appartenere all’insieme degli stati previsti
Le validazioni possono essere replicate anche lato frontend per migliorare
l’esperienza utente, ma la validazione lato server è obbligatoria.
SICUREZZA E AUTORIZZAZIONI
Devono essere rispettate almeno le seguenti regole di sicurezza.
Le API e le pagine riservate devono essere protette tramite autenticazione.
Le operazioni disponibili devono dipendere dal ruolo dell’utente autenticato.
Il sistema deve impedire che un dipendente possa accedere alle assegnazioni di
altri dipendenti.
Le funzionalità di gestione catalogo, assegnazione corsi, modifica assegnazioni
e visualizzazione delle statistiche devono essere disponibili solo ai referenti
Academy.
In particolare:
• Le pagine riservate devono essere accessibili solo agli utenti autenticati;
• Le API riservate devono richiedere autenticazione;
• Le operazioni disponibili devono dipendere dal ruolo dell’utente;
• Gli utenti non amministrativi devono poter accedere solo ai dati di propria
competenza;
• Eventuali API pubbliche devono essere esplicitamente indicate dalla traccia.
API ATTESE
Il backend deve esporre API che consentano al frontend di realizzare tutte le
funzionalità richieste.
Gli endpoint indicati di seguito rappresentano una possibile struttura REST. Il
candidato può usare nomi, percorsi o organizzazione diversa, purché le operazioni
siano presenti, documentabili, testabili e rispettino le stesse regole funzionali
e di sicurezza.
Per ogni endpoint che riceve dati dal client devono essere previste validazioni
lato server.
REGISTRAZIONE E AUTENTICAZIONE
Le API di autenticazione devono consentire almeno:
• Registrazione o creazione degli utenti previsti dalla traccia;
• Login dell’utente;
• Restituzione di un token, cookie di sessione o altro meccanismo equivalente di
autenticazione;
• Logout, se previsto dalla tecnologia adottata.
Esempio di possibile struttura:
POST /api/utenti/register
POST /api/utenti/login
API CON AUTENTICAZIONE
CORSI ACADEMY
Operazioni minime richieste:
• Elenco dei corsi
• Dettaglio di un corso
• Creazione di un corso
• Modifica di un corso
• Eliminazione o disattivazione di un corso
Esempio:
GET /api/corsi
GET /api/corsi/{id}
POST /api/corsi
PUT /api/corsi/{id}
DELETE /api/corsi/{id}
PUT /api/corsi/{id}/disattiva
La lista dei corsi deve supportare filtri almeno per:
• Categoria
• Stato attivo/non attivo
ASSEGNAZIONI
Operazioni minime richieste:
• Elenco delle assegnazioni, con filtri
• Dettaglio di una assegnazione
• Creazione di una assegnazione
• Modifica di una assegnazione
• Annullamento di una assegnazione
• Completamento di una assegnazione
Esempio:
GET /api/assegnazioni-corsi
GET /api/assegnazioni-corsi/{id}
POST /api/assegnazioni-corsi
PUT /api/assegnazioni-corsi/{id}
DELETE /api/assegnazioni-corsi/{id}
PUT /api/assegnazioni-corsi/{id}/completa
PUT /api/assegnazioni-corsi/{id}/annulla
La lista delle assegnazioni deve supportare filtri almeno per:
• Stato
• Categoria
• Corso
• Dipendente, solo per referenti Academy.
STATISTICHE
Operazioni minime richieste:
• Riepilogo dei corsi assegnati e completati per mese e categoria
• Calcolo della percentuale di completamento
Esempio:
GET /api/statistiche/academy?mese=2026-05&categoria=Sicurezza
Risposta esemplificativa:
[
 {
 “mese”: “2026-05”,
 “categoria”: “Sicurezza”,
 “numeroAssegnazioni”: 18,
 “numeroCompletamenti”: 12,
 “percentualeCompletamento”: 66.67
 }
]
API SENZA AUTENTICAZIONE
Nessuna API pubblica prevista.
MODELLO DEI DATI SUGGERITO
Per realizzare le funzionalità richieste si suggerisce il seguente modello dei dati.
UTENTE
Campi suggeriti:
• Utente ID
• Nome
• Cognome
• Email
• Password
• Ruolo
CORSO ACADEMY
Campi suggeriti:
• Corso ID
• Titolo
• Descrizione
• Categoria
• Durata Ore
• Obbligatorio
• Attivo
ASSEGNAZIONE CORSO
Campi suggeriti:
• Assegnazione ID
• Corso ID
• Dipendente ID
• Data Assegnazione
• Data Scadenza
• Stato
• Data Completamento
Il modello dei dati proposto è indicativo. Il candidato può modificarlo o
integrarlo, purché la soluzione permetta di soddisfare correttamente i requisiti
funzionali, le validazioni, le ricerche, le statistiche e le regole di sicurezza
previste.
DATI INIZIALI PER IL TEST
L’applicazione deve essere inizializzata con dati realistici, sufficienti per testare:
• Almeno un utente per ciascun ruolo previsto;
• Le principali entità gestite dal sistema;
• Almeno alcuni casi con stati diversi, ove siano previsti stati applicativi;
• Casi utili a verificare filtri, ricerche, riepiloghi o statistiche;
• Casi utili a verificare le regole di autorizzazione.
Il candidato deve fornire le credenziali degli utenti di test.
INDICAZIONI TECNICHE
L’applicazione deve essere composta almeno da:
FRONTEND
• Applicazione web CSR;
• Interfaccia per svolgere tutti i casi d’uso richiesti;
• Comunicazione con il backend tramite API;
• Gestione degli stati di caricamento, errore e conferma almeno nei punti principali.
BACKEND
• Servizio applicativo che espone API consumate dal frontend;
• Gestione della logica applicativa;
• Gestione di autenticazione e autorizzazione;
• Accesso al database;
• Validazione dei dati ricevuti dal client.
DATABASE
• Database relazionale;
• Tabelle e relazioni necessarie alla persistenza dei dati;
• Vincoli coerenti con il modello applicativo, quando opportuno.
NOTE PER LA VALUTAZIONE
La prova sarà valutata considerando in particolare:
• Correttezza funzionale dell’applicazione;
• Completezza dei casi d’uso implementati;
• Qualità e usabilità del frontend;
• Corretta implementazione di autenticazione e autorizzazione;
• Corretta gestione delle validazioni;
• Coerenza del modello dei dati;
• Progettazione e implementazione delle API;
• Possibilità di testare le API con strumenti adeguati;
• Presenza di dati iniziali realistici;
• Organizzazione, leggibilità e manutenibilità del codice;
• Eventuale deployment dell’applicazione.
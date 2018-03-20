var indice_uri = "../components/header/indice_pagine.json";

// Richiamato al caricamento della pagina
$(document).ready(function () {

    // ------------------------------- Cambio Lingua ----------------------------- //

    $(".lang_box").click(function () {
        // Lingua da bottone premuto
        var linguaNew = $(this).attr("data-lang");
        var current = location.pathname;
        var s = current.split("/");
        // Pagina e lingua attuale dal path
        var paginaAttuale = s[s.length - 1];
        var linguaAttuale = s[s.length - 2];

        /*
        V 2.0 da controllare

        // Controllo se il parametro preso è un link .html.
        // Utile se si aggiungessero parametri alla url con /.
        // es: src/IT/articolo/nome/aaa
        // Cicla tutta la url in cerca di lingua e pagina

        var pattern = /^[a-z-_ ?]+[.](html)$/;
        for(var i=0;i < s.length;i++){
            if(pattern.test(s[i])){
                console.log(s[i]);
            }
            else{
                switch (s[i]){
                    case "IT" :
                        linguaAttuale = "IT";
                        break;
                    case "EN" :
                       linguaAttuale = "EN";
                        break;
                    // Se non riesce a trovare la lingua attuale, default italiano
                    default:
                        linguaAttuale = "IT";
                }
            }
        }
        */

        // Non eseguo se sono già su quella lingua
        if (linguaAttuale !== linguaNew && paginaAttuale !== null) {
            //cerco la pagina nel json nella lingua specificata
            findPage(linguaAttuale, linguaNew, paginaAttuale);
        }
        else {
            console.log("Gia sulla versione " + linguaAttuale);
        }
    });

    // Cerca la pagina nel file di indice
    function findPage(linguaAttuale, linguaNew, pagina) {

        $.getJSON(indice_uri).done(function (data) {
            var pageArray = data.pagine;
            $.each(pageArray, function (i, data) {
                // Ottengo il riferimento della pagina per poi selezinare quella nella nuova lingua
                if (data.pagina == pagina && data.lingua == linguaAttuale) {
                    switchLang(data.rif, linguaNew);
                    return;
                }
                // Se non trova la pagina manda a index con la nuova lingua
                location.replace("/src/" + linguaNew + "/index.html");
            });
            // Errore json
        }).fail(function () {
            console.log("Errore lettura json");
        });
    }

    // Cambio lingua e reindirizzo
    function switchLang(id, lingua) {
        $.getJSON(indice_uri).done(function (data) {
            var pageArray = data.pagine;
            $.each(pageArray, function (i, data) {
                // Se trovo quel riferimento e quella lingua nel file json
                if (data.rif == id && data.lingua == lingua) {
                    location.replace("/src/" + lingua + "/" + data.pagina);
                    return;
                }
            });
        }).fail(function () {
            console.log("Errore lettura json");
        });
    }

    // ------------------------------- FINE Cambio Lingua ----------------------------- //



    // --------------------------------- Creazione Menu ------------------------------- //

    // Uri del json con il menu
    var uri;

    //Recupero la limgua attuale
    var current = location.pathname;
    var s = current.split("/");
    var linguaAttuale = s[s.length - 2];

    // Switch sulla lingua per selezionare il json corretto
    switch (linguaAttuale) {
        case "IT" :
            uri = "../components/header/header_IT.json";
            break;
        case "EN" :
            uri = "../components/header/header_EN.json";
            break;
        // Se non riesce a trovare la lingua attuale, default in italiano
        default:
            uri = "../components/header/header_IT.json";
    }


    $.getJSON(uri).done(elaboraJson).fail(erroreJson);

    //successo, json corretto
    function elaboraJson(data) {
        // ciclo sul json e chiamo root
        $.each(data, root);
    }

    //errore, json non corretto
    function erroreJson(data) {
        console.log("Errore nel file Json della struttura del menu, impossibile creare il menu");
        $("#menu").append("<h2>Errore caricamento menu</h2>");
    }

    // Callback, creazione root con chiave valore
    function root(k, v) { //k = menu, v = voci menu

        // creo ul
        var parent = $("#menu");

        // ho fratelli?
        // si : chiamo a, no : fine ciclo
        $.each(v, function (key, val) {
            //richiamo a per ogni voce del menu
            addNodo(val, parent);
        });
    }

    // Funzioe di aggiunta nodo al dom, ricorsiva
    function addNodo(nodo, parent) {

        //controllo l'id del parent
        var t1 = parent.attr("id");

        // il parent è <ul>
        if (t1 == "menu") {

            //aggiungo <li> e <a>
            var li = $("<li>").addClass("nav-item");
            var a = $("<a>").addClass("nav-link").appendTo(li);
            a.attr('href', nodo.uri).html(nodo.testo);
            parent.append(li);

            //Aggiungo la classe active se sono su quel link, ricavato da url
            var current = location.pathname;
            var s = current.split("/");
            var sUri = s[s.length - 1];

            if (nodo.uri == sUri) {
                a.addClass('active');
            }

            //Controllo se ha figli
            if (haFigli(nodo)) {
                // aggiungo classi a li per dropdown
                li.addClass("dropdown");
                a.addClass("dropdown-toggle");
                a.attr({
                    'id': 'navbarDropdownMenuLink',
                    'data-toggle': 'dropdown',
                    'aria-haspopup': 'true',
                    'aria-expanded': 'false'
                });

                // creo <div> e <a> del dropdown
                var subParent = $("<div>");
                //subParent.attr("id", guid);
                subParent.addClass("dropdown-menu");
                li.append(subParent);

                // ho fratelli?
                // si : chiamo a, no : fine ciclo
                $.each(nodo, function (key, val) {
                    //richiamo a per ogni voce del menu, con parent div
                    addNodo(val, subParent);
                });
            }
        }

        // il parent è <div>
        else {
            // è una voce del menu dropdown
            if (isDropdown(nodo)) {
                $("<a>").addClass("dropdown-item").html(nodo.testo).attr("href", nodo.uri).appendTo(parent);
                // Se nodo avesse altri elementi o oggetti annidati all'interno li ignora.
                // Gestisce solo i campi "testo" e "uri"
            }
        }
    }

    // controllo se il nodo ha figli, true o false
    function haFigli(nodo) {
        var figli = false;
        $.each(nodo, function (key, val) {
            var isObject = val instanceof Object;
            if (isObject) {
                figli = true;
            }
        });
        return figli;
    }

    //controlla se è un oggetto e quindi va nel dorpdown
    function isDropdown(nodo) {
        var isObject = nodo instanceof Object;
        return isObject ? true : false;
    }

    // ------------------------------- FINE creazione menu ---------------------------- //


}); // Fine ready

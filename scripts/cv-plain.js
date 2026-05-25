CV.initHireModal("hire-plain");

window.showToast = function(message) {
  var container = document.getElementById("cv-toaster-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "cv-toast";
  toast.innerHTML = '<span>' + message + '</span><button class="cv-toast-close" aria-label="Close">×</button>';

  var closeBtn = toast.querySelector(".cv-toast-close");

  function removeToast() {
    toast.classList.add("hiding");
    setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }

  closeBtn.addEventListener("click", removeToast);
  setTimeout(removeToast, 3000);

  container.appendChild(toast);
};

(function () {
  var btn = document.getElementById("theme-toggle");
  var overlay = null;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var states = isTouch ? ["light", "dark"] : ["light", "dark", "superdark", "nightvision", "predator"];
  var icons = isTouch
    ? ["assets/images/sun.webp", "assets/images/moon.webp"]
    : ["assets/images/sun.webp", "assets/images/moon.webp", "assets/images/flashlight.webp", "assets/images/nightvision.webp", "assets/images/predator.webp"];
  var savedTheme = localStorage.getItem("cv-swagger-theme");
  var current = (savedTheme && states.indexOf(savedTheme) !== -1) ? savedTheme : CV.getSystemTheme();
  if (states.indexOf(current) === -1) current = "light";

  var CURSOR_KEY = "cv-superdark-cursor";
  var wordsWrapped = false;

  function updateOverlay(x, y) {
    if (!overlay) return;
    overlay.style.background = "radial-gradient(circle 250px at " + x + "px " + y + "px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 12%, transparent 25%, transparent 52%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.9) 94%, rgba(0,0,0,0.92) 100%)";
  }

  function onMouseMove(e) {
    var x = e.clientX, y = e.clientY;
    updateOverlay(x, y);
    localStorage.setItem(CURSOR_KEY, x + "," + y);
  }

  function wrapWords(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      if (!element.textContent.trim()) return;
      const words = element.textContent.split(/(\s+)/);
      const fragments = document.createDocumentFragment();
      words.forEach(word => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.className = 'nv-word';
          span.textContent = word;
          // Use CSS variable so it only affects Night Vision
          span.style.setProperty('--nv-fs', (0.96 + Math.random() * 0.09).toFixed(3) + 'em');
          // Radical green color variation
          var g = Math.floor(160 + Math.random() * 95);
          var r = Math.floor(20 + Math.random() * 100);
          span.style.setProperty('--nv-c', 'rgb(' + r + ',' + g + ',' + r + ')');
          fragments.appendChild(span);
        } else {
          fragments.appendChild(document.createTextNode(word));
        }
      });
      element.replaceWith(fragments);
    } else if (element.nodeType === Node.ELEMENT_NODE &&
               element.tagName !== 'SCRIPT' &&
               element.tagName !== 'STYLE' &&
               element.tagName !== 'SVG' &&
               !element.classList.contains('blockTitle')) {
      const children = Array.from(element.childNodes);
      children.forEach(child => wrapWords(child));
    }
  }

  function apply(state) {
    document.documentElement.setAttribute("data-theme", state);
    localStorage.setItem("cv-swagger-theme", state);
    current = state;

    var icon = icons[states.indexOf(state)];
    if (icon.endsWith(".webp")) {
      btn.innerHTML = '<img src="' + icon + '" class="theme-icon-img" alt="theme icon">';
    } else {
      btn.textContent = icon;
    }

    if (state === "superdark") {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998";
        document.body.appendChild(overlay);
      }
      overlay.style.display = "";
      document.documentElement.style.cursor = "none";
      var saved = localStorage.getItem(CURSOR_KEY);
      if (saved) {
        var parts = saved.split(",");
        updateOverlay(parseInt(parts[0]), parseInt(parts[1]));
      }
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.documentElement.style.cursor = "";
      if (overlay) overlay.style.display = "none";
      document.removeEventListener("mousemove", onMouseMove);
    }

    if (state === "nightvision" && !wordsWrapped) {
      wrapWords(document.querySelector('.cvLayout.base.cv'));
      wordsWrapped = true;
    }
  }

  btn.addEventListener("click", function () {
    var idx = states.indexOf(current);
    var nextState = states[(idx + 1) % states.length];
    apply(nextState);
    if (window.showToast) window.showToast("Theme changed to " + nextState);
  });

  apply(current);
})();

(function () {
  var decors = ["decor1.svg", "decor2.svg", "decor3.svg", "decor4.svg", "decor5.svg", "decor6.svg"];
  var items = document.querySelectorAll(".workExperienceItem");
  if (items.length > 0) items[items.length - 1].classList.add("no-decor");
  for (var t = 0; t < items.length; t++) {
    var title = items[t].querySelector(".itemTitle")?.textContent.trim();
    if (title === "Deutsche Telekom IT Solutions HU" || title === "CobotX Technologies") {
      items[t].classList.add("no-decor");
    }
  }

  for (var i = decors.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = decors[i]; decors[i] = decors[j]; decors[j] = tmp;
  }

  for (var k = 0; k < items.length - 1; k++) {
    var img = document.createElement("img");
    img.src = "./assets/images/" + decors[k % decors.length];
    img.alt = "";
    img.className = "work-decor";
    img.style.cssText = "display:block;width:400px;max-width:80%;height:30px;object-fit:contain;margin:3mm auto 3mm";
    items[k].parentNode.insertBefore(img, items[k].nextSibling);
  }
})();

CV.initFormspree("#hire-plain-form");

(function () {
  var audio = document.getElementById("music-audio");
  var toggleBtn = document.getElementById("music-toggle");
  var panel = document.getElementById("music-panel");
  var playPauseBtn = document.getElementById("music-playpause");

  var customSelect = document.getElementById("custom-genre-select");
  if (!customSelect) return; // safeguard if HTML is not updated
  var trigger = customSelect.querySelector(".custom-select-trigger");
  var triggerText = trigger.querySelector("span");
  var options = customSelect.querySelectorAll(".custom-option");
  var lyricsBtn = document.getElementById("music-lyrics");
  var lyricsModal = document.getElementById("lyrics-modal");
  var lyricsClose = document.getElementById("lyrics-close");
  var lyricsBackdrop = document.getElementById("lyrics-backdrop");

  var isOpen = false;
  var isPlaying = false;
  var savedGenre = localStorage.getItem("cv-music-genre");
  var currentValue = options[0].getAttribute("data-value"); // default
  var currentLabel = options[0].textContent;

  // === MULTI-LANGUAGE LYRICS ===
  var LYRICS_MAP = {
    'assets/music/polka-schramli.mp3': `[intro]

[strophe]
Der Bildschirm im Browser leuchtet still im Raum
Ich folge den Codes durch digitalen Schattenraum
Mit ruhiger Hand entwerfe ich das Design
Ein Geist, der Lösungen findet, wo Logik sich vereint

Ich richte die Pfeiler, wo alte Balken schwanken
Und leite verlorene Energie auf ihren Bahnen
Nicht nur ein Gesicht für den flüchtigen Blick
Sondern Geschichten von Funktionen klingen zu mir zurück

[pre-chorus]
Die Daten strömen tief aus fernen Servern her
Ich verwebe jeden Faden mit meisterhaftem Gespür
Aus der Dunkelheit ins Licht, wo Nutzer sich vereinen
Ich halte das Steuer ihres Schicksals im Design

[refrain]
Gib mir die Schlüssel zu dem Reich, das du erschufst
Sieh, wie jedes Versprechen zu Gold wird, wenn du es rufst
Ich bin der Architekt, der den Stromlauf formt
Die Brücke zu den Küsten deiner kühnsten Träume dort

Entfache das Feuer, das wagt, sich neu zu definieren
Die Zukunft steht geschrieben in jeder Zeile hier
Ja, die Zukunft steht geschrieben in jeder Zeile hier

[strophe]
Ich lehrte Maschinen zu denken und zu erneuern
Das Chaos zu ordnen auf virtuellen Gemäuern
Der Workflow summt wie Wind in den Blättern sacht
Und löst jedes Rätsel in dem Moment, da es erwacht

Das Refactoring glänzt wie Morgendämmerung nach dem Regen
Ersetzt das Zerbrechliche durch eisernes Vermögen
Ich lese das Interface und säe den Samen ein
Wo Logik Wurzeln schlägt im Boden der Notwendigkeit hinein

[pre-chorus]
Die Daten strömen tief aus fernen Servern her
Ich verwebe jeden Faden mit meisterhaftem Gespür
Aus der Dunkelheit ins Licht, wo Nutzer sich vereinen
Ich halte das Steuer ihres Schicksals im Design

[refrain]
Gib mir die Schlüssel zu dem Reich, das du erschufst
Sieh, wie jedes Versprechen zu Gold wird, wenn du es rufst
Ich bin der Architekt, der den Stromlauf formt
Die Brücke zu den Küsten deiner kühnsten Träume dort

Entfache das Feuer, das wagt, sich neu zu definieren
Die Zukunft steht geschrieben in jeder Zeile hier
Ja, die Zukunft steht geschrieben in jeder Zeile hier

[refrain]
Gib mir die Schlüssel zu dem Reich, das du erschufst
Sieh, wie jedes Versprechen zu Gold wird, wenn du es rufst
Ich bin der Architekt, der den Stromlauf formt
Die Brücke zu den Küsten deiner kühnsten Träume dort

Entfache das Feuer, das wagt, sich neu zu definieren
Die Zukunft steht geschrieben in jeder Zeile hier
Ja, die Zukunft steht geschrieben in jeder Zeile hier

[outro]`,
    'assets/music/chanzon.mp3': `[intro]

[couplet]
L'écran du navigateur brille dans la pièce silencieuse
Je suis les codes à travers la pénombre numérique
D'une main sûre, je façonne le design
Un esprit qui résout là où la logique s'aligne

Je répare les piliers où vacillent les vieilles poutres
Et guide l'énergie perdue sur son chemin
Pas seulement un visage offert aux regards
Mais des récits de fonction me murmurant à l'oreille

[pré-refrain]
Les données circulent profondément depuis des serveurs lointains
Je tisse chaque fil avec un art maîtrisé
De l'ombre vers la lumière où les utilisateurs convergent
Je tiens le gouvernail de leur destin dans le design

[refrain]
Donne-moi les clés du royaume que tu as créé
Regarde chaque promesse se changer en or sous les yeux
Je suis l'architecte qui façonne le courant
Le pont vers les rivages de tes rêves les plus fous

Engage le feu qui ose définir
Le futur s'écrit dans chaque ligne
Oui, le futur s'écrit dans chaque ligne

[couplet]
J'ai appris aux machines à penser et restaurer
Ordonnant le chaos sur des sols virtuels
Le flux de travail bourdonne comme le vent dans les feuilles
Résolvant chaque énigme à l'instant où elle respire

Le refactoring brille comme l'aube après la pluie
Remplaçant le fragile par le royaume du fer
Je lis l'interface et plante la graine
Là où la logique prend racine dans la terre du besoin

[pré-refrain]
Les données circulent profondément depuis des serveurs lointains
Je tisse chaque fil avec un art maîtrisé
De l'ombre vers la lumière où les utilisateurs convergent
Je tiens le gouvernail de leur destin dans le design

[refrain]
Donne-moi les clés du royaume que tu as créé
Regarde chaque promesse se changer en or sous les yeux
Je suis l'architecte qui façonne le courant
Le pont vers les rivages de tes rêves les plus fous

Engage le feu qui ose définir
Le futur s'écrit dans chaque ligne
Oui, le futur s'écrit dans chaque ligne

[refrain]
Donne-moi les clés du royaume que tu as créé
Regarde chaque promesse se changer en or sous les yeux
Je suis l'architecte qui façonne le courant
Le pont vers les rivages de tes rêves les plus fous

Engage le feu qui ose définir
Le futur s'écrit dans chaque ligne
Oui, le futur s'écrit dans chaque ligne

[outro]`,
    'assets/music/falmenco.mp3': `[intro]

[verso]
La pantalla del navegador ilumina la habitación en silencio
Sigo el rastro del código entre la penumbra digital
Con manos firmes doy forma al diseño
Una mente que resuelve cuando la lógica encaja

Reparo los cimientos donde tiemblan las viejas vigas
Y encamino la energía perdida por su cauce
No soy solo un rostro para que otros contemplen
Sino historias de función susurrándome al oído

[pre-estribillo]
Los datos fluyen desde servidores lejanos
Tejo cada hilo con arte y precisión
De la oscuridad a la luz, donde confluyen los usuarios
Sostengo el timón de su destino en el diseño

[estribillo]
Dame las llaves del reino que has creado
Mira cómo cada promesa se vuelve oro al revelarse
Soy el arquitecto que da forma a la corriente
El puente hacia las orillas de tu sueño más salvaje

Contrata al fuego que se atreve a dar forma
El futuro está escrito en cada línea
Sí, el futuro está escrito en cada línea

[verso]
Enseñé a las máquinas a pensar y a restaurar
Ordenando el caos sobre pisos virtuales
El flujo de trabajo zumba como viento entre las hojas
Respondiendo a cada enigma en el instante en que surge

El refactor brilla como el amanecer tras la lluvia
Sustituyendo lo frágil por la solidez del hierro
Leo la interfaz y siembro la semilla
Donde la lógica echa raíces en la tierra de la necesidad

[pre-estribillo]
Los datos fluyen desde servidores lejanos
Tejo cada hilo con arte y precisión
De la oscuridad a la luz, donde confluyen los usuarios
Sostengo el timón de su destino en el diseño

[estribillo]
Dame las llaves del reino que has creado
Mira cómo cada promesa se vuelve oro al revelarse
Soy el arquitecto que da forma a la corriente
El puente hacia las orillas de tu sueño más salvaje

Contrata al fuego que se atreve a dar forma
El futuro está escrito en cada línea
Sí, el futuro está escrito en cada línea

[estribillo]
Dame las llaves del reino que has creado
Mira cómo cada promesa se vuelve oro al revelarse
Soy el arquitecto que da forma a la corriente
El puente hacia las orillas de tu sueño más salvaje

Contrata al fuego que se atreve a dar forma
El futuro está escrito en cada línea
Sí, el futuro está escrito en cada línea

[outro]`,
    'assets/music/hungarian_nota.mp3': `[intro]

[verze]
A böngésző fénye vibrál csendesen
Kódok nyomát kutatom a digitális ködben
Biztos kézzel épül minden tervrajz
Egy elme oldja meg hol a logika összeáll

Megjavítom az oszlopot hol a régi gerenda inog
És visszavezetem az energiát mit az idő szétszórt
Nem csupán felszín a szemnek hogy ragyogjon
Hanem funkciók története mely bennem suttog

[pre-refrén]
Az adatok mélyen futnak távoli szervereken át
Minden szálat összeszövök mesterségem súlyán
A sötétből a fénybe hol a felhasználók várnak rám
Én tartom kezemben a sorsuk irányát

[refrén]
Add nekem a kulcsot mit a birodalmad zár
Nézd ahogy minden ígéret arannyá vál
Én vagyok az építész ki formálja az áramlást
A híd mely elvezet álmaid partján át

Fogadd fel a tüzet mely új formát teremt
A jövő minden sorban megszületett
Igen a jövő minden sorban megszületett

[verze]
Megtanítottam a gépeket gondolkodni újra
Rendet rakni a káosz virtuális útjaiban
A workflow zúg mint szél a lombok alatt
Minden rejtély megoldódik amint életre fakad

A refaktor ragyog mint eső utáni hajnal
A törékenyt vasra cseréli hatalommal
Olvasom az interfészt és magot vetek el
Hol a logika gyökeret ver az igényekben

[pre-refrén]
Az adatok mélyen futnak távoli szervereken át
Minden szálat összeszövök mesterségem súlyán
A sötétből a fénybe hol a felhasználók várnak rám
Én tartom kezemben a sorsuk irányát

[refrén]
Add nekem a kulcsot mit a birodalmad zár
Nézd ahogy minden ígéret arannyá vál
Én vagyok az építész ki formálja az áramlást
A híd mely elvezet álmaid partján át

Fogadd fel a tüzet mely új formát teremt
A jövő minden sorban megszületett
Igen a jövő minden sorban megszületett

[refrén]
Add nekem a kulcsot mit a birodalmad zár
Nézd ahogy minden ígéret arannyá vál
Én vagyok az építész ki formálja az áramlást
A híd mely elvezet álmaid partján át

Fogadd fel a tüzet mely új formát teremt
A jövő minden sorban megszületett
Igen a jövő minden sorban megszületett

[outro]`,
      'assets/music/hire_me_song.mp3': `[intro]
Oh mighty hiring manager, I come in peace and perfect Wi-Fi

[verse]
The browser glows, and I haven't slept in days
I've debugged my own life more than your backend maze
I trail your codebase like a tragic crime show
Found semicolons missing where they should not go

I fix your broken layouts at 3 a.m.
And chat with console errors like they're my only friend
I swear I know React, and I know it pretty well
Even when production feels like a special kind of hell

[pre-chorus]
The data runs deep, but I don't even blink
I can ship before you finish your coffee drink
From dark mode to light, I align your UI
Just please read my résumé before you say goodbye

[chorus]
Hire me, please, I'm begging on code
I've even fixed bugs in my own soul
I am the architect of mildly stable dreams
Please let me join your development team

Hire me, please, I'm running on pride
And Stack Overflow tabs I can't hide
Yes, I wrote tests that sometimes pass
Please don't ignore my GitHub class

[verse]
I taught myself APIs at questionable times
While eating instant noodles and writing bad rhymes
My workflow hums like a broken fan
But I still somehow ship whatever I can

I refactor code like I'm fixing my fate
Renaming variables just to feel great
I read your UI like sacred text
And pray my CSS won't be the next

[pre-chorus]
The data runs deep, I'm emotionally invested
My localhost dreams are heavily tested
From bug to feature, I try to survive
Please just let me get this job and thrive

[chorus]
Hire me, please, I'm begging on code
I've even fixed bugs in my own soul
I am the architect of mildly stable dreams
Please let me join your development team

Hire me, please, I'm running on pride
And Stack Overflow tabs I can't hide
Yes, I wrote tests that sometimes pass
Please don't ignore my GitHub class

[outro]
If not... I'll still fix your CSS from the shadows`,
};

  var DEFAULT_LYRICS = `[intro]

[verse]
The browser screen glows in the silent room
I trace the codes through digital gloom
With steady hands I frame the design
A mind that solves where logic aligns

I mend the pillars where old beams sway
And guide the lost energy on its way
Not just a face for the eyes to see
But tales of function whispering to me

[pre-chorus]
The data runs deep from servers apart
I weave every thread with mastering art
From the dark to the light where users align
I hold the wheel of their fate in design

[chorus]
Give me the keys to the kingdom you made
Watch every vow turn to gold as displayed
I am the architect shaping the stream
The bridge to the shores of your wildest dream

Hire the fire that dares to define
The future is written in every line
Yes the future is written in every line

[verse]
I taught machines how to think and restore
Arranging the chaos on virtual floors
The workflow hums like wind through the leaves
Solving each riddle the moment it breathes

The refactor shines like dawn after rain
Replacing the fragile with iron's domain
I read the interface and plant the seed
Where logic takes root in the soil of need

[pre-chorus]
The data runs deep from servers apart
I weave every thread with mastering art
From the dark to the light where users align
I hold the wheel of their fate in design

[chorus]
Give me the keys to the kingdom you made
Watch every vow turn to gold as displayed
I am the architect shaping the stream
The bridge to the shores of your wildest dream

Hire the fire that dares to define
The future is written in every line
Yes the future is written in every line

[chorus]
Give me the keys to the kingdom you made
Watch every vow turn to gold as displayed
I am the architect shaping the stream
The bridge to the shores of your wildest dream

Hire the fire that dares to define
The future is written in every line
Yes the future is written in every line

[outro]`;

  function getLyricsForTrack(trackPath) {
    return LYRICS_MAP[trackPath] || DEFAULT_LYRICS;
  }

  function updateLyricsContent() {
    var pre = document.getElementById('lyrics-text');
    if (pre) {
      pre.textContent = getLyricsForTrack(currentValue);
    }
  }

  if (savedGenre) {
    for (var i = 0; i < options.length; i++) {
      if (options[i].getAttribute("data-value") === savedGenre) {
        currentValue = savedGenre;
        currentLabel = options[i].textContent;
        break;
      }
    }
  }
  triggerText.textContent = currentLabel;

  function loadTrack() {
    if (!audio.src || !audio.src.endsWith(currentValue)) {
      audio.src = currentValue;
      audio.load();
    }
  }

  function updatePlayPause() {
    playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
    if (isPlaying) {
      toggleBtn.classList.add("playing");
    } else {
      toggleBtn.classList.remove("playing");
    }
  }

  function openPanel() {
    isOpen = true;
    panel.classList.remove("music-panel-hidden");
    toggleBtn.classList.add("active");
    loadTrack();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add("music-panel-hidden");
    toggleBtn.classList.remove("active");
    customSelect.classList.remove("open");
  }

  toggleBtn.addEventListener("click", function () {
    if (isOpen) closePanel();
    else openPanel();
  });

  // Custom select logic
  trigger.addEventListener("click", function() {
    customSelect.classList.toggle("open");
  });

  for (var j = 0; j < options.length; j++) {
    options[j].addEventListener("click", function(e) {
      currentValue = e.target.getAttribute("data-value");
      currentLabel = e.target.textContent;
      triggerText.textContent = currentLabel;
      customSelect.classList.remove("open");

      localStorage.setItem("cv-music-genre", currentValue);
      var wasPlaying = isPlaying;
      audio.pause();
      isPlaying = false;
      loadTrack();
      updateLyricsContent();
      var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/,'').trim();
      if (window.showToast) window.showToast("Music changed to " + cleanLabel);
      if (wasPlaying) {
        audio.play().then(function () { isPlaying = true; updatePlayPause(); }).catch(function(){});
      }
      updatePlayPause();
    });
  }

  // Close custom select if clicked outside
  document.addEventListener("click", function(e) {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });

  playPauseBtn.addEventListener("click", function () {
    var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/,'').trim();
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (window.showToast) window.showToast(cleanLabel + " music paused");
    } else {
      loadTrack();
      audio
        .play()
        .then(function () {
          isPlaying = true;
          updatePlayPause();
          if (window.showToast) window.showToast(cleanLabel + " music playing");
        })
        .catch(function () {});
    }
    updatePlayPause();
  });

  audio.addEventListener("ended", function () {
    isPlaying = false;
    updatePlayPause();
  });

  function openLyrics() {
    if (!lyricsModal) return;
    updateLyricsContent();
    lyricsModal.classList.remove("cv-modal-hidden");
  }

  function closeLyrics() {
    if (!lyricsModal) return;
    lyricsModal.classList.add("cv-modal-hidden");
  }

  if (lyricsBtn) lyricsBtn.addEventListener("click", openLyrics);
  if (lyricsClose) lyricsClose.addEventListener("click", closeLyrics);
  if (lyricsBackdrop) lyricsBackdrop.addEventListener("click", closeLyrics);

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      lyricsModal &&
      !lyricsModal.classList.contains("cv-modal-hidden")
    ) {
      closeLyrics();
    }
  });

  updatePlayPause();
})();

(function() {
  // First time after 1 minute (60,000 ms)
  setTimeout(function() {
    if (window.showToast) window.showToast("Hurry! Somebody almost hired Viktor.");

    function scheduleNextHurry() {
      // Randomly between 3 and 5 minutes
      var minMs = 3 * 60 * 1000;
      var maxMs = 5 * 60 * 1000;
      var nextDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

      setTimeout(function() {
        if (window.showToast) window.showToast("Hurry! Somebody almost hired Viktor.");
        scheduleNextHurry();
      }, nextDelay);
    }

    scheduleNextHurry();
  }, 60 * 1000);
})();

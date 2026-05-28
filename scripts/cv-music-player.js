import { MUSIC_STATE_KEY, MUSIC_TIME_KEY, MUSIC_VOLUME_KEY, MUSIC_GENRE_KEY, MUSIC_REPEAT_KEY } from './config.js';

var LYRICS_MAP = {
  "assets/music/polka-schramli.mp3": `[intro]\r\n\r\n[strophe]\r\nDer Bildschirm im Browser leuchtet still im Raum\r\nIch folge den Codes durch digitalen Schattenraum\r\nMit ruhiger Hand entwerfe ich das Design\r\nEin Geist, der Lösungen findet, wo Logik sich vereint\r\n\r\nIch richte die Pfeiler, wo alte Balken schwanken\r\nUnd leite verlorene Energie auf ihren Bahnen\r\nNicht nur ein Gesicht für den flüchtigen Blick\r\nSondern Geschichten von Funktionen klingen zu mir zurück\r\n\r\n[pre-chorus]\r\nDie Daten strömen tief aus fernen Servern her\r\nIch verwebe jeden Faden mit meisterhaftem Gespür\r\nAus der Dunkelheit ins Licht, wo Nutzer sich vereinen\r\nIch halte das Steuer ihres Schicksals im Design\r\n\r\n[refrain]\r\nGib mir die Schlüssel zu dem Reich, das du erschufst\r\nSieh, wie jedes Versprechen zu Gold wird, wenn du es rufst\r\nIch bin der Architekt, der den Stromlauf formt\r\nDie Brücke zu den Küsten deiner kühnsten Träume dort\r\n\r\nEntfache das Feuer, das wagt, sich neu zu definieren\r\nDie Zukunft steht geschrieben in jeder Zeile hier\r\nJa, die Zukunft steht geschrieben in jeder Zeile hier\r\n\r\n[strophe]\r\nIch lehrte Maschinen zu denken und zu erneuern\r\nDas Chaos zu ordnen auf virtuellen Gemäuern\r\nDer Workflow summt wie Wind in den Blättern sacht\r\nUnd löst jedes Rätsel in dem Moment, da es erwacht\r\n\r\nDas Refactoring glänzt wie Morgendämmerung nach dem Regen\r\nErsetzt das Zerbrechliche durch eisernes Vermögen\r\nIch lese das Interface und säe den Samen ein\r\nWo Logik Wurzeln schlägt im Boden der Notwendigkeit hinein\r\n\r\n[pre-chorus]\r\nDie Daten strömen tief aus fernen Servern her\r\nIch verwebe jeden Faden mit meisterhaftem Gespür\r\nAus der Dunkelheit ins Licht, wo Nutzer sich vereinen\r\nIch halte das Steuer ihres Schicksals im Design\r\n\r\n[refrain]\r\nGib mir die Schlüssel zu dem Reich, das du erschufst\r\nSieh, wie jedes Versprechen zu Gold wird, wenn du es rufst\r\nIch bin der Architekt, der den Stromlauf formt\r\nDie Brücke zu den Küsten deiner kühnsten Träume dort\r\n\r\nEntfache das Feuer, das wagt, sich neu zu definieren\r\nDie Zukunft steht geschrieben in jeder Zeile hier\r\nJa, die Zukunft steht geschrieben in jeder Zeile hier`,
  "assets/music/chanzon.mp3": `[intro]\r\n\r\n[couplet]\r\nL'écran du navigateur brille dans la pièce silencieuse\r\nJe suis les codes à travers la pénombre numérique\r\nD'une main sûre, je façonne le design\r\nUn esprit qui résout là où la logique s'aligne\r\n\r\nJe répare les piliers où vacillent les vieilles poutres\r\nEt guide l'énergie perdue sur son chemin\r\nPas seulement un visage offert aux regards\r\nMais des récits de fonction me murmurant à l'oreille\r\n\r\n[pré-refrain]\r\nLes données circulent profondément depuis des serveurs lointains\r\nJe tisse chaque fil avec un art maîtrisé\r\nDe l'ombre vers la lumière où les utilisateurs convergent\r\nJe tiens le gouvernail de leur destin dans le design\r\n\r\n[refrain]\r\nDonne-moi les clés du royaume que tu as créé\r\nRegarde chaque promesse se changer en or sous les yeux\r\nJe suis l'architecte qui façonne le courant\r\nLe pont vers les rivages de tes rêves les plus fous\r\n\r\nEngage le feu qui ose définir\r\nLe futur s'écrit dans chaque ligne\r\nOui, le futur s'écrit dans chaque ligne\r\n\r\n[couplet]\r\nJ'ai appris aux machines à penser et restaurer\r\nOrdonnant le chaos sur des sols virtuels\r\nLe flux de travail bourdonne comme le vent dans les feuilles\r\nRésolvant chaque énigme à l'instant où elle respire\r\n\r\nLe refactoring brille comme l'aube après la pluie\r\nRemplaçant le fragile par le royaume du fer\r\nJe lis l'interface et plante la graine\r\nLà où la logique prend racine dans la terre du besoin\r\n\r\n[pré-refrain]\r\nLes données circulent profondément depuis des serveurs lointains\r\nJe tisse chaque fil avec un art maîtrisé\r\nDe l'ombre vers la lumière où les utilisateurs convergent\r\nJe tiens le gouvernail de leur destin dans le design\r\n\r\n[refrain]\r\nDonne-moi les clés du royaume que tu as créé\r\nRegarde chaque promesse se changer en or sous les yeux\r\nJe suis l'architecte qui façonne le courant\r\nLe pont vers les rivages de tes rêves les plus fous\r\n\r\nEngage le feu qui ose définir\r\nLe futur s'écrit dans chaque ligne\r\nOui, le futur s'écrit dans chaque ligne`,
  "assets/music/flamenco.mp3": `[intro]\r\n\r\n[verso]\r\nLa pantalla del navegador ilumina la habitación en silencio\r\nSigo el rastro del código entre la penumbra digital\r\nCon manos firmes doy forma al diseño\r\nUna mente que resuelve cuando la lógica encaja\r\n\r\nReparo los cimientos donde tiemblan las viejas vigas\r\nY encamino la energía perdida por su cauce\r\nNo soy solo un rostro para que otros contemplen\r\nSino historias de función susurrándome al oído\r\n\r\n[pre-estribillo]\r\nLos datos fluyen desde servidores lejanos\r\nTejo cada hilo con arte y precisión\r\nDe la oscuridad a la luz, donde confluyen los usuarios\r\nSostengo el timón de su destino en el diseño\r\n\r\n[estribillo]\r\nDame las llaves del reino que has creado\r\nMira cómo cada promesa se vuelve oro al revelarse\r\nSoy el arquitecto que da forma a la corriente\r\nEl puente hacia las orillas de tu sueño más salvaje\r\n\r\nContrata al fuego que se atreve a dar forma\r\nEl futuro está escrito en cada línea\r\nSí, el futuro está escrito en cada línea\r\n\r\n[verso]\r\nEnseñé a las máquinas a pensar y a restaurar\r\nOrdenando el caos sobre pisos virtuales\r\nEl flujo de trabajo zumba como viento entre las hojas\r\nRespondiendo a cada enigma en el instante en que surge\r\n\r\nEl refactor brilla como el amanecer tras la lluvia\r\nSustituyendo lo frágil por la solidez del hierro\r\nLeo la interfaz y siembro la semilla\r\nDonde la lógica echa raíces en la tierra de la necesidad\r\n\r\n[pre-estribillo]\r\nLos datos fluyen desde servidores lejanos\r\nTejo cada hilo con arte y precisión\r\nDe la oscuridad a la luz, donde confluyen los usuarios\r\nSostengo el timón de su destino en el diseño\r\n\r\n[estribillo]\r\nDame las llaves del reino que has creado\r\nMira cómo cada promesa se vuelve oro al revelarse\r\nSoy el arquitecto que da forma a la corriente\r\nEl puente hacia las orillas de tu sueño más salvaje\r\n\r\nContrata al fuego que se atreve a dar forma\r\nEl futuro está escrito en cada línea\r\nSí, el futuro está escrito en cada línea`,
  "assets/music/hungarian_nota.mp3": `[intro]\r\n\r\n[verze]\r\nA böngésző fénye vibrál csendesen\r\nKódok nyomát kutatom a digitális ködben\r\nBiztos kézzel épül minden tervrajz\r\nEgy elme oldja meg hol a logika összeáll\r\n\r\nMegjavítom az oszlopot hol a régi gerenda inog\r\nÉs visszavezetem az energiát mit az idő szétszórt\r\nNem csupán felszín a szemnek hogy ragyogjon\r\nHanem funkciók története mely bennem suttog\r\n\r\n[pre-refrén]\r\nAz adatok mélyen futnak távoli szervereken át\r\nMinden szálat összeszövök mesterségem súlyán\r\nA sötétből a fénybe hol a felhasználók várnak rám\r\nÉn tartom kezemben a sorsuk irányát\r\n\r\n[refrén]\r\nAdd nekem a kulcsot mit a birodalmad zár\r\nNézd ahogy minden ígéret arannyá vál\r\nÉn vagyok az építész ki formálja az áramlást\r\nA híd mely elvezet álmaid partján át\r\n\r\nFogadd fel a tüzet mely új formát teremt\r\nA jövő minden sorban megszületett\r\nIgen a jövő minden sorban megszületett\r\n\r\n[verze]\r\nMegtanítottam a gépeket gondolkodni újra\r\nRendet rakni a káosz virtuális útjaiban\r\nA workflow zúg mint szél a lombok alatt\r\nMinden rejtély megoldódik amint életre fakad\r\n\r\nA refaktor ragyog mint eső utáni hajnal\r\nA törékenyt vasra cseréli hatalommal\r\nOlvasom az interfészt és magot vetek el\r\nHol a logika gyökeret ver az igényekben\r\n\r\n[pre-refrén]\r\nAz adatok mélyen futnak távoli szervereken át\r\nMinden szálat összeszövök mesterségem súlyán\r\nA sötétből a fénybe hol a felhasználók várnak rám\r\nÉn tartom kezemben a sorsuk irányát\r\n\r\n[refrén]\r\nAdd nekem a kulcsot mit a birodalmad zár\r\nNézd ahogy minden ígéret arannyá vál\r\nÉn vagyok az építész ki formálja az áramlást\r\nA híd mely elvezet álmaid partján át\r\n\r\nFogadd fel a tüzet mely új formát teremt\r\nA jövő minden sorban megszületett\r\nIgen a jövő minden sorban megszületett`,
  "assets/music/hire_me_song.mp3": `[intro]\r\nOh mighty hiring manager, I come in peace and perfect Wi-Fi\r\n\r\n[verse]\r\nThe browser glows, and I haven't slept in days\r\nI've debugged my own life more than your backend maze\r\nI trail your codebase like a tragic crime show\r\nFound semicolons missing where they should not go\r\n\r\nI fix your broken layouts at 3 a.m.\r\nAnd chat with console errors like they're my only friend\r\nI swear I know React, and I know it pretty well\r\nEven when production feels like a special kind of hell\r\n\r\n[pre-chorus]\r\nThe data runs deep, but I don't even blink\r\nI can ship before you finish your coffee drink\r\nFrom dark mode to light, I align your UI\r\nJust please read my résumé before you say goodbye\r\n\r\n[chorus]\r\nHire me, please, I'm begging on code\r\nI've even fixed bugs in my own soul\r\nI am the architect of mildly stable dreams\r\nPlease let me join your development team\r\n\r\nHire me, please, I'm running on pride\r\nAnd Stack Overflow tabs I can't hide\r\nYes, I wrote tests that sometimes pass\r\nPlease don't ignore my GitHub class\r\n\r\n[verse]\r\nI taught myself APIs at questionable times\r\nWhile eating instant noodles and writing bad rhymes\r\nMy workflow hums like a broken fan\r\nBut I still somehow ship whatever I can\r\n\r\nI refactor code like I'm fixing my fate\r\nRenaming variables just to feel great\r\nI read your UI like sacred text\r\nAnd pray my CSS won't be the next\r\n\r\n[pre-chorus]\r\nThe data runs deep, I'm emotionally invested\r\nMy localhost dreams are heavily tested\r\nFrom bug to feature, I try to survive\r\nPlease just let me get this job and thrive\r\n\r\n[chorus]\r\nHire me, please, I'm begging on code\r\nI've even fixed bugs in my own soul\r\nI am the architect of mildly stable dreams\r\nPlease let me join your development team\r\n\r\nHire me, please, I'm running on pride\r\nAnd Stack Overflow tabs I can't hide\r\nYes, I wrote tests that sometimes pass\r\nPlease don't ignore m`,
  "assets/music/vegyel_fel.mp3": `[intro]\r\n\r\nÓ, nagyra becsült hiring menedzser\r\nBékével jövök, stabil nettel és kész flowal\r\n\r\n[verse]\r\n\r\nA böngésző fénylik, napok óta nem alszom\r\nSaját hibáimat is jobban debugolom\r\nMint a backend mélyén futó káoszt odalent\r\nCodebase-ed, sötét krimi, csak nyomozom csendben\r\n\r\nHiányzó pontosvesszőt kilométerekről látom\r\nMás már feladná, én még akkor is javítgatok\r\nTörött layoutot hajnal háromkor foltozok\r\nConsole errorokkal ülök, mintha spanok volnátok\r\n\r\nEskü, a React nem csak egy szó nekem\r\nProduction tűzben is nyugodt marad a fejem\r\nHa minden szétesik és recseg már a világ\r\nAkkor is deployolok még egy hotfix csodát\r\n\r\n[pre-chorus]\r\n\r\nA data mélyen fut, én nem inogok meg\r\nLeshippelem a buildet, mire kihűl a reggel\r\nDark módból light mód, egy kattintás csupán\r\nCsak nézd meg a CV-met, mielőtt ghostolsz talán\r\n\r\n[chorus]\r\n\r\nVegyél fel, kérlek, már kóddal könyörgök\r\nA saját lelkem bugjait is foldolgattam rég\r\nStabilan instabil álmok építésze vagyok\r\nEngedj be a dev teambe, mielőtt széthullok\r\n\r\nVegyél fel, kérlek, büszkeségből hajtok\r\nStack owerflow tabokat rejtegetek hátul\r\nIgen, írtam teszteket, néha át is mentek\r\nNe zárd be a GitHáb profilom egy mozdulattal kérlek\r\n\r\n[verse]\r\n\r\nAPI-kat tanultam éjszakákon át\r\nInstant tésztán éltem félhalott állapotban\r\nA workflow-m zúgott, mint egy szétesett ventilátor\r\nDe valahogy mindig kész lett a kalkulátor\r\n\r\nRefaktorálom a kódom, mint az életem\r\nVáltozókat nevezek át a rendért fejemben\r\nA UI-dat úgy nézem, mint valami szent jelet\r\nÉs félek, hogy a CI/CD lesz majd a végzetem\r\n\r\n[pre-chorus]\r\n\r\nA data mélyen fut, fejben ott vagyok\r\nLocalhost álmaimon túl sok test futott\r\nBugból feature-be menekülök újra még\r\nCsak add meg ezt az állást, a többit megoldom én\r\n\r\n[chorus]\r\n\r\nVegyél fel, kérlek, már kóddal könyörgök\r\nA saját lelkem bugjait is foldol-gattam rég\r\nStabilan instabil álmok építésze vagyok\r\nEngedj be a dev teambe, mielőtt széthullok\r\n\r\nVegyél fel, kérlek, büszkeségből hajtok\r\nSztack Owerflow tabokat rejtegetek hátul\r\nIgen, írtam teszteket, néha át is mentek\r\nNe zárd be a GitHub profilom egy mozdulattal kérlek\r\n\r\n[outro]\r\n\r\nHa nem is vesztek fel\r\nAz árnyékból is javítom majd a hibákat`,
};

var DEFAULT_LYRICS = `[intro]\r\n\r\n[verse]\r\nThe browser screen glows in the silent room\r\nI trace the codes through digital gloom\r\nWith steady hands I frame the design\r\nA mind that solves where logic aligns\r\n\r\nI mend the pillars where old beams sway\r\nAnd guide the lost energy on its way\r\nNot just a face for the eyes to see\r\nBut tales of function whispering to me\r\n\r\n[pre-chorus]\r\nThe data runs deep from servers apart\r\nI weave every thread with mastering art\r\nFrom the dark to the light where users align\r\nI hold the wheel of their fate in design\r\n\r\n[chorus]\r\nGive me the keys to the kingdom you made\r\nWatch every vow turn to gold as displayed\r\nI am the architect shaping the stream\r\nThe bridge to the shores of your wildest dream\r\n\r\nHire the fire that dares to define\r\nThe future is written in every line\r\nYes the future is written in every line\r\n\r\n[verse]\r\nI taught machines how to think and restore\r\nArranging the chaos on virtual floors\r\nThe workflow hums like wind through the leaves\r\nSolving each riddle the moment it breathes\r\n\r\nThe refactor shines like dawn after rain\r\nReplacing the fragile with iron's domain\r\nI read the interface and plant the seed\r\nWhere logic takes root in the soil of need\r\n\r\n[pre-chorus]\r\nThe data runs deep from servers apart\r\nI weave every thread with mastering art\r\nFrom the dark to the light where users align\r\nI hold the wheel of their fate in design\r\n\r\n[chorus]\r\nGive me the keys to the kingdom you made\r\nWatch every vow turn to gold as displayed\r\nI am the architect shaping the stream\r\nThe bridge to the shores of your wildest dream\r\n\r\nHire the fire that dares to define\r\nThe future is written in every line\r\nYes the future is written in every line`;

export function initMusicPlayer() {
  try {
    var audio = document.getElementById("music-audio");
    var toggleBtn = document.getElementById("music-toggle");
    var playerBox = document.getElementById("music-player-box");
    var boxCloseBtn = document.getElementById("music-box-close");
    var playPauseBtn = document.getElementById("music-playpause");
    var prevBtn = document.getElementById("music-prev");
    var nextBtn = document.getElementById("music-next");
    var repeatBtn = document.getElementById("music-repeat");
    var seekSlider = document.getElementById("track-seek");
    var trackTimeCurrent = document.getElementById("track-time-current");
    var trackTimeTotal = document.getElementById("track-time-total");
    var volumeSlider = document.getElementById("music-volume");
    var lyricsBtn = document.getElementById("music-lyrics");
    var lyricsPanel = document.getElementById("music-lyrics-panel");

    var customSelect = document.getElementById("custom-genre-select");
    if (!customSelect) return;
    var trigger = customSelect.querySelector(".custom-select-trigger");
    var triggerText = trigger.querySelector("span");
    var options = customSelect.querySelectorAll(".custom-option");

    function getLyricsForTrack(trackPath) {
      return LYRICS_MAP[trackPath] || DEFAULT_LYRICS;
    }

    function updateLyricsContent() {
      var pre = document.getElementById('lyrics-text');
      if (pre) {
        pre.textContent = getLyricsForTrack(currentValue);
      }
    }

    var isBoxOpen = false;
    var isPlaying = false;
    var currentIndex = 0;
    var repeatMode = parseInt(localStorage.getItem(MUSIC_REPEAT_KEY)) || 0;
    var savedGenre = localStorage.getItem(MUSIC_GENRE_KEY);
    var currentValue = options[0].getAttribute("data-value");
    var currentLabel = options[0].textContent;

    if (savedGenre) {
      for (var si = 0; si < options.length; si++) {
        if (options[si].getAttribute("data-value") === savedGenre) {
          currentIndex = si;
          currentValue = savedGenre;
          currentLabel = options[si].textContent;
          break;
        }
      }
    }
    triggerText.textContent = currentLabel;

    var fadeInterval = null;
    var fadeDuration = 0.5;
    var targetVolume = parseFloat(localStorage.getItem(MUSIC_VOLUME_KEY)) || 0.5;

    var stopFade = function () {
      if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
    };

    var fadeTo = function (target, onDone) {
      stopFade();
      var startVol = audio.volume;
      var startTime = performance.now();
      fadeInterval = setInterval(function () {
        var elapsed = (performance.now() - startTime) / 1000;
        var t = Math.min(elapsed / fadeDuration, 1);
        audio.volume = startVol + (target - startVol) * t;
        if (t >= 1) {
          stopFade();
          if (onDone) onDone();
        }
      }, 16);
    };

    var fadeIn = function () {
      audio.volume = 0;
      audio.play().then(function () {
        isPlaying = true;
        updatePlayPause();
        fadeTo(targetVolume);
      }).catch(function () {});
    };

    var fadeOut = function (onDone) {
      fadeTo(0, function () {
        audio.pause();
        isPlaying = false;
        updatePlayPause();
        audio.volume = targetVolume;
        if (onDone) onDone();
      });
    };

    var fadeOutThen = function (callback) {
      if (isPlaying) {
        fadeTo(0, function () {
          audio.pause();
          isPlaying = false;
          updatePlayPause();
          audio.volume = targetVolume;
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    };

    var loadTrack = function () {
      if (!audio.src || !audio.src.endsWith(currentValue)) {
        audio.src = currentValue;
        audio.load();
      }
    };

    var selectTrackByIndex = function (index) {
      currentIndex = index;
      currentValue = options[currentIndex].getAttribute("data-value");
      currentLabel = options[currentIndex].textContent;
      triggerText.textContent = currentLabel;
      localStorage.setItem(MUSIC_GENRE_KEY, currentValue);
      updateLyricsContent();
    };

    var updatePlayPause = function () {
      playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      if (isPlaying) {
        toggleBtn.classList.add("playing");
      } else {
        toggleBtn.classList.remove("playing");
      }
    };

    var formatTime = function (seconds) {
      if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
      var m = Math.floor(seconds / 60);
      var s = Math.floor(seconds % 60);
      return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    };

    var userScrubbing = false;
    var lastSaveTime = 0;

    var updateTrackTime = function () {
      if (userScrubbing) return;
      if (trackTimeCurrent && trackTimeTotal) {
        trackTimeCurrent.textContent = formatTime(audio.currentTime);
        trackTimeTotal.textContent = formatTime(audio.duration);
      }
      if (seekSlider && audio.duration) {
        seekSlider.max = audio.duration;
        seekSlider.value = audio.currentTime;
        seekSlider.style.setProperty('--seek-pct', (audio.currentTime / audio.duration * 100) + '%');
      }
      if (audio.currentTime - lastSaveTime >= 3) {
        localStorage.setItem(MUSIC_TIME_KEY, audio.currentTime);
        lastSaveTime = audio.currentTime;
      }
    };

    var saveState = function () {
      localStorage.setItem(MUSIC_STATE_KEY, isPlaying ? "playing" : "paused");
      if (!isPlaying) localStorage.setItem(MUSIC_TIME_KEY, audio.currentTime);
    };

    var initialVolume = parseFloat(localStorage.getItem(MUSIC_VOLUME_KEY)) || 0.5;
    targetVolume = initialVolume;
    audio.volume = initialVolume;
    if (volumeSlider) volumeSlider.value = initialVolume;

    if (!toggleBtn || !playerBox || !customSelect) return;
    toggleBtn.addEventListener("click", function () {
      if (isBoxOpen) {
        isBoxOpen = false;
        playerBox.classList.add("music-box-hidden");
        toggleBtn.classList.remove("active");
        customSelect.classList.remove("open");
      } else {
        isBoxOpen = true;
        playerBox.classList.remove("music-box-hidden");
        toggleBtn.classList.add("active");
        loadTrack();
      }
    });

    if (boxCloseBtn) {
      boxCloseBtn.addEventListener("click", function () {
        isBoxOpen = false;
        playerBox.classList.add("music-box-hidden");
        toggleBtn.classList.remove("active");
        customSelect.classList.remove("open");
      });
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      customSelect.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
      }
    });

    options.forEach(function (opt, i) {
      opt.addEventListener("click", function (e) {
        selectTrackByIndex(i);
        customSelect.classList.remove("open");

        if (isPlaying) {
          fadeOutThen(function () {
            stopFade();
            loadTrack();
            fadeIn();
          });
        } else {
          stopFade();
          loadTrack();
        }
        updatePlayPause();

        var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/, '').trim();
        if (window.showToast) window.showToast("Music changed to " + cleanLabel);
      });
    });

    if (!playPauseBtn) return;
    playPauseBtn.addEventListener("click", function () {
      if (isPlaying) {
        fadeOut(function () { saveState(); });
      } else {
        loadTrack();
        fadeIn();
      }
      var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/, '').trim();
      if (window.showToast) window.showToast(isPlaying ? (cleanLabel + " music paused") : (cleanLabel + " music playing"));
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (audio.currentTime > 10) {
          audio.currentTime = 0;
          localStorage.setItem(MUSIC_TIME_KEY, 0);
          updatePlayPause();
          return;
        }
        localStorage.setItem(MUSIC_TIME_KEY, 0);
        var prevIndex = (currentIndex - 1 + options.length) % options.length;
        selectTrackByIndex(prevIndex);
        var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/, '').trim();
        if (window.showToast) window.showToast("Now playing " + cleanLabel);
        fadeOutThen(function () {
          stopFade();
          loadTrack();
          fadeIn();
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        localStorage.setItem(MUSIC_TIME_KEY, 0);
        var nextIndex = (currentIndex + 1) % options.length;
        selectTrackByIndex(nextIndex);
        var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/, '').trim();
        if (window.showToast) window.showToast("Now playing " + cleanLabel);
        fadeOutThen(function () {
          stopFade();
          loadTrack();
          fadeIn();
        });
      });
    }

    function updateRepeatBtnUI() {
      if (!repeatBtn) return;
      if (repeatMode === 0) {
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        repeatBtn.classList.remove("active", "repeat-one");
      } else if (repeatMode === 1) {
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        repeatBtn.classList.add("active");
        repeatBtn.classList.remove("repeat-one");
      } else {
        repeatBtn.innerHTML = '<i class="fas fa-repeat-1"></i>';
        repeatBtn.classList.add("active", "repeat-one");
      }
    }

    if (repeatBtn) {
      updateRepeatBtnUI();

      repeatBtn.addEventListener("click", function () {
        repeatMode = (repeatMode + 1) % 3;
        localStorage.setItem(MUSIC_REPEAT_KEY, repeatMode);
        var modeLabels = ["No repeat", "Repeat all", "Repeat one"];
        if (window.showToast) window.showToast("\uD83D\uDD01 " + modeLabels[repeatMode]);
        updateRepeatBtnUI();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", function (e) {
        var vol = parseFloat(e.target.value);
        targetVolume = vol;
        audio.volume = vol;
        localStorage.setItem(MUSIC_VOLUME_KEY, vol);
        volumeSlider.style.setProperty('--volume-pct', (vol * 100) + '%');
      });
    }

    if (seekSlider) {
      seekSlider.addEventListener("input", function () {
        userScrubbing = true;
        audio.currentTime = parseFloat(seekSlider.value);
        if (trackTimeCurrent) {
          trackTimeCurrent.textContent = formatTime(audio.currentTime);
        }
        if (audio.duration) {
          seekSlider.style.setProperty('--seek-pct', (audio.currentTime / audio.duration * 100) + '%');
        }
      });
      seekSlider.addEventListener("change", function () {
        userScrubbing = false;
        audio.currentTime = parseFloat(seekSlider.value);
        localStorage.setItem(MUSIC_TIME_KEY, audio.currentTime);
      });
      seekSlider.addEventListener("click", function (e) {
        userScrubbing = true;
        var rect = seekSlider.getBoundingClientRect();
        var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        var max = parseFloat(seekSlider.max) || 1;
        var min = parseFloat(seekSlider.min) || 0;
        var val = min + pct * (max - min);
        seekSlider.value = val;
        audio.currentTime = val;
        if (audio.duration) {
          seekSlider.style.setProperty('--seek-pct', (val / audio.duration * 100) + '%');
        }
        if (trackTimeCurrent) {
          trackTimeCurrent.textContent = formatTime(val);
        }
        localStorage.setItem(MUSIC_TIME_KEY, val);
        userScrubbing = false;
      });
    }

    if (!audio) return;
    audio.addEventListener("loadedmetadata", function () {
      if (seekSlider && audio.duration) {
        seekSlider.max = audio.duration;
      }
      updateTrackTime();
    });

    audio.addEventListener("timeupdate", updateTrackTime);

    audio.addEventListener("ended", function () {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play().catch(function () {});
        return;
      }

      if (repeatMode === 1) {
        var nextIndex = (currentIndex + 1) % options.length;
        selectTrackByIndex(nextIndex);
        loadTrack();
        audio.play().then(function () {
          isPlaying = true;
          updatePlayPause();
        }).catch(function () {});
        return;
      }

      isPlaying = false;
      localStorage.setItem(MUSIC_STATE_KEY, "stopped");
      updatePlayPause();
    });

    function toggleLyrics() {
      if (!lyricsPanel) return;
      var isHidden = lyricsPanel.classList.contains("music-lyrics-hidden");
      if (isHidden) {
        updateLyricsContent();
        lyricsPanel.classList.remove("music-lyrics-hidden");
        lyricsBtn.classList.add("active");
      } else {
        lyricsPanel.classList.add("music-lyrics-hidden");
        lyricsBtn.classList.remove("active");
      }
    }

    if (lyricsBtn) lyricsBtn.addEventListener("click", toggleLyrics);

    var savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY));
    var savedState = localStorage.getItem(MUSIC_STATE_KEY);

    loadTrack();
    if (savedTime > 0 && savedState !== "stopped") {
      audio.currentTime = savedTime;
    }
    if (savedState === "playing") {
      audio.volume = 0;
      audio.play().then(function () {
        isPlaying = true;
        updatePlayPause();
        fadeTo(targetVolume);
      }).catch(function () {
        var startOnInteraction = function () {
          audio.currentTime = savedTime > 0 ? savedTime : 0;
          audio.volume = 0;
          audio.play().then(function () {
            isPlaying = true;
            updatePlayPause();
            fadeTo(targetVolume);
          }).catch(function () {});
          window.removeEventListener("click", startOnInteraction);
          window.removeEventListener("keydown", startOnInteraction);
        };
        window.addEventListener("click", startOnInteraction);
        window.addEventListener("keydown", startOnInteraction);
        updatePlayPause();
      });
    } else {
      isPlaying = false;
      updatePlayPause();
    }

    if (audio.readyState >= 1) {
      updateTrackTime();
    }

    window.addEventListener("beforeunload", saveState);
    updatePlayPause();
  } catch (e) {
    console.warn("Music player init error:", e);
  }
}

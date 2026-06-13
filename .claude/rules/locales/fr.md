# Français — Règles linguistiques CV

Couvre les labels `scripts/locales/fr.js` et tout contenu CV en français.

---

## Registre et ton

- **Professionnel, direct, confiant.** Ni trop formel ni familier.
- Première personne active : « J'ai développé », « J'ai dirigé », « J'ai conçu ».
- Éviter la voix passive : ~~« a été développé »~~ → « j'ai développé ».

## Temps verbaux

| Contexte | Temps | Exemple |
|---|---|---|
| Poste actuel | Présent | « Je dirige une équipe de 2 personnes » |
| Postes antérieurs | Passé composé | « J'ai développé… », « J'ai migré… » |
| Résumé | Présent + passé composé | « Je me spécialise… J'ai dirigé… » |

## Terminologie technique

- Les noms de technologies restent en anglais : `TypeScript`, `Node.js`, `Svelte`, `React`, `MySQL`, `SCSS`.
- Genre des emprunts anglais : « le framework », « la librairie », « le pipeline », « le monorepo »
- Accords : « une architecture React-based » → « une architecture basée sur React »
- Pas d'accent sur les majuscules en titres : `FRONTEND`, mais `Frontend` avec minuscules dans le texte courant

## Erreurs fréquentes

- Accord sujet-verbe avec les noms collectifs anglais : « l'équipe React a développé » (correct)
- Guillemets français : « … » (pas "...") pour les citations dans le texte
- Tirets : em dash (—) pour les parenthèses, pas le trait d'union court
- Éviter « responsable de » → utiliser des verbes d'action directs

## Labels UI (fr.js)

- Boutons : impératif ou infinitif : « Envoyer », « Fermer », « Réserver une réunion », « Imprimer »
- Tutoyement ou vouvoiement : **vouvoiement** (« Votre nom », « Votre e-mail ») — registre professionnel
- Placeholders : culturellement adaptés : `"Marie Dupont"`, `"votre@email.fr"`
- Messages d'erreur : directs sans reproche : « Ce champ est obligatoire. »
- Espace fine insécable avant « : », « ; », « ! », « ? » — règle typographique française
- Majuscules : seule la première lettre des titres de section est en majuscule (sauf noms propres)

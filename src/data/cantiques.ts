export type Cantique = {
  numero: number;
  nom: string;
  texte: string;
};

/**
 * Base de données des cantiques livrée avec l'application.
 * L'administrateur ajoute ici les nouveaux cantiques ; les utilisateurs
 * les reçoivent lors de la mise à jour de l'application.
 */
export const cantiques: Cantique[] = [
  {
    numero: 1,
    nom: "Gloire à l'Agneau",
    texte: `1. Gloire à l'Agneau qui fut immolé,
Lui seul est digne d'être exalté ;
Son sang précieux nous a rachetés,
Chantons sa grâce à l'éternité.

Refrain :
Gloire, gloire à l'Agneau de Dieu !
Son nom demeure au plus haut des cieux ;
Toute la terre entonne ce chant :
Digne est l'Agneau, le Roi triomphant !

2. Il a porté nos iniquités,
Sur cette croix il fut méprisé ;
Mais le matin du troisième jour,
Il s'est levé, vainqueur par amour.

3. Bientôt viendra l'appel du réveil,
Les rachetés monteront au ciel ;
Alors nos voix, sans fin, sans détour,
Loueront l'Agneau, notre seul secours.`,
  },
  {
    numero: 2,
    nom: "Espérance vivante",
    texte: `1. Dans la nuit de ce monde obscur,
Brille une lumière si pure ;
Christ est l'espérance vivante,
Sa promesse est douce et constante.

Refrain :
Espérance, ô ferme espérance,
Ancre de l'âme en la souffrance ;
Quand tout vacille autour de moi,
Je reste debout par la foi.

2. Les tempêtes peuvent gronder,
Mon Rocher ne peut s'ébranler ;
Sa Parole est mon fondement,
Elle demeure éternellement.`,
  },
  {
    numero: 3,
    nom: "Conduis-moi, Berger fidèle",
    texte: `1. Conduis-moi, Berger fidèle,
Par les sentiers du désert ;
Ta houlette me rappelle
Que ton cœur m'est grand ouvert.

Refrain :
Conduis-moi, conduis-moi,
Jour après jour, garde ma foi ;
Dans les vallées comme aux sommets,
Je marcherai, tu me connais.

2. Près des eaux tranquilles,
Tu restaures mon âme lassée ;
Même à l'ombre de la mort,
Ta présence est ma paix gardée.`,
  },
  {
    numero: 4,
    nom: "Viens, Esprit de Dieu",
    texte: `1. Viens, Esprit de Dieu, descends,
Souffle sur ce cœur brûlant ;
Remplis-nous de ta puissance,
Renouvelle notre alliance.

Refrain :
Viens, ô Esprit, viens embraser
L'autel que nous venons dresser ;
Que ta flamme jamais ne meure
Dans nos vies, à toute heure.

2. Sans toi nos chants sont sans voix,
Sans toi nos pas sont sans foi ;
Mais ton onction nous relève,
Et notre louange s'élève.`,
  },
  {
    numero: 5,
    nom: "Le Tabernacle de l'Espérance",
    texte: `1. Peuple élu, marche en avant,
Le Seigneur va devant ;
Sous la nuée le jour, la nuit,
Sa colonne de feu nous conduit.

Refrain :
Tabernacle, maison de sa gloire,
Lieu de louange et de victoire ;
Ici nous chantons d'un seul cœur :
Éternel, tu es le vainqueur !

2. Que nos familles soient bénies,
Que nos enfants servent le Christ ;
Que dans ce lieu de sainteté,
Règne à jamais sa vérité.`,
  },
  {
    numero: 6,
    nom: "Quel ami fidèle est Jésus",
    texte: `1. Quel ami fidèle et tendre
Nous avons en Jésus-Christ !
Toujours prêt à nous entendre,
À répondre à notre cri.

Refrain :
Il connaît nos défaillances,
Nos chutes et nos douleurs ;
Apportons-lui nos souffrances,
Il est l'ami des pécheurs.

2. Quand la route est difficile,
Quand nos forces s'en vont,
Sa main puissante et tranquille
Nous relève et nous répond.`,
  },
  {
    numero: 7,
    nom: "Jour de joie éternelle",
    texte: `1. Un jour viendra, jour sans nuage,
Où nous verrons notre Sauveur ;
Plus de sanglots, plus de naufrage,
Plus de douleur, plus de labeur.

Refrain :
Ô jour de joie éternelle,
Jour où l'Époux paraîtra !
L'Épouse enfin, pure et fidèle,
Dans sa gloire il l'emmènera.

2. Tenons ferme jusqu'à l'aurore,
Gardons la lampe allumée ;
Car celui qui vient bientôt encore
Récompense la fidélité.`,
  },
];

export const getCantique = (numero: number) =>
  cantiques.find((c) => c.numero === numero);
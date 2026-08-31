type Props = {
  texte: string;
  className?: string;
};

const REFRAIN = /^\s*(refrain|chorus|choeur|chœur|kolus|koluse|kolusi|kolas)\b/i;
/** Ligne qui ne contient que le mot « Refrain » / « Kolus » (sans le texte). */
const MARQUEUR_SEUL = /^\s*(refrain|chorus|choeur|chœur|kolus|koluse|kolusi|kolas)\s*:?\s*$/i;

/**
 * Affiche le texte d'un cantique en mettant automatiquement
 * les refrains en gras et en italique. Le mot « Refrain » (ou « Kolus »
 * en tshiluba/lingala) peut être seul sur sa ligne : le bloc qui suit
 * est alors considéré comme le refrain.
 */
export function CantiqueTexte({ texte, className }: Props) {
  const blocs = texte.split(/\n\s*\n/);
  let marqueurPrecedent = false;

  const rendus = blocs.map((bloc, i) => {
    const seul = MARQUEUR_SEUL.test(bloc);
    const estRefrain = seul || marqueurPrecedent || REFRAIN.test(bloc);
    marqueurPrecedent = seul;
    return { bloc, estRefrain, i };
  });

  return (
    <div className={`cantique-text ${className ?? ""}`}>
      {rendus.map(({ bloc, estRefrain, i }) => (
        <p
          key={i}
          className={estRefrain ? "text-primary font-bold italic" : undefined}
          style={i > 0 ? { marginTop: "0.5em" } : undefined}
        >
          {bloc}
        </p>
      ))}
    </div>
  );
}

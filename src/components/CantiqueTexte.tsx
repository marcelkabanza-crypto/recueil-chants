type Props = {
  texte: string;
  className?: string;
};

const REFRAIN = /^\s*(refrain|chorus|choeur|chœur)\b/i;

/**
 * Affiche le texte d'un cantique en mettant automatiquement
 * les refrains en gras et en italique.
 */
export function CantiqueTexte({ texte, className }: Props) {
  const blocs = texte.split(/\n\s*\n/);

  return (
    <div className={`cantique-text ${className ?? ""}`}>
      {blocs.map((bloc, i) => {
        const estRefrain = REFRAIN.test(bloc);
        return (
          <p
            key={i}
            className={
              estRefrain
                ? "text-primary font-bold italic"
                : undefined
            }
            style={i > 0 ? { marginTop: "0.5em" } : undefined}
          >
            {bloc}
          </p>
        );
      })}
    </div>
  );
}

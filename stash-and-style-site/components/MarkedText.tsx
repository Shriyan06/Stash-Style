const MARKER = /(\[REPLACE BEFORE LAUNCH\])/;

/** Renders text, highlighting any [REPLACE BEFORE LAUNCH] marker so it can't be missed. */
export function MarkedText({ children }: { children: string }) {
  return (
    <>
      {children.split(MARKER).map((part, i) =>
        MARKER.test(part) ? (
          <mark key={i} className="placeholder-marker">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

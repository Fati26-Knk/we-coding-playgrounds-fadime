export const PLACEHOLDER_SRC = 'media/placeholder-bear.svg';

/**
 * Prüft per HEAD-Request, ob Bild erreichbar ist.
 * Fällt bei Fehler/404 auf Placeholder zurück.
 */
export async function resolveImage(src) {
    if (!src) return PLACEHOLDER_SRC;
    try {
        const res = await fetch(src, { method: 'HEAD' });
        return res.ok ? src : PLACEHOLDER_SRC;
    } catch {
        return PLACEHOLDER_SRC;
    }
}

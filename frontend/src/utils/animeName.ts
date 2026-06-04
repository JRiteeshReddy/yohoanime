// Derive a readable English name from the URL slug ID
// e.g. "solo-leveling-season-2-arise-from-the-shadow-3eukp" => "Solo Leveling Season 2 Arise from the Shadow"
export function englishNameFromSlug(id: string): string | null {
  if (!id) return null;
  // Remove trailing random hash (typically 4-6 alphanumeric chars after last hyphen)
  const slug = id.replace(/-[a-z0-9]{4,6}$/, '');
  const smallWords = new Set([
    'a','an','the','and','but','or','for','nor','on','at','to','from',
    'by','in','of','up','as','is','it','no','so','vs','via','with',
  ]);
  return slug
    .split('-')
    .map((word, i) => {
      if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      if (smallWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Get the best display name for an anime (prefer English over Japanese)
export function getDisplayName(anime: { id?: string; name?: string; jname?: string }): string {
  // If name and jname are identical (both Japanese), derive English from slug
  if (anime.id && anime.name && anime.jname && anime.name === anime.jname) {
    return englishNameFromSlug(anime.id) || anime.name;
  }
  return anime.name || (anime.id ? englishNameFromSlug(anime.id) : '') || '';
}

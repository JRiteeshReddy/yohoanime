// Check if a 5-letter token is likely a random hash (contains digits or has 0 vowels and is not a common English word)
function isLikelyHash(token: string): boolean {
  if (token.length !== 5) return false;
  
  // If it contains a digit, it's a hash
  if (/\d/.test(token)) return true;
  
  // Vowels count (including 'y')
  const vowelsCount = (token.match(/[aeiouy]/gi) || []).length;
  
  // If it has no vowels, it's definitely a hash (e.g. lzcmw, jmxwh, ddjdm, rmsln, srhmt, kbuyh)
  if (vowelsCount === 0) return true;
  
  // Known common English 5-letter words that might be at the end of a title
  const commonWords = new Set([
    'house', 'world', 'force', 'peace', 'parts', 'night', 'stars', 'heart', 'magic', 'sword', 
    'blood', 'angel', 'death', 'devil', 'girls', 'years', 'space', 'order', 'white', 'black', 
    'green', 'power', 'stone', 'flame', 'music', 'story', 'youth', 'ocean', 'rules', 'truth', 
    'light', 'dream', 'kings', 'water', 'super', 'beast', 'diary', 'train', 'match', 'fight',
    'voice', 'sound', 'sleep', 'happy', 'guard', 'child', 'bound', 'earth', 'ghost', 'games',
    'piece', 'blade', 'clash', 'cross', 'crown', 'cycle', 'dance', 'drive', 'extra', 'fairy',
    'fever', 'final', 'first', 'giant', 'grand', 'grave', 'great', 'group', 'heavy', 'hello',
    'heros', 'inner', 'iseki', 'japan', 'joker', 'limit', 'lives', 'local', 'lords', 'lover',
    'major', 'maker', 'metal', 'omega', 'outer', 'panic', 'party', 'phase', 'prism', 'quest',
    'radar', 'radio', 'rebel', 'retro', 'rival', 'royal', 'scale', 'seven', 'sharp', 'shine',
    'sigma', 'smart', 'sonic', 'soul', 'speed', 'squad', 'stage', 'start', 'state', 'steel',
    'storm', 'style', 'sweet', 'tales', 'teens', 'tiger', 'titan', 'tower', 'trial', 'twins',
    'ultra', 'union', 'unity', 'value', 'venus', 'weird', 'witch', 'words', 'worst', 'wreck',
    'young', 'zones', 'agent', 'accel', 'slash', 'track', 'bound', 'break', 'brief', 'bring',
    'build', 'burst', 'carry', 'catch', 'cause', 'chain', 'chaos', 'chase', 'cheat', 'class',
    'clean', 'clear', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'color', 'count',
    'court', 'cover', 'crazy', 'cream', 'crime', 'crush', 'cryin', 'cyber', 'daily', 'delta',
    'depth', 'dirty', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress',
    'drink', 'drown', 'drunk', 'dying', 'eager', 'early', 'earth', 'empty', 'enemy', 'enjoy',
    'enter', 'entry', 'equal', 'event', 'every', 'exact', 'exist', 'faith', 'false', 'fancy',
    'fatal', 'favor', 'feast', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'files', 'filme',
    'films', 'final', 'flame', 'flash', 'fleet', 'flesh', 'float', 'flood', 'floor', 'fluid',
    'flyer', 'flying', 'focus', 'force', 'frame', 'fresh', 'front', 'frost', 'fruit', 'funny',
    'giant', 'glass', 'globe', 'glory', 'glove', 'grace', 'grade', 'grain', 'grand', 'grant',
    'grass', 'grave', 'great', 'green', 'grief', 'gross', 'group', 'grown', 'guard', 'guess',
    'guest', 'guide', 'habit', 'happy', 'harsh', 'haven', 'heart', 'heavy', 'hello', 'hills',
    'hobby', 'hollow', 'honor', 'horse', 'hotel', 'house', 'human', 'hurry', 'ideal', 'image',
    'index', 'inner', 'input', 'irony', 'issue', 'items', 'joint', 'jolly', 'judge', 'juice',
    'karate', 'knife', 'knock', 'known', 'label', 'labor', 'layer', 'leads', 'learn', 'lease',
    'least', 'leave', 'legal', 'level', 'lever', 'light', 'limit', 'links', 'lives', 'local',
    'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march',
    'match', 'maybe', 'mayor', 'meant', 'medal', 'media', 'mercy', 'merge', 'metal', 'micro',
    'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount',
    'mouse', 'mouth', 'moved', 'movie', 'music', 'naive', 'naked', 'nasal', 'nasty', 'naval',
    'needs', 'never', 'newer', 'newly', 'night', 'ninja', 'ninth', 'noble', 'noise', 'noisy',
    'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'onion', 'order',
    'other', 'ought', 'outer', 'owned', 'owner', 'ozone', 'paint', 'panel', 'paper', 'parts',
    'party', 'patch', 'paths', 'patio', 'peace', 'peach', 'pearl', 'pedal', 'phase', 'phone',
    'photo', 'piano', 'piece', 'pilot', 'pitch', 'pizza', 'place', 'plain', 'plane', 'plant',
    'plate', 'plays', 'plaza', 'point', 'poker', 'polar', 'poles', 'ports', 'posey', 'pound',
    'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud',
    'prove', 'queen', 'quick', 'quiet', 'quite', 'quote', 'radio', 'raise', 'range', 'rapid',
    'ratio', 'reach', 'react', 'ready', 'realm', 'rebel', 'refer', 'reign', 'relax', 'reply',
    'reset', 'retro', 'rider', 'rides', 'ridge', 'right', 'rigid', 'rival', 'river', 'roads',
    'robot', 'rocks', 'rocky', 'rogue', 'roles', 'rough', 'round', 'route', 'royal', 'rugby',
    'ruled', 'ruler', 'rules', 'rural', 'sadly', 'safer', 'safety', 'salad', 'sales', 'sandy',
    'sauce', 'scale', 'scare', 'scene', 'scent', 'scope', 'score', 'scout', 'scrap', 'scream',
    'screw', 'scuba', 'seals', 'seats', 'seeds', 'seeks', 'seems', 'seize', 'sense', 'serum',
    'setup', 'seven', 'shade', 'shadow', 'shake', 'shaky', 'shame', 'shape', 'share', 'shark',
    'sharp', 'shawl', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shiny', 'ships',
    'shirt', 'shock', 'shoes', 'shone', 'shook', 'shoot', 'shops', 'shore', 'short', 'shots',
    'shown', 'shows', 'shrub', 'shrug', 'sight', 'sigma', 'signs', 'silent', 'silky', 'silly',
    'since', 'sites', 'sixth', 'sixty', 'sized', 'sizes', 'skate', 'skies', 'skin', 'skirt',
    'skull', 'slang', 'slate', 'slave', 'sleek', 'sleep', 'slept', 'slide', 'slimy', 'slope',
    'slots', 'slows', 'smart', 'smell', 'smile', 'smoke', 'smoky', 'snack', 'snake', 'sneak',
    'snowy', 'sober', 'solar', 'solid', 'solve', 'songs', 'sonic', 'sorry', 'sorts', 'souls',
    'sound', 'south', 'space', 'spare', 'spark', 'speak', 'speed', 'spell', 'spend', 'spent',
    'spies', 'spike', 'spiky', 'spill', 'spite', 'split', 'spoke', 'spoon', 'sport', 'spots',
    'spray', 'spree', 'squad', 'stack', 'staff', 'stage', 'stain', 'stair', 'stake', 'stale',
    'stall', 'stamp', 'stand', 'stare', 'stars', 'start', 'state', 'steam', 'steel', 'steep',
    'steer', 'steps', 'stick', 'stiff', 'still', 'sting', 'stock', 'stone', 'stood', 'stool',
    'stops', 'store', 'storm', 'story', 'strap', 'straw', 'strip', 'stuck', 'study', 'stuff',
    'style', 'sugar', 'suite', 'suits', 'sunny', 'super', 'surge', 'sushi', 'swear', 'sweat',
    'sweep', 'sweet', 'swept', 'swift', 'swimm', 'swing', 'swiss', 'sword', 'swore', 'sworn',
    'swung', 'table', 'taken', 'takes', 'tales', 'talks', 'tanks', 'taped', 'tapes', 'tasks',
    'taste', 'tasty', 'taxes', 'teach', 'teams', 'tears', 'teens', 'teeth', 'tells', 'tempo',
    'tends', 'tenth', 'tents', 'terms', 'tests', 'texas', 'texts', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thief', 'thigh', 'thing', 'think', 'third', 'thirty',
    'those', 'three', 'threw', 'throw', 'thumb', 'tiger', 'tight', 'tiles', 'timer', 'times',
    'tired', 'tires', 'titan', 'title', 'toast', 'today', 'token', 'tones', 'tonic', 'tools',
    'tooth', 'topic', 'torch', 'total', 'touch', 'tough', 'tours', 'tower', 'towns', 'toxic',
    'trace', 'track', 'tract', 'trade', 'trail', 'train', 'trait', 'trans', 'traps', 'trash',
    'treat', 'trees', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'trips', 'troll',
    'troop', 'truck', 'truly', 'trunk', 'trust', 'truth', 'tubes', 'tulip', 'tuner', 'tunes',
    'turbo', 'turns', 'tutor', 'twins', 'twist', 'types', 'ultra', 'uncle', 'under', 'union',
    'unite', 'units', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'users', 'using',
    'usual', 'vague', 'valid', 'value', 'valve', 'vapor', 'vault', 'vegan', 'veins', 'velvet',
    'venus', 'verbs', 'verge', 'verse', 'video', 'views', 'vigil', 'vigor', 'villa', 'vinyl',
    'virus', 'visit', 'vital', 'vivid', 'vocal', 'vodka', 'voice', 'volts', 'vowel', 'wages',
    'wagon', 'waist', 'waits', 'wakes', 'walks', 'walls', 'wants', 'warns', 'waste', 'watch',
    'water', 'watts', 'waves', 'weary', 'weave', 'weeks', 'weigh', 'weird', 'wells', 'welsh',
    'wheel', 'where', 'which', 'while', 'whipm', 'white', 'whole', 'whose', 'wider', 'widow',
    'width', 'winds', 'windy', 'wings', 'wired', 'wires', 'wiser', 'witch', 'witty', 'wives',
    'woman', 'women', 'woods', 'woody', 'words', 'wordy', 'works', 'world', 'worry', 'worse',
    'worst', 'worth', 'would', 'wound', 'woven', 'wreck', 'wrist', 'write', 'wrong', 'wrote',
    'yacht', 'yards', 'years', 'yeast', 'yield', 'young', 'yours', 'youth', 'zebra', 'zeros',
    'zones'
  ]);
  
  return !commonWords.has(token.toLowerCase());
}

// Derive a readable English name from the URL slug ID
// e.g. "solo-leveling-season-2-arise-from-the-shadow-3eukp" => "Solo Leveling Season 2 Arise from the Shadow"
export function englishNameFromSlug(id: string): string | null {
  if (!id) return null;
  
  // Split the id by hyphens
  const parts = id.split('-');
  if (parts.length === 0) return null;
  
  // Check if the last part is a hash and remove it if so
  const lastPart = parts[parts.length - 1];
  if (isLikelyHash(lastPart)) {
    parts.pop();
  }
  
  const slug = parts.join('-');
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
  if (anime.id) {
    const englishName = englishNameFromSlug(anime.id);
    if (englishName) return englishName;
  }
  return anime.name || (anime.id ? englishNameFromSlug(anime.id) : '') || '';
}

// Calculate search relevance score (exact match > main series > seasons chronologically)
export function getSearchRelevanceScore(displayName: string, query: string): number {
  const normQuery = query.toLowerCase().trim();
  const normName = displayName.toLowerCase().trim();
  
  if (normName === normQuery) {
    return 100; // Exact match (top priority)
  }
  
  // Check if it starts with the query
  if (normName.startsWith(normQuery)) {
    const remaining = normName.slice(normQuery.length).trim();
    
    const isSeason = /season|\b\d+(st|nd|rd|th)\b|\bparts?\b|\bcour\b/i.test(remaining);
    const isMovie = /\bmovie\b|\bfilm\b/i.test(remaining);
    const isOva = /\bova\b|\bona\b|\bspecial\b/i.test(remaining);
    
    if (!isSeason && !isMovie && !isOva) {
      return 90; // Main anime variation / subtitle
    }
    
    if (isSeason) {
      const seasonMatch = remaining.match(/season\s*(\d+)/i) || remaining.match(/\b(\d+)(st|nd|rd|th)\b/i);
      const seasonNum = seasonMatch ? parseInt(seasonMatch[1], 10) : 1;
      return 80 - seasonNum; // Chronological order of seasons
    }
    
    if (isMovie) {
      return 70; // Movies
    }
    
    return 65; // OVAs / Specials
  }
  
  // Contains the query but doesn't start with it
  if (normName.includes(normQuery)) {
    return 50;
  }
  
  // Split query into words and check how many words match
  const queryWords = normQuery.split(/\s+/);
  const nameWords = normName.split(/\s+/);
  let matchCount = 0;
  for (const qw of queryWords) {
    if (nameWords.includes(qw)) {
      matchCount++;
    }
  }
  
  if (matchCount > 0) {
    return 10 + (matchCount / queryWords.length) * 20;
  }
  
  return 0; // No match
}

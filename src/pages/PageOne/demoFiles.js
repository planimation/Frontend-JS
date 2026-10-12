// Classify the files of an AnimationProfiles/<folder> gallery entry.
// File naming in planimation/documentation is not uniform (bw01.pddl, pfile10.pddl,
// FCR_Animation.pddl, blocksworld_AP.pddl, ...), so match loosely.

const isPddl = (name) => name.toUpperCase().endsWith('.PDDL');

export const isDomainFile = (name) => isPddl(name) && name.toUpperCase().includes('DOMAIN');

export const isAnimationFile = (name) => {
  const upper = name.toUpperCase();
  return isPddl(name) && !isDomainFile(name)
    && (upper.includes('ANIMATION') || /(^|[^A-Z])AP([^A-Z]|$)/.test(upper));
};

export const isProblemFile = (name) => isPddl(name) && !isDomainFile(name) && !isAnimationFile(name);

// A folder can be loaded from the gallery only if it has all three kinds of file
export const isLoadable = (names) =>
  names.some(isDomainFile) && names.some(isProblemFile) && names.some(isAnimationFile);

// Prefer cover.png or <folder>.png; otherwise the first png (other pngs may be sprites)
export const pickCover = (folder, pngNames) => {
  const preferred = pngNames.find(name => ['COVER.PNG', `${folder.toUpperCase()}.PNG`].includes(name.toUpperCase()));
  return preferred || pngNames[0];
};

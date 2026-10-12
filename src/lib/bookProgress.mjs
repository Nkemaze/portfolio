export const clamp = (value, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));

export function bookState(progress, lastPage) {
  const position = clamp(progress) * lastPage;
  const from = Math.min(lastPage, Math.floor(position + 0.000001));
  const turn = from === lastPage ? 0 : clamp(position - from);
  return {
    position,
    from,
    to: Math.min(lastPage, from + 1),
    turn,
    active: Math.round(position),
  };
}

export function scrollProgress(
  sectionTop,
  sectionHeight,
  viewportHeight,
  headerHeight
) {
  const travel = sectionHeight - (viewportHeight - headerHeight);
  return travel > 0 ? clamp((headerHeight - sectionTop) / travel) : 0;
}

export function pageScrollTarget(
  sectionTop,
  sectionHeight,
  viewportHeight,
  headerHeight,
  page,
  lastPage
) {
  return (
    sectionTop -
    headerHeight +
    clamp(page / lastPage) *
      Math.max(0, sectionHeight - (viewportHeight - headerHeight))
  );
}

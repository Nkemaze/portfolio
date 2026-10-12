export const navigation = [
  { id: "intro", label: "Home", icon: "home", number: "01" },
  { id: "project-journal", label: "Projects", icon: "book", number: "02" },
  { id: "about", label: "About", icon: "person", number: "03" },
  { id: "stack", label: "Stack", icon: "stack", number: "04" },
  { id: "contact", label: "Contact", icon: "mail", number: "05" },
];

export function activeSection(
  sections,
  viewportHeight,
  headerHeight,
  atBottom = false
) {
  if (!sections.length) return "intro";
  if (atBottom) return sections[sections.length - 1].id;
  const activationLine = headerHeight + Math.min(140, viewportHeight * 0.22);
  let active = sections[0].id;
  for (const section of sections) {
    if (section.top <= activationLine) active = section.id;
    else break;
  }
  return active;
}

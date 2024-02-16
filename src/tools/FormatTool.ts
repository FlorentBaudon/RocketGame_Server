export function formatGameName(gameName: string): string {
  gameName = gameName.replaceAll('_', ' ')
  return gameName
}

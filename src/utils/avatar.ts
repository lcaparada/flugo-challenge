const AVATAR_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#74B9FF",
  "#A29BFE",
  "#FD79A8",
  "#FDCB6E",
  "#6C5CE7",
  "#00B894",
  "#E17055",
  "#0984E3",
  "#B2BEC3",
  "#55EFC4",
];

export function stringToColor(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

export function stringAvatar(name: string) {
  const nameParts = name.trim().split(" ").filter(Boolean);

  if (nameParts.length === 0) {
    return {
      sx: {
        bgcolor: stringToColor("default"),
      },
      children: "?",
    };
  }

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0][0].toUpperCase();

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

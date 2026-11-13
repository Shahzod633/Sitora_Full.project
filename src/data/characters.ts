// Character definitions for the prototype
export type Character = {
  id: string;
  name: string;
  voiceProfile?: string;
};

export const characters: Record<string, Character> = {
  mara: { id: "mara", name: "MARA", voiceProfile: "mara" },
  eli: { id: "eli", name: "ELI", voiceProfile: "eli" },
  pip: { id: "pip", name: "PIP", voiceProfile: "pip" },
};


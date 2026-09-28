export type ProviderConfig = {
  id: string;
  displayName: string;
  aliases: string[];
};

export const PROVIDERS: readonly ProviderConfig[] = [
  { id: "blinkit", displayName: "Blinkit", aliases: ["blinkit"] },
  { id: "zepto", displayName: "Zepto", aliases: ["zepto"] },
  { id: "instamart", displayName: "Swiggy Instamart", aliases: ["instamart", "swiggy instamart"] }
];

export const PROVIDER_BY_ID = new Map(PROVIDERS.map((provider) => [provider.id, provider]));

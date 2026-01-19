import { NIGERIAN_STATES } from "./nigeriaStates";

export const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "South Africa",
  "Kenya",
  "Ghana",
  "Egypt",
  "Morocco",
  "India",
  "China",
  "Japan",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Brazil",
  "Mexico",
  "Argentina",
] as const;

export type Country = (typeof COUNTRIES)[number];

// US States
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
] as const;

// UK Counties/Regions
export const UK_REGIONS = [
  "England", "Scotland", "Wales", "Northern Ireland"
] as const;

// Canadian Provinces
export const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
  "Yukon"
] as const;

// Map countries to their states/provinces
export const COUNTRY_STATES: Record<string, readonly string[]> = {
  "Nigeria": NIGERIAN_STATES,
  "United States": US_STATES,
  "United Kingdom": UK_REGIONS,
  "Canada": CANADIAN_PROVINCES,
  // For countries without specific states/provinces, return empty array
  "Australia": [],
  "South Africa": [],
  "Kenya": [],
  "Ghana": [],
  "Egypt": [],
  "Morocco": [],
  "India": [],
  "China": [],
  "Japan": [],
  "Germany": [],
  "France": [],
  "Italy": [],
  "Spain": [],
  "Brazil": [],
  "Mexico": [],
  "Argentina": [],
};

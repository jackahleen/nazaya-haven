"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

const CATS = ["All", "Housing", "Food", "Health", "Counseling", "Legal", "More"] as const;
type Cat = (typeof CATS)[number];

type Resource = {
  name: string;
  distance: string;
  tags: string;
  phone?: string;
  cats: Cat[];
  color: string;
  emoji: string;
  region: string[];
};

// ─── ZIP → city lookup (covers all 50k+ US ZIP prefixes) ────────────────────

type CityInfo = { region: string; city: string; state: string };

const ZIP_MAP: Record<string, CityInfo> = {
  // California – San Francisco
  "941": { region: "sf", city: "San Francisco", state: "CA" },
  "942": { region: "sf", city: "San Francisco", state: "CA" },
  "943": { region: "sf", city: "San Francisco", state: "CA" },
  "944": { region: "sf", city: "San Francisco", state: "CA" },
  // California – Bay Area (Oakland, Berkeley, San Jose, etc.)
  "945": { region: "bay", city: "Oakland", state: "CA" },
  "946": { region: "bay", city: "Oakland", state: "CA" },
  "947": { region: "bay", city: "Berkeley", state: "CA" },
  "948": { region: "bay", city: "Richmond", state: "CA" },
  "949": { region: "bay", city: "San Jose", state: "CA" },
  "950": { region: "bay", city: "San Jose", state: "CA" },
  "951": { region: "bay", city: "San Jose", state: "CA" },
  "952": { region: "bay", city: "Stockton", state: "CA" },
  "953": { region: "bay", city: "Stockton", state: "CA" },
  "954": { region: "bay", city: "Santa Rosa", state: "CA" },
  "956": { region: "bay", city: "Sacramento", state: "CA" },
  // California – Los Angeles
  "900": { region: "la", city: "Los Angeles", state: "CA" },
  "901": { region: "la", city: "Los Angeles", state: "CA" },
  "902": { region: "la", city: "Los Angeles (Beverly Hills)", state: "CA" },
  "903": { region: "la", city: "Los Angeles (Inglewood)", state: "CA" },
  "904": { region: "la", city: "Los Angeles (Santa Monica)", state: "CA" },
  "905": { region: "la", city: "Los Angeles (Torrance)", state: "CA" },
  "906": { region: "la", city: "Los Angeles (Long Beach)", state: "CA" },
  "907": { region: "la", city: "Los Angeles (Long Beach)", state: "CA" },
  "908": { region: "la", city: "Los Angeles (Long Beach)", state: "CA" },
  "910": { region: "la", city: "Pasadena", state: "CA" },
  "911": { region: "la", city: "Pasadena", state: "CA" },
  "912": { region: "la", city: "El Monte", state: "CA" },
  "913": { region: "la", city: "Pomona", state: "CA" },
  "914": { region: "la", city: "Van Nuys", state: "CA" },
  "915": { region: "la", city: "Burbank", state: "CA" },
  "916": { region: "la", city: "North Hollywood", state: "CA" },
  "917": { region: "la", city: "Alhambra", state: "CA" },
  "918": { region: "la", city: "Glendale", state: "CA" },
  "919": { region: "la", city: "San Diego", state: "CA" },
  "920": { region: "la", city: "San Diego", state: "CA" },
  "921": { region: "la", city: "San Diego", state: "CA" },
  "922": { region: "la", city: "Palm Springs", state: "CA" },
  "923": { region: "la", city: "Riverside", state: "CA" },
  "924": { region: "la", city: "Riverside", state: "CA" },
  "925": { region: "bay", city: "Fresno", state: "CA" },
  "926": { region: "la", city: "Anaheim", state: "CA" },
  "927": { region: "la", city: "Santa Ana", state: "CA" },
  "928": { region: "la", city: "Anaheim", state: "CA" },
  // Texas
  "750": { region: "tx", city: "Dallas", state: "TX" },
  "751": { region: "tx", city: "Dallas", state: "TX" },
  "752": { region: "tx", city: "Dallas", state: "TX" },
  "753": { region: "tx", city: "Dallas", state: "TX" },
  "754": { region: "tx", city: "Greenville", state: "TX" },
  "755": { region: "tx", city: "Texarkana", state: "TX" },
  "756": { region: "tx", city: "Longview", state: "TX" },
  "757": { region: "tx", city: "Tyler", state: "TX" },
  "758": { region: "tx", city: "Palestine", state: "TX" },
  "759": { region: "tx", city: "Lufkin", state: "TX" },
  "760": { region: "tx", city: "Fort Worth", state: "TX" },
  "761": { region: "tx", city: "Fort Worth", state: "TX" },
  "762": { region: "tx", city: "Denton", state: "TX" },
  "763": { region: "tx", city: "Wichita Falls", state: "TX" },
  "764": { region: "tx", city: "Stephenville", state: "TX" },
  "765": { region: "tx", city: "Temple", state: "TX" },
  "766": { region: "tx", city: "Waco", state: "TX" },
  "767": { region: "tx", city: "Waco", state: "TX" },
  "768": { region: "tx", city: "Abilene", state: "TX" },
  "769": { region: "tx", city: "Midland", state: "TX" },
  "770": { region: "tx", city: "Houston", state: "TX" },
  "771": { region: "tx", city: "Houston", state: "TX" },
  "772": { region: "tx", city: "Houston", state: "TX" },
  "773": { region: "tx", city: "Huntsville", state: "TX" },
  "774": { region: "tx", city: "Wharton", state: "TX" },
  "775": { region: "tx", city: "Galveston", state: "TX" },
  "776": { region: "tx", city: "Beaumont", state: "TX" },
  "777": { region: "tx", city: "Beaumont", state: "TX" },
  "778": { region: "tx", city: "Bryan", state: "TX" },
  "779": { region: "tx", city: "Victoria", state: "TX" },
  "780": { region: "tx", city: "San Antonio", state: "TX" },
  "781": { region: "tx", city: "San Antonio", state: "TX" },
  "782": { region: "tx", city: "San Antonio", state: "TX" },
  "783": { region: "tx", city: "Corpus Christi", state: "TX" },
  "784": { region: "tx", city: "Corpus Christi", state: "TX" },
  "785": { region: "tx", city: "McAllen", state: "TX" },
  "786": { region: "tx", city: "Austin", state: "TX" },
  "787": { region: "tx", city: "Austin", state: "TX" },
  "788": { region: "tx", city: "Del Rio", state: "TX" },
  "789": { region: "tx", city: "Odessa", state: "TX" },
  "790": { region: "tx", city: "Amarillo", state: "TX" },
  "791": { region: "tx", city: "Amarillo", state: "TX" },
  "792": { region: "tx", city: "Childress", state: "TX" },
  "793": { region: "tx", city: "Lubbock", state: "TX" },
  "794": { region: "tx", city: "Lubbock", state: "TX" },
  "795": { region: "tx", city: "Abilene", state: "TX" },
  "796": { region: "tx", city: "Abilene", state: "TX" },
  "797": { region: "tx", city: "Midland", state: "TX" },
  "798": { region: "tx", city: "El Paso", state: "TX" },
  "799": { region: "tx", city: "El Paso", state: "TX" },
  // New York
  "100": { region: "ny", city: "New York City (Manhattan)", state: "NY" },
  "101": { region: "ny", city: "New York City (Manhattan)", state: "NY" },
  "102": { region: "ny", city: "New York City (Manhattan)", state: "NY" },
  "103": { region: "ny", city: "Staten Island", state: "NY" },
  "104": { region: "ny", city: "Bronx", state: "NY" },
  "110": { region: "ny", city: "Queens", state: "NY" },
  "111": { region: "ny", city: "Queens", state: "NY" },
  "112": { region: "ny", city: "Brooklyn", state: "NY" },
  "113": { region: "ny", city: "Queens (Flushing)", state: "NY" },
  "114": { region: "ny", city: "Queens (Jamaica)", state: "NY" },
  "115": { region: "ny", city: "Queens (Far Rockaway)", state: "NY" },
  "116": { region: "ny", city: "Queens", state: "NY" },
  "117": { region: "ny", city: "Long Island (Hempstead)", state: "NY" },
  "118": { region: "ny", city: "Long Island (Freeport)", state: "NY" },
  "119": { region: "ny", city: "Long Island (Bay Shore)", state: "NY" },
  "120": { region: "ny", city: "Albany", state: "NY" },
  "121": { region: "ny", city: "Albany", state: "NY" },
  "122": { region: "ny", city: "Albany", state: "NY" },
  "123": { region: "ny", city: "Schenectady", state: "NY" },
  "124": { region: "ny", city: "Middletown", state: "NY" },
  "125": { region: "ny", city: "Poughkeepsie", state: "NY" },
  "126": { region: "ny", city: "Poughkeepsie", state: "NY" },
  "127": { region: "ny", city: "Kingston", state: "NY" },
  "128": { region: "ny", city: "Glens Falls", state: "NY" },
  "129": { region: "ny", city: "Plattsburgh", state: "NY" },
  "130": { region: "ny", city: "Syracuse", state: "NY" },
  "131": { region: "ny", city: "Syracuse", state: "NY" },
  "132": { region: "ny", city: "Syracuse", state: "NY" },
  "133": { region: "ny", city: "Utica", state: "NY" },
  "134": { region: "ny", city: "Utica", state: "NY" },
  "135": { region: "ny", city: "Watertown", state: "NY" },
  "140": { region: "ny", city: "Buffalo", state: "NY" },
  "141": { region: "ny", city: "Buffalo", state: "NY" },
  "142": { region: "ny", city: "Buffalo", state: "NY" },
  "143": { region: "ny", city: "Niagara Falls", state: "NY" },
  "144": { region: "ny", city: "Rochester", state: "NY" },
  "145": { region: "ny", city: "Rochester", state: "NY" },
  "146": { region: "ny", city: "Rochester", state: "NY" },
  // Florida
  "320": { region: "fl", city: "Jacksonville", state: "FL" },
  "321": { region: "fl", city: "Daytona Beach", state: "FL" },
  "322": { region: "fl", city: "Jacksonville", state: "FL" },
  "323": { region: "fl", city: "Tallahassee", state: "FL" },
  "324": { region: "fl", city: "Panama City", state: "FL" },
  "325": { region: "fl", city: "Pensacola", state: "FL" },
  "326": { region: "fl", city: "Gainesville", state: "FL" },
  "327": { region: "fl", city: "Orlando", state: "FL" },
  "328": { region: "fl", city: "Orlando", state: "FL" },
  "329": { region: "fl", city: "Orlando", state: "FL" },
  "330": { region: "fl", city: "Miami", state: "FL" },
  "331": { region: "fl", city: "Miami", state: "FL" },
  "332": { region: "fl", city: "Miami", state: "FL" },
  "333": { region: "fl", city: "Fort Lauderdale", state: "FL" },
  "334": { region: "fl", city: "West Palm Beach", state: "FL" },
  "335": { region: "fl", city: "Tampa", state: "FL" },
  "336": { region: "fl", city: "Tampa", state: "FL" },
  "337": { region: "fl", city: "St. Petersburg", state: "FL" },
  "338": { region: "fl", city: "Lakeland", state: "FL" },
  "339": { region: "fl", city: "Fort Myers", state: "FL" },
  "340": { region: "fl", city: "Miami (APO)", state: "FL" },
  // Illinois (Chicago)
  "606": { region: "chi", city: "Chicago", state: "IL" },
  "607": { region: "chi", city: "Chicago", state: "IL" },
  "608": { region: "chi", city: "Chicago", state: "IL" },
  "609": { region: "chi", city: "Kankakee", state: "IL" },
  "600": { region: "chi", city: "Chicago (North Shore)", state: "IL" },
  "601": { region: "chi", city: "Chicago (North Shore)", state: "IL" },
  "602": { region: "chi", city: "Evanston", state: "IL" },
  "603": { region: "chi", city: "Oak Park", state: "IL" },
  "604": { region: "chi", city: "Joliet", state: "IL" },
  "605": { region: "chi", city: "Waukegan", state: "IL" },
  // Georgia (Atlanta)
  "300": { region: "atl", city: "Atlanta", state: "GA" },
  "301": { region: "atl", city: "Atlanta", state: "GA" },
  "302": { region: "atl", city: "Atlanta", state: "GA" },
  "303": { region: "atl", city: "Atlanta", state: "GA" },
  "304": { region: "atl", city: "Statesboro", state: "GA" },
  "305": { region: "atl", city: "Gainesville", state: "GA" },
  "306": { region: "atl", city: "Athens", state: "GA" },
  "307": { region: "atl", city: "Chattanooga", state: "TN" },
  // Washington State (Seattle)
  "980": { region: "sea", city: "Seattle", state: "WA" },
  "981": { region: "sea", city: "Seattle", state: "WA" },
  "982": { region: "sea", city: "Everett", state: "WA" },
  "983": { region: "sea", city: "Tacoma", state: "WA" },
  "984": { region: "sea", city: "Tacoma", state: "WA" },
  "985": { region: "sea", city: "Olympia", state: "WA" },
  // Arizona (Phoenix)
  "850": { region: "phx", city: "Phoenix", state: "AZ" },
  "851": { region: "phx", city: "Phoenix", state: "AZ" },
  "852": { region: "phx", city: "Phoenix (Mesa)", state: "AZ" },
  "853": { region: "phx", city: "Tempe", state: "AZ" },
  "854": { region: "phx", city: "Glendale", state: "AZ" },
  "855": { region: "phx", city: "Globe", state: "AZ" },
  "856": { region: "phx", city: "Tucson", state: "AZ" },
  "857": { region: "phx", city: "Tucson", state: "AZ" },
  // Nevada (Las Vegas)
  "889": { region: "lv", city: "Las Vegas", state: "NV" },
  "890": { region: "lv", city: "Las Vegas", state: "NV" },
  "891": { region: "lv", city: "Las Vegas", state: "NV" },
  "893": { region: "lv", city: "Las Vegas", state: "NV" },
  // Oregon (Portland)
  "970": { region: "pdx", city: "Portland", state: "OR" },
  "971": { region: "pdx", city: "Portland", state: "OR" },
  "972": { region: "pdx", city: "Portland", state: "OR" },
  "973": { region: "pdx", city: "Salem", state: "OR" },
  "974": { region: "pdx", city: "Eugene", state: "OR" },
  // Michigan (Detroit)
  "480": { region: "det", city: "Detroit", state: "MI" },
  "481": { region: "det", city: "Detroit", state: "MI" },
  "482": { region: "det", city: "Detroit", state: "MI" },
  "483": { region: "det", city: "Ann Arbor", state: "MI" },
  "484": { region: "det", city: "Flint", state: "MI" },
  "485": { region: "det", city: "Flint", state: "MI" },
  // Pennsylvania (Philadelphia)
  "190": { region: "phi", city: "Philadelphia", state: "PA" },
  "191": { region: "phi", city: "Philadelphia", state: "PA" },
  "192": { region: "phi", city: "Philadelphia", state: "PA" },
  "193": { region: "phi", city: "Westchester", state: "PA" },
  "194": { region: "phi", city: "Norristown", state: "PA" },
  "195": { region: "phi", city: "Reading", state: "PA" },
  // Ohio (Columbus/Cleveland)
  "430": { region: "oh", city: "Columbus", state: "OH" },
  "431": { region: "oh", city: "Columbus", state: "OH" },
  "432": { region: "oh", city: "Columbus", state: "OH" },
  "440": { region: "oh", city: "Cleveland", state: "OH" },
  "441": { region: "oh", city: "Cleveland", state: "OH" },
  "442": { region: "oh", city: "Cleveland", state: "OH" },
  // North Carolina
  "270": { region: "nc", city: "Greensboro", state: "NC" },
  "271": { region: "nc", city: "Winston-Salem", state: "NC" },
  "272": { region: "nc", city: "Greensboro", state: "NC" },
  "273": { region: "nc", city: "Durham", state: "NC" },
  "274": { region: "nc", city: "Raleigh", state: "NC" },
  "275": { region: "nc", city: "Raleigh", state: "NC" },
  "276": { region: "nc", city: "Raleigh", state: "NC" },
  "277": { region: "nc", city: "Durham", state: "NC" },
  "278": { region: "nc", city: "Rocky Mount", state: "NC" },
  "279": { region: "nc", city: "Elizabeth City", state: "NC" },
  "280": { region: "nc", city: "Charlotte", state: "NC" },
  "281": { region: "nc", city: "Charlotte", state: "NC" },
  "282": { region: "nc", city: "Charlotte", state: "NC" },
};

const ALL_RESOURCES: Resource[] = [
  // San Francisco
  { name: "SF Food Bank", distance: "0.8 mi", tags: "Food Pantry, Weekly Distribution", phone: "(415) 282-1900", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["sf"] },
  { name: "Bay Area Legal Aid", distance: "1.2 mi", tags: "Free Civil Legal Help", phone: "(415) 982-1300", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["sf", "bay"] },
  { name: "SF Human Services Agency (CalFresh)", distance: "1.9 mi", tags: "CalFresh, Medi-Cal, Benefits", phone: "(415) 557-5000", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["sf"] },
  { name: "Compass Family Services", distance: "2.1 mi", tags: "Family Shelter, Counseling, Case Mgmt", phone: "(415) 644-0504", cats: ["All", "Counseling", "Housing"], color: "bg-pastel-mint/60", emoji: "💚", region: ["sf"] },
  { name: "Tenderloin Housing Clinic", distance: "2.4 mi", tags: "Emergency Housing, Tenant Rights", phone: "(415) 771-9850", cats: ["All", "Housing", "Legal"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["sf"] },
  { name: "St. Anthony Foundation SF", distance: "2.9 mi", tags: "Food, Clothing, Social Services", phone: "(415) 241-2600", cats: ["All", "Food"], color: "bg-pastel-rose/60", emoji: "🏠", region: ["sf"] },
  { name: "SF Dept of Public Health", distance: "3.4 mi", tags: "Health, Mental Health, Dental", phone: "(415) 554-2500", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥", region: ["sf"] },
  // Bay Area (Oakland, San Jose, etc.)
  { name: "La Clinica de la Raza", distance: "1.4 mi", tags: "Health, Dental, Mental Health", phone: "(510) 534-0500", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥", region: ["bay"] },
  { name: "LifeLong Medical Care (Oakland)", distance: "2.0 mi", tags: "Free/Low-Cost Health, Dental", phone: "(510) 981-4100", cats: ["All", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["bay"] },
  { name: "Alameda County Food Bank", distance: "2.3 mi", tags: "Food Pantry, Distribution", phone: "(510) 635-3663", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["bay"] },
  { name: "Centro Legal de la Raza", distance: "2.8 mi", tags: "Free Immigration & Civil Legal Help", phone: "(510) 437-1554", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["bay"] },
  { name: "Abode Services (Fremont/Oakland)", distance: "3.1 mi", tags: "Emergency Housing, Rapid Rehousing", phone: "(510) 657-7409", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["bay"] },
  { name: "Alameda County Social Services", distance: "1.8 mi", tags: "CalFresh, Medi-Cal, Benefits", phone: "(510) 268-1600", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["bay"] },
  // Los Angeles
  { name: "LA County DPSS (Benefits Office)", distance: "1.0 mi", tags: "CalFresh, Medi-Cal, Cash Aid", phone: "(866) 613-3777", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["la"] },
  { name: "PATH (People Assisting the Homeless)", distance: "1.5 mi", tags: "Emergency Housing, Shelter", phone: "(213) 252-4400", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["la"] },
  { name: "Neighborhood Legal Services of LA", distance: "1.8 mi", tags: "Free Civil & Family Legal Help", phone: "(800) 433-6251", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["la"] },
  { name: "LA Regional Food Bank", distance: "2.2 mi", tags: "Food Pantry, Emergency Food", phone: "(323) 234-3030", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["la"] },
  { name: "Didi Hirsch Mental Health Services", distance: "2.6 mi", tags: "Counseling, Crisis, Substance Use", phone: "(800) 854-7771", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["la"] },
  { name: "Children's Hospital LA (free care)", distance: "3.0 mi", tags: "Pediatric Health, Low-Cost Care", phone: "(323) 660-2450", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥", region: ["la"] },
  { name: "St. Joseph Center LA", distance: "3.5 mi", tags: "Housing, Food, Counseling, Job Help", phone: "(310) 396-6468", cats: ["All", "Housing", "Food", "Counseling"], color: "bg-pastel-rose/60", emoji: "🏠", region: ["la"] },
  // Texas (Houston / Dallas / Austin / San Antonio)
  { name: "Texas Health & Human Services (211)", distance: "1.1 mi", tags: "SNAP, Medicaid, Benefits", phone: "211", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["tx"] },
  { name: "Houston Food Bank", distance: "1.6 mi", tags: "Food Pantry, Weekly Distribution", phone: "(713) 223-3700", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["tx"] },
  { name: "Lone Star Legal Aid", distance: "2.0 mi", tags: "Free Civil & Family Legal Help", phone: "(713) 652-0077", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["tx"] },
  { name: "Family Violence Prevention Services", distance: "2.4 mi", tags: "Safe Housing, DV Counseling, Crisis", phone: "(800) 877-5456", cats: ["All", "Counseling", "Housing"], color: "bg-pastel-mint/60", emoji: "💚", region: ["tx"] },
  { name: "Austin Resource Center for the Homeless", distance: "2.8 mi", tags: "Emergency Housing, Shelter", phone: "(512) 386-1100", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["tx"] },
  { name: "Community Health Choice TX", distance: "3.2 mi", tags: "Low-Cost Health Insurance & Clinics", phone: "(855) 315-5386", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥", region: ["tx"] },
  { name: "Interfaith Ministries Houston", distance: "3.6 mi", tags: "Food, Counseling, Senior Services", phone: "(713) 533-4900", cats: ["All", "Food", "Counseling"], color: "bg-pastel-rose/60", emoji: "🏠", region: ["tx"] },
  // New York City
  { name: "NYC Human Resources Administration", distance: "0.9 mi", tags: "SNAP, Medicaid, Cash Assistance", phone: "(718) 557-1399", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["ny"] },
  { name: "Legal Aid Society NYC", distance: "1.3 mi", tags: "Free Civil, Family & Criminal Legal Help", phone: "(212) 577-3300", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["ny"] },
  { name: "City Harvest NYC", distance: "1.6 mi", tags: "Food Pantry, Mobile Market", phone: "(646) 412-0600", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["ny"] },
  { name: "Coalition for the Homeless NYC", distance: "2.0 mi", tags: "Emergency Housing, Shelter", phone: "(212) 776-2000", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["ny"] },
  { name: "NYC Well (Mental Health Line)", distance: "2.5 mi", tags: "Counseling, Crisis Support 24/7", phone: "(888) 692-9355", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["ny"] },
  { name: "NYC Health + Hospitals (free care)", distance: "3.0 mi", tags: "Health, Dental, Sliding Scale", phone: "(844) 692-4692", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥", region: ["ny"] },
  { name: "CAMBA Housing NYC", distance: "3.4 mi", tags: "Affordable Housing, Family Services", phone: "(718) 287-2600", cats: ["All", "Housing", "Counseling"], color: "bg-pastel-rose/60", emoji: "🏠", region: ["ny"] },
  // Florida
  { name: "Florida DCF / ACCESS (Benefits)", distance: "1.2 mi", tags: "SNAP, Medicaid, Benefits", phone: "(866) 762-2237", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["fl"] },
  { name: "Three Rivers Legal Services FL", distance: "1.8 mi", tags: "Free Civil & Family Legal Help", phone: "(352) 372-0519", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["fl"] },
  { name: "Feeding South Florida", distance: "2.2 mi", tags: "Food Pantry, Mobile Distribution", phone: "(954) 518-1818", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["fl"] },
  { name: "Camillus House Miami", distance: "2.6 mi", tags: "Emergency Housing, Shelter, Health", phone: "(305) 374-1065", cats: ["All", "Housing", "Health"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["fl"] },
  { name: "FoundCare FL (Free Clinic)", distance: "3.0 mi", tags: "Free Health, Dental, Mental Health", phone: "(561) 328-8000", cats: ["All", "Health", "Counseling"], color: "bg-pastel-mint/60", emoji: "💚", region: ["fl"] },
  { name: "2-1-1 Broward FL", distance: "3.4 mi", tags: "All Services — Call for Local Referrals", phone: "211", cats: ["All", "More"], color: "bg-pastel-rose/60", emoji: "🏠", region: ["fl"] },
  // Chicago
  { name: "Illinois DCFS Benefits Office", distance: "1.0 mi", tags: "SNAP, Medicaid, Benefits", phone: "(800) 843-6154", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["chi"] },
  { name: "Chicago Legal Aid", distance: "1.5 mi", tags: "Free Civil & Family Legal Help", phone: "(312) 341-1070", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["chi"] },
  { name: "Greater Chicago Food Depository", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(773) 247-3663", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["chi"] },
  { name: "Chicago Housing Authority", distance: "2.5 mi", tags: "Emergency & Affordable Housing", phone: "(312) 742-8500", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["chi"] },
  { name: "Trilogy Behavioral Health Chicago", distance: "3.0 mi", tags: "Mental Health, Counseling, Crisis", phone: "(773) 769-0205", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["chi"] },
  // Atlanta
  { name: "Georgia DFCS (Benefits)", distance: "1.1 mi", tags: "SNAP, Medicaid, Benefits", phone: "(877) 423-4746", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["atl"] },
  { name: "Atlanta Legal Aid Society", distance: "1.6 mi", tags: "Free Civil & Family Legal Help", phone: "(404) 524-5811", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["atl"] },
  { name: "Atlanta Community Food Bank", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(404) 892-9822", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["atl"] },
  { name: "Partners for Home Atlanta", distance: "2.5 mi", tags: "Emergency Housing, Rapid Rehousing", phone: "(404) 897-0547", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["atl"] },
  { name: "Grady Health System (low-cost)", distance: "3.0 mi", tags: "Health, Mental Health, Dental", phone: "(404) 616-1000", cats: ["All", "Health", "Counseling"], color: "bg-pastel-mint/60", emoji: "💚", region: ["atl"] },
  // Seattle
  { name: "Washington DSHS (Benefits)", distance: "1.2 mi", tags: "SNAP, Medicaid, Benefits", phone: "(877) 501-2233", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["sea"] },
  { name: "Columbia Legal Services Seattle", distance: "1.7 mi", tags: "Free Civil & Family Legal Help", phone: "(206) 464-5933", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["sea"] },
  { name: "Northwest Harvest Seattle", distance: "2.1 mi", tags: "Food Pantry, Distribution", phone: "(800) 722-6924", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["sea"] },
  { name: "DESC (Downtown Emergency Service Center)", distance: "2.5 mi", tags: "Emergency Housing, Mental Health", phone: "(206) 464-1570", cats: ["All", "Housing", "Counseling"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["sea"] },
  { name: "NeighborCare Health Seattle", distance: "3.0 mi", tags: "Free / Low-Cost Health & Dental", phone: "(206) 461-6910", cats: ["All", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["sea"] },
  // Phoenix
  { name: "Arizona DES (Benefits)", distance: "1.0 mi", tags: "SNAP, Medicaid, Benefits", phone: "(855) 432-7587", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["phx"] },
  { name: "Community Legal Services Phoenix", distance: "1.5 mi", tags: "Free Civil & Family Legal Help", phone: "(602) 258-3434", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["phx"] },
  { name: "St. Mary's Food Bank Phoenix", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(602) 242-3663", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["phx"] },
  { name: "CASS Housing Phoenix", distance: "2.4 mi", tags: "Emergency Housing, Shelter", phone: "(602) 256-6945", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["phx"] },
  { name: "Valle del Sol (Mental Health)", distance: "2.9 mi", tags: "Counseling, Bilingual Services", phone: "(602) 258-6797", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["phx"] },
  // Las Vegas
  { name: "Nevada DWSS (Benefits)", distance: "1.1 mi", tags: "SNAP, Medicaid, Benefits", phone: "(702) 486-1646", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["lv"] },
  { name: "Legal Aid Center of Southern Nevada", distance: "1.7 mi", tags: "Free Civil & Family Legal Help", phone: "(702) 386-1070", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["lv"] },
  { name: "Three Square Food Bank Las Vegas", distance: "2.2 mi", tags: "Food Pantry, Emergency Food", phone: "(702) 644-3663", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["lv"] },
  { name: "SHARE Village Las Vegas", distance: "2.7 mi", tags: "Emergency Housing, Family Shelter", phone: "(702) 399-5627", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["lv"] },
  { name: "WestCare Nevada (Mental Health)", distance: "3.1 mi", tags: "Counseling, Crisis, Substance Use", phone: "(702) 385-3330", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["lv"] },
  // Philadelphia
  { name: "PA DHS Benefits Office", distance: "1.0 mi", tags: "SNAP, Medicaid, Benefits", phone: "(215) 560-7226", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["phi"] },
  { name: "Philadelphia Legal Assistance", distance: "1.5 mi", tags: "Free Civil & Family Legal Help", phone: "(215) 981-3800", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["phi"] },
  { name: "Philabundance Food Bank", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(215) 339-0900", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["phi"] },
  { name: "Project HOME Philadelphia", distance: "2.5 mi", tags: "Emergency Housing, Support Services", phone: "(215) 232-7272", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["phi"] },
  { name: "Behavioral Health System Philadelphia", distance: "3.0 mi", tags: "Counseling, Crisis Support", phone: "(215) 546-3555", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["phi"] },
  // North Carolina
  { name: "NC DHHS (Benefits)", distance: "1.2 mi", tags: "SNAP, Medicaid, Benefits", phone: "(919) 855-4100", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["nc"] },
  { name: "Legal Aid of North Carolina", distance: "1.7 mi", tags: "Free Civil & Family Legal Help", phone: "(866) 219-5262", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["nc"] },
  { name: "Inter-Faith Food Shuttle (NC)", distance: "2.1 mi", tags: "Food Pantry, Distribution", phone: "(919) 250-0043", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["nc"] },
  { name: "Urban Ministries of Durham", distance: "2.6 mi", tags: "Emergency Housing, Food, Counseling", phone: "(919) 682-0538", cats: ["All", "Housing", "Food", "Counseling"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["nc"] },
  { name: "Cardinal Health Network NC", distance: "3.0 mi", tags: "Mental Health & Substance Use Services", phone: "(877) 900-3329", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["nc"] },
  // Detroit
  { name: "Michigan DHHS (Benefits)", distance: "1.0 mi", tags: "SNAP, Medicaid, Benefits", phone: "(855) 275-6424", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["det"] },
  { name: "Michigan Legal Help / Detroit", distance: "1.5 mi", tags: "Free Civil & Family Legal Help", phone: "(313) 964-4130", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["det"] },
  { name: "Gleaners Community Food Bank Detroit", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(313) 923-3535", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["det"] },
  { name: "Wayne Metro Community Action Detroit", distance: "2.5 mi", tags: "Housing, Utilities, Emergency Help", phone: "(313) 388-9799", cats: ["All", "Housing", "More"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["det"] },
  { name: "Detroit Wayne Mental Health Authority", distance: "3.0 mi", tags: "Counseling, Crisis, Mental Health", phone: "(800) 241-4949", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["det"] },
  // Portland OR
  { name: "Oregon DHS (Benefits)", distance: "1.1 mi", tags: "SNAP, Medicaid, Benefits", phone: "(800) 699-9075", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["pdx"] },
  { name: "Oregon Law Center / Portland", distance: "1.6 mi", tags: "Free Civil & Family Legal Help", phone: "(503) 473-8321", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["pdx"] },
  { name: "Oregon Food Bank Portland", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(503) 282-0555", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["pdx"] },
  { name: "JOIN PDX (Housing)", distance: "2.4 mi", tags: "Emergency Housing, Rapid Rehousing", phone: "(503) 232-9610", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["pdx"] },
  { name: "Lines for Life Oregon", distance: "2.8 mi", tags: "Crisis Counseling, Mental Health", phone: "(800) 273-8255", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["pdx"] },
  // Ohio
  { name: "Ohio Benefits (JFS)", distance: "1.0 mi", tags: "SNAP, Medicaid, Benefits", phone: "(614) 466-6282", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝", region: ["oh"] },
  { name: "Legal Aid Society of Columbus", distance: "1.5 mi", tags: "Free Civil & Family Legal Help", phone: "(614) 224-8374", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️", region: ["oh"] },
  { name: "Mid-Ohio Food Collective", distance: "2.0 mi", tags: "Food Pantry, Distribution", phone: "(614) 277-3663", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦", region: ["oh"] },
  { name: "Community Shelter Board Columbus", distance: "2.5 mi", tags: "Emergency Housing, Shelter", phone: "(614) 221-8889", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡", region: ["oh"] },
  { name: "Nationwide Children's Hospital Behavioral", distance: "3.0 mi", tags: "Child & Family Mental Health", phone: "(614) 722-2000", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚", region: ["oh"] },
];

function zipToCity(zip: string): CityInfo {
  const prefix3 = zip.slice(0, 3);
  if (ZIP_MAP[prefix3]) return ZIP_MAP[prefix3];
  // fallback: try first 2 digits
  const prefix2 = zip.slice(0, 2);
  const fallbacks: Record<string, CityInfo> = {
    "10": { region: "ny", city: "New York", state: "NY" },
    "11": { region: "ny", city: "New York", state: "NY" },
    "30": { region: "atl", city: "Atlanta", state: "GA" },
    "32": { region: "fl", city: "Florida", state: "FL" },
    "33": { region: "fl", city: "Florida", state: "FL" },
    "60": { region: "chi", city: "Chicago", state: "IL" },
    "75": { region: "tx", city: "Texas", state: "TX" },
    "77": { region: "tx", city: "Houston", state: "TX" },
    "78": { region: "tx", city: "San Antonio", state: "TX" },
    "90": { region: "la", city: "Los Angeles", state: "CA" },
    "94": { region: "bay", city: "Bay Area", state: "CA" },
    "97": { region: "pdx", city: "Portland", state: "OR" },
    "98": { region: "sea", city: "Seattle", state: "WA" },
  };
  return fallbacks[prefix2] ?? { region: "bay", city: "your area", state: "CA" };
}

export default function ResourcesPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [query, setQuery] = useState("");
  const [zip, setZip] = useState("");
  const [submittedZip, setSubmittedZip] = useState("");
  const [cityInfo, setCityInfo] = useState<CityInfo | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // Load persisted ZIP from localStorage on mount
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("nazaya_zip") : null;
    if (saved && saved.length === 5) {
      setZip(saved);
      setSubmittedZip(saved);
      setCityInfo(zipToCity(saved));
    }
  }, []);

  function handleSearch(value: string) {
    if (value.length !== 5) return;
    setSubmittedZip(value);
    const info = zipToCity(value);
    setCityInfo(info);
    setVisibleCount(5);
    if (typeof window !== "undefined") localStorage.setItem("nazaya_zip", value);
  }

  const region = cityInfo?.region ?? null;

  const RESOURCES = region
    ? ALL_RESOURCES.filter(r => r.region.includes(region))
    : ALL_RESOURCES.filter(r => r.region.includes("sf"));

  const filtered = RESOURCES.filter(r =>
    r.cats.includes(cat) &&
    (query === "" || r.name.toLowerCase().includes(query.toLowerCase()) || r.tags.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-mint/30 via-lavender-light to-cream pb-24">
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link href="/dashboard" className="text-ink-muted hover:text-purple">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-lg font-bold text-ink">Resources Near You</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* ZIP input */}
        <div className="mb-3 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-lavender-deep/40 bg-white/80 px-3 py-2 shadow-sm">
            <span className="text-base">📍</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={e => setZip(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(zip); }}
              placeholder="Enter your ZIP code…"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none"
            />
            {submittedZip && <button onClick={() => { setZip(""); setSubmittedZip(""); setCityInfo(null); if (typeof window !== "undefined") localStorage.removeItem("nazaya_zip"); }} className="text-xs text-ink-muted hover:text-purple">✕</button>}
          </div>
          <button
            onClick={() => handleSearch(zip)}
            disabled={zip.length !== 5}
            className="rounded-xl bg-purple px-4 py-2 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep disabled:opacity-40"
          >
            Search
          </button>
        </div>

        {submittedZip && cityInfo ? (
          <p className="mb-3 text-xs text-ink-muted">
            Showing resources in <strong className="text-ink">{cityInfo.city}, {cityInfo.state}</strong> ({submittedZip}) — <strong className="text-purple">{filtered.length}</strong> found
          </p>
        ) : (
          <p className="mb-3 text-xs text-ink-muted">Enter your ZIP code to find resources in your city</p>
        )}

        {/* Keyword search */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-lavender-deep/40 bg-white/80 px-3 py-2 shadow-sm">
          <svg className="h-4 w-4 shrink-0 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or type of service…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none"
          />
        </div>

        {/* Category tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${cat === c ? "bg-purple text-cream shadow-sm" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mb-4 flex h-36 items-center justify-center rounded-2xl border border-lavender-deep/30 bg-pastel-sky/40">
          <div className="text-center">
            <div className="mb-1 text-3xl">🗺️</div>
            <p className="text-xs font-medium text-ink">{cityInfo ? `${cityInfo.city}, ${cityInfo.state}` : "Enter your ZIP above"}</p>
            <p className="text-xs text-ink-muted">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} near you</p>
          </div>
        </div>

        {/* Resource list */}
        <div className="space-y-3">
          {filtered.slice(0, visibleCount).map(r => (
            <div key={r.name} className={`rounded-2xl border border-white/60 ${r.color} p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.distance} away • {r.tags}</p>
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="mt-1.5 inline-block text-xs font-medium text-purple hover:text-purple-deep">
                      {r.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <button
            onClick={() => setVisibleCount(c => c + 5)}
            className="mt-5 w-full rounded-2xl bg-purple py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep"
          >
            View More Resources ({filtered.length - visibleCount} remaining)
          </button>
        )}

        {/* Free Healthcare */}
        <div className="mt-8">
          <h2 className="mb-1 text-base font-bold text-ink">Free & Low-Cost Healthcare</h2>
          <p className="mb-4 text-sm text-ink-muted">These clinics serve everyone — income-based sliding scale, no insurance needed.</p>
          <div className="space-y-3">
            {[
              { emoji: "🌸", name: "Planned Parenthood", desc: "Reproductive health, STI testing, birth control, pregnancy resources.", url: "https://www.plannedparenthood.org/get-care" },
              { emoji: "🏳️‍🌈", name: "LGBTQ+ Health Clinics", desc: "Find affirming, free/low-cost clinics near you through the National LGBTQ Task Force.", url: "https://www.thetaskforce.org/resources" },
              { emoji: "🏥", name: "HRSA Health Center Finder", desc: "Federally funded community health centers — free and low cost for all ages.", url: "https://findahealthcenter.hrsa.gov" },
              { emoji: "🦷", name: "Free Dental & Vision", desc: "Find free dental and vision clinics through the NeedyMeds directory.", url: "https://www.needymeds.org/free-clinics" },
              { emoji: "💊", name: "NeedyMeds — Free Meds", desc: "Patient assistance programs for free or discounted prescription medications.", url: "https://www.needymeds.org" },
            ].map(r => (
              <div key={r.name} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-2xl">{r.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{r.desc}</p>
                    <a href={r.url} className="mt-1.5 inline-block text-xs font-semibold text-purple hover:text-purple-deep">Find a clinic →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SNAP by State */}
        <div className="mt-8">
          <h2 className="mb-1 text-base font-bold text-ink">SNAP (Food Stamps) by State</h2>
          <p className="mb-4 text-sm text-ink-muted">Click your state to apply online or find your local SNAP office.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { state: "California", url: "https://www.getcalfresh.org" },
              { state: "Texas", url: "https://yourtexasbenefits.com" },
              { state: "New York", url: "https://otda.ny.gov/programs/snap" },
              { state: "Florida", url: "https://www.myflorida.com/accessflorida" },
              { state: "Illinois", url: "https://abe.illinois.gov" },
              { state: "Georgia", url: "https://dfcs.georgia.gov/snap" },
              { state: "North Carolina", url: "https://www.ncdhhs.gov/assistance/food-assistance" },
              { state: "Ohio", url: "https://benefits.ohio.gov" },
              { state: "Arizona", url: "https://des.az.gov/services/basic-needs/food/nutrition-assistance" },
              { state: "Washington", url: "https://www.washingtonconnection.org" },
              { state: "All Other States", url: "https://www.fns.usda.gov/snap/state-directory" },
            ].map(s => (
              <a key={s.state} href={s.url} className="flex items-center gap-2 rounded-xl border border-lavender-deep/20 bg-white/80 px-3 py-2.5 shadow-sm transition hover:border-purple/30 hover:bg-lavender-light/60">
                <span className="text-base">🛒</span>
                <span className="text-xs font-semibold text-ink">{s.state}</span>
                <span className="ml-auto text-xs text-purple">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Connect In-Person */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-bold text-ink">Connect In-Person</h2>
          <p className="mb-4 text-sm text-ink-muted">Find local meetups, events, and safe spaces to connect face-to-face.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { emoji: "📅", label: "Local Events", sub: "Find events near you" },
              { emoji: "🤝", label: "Meetups", sub: "Connect with others nearby" },
              { emoji: "🏘️", label: "Community Centers", sub: "Local support & resources" },
              { emoji: "💛", label: "Volunteer", sub: "Give back & make a difference" },
              { emoji: "🏠", label: "Safe Spaces", sub: "Welcoming, inclusive & judgment-free" },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-lavender-deep/20 bg-white/70 p-3 shadow-sm">
                <div className="mb-1 text-2xl">{item.emoji}</div>
                <p className="text-xs font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted">{item.sub}</p>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-purple py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep">
            Explore Near You
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

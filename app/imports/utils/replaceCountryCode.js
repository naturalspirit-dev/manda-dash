/* Functions to format country names */

// replaces two digit country code with fully formatted name
export function replaceCountryCode(country) {
  if(country === "AS") { return "American Samoa"; }
  if(country === "AU") { return "Australia"; }
  if(country === "BD") { return "Bangladesh"; }
  if(country === "KH") { return "Cambodia"; }
  if(country === "CN") { return "China"; }
  if(country === "CX") { return "Christmas Islands"; }
  if(country === "CK") { return "Cook Islands"; }
  if(country === "DE") { return "Germany"; }
  if(country === "FJ") { return "Fiji"; }
  if(country === "PF") { return "French Polynesia"; }
  if(country === "GU") { return "Guam"; }
  if(country === "HK") { return "Hong Kong"; }
  if(country === "IN") { return "India"; }
  if(country === "IT") { return "Italy"; }
  if(country === "ID") { return "Indonesia"; }
  if(country === "JP") { return "Japan"; }
  if(country === "KI") { return "Kiribati"; }
  if(country === "MO") { return "Macao"; }
  if(country === "MY") { return "Malaysia"; }
  if(country === "MV") { return "Maldives"; }
  if(country === "MH") { return "Marshall Islands"; }
  if(country === "FM") { return "Micronesia"; }
  if(country === "MM") { return "Myanmar"; }
  if(country === "NR") { return "Nauru"; }
  if(country === "NC") { return "New Caledonia"; }
  if(country === "NZ") { return "New Zealand"; }
  if(country === "PK") { return "Pakistan"; }
  if(country === "PG") { return "Papua New Guinea"; }
  if(country === "PH") { return "The Philippines"; }
  if(country === "WS") { return "Samoa"; }
  if(country === "SG") { return "Singapore"; }
  if(country === "SB") { return "Solomon Islands"; }
  if(country === "KR") { return "South Korea"; }
  if(country === "LK") { return "Sri Lanka"; }
  if(country === "TW") { return "Taiwan"; }
  if(country === "TH") { return "Thailand"; }
  if(country === "TO") { return "Tonga"; }
  if(country === "TV") { return "Tuvalu"; }
  if(country === "GB") { return "United Kingdom"; }
  if(country === "VU") { return "Vanuatu"; }
  if(country === "VN") { return "Vietnam"; }
  else { throw "Country code Not Found in utils/replaceCountryCode.js"; }
}

//replaces fully formatted country name with two digit country code
export function replaceCountryName(country) {
  if(country === "American Samoa") { return "AS"; }
  if(country === "Australia") { return "AU"; }
  if(country === "Bangladesh") { return "BD"; }
  if(country === "Cambodia") { return "KH"; }
  if(country === "China") { return "CN"; }
  if(country === "Christmas Islands") { return "CX"; }
  if(country === "Cook Islands") { return "CK"; }
  if(country === "Germany") { return "DE"; }
  if(country === "Fiji") { return "FJ"; }
  if(country === "French Polynesia") { return "PF"; }
  if(country === "Guam") { return "GU"; }
  if(country === "Hong Kong") { return "HK"; }
  if(country === "India") { return "IN"; }
  if(country === "Italy") { return "IT"; }
  if(country === "Indonesia") { return "ID"; }
  if(country === "Japan") { return "JP"; }
  if(country === "Kiribati") { return "KI"; }
  if(country === "Macao") { return "MO"; }
  if(country === "Malaysia") { return "MY"; }
  if(country === "Maldives") { return "MV"; }
  if(country === "Marshall Islands") { return "MH"; }
  if(country === "Micronesia") { return "FM"; }
  if(country === "Myanmar") { return "MM"; }
  if(country === "Nauru") { return "NR"; }
  if(country === "New Caledonia") { return "NC"; }
  if(country === "New Zealand") { return "NZ"; }
  if(country === "Pakistan") { return "PK"; }
  if(country === "Papua New Guinea") { return "PG"; }
  if(country === "The Philippines") { return "PH"; }
  if(country === "Samoa") { return "WS"; }
  if(country === "Singapore") { return "SG"; }
  if(country === "Solomon Islands") { return "SB"; }
  if(country === "South Korea") { return "KR"; }
  if(country === "Sri Lanka") { return "LK"; }
  if(country === "Taiwan") { return "TW"; }
  if(country === "Thailand") { return "TH"; }
  if(country === "Tonga") { return "TO"; }
  if(country === "Tuvalu") { return "TV"; }
  if(country === "United Kingdom") { return "GB"; }
  if(country === "Vanuatu") { return "VU"; }
  if(country === "Vietnam") { return "VN"; }
  else { throw "Country not found in utils/replaceCountryCode.js"; }
}

export const dummyCountries = [
    {
      name: { common: "United States", translations: { fr: { common: "États-Unis" }, es: { common: "Estados Unidos" } } },
      capital: ["Washington, D.C."],
      region: "Americas",
      population: 331002651,
      languages: { eng: "English" },
      flags: { png: "https://flagcdn.com/w320/us.png" },
      cca3: "USA"
    },
    {
      name: { common: "France", translations: { fr: { common: "France" }, es: { common: "Francia" } } },
      capital: ["Paris"],
      region: "Europe",
      population: 65273511,
      languages: { fra: "French" },
      flags: { png: "https://flagcdn.com/w320/fr.png" },
      cca3: "FRA"
    },
    {
      name: { common: "Japan", translations: { fr: { common: "Japon" }, es: { common: "Japón" } } },
      capital: ["Tokyo"],
      region: "Asia",
      population: 126476461,
      languages: { jpn: "Japanese" },
      flags: { png: "https://flagcdn.com/w320/jp.png" },
      cca3: "JPN"
    }
  ];
  
  // Dummy API response for pagination
  export const dummyApiResponse = (page = 1, pageSize = 10, lang = 'en') => ({
    data: dummyCountries.slice((page - 1) * pageSize, page * pageSize),
    total: dummyCountries.length,
    page,
    pageSize,
    totalPages: Math.ceil(dummyCountries.length / pageSize),
    language: lang
  });
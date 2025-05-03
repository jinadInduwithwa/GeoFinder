import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCountryContext } from "../context/CountryContext";
import { FaHeart, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";

// Initialize i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          backToCountries: "Back to Countries",
          loading: "Loading...",
          error: "Error",
          noData: "No Data",
          noDataMessage: "No country data found for the provided code.",
          keyInformation: "Key Information",
          capital: "Capital",
          capitalTooltip: "Main administrative city",
          population: "Population",
          populationTooltip: "Total inhabitants",
          area: "Area",
          areaTooltip: "Land area in square kilometers",
          continent: "Continent",
          continentTooltip: "Geographical continent",
          region: "Region",
          regionTooltip: "Geopolitical region",
          detailedInformation: "Detailed Information",
          subregion: "Subregion",
          languages: "Languages",
          currencies: "Currencies",
          timezones: "Timezones",
          borderingCountries: "Bordering Countries",
          callingCode: "Calling Code",
          topLevelDomain: "Top-Level Domain",
          independent: "Independent",
          unMember: "UN Member",
          coordinates: "Coordinates",
          drivingSide: "Driving Side",
          culturalHighlights: "Cultural Highlights",
          festival: "Traditional {{country}} Festival",
          festivalDescription: "A vibrant celebration of {{country}}'s heritage with music, dance, and local cuisine.",
          landmark: "{{country}} Historical Landmark",
          landmarkDescription: "An iconic site showcasing {{country}}'s rich history and architecture.",
          addToFavorites: "Add to favorites",
          removeFromFavorites: "Remove from favorites",
          mapNotAvailable: "Map not available",
        },
      },
      si: {
        translation: {
          backToCountries: "රටවල් වෙත ආපසු",
          loading: "පූරණය වෙමින්...",
          error: "දෝෂය",
          noData: "දත්ත නැත",
          noDataMessage: "ලබා දී ඇති කේතය සඳහා රටේ දත්ත හමු නොවීය.",
          keyInformation: "ප්‍රධාන තොරතුරු",
          capital: "අගනුවර",
          capitalTooltip: "ප්‍රධාන පරිපාලන නගරය",
          population: "ජනගහනය",
          populationTooltip: "මුළු වැසියන්",
          area: "වර්ගඵලය",
          areaTooltip: "වර්ග කිලෝමීටර් ඒකකවල භූමි ප්‍රමාණය",
          continent: "මහාද්වීපය",
          continentTooltip: "භූගෝලීය මහාද්වීපය",
          region: "කලාපය",
          regionTooltip: "භූ-දේශපාලන කලාපය",
          detailedInformation: "විස්තරාත්මක තොරතුරු",
          subregion: "උපකලාපය",
          languages: "භාෂා",
          currencies: "මුදල්",
          timezones: "වේලා කලාප",
          borderingCountries: "දේශසීමා රටවල්",
          callingCode: "ඇමතුම් කේතය",
          topLevelDomain: "ඉහළ මට්ටමේ වසම",
          independent: "ස්වාධීන",
          unMember: "එක්සත් ජාතීන්ගේ සාමාජික",
          coordinates: "ඛණ්ඩාංක",
          drivingSide: "රිය පැදවීමේ පැත්ත",
          culturalHighlights: "සංස්කෘතික උද්දීපනය",
          festival: "සාම්ප්‍රදායික {{country}} උත්සවය",
          festivalDescription: "{{country}} හි උරුමය සමරන සජීවී උත්සවයක්, සංගීතය, නැටුම් සහ දේශීය ආහාර සමඟ.",
          landmark: "{{country}} ඓතිහාසික සලකුණ",
          landmarkDescription: "{{country}} හි පොහොසත් ඉතිහාසය සහ ගෘහනිර්මාණ ශිල්පය ප්‍රදර්ශනය කරන ඉකොනික් ස්ථානයක්.",
          addToFavorites: "ප්‍රියතමයන්ට එක් කරන්න",
          removeFromFavorites: "ප්‍රියතමයන්ගෙන් ඉවත් කරන්න",
          mapNotAvailable: "සිතියම ලබා ගත නොහැක",
        },
      },
      ta: {
        translation: {
          backToCountries: "நாடுகளுக்கு திரும்பு",
          loading: "ஏற்றுகிறது...",
          error: "பிழை",
          noData: "தரவு இல்லை",
          noDataMessage: "கொடுக்கப்பட்ட குறியீட்டிற்கு நாட்டின் தரவு கிடைக்கவில்லை.",
          keyInformation: "முக்கிய தகவல்",
          capital: "தலைநகரம்",
          capitalTooltip: "முதன்மை நிர்வாக நகரம்",
          population: "மக்கள்தொகை",
          populationTooltip: "மொத்த குடிமக்கள்",
          area: "பரப்பளவு",
          areaTooltip: "சதுர கிலோமீட்டரில் நிலப்பரப்பு",
          continent: "கண்டம்",
          continentTooltip: "புவியியல் கண்டம்",
          region: "பிராந்தியம்",
          regionTooltip: "புவி-அரசியல் பிராந்தியம்",
          detailedInformation: "விரிவான தகவல்",
          subregion: "துணைப் பிராந்தியம்",
          languages: "மொழிகள்",
          currencies: "நாணயங்கள்",
          timezones: "நேர மண்டலங்கள்",
          borderingCountries: "எல்லை நாடுகள்",
          callingCode: "அழைப்பு குறியீடு",
          topLevelDomain: "மேல் நிலை டொமைன்",
          independent: "சுதந்திரமான",
          unMember: "ஐநா உறுப்பினர்",
          coordinates: "ஆயத்தொலைவுகள்",
          drivingSide: "வாகனம் ஓட்டும் பக்கம்",
          culturalHighlights: "கலாச்சார முக்கிய அம்சங்கள்",
          festival: "பாரம்பரிய {{country}} திருவிழா",
          festivalDescription: "{{country}} இன் பாரம்பரியத்தை கொண்டாடும் ஒரு துடிப்பான திருவிழா, இசை, நடனம் மற்றும் உள்ளூர் உணவு வகைகளுடன்.",
          landmark: "{{country}} வரலாற்று அடையாளம்",
          landmarkDescription: "{{country}} இன் பணக்கார வரலாறு மற்றும் கட்டிடக்கலையை காட்டும் ஒரு புகழ்பெற்ற இடம்.",
          addToFavorites: "பிடித்தவைகளில் சேர்",
          removeFromFavorites: "பிடித்தவைகளில் இருந்து நீக்கு",
          mapNotAvailable: "வரைபடம் கிடைக்கவில்லை",
        },
      },
      de: {
        translation: {
          backToCountries: "Zurück zu den Ländern",
          loading: "Laden...",
          error: "Fehler",
          noData: "Keine Daten",
          noDataMessage: "Für den angegebenen Code wurden keine Länderdaten gefunden.",
          keyInformation: "Wichtige Informationen",
          capital: "Hauptstadt",
          capitalTooltip: "Hauptverwaltungsstadt",
          population: "Bevölkerung",
          populationTooltip: "Gesamtzahl der Einwohner",
          area: "Fläche",
          areaTooltip: "Landfläche in Quadratkilometern",
          continent: "Kontinent",
          continentTooltip: "Geografischer Kontinent",
          region: "Region",
          regionTooltip: "Geopolitische Region",
          detailedInformation: "Detaillierte Informationen",
          subregion: "Subregion",
          languages: "Sprachen",
          currencies: "Währungen",
          timezones: "Zeitzonen",
          borderingCountries: "Nachbarländer",
          callingCode: "Telefonvorwahl",
          topLevelDomain: "Top-Level-Domain",
          independent: "Unabhängig",
          unMember: "UN-Mitglied",
          coordinates: "Koordinaten",
          drivingSide: "Fahrseite",
          culturalHighlights: "Kulturelle Highlights",
          festival: "Traditionelles {{country}} Festival",
          festivalDescription: "Ein lebhaftes Fest, das das Erbe von {{country}} mit Musik, Tanz und lokaler Küche feiert.",
          landmark: "Historisches Wahrzeichen von {{country}}",
          landmarkDescription: "Ein ikonisches Wahrzeichen, das die reiche Geschichte und Architektur von {{country}} zeigt.",
          addToFavorites: "Zu Favoriten hinzufügen",
          removeFromFavorites: "Aus Favoriten entfernen",
          mapNotAvailable: "Karte nicht verfügbar",
        },
      },
      zh: {
        translation: {
          backToCountries: "返回国家列表",
          loading: "加载中...",
          error: "错误",
          noData: "无数据",
          noDataMessage: "未找到提供的代码对应的国家数据。",
          keyInformation: "关键信息",
          capital: "首都",
          capitalTooltip: "主要行政城市",
          population: "人口",
          populationTooltip: "总居民数",
          area: "面积",
          areaTooltip: "以平方公里为单位的土地面积",
          continent: "大陆",
          continentTooltip: "地理大陆",
          region: "地区",
          regionTooltip: "地缘政治地区",
          detailedInformation: "详细信息",
          subregion: "子区域",
          languages: "语言",
          currencies: "货币",
          timezones: "时区",
          borderingCountries: "邻国",
          callingCode: "电话代码",
          topLevelDomain: "顶级域名",
          independent: "独立",
          unMember: "联合国成员",
          coordinates: "坐标",
          drivingSide: "驾驶侧",
          culturalHighlights: "文化亮点",
          festival: "传统{{country}}节",
          festivalDescription: "一个庆祝{{country}}遗产的充满活力的节日，伴有音乐、舞蹈和当地美食。",
          landmark: "{{country}}历史地标",
          landmarkDescription: "一个展示{{country}}丰富历史和建筑的标志性地点。",
          addToFavorites: "添加到收藏",
          removeFromFavorites: "从收藏中移除",
          mapNotAvailable: "地图不可用",
        },
      },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Mock cultural highlights with translation
const mockCulturalHighlights = (countryName, t) => [
  {
    name: t("festival", { country: countryName }),
    description: t("festivalDescription", { country: countryName }),
    image: "https://via.placeholder.com/300x200?text=Festival",
  },
  {
    name: t("landmark", { country: countryName }),
    description: t("landmarkDescription", { country: countryName }),
    image: "https://via.placeholder.com/300x200?text=Landmark",
  },
];

const CountryDetails = () => {
  const { cca3 } = useParams();
  const { language: contextLanguage, fetchCountryByCode, loading, error } = useCountryContext();
  const { t, i18n } = useTranslation();
  const [country, setCountry] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(contextLanguage || "en");

  // Sync i18next language with context language or user selection
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  // Load favorite state from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    setIsFavorite(favorites.includes(cca3));
  }, [cca3]);

  // Save favorite state to localStorage
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    const updatedFavorites = isFavorite
      ? favorites.filter((code) => code !== cca3)
      : [...favorites, cca3];
    localStorage.setItem("favoriteCountries", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Fetch country data
  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await fetchCountryByCode(cca3, selectedLanguage);
        if (!response || !response.data) {
          throw new Error("No country data received");
        }
        setCountry(response.data);
      } catch (err) {
        console.error("Error fetching country:", err);
        setCountry(null);
      }
    };
    getCountry();
  }, [cca3, selectedLanguage, fetchCountryByCode]);

  // Formatters
  const formatPopulation = (pop) => {
    const num = Number(pop);
    if (isNaN(num)) return "N/A";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const formatArea = (area) => {
    const num = Number(area);
    if (isNaN(num)) return "N/A";
    return `${num.toLocaleString()} km²`;
  };

  // Language switcher handler
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-lg">{t("loading")}</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">{t("error")}</p>
          <p>{error}</p>
          <Link to="/countries-list" className="mt-4 inline-block text-indigo-600">
            {t("backToCountries")}
          </Link>
        </div>
      </div>
    );
  }

  // Render no data state
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">{t("noData")}</p>
          <p>{t("noDataMessage")}</p>
          <Link to="/countries-list" className="mt-4 inline-block text-indigo-600">
            {t("backToCountries")}
          </Link>
        </div>
      </div>
    );
  }

  // Safe access to country data
  const displayName =
    selectedLanguage === "en"
      ? country.name?.common || "N/A"
      : country.translations?.[selectedLanguage]?.common || country.name?.common || "N/A";

  const languageList = Object.values(country.languages || {}).join(", ") || "N/A";
  const currencyList = Object.values(country.currencies || {})
    .map((curr) => `${curr.name} (${curr.symbol})`)
    .join(", ") || "N/A";
  const timezoneList = country.timezones?.join(", ") || "N/A";
  const borderList = country.borders?.join(", ") || "None";
  const callingCode = country.idd
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "N/A";
  const tldList = country.tld?.join(", ") || "N/A";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <style>
        {`
          body {
            font-family: 'Noto Sans Sinhala', 'Noto Sans Tamil', 'Noto Sans SC', sans-serif;
          }
        `}
      </style>
      {/* Hero Section */}
      <div className="relative w-full h-72 mt-10 sm:h-96 md:h-[28rem] rounded-sm overflow-hidden shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${country.flags?.png || "https://via.placeholder.com/1200x600"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
            {displayName}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mt-3">
            {country.name?.official || "N/A"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-12">
        {/* Back Button and Language Switcher */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/countries-list"
            className="inline-flex items-center text-green-600 font-semibold"
          >
            <FaArrowLeft className="mr-2 text-xl" />
            {t("backToCountries")}
          </Link>
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-full p-2 text-gray-700 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文 (Chinese)</option>
            </select>
          </div>
        </div>

        {/* Key Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Flag and Map (Left Side) */}
          <div>
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-sm shadow-xl p-6">
              <img
                className="w-full h-48 object-cover rounded-sm mb-4"
                src={country.flags?.png || "https://via.placeholder.com/300x200"}
                alt={country.flags?.alt || `${country.name?.common || "Country"} flag`}
              />
              <div className="h-48 rounded-sm overflow-hidden">
                {country.latlng ? (
                  <MapContainer
                    center={[country.latlng[0], country.latlng[1]]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-sm"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[country.latlng[0], country.latlng[1]]}>
                      <Popup>{displayName}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center rounded-sm">
                    <span className="text-gray-500">{t("mapNotAvailable")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info (Right Side) */}
          <div>
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-sm shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("keyInformation")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: t("capital"), value: country.capital?.[0] || "N/A", tooltip: t("capitalTooltip") },
                  { label: t("population"), value: formatPopulation(country.population), tooltip: t("populationTooltip") },
                  { label: t("area"), value: formatArea(country.area), tooltip: t("areaTooltip") },
                  { label: t("continent"), value: country.continents?.[0] || "N/A", tooltip: t("continentTooltip") },
                  { label: t("region"), value: country.region || "N/A", tooltip: t("regionTooltip") },
                ].map((item, index) => (
                  <div key={index} className="group relative">
                    <p className="text-gray-700 text-sm sm:text-base font-medium">
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                      {item.tooltip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Detailed Info */}
        <div>
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-sm shadow-xl p-6 sm:p-8">
              <div id="detailed-info" className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
                {[
                  { label: t("subregion"), value: country.subregion || "N/A" },
                  { label: t("languages"), value: languageList },
                  { label: t("currencies"), value: currencyList },
                  { label: t("timezones"), value: timezoneList },
                  { label: t("borderingCountries"), value: borderList },
                  { label: t("callingCode"), value: callingCode },
                  { label: t("topLevelDomain"), value: tldList },
                  { label: t("independent"), value: country.independent ? "Yes" : "No" },
                  { label: t("unMember"), value: country.unMember ? "Yes" : "No" },
                  { label: t("coordinates"), value: country.latlng ? `${country.latlng[0]}, ${country.latlng[1]}` : "N/A" },
                  { label: t("drivingSide"), value: country.car?.side || "N/A" },
                ].map((item, index) => (
                  <p key={index} className="text-gray-700 font-medium">
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                ))}
              </div>
          </div>
        </div>


      </div>

      {/* Sticky Favorites Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleFavorite}
          className={`p-4 rounded-full shadow-xl ${
            isFavorite ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
          aria-label={isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
        >
          <FaHeart className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CountryDetails;
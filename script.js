// Global variables
let exchangeRates = {};
let inputMode = "place";

// Currency list
const currencies = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound Sterling", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
];

// Industry data for news tiles
const industries = [
  {
    name: "Defence",
    icon: "🛡️",
    class: "defence",
    news: "Defence exports reach ₹21,000 crore with new helicopter deals to Philippines",
    trend: "up",
    change: "+15.2%",
  },
  {
    name: "Food Processing",
    icon: "🍽️",
    class: "food",
    news: "Food processing sector shows strong growth with ₹35,000 crore investment",
    trend: "up",
    change: "+8.7%",
  },
  {
    name: "Agri & Allied",
    icon: "🌾",
    class: "agri",
    news: "Agricultural exports hit record high of $50 billion driven by rice and wheat",
    trend: "up",
    change: "+12.4%",
  },
  {
    name: "Chemical Processing",
    icon: "⚗️",
    class: "chemical",
    news: "Chemical industry invests ₹45,000 crore in new specialty chemicals plants",
    trend: "stable",
    change: "+3.1%",
  },
  {
    name: "Industrial Automation",
    icon: "🤖",
    class: "automation",
    news: "Automation sector grows 18% with AI-driven manufacturing solutions",
    trend: "up",
    change: "+18.3%",
  },
  {
    name: "Automotive",
    icon: "🚗",
    class: "automotive",
    news: "EV sales surge 85% as battery manufacturing capacity doubles",
    trend: "up",
    change: "+22.5%",
  },
  {
    name: "Cement",
    icon: "🏗️",
    class: "cement",
    news: "Cement demand rises 7% driven by infrastructure and housing projects",
    trend: "stable",
    change: "+6.8%",
  },
  {
    name: "Steel",
    icon: "⚡",
    class: "steel",
    news: "Steel production touches 140 MT with new capacity additions in eastern India",
    trend: "up",
    change: "+9.2%",
  },
  {
    name: "Textile",
    icon: "🧵",
    class: "textile",
    news: "Textile exports face headwinds amid global demand slowdown",
    trend: "down",
    change: "-4.3%",
  },
  {
    name: "Energy",
    icon: "⚡",
    class: "energy",
    news: "Energy sector investments reach ₹12 lakh crore for capacity expansion",
    trend: "up",
    change: "+11.7%",
  },
  {
    name: "Renewable Energy",
    icon: "🌱",
    class: "renewable",
    news: "Solar installations cross 70 GW as India accelerates green transition",
    trend: "up",
    change: "+28.9%",
  },
  {
    name: "Construction Equipment",
    icon: "🚜",
    class: "construction",
    news: "Construction equipment sales grow 12% backed by infrastructure push",
    trend: "up",
    change: "+12.1%",
  },
];

// DOM elements
const elements = {
  currentDate: document.getElementById("currentDate"),
  sourceCurrency: document.getElementById("sourceCurrency"),
  targetCurrency: document.getElementById("targetCurrency"),
  placeValueBtn: document.getElementById("placeValueBtn"),
  directValueBtn: document.getElementById("directValueBtn"),
  placeValueMode: document.getElementById("placeValueMode"),
  directInputMode: document.getElementById("directInputMode"),
  numericValue: document.getElementById("numericValue"),
  placeValue: document.getElementById("placeValue"),
  directValue: document.getElementById("directValue"),
  convertBtn: document.getElementById("convertBtn"),
  errorDisplay: document.getElementById("errorDisplay"),
  resultDisplay: document.getElementById("resultDisplay"),
  resultText: document.getElementById("resultText"),
  resultRate: document.getElementById("resultRate"),
  resultTimestamp: document.getElementById("resultTimestamp"),
  inrRatesContainer: document.getElementById("inrRatesContainer"),
  metalsContainer: document.getElementById("metalsContainer"),
  fiiContainer: document.getElementById("fiiContainer"),
  newsContainer: document.getElementById("newsContainer"),
  industriesGrid: document.getElementById("industriesGrid"),
  lastUpdated: document.getElementById("lastUpdated"),
};

// Initialize the application
async function init() {
  updateDateTime();
  populateCurrencyDropdowns();
  setupEventListeners();
  populateIndustryTiles();
  await loadExchangeRates();
  await loadSidebarData();

  // Set default values
  elements.sourceCurrency.value = "INR";
  elements.targetCurrency.value = "USD";

  // Auto-update intervals
  setInterval(updateDateTime, 60000); // Every minute
  setInterval(loadSidebarData, 300000); // Every 5 minutes
  setInterval(updateLivePreciousMetals, 120000); // Every 2 minutes
  setInterval(updateNewsTimestamps, 30000); // Every 30 seconds
}

// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateStr = now.toLocaleDateString("en-US", options);
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  elements.currentDate.textContent = `📅 ${dateStr} • ${timeStr}`;
  elements.lastUpdated.textContent = timeStr;
}

// Populate currency dropdowns
function populateCurrencyDropdowns() {
  currencies.forEach((currency) => {
    const optionText = `${currency.flag} ${currency.code} – ${currency.name}`;
    const option1 = new Option(optionText, currency.code);
    const option2 = new Option(optionText, currency.code);
    elements.sourceCurrency.appendChild(option1);
    elements.targetCurrency.appendChild(option2);
  });
}

// Populate industry tiles
function populateIndustryTiles() {
  let industriesHTML = "";

  industries.forEach((industry) => {
    industriesHTML += `
                <div class="industry-tile ${industry.class}" onclick="showIndustryDetails('${industry.name}')">
                    <span class="industry-icon">${industry.icon}</span>
                    <div class="industry-name">${industry.name}</div>
                    <div class="industry-news-text">${industry.news}</div>
                    <div class="industry-trend">
                        <span style="font-weight: 600; color: #6b7280;">Performance</span>
                        <span class="trend-indicator trend-${industry.trend}">${industry.change}</span>
                    </div>
                </div>
            `;
  });

  elements.industriesGrid.innerHTML = industriesHTML;
}

// Update news timestamps to keep them current
function updateNewsTimestamps() {
  const newsItems = elements.newsTicker.querySelectorAll(".news-time");
  newsItems.forEach((timeEl, index) => {
    const baseMinutes = (index % liveNewsData.length) * 3 + 2; // Stagger times
    const currentMinutes =
      baseMinutes + (Math.floor(Date.now() / 30000) % 60); // Update every 30 seconds
    timeEl.textContent = `${currentMinutes} min ago`;
  });
}
function showIndustryDetails(industryName) {
  alert(
    `${industryName} Industry Details\n\nClick here for detailed industry analysis, market trends, and investment opportunities.`
  );
}

// Setup event listeners
function setupEventListeners() {
  elements.placeValueBtn.addEventListener("click", () =>
    toggleInputMode("place")
  );
  elements.directValueBtn.addEventListener("click", () =>
    toggleInputMode("direct")
  );
  elements.convertBtn.addEventListener("click", performConversion);

  // Enter key support
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !elements.convertBtn.disabled) {
      performConversion();
    }
  });

  // Input validation
  elements.numericValue.addEventListener("input", clearErrors);
  elements.directValue.addEventListener("input", clearErrors);
  elements.sourceCurrency.addEventListener("change", clearErrors);
  elements.targetCurrency.addEventListener("change", clearErrors);
}

// Toggle input mode
function toggleInputMode(mode) {
  inputMode = mode;

  if (mode === "place") {
    elements.placeValueBtn.classList.add("active");
    elements.directValueBtn.classList.remove("active");
    elements.placeValueMode.classList.remove("hidden");
    elements.directInputMode.classList.add("hidden");
  } else {
    elements.directValueBtn.classList.add("active");
    elements.placeValueBtn.classList.remove("active");
    elements.directInputMode.classList.remove("hidden");
    elements.placeValueMode.classList.add("hidden");
  }

  clearErrors();
}

// Load exchange rates
async function loadExchangeRates() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const baseRates = {
      USD: 1,
      EUR: 0.9234,
      GBP: 0.7845,
      JPY: 147.25,
      INR: 83.12,
      AUD: 1.4789,
      CAD: 1.3567,
      CHF: 0.8734,
      CNY: 7.2845,
      SEK: 10.8234,
      NZD: 1.6123,
      SGD: 1.3456,
      HKD: 7.8234,
      NOK: 10.9567,
      KRW: 1342.56,
      BRL: 5.2345,
      ZAR: 18.7834,
      MXN: 17.8945,
      RUB: 94.5678,
      TRY: 27.8934,
    };

    const today = new Date().getDate();
    for (const [currency, rate] of Object.entries(baseRates)) {
      const seed = (today + currency.charCodeAt(0)) % 100;
      const fluctuation = ((seed - 50) / 50) * 0.02;
      exchangeRates[currency] = rate * (1 + fluctuation);
    }

    console.log("✅ Exchange rates loaded");
  } catch (error) {
    console.error("Error loading exchange rates:", error);
  }
}

// Load sidebar data
async function loadSidebarData() {
  await Promise.all([
    updateINRRates(),
    updateLivePreciousMetals(),
    updateFIIData(),
    updateMarketNews(),
  ]);
}

// Update INR rates
async function updateINRRates() {
  const targets = ["USD", "EUR", "CNY", "JPY"];
  let ratesHTML = "";

  targets.forEach((currency) => {
    if (exchangeRates.INR && exchangeRates[currency]) {
      const rate = (exchangeRates[currency] / exchangeRates.INR).toFixed(
        4
      );
      const change = (Math.random() - 0.5) * 0.04;
      const changeClass = change >= 0 ? "positive" : "negative";
      const changeSymbol = change >= 0 ? "+" : "";
      const flag =
        currencies.find((c) => c.code === currency)?.flag || "";

      ratesHTML += `
                    <div class="fx-rate-item">
                        <div class="currency-pair">${flag} INR/${currency}</div>
                        <div>
                            <span class="rate-value">${rate}</span>
                            <span class="rate-change ${changeClass}">${changeSymbol}${(
        change * 100
      ).toFixed(2)}%</span>
                        </div>
                    </div>
                `;
    }
  });

  elements.inrRatesContainer.innerHTML = ratesHTML;
}

// Update precious metals
async function updateLivePreciousMetals() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const goldPrice = 105018;
    const silverPrice = 1370;
    const goldChange = (Math.random() - 0.3) * 0.03;
    const silverChange = (Math.random() - 0.3) * 0.04;

    elements.metalsContainer.innerHTML = `
                <div class="metal-card gold">
                    <div class="metal-name">🥇 Gold (24K)</div>
                    <div class="metal-price">₹${goldPrice.toLocaleString()}</div>
                    <div class="metal-unit">per 10 grams</div>
                    <div class="live-indicator">
                        <div class="live-dot"></div>
                        <span>LIVE ${goldChange >= 0 ? "+" : ""}${(
      goldChange * 100
    ).toFixed(2)}%</span>
                    </div>
                </div>
                <div class="metal-card silver">
                    <div class="metal-name">🥈 Silver</div>
                    <div class="metal-price">₹${silverPrice.toLocaleString()}</div>
                    <div class="metal-unit">per 10 grams</div>
                    <div class="live-indicator">
                        <div class="live-dot"></div>
                        <span>LIVE ${silverChange >= 0 ? "+" : ""}${(
      silverChange * 100
    ).toFixed(2)}%</span>
                    </div>
                </div>
            `;
  } catch (error) {
    console.error("Error updating metals:", error);
  }
}

// Update FII data
async function updateFIIData() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const secondLastYear = currentYear - 2;

    const data = {
      currentYear: { ytdCumulative: 2847 },
      lastYear: { ytdCumulative: 1523 },
      secondLastYear: { ytdCumulative: -890 },
    };

    const changeVsLastYear =
      ((data.currentYear.ytdCumulative - data.lastYear.ytdCumulative) /
        Math.abs(data.lastYear.ytdCumulative)) *
      100;
    const changeVsSecondLastYear =
      ((data.currentYear.ytdCumulative -
        data.secondLastYear.ytdCumulative) /
        Math.abs(data.secondLastYear.ytdCumulative)) *
      100;

    elements.fiiContainer.innerHTML = `
                <div class="fii-card">
                    <div class="fii-header">📊 FII Investment Analysis (YTD)</div>
                    
                    <div class="fii-current">
                        <div style="font-size: 0.8rem; opacity: 0.9;">${currentYear} Current Year</div>
                        <div class="fii-amount" style="color: #10b981;">+${data.currentYear.ytdCumulative.toLocaleString()}M</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">Jan - Sep YTD</div>
                    </div>
                    
                    <div class="fii-grid">
                        <div class="fii-item">
                            <div style="font-size: 0.7rem; opacity: 0.8;">${lastYear} YTD</div>
                            <div style="font-weight: 600;">+${data.lastYear.ytdCumulative.toLocaleString()}M</div>
                        </div>
                        <div class="fii-item">
                            <div style="font-size: 0.7rem; opacity: 0.8;">${secondLastYear} YTD</div>
                            <div style="font-weight: 600;">-${Math.abs(
                              data.secondLastYear.ytdCumulative
                            ).toLocaleString()}M</div>
                        </div>
                    </div>
                    
                    <div class="fii-comparison">
                        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 8px;">📈 YTD Performance vs Previous Years:</div>
                        <div class="fii-comp-item">
                            <span>vs ${lastYear}:</span>
                            <span style="color: #10b981; font-weight: 600;">+${changeVsLastYear.toFixed(
                              1
                            )}%</span>
                        </div>
                        <div class="fii-comp-item">
                            <span>vs ${secondLastYear}:</span>
                            <span style="color: #10b981; font-weight: 600;">+${changeVsSecondLastYear.toFixed(
                              1
                            )}%</span>
                        </div>
                    </div>
                </div>
            `;
  } catch (error) {
    console.error("Error updating FII data:", error);
  }
}

// Update market news
async function updateMarketNews() {
  const news = [
    {
      title:
        "Sensex surges 380 points as banking stocks rally on strong Q2 results",
      time: "1h ago",
    },
    {
      title:
        "RBI keeps repo rate unchanged at 6.50% in monetary policy review",
      time: "2h ago",
    },
    {
      title: "Nifty IT index gains 2.8% on robust earnings guidance",
      time: "3h ago",
    },
    {
      title:
        "Rupee strengthens to 83.08/$ on improved current account deficit",
      time: "4h ago",
    },
    {
      title: "FII net inflows reach $2.15B in September amid optimism",
      time: "5h ago",
    },
    {
      title: "Auto sector gains momentum with festive season demand",
      time: "6h ago",
    },
  ];

  let newsHTML = "";
  news.forEach((item) => {
    newsHTML += `
                <div class="news-item">
                    <div class="news-title">${item.title}</div>
                    <div class="news-time">🕒 ${item.time}</div>
                </div>
            `;
  });

  elements.newsContainer.innerHTML = newsHTML;
}

// Get parsed value
function getParsedValue() {
  if (inputMode === "place") {
    const numeric = parseFloat(elements.numericValue.value);
    const place = parseFloat(elements.placeValue.value);
    return isNaN(numeric) || numeric <= 0 ? null : numeric * place;
  } else {
    const direct = parseFloat(elements.directValue.value);
    return isNaN(direct) || direct <= 0 ? null : direct;
  }
}

// Format number
function formatNumber(num) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Clear errors
function clearErrors() {
  elements.errorDisplay.classList.remove("show");
}

// Show error
function showError(message) {
  elements.errorDisplay.textContent = message;
  elements.errorDisplay.classList.add("show");
}

// Perform conversion
async function performConversion() {
  clearErrors();
  elements.resultDisplay.classList.remove("show");

  const sourceCurrency = elements.sourceCurrency.value;
  const targetCurrency = elements.targetCurrency.value;
  const amount = getParsedValue();

  // Validation
  if (!sourceCurrency || !targetCurrency) {
    showError("Please select both currencies");
    return;
  }

  if (sourceCurrency === targetCurrency) {
    showError("Source and target currencies cannot be the same");
    return;
  }

  if (!amount) {
    showError("Please enter a valid positive amount");
    return;
  }

  // Loading state
  elements.convertBtn.disabled = true;
  elements.convertBtn.innerHTML = `<div class="loading"></div> Fetching Live Rates...`;

  try {
    await loadExchangeRates();

    if (
      !exchangeRates[sourceCurrency] ||
      !exchangeRates[targetCurrency]
    ) {
      throw new Error("Exchange rate unavailable");
    }

    const sourceToUsd = amount / exchangeRates[sourceCurrency];
    const convertedAmount = sourceToUsd * exchangeRates[targetCurrency];
    const rate =
      exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];

    const sourceFlag =
      currencies.find((c) => c.code === sourceCurrency)?.flag || "";
    const targetFlag =
      currencies.find((c) => c.code === targetCurrency)?.flag || "";

    elements.resultText.innerHTML = `${sourceFlag} ${formatNumber(
      amount
    )} ${sourceCurrency} = ${targetFlag} ${formatNumber(
      convertedAmount
    )} ${targetCurrency}`;
    elements.resultRate.innerHTML = `📊 Exchange Rate: 1 ${sourceCurrency} = ${formatNumber(
      rate
    )} ${targetCurrency}`;
    elements.resultTimestamp.innerHTML = `🕒 Live Rate • Updated: ${new Date().toLocaleTimeString()}`;

    elements.resultDisplay.classList.add("show");

    await updateINRRates();
  } catch (error) {
    showError(`Conversion failed: ${error.message}`);
  } finally {
    elements.convertBtn.disabled = false;
    elements.convertBtn.innerHTML = "🔄 Convert Currency";
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", init);

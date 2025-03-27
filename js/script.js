const apiKey = "161b66486e9ac65da982ce8fd5f8fa46"; // OpenWeather API
const apiCountryURL = 'https://flagsapi.com/';
const apiPexels = "u9JdtPbsagBBuhmaKGZQ4bzo2zgzjulguVmYIEJiJtjtSVqF8T7N980N"; // Pexels API

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector('#search');

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

// Funções
const getWeatherData = async (city) => {
  try {
    toggleLoader(); 
    
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    const res = await fetch(apiWeatherURL);

    if (!res.ok) {
      throw new Error("Cidade não encontrada");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    showErrorMessage(error.message);
    return null;
  } finally {   
    toggleLoader();
  }
};

// Função para buscar imagens no Pexels
const getBackgroundImage = async (city) => {
  try {
    const apiPexelsURL = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
    const res = await fetch(apiPexelsURL, {
      headers: {
        Authorization: apiPexels
      }
    });

    if (!res.ok) {
      throw new Error("Imagem não encontrada");
    }

    const data = await res.json();
    return data.photos[0].src.landscape; // URL da primeira imagem encontrada
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return null;
  }
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

// Função para mostrar os dados do clima
async function showWeatherData(city) {
  const data = await getWeatherData(city);

  if (!data) return;

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
  countryElement.setAttribute("src", `https://flagsapi.com/${data.sys.country}/flat/64.png`);
  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}Km/h`;

  // Buscar imagem de fundo do Pexels
  const backgroundImage = await getBackgroundImage(city);

  if (backgroundImage) {
    document.body.style.backgroundImage = `url("${backgroundImage}")`;
  }

  weatherContainer.classList.remove('hide');
}

// Eventos
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

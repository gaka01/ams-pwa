/**
 * Weather station data object containing current measurements, daily maximums, and minimums. - chat gpt
 * @typedef {Object} WeatherData
 * @property {number} updateDate - The timestamp (in milliseconds) when the data was last updated.
 * @property {boolean} isLive - Indicates whether the data is recent (less than 30 minutes old).
 *
 * @property {Object} current - Current weather measurements.
 * @property {number} current.temperature - Current air temperature in °C.
 * @property {number} current.humidity - Current relative humidity in %.
 * @property {Object} current.pressure - Atmospheric pressure data.
 * @property {number} current.pressure.value - Current pressure in hPa.
 * @property {string} current.pressure.trend - Pressure trend (e.g., 'rising', 'falling', 'steady').
 * @property {Object} current.wind - Wind data.
 * @property {number} current.wind.speed - Wind speed in m/s or km/h.
 * @property {string} current.wind.direction - Wind direction (e.g., 'N', 'NE', 'SW').
 * @property {Object} current.rain - Rainfall data.
 * @property {number} current.rain.ammount - Current rainfall amount (mm).
 * @property {number} current.rain.intensity - Rain intensity (mm/h).
 * @property {number} current.rain.dailyAmmount - Total rainfall for the current day (mm).
 * @property {number} current.rain.monthlyAmmount - Total rainfall for the current month (mm).
 * @property {number} current.dewPoint - Current dew point temperature (°C).
 * @property {number} current.sunRadiation - Current solar radiation value (W/m²).
 * @property {Object} current.misc - Miscellaneous weather-related measurements.
 * @property {number} current.misc.windChill - Wind chill temperature (°C).
 * @property {number} current.misc.thwIndex - Temperature-Humidity-Wind index (°C).
 * @property {number} current.misc.heatIndex - Heat index (°C).
 *
 * @property {Object} dailyMaximums - Daily maximum recorded values.
 * @property {DailyExtreme} dailyMaximums.temperature - Maximum temperature and timestamp.
 * @property {DailyExtreme} dailyMaximums.humidity - Maximum humidity and timestamp.
 * @property {DailyExtreme} dailyMaximums.pressure - Maximum pressure and timestamp.
 * @property {DailyExtreme} dailyMaximums.dewPoint - Maximum dew point and timestamp.
 * @property {DailyExtreme} dailyMaximums.wind - Maximum wind speed and timestamp.
 * @property {DailyExtreme} dailyMaximums.sunRadiation - Maximum solar radiation and timestamp.
 *
 * @property {Object} dailyMinimums - Daily minimum recorded values.
 * @property {DailyExtreme} dailyMinimums.temperature - Minimum temperature and timestamp.
 * @property {DailyExtreme} dailyMinimums.humidity - Minimum humidity and timestamp.
 * @property {DailyExtreme} dailyMinimums.pressure - Minimum pressure and timestamp.
 * @property {DailyExtreme} dailyMinimums.dewPoint - Minimum dew point and timestamp.
 */


/**
 * @typedef {Object} DailyExtreme
 * @property {number} value - The measured value.
 * @property {number} date - Timestamp (in milliseconds) when the value was recorded.
 */
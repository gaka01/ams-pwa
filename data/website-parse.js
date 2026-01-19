import { DateTime } from "luxon";
import { safeInvoke } from "../utils/function-utils.js";
import { Constants } from "../constants.js";

/**
 * @param {string} rawData
 * @returns 
 */
function parse(rawData) {
    return parseData(fixEncoding(rawData));
}

/**
 * @param {string} data 
 * @returns {WeatherData}
 */
function parseData(data) {
    const updateDate = parseUpdateDate(getText(data, 'Измервания от'));

    return {
        updateDate: updateDate,
        isLive: Date.now() - updateDate < 1800000, //not older than 30 mins
        current: {
            temperature: parseTemperature(getText(data, 'Температура', 'Температура')),
            humidity: parseHumidity(getText(data, 'Влажност', 'Влажност')),
            pressure: {
                value: parsePressure(getText(data, 'Налягане')),
                trend: parsePressureTrend(getText(data, 'Налягане')),
            },
            wind: {
                speed: parseWindSpeed(getText(data, 'Скорост на вятъра')),
                direction: parseWindDirection(getText(data, 'Скорост на вятъра')),
            },
            rain: {
                ammount: parseRainAmmount(getText(data, 'Количество')),
                intensity: parseRainAmmount(getText(data, 'Интензивност')),
                dailyAmmount: parseRainAmmount(getText(data, 'Валеж - ден')),
                monthlyAmmount: parseRainAmmount(getText(data, 'Валеж - месец')),
            },
            dewPoint: parseTemperature(getText(data, 'Точка на оросяване', 'Моментна стойност')),
            sunRadiation: parseSunRadiation(getText(data, 'Слънчева радиация', 'Слънчева радиация')),
            misc: {
                windChill: parseTemperature(getText(data, 'Wind Chill:')),
                thwIndex: parseTemperature(getText(data, 'THW Index:')),
                heatIndex: parseTemperature(getText(data, 'Heat Index:')),
            }
        },
        
        dailyMaximums: {
            temperature: parseValueAndDate(getText(data, 'Макс. температура'), parseTemperature, updateDate),
            humidity: parseValueAndDate(getText(data, 'Макс.', 'влажност'), parseHumidity, updateDate),
            pressure: parseValueAndDate(getText(data, 'Макс. н', 'алягане'), parsePressure, updateDate),
            dewPoint: parseValueAndDate(getText(data, 'оросяване', 'Макс. стойност'), parseTemperature, updateDate),
            wind: parseValueAndDate(getText(data, 'Макс.скорост'), parseWindSpeed, updateDate),
            sunRadiation: parseValueAndDate(getText(data, 'Слънчева радиация', 'Макс. стойност'), parseSunRadiation, updateDate),
        },

        dailyMinimums: {
            temperature: parseValueAndDate(getText(data, 'температура', 'Мин.'), parseTemperature, updateDate),
            humidity: parseValueAndDate(getText(data, 'Мин.', 'влажност'), parseHumidity, updateDate),
            pressure: parseValueAndDate(getText(data, 'Мин. н', 'алягане'), parsePressure, updateDate),
            dewPoint: parseValueAndDate(getText(data, 'оросяване', 'Мин. стойност'), parseTemperature, updateDate)
        }
    }
}

function fixEncoding(input) {
    const decoder = new TextDecoder('windows-1251');
    const decodedString = decoder.decode(input);

    const encoder = new TextEncoder('utf-8');
    const utf8Bytes = encoder.encode(decodedString);

    const utf8Str = new TextDecoder('utf-8').decode(utf8Bytes);

    return utf8Str;
}

function parseTemperature(textData) {
    return safeInvoke(() => {
        const cleanTextData = megatrim(textData.substring(0, textData.indexOf('°C')));
        return Number.parseFloat(cleanTextData);
    });
}

function parseHumidity(textData) {
    return safeInvoke(() => {
        const valueString = megatrim(textData.substring(0, textData.indexOf('%')));
        return Number.parseInt(valueString);
    });
}

function parsePressure(textData) {
    return safeInvoke(() => {
        const valueString = megatrim(textData.substring(0, textData.indexOf('hPa')));
        return Number.parseFloat(valueString);
    });
}

function parsePressureTrend(textData) {
    return safeInvoke(() => {
        return megatrim(textData.substring(textData.indexOf('/') + 1));
    });
}

function parseDate(dateString) {
    return safeInvoke(() => {
        const valueString = megatrim(dateString);
        const day = Number.parseInt(valueString.substring(0, 2));
        const month = Number.parseInt(valueString.substring(3, 5));
        const year = Number.parseInt(valueString.substring(6, 8));
        const hour = Number.parseInt(valueString.substring(9, 11));
        const minute = Number.parseInt(valueString.substring(12, 14));
        return DateTime.fromObject({
            year: 2000 + year,
            month: month,
            day: day,
            hour: hour,
            minute: minute
        }).setZone(Constants.dataTimezone).toMillis();
    });
}

function parseTime(temeString, currentDate) {
    return safeInvoke(() => {
        const valueString = megatrim(temeString);
        const hour=Number.parseInt(valueString.substring(0,2));
        const minute=Number.parseInt(valueString.substring(3,5));
        return DateTime.fromMillis(currentDate)
            .set({hour: hour, minute: minute})
            .setZone(Constants.dataTimezone)
            .toMillis();
    });
}

function parseUpdateDate(textData) {
    return parseDate(textData.substring(1));
}

function parseWindSpeed(textData) {
    return safeInvoke(() => {
        const valueString = megatrim(textData.substring(textData.indexOf('&nbsp;&nbsp;') , textData.indexOf('m/s')));
        return Number.parseFloat(valueString);
    });
}

function parseWindDirection(textData) {
    return safeInvoke(() => {
        return megatrim(textData.substring(0, textData.indexOf('&nbsp;')));
    });
}

function parseSunRadiation(textData) {
    return safeInvoke(() => {
        return Number.parseInt(megatrim(textData.substring(textData.indexOf('W/m?'))));
    });
}

function parseRainAmmount(textData) {
    return safeInvoke(() => {
        return Number.parseFloat(megatrim(textData.substring(0, textData.indexOf('mm'))));
    });
}

function parseValueAndDate(textData, valueParser, currentDate) {
    return safeInvoke(() => ({
        value: valueParser(textData),
        date: parseTime(textData.substring(textData.indexOf('в') + 1), currentDate)
    }));
}

/**
 * 
 * @param {string} string 
 * @return {string}
 */
function megatrim(string) {
    return string.replaceAll('&nbsp;', '').trim();
}

/**
 * @param {string} data 
 * @param {...string} before 
 */
function getText(data, ...before) {
    let relevantData = data;
    before.forEach(bef => {
        relevantData = relevantData.substring(relevantData.indexOf(bef) + bef.length);
    });
    
    while (true) {
        const startIndex = relevantData.indexOf('>') + 1;
        const endIndex = relevantData.indexOf('<', startIndex);
        if (startIndex < 0 || endIndex < 0)
            return null;
        const text = relevantData.substring(startIndex, endIndex).trim();
        if(text)
            return text;
        relevantData = relevantData.substring(endIndex + 1);
    }
}

export const WebsiteParse = {
    parse: parse
}
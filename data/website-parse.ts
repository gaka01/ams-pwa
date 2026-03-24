import { DateTime } from "luxon";
import { safeInvoke } from "../utils/function-utils.js";
import { Constants } from "../constants.js";
import type { WeatherData, DailyExtreme } from "../types.js";

function parse(rawData: ArrayBuffer): WeatherData {
    return parseData(fixEncoding(rawData));
}

function parseData(data: string): WeatherData {
    const updateDate = parseUpdateDate(getText(data, 'Измервания от')) ?? 0;

    return {
        updateDate,
        isLive: Date.now() - updateDate < 1800000,
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
            dewPoint: parseValueAndDate(getText(data, 'оросяване', 'Мин. стойност'), parseTemperature, updateDate),
        }
    };
}

function fixEncoding(input: ArrayBuffer): string {
    const decoder = new TextDecoder('windows-1251');
    const decodedString = decoder.decode(input);
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(decodedString);
    return new TextDecoder('utf-8').decode(utf8Bytes);
}

function parseTemperature(textData: string | null): number | undefined {
    return safeInvoke(() => {
        const cleanTextData = megatrim(textData!.substring(0, textData!.indexOf('°C')));
        return Number.parseFloat(cleanTextData);
    });
}

function parseHumidity(textData: string | null): number | undefined {
    return safeInvoke(() => {
        const valueString = megatrim(textData!.substring(0, textData!.indexOf('%')));
        return Number.parseInt(valueString);
    });
}

function parsePressure(textData: string | null): number | undefined {
    return safeInvoke(() => {
        const valueString = megatrim(textData!.substring(0, textData!.indexOf('hPa')));
        return Number.parseFloat(valueString);
    });
}

function parsePressureTrend(textData: string | null): string | undefined {
    return safeInvoke(() => {
        return megatrim(textData!.substring(textData!.indexOf('/') + 1));
    });
}

function parseDate(dateString: string): number | undefined {
    return safeInvoke(() => {
        const valueString = megatrim(dateString);
        const day = Number.parseInt(valueString.substring(0, 2));
        const month = Number.parseInt(valueString.substring(3, 5));
        const year = Number.parseInt(valueString.substring(6, 8));
        const hour = Number.parseInt(valueString.substring(9, 11));
        const minute = Number.parseInt(valueString.substring(12, 14));
        return DateTime.fromObject({
            year: 2000 + year,
            month,
            day,
            hour,
            minute,
        }).setZone(Constants.dataTimezone).toMillis();
    });
}

function parseTime(timeString: string, currentDate: number): number | undefined {
    return safeInvoke(() => {
        const valueString = megatrim(timeString);
        const hour = Number.parseInt(valueString.substring(0, 2));
        const minute = Number.parseInt(valueString.substring(3, 5));
        return DateTime.fromMillis(currentDate)
            .set({ hour, minute })
            .setZone(Constants.dataTimezone)
            .toMillis();
    });
}

function parseUpdateDate(textData: string | null): number | undefined {
    return textData ? parseDate(textData.substring(1)) : undefined;
}

function parseWindSpeed(textData: string | null): number | undefined {
    return safeInvoke(() => {
        const valueString = megatrim(textData!.substring(textData!.indexOf('&nbsp;&nbsp;'), textData!.indexOf('m/s')));
        return Number.parseFloat(valueString);
    });
}

function parseWindDirection(textData: string | null): string | undefined {
    return safeInvoke(() => {
        return megatrim(textData!.substring(0, textData!.indexOf('&nbsp;')));
    });
}

function parseSunRadiation(textData: string | null): number | undefined {
    return safeInvoke(() => {
        return Number.parseInt(megatrim(textData!.substring(textData!.indexOf('W/m?'))));
    });
}

function parseRainAmmount(textData: string | null): number | undefined {
    return safeInvoke(() => {
        return Number.parseFloat(megatrim(textData!.substring(0, textData!.indexOf('mm'))));
    });
}

function parseValueAndDate(
    textData: string | null,
    valueParser: (text: string | null) => number | undefined,
    currentDate: number
): DailyExtreme {
    return safeInvoke(() => ({
        value: valueParser(textData),
        date: parseTime(textData!.substring(textData!.indexOf('в') + 1), currentDate),
    })) ?? { value: undefined, date: undefined };
}

function megatrim(string: string): string {
    return string.replaceAll('&nbsp;', '').trim();
}

function getText(data: string, ...before: string[]): string | null {
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
        if (text)
            return text;
        relevantData = relevantData.substring(endIndex + 1);
    }
}

export const WebsiteParse = {
    parse,
};

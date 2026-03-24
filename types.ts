export interface DailyExtreme {
  value: number | undefined;
  date: number | undefined;
}

export interface WeatherData {
  updateDate: number;
  isLive: boolean;
  current: {
    temperature: number | undefined;
    humidity: number | undefined;
    pressure: {
      value: number | undefined;
      trend: string | undefined;
    };
    wind: {
      speed: number | undefined;
      direction: string | undefined;
    };
    rain: {
      ammount: number | undefined;
      intensity: number | undefined;
      dailyAmmount: number | undefined;
      monthlyAmmount: number | undefined;
    };
    dewPoint: number | undefined;
    sunRadiation: number | undefined;
    misc: {
      windChill: number | undefined;
      thwIndex: number | undefined;
      heatIndex: number | undefined;
    };
  };
  dailyMaximums: {
    temperature: DailyExtreme;
    humidity: DailyExtreme;
    pressure: DailyExtreme;
    dewPoint: DailyExtreme;
    wind: DailyExtreme;
    sunRadiation: DailyExtreme;
  };
  dailyMinimums: {
    temperature: DailyExtreme;
    humidity: DailyExtreme;
    pressure: DailyExtreme;
    dewPoint: DailyExtreme;
  };
}

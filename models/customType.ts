export interface FormData {
  enteredEmail?: string;
  enteredPassword?: string;
  enteredConfirmPassword?: string;
}

export type User = {
  enteredEmail?: string;
  enteredPassword?: string;
};

export type RegisterResponse = {
  message: string;
};

export type Password = {
  enteredPassword: string;
  userPassword: string;
};
export type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type Cities = {
  name: string;
  local_names: LocalNames[];
  lat: number;
  lon: number;
  country: string;
};

export type LocalNames = {
  ar?: string;
  ascii?: string;
  de?: string;
  en?: string;
  feature_name?: string;
  fr?: string;
};

export type LoadedCities = {
  country: string;
  name: string;
};

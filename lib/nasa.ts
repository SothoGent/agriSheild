const NASA_ENDPOINT = "https://power.larc.nasa.gov/api/temporal/daily/point";

export type NasaPoint = {
  date: string;
  rainfall: number;
  tmax: number;
  tmin: number;
  humidity: number;
};

export async function fetchNasaData(
  lat: number, lon: number, start: string, end: string
): Promise<NasaPoint[]> {
  const params = new URLSearchParams({
    parameters: "PRECTOTCORR,T2M_MAX,T2M_MIN,RH2M",
    community: "AG",
    longitude: String(lon),
    latitude: String(lat),
    start,
    end,
    format: "JSON",
  });
  const url = NASA_ENDPOINT + "?" + params.toString();
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("NASA POWER error: " + res.status);
  const json = await res.json();
  const props = json.properties.parameter;
  const dates = Object.keys(props.PRECTOTCORR);
  return dates.map((date) => ({
    date,
    rainfall: props.PRECTOTCORR[date] ?? 0,
    tmax: props.T2M_MAX[date] ?? 0,
    tmin: props.T2M_MIN[date] ?? 0,
    humidity: props.RH2M[date] ?? 0,
  }));
}

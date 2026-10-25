import {
  AspectWithPositions,
  BodyStations,
  CelestialObjectPosition,
  JsonDate,
  SavedDate,
} from "src/types";
import {
  apiSlice,
  savedDateTag,
  toFetchError,
} from "src/store/slices/apiSlice";
import { savedDataSlice } from "./savedDataSlice";
import { BaseQueryApi } from "@reduxjs/toolkit/query";

const TRANSITS_CACHE_SECONDS = 300;

function filterAspects(aspects: AspectWithPositions[]): AspectWithPositions[] {
  return aspects.filter(
    (d) =>
      !["Moon", "Mercury"].includes(d.pos1.name) &&
      !["vertex"].includes(d.pos2.name) &&
      !["quincunx"].includes(d.name)
  );
}

async function fetchBaseDate(
  index: number,
  api: BaseQueryApi
): Promise<SavedDate> {
  const baseDate = await api
    .dispatch(
      savedDataSlice.endpoints.getSavedDataDetail.initiate(index, {
        subscribe: false,
      })
    )
    .unwrap();
  if (!baseDate) {
    throw new Error(`No saved record at index ${index}`);
  }
  return baseDate;
}

export const ephemeridesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransits: builder.query<
      AspectWithPositions[],
      { index: number; transitDate: JsonDate }
    >({
      queryFn: async (
        { index, transitDate },
        api,
        _extraOptions,
        baseQuery
      ) => {
        let baseDate: SavedDate;
        try {
          baseDate = await fetchBaseDate(index, api);
        } catch (error) {
          return { error: toFetchError(error) };
        }
        const { lat, lon } = baseDate;
        const result = await baseQuery({
          url: "/transits",
          method: "POST",
          body: {
            baseDate,
            transitDate,
            baseDateCoordinates: lat && lon ? { lat, lon } : undefined,
          },
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: filterAspects(result.data as AspectWithPositions[]) };
      },
      providesTags: (_result, _error, { index }) => [savedDateTag(index)],
      keepUnusedDataFor: TRANSITS_CACHE_SECONDS,
    }),

    getNatalPosition: builder.query<CelestialObjectPosition[], number>({
      queryFn: async (index, api, _extraOptions, baseQuery) => {
        let baseDate: SavedDate;
        try {
          baseDate = await fetchBaseDate(index, api);
        } catch (error) {
          return { error: toFetchError(error) };
        }
        const result = await baseQuery({
          url: "/position",
          method: "POST",
          body: baseDate,
        });
        return result.error
          ? { error: result.error }
          : { data: result.data as CelestialObjectPosition[] };
      },
      providesTags: (_result, _error, index) => [savedDateTag(index)],
    }),

    // Cached, not invalidatable
    getPosition: builder.query<CelestialObjectPosition[], JsonDate>({
      query: (jsonDate) => ({
        url: "/position",
        method: "POST",
        body: jsonDate,
      }),
    }),

    // Cached, not invalidatable
    getStations: builder.query<BodyStations[], JsonDate>({
      query: (jsonDate) => ({
        url: "/stations",
        method: "POST",
        body: jsonDate,
      }),
    }),
  }),
});

export const {
  useGetTransitsQuery,
  useGetNatalPositionQuery,
  useGetPositionQuery,
  useGetStationsQuery,
} = ephemeridesSlice;

import assert from "node:assert/strict";
import test from "node:test";

import { fetchPlaceReviews } from "./google-places";

test("maps Places API reviews and requests the required review fields", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://places.googleapis.com/v1/places:searchText");
    assert.equal(init?.method, "POST");
    assert.match(String(new Headers(init?.headers).get("X-Goog-FieldMask")), /places\.reviews/);

    const body = JSON.parse(String(init?.body));
    assert.equal(body.includePureServiceAreaBusinesses, true);
    assert.equal(body.languageCode, "en");
    assert.equal(body.regionCode, "US");

    return Response.json({
      places: [{
        displayName: { text: "KOM USA - Construction, Maintenance & Repairs" },
        rating: 4.7,
        userRatingCount: 61,
        googleMapsUri: "https://maps.google.com/place/kom-usa",
        reviews: [
          {
            text: { text: "Excellent work and communication." },
            rating: 5,
            relativePublishTimeDescription: "a month ago",
            googleMapsUri: "https://maps.google.com/review/1",
            authorAttribution: {
              displayName: "Alex R.",
              uri: "https://maps.google.com/contrib/alex",
              photoUri: "https://example.com/alex.jpg",
            },
          },
          { text: { text: "   " }, rating: 5 },
        ],
      }],
    });
  };

  const result = await fetchPlaceReviews("server-key");
  assert.deepEqual(result, {
    rating: "4.7",
    count: 61,
    placeUri: "https://maps.google.com/place/kom-usa",
    reviews: [{
      authorName: "Alex R.",
      authorUri: "https://maps.google.com/contrib/alex",
      authorPhotoUri: "https://example.com/alex.jpg",
      text: "Excellent work and communication.",
      rating: 5,
      relativePublishTimeDescription: "a month ago",
      publishTime: undefined,
      googleMapsUri: "https://maps.google.com/review/1",
    }],
  });
});

test("uses Place Details when a stable place ID is configured", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.pathname, "/v1/places/ChIJ-test-place");
    assert.equal(url.searchParams.get("languageCode"), "en");
    assert.equal(init?.method, undefined);
    assert.match(String(new Headers(init?.headers).get("X-Goog-FieldMask")), /reviews/);

    return Response.json({
      displayName: { text: "KOM USA" },
      rating: 4.8,
      userRatingCount: 62,
      googleMapsUri: "https://maps.google.com/place/kom-usa",
      reviews: [],
    });
  };

  const result = await fetchPlaceReviews("server-key", "ChIJ-test-place");
  assert.equal(result?.count, 62);
});

test("rejects a text-search match for a different business", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => Response.json({
    places: [{
      displayName: { text: "Komodo Construction" },
      rating: 5,
      userRatingCount: 100,
      googleMapsUri: "https://maps.google.com/place/wrong",
    }],
  });

  assert.equal(await fetchPlaceReviews("server-key"), null);
});

import { describe, test, expect, beforeAll } from 'vitest';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// setup
// create typed definitions, defines an objects shape

// This interface describes the structure of each "place" object
// returned by the Zippopotam.us API.
interface Place {
  'place name': string;
  longitude: string;
  state: string;
  'state abbreviation': string;
  latitude: string;
}

// This interface describes the full API response for a postcode.
// It ensures TypeScript knows exactly what fields to expect.
interface PostcodeResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

// Base URL for the API we are testing.
const BASE_URL = 'http://api.zippopotam.us';

// Typed variable that will hold our Axios instance.
let apiClient: AxiosInstance;

// beforeAll runs once before all tests in this file.
// We use it to create a configured Axios client.
beforeAll(() => {
  apiClient = axios.create({
    baseURL: BASE_URL,   // All requests will use this base URL
    timeout: 5000,       // Fail if the request takes longer than 5 seconds
    validateStatus: () => true // Allow Vitest to inspect non-200 responses
  });
});

// Helper function to validate the structure of the API response.
// This ensures the API returns the expected fields.
function validatePostcodeStructure(data: PostcodeResponse): void {
  expect(data).toHaveProperty('post code');
  expect(data).toHaveProperty('country');
  expect(data).toHaveProperty('country abbreviation');
  expect(data).toHaveProperty('places');
  expect(Array.isArray(data.places)).toBe(true);
  expect(data.places.length).toBeGreaterThan(0);
}

// A typed helper function to make GET requests.
// It returns an AxiosResponse with the expected PostcodeResponse type.
async function makeRequest(endpoint: string): Promise<AxiosResponse<PostcodeResponse>> {
  const response = await apiClient.get<PostcodeResponse>(endpoint);
   return response;
}
 
  test('API response has correct structure', async () => {
  const response = await makeRequest('/us/90210');
  
  expect(response.status).toBe(200);
  validatePostcodeStructure(response.data);
});




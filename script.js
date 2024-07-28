import http from 'k6/http';
import { check } from 'k6';

/**
 * Test configuration
 */
export const options = {
  tags: {
      test: 'crocodiles',
      // test_run_id: `Customers-Service-Load-${__ENV.K6_ENV}`,
  },
  thresholds: {
      // crocodiles thresholds
      'http_req_failed{test_type:test}': ['rate<0.01'], // http errors should be less than 1%, availability
      'http_req_duration{test_type:test}': ['p(95)<200'], // 95% of requests should be below 200ms, latency
  },
  scenarios: {
      // Load testing using K6 constant-rate scenario
      crocodiles_constant: {
          executor: 'constant-arrival-rate',
          rate: 10000, // number of iterations per time unit
          timeUnit: '1m', // iterations will be per minute
          duration: '1m', // total duration that the test will run for
          preAllocatedVUs: 2, // the size of the VU (i.e. worker) pool for this scenario
          maxVUs: 50, // if the preAllocatedVUs are not enough, we can initialize more
          tags: { test_type: 'crocodiles' }, // different extra metric tags for this scenario
          exec: 'crocodiles',// Test scenario function to call
      }
  }
};


/**
 * Add crocodiles test case
 */
export function crocodiles(data) {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');

  check(response, { 'status is 200': (r) => r.status === 200 });
  if (response.status != 200) {
      console.log(`operation: crocodiles, url: ${response.url}, Status:${response.status}`);
  }
}
import request from 'supertest';
import App from '../app';
import LogRoute from '../routes/log.route';
import LogModel from '../models/log.model';
import UrlModel from '../models/url.model';

// Mocking the models to avoid actual database calls
jest.mock('../models/log.model');
jest.mock('../models/url.model');

// Test suite for the LogController
describe('LogController', () => {
  let app: App;

  // Setting up the App instance with LogRoute
  beforeAll(() => {
    app = new App([new LogRoute()]);
  });

  // Clearing all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test suite for the GET /log/:short_id endpoint
  describe('GET /log/:short_id', () => {
    // Test case: it should get URL analytics
    it('should get URL analytics', async () => {
      // Mock data for URL details
      const urlDetailsMock = {
        _id: 'mock-url-id',
        original_url: 'https://example.com',
        short_id: 'mockShortId',
        expiration_date: null,
        starting_date: new Date(),
        title: 'Mock Title',
        description: 'Mock Description',
        status: 'active',
      };

      // Mock data for access logs
      const accessLogsMock = [
        {
          _id: 'mock-log-id',
          url_id: 'mock-url-id',
          ip_address: '127.0.0.1',
          visit_time: new Date(),
          referrer: 'http://referrer.com',
        },
        // Add more mock log entries as needed
      ];

      // Mocking the URLModel.findOne and LogModel.find methods
      (UrlModel.findOne as jest.Mock).mockResolvedValueOnce(urlDetailsMock);
      (LogModel.find as jest.Mock).mockResolvedValueOnce(accessLogsMock);

      // Making a request to the endpoint
      const response = await request(app.getServer())
        .get('/log/mockShortId');

      // Assertions for the response
      expect(response.status).toBe(200);
      // Add more assertions based on your expected response format or data
    });

    // Test case: it should return 404 for non-existing short_id
    it('should return 404 for non-existing short_id', async () => {
      // Mocking that URLModel.findOne returns null for non-existing short_id
      (UrlModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      // Making a request to the endpoint with a non-existing short_id
      const response = await request(app.getServer())
        .get('/log/nonExistingShortId');

      // Assertions for the response
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });
  });

  // Test suite for the GET /log/visitors/:short_id endpoint
  describe('GET /log/visitors/:short_id', () => {
    // Test case: it should get all visitors information
    it('should get all visitors information', async () => {
      // Mock data for URL details
      const urlDetailsMock = {
        _id: 'mock-url-id',
        original_url: 'https://example.com',
        short_id: 'mockShortId',
        expiration_date: null,
        starting_date: new Date(),
        title: 'Mock Title',
        description: 'Mock Description',
        status: 'active',
      };

      // Mock data for access logs
      const accessLogsMock = [
        {
          _id: 'mock-log-id',
          url_id: 'mock-url-id',
          ip_address: '127.0.0.1',
          visit_time: new Date(),
          referrer: 'http://referrer.com',
        },
        // Add more mock log entries as needed
      ];

      // Mocking the URLModel.findOne and LogModel.find methods
      (UrlModel.findOne as jest.Mock).mockResolvedValueOnce(urlDetailsMock);
      (LogModel.find as jest.Mock).mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(accessLogsMock),
      });

      // Making a request to the endpoint
      const response = await request(app.getServer())
        .get('/log/visitors/mockShortId');

      // Assertions for the response
      expect(response.status).toBe(200);
      // Add more assertions based on your expected response format or data
    });

    // Test case: it should return 404 for non-existing short_id
    it('should return 404 for non-existing short_id', async () => {
      // Mocking that URLModel.findOne returns null for non-existing short_id
      (UrlModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      // Making a request to the endpoint with a non-existing short_id
      const response = await request(app.getServer())
        .get('/log/visitors/nonExistingShortId');

      // Assertions for the response
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });
  });

  // Cleanup or close any resources if needed
  afterAll(() => {});
});

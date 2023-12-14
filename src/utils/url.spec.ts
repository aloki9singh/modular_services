import request from 'supertest';
import App from '../app';
import UrlRoute from '../routes/url.route';
import UrlModel from '../models/url.model';

describe('URL Routes', () => {
  let app: App;

  beforeAll(() => {
    app = new App([new UrlRoute()]);
  });

  // Test case for creating short URLs
  describe('POST /short', () => {
    it('should create a short URL', async () => {
      const response = await request(app.getServer())
        .post('/short')
        .send({
          original_url: 'https://example.com',
          expiration_date: '2023-12-31',
          title: 'Test URL',
          description: 'Test URL Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('short_url');
    },10000);

    it('should return 400 for invalid URL format', async () => {
      const response = await request(app.getServer())
        .post('/short')
        .send({
          original_url: 'invalid-url',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid URL format');
    });

  });

  // Test case for getting short URLs by app_id
  describe('GET /appid', () => {
    it('should get short URLs by app_id', async () => {
      // Assuming you have a valid app_id to test with
      const response = await request(app.getServer())
        .get('/appid')
        .query({ page: 1 });

      expect(response.status).toBe(200);
      // Add more assertions based on your expected response
    });

    // Add more test cases for different scenarios
  });

  // Test case for deleting short URL by shortId
  describe('DELETE /delete/:shortId', () => {
    let createdUrlId;
    beforeEach(async () => {
      // Clear the database or perform any setup before each test
      await UrlModel.deleteMany({});
  
      // Create a mock document for testing deletion
      const mockData = {
        original_url: 'http://example.com',
        short_id: 'validShortId',
        short_url: 'http://your-short-url.com/validShortId',
        expiration_date: null,
        starting_date: new Date(),
        app_id: null,
        title: 'Mock Title',
        description: 'Mock Description',
        status: 'active',
        stats: { total_visitor: 0 },
      };
  
      const createdUrl = await UrlModel.create(mockData);
      createdUrlId = createdUrl._id;
    });
  
    it('should delete a short URL', async () => {
      // Assuming you have a valid shortId to test with
      const response = await request(app.getServer())
        .delete('/delete/validShortId');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 404 for non-existing shortId', async () => {
      const response = await request(app.getServer())
        .delete('/delete/nonExistingShortId');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'URL not found');
    });

  });

  describe('PUT /update/:shortId', () => {
    let createdUrlId;
    beforeEach(async () => {
      // Clear the database or perform any setup before each test
      await UrlModel.deleteMany({});
  
      // Create a mock document for testing updates
      const mockData = {
        original_url: 'http://example.com',
        short_id: 'validShortId',
        short_url: 'http://your-short-url.com/validShortId',
        expiration_date: null,
        starting_date: new Date(),
        app_id: null,
        title: 'Mock Title',
        description: 'Mock Description',
        status: 'active',
        stats: { total_visitor: 0 },
      };
  
      const createdUrl = await UrlModel.create(mockData);
      createdUrlId = createdUrl.short_id;
    });
  
    it('should update a short URL', async () => {
      const updatedData = {
        expiration_date: '2023-12-31',
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const response = await request(app.getServer())
        .put(`/update/${createdUrlId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      
    });

    it('should return 404 for non-existing shortId', async () => {
      const response = await request(app.getServer())
        .put('/update/nonExistingShortId')
        .send({ expiration_date: '2023-12-31' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });

});

describe('GET /:shortId', () => {
    let createdUrlId;
    beforeEach(async () => {
      // Clear the database or perform any setup before each test
      await UrlModel.deleteMany({});
  
      // Create a mock document for testing redirection
      const mockData = {
        original_url: 'http://example.com',
        short_id: 'validShortId',
        short_url: 'http://your-short-url.com/validShortId',
        expiration_date: null,
        starting_date: new Date(),
        app_id: null,
        title: 'Mock Title',
        description: 'Mock Description',
        status: 'active',
        stats: { total_visitor: 0 },
      };
  
      const createdUrl = await UrlModel.create(mockData);
      createdUrlId = createdUrl.short_id;
    });
  
    it('should redirect to the original URL', async () => {
      const response = await request(app.getServer())
        .get(`/${createdUrlId}`);

      expect(response.status).toBe(302); // Assuming a redirect status code
      expect(response.headers.location).toBe('http://example.com');
    });

    it('should return 404 for non-existing shortId', async () => {
      const response = await request(app.getServer())
        .get('/nonExistingShortId');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });

    
});


  afterAll(() => {
    // Cleanup or close any resources if needed
  });
});


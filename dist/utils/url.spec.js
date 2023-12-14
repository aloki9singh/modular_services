"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = _interop_require_default(require("supertest"));
const _app = _interop_require_default(require("../app"));
const _urlroute = _interop_require_default(require("../routes/url.route"));
const _urlmodel = _interop_require_default(require("../models/url.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('URL Routes', ()=>{
    let app;
    beforeAll(()=>{
        app = new _app.default([
            new _urlroute.default()
        ]);
    });
    describe('POST /short', ()=>{
        it('should create a short URL', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).post('/short').send({
                original_url: 'https://example.com',
                expiration_date: '2023-12-31',
                title: 'Test URL',
                description: 'Test URL Description'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('short_url');
        }, 10000);
        it('should return 400 for invalid URL format', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).post('/short').send({
                original_url: 'invalid-url'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid URL format');
        });
    });
    describe('GET /appid', ()=>{
        it('should get short URLs by app_id', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).get('/appid').query({
                page: 1
            });
            expect(response.status).toBe(200);
        });
    });
    describe('DELETE /delete/:shortId', ()=>{
        let createdUrlId;
        beforeEach(async ()=>{
            await _urlmodel.default.deleteMany({});
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
                stats: {
                    total_visitor: 0
                }
            };
            const createdUrl = await _urlmodel.default.create(mockData);
            createdUrlId = createdUrl._id;
        });
        it('should delete a short URL', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).delete('/delete/validShortId');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
        });
        it('should return 404 for non-existing shortId', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).delete('/delete/nonExistingShortId');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'URL not found');
        });
    });
    describe('PUT /update/:shortId', ()=>{
        let createdUrlId;
        beforeEach(async ()=>{
            await _urlmodel.default.deleteMany({});
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
                stats: {
                    total_visitor: 0
                }
            };
            const createdUrl = await _urlmodel.default.create(mockData);
            createdUrlId = createdUrl.short_id;
        });
        it('should update a short URL', async ()=>{
            const updatedData = {
                expiration_date: '2023-12-31',
                title: 'Updated Title',
                description: 'Updated Description'
            };
            const response = await (0, _supertest.default)(app.getServer()).put(`/update/${createdUrlId}`).send(updatedData);
            expect(response.status).toBe(200);
        });
        it('should return 404 for non-existing shortId', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).put('/update/nonExistingShortId').send({
                expiration_date: '2023-12-31'
            });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'URL not found');
        });
    });
    describe('GET /:shortId', ()=>{
        let createdUrlId;
        beforeEach(async ()=>{
            await _urlmodel.default.deleteMany({});
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
                stats: {
                    total_visitor: 0
                }
            };
            const createdUrl = await _urlmodel.default.create(mockData);
            createdUrlId = createdUrl.short_id;
        });
        it('should redirect to the original URL', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).get(`/${createdUrlId}`);
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe('http://example.com');
        });
        it('should return 404 for non-existing shortId', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).get('/nonExistingShortId');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'URL not found');
        });
    });
    afterAll(()=>{});
});

//# sourceMappingURL=url.spec.js.map
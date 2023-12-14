"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = _interop_require_default(require("supertest"));
const _app = _interop_require_default(require("../app"));
const _logroute = _interop_require_default(require("../routes/log.route"));
const _logmodel = _interop_require_default(require("../models/log.model"));
const _urlmodel = _interop_require_default(require("../models/url.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
jest.mock('../models/log.model');
jest.mock('../models/url.model');
describe('LogController', ()=>{
    let app;
    beforeAll(()=>{
        app = new _app.default([
            new _logroute.default()
        ]);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('GET /log/:short_id', ()=>{
        it('should get URL analytics', async ()=>{
            const urlDetailsMock = {
                _id: 'mock-url-id',
                original_url: 'https://example.com',
                short_id: 'mockShortId',
                expiration_date: null,
                starting_date: new Date(),
                title: 'Mock Title',
                description: 'Mock Description',
                status: 'active'
            };
            const accessLogsMock = [
                {
                    _id: 'mock-log-id',
                    url_id: 'mock-url-id',
                    ip_address: '127.0.0.1',
                    visit_time: new Date(),
                    referrer: 'http://referrer.com'
                }
            ];
            _urlmodel.default.findOne.mockResolvedValueOnce(urlDetailsMock);
            _logmodel.default.find.mockResolvedValueOnce(accessLogsMock);
            const response = await (0, _supertest.default)(app.getServer()).get('/log/mockShortId');
            expect(response.status).toBe(200);
        });
        it('should return 404 for non-existing short_id', async ()=>{
            _urlmodel.default.findOne.mockResolvedValueOnce(null);
            const response = await (0, _supertest.default)(app.getServer()).get('/log/nonExistingShortId');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'URL not found');
        });
    });
    describe('GET /log/visitors/:short_id', ()=>{
        it('should get all visitors information', async ()=>{
            const urlDetailsMock = {
                _id: 'mock-url-id',
                original_url: 'https://example.com',
                short_id: 'mockShortId',
                expiration_date: null,
                starting_date: new Date(),
                title: 'Mock Title',
                description: 'Mock Description',
                status: 'active'
            };
            const accessLogsMock = [
                {
                    _id: 'mock-log-id',
                    url_id: 'mock-url-id',
                    ip_address: '127.0.0.1',
                    visit_time: new Date(),
                    referrer: 'http://referrer.com'
                }
            ];
            _urlmodel.default.findOne.mockResolvedValueOnce(urlDetailsMock);
            _logmodel.default.find.mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValueOnce(accessLogsMock)
            });
            const response = await (0, _supertest.default)(app.getServer()).get('/log/visitors/mockShortId');
            expect(response.status).toBe(200);
        });
        it('should return 404 for non-existing short_id', async ()=>{
            _urlmodel.default.findOne.mockResolvedValueOnce(null);
            const response = await (0, _supertest.default)(app.getServer()).get('/log/visitors/nonExistingShortId');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'URL not found');
        });
    });
    afterAll(()=>{});
});

//# sourceMappingURL=log.spec.js.map
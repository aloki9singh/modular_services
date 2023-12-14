// Class definition for ApiFeatures
class ApiFeatures {
	// Properties to store query and query string
	queryStr: string;
	query: string;

	// Constructor to initialize properties with provided values
	constructor(query: string, queryStr: string) {
		this.query = query;
		this.queryStr = queryStr;
	}
}

// Export the ApiFeatures class
module.exports = ApiFeatures;

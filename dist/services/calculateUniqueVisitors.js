"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "calculateUniqueVisitors", {
    enumerable: true,
    get: function() {
        return calculateUniqueVisitors;
    }
});
function calculateUniqueVisitors(accessLogs) {
    const uniqueIPs = new Set();
    accessLogs.forEach((log)=>{
        uniqueIPs.add(log.ip_address);
    });
    return uniqueIPs.size;
}

//# sourceMappingURL=calculateUniqueVisitors.js.map
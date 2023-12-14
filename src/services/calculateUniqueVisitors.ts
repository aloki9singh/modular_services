
// function to calculate the unique visitors using Set
export function calculateUniqueVisitors(accessLogs: Array<any>): number {
    const uniqueIPs = new Set();
  
    accessLogs.forEach((log) => {
      uniqueIPs.add(log.ip_address);
    });
  
    return uniqueIPs.size;
  }
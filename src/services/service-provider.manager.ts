
import TwilioService from "./twilio.service";
import TwoFactorService from "./2factor.service";
import Free2SMSService from "./free2sms.service";

class ServiceProviderManager {
  private static providers: ServiceProvider[] = [
    // {
    //     name: "Free2SMS",
    //     instance: new Free2SMSService(),
    //   },
    //   {
    //     name: "2FACTOR",
    //     instance: new TwoFactorService(),
    //   },
      {
        name: "Twilio",
        instance: new TwilioService(),
      },
    
   
    
  ];

  private static currentProviderIndex: number = 0;

  static getProviders(): ServiceProvider[] {
    return this.providers;
  }

  static async switchProvider(): Promise<ServiceProvider> {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    return this.providers[this.currentProviderIndex];
  }
}

interface ServiceProvider {
  name: string;
  instance: any; // Use the actual service class type here
}

export default ServiceProviderManager;

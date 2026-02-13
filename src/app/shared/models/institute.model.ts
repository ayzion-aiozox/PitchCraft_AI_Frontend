export interface Institute {
    instituteId: number;    
    instituteName: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedBy: string;
    lastUpdatedDate: string;
    instituteCode: string;
    instituteBankAccountNumber: string | null;
    instituteContactNumber: string | null;
    instituteEmailAddress: string | null;
    image: string;
    isActive: number;
    counsellingFlag: number;
    defaultProductId: number;
    orderModel: string | null;
  }
  
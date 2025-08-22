/**
 * Types and interfaces for the Add Car Listing form
 * 
 * This file contains all the TypeScript type definitions used throughout
 * the car listing form components and hooks.
 */

export interface CarData {
  [key: string]: string;
}

export interface VehicleSpecs {
  sug_degem: string;
  ramat_gimur: string;
  shnat_yitzur: string;
  degem_nm: string;
  [key: string]: string;
}

export interface OwnershipRecord {
  _id: number;
  mispar_rechev: number;
  baalut_dt: number;
  baalut: string;
  rank: number;
}

export interface CarPerformanceData {
  performance: {
    acceleration: string;
    top_speed: string;
    horsepower: string;
    torque: string;
    fuel_consumption_city: string;
    fuel_consumption_highway: string;
  };
  tuning: {
    tuning_potential: string;
    tuning_notes: string;
    common_upgrades: string[];
  };
  handling: {
    handling_rating: string;
    suspension_type: string;
    driving_characteristics: string;
  };
  reliability: {
    reliability_rating: string;
    common_issues: string[];
    maintenance_cost: string;
  };
}

export interface ManufacturerData {
  submodels: any[];
  manufacturerImage: string;
  year: {
    from: number;
    to: number;
    step: number;
  };
}

export interface ManufacturersData {
  [key: string]: ManufacturerData;
}

export interface FormData {
  // Basic car information
  title: string;
  makeModel: string;
  year: string;
  plateNumber: string;
  mileage: string;
  color: string;
  engineType: string;
  transmission: string;
  currentCondition: string;
  knownProblems: string;
  description: string;
  pros: string;
  cons: string;
  tradeIn: string;
  askingPrice: string;
  
  // Contact information
  name: string;
  email: string;
  phone: string;
  
  // Images
  images: File[];
  
  // Manufacturer information
  manufacturerName: string;
  commercialNickname: string;
  yearOfProduction: string;
  fuelType: string;
  
  // Car data from APIs
  car_data: any;
  
  // Basic Ad Info (מאפייני מודעה)
  hasImage: boolean;
  hasPrice: boolean;
  fromAgency: boolean;
  availableInTradeIn: boolean;
  availableInFinancing: boolean;
  priceDropped: boolean;
  foreclosureAd: boolean;
  
  // Vehicle Specifications
  price: string;
  kilometers: string;
  engineCapacity: string;
  handOwnershipCount: string;
  region: string;
  submodel: string;
  numberOfSeats: string;
  
  // Engine Types (סוגי מנוע)
  engineTypes: string[];
  
  // Gearbox (תיבת הילוכים)
  gearbox: string;
  
  // Ownership Type (בעלות)
  ownershipType: string;
  
  // Color (צבע)
  colors: string[];
  
  // Additional Features (מאפיינים נוספים)
  longTestValid: boolean;
  adaptedForDisabled: boolean;
  
  // Free Search (חיפוש חופשי)
  freeSearch: string;
  bodyType: string;
  seatingCapacity: string;
  abs: boolean;
  airbags: boolean;
  powerWindows: boolean;
  driveType: string;
  totalWeight: string;
  height: string;
  fuelTankCapacity: string;
  co2Emission: string;
  greenIndex: string;
  commercialName: string;
  rank: string;

}

export interface ValidationErrors {
  [key: string]: string;
}

export type InputMethod = 'plate' | 'manual';

export type ProcessingStep = 
  | 'validating_form'
  | 'uploading_image'
  | 'preparing_data'
  | 'submitting_listing'
  | '';

export interface PopupModal {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
}

export interface CarDataFetchingConfig {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCarData: (data: CarData | null) => void;
  setYad2ModelInfo: (info: any) => void;
  setYad2PriceInfo: (info: any) => void;
  setGovCarInfo: (info: any) => void;
  setOwnershipHistory: (history: OwnershipRecord[]) => void;
  setVehicleSpecs: (specs: VehicleSpecs | null) => void;
  setPerformanceData: (data: CarPerformanceData | null) => void;
  setCarImage: (image: string | null) => void;
  manufacturersData: ManufacturersData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  setSelectedManufacturer: (manufacturer: string) => void;
  setSelectedModel: (model: string) => void;
  setSubModelID: (id: string) => void;
  setAvailableModels: (models: any[]) => void;
  setAvailableYears: (years: number[]) => void;
  setAvailableSubmodels: (submodels: any[]) => void;
  setSelectedSubmodel: (submodel: string) => void;
  formData: FormData;
  selectedManufacturer: string;
  selectedModel: string;
  selectedYear: string;
  subModelID: string;
  t: (key: string, values?: any) => string;
}

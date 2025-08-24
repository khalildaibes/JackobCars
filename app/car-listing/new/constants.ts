/**
 * Constants and configuration for the Add Car Listing form
 * 
 * This file contains all the constant values, API endpoints, validation rules,
 * and other configuration data used throughout the application.
 */

import { 
  Car, Settings, Shield, Tag, DollarSign, User, Camera 
} from "lucide-react";

// API Endpoints
export const API_ENDPOINTS = {
  CAR_DATA: "/api/gov/car-data?licensePlate=",
  YAD2_MODEL_MASTER: "api/model-master?licensePlate=",
  YAD2_PRICE: "/api/yad2/price",
  YAD2_SUBMODELS: "/api/yad2/submodels",
  OWNERSHIP_HISTORY: "/api/gov/ownership-history?licensePlate=",
  VEHICLE_SPECS: "/api/gov/vehicle-specs?licensePlate=",
  UPLOAD_IMAGE: "/api/upload/image",
  ADD_LISTING: "/api/addListing",
  CREATE_DESCRIPTION: "/api/createDescription",
} as const;

// Default Values
export const DEFAULT_VALUES = {
  title: '',
  makeModel: '',
  year: '',
  plateNumber: '',
  mileage: '',
  color: '',
  engineType: '',
  transmission: '',
  currentCondition: '',
  knownProblems: '',
  description: '',
  pros: '',
  cons: '',
  tradeIn: '',
  askingPrice: '',
  name: '',
  email: '',
  phone: '',
  images: [] as File[],
  video: null,
  manufacturerName: '',
  commercialNickname: '',
  yearOfProduction: '',
  fuelType: '',
  manufacturerNameHebrew: '',
  commercialNicknameHebrew: '',
  car_data: {},
  hasImage: false,
  hasPrice: false,
  fromAgency: false,
  availableInTradeIn: false,
  availableInFinancing: false,
  priceDropped: false,
  foreclosureAd: false,
  price: '',
  kilometers: '',
  engineCapacity: '',
  handOwnershipCount: '',
  region: '',
  submodel: '',
  numberOfSeats: '',
  engineTypes: [],
  gearbox: '',
  ownershipType: '',
  colors: [],
  longTestValid: false,
  adaptedForDisabled: false,
  freeSearch: '',
  bodyType: '',
  seatingCapacity: '',
  abs: false,
  airbags: false,
  powerWindows: false,
  driveType: '',
  totalWeight: '',
  height: '',
  fuelTankCapacity: '',
  co2Emission: '',
  greenIndex: '',
  commercialName: '',
  rank: ''
};

// Validation Rules
export const VALIDATION_RULES = {
  PHONE_REGEX: /^(\+972-?|0)?5[0-9]-?[0-9]{7}$|^(\+972-?|0)?[2-4][0-9]-?[0-9]{7}$/,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  MAX_IMAGES: 10,
  MAX_VIDEO_DURATION: 15, // Maximum video duration in seconds
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100,
} as const;

// Step Configuration
export const STEP_CONFIGURATION = [
  {
    id: 0,
    title: 'basic_information',
    description: 'Enter basic car details',
    icon: Car,
    required: true
  },
  {
    id: 1,
    title: 'condition',
    description: 'Describe car condition',
    icon: Shield,
    required: false
  },
  {
    id: 2,
    title: 'trade_in_option',
    description: 'Trade-in preferences',
    icon: Tag,
    required: false
  },
  {
    id: 3,
    title: 'price',
    description: 'Set asking price',
    icon: DollarSign,
    required: true
  },
  {
    id: 4,
    title: 'contact_info',
    description: 'Contact details',
    icon: User,
    required: true
  },
  {
    id: 5,
    title: 'upload_images',
    description: 'Add car photos',
    icon: Camera,
    required: true
  }
] as const;

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  // Page entrance animations
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  // Step transitions
  stepTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  
  // Form field animations
  fieldEnter: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  // Button hover effects
  buttonHover: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  
  // Loading animations
  loadingSpin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },
  
  // Success/Error animations
  popupEnter: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
} as const;

// Car Condition Options
export const CAR_CONDITIONS = ['excellent', 'good', 'fair', 'poor'] as const;

// Engine Type Options
export const ENGINE_TYPES = [
  { value: 'petrol', label: 'בנזין' },
  { value: 'diesel', label: 'דיזל' },
  { value: 'lpg', label: 'גפ"מ' },
  { value: 'hybrid_petrol', label: 'היברידי בנזין' },
  { value: 'hybrid_diesel', label: 'היברידי דיזל' },
  { value: 'plugin_petrol', label: 'פלאג-אין בנזין' },
  { value: 'plugin_diesel', label: 'פלאג-אין דיזל' },
  { value: 'electric_petrol', label: 'חשמלי בנזין' },
  { value: 'electric', label: 'חשמלי' }
] as const;

// Transmission Options
export const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'automatic' },
  { value: 'manual', label: 'manual' }
] as const;

// Color Options
export const COLOR_OPTIONS = [
  { value: 'red', label: 'אדום' },
  { value: 'gray', label: 'אפור' },
  { value: 'pink', label: 'ורוד' },
  { value: 'brown', label: 'חום' },
  { value: 'green', label: 'ירוק' },
  { value: 'blue', label: 'כחול' },
  { value: 'orange', label: 'כתום' },
  { value: 'white', label: 'לבן' },
  { value: 'purple', label: 'סגול' },
  { value: 'yellow', label: 'צהוב' },
  { value: 'black', label: 'שחור' }
] as const;

// Region Options
export const REGION_OPTIONS = [
  { value: 'north', label: 'North' },
  { value: 'center', label: 'Center' },
  { value: 'south', label: 'South' },
  { value: 'jerusalem', label: 'Jerusalem' },
  { value: 'haifa', label: 'Haifa' },
  { value: 'tel_aviv', label: 'Tel Aviv' }
] as const;

// Ownership Type Options
export const OWNERSHIP_TYPE_OPTIONS = [
  { value: 'private', label: 'פרטית' },
  { value: 'company', label: 'חברה' },
  { value: 'rental', label: 'השכרה' },
  { value: 'leasing', label: 'ליסינג' },
  { value: 'taxi', label: 'מונית' },
  { value: 'driving_school', label: 'לימוד נהיגה' },
  { value: 'personal_import', label: 'ייבוא אישי' },
  { value: 'parallel_import', label: 'ייבוא מקביל' },
  { value: 'government', label: 'ממשלתי' },
  { value: 'un', label: 'או"ם' },
  { value: 'rental_lease', label: 'השכרה / החכר' }
] as const;

// Seat Count Options
export const SEAT_COUNT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

// Default Store Configuration
export const DEFAULT_STORE_CONFIG = {
  STORE_ID: 18,
  PUBLISHER_ID: 1,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid Israeli phone number',
  MIN_IMAGES: 'At least one image is required',
  MAX_IMAGES: 'Maximum 10 images allowed',
  MAX_VIDEO_DURATION: 'Video must be 15 seconds or less',
  INVALID_VIDEO_FORMAT: 'Please upload a valid video file (MP4, MOV, AVI)',
  INVALID_PLATE: 'Please enter a valid license plate number',
  CAR_NOT_FOUND: 'Car not found in the system',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Your car listing has been submitted successfully!',
  IMAGE_UPLOADED: 'Image uploaded successfully',
  DESCRIPTION_GENERATED: 'AI description generated successfully',
} as const;

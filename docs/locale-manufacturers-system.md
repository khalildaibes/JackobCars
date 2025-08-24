# Locale-Based Manufacturers System

## Overview

This system provides a way to display manufacturer, model, and submodel data in the user's preferred language while maintaining Hebrew data for API calls. This ensures that:

1. **Display**: Users see data in their locale language (Arabic, English, or Hebrew)
2. **API Calls**: All backend requests use Hebrew data for consistency
3. **Data Integrity**: IDs and relationships are preserved across languages

## How It Works

### 1. Data Structure

The system uses three JSON files:
- `manufacturers_arabic.json` - Arabic translations
- `manufacturers_english.json` - English translations  
- `manufacturers_hebrew.json` - Hebrew data (source of truth)

### 2. Hook Usage

```typescript
import { useLocaleManufacturers } from './hooks/useLocaleManufacturers';

export default function MyComponent() {
  const { 
    displayData,    // Data in current locale for display
    hebrewData,     // Hebrew data for API calls
    currentLocale,  // Current locale (ar, en, he-IL)
    isLoading,      // Loading state
    error          // Error state
  } = useLocaleManufacturers();

  // Use displayData for UI rendering
  // Use hebrewData for API calls
}
```

### 3. Display vs API Data

#### Display (User Interface)
```typescript
// Shows in user's language
const manufacturerTitle = displayData[manufacturerId]?.submodels?.[0]?.manufacturer?.title;
// Arabic: "أودي", English: "Audi", Hebrew: "אאודי"
```

#### API Calls (Backend)
```typescript
// Always uses Hebrew for consistency
const hebrewTitle = hebrewData[manufacturerId]?.submodels?.[0]?.manufacturer?.title;
// Always: "אאודי"
```

### 4. Helper Functions

```typescript
import { 
  getHebrewTitleById, 
  getHebrewSubmodelTitleById,
  getHebrewModelTitleBySubmodelId 
} from './hooks/useLocaleManufacturers';

// Get Hebrew manufacturer title by ID
const hebrewTitle = getHebrewTitleById(displayData, hebrewData, manufacturerId);

// Get Hebrew submodel title
const hebrewSubmodelTitle = getHebrewSubmodelTitleById(
  displayData, 
  hebrewData, 
  manufacturerId, 
  submodelId
);
```

## Implementation Example

### Before (Old System)
```typescript
// Always used Hebrew data
const [manufacturersData, setManufacturersData] = useState<ManufacturersData>(manufacturers_hebrew);

// API calls used display data (could be wrong language)
const manufacturerName = model.manufacturer?.title || '';
```

### After (New System)
```typescript
// Uses locale-based data
const { displayData: manufacturersData, hebrewData } = useLocaleManufacturers();

// API calls use Hebrew data
const hebrewManufacturerTitle = hebrewData[manufacturerKey]?.submodels?.[0]?.manufacturer?.title || '';
```

## Benefits

1. **User Experience**: Users see data in their preferred language
2. **API Consistency**: Backend always receives Hebrew data
3. **Maintainability**: Clear separation between display and API data
4. **Scalability**: Easy to add new languages
5. **Data Integrity**: IDs and relationships preserved across languages

## Migration Guide

### 1. Replace Direct Imports
```typescript
// Old
import { manufacturers_hebrew } from '../../../data/manufacturers_multilingual';

// New
import { useLocaleManufacturers } from './hooks/useLocaleManufacturers';
```

### 2. Update State Management
```typescript
// Old
const [manufacturersData, setManufacturersData] = useState<ManufacturersData>(manufacturers_hebrew);

// New
const { displayData: manufacturersData, hebrewData } = useLocaleManufacturers();
```

### 3. Update API Calls
```typescript
// Old
manufacturerName: model.manufacturer?.title || ''

// New
const hebrewManufacturerTitle = hebrewData[manufacturerKey]?.submodels?.[0]?.manufacturer?.title || '';
manufacturerName: hebrewManufacturerTitle
```

### 4. Update Dependencies
```typescript
// Add hebrewData to dependency arrays
}, [..., manufacturersData, hebrewData, ...]);
```

## File Structure

```
app/car-listing/new/
├── hooks/
│   └── useLocaleManufacturers.ts    # New locale hook
├── hooks.ts                          # Updated with hebrewData
├── types.ts                          # Updated CarDataFetchingConfig
└── page.tsx                          # Updated to use new hook
```

## Supported Locales

- `ar` - Arabic (أودي)
- `en` - English (Audi)  
- `he-IL` / `he` - Hebrew (אאודי)

## Fallback Behavior

- If locale loading fails, falls back to Hebrew data
- If unsupported locale, defaults to English
- Always maintains Hebrew data for API calls

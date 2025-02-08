export const allCars = [
  {
    brand: "Toyota",
    model: "Camry",
    generation: "Camry VIII (XV70, facelift 2020)",
    modification: "XSE 2.5 (206 Hp) ECT-i",
    productionStartYear: 2020,
    productionEndYear: 2024,
    powertrainArchitecture: "Internal Combustion engine",
    bodyType: "Sedan",
    seats: 5,
    doors: 4,
    fuelConsumption: {
      urban: {
        value: 8.7,
        unit: "l/100 km",
        usMpg: 27.04,
        ukMpg: 32.47,
        kmPerL: 11.49
      },
      extraUrban: {
        value: 6.2,
        unit: "l/100 km",
        usMpg: 37.94,
        ukMpg: 45.56,
        kmPerL: 16.13
      },
      combined: {
        value: 7.6,
        unit: "l/100 km",
        usMpg: 30.95,
        ukMpg: 37.17,
        kmPerL: 13.16
      }
    },
    fuelType: "Petrol (Gasoline)",
    emissionStandard: "SULEV",
    weightToPowerRatio: {
      kgPerHp: 7.5,
      hpPerTonne: 132.6
    },
    weightToTorqueRatio: {
      kgPerNm: 6.2,
      nmPerTonne: 162.2
    },
    engine: {
      power: {
        hp: 206,
        rpm: 6600
      },
      powerPerLitre: 82.8,
      torque: {
        nm: 252,
        rpm: 5000,
        lbFt: 185.87
      },
      layout: "Front, Transverse",
      modelCode: "A25A-FKS",
      displacement: {
        value: 2487,
        unit: "cm3"
      },
      cylinders: 4,
      configuration: "Inline",
      cylinderBore: {
        value: 87.5,
        unit: "mm"
      },
      pistonStroke: {
        value: 103.4,
        unit: "mm"
      },
      compressionRatio: "13:1",
      valvesPerCylinder: 4,
      fuelInjection: "Direct injection and Multi-port manifold injection",
      aspiration: "Naturally aspirated engine",
      valvetrain: "DOHC, VVT-i, VVT-iE",
      oilCapacity: {
        value: 4.5,
        unit: "l"
      },
      coolantCapacity: {
        value: 6.9,
        unit: "l"
      },
      startStopSystem: true
    },
    spaceVolumeAndWeights: {
      kerbWeight: {
        value: 1554,
        unit: "kg"
      },
      trunkSpace: {
        value: 428,
        unit: "l"
      },
      fuelTankCapacity: {
        value: 60,
        unit: "l"
      }
    },
    dimensions: {
      length: {
        value: 4895,
        unit: "mm"
      },
      width: {
        value: 1840,
        unit: "mm"
      },
      height: {
        value: 1445,
        unit: "mm"
      },
      wheelbase: {
        value: 2825,
        unit: "mm"
      },
      frontTrack: {
        value: 1580,
        unit: "mm"
      },
      rearTrack: {
        value: 1590,
        unit: "mm"
      },
      rideHeight: {
        value: 145,
        unit: "mm"
      },
      minTurningCircle: {
        value: 11.6,
        unit: "m"
      }
    },
    drivetrainBrakesAndSuspension: {
      drivetrainArchitecture: "The Internal combustion engine (ICE) drives the front wheels of the vehicle.",
      driveWheel: "Front wheel drive",
      gears: 8,
      gearbox: "Automatic transmission ECT-i",
      frontSuspension: "Independent, type McPherson with coil spring and anti-roll bar",
      rearSuspension: "Independent multi-link spring suspension with stabilizer",
      frontBrakes: "Ventilated discs, 305 mm",
      rearBrakes: "Disc, 281 mm",
      assistingSystems: ["ABS (Anti-lock braking system)"],
      steeringType: "Steering rack and pinion",
      powerSteering: "Electric Steering",
      tiresSize: "235/40 R19",
      wheelRimsSize: "8J x 19"
    }
  },  
  {
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    powertrainArchitecture: "Electric",
    bodyType: "Sedan",
    seats: 5,
    doors: 4,
    performanceSpecs: {
      acceleration: "3.1 seconds (0-60 mph)",
      topSpeed: "162 mph",
      horsepower: "283 hp"
    },
    battery: {
      capacity: "82 kWh",
      range: "358 miles"
    },
    charging: {
      supercharger: "250 kW",
      level2: "9.6 kW"
    },
    dimensions: {
      length: 4694,
      width: 1933,
      height: 1443,
      wheelbase: 2875,
      weight: 1774
    },
    drivetrainBrakesAndSuspension: {
      drivetrain: "All-Wheel Drive",
      brakes: "Disc, ventilated",
      frontSuspension: "Double wishbone",
      rearSuspension: "Multi-link"
    },
    features: {
      autopilot: true,
      airbags: 8,
      infotainment: "15-inch touchscreen"
    }
  },  
  {
    brand: "Ford",
    model: "F-150",
    year: 2021,
    modification: "Diesel",
    powertrainArchitecture: "Internal Combustion Engine (Diesel)",
    bodyType: "Pickup",
    seats: 5,
    doors: 4,
    performanceSpecs: {
      horsepower: "250 hp",
      torque: "440 lb-ft",
      acceleration: "7.1 seconds (0-60 mph)"
    },
    engine: {
      type: "V6",
      displacement: "3.0L",
      fuelType: "Diesel",
      engineLayout: "Front, Longitudinal",
      cylinders: 6,
      transmission: "10-speed automatic",
      driveType: "4WD"
    },
    dimensions: {
      length: 5894,
      width: 2029,
      height: 1912,
      wheelbase: 3658
    },
    fuelConsumption: {
      urban: {
        value: 10.5,
        unit: "l/100 km"
      },
      extraUrban: {
        value: 7.2,
        unit: "l/100 km"
      },
      combined: {
        value: 8.6,
        unit: "l/100 km"
      }
    },
    brakesAndSuspension: {
      frontSuspension: "Independent",
      rearSuspension: "Leaf spring",
      brakes: "Disc, ventilated"
    }
  }
  
  ];
  
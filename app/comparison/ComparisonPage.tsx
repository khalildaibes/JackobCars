"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Img } from "../../components/Img";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ChevronDown, ChevronUp, ArrowLeft, Car, Share2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useComparison } from "../context/ComparisonContext";
import { toast } from "react-hot-toast";
import { allCars } from "../../app/src/data";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

interface AIComparison {
  pros: string[];
  cons: string[];
  additionalFeatures: { [key: string]: any };
}

export default function Comparison() {
  const t = useTranslations('Comparison');
  const { selectedCars, clearComparison, shareComparison } = useComparison();
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({});
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});
  const [aiComparisons, setAiComparisons] = useState<{ [key: string]: AIComparison }>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const carsParam = searchParams?.get('cars');
    if (carsParam) {
      // If cars are specified in URL, fetch their details
      const carIds = carsParam.split(',');
      // Implement your fetch logic here
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCars.length > 0) {
      const flattenedSpecs = selectedCars.map(flattenSpecs);
      const defaultFilters: { [key: string]: boolean } = {};
      Object.keys(flattenedSpecs[0]).forEach((key) => {
        defaultFilters[key] = true;
      });
      setFilters(defaultFilters);
    }
  }, [selectedCars]);

  const handleShare = async () => {
    try {
      await shareComparison();
      toast.success(t('copied_to_clipboard'));
    } catch (error) {
      toast.error(t('share_error'));
    }
  };

  const flattenSpecs = (car: any) => {
    let flatSpecs: { [key: string]: any } = {};
    for (let key in car) {
      if (typeof car[key] === "object" && car[key] !== null) {
        const nestedSpecs = flattenSpecs(car[key]);
        for (let nestedKey in nestedSpecs) {
          flatSpecs[`${formatKey(key)} ${formatKey(nestedKey)}`] = nestedSpecs[nestedKey];
        }
      } else {
        flatSpecs[formatKey(key)] = car[key] || "N/A";
      }
    }
    return flatSpecs;
  };

  const formatKey = (key: string) => {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  };

  const allFlattenedSpecs = selectedCars.map(flattenSpecs);
  const uniqueSections = new Set<string>();

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchAIComparison = async (car: any) => {
    setIsLoadingAI(true);
    try {
      const response = await fetch('/api/generate-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: car.make,
          model: car.model,
          year: car.year,
          specs: car
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI comparison');
      
      const data = await response.json();
      setAiComparisons(prev => ({
        ...prev,
        [car.id]: data
      }));
    } catch (error) {
      console.error('Error fetching AI comparison:', error);
      toast.error('Failed to load AI comparison');
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    if (selectedCars.length > 0) {
      selectedCars.forEach(car => {
        if (!aiComparisons[car.id]) {
          fetchAIComparison(car);
        }
      });
    }
  }, [selectedCars]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-2 sm:mb-6">
          <Link href="/car-listing" className="text-white hover:underline flex items-center text-xs sm:text-base">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {t('back_to_listings')}
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-sm rounded-xl mb-2 sm:mb-8 p-2 sm:p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">{t('compare_cars')}</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">{t('compare_description')}</p>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                {t('share_comparison')}
              </Button>
              <Button
                variant="destructive"
                onClick={clearComparison}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
              >
                {t('clear_comparison')}
              </Button>
            </div>
          </div>
        </motion.div>

        {selectedCars.length < 2 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-8 text-center">
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <Car className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <h2 className="text-base sm:text-xl font-semibold text-white">{t('select_cars_prompt')}</h2>
                <p className="text-gray-600 text-xs sm:text-base">{t('select_cars_description')}</p>
                <Button asChild className="text-xs sm:text-base">
                  <Link href="/car-listing">{t('browse_cars')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-8">
            {/* Main Comparison Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 sm:p-4 text-left"></th>
                        {selectedCars.map((car, index) => (
                          <th key={index} className="p-2 sm:p-4">
                            <div className="flex flex-col items-center gap-2 sm:gap-4">
                              <div className="relative w-24 h-16 sm:w-48 sm:h-32 rounded-lg overflow-hidden">
                                <Img
                                  external={true}
                                  src={car.mainImage || "/default-car.png"}
                                  alt={`${car.make} ${car.model}`}
                                  width={192}
                                  height={128}
                                  className="object-cover"
                                />
                              </div>
                              <div className="text-center">
                                <h3 className="font-semibold text-white text-xs sm:text-base">{car.make} {car.model}</h3>
                                <p className="text-blue-600 font-medium text-xs sm:text-base">{car.price}</p>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {/* AI Generated Additional Features - MOVED TO TOP */}
                      <tr className="bg-blue-50">
                        <td colSpan={selectedCars.length + 1} className="p-2 sm:p-4 border-t">
                          <h3 className="font-semibold text-blue-700 text-xs sm:text-base">AI GENERATED INSIGHTS</h3>
                        </td>
                      </tr>
                      {/* Performance */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Performance</td>
                        {selectedCars.map((car, index) => (
                          <td key={`performance-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.performance || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Safety Features */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Safety Features</td>
                        {selectedCars.map((car, index) => (
                          <td key={`safety-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.safetyFeatures || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Reliability */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Reliability</td>
                        {selectedCars.map((car, index) => (
                          <td key={`reliability-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.reliability || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Value for Money */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Value for Money</td>
                        {selectedCars.map((car, index) => (
                          <td key={`value-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.valueForMoney || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Environmental Impact */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Environmental Impact</td>
                        {selectedCars.map((car, index) => (
                          <td key={`environmental-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.environmentalImpact || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Technology Features */}
                      <tr>
                        <td className="p-2 sm:p-4 border-t font-medium text-white text-xs sm:text-base">Technology Features</td>
                        {selectedCars.map((car, index) => (
                          <td key={`tech-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                {aiComparisons[car.id]?.additionalFeatures?.technologyFeatures || 'N/A'}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Pros Section */}
                      <tr className="bg-green-50">
                        <td colSpan={selectedCars.length + 1} className="p-2 sm:p-4 border-t">
                          <h3 className="font-semibold text-green-700 text-xs sm:text-base">PROS</h3>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-4 border-t"></td>
                        {selectedCars.map((car, index) => (
                          <td key={`pros-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                <ul className="list-disc pl-2 space-y-1">
                                  {aiComparisons[car.id]?.pros?.map((pro, idx) => (
                                    <li key={idx} className="text-green-700">{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Cons Section */}
                      <tr className="bg-red-50">
                        <td colSpan={selectedCars.length + 1} className="p-2 sm:p-4 border-t">
                          <h3 className="font-semibold text-red-700 text-xs sm:text-base">CONS</h3>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-4 border-t"></td>
                        {selectedCars.map((car, index) => (
                          <td key={`cons-${car.id}`} className="p-2 sm:p-4 border-t">
                            {isLoadingAI ? (
                              <div className="animate-pulse h-16 sm:h-20 bg-gray-200 rounded" />
                            ) : (
                              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm text-xs sm:text-base">
                                <ul className="list-disc pl-2 space-y-1">
                                  {aiComparisons[car.id]?.cons?.map((con, idx) => (
                                    <li key={idx} className="text-red-700">{con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Original Specs Comparison */}
                      {allFlattenedSpecs.length > 0 &&
                        Object.keys(allFlattenedSpecs[0])
                        .filter(k => !k.includes("ALT") && !k.includes("MAIN")
                        && !k.includes("FEATURES") && !k.includes("ID"))
                        .map((key) => {
                          const sectionHeader = key.split(" ")[0];
                          if (!filters[key] || uniqueSections.has(sectionHeader)|| sectionHeader === "ALT") return null;
                          uniqueSections.add(sectionHeader);

                          return (
                            <React.Fragment key={sectionHeader}>
                              <tr 
                                className="cursor-pointer "
                                onClick={() => toggleSection(sectionHeader)}
                              >
                                <td colSpan={selectedCars.length + 1} className="p-2 sm:p-4 border-t">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-white text-xs sm:text-base">{sectionHeader}</span>
                                    {collapsedSections[sectionHeader] ? (
                                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                    ) : (
                                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {!collapsedSections[sectionHeader] &&
                                Object.keys(allFlattenedSpecs[0])
                                  .filter(k => k.startsWith(sectionHeader) && !k.includes("ALT") && !k.includes("MAIN")
                                  && !k.includes("FEATURES") && !k.includes("ID"))
                                  .map((subKey) => (
                                    <tr key={subKey} className="">
                                      <td className="p-2 sm:p-4 border-t text-sm text-gray-600 text-xs sm:text-base">
                                        {subKey.replace(`${sectionHeader} `, '')}
                                      </td>
                                      {selectedCars.map((_, index) => (
                                        <td key={index} className="p-2 sm:p-4 border-t text-sm text-white text-center text-xs sm:text-base">
                                          {allFlattenedSpecs[index][subKey]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                            </React.Fragment>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
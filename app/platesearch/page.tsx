"use client"; // This marks the component as a Client Component

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import { toast } from '../../hooks/use-toast';

// Mock data for demonstration
const mockCarData = [
  { plate: 'ABC123', make: 'BMW', model: '330i', year: 2023, owner: 'John Doe', registerDate: '2023-01-15' },
  { plate: 'XYZ789', make: 'Audi', model: 'A4', year: 2022, owner: 'Jane Smith', registerDate: '2022-11-20' },
  { plate: 'DEF456', make: 'Mercedes', model: 'C300', year: 2021, owner: 'Robert Brown', registerDate: '2021-08-05' },
];

const PlateSearch = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockCarData[0] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateNumber.trim()) {
      // toast({
      //   title: "Error",
      //   description: "Please enter a plate number",
      //   variant: "destructive"
      // });
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = mockCarData.find(car => 
        car.plate.toLowerCase() === plateNumber.toLowerCase()
      );
      
      setSearchResult(result || null);
      setIsSearching(false);
      
      if (!result) {
        // toast({
        //   title: "No Results",
        //   description: `No vehicle found with plate number "${plateNumber}"`,
        //   variant: "destructive"
        // });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Car Plate Number Search
          </h1>
          
          <Card className="shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Enter Vehicle Plate Number</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="Enter plate number (e.g., ABC123)"
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {searchResult ? (
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-xl font-medium">
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Plate Number</p>
                        <p className="font-medium">{searchResult.plate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Make</p>
                        <p className="font-medium">{searchResult.make}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{searchResult.model}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{searchResult.year}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p className="font-medium">{searchResult.owner}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Registration Date</p>
                        <p className="font-medium">{searchResult.registerDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : !isSearching && (
                <div className="text-center p-8 bg-muted/30 rounded-lg border">
                  <p className="text-muted-foreground">No results found for the plate number "{plateNumber}"</p>
                </div>
              )}
            </motion.div>
          )}
          
          <p className="text-sm text-muted-foreground text-center mt-8">
            This search uses mock data for demonstration. Try plate numbers: ABC123, XYZ789, or DEF456.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlateSearch;

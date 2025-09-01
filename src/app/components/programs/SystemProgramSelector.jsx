"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Info, Globe } from "lucide-react";
import { toast } from "sonner";

const SystemProgramSelector = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemPrograms();
  }, []);

  const fetchSystemPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clinic/system-programs");
      const data = await response.json();
      
      if (data.status) {
        setPrograms(data.programs);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching system programs:", error);
      setError("Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramToggle = async (programId, currentAccess) => {
    const action = currentAccess ? "remove" : "add";
    
    setUpdating(prev => ({ ...prev, [programId]: true }));
    
    try {
      const response = await fetch("/api/clinic/system-programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          action,
        }),
      });

      const data = await response.json();
      
      if (data.status) {
        // Update the local state
        setPrograms(prev => 
          prev.map(program => 
            program.id === programId 
              ? { ...program, has_access: !currentAccess }
              : program
          )
        );
        
        toast.success(data.message);
      } else {
        toast.error(data.message || `Failed to ${action} program access`);
      }
    } catch (error) {
      console.error(`Error ${action}ing program access:`, error);
      toast.error(`Failed to ${action} program access`);
    } finally {
      setUpdating(prev => ({ ...prev, [programId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <XCircle className="h-12 w-12 mx-auto mb-4" />
        <p className="text-lg font-medium">{error}</p>
        <Button 
          onClick={fetchSystemPrograms} 
          variant="outline" 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Globe className="h-12 w-12 mx-auto mb-4" />
        <p className="text-lg font-medium">No system programs available</p>
        <p className="text-sm">System administrators haven't created any programs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-500" />
        <p className="text-sm text-gray-600">
          Select which system programs you want to make available to your coaches and clients.
          Programs marked as "Enabled" will be visible to your team.
        </p>
      </div>

      <div className="grid gap-4">
        {programs.map((program) => (
          <Card 
            key={program.id} 
            className={`transition-all ${
              program.has_access 
                ? "ring-2 ring-green-200 bg-green-50" 
                : "bg-white"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{program.program_name}</h3>
                    {program.has_access && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <Globe className="h-3 w-3 mr-1" />
                      System Program
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{program.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>Type: {program.program_type}</span>
                    <span>•</span>
                    <span>Length: {program.program_length} days</span>
                    {program.check_in_frequency && (
                      <>
                        <span>•</span>
                        <span>Check-ins: {program.check_in_frequency}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <Checkbox
                    checked={program.has_access}
                    onCheckedChange={() => handleProgramToggle(program.id, program.has_access)}
                    disabled={updating[program.id]}
                    className="h-5 w-5"
                  />
                  
                  {updating[program.id] && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>
          Changes are saved automatically. Programs marked as "Enabled" will be visible 
          to your coaches and can be assigned to clients.
        </p>
      </div>
    </div>
  );
};

export default SystemProgramSelector;

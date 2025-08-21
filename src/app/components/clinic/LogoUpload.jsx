"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useClinic } from "@/app/context/ClinicContext";

const LogoUpload = ({ currentLogoUrl, onLogoUpdate }) => {
  const { user } = useAuth();
  const { refreshClinic } = useClinic();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a logo file first');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', selectedFile);
      formData.append('clinicId', user.clinic);

      const response = await fetch('/api/clinic/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Logo uploaded successfully!');
        onLogoUpdate(data.logoUrl);
        
        // Refresh clinic data to ensure consistency
        await refreshClinic();
        
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) {
      toast.error('No logo to remove');
      return;
    }

    setIsRemoving(true);
    try {
      const response = await fetch('/api/clinic/logo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicId: user.clinic }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Logo removed successfully!');
        onLogoUpdate(null);
        
        // Refresh clinic data to ensure consistency
        await refreshClinic();
      } else {
        throw new Error(data.message || 'Removal failed');
      }
    } catch (error) {
      console.error('Remove logo error:', error);
      toast.error(error.message || 'Failed to remove logo');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayLogoUrl = previewUrl || currentLogoUrl;

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Clinic Logo
        </CardTitle>
        <CardDescription>
          Upload your clinic logo to customize the appearance of your portal. 
          Recommended size: 200x200px, max 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Logo Display */}
        {currentLogoUrl && !previewUrl && (
          <div className="space-y-3">
            <Label>Current Logo</Label>
            <div className="flex items-center gap-4">
              <img
                src={currentLogoUrl}
                alt="Current clinic logo"
                className="h-20 w-20 object-contain border border-gray-200 rounded-lg"
              />
              <Button
                variant="outline"
                onClick={handleRemoveLogo}
                disabled={isRemoving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Remove Logo
              </Button>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className="space-y-3">
          <Label htmlFor="logo">Upload New Logo</Label>
          <div className="flex items-center gap-3">
            <Input
              id="logo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="px-3"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <div className="space-y-3">
            <Label>Preview</Label>
            <div className="flex items-center gap-4">
              <img
                src={previewUrl}
                alt="Logo preview"
                className="h-20 w-20 object-contain border border-gray-200 rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Logo Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Supported formats: JPEG, PNG, WebP</li>
            <li>Maximum file size: 5MB</li>
            <li>Recommended dimensions: 200x200 pixels</li>
            <li>Square aspect ratio works best</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoUpload;

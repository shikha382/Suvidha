import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Type,
  Eye,
  MousePointer,
  RotateCcw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AccessibilityWidget = () => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largePointer, setLargePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("high-contrast");
  };

  const toggleLargePointer = () => {
    setLargePointer(!largePointer);
    document.documentElement.classList.toggle("large-pointer");
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle("reduced-motion");
  };

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargePointer(false);
    setReducedMotion(false);
    document.documentElement.style.fontSize = "100%";
    document.documentElement.classList.remove("high-contrast", "large-pointer", "reduced-motion");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-24 right-4 z-50 rounded-full h-12 w-12 bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg"
          aria-label="Accessibility options"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Accessibility className="h-4 w-4" />
          Accessibility Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Font Size */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size: {fontSize}%
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
              className="flex-1"
            >
              <ZoomOut className="h-4 w-4 mr-1" />
              A-
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
              className="flex-1"
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              A+
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* High Contrast */}
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            toggleHighContrast();
          }}
        >
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            High Contrast
          </span>
          <Switch checked={highContrast} />
        </DropdownMenuItem>

        {/* Large Pointer */}
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            toggleLargePointer();
          }}
        >
          <span className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Large Cursor
          </span>
          <Switch checked={largePointer} />
        </DropdownMenuItem>

        {/* Reduced Motion */}
        <DropdownMenuItem 
          className="flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            toggleReducedMotion();
          }}
        >
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Reduce Motion
          </span>
          <Switch checked={reducedMotion} />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Reset */}
        <DropdownMenuItem onClick={resetAll} className="cursor-pointer">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilityWidget;

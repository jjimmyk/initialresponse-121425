import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';

interface ICSFormsPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
}

export function ICSFormsPhase({ data, onDataChange, onComplete, onPrevious }: ICSFormsPhaseProps) {
  const [selectedForm, setSelectedForm] = useState<string>(data?.selectedForm || '');

  const handleFormChange = (value: string) => {
    setSelectedForm(value);
    onDataChange({ ...data, selectedForm: value });
  };

  return (
    <div className="space-y-6">
      {/* Form Selector */}
      <div className="space-y-2">
        <Label htmlFor="ics-form-select" className="text-white">Select ICS Form</Label>
        <Select value={selectedForm} onValueChange={handleFormChange}>
          <SelectTrigger id="ics-form-select" className="w-[300px] bg-input-background border-border text-card-foreground">
            <SelectValue placeholder="Select a form..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ics-201">ICS-201</SelectItem>
            <SelectItem value="ics-208">ICS-208</SelectItem>
            <SelectItem value="ics-214">ICS-214</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Placeholder Card */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>ICS Form Placeholder</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {/* Empty content for now */}
        </CardContent>
      </Card>
    </div>
  );
}




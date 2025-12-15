import { Check, Clock, ChevronDown, ArrowLeft, Calendar, BarChart3, FileText, Settings } from 'lucide-react';
import { DisasterPhase } from '../types/disaster';
import { Button } from './ui/button';

interface PlanningPStepperProps {
  phases: DisasterPhase[];
  currentPhaseId: string;
  onPhaseSelect: (phaseId: string) => void;
  operationalPeriodNumber?: number;
  showHeader?: boolean;
  leftAddon?: React.ReactNode;
  nameOverrides?: Record<string, string>;
  align?: 'left' | 'center';
}

export function PlanningPStepper({ phases, currentPhaseId, onPhaseSelect, operationalPeriodNumber = 0, showHeader = true, leftAddon, nameOverrides, align = 'center' }: PlanningPStepperProps) {
  
  return (
    <div className="px-6 bg-card border-b border-border">
      {/* Horizontal Tab Navigation */}
      <div className={`flex items-center gap-1 overflow-x-auto ${align === 'left' ? 'justify-start' : 'justify-center'}`}>
        {leftAddon ? <div className="flex-shrink-0">{leftAddon}</div> : null}
        {phases.map((phase) => {
          const isActive = phase.id === currentPhaseId;

          // Get descriptive text for Operational Period 0 phases
          const getDescriptiveText = () => {
            if (operationalPeriodNumber !== 0) return null;
            if (phase.id === 'overview') return 'ICS-201';
            if (phase.id === 'objectives-actions') return 'ICS-202';
            if (phase.id === 'incident-roster') return 'ICS-203';
            if (phase.id === 'resources') return 'ICS-204';
            if (phase.id === 'safety-analysis') return 'ICS-208';
            return null;
          };

          const descriptiveText = getDescriptiveText();
          const displayName = nameOverrides?.[phase.id] ?? phase.shortName;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseSelect(phase.id)}
              className={`relative transition-colors whitespace-nowrap ${
                align === 'left' ? 'px-2 py-3' : 'px-4 py-3'
              } ${
                isActive
                  ? 'text-accent'
                  : 'text-foreground hover:text-accent'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="caption">
                  {displayName}
                </span>
                
                {/* Descriptive text for Operational Period 0 */}
                {descriptiveText && (
                  <span className="caption text-muted-foreground/60">
                    {descriptiveText}
                  </span>
                )}
              </div>
              
              {/* Active indicator line */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
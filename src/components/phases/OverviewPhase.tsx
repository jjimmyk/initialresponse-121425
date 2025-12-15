import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface OverviewPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
}

export function OverviewPhase({ data = {}, onDataChange, onComplete, onPrevious }: OverviewPhaseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [savedValue, setSavedValue] = useState(data.currentSituation || '');

  // Mock incident data - should eventually come from props or global state
  const incidentData = {
    name: 'Oil Spill Alpha',
    type: 'Special Event',
    location: 'AT&T Stadium, Arlington, TX',
    startTime: new Date('2026-06-11T10:00:00'),
    icName: 'Captain Maria Rodriguez',
    status: 'Active',
    priority: 'High',
    capacity: '80,000 attendees',
    security: '85% complete',
    venues: {
      primary: 'AT&T Stadium',
      coverage: '16 host venues nationwide'
    }
  };

  const allItemsCompleted = true;

  const handleTextareaFocus = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditValue(savedValue);
    }
  };

  const handleTextareaChange = (value: string) => {
    setEditValue(value);
  };

  const handleSave = () => {
    setSavedValue(editValue);
    onDataChange({ ...data, currentSituation: editValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(savedValue);
    setIsEditing(false);
  };

  const displayValue = isEditing ? editValue : savedValue;

  return (
    <div className="space-y-6">
      {/* Current Situation Card */}
      <Card className="flex flex-col gap-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Current Situation
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                const generatedText = `Situation Report (SITREP) – Oahu Power Infrastructure
Operational Period: Current (T+0–8h) • Focus: Generation/Transmission risks and dependent assets

Executive Summary
Two primary risks to Oahu’s electric system are under review: 1) operational disruption or targeted attack against major generation sites on the island’s leeward corridor and 2) cascading impacts to dependent defense, public safety, water, healthcare, and telecom assets. Current indications do not confirm physical damage, but weather, fuel logistics, and cyber‑physical threats elevate risk to continuity of service over the next 24–48 hours.

Threats and Vulnerabilities (Oahu)
- Generation nodes (western/central Oahu): heightened sensitivity to fuel supply continuity, heat‑related derates, and N‑1 contingencies on key transmission segments. Adverse events at a single plant can force rapid re‑dispatch and voltage support stress eastward.
- Substation and transmission: select 138 kV segments are single‑points for load serving to central/windward communities; vegetation and high winds increase trip risk. Unauthorized drone overflights reported near critical corridors (unverified).
- Cyber‑physical: routine phishing and credential reuse attempts targeting utility vendors and remote access; opportunistic scanning of OT demilitarized zones observed; no confirmed control‑system compromise.

Critical Dependencies (examples)
- Defense: Kaneohe Marine Corps Base Headquarters (MCBH) relies on grid power delivered through central Oahu transmission. Backup generation estimated sufficient for ~24 hours of critical C2 and life‑safety loads at current fuel levels; resupply window < 12 hours recommended if grid instability persists.
- Water/Wastewater: Honolulu Board of Water Supply high‑lift pumping stations require continuous power; brief outages drive pressure drops, boil water advisories, and increased generator runtime.
- Healthcare: Major hospitals on Oahu (e.g., Honolulu corridor) sustain essential services on emergency generation for 24–72 hours depending on fuel; supply‑chain congestion can compress this window.
- Telecom: Central offices and cellular macro sites maintain battery/generator backup; prolonged grid loss degrades backhaul capacity and 911 PSAP call‑taking.

Current Operations
- Generation & Grid Readiness: Confirmed spinning reserves and voltage support availability; preventative switching to reduce load on constrained 138 kV spans. Vegetation patrols on wind‑exposed feeders.
- Logistics: Fuel status checks for priority generators and defense sites; staging mobile gensets and fuel trucks on windward access routes for Kaneohe district.
- Cyber: Tightened remote‑access allowlists; MFA revalidation for vendor accounts; increased OT network monitoring for lateral movement and atypical protocol usage.
- Coordination: Utility, State Energy Office, USN/USMC, and County EOCs aligned on priority restoration tiers; PIRs issued for confirmed outages > 10 minutes in windward communities.

Projected Impacts (next 24–48h)
- If a generation unit on the west/central corridor trips unexpectedly, expect short‑duration brownouts on windward feeders during re‑dispatch. MCBH will shift to emergency power; projected runtime ~24 hours at current fuel level if not resupplied. Water pumping will prioritize hospitals and emergency services; rolling conservation messages likely.

Recommended Actions
1) Pre‑position fuel and confirm generator start reliability at MCBH HQ (transfer switch tests, 2‑hour loaded run).
2) Validate water pumping contingency schedules; coordinate conservation messaging with County.
3) Increase patrols on key 138 kV spans and drone monitoring near substations; pre‑clear vegetation.
4) Tighten vendor remote access controls and monitor for anomalous OT traffic; rehearse manual fallback procedures for plant start/stop.
5) Establish rolling SITREP cadence with utility and defense liaisons every 4 hours until grid risk normalizes.

References (open sources/examples)
[1] Hawaii State Energy Office – Energy Assurance Planning (resilience/response guidance) — see “Energy Emergency Response” section.
[2] CISA – Infrastructure Resilience Planning Framework (IRPF) — dependency mapping and prioritization.
[3] FEMA – Lifelines and Critical Infrastructure interdependencies overview.
[4] DOE – Energy Sector Cybersecurity Preparedness resources (OT/ICS best practices).
`;

                setEditValue(generatedText);
                setSavedValue(generatedText);
                onDataChange({ ...data, currentSituation: generatedText });
                setIsEditing(true);
              }}
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <Textarea 
            placeholder="Enter current situation details..."
            className="min-h-[300px] resize-y bg-input-background border-border text-card-foreground"
            value={displayValue}
            onFocus={handleTextareaFocus}
            onChange={(e) => handleTextareaChange(e.target.value)}
          />

          {isEditing && (
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for deterministic reports */}
      <div className="text-muted-foreground text-sm italic px-4 py-3">
        [placeholder for deterministic reports]
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Sparkles, ChevronsUpDown, Check, ChevronDown, ChevronRight, AlertTriangle, Info, AlertCircle, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { cn } from '../ui/utils';

interface OverviewPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
  isMapView?: boolean;
}

interface HistoricalVersion {
  id: string;
  timestamp: string;
  createdBy: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  timestamp: string;
  source: string;
  status: string;
}

interface Draft {
  id: string;
  title: string;
  timestamp: string;
  createdBy: string;
  content: string;
}

export function OverviewPhase({ data = {}, onDataChange, onComplete, onPrevious, isMapView = false }: OverviewPhaseProps) {
  const defaultSitrepContent = `SITUATION REPORT – FIFA WORLD CUP 2026 SEMIFINAL
Miami, FL | Hard Rock Stadium | Jun 11, 2026, 21:00 EST

EXECUTIVE SUMMARY:
FIFA World Cup 2026 Semifinal match between Brazil and Germany underway at Hard Rock Stadium with 65,442 spectators in attendance (98.4% capacity). Match commenced at 20:00 EST with enhanced security posture in place. Current score: Brazil 2 - Germany 1 (68th minute). Crowd energy high; no major security incidents reported. All operational sectors performing nominally.

VENUE STATUS:
Hard Rock Stadium operations NORMAL with heightened security protocols per FIFA World Cup designation. All ingress/egress points secured; crowd management teams positioned at designated zones. Emergency medical stations staffed at 100%; 3 minor medical incidents treated on-site (heat exhaustion x2, minor injury x1). Stadium infrastructure: power, HVAC, lighting, and communications systems all GREEN. Video assistant referee (VAR) system operational; broadcast feed stable with global viewership estimated at 1.2 billion.

SECURITY POSTURE:
Multi-agency security coordination active: Miami-Dade Police Department (MDPD), FBI Joint Terrorism Task Force, Department of Homeland Security, and private security contractors. Perimeter security: 3-layer screening established; no credible threats identified. Counterterrorism teams positioned at strategic locations; bomb-detection canines completed pre-match sweeps (all clear). Drone countermeasures active; FAA temporary flight restriction (TFR) enforced within 5 NM radius. Cybersecurity monitoring: FIFA and venue IT infrastructure under continuous surveillance; no anomalous network activity detected.

CROWD MANAGEMENT:
Fan zones outside stadium: ~8,500 additional supporters; atmosphere celebratory, no disturbances. Alcohol sales suspended as of 65th minute per FIFA policy. Crowd flow orderly; egress plans validated for post-match dispersal. Public transportation: Miami-Dade Transit Authority coordinating shuttle buses and Metrorail service extensions; estimated 40% of attendees using public transit. Traffic control: Miami-Dade County coordinating roadway access; expect elevated congestion post-match (estimated clearance time: 90 minutes).

MEDICAL & FIRE SAFETY:
Miami-Dade Fire Rescue (MDFR) on-site with 4 ambulances and mobile command unit. Mass casualty incident (MCI) plans reviewed and validated; trauma centers on standby (Jackson Memorial Hospital, Aventura Hospital). Fire suppression systems tested and operational; no fire alarms or safety concerns. Heat index: 89°F; hydration stations open and accessible; staff monitoring for heat-related illness.

WEATHER:
Current conditions: Partly cloudy, 85°F, humidity 72%, winds SE at 8 mph. No severe weather forecasted; isolated thunderstorms possible post-match (after 23:00 EST). National Weather Service monitoring; no weather-related operational impact anticipated.

CRITICAL UPDATES:
• 62nd minute: Brief pitch delay (2 minutes) for medical evaluation of Germany midfielder; player transported to locker room, replaced by substitute. No crowd impact.
• VAR review at 55th minute for Brazil's second goal; decision upheld, match resumed without incident.
• Social media monitoring: trending hashtags #WorldCup2026, #BRAvGER; sentiment analysis shows 85% positive engagement; no coordinated disinformation campaigns detected.

OPERATIONAL PRIORITIES (NEXT 30 MINUTES):
1. Maintain crowd safety and security posture through match conclusion and egress phase.
2. Coordinate post-match traffic and transit operations; ensure orderly dispersal.
3. Monitor for celebratory disturbances; activate crowd control protocols if necessary.
4. Prepare for post-match VIP departures (FIFA officials, heads of state).
5. Conduct post-event debrief with multi-agency partners; document lessons learned.

CONTACTS:
Incident Commander: Chief Robert Mendez, MDPD (305-555-7800)
FBI On-Scene Coordinator: SAC Linda Torres (305-555-6200)
MDFR On-Scene Commander: Battalion Chief Carlos Ruiz (305-555-5100)
Stadium Operations Director: Michael Stevens, Hard Rock Stadium (305-555-9000)

Next SITREP: Post-match summary at 23:30 EST or as conditions warrant.`;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [savedValue, setSavedValue] = useState(data.currentSituation || defaultSitrepContent);
  const [viewMode, setViewMode] = useState<'latest' | 'historical' | 'drafts'>('latest');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [createDraftModalOpen, setCreateDraftModalOpen] = useState(false);
  const [newDraftContent, setNewDraftContent] = useState('');
  const [datasourceDropdownOpen, setDatasourceDropdownOpen] = useState(false);
  const [selectedDatasources, setSelectedDatasources] = useState<string[]>([]);
  const [selectedSitrepTab, setSelectedSitrepTab] = useState<string>('tab1');
  const [selectedModalTab, setSelectedModalTab] = useState<string>('tab1');

  // Available datasources for AI generation
  const availableDatasources = [
    { id: 'web', label: 'Web' },
    { id: 'incident-data', label: 'Incident Data' },
    { id: 'files', label: 'Files' },
    { id: 'organization-data', label: 'Organization Data' }
  ];

  const toggleDatasource = (datasourceId: string) => {
    setSelectedDatasources(prev => 
      prev.includes(datasourceId)
        ? prev.filter(id => id !== datasourceId)
        : [...prev, datasourceId]
    );
  };

  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 'd1',
      title: 'Draft SITREP - Grid Preparedness Update',
      timestamp: '2025-12-15 16:00:00 UTC',
      createdBy: 'Captain Maria Rodriguez',
      content: 'Draft content for grid preparedness...'
    },
    {
      id: 'd2',
      title: 'Draft SITREP - Weather Impact Assessment',
      timestamp: '2025-12-15 13:30:00 UTC',
      createdBy: 'Maj. Eric Tan',
      content: 'Draft weather impact analysis...'
    }
  ]);
  const [expandedDrafts, setExpandedDrafts] = useState<Set<string>>(new Set());

  // Mock historical versions
  const historicalVersions: HistoricalVersion[] = [
    { id: 'v1', timestamp: '2025-12-15 14:30:00 UTC', createdBy: 'Captain Maria Rodriguez' },
    { id: 'v2', timestamp: '2025-12-15 12:15:00 UTC', createdBy: 'Col. Hana Kealoha' },
    { id: 'v3', timestamp: '2025-12-15 09:45:00 UTC', createdBy: 'Maj. Eric Tan' },
    { id: 'v4', timestamp: '2025-12-15 06:00:00 UTC', createdBy: 'Captain Maria Rodriguez' },
    { id: 'v5', timestamp: '2025-12-14 22:30:00 UTC', createdBy: 'Kai Nakamura' },
    { id: 'v6', timestamp: '2025-12-14 18:00:00 UTC', createdBy: 'Captain Maria Rodriguez' },
  ];

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Port Status',
      description: 'Pearl Harbor Naval Complex: Port Operations ALPHA (restricted access, mission-essential only). Commercial vessel traffic suspended within 3 NM of spill zone; established safety perimeter enforced by USCG patrol craft. Honolulu Harbor: Commercial operations NORMAL with precautionary advisories for inbound tankers; tugboat escort mandatory for fuel vessels. Keehi Boat Harbor & Kewalo Basin: RESTRICTED—spill response staging areas; recreational vessels advised to avoid windward departure routes. Kaneohe Bay MCBH: Port Services BRAVO (heightened security); coordinating with environmental response for nearshore monitoring. All harbors implementing enhanced boom deployment readiness protocols. Estimated return to normal operations: 48-72 hours pending spill containment confirmation.',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      source: 'USCG Sector Honolulu / Port Operations',
      status: 'Active'
    },
    {
      id: '2',
      title: 'HURCON Attainment',
      description: 'Current HURCON Status: HURCON 4 (routine readiness). All DoD installations Oahu maintaining normal hurricane readiness posture; no tropical systems within 5-day forecast window. Key metrics: Emergency generator tests 100% complete (last cycle: 72h prior). Facility hardening inventories verified and staged. Personnel accountability rosters current and validated. Fuel reserves: 96% capacity across critical facilities. Communications systems redundancy tested and operational. Although HURCON status remains routine, spill response operations are leveraging pre-positioned hurricane preparedness resources including portable pumps, generators, and containment equipment. Coordination between environmental response and installation readiness teams ensures no degradation to core mission capability during concurrent operations.',
      severity: 'Low',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      source: 'INDOPACOM J3 / Installation Readiness',
      status: 'Nominal'
    },
    {
      id: '3',
      title: 'COOP Status',
      description: 'Continuity of Operations (COOP) Status: All primary mission facilities OPERATIONAL. Unified Command established at Joint Base Pearl Harbor-Hickam EOC; alternate command post at Camp H.M. Smith on standby. Primary systems: Normal operations with enhanced monitoring for environmental response coordination. Communications: All primary and alternate networks fully operational; SIPRNET, NIPRNET, and VTC systems tested and validated. Personnel: Key leadership positions filled; succession orders current. Essential functions: Maintained without degradation despite increased operational tempo from spill response. No COOP activation required at this time. Situational awareness briefings conducted every 6 hours with State Emergency Management and federal partners to ensure seamless coordination and mission continuity.',
      severity: 'Low',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      source: 'Joint Base Pearl Harbor-Hickam / Emergency Management',
      status: 'Nominal'
    },
    {
      id: '4',
      title: 'Force Layout',
      description: 'Current Force Posture Oahu: USINDOPACOM HQ: NORMAL staffing; senior leadership engaged in spill coordination with interagency partners. Joint Base Pearl Harbor-Hickam: 3,200 personnel; heightened environmental monitoring protocols; fuel handling operations under enhanced safety review. Marine Corps Base Hawaii (Kaneohe Bay): 2,800 Marines; amphibious readiness maintained; aviation assets available for spill surveillance support if requested. Schofield Barracks (25th Infantry Division): 10,500 soldiers; mission readiness GREEN; no impact from coastal operations. US Army Garrison Hawaii: Force protection BRAVO; installation access control normal. Air Force 15th Wing (Hickam): Flight operations NORMAL; reconnaissance aircraft supporting USCG aerial surveillance. Overall readiness: All units maintain full operational capability. Environmental incident response leveraging organic DoD capabilities in support of civilian authorities under established coordination protocols.',
      severity: 'Low',
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
      source: 'USINDOPACOM J3 / Force Status',
      status: 'Current'
    }
  ];

  const toggleDraft = (draftId: string) => {
    setExpandedDrafts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(draftId)) {
        newSet.delete(draftId);
      } else {
        newSet.add(draftId);
      }
      return newSet;
    });
  };

  const createNewDraft = () => {
    // Open modal and populate with current SITREP content
    setNewDraftContent(savedValue);
    setCreateDraftModalOpen(true);
  };

  const handleSubmitDraft = () => {
    const newDraft: Draft = {
      id: `d${Date.now()}`,
      title: `Draft SITREP - ${new Date().toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      createdBy: 'Current User',
      content: newDraftContent
    };
    setDrafts(prev => [newDraft, ...prev]);
    setExpandedDrafts(prev => new Set([...prev, newDraft.id]));
    setCreateDraftModalOpen(false);
    setViewMode('drafts'); // Switch to drafts view to see the new draft
  };

  const toggleAlert = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return '#F04438';
      case 'Medium':
        return '#FEC84B';
      case 'Low':
        return '#12B76A';
      default:
        return '#6E757C';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="h-3 w-3" style={{ color: getSeverityColor(severity) }} />;
      case 'Medium':
        return <AlertCircle className="h-3 w-3" style={{ color: getSeverityColor(severity) }} />;
      case 'Low':
        return <Info className="h-3 w-3" style={{ color: getSeverityColor(severity) }} />;
      default:
        return <Info className="h-3 w-3" style={{ color: getSeverityColor(severity) }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#F04438';
      case 'Under Investigation':
        return '#FEC84B';
      case 'Mitigated':
        return '#12B76A';
      case 'Resolved':
        return '#72D4D4';
      default:
        return '#6E757C';
    }
  };

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>
                  SITREP
                </CardTitle>
                {/* Latest/Historical/Drafts Toggle */}
                <div className="flex items-center rounded-[4px] border border-border overflow-hidden">
                  <button
                    onClick={() => setViewMode('latest')}
                    className={`h-[22.75px] px-3 caption transition-colors ${
                      viewMode === 'latest'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-transparent text-card-foreground hover:bg-muted'
                    }`}
                  >
                    Latest
                  </button>
                  <button
                    onClick={() => setViewMode('historical')}
                    className={`h-[22.75px] px-3 caption transition-colors ${
                      viewMode === 'historical'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-transparent text-card-foreground hover:bg-muted'
                    }`}
                  >
                    Historical
                  </button>
                  <button
                    onClick={() => setViewMode('drafts')}
                    className={`h-[22.75px] px-3 caption transition-colors ${
                      viewMode === 'drafts'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-transparent text-card-foreground hover:bg-muted'
                    }`}
                  >
                    Drafts
                  </button>
                </div>
              </div>

              {/* Create Draft Button - Only show when Latest is selected */}
              {viewMode === 'latest' && (
                <button
                  onClick={createNewDraft}
                  className="bg-[#01669f] h-[22.75px] rounded-[4px] w-[130.625px] hover:bg-[#01669f]/90 transition-colors flex items-center justify-center relative"
                >
                  <div className="absolute left-[16px] size-[13px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                      <g>
                        <path d="M2.70833 6.5H10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
                        <path d="M6.5 2.70833V10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
                      </g>
                    </svg>
                  </div>
                  <p className="caption text-nowrap text-white ml-[21px]">
                    Create Draft
                  </p>
                </button>
              )}
            </div>
            {viewMode === 'latest' && (
              <div className="flex items-center gap-4" style={{ fontSize: '12px', color: 'white', lineHeight: '1.2' }}>
                <span style={{ fontSize: '12px' }}>Authored by Operations Coordinator M. Stevens at Jun 11, 2026, 21:15 EST</span>
                <span style={{ fontSize: '12px' }}>Approved by IC Chief R. Mendez at Jun 11, 2026, 21:30 EST</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {/* Drafts View */}
          {viewMode === 'drafts' && (
            <div className="space-y-4">
              {/* Create Draft Button */}
              <button
                onClick={createNewDraft}
                className="bg-[#01669f] h-[22.75px] rounded-[4px] w-[195px] hover:bg-[#01669f]/90 transition-colors flex items-center justify-center relative"
              >
                <div className="absolute left-[16px] size-[13px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                    <g>
                      <path d="M2.70833 6.5H10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
                      <path d="M6.5 2.70833V10.2917" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
                    </g>
                  </svg>
                </div>
                <p className="caption text-nowrap text-white ml-[21px]">
                  Create Draft
                </p>
              </button>

              {/* Drafts List */}
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-border rounded-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(2, 163, 254, 0.08) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(20, 23, 26) 0%, rgb(20, 23, 26) 100%)'
                  }}
                >
                  {/* Draft Header */}
                  <div className={`p-3 ${expandedDrafts.has(draft.id) ? 'border-b border-border' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div
                        className="flex items-start gap-2 flex-1 cursor-pointer"
                        onClick={() => toggleDraft(draft.id)}
                      >
                        {expandedDrafts.has(draft.id) ? (
                          <ChevronDown className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className="caption text-white">{draft.title}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="caption text-muted-foreground">{draft.timestamp}</span>
                            <span className="caption text-muted-foreground">by {draft.createdBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Draft Content (Expanded) */}
                  {expandedDrafts.has(draft.id) && (
                    <div className="p-4 space-y-4 bg-card/50">
                      <Textarea
                        placeholder="Enter draft content..."
                        className="min-h-[200px] resize-y bg-input-background border-border text-card-foreground"
                        defaultValue={draft.content}
                      />
                      <div className="flex gap-3">
                        <Button
                          className="bg-primary hover:bg-primary/90"
                        >
                          Save Draft
                        </Button>
                        <Button
                          variant="outline"
                        >
                          Publish
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Historical Version Selector - Only show when Historical is selected */}
          {viewMode === 'historical' && (
            <div className="space-y-2">
              <Popover open={versionDropdownOpen} onOpenChange={setVersionDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={versionDropdownOpen}
                    className={`${isMapView ? 'w-full' : 'w-1/2'} justify-between border-border bg-input-background text-card-foreground hover:bg-muted h-8`}
                  >
                    <span className="caption truncate">
                      {selectedVersion
                        ? historicalVersions.find(v => v.id === selectedVersion)
                          ? `Version at ${historicalVersions.find(v => v.id === selectedVersion)!.timestamp} created by ${historicalVersions.find(v => v.id === selectedVersion)!.createdBy}`
                          : "Select a version..."
                        : "Select a version..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 bg-card border-border" align="start">
                  <Command className="bg-card">
                    <CommandInput placeholder="Search versions..." className="h-8 caption" />
                    <CommandEmpty className="py-2 text-center caption text-muted-foreground">No version found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {historicalVersions.map((version) => (
                        <CommandItem
                          key={version.id}
                          onSelect={() => {
                            setSelectedVersion(version.id);
                            setVersionDropdownOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-3 w-3",
                              selectedVersion === version.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="caption">Version at {version.timestamp} created by {version.createdBy}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          {/* Latest View - Tabs and Textarea */}
          {viewMode === 'latest' && (
            <>
              {/* SITREP Tabs */}
              <div className="bg-card border-b border-border -mx-6 px-6 mb-3">
                <div className="flex items-center gap-1 overflow-x-auto justify-start">
                  {['tab1', 'tab2', 'tab3', 'tab4', 'tab5'].map((tab, index) => {
                    const isActive = tab === selectedSitrepTab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setSelectedSitrepTab(tab)}
                        className={`relative transition-colors whitespace-nowrap px-2 py-3 ${
                          isActive
                            ? 'text-accent'
                            : 'text-foreground hover:text-accent'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="caption">
                            Tab {index + 1}
                          </span>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-border rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(2, 163, 254, 0.08) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(20, 23, 26) 0%, rgb(20, 23, 26) 100%)'
            }}
          >
            {/* Alert Header */}
            <div className={`p-3 ${expandedAlerts.has(alert.id) ? 'border-b border-border' : ''}`}>
              <div className="flex items-start justify-between">
                <div
                  className="flex items-start gap-2 flex-1 cursor-pointer"
                  onClick={() => toggleAlert(alert.id)}
                >
                  {expandedAlerts.has(alert.id) ? (
                    <ChevronDown className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="caption text-white">{alert.title}</span>
                    {!expandedAlerts.has(alert.id) && (
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5">
                          {getSeverityIcon(alert.severity)}
                          <span className="caption" style={{ color: getSeverityColor(alert.severity) }}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="caption" style={{ color: getStatusColor(alert.status) }}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Details (Expanded) */}
            {expandedAlerts.has(alert.id) && (
              <div className="p-4 space-y-4 bg-card/50">
                {/* Description */}
                {alert.description && (
                  <div>
                    <label className="text-white mb-1 block">Description</label>
                    <p className="caption text-white">{alert.description}</p>
                  </div>
                )}

                {/* Alert Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white mb-1 block">Severity</label>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <span className="caption" style={{ color: getSeverityColor(alert.severity) }}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-white mb-1 block">Status</label>
                    <span className="caption" style={{ color: getStatusColor(alert.status) }}>
                      {alert.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-white mb-1 block">Timestamp</label>
                    <p className="caption text-white">{formatTimestamp(alert.timestamp)}</p>
                  </div>
                  <div>
                    <label className="text-white mb-1 block">Source</label>
                    <p className="caption text-white">{alert.source}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Draft Modal */}
      <Dialog open={createDraftModalOpen} onOpenChange={setCreateDraftModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto" style={{ maxWidth: '1344px' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ marginTop: '10px' }}>
              <FileText className="w-5 h-5 text-accent" />
              New Draft SITREP
            </DialogTitle>
            <div className="mt-3 flex items-center gap-2">
              {/* Generate Button */}
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  // Placeholder - AI generation would happen here
                }}
                disabled={selectedDatasources.length === 0}
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </Button>

              {/* Select Data Sources Dropdown */}
              <Popover open={datasourceDropdownOpen} onOpenChange={setDatasourceDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Select Data Sources
                    {selectedDatasources.length > 0 && (
                      <span className="ml-1 text-xs">({selectedDatasources.length})</span>
                    )}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0 bg-card border-border" align="start">
                  <div className="p-3 max-h-[300px] overflow-auto">
                    {/* Select All Option */}
                    <div
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 cursor-pointer border-b border-border mb-2"
                      onClick={() => {
                        if (selectedDatasources.length === availableDatasources.length) {
                          setSelectedDatasources([]);
                        } else {
                          setSelectedDatasources(availableDatasources.map(d => d.id));
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedDatasources.length === availableDatasources.length}
                        onCheckedChange={() => {
                          if (selectedDatasources.length === availableDatasources.length) {
                            setSelectedDatasources([]);
                          } else {
                            setSelectedDatasources(availableDatasources.map(d => d.id));
                          }
                        }}
                      />
                      <label className="text-sm text-foreground cursor-pointer flex-1 font-semibold">
                        Select All
                      </label>
                    </div>

                    {/* Individual Options */}
                    {availableDatasources.map((datasource) => (
                      <div
                        key={datasource.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 rounded cursor-pointer"
                        onClick={() => toggleDatasource(datasource.id)}
                      >
                        <Checkbox
                          checked={selectedDatasources.includes(datasource.id)}
                          onCheckedChange={() => toggleDatasource(datasource.id)}
                        />
                        <label className="text-sm text-foreground cursor-pointer flex-1">
                          {datasource.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </DialogHeader>

          {/* SITREP Tabs in Modal */}
          <div className="bg-card border-b border-border -mx-6 px-6">
            <div className="flex items-center gap-1 overflow-x-auto justify-start">
              {['tab1', 'tab2', 'tab3', 'tab4', 'tab5'].map((tab, index) => {
                const isActive = tab === selectedModalTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedModalTab(tab)}
                    className={`relative transition-colors whitespace-nowrap px-2 py-3 ${
                      isActive
                        ? 'text-accent'
                        : 'text-foreground hover:text-accent'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="caption">
                        Tab {index + 1}
                      </span>
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

          {/* Placeholder for text editor controls */}
          <div className="mt-3 text-left">
            <span className="text-sm text-white">[placeholder for text editor controls]</span>
          </div>

          <div className="mt-4 space-y-4">
            <Textarea
              value={newDraftContent}
              onChange={(e) => setNewDraftContent(e.target.value)}
              placeholder="Enter SITREP content..."
              className="min-h-[400px] resize-y bg-input-background border-border text-card-foreground"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitDraft}
                className="bg-primary hover:bg-primary/90"
              >
                Submit for Review
              </Button>
              <Button
                onClick={() => setCreateDraftModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

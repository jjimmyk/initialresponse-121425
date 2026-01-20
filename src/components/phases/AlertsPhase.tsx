import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Info, AlertCircle, FileText, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface AlertsPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
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

export function AlertsPhase({ data = {}, onDataChange, onComplete, onPrevious }: AlertsPhaseProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewTab, setSelectedReviewTab] = useState<string>('tab1');
  const [isEditingProposed, setIsEditingProposed] = useState(false);
  const [editableProposedSitrep, setEditableProposedSitrep] = useState('');

  // Current SITREP content
  const currentSitrep = `SITUATION REPORT – FIFA WORLD CUP 2026 SEMIFINAL
Miami, FL | Hard Rock Stadium | Jun 11, 2026, 21:00 EST

EXECUTIVE SUMMARY:
FIFA World Cup 2026 Semifinal match between Brazil and Germany underway at Hard Rock Stadium with 65,442 spectators in attendance (98.4% capacity). Match commenced at 20:00 EST with enhanced security posture in place. Current score: Brazil 2 - Germany 1 (68th minute). Crowd energy high; no major security incidents reported. All operational sectors performing nominally.

VENUE STATUS:
Hard Rock Stadium operations NORMAL with heightened security protocols per FIFA World Cup designation. All ingress/egress points secured; crowd management teams positioned at designated zones. Emergency medical stations staffed at 100%; 3 minor medical incidents treated on-site (heat exhaustion x2, minor injury x1).`;

  // Proposed SITREP content
  const proposedSitrep = `SITUATION REPORT – FIFA WORLD CUP 2026 SEMIFINAL
Miami, FL | Hard Rock Stadium | Jun 11, 2026, 21:30 EST

EXECUTIVE SUMMARY:
FIFA World Cup 2026 Semifinal concluded at Hard Rock Stadium. Final score: Brazil 3 - Germany 2. Match completed successfully with 65,442 spectators. Post-match egress underway with orderly crowd dispersal. Enhanced security maintained throughout event. All operational objectives achieved without major incidents.

VENUE STATUS:
Hard Rock Stadium transitioning to post-event operations. All egress points open; crowd management teams coordinating systematic dispersal by stadium sections. Emergency medical stations remain active; total of 5 minor medical incidents treated (heat exhaustion x3, minor injuries x2). Stadium infrastructure performed nominally throughout event.

POST-MATCH OPERATIONS:
Crowd dispersal 40% complete as of 21:30 EST. Public transit coordination active with Miami-Dade Transit Authority; shuttle buses and extended Metrorail service accommodating approximately 45% of attendees. Traffic flow monitored by Miami-Dade Police; estimated full clearance by 22:45 EST. No crowd control incidents reported. VIP departures completed successfully.`;

  const [alerts] = useState<Alert[]>([
    {
      id: '0',
      title: 'SITREP Draft Review Requested – Operational Period 1 Update',
      description: 'Operations Coordinator M. Stevens has submitted a draft SITREP for Operational Period 1 (Jun 11, 2026, 21:00-23:59 EST) and is requesting review and approval from Incident Command. The draft includes updates on containment operations, shoreline protection measures, wildlife response activities, and resource deployment status. Please review the draft in the Reports tab and provide approval or feedback before the next operational period briefing scheduled for 23:30 EST.',
      severity: '',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      source: 'Operations Coordinator / Planning Section',
      status: ''
    },
    {
      id: '1',
      title: 'Oil Sheen Expansion Detected – Northward Drift Toward Sensitive Coral Reefs',
      description: 'Aerial surveillance and satellite imagery indicate the surface oil sheen has expanded approximately 2.5 nautical miles northward over the past 6 hours, driven by prevailing currents and NE trade winds. Current trajectory projects potential impact to protected coral reef areas within 18-24 hours if containment boom deployment is delayed. Environmental response teams mobilizing additional skimming vessels and boom resources. Immediate action required to establish containment perimeter and prevent ecological damage to reef ecosystems and marine sanctuary zones.',
      severity: 'High',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      source: 'NOAA Aerial Surveillance / Environmental Response',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Shoreline Impact Imminent – Beach Closures and Public Health Advisory Issued',
      description: 'Oceanographic modeling predicts oil may reach windward shorelines (Kailua, Lanikai, Waimanalo beaches) within 12-16 hours based on current wind and tidal patterns. County Emergency Management has issued precautionary beach closures and public health advisory warning residents to avoid water contact and report oil sightings. Shoreline Assessment Teams pre-positioning equipment and personnel for rapid response. Coordination with Hawaii DOH for water quality monitoring and potential fishery closures in affected zones.',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      source: 'County Emergency Management / NOAA',
      status: 'Under Investigation'
    },
    {
      id: '3',
      title: 'Wildlife Rescue Operations Activated – Seabird and Marine Mammal Impacts Reported',
      description: 'Wildlife response teams report initial sightings of oiled seabirds (albatross, shearwaters) and one juvenile Hawaiian monk seal within the spill impact zone. Wildlife rehabilitation facilities at Kewalo Basin and Kalaeloa activated and preparing to receive affected animals. Coordination with NOAA Marine Mammal Response and USFWS for rescue operations, field triage, and rehabilitation capacity. Vessel operators and aircraft crews briefed on wildlife reporting protocols. Enhanced monitoring established for sea turtle nesting sites and monk seal haul-out areas.',
      severity: 'Medium',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      source: 'NOAA Marine Mammal Response / USFWS',
      status: 'Mitigated'
    }
  ]);

  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

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

  return (
    <div className="space-y-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-[#222529] rounded-lg border border-[#6e757c] relative">
        <div className="flex items-center justify-between px-[13px] py-3 w-full border-b-2 border-border rounded-t-lg rounded-b-none">
          <p className="caption text-nowrap text-white whitespace-pre">
            Notifications
          </p>
        </div>
      </div>

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
                    
                    {/* Review SITREP Button - Only for SITREP review notification */}
                    {alert.id === '0' && !expandedAlerts.has(alert.id) && (
                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewModalOpen(true);
                          }}
                          className="bg-[#01669f] h-[22.75px] rounded-[4px] px-3 hover:bg-[#01669f]/90 transition-colors caption text-white"
                        >
                          Review SITREP
                        </button>
                      </div>
                    )}
                    
                    {!expandedAlerts.has(alert.id) && alert.id !== '0' && (
                      <div className="flex items-center gap-3 mt-1">
                        {alert.severity && (
                          <div className="flex items-center gap-1.5">
                            {getSeverityIcon(alert.severity)}
                            <span className="caption" style={{ color: getSeverityColor(alert.severity) }}>
                              {alert.severity}
                            </span>
                          </div>
                        )}
                        {alert.status && (
                          <div className="flex items-center gap-1.5">
                            <span className="caption" style={{ color: getStatusColor(alert.status) }}>
                              {alert.status}
                            </span>
                          </div>
                        )}
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

      {/* SITREP Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto" style={{ maxWidth: '1344px' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ marginTop: '10px' }}>
              <FileText className="w-5 h-5 text-accent" />
              Review SITREP Draft
            </DialogTitle>
          </DialogHeader>

          {/* SITREP Tabs in Review Modal */}
          <div className="bg-card border-b border-border -mx-6 px-6">
            <div className="flex items-center gap-1 overflow-x-auto justify-start">
              {['tab1', 'tab2', 'tab3', 'tab4', 'tab5'].map((tab, index) => {
                const isActive = tab === selectedReviewTab;
                const tabNumber = index + 1;
                const tabNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
                const tabName = tabNames[index];
                const showNotification = tabNumber === 2 || tabNumber === 4;
                
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedReviewTab(tab)}
                    className={`relative transition-colors whitespace-nowrap px-2 py-3 ${
                      isActive
                        ? 'text-accent'
                        : 'text-foreground hover:text-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {showNotification && (
                        <div className="rounded-full w-2.5 h-2.5" style={{ backgroundColor: '#60a5fa', minWidth: '10px', minHeight: '10px' }}></div>
                      )}
                      <span className="caption">
                        Tab {tabName}
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
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Current SITREP - Left Side */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Current SITREP</h3>
              <div className="flex flex-col gap-1" style={{ fontSize: '15px', color: 'white', lineHeight: '1.2' }}>
                <span style={{ fontSize: '15px' }}>Authored by SITL M. Stevens at Jun 11, 2026, 21:00 EST</span>
                <span style={{ fontSize: '15px' }}>Approved by IC R. Mendez at Jun 11, 2026, 21:15 EST</span>
              </div>
              <div className="p-4 bg-input-background rounded-lg border border-border min-h-[500px] max-h-[60vh] overflow-y-auto overflow-x-hidden">
                <div className="text-xs text-white" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{currentSitrep}</div>
              </div>
            </div>

            {/* Proposed SITREP - Right Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Proposed SITREP</h3>
                {!isEditingProposed && (
                  <button
                    onClick={() => {
                      setEditableProposedSitrep(proposedSitrep);
                      setIsEditingProposed(true);
                    }}
                    className="p-1 hover:bg-muted/30 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1" style={{ fontSize: '15px', color: 'white', lineHeight: '1.2' }}>
                <span style={{ fontSize: '15px' }}>Authored by Operations Coordinator M. Stevens at Jun 11, 2026, 21:30 EST</span>
                <span style={{ fontSize: '15px', visibility: 'hidden' }}>Placeholder for alignment</span>
              </div>
              {isEditingProposed ? (
                <>
                  <Textarea
                    value={editableProposedSitrep}
                    onChange={(e) => setEditableProposedSitrep(e.target.value)}
                    className="min-h-[500px] max-h-[60vh] resize-y bg-input-background text-card-foreground text-xs"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word', borderColor: '#3b82f6', borderWidth: '2px' }}
                  />
                  <Button
                    onClick={() => {
                      // Update draft logic here
                      setIsEditingProposed(false);
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Update Draft
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-input-background rounded-lg border border-border min-h-[500px] max-h-[60vh] overflow-y-auto overflow-x-hidden">
                  <div className="text-xs text-white" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{proposedSitrep}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                // Approve logic here
                setReviewModalOpen(false);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve SITREP
            </Button>
            <Button
              onClick={() => {
                // Deny logic here
                setReviewModalOpen(false);
              }}
              variant="destructive"
            >
              Deny SITREP
            </Button>
            <Button
              onClick={() => setReviewModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

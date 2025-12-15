import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown, Map, Sparkles } from 'lucide-react';
import svgPaths from '../../imports/svg-7hg6d30srz';

interface Action {
  id: string;
  description: string;
  status: string;
  assignee?: string;
  time?: string;
  date?: string;
  timezone?: string;
}

interface Objective {
  id: string;
  title: string;
  type: 'Operational' | 'Managerial';
  actions: Action[];
}

interface ObjectivesActionsPhaseProps {
  data?: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onComplete: () => void;
  onPrevious?: () => void;
  onRecommendActions?: () => void;
  hideRecommendActions?: boolean;
  addActionButtonText?: string;
}

export function ObjectivesActionsPhase({ data = {}, onDataChange, onComplete, onPrevious, onRecommendActions, hideRecommendActions = false, addActionButtonText = 'Add Actions' }: ObjectivesActionsPhaseProps) {
  const [objectives, setObjectives] = useState<Objective[]>(data.objectives || [
    {
      id: '1',
      title: 'Sustain critical defense power at Kaneohe MCB Headquarters and adjacent mission facilities for 48 hours.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Pre‑position fuel and validate generator starts at MCBH HQ; conduct 2‑hour loaded run and transfer switch test within 6 hours.',
          status: 'Current',
          assignee: 'Base Facilities (MCBH)'
        },
        {
          id: '2',
          description: 'Establish rolling 12‑hour fuel resupply schedule and road permissions for windward access routes; confirm vendor availability.',
          status: 'Current',
          assignee: 'USMC G‑4 Logistics'
        },
        {
          id: '3',
          description: 'Designate essential loads (C2, medical, comms) and shed non‑critical circuits to extend runtime to >24 hours.',
          status: 'Planned (12h)',
          assignee: 'Base Electrical Supervisor'
        }
      ]
    },
    {
      id: '2',
      title: 'Stabilize Oahu grid reliability and reduce single‑point risks on priority 138 kV corridors.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Coordinate with utility for preventative switching and additional spinning reserves; prioritize voltage support to windward feeders.',
          status: 'Current',
          assignee: 'INDOPACOM J35 with Utility Grid Ops'
        },
        {
          id: '2',
          description: 'Patrol wind‑exposed spans and substations; clear vegetation and pre‑stage rapid response crews and materials.',
          status: 'Current',
          assignee: 'Utility Field Operations'
        },
        {
          id: '3',
          description: 'Identify and publish contingency re‑dispatch plans for unexpected unit trips; distribute to EOCs and defense liaisons.',
          status: 'Planned (24h)',
          assignee: 'State Energy Office'
        }
      ]
    },
    {
      id: '3',
      title: 'Assure lifeline continuity on Oahu (water/wastewater, hospitals, telecom) during grid instability.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Confirm emergency power readiness at high‑lift pumping stations; prepare conservation messaging and boil‑water advisory templates.',
          status: 'Current',
          assignee: 'Honolulu Board of Water Supply'
        },
        {
          id: '2',
          description: 'Validate hospital generator capacity and fuel stocks (24–72h); coordinate prioritized resupply and patient movement contingencies.',
          status: 'Current',
          assignee: 'HI DOH / Hospital Coalition'
        },
        {
          id: '3',
          description: 'Coordinate with telecom carriers to sustain 911 PSAPs and macro sites; deploy portable gensets where battery buffers are limited.',
          status: 'Planned (24h)',
          assignee: 'Telecom ESF‑2 Lead'
        }
      ]
    },
    {
      id: '4',
      title: 'Strengthen cyber‑physical posture for generation, transmission, and vendor remote access.',
      type: 'Managerial',
      actions: [
        {
          id: '1',
          description: 'Tighten vendor allowlists and MFA re‑validation for remote access; monitor OT networks for atypical protocols and lateral movement.',
          status: 'Current',
          assignee: 'Utility OT/ICS Security Lead'
        },
        {
          id: '2',
          description: 'Establish 4‑hour SITREP cadence (Utility, State, INDOPACOM) with dependency map updates and prioritized mitigations.',
          status: 'Current',
          assignee: 'INDOPACOM J3/J35'
        },
        {
          id: '3',
          description: 'Rehearse manual fallback procedures for plant start/stop; verify offline backups and gold images for critical HMIs/servers.',
          status: 'Planned (48h)',
          assignee: 'Plant Operations Manager'
        }
      ]
    }
  ]);

  const [editingObjective, setEditingObjective] = useState<string | null>(null);
  const [editingObjectiveOriginal, setEditingObjectiveOriginal] = useState<Objective | null>(null);
  const [editingAction, setEditingAction] = useState<{ objectiveId: string; actionId: string } | null>(null);
  const [editingActionOriginal, setEditingActionOriginal] = useState<Action | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedObjectives, setExpandedObjectives] = useState<Set<string>>(new Set(objectives.map(o => o.id)));
  const [showRecommended, setShowRecommended] = useState<Set<string>>(new Set());

  // Plausible IACI-centric assignees for an ongoing cyber attack
  const officialNames: string[] = [
    'IACI‑CERT Incident Lead',
    'IACInet Intelligence Lead',
    'Sector ISAC Analyst',
    'Member Organization SOC Lead',
    'CISA Central Liaison',
    'FBI Cyber Task Force Liaison',
    'SRMA Sector Liaison',
    'OT/ICS Security Lead',
    'Cloud Provider CSIRT',
    'Legal & Privacy Counsel',
    'Public Affairs (JIC)',
    'CISO, Member Organization'
  ];

  const getRecommendedActionsForObjective = (objectiveTitle: string): Action[] => {
    const title = objectiveTitle.toLowerCase();
    const makeId = (suffix: number) => `${Date.now()}-${suffix}`;

    // Life safety / rescue / sheltering
    if (
      title.includes('life') ||
      title.includes('rescue') ||
      title.includes('evacu') ||
      title.includes('shelter') ||
      title.includes('stabilize')
    ) {
      return [
        {
          id: makeId(1),
          description: 'Conduct high-water rescues and welfare checks in Cape Fear and Neuse basin communities; stage boats and HMMWVs at county EOCs (next 12–24 hrs).',
          status: 'Current',
        },
        {
          id: makeId(2),
          description: 'Sustain shelter operations for ~15,000 evacuees; ensure ADA access, medical triage, and behavioral health; coordinate supply chain (cots, blankets, meds).',
          status: 'Current',
        },
        {
          id: makeId(3),
          description: 'Execute targeted evacuations for neighborhoods with crest forecasts > major flood stage; issue IPAWS alerts and door-to-door notifications.',
          status: 'Current',
        },
        {
          id: makeId(4),
          description: 'Establish missing-persons tracking and reunification workflow with ARC and local PSAPs; update every 4 hours.',
          status: 'Planned (24h)',
        },
      ];
    }

    // Critical infrastructure / power / water / transportation
    if (
      title.includes('infrastructure') ||
      title.includes('power') ||
      title.includes('water') ||
      title.includes('transport') ||
      title.includes('corridor') ||
      title.includes('restore')
    ) {
      return [
        {
          id: makeId(1),
          description: 'Prioritize power restoration for hospitals, water/wastewater plants, and shelters; deploy generators and fuel support where grid access is delayed.',
          status: 'Current',
        },
        {
          id: makeId(2),
          description: 'Issue/maintain boil-water advisories; distribute bottled water; deploy mobile testing teams to impacted systems in six affected counties.',
          status: 'Current',
        },
        {
          id: makeId(3),
          description: 'Clear debris from priority routes; conduct bridge inspections; plan phased reopening of I‑95 and US‑70 when waters recede and safety checks pass.',
          status: 'Current',
        },
        {
          id: makeId(4),
          description: 'Stand up debris management sites and hazardous waste segregation in coordination with NCDEQ and county public works.',
          status: 'Planned (48–72h)',
        },
      ];
    }

    // Unified command / situational awareness / FEMA coordination
    if (
      title.includes('unified') ||
      title.includes('situational') ||
      title.includes('awareness') ||
      title.includes('fema') ||
      title.includes('command') ||
      title.includes('coordination')
    ) {
      return [
        {
          id: makeId(1),
          description: 'Activate Unified Command (NCEM, FEMA, NCNG, NCDOT, NCDEQ, utilities); set operational period schedule and SITREP cadence (AM/PM).',
          status: 'Current',
        },
        {
          id: makeId(2),
          description: 'Publish twice-daily river forecasts and flood-inundation maps; synchronize evacuation zones and public messaging with county PIOs.',
          status: 'Current',
        },
        {
          id: makeId(3),
          description: 'Establish regional logistics staging areas; track mission assignments (rescue, sheltering, debris) and resource requests in WebEOC.',
          status: 'Current',
        },
        {
          id: makeId(4),
          description: 'Coordinate federal assistance under DR‑4393‑NC; align state mission tasks with FEMA resource offerings (USAR, IA/PA, commodities).',
          status: 'Planned (24–48h)',
        },
      ];
    }

    // Fallback: generic flood-response actions
    return [
      { id: makeId(1), description: 'Validate life safety priorities; confirm rescue/sheltering posture and unmet needs with county EOCs.', status: 'Current' },
      { id: makeId(2), description: 'Update power/water restoration timelines; identify critical facilities needing generators or fuel resupply.', status: 'Current' },
      { id: makeId(3), description: 'Publish unified public messaging on travel restrictions, boil-water advisories, and assistance programs.', status: 'Planned (24h)' },
    ];
  };

  const updateData = (newObjectives: Objective[]) => {
    setObjectives(newObjectives);
    onDataChange({ ...data, objectives: newObjectives });
  };

  const addObjective = (position: 'top' | 'bottom' = 'bottom') => {
    const newObjective: Objective = {
      id: Date.now().toString(),
      title: '',
      type: 'Operational',
      actions: []
    };
    if (position === 'top') {
      updateData([newObjective, ...objectives]);
    } else {
      updateData([...objectives, newObjective]);
    }
    // Set the new objective to editing mode and expand it
    setEditingObjectiveOriginal({ ...newObjective });
    setEditingObjective(newObjective.id);
    setExpandedObjectives(prev => new Set([...prev, newObjective.id]));
  };

  const updateObjectiveTitle = (id: string, title: string) => {
    const updated = objectives.map(obj =>
      obj.id === id ? { ...obj, title } : obj
    );
    updateData(updated);
  };

  const updateObjectiveType = (id: string, type: 'Operational' | 'Managerial') => {
    const updated = objectives.map(obj =>
      obj.id === id ? { ...obj, type } : obj
    );
    updateData(updated);
  };

  const deleteObjective = (id: string) => {
    updateData(objectives.filter(obj => obj.id !== id));
  };

  const startEditingObjective = (objective: Objective) => {
    setEditingObjectiveOriginal({ ...objective });
    setEditingObjective(objective.id);
  };

  const saveObjectiveEdit = () => {
    setEditingObjective(null);
    setEditingObjectiveOriginal(null);
  };

  const cancelObjectiveEdit = () => {
    if (editingObjectiveOriginal) {
      const updated = objectives.map(obj =>
        obj.id === editingObjectiveOriginal.id ? editingObjectiveOriginal : obj
      );
      updateData(updated);
    }
    setEditingObjective(null);
    setEditingObjectiveOriginal(null);
  };

  const addAction = (objectiveId: string) => {
    const newAction: Action = {
      id: Date.now().toString(),
      description: '',
      status: 'Current',
      assignee: '',
      time: '',
      date: '',
      timezone: 'UTC'
    };
    const updated = objectives.map(obj =>
      obj.id === objectiveId 
        ? { ...obj, actions: [...obj.actions, newAction] }
        : obj
    );
    updateData(updated);
  };

  const updateAction = (objectiveId: string, actionId: string, field: keyof Action, value: string) => {
    const updated = objectives.map(obj =>
      obj.id === objectiveId
        ? {
            ...obj,
            actions: obj.actions.map(action =>
              action.id === actionId ? { ...action, [field]: value } : action
            )
          }
        : obj
    );
    updateData(updated);
  };

  const deleteAction = (objectiveId: string, actionId: string) => {
    const updated = objectives.map(obj =>
      obj.id === objectiveId
        ? { ...obj, actions: obj.actions.filter(action => action.id !== actionId) }
        : obj
    );
    updateData(updated);
  };

  const startEditingAction = (objectiveId: string, action: Action) => {
    setEditingActionOriginal({ ...action });
    setEditingAction({ objectiveId, actionId: action.id });
  };

  const saveActionEdit = () => {
    setEditingAction(null);
    setEditingActionOriginal(null);
  };

  const cancelActionEdit = () => {
    if (editingActionOriginal && editingAction) {
      const updated = objectives.map(obj =>
        obj.id === editingAction.objectiveId
          ? {
              ...obj,
              actions: obj.actions.map(action =>
                action.id === editingAction.actionId ? editingActionOriginal : action
              )
            }
          : obj
      );
      updateData(updated);
    }
    setEditingAction(null);
    setEditingActionOriginal(null);
  };

  

  const toggleObjective = (objectiveId: string) => {
    setExpandedObjectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(objectiveId)) {
        newSet.delete(objectiveId);
      } else {
        newSet.add(objectiveId);
      }
      return newSet;
    });
  };

  const toggleRecommended = (objectiveId: string) => {
    setShowRecommended(prev => {
      const next = new Set(prev);
      const enabling = !next.has(objectiveId);
      if (enabling) {
        next.add(objectiveId);
        onRecommendActions && onRecommendActions();
        // If no actions, generate context-aware actions based on the objective title
        const updated = objectives.map(obj => {
          if (obj.id !== objectiveId) return obj;
          const hasActions = obj.actions && obj.actions.length > 0;
          const actionsToUse = hasActions ? obj.actions : getRecommendedActionsForObjective(obj.title);
          return {
            ...obj,
            actions: actionsToUse.map((action, idx) => ({
              ...action,
              assignee:
                action.assignee && action.assignee.trim().length > 0
                  ? action.assignee
                  : officialNames[idx % officialNames.length],
            })),
          };
        });
        updateData(updated);
      } else {
        next.delete(objectiveId);
      }
      return next;
    });
  };

  // Filter objectives based on search term
  const filteredObjectives = objectives.filter(objective => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Search in objective title
    if (objective.title.toLowerCase().includes(searchLower)) return true;
    
    // Search in action descriptions
    return objective.actions.some(action => 
      action.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-[#222529] rounded-lg border border-[#6e757c] relative">
        <div className="flex items-center justify-between px-[13px] py-3 w-full border-b-2 border-border rounded-t-lg rounded-b-none">
          {/* Title */}
          <div className="relative shrink-0">
            <p className="caption text-nowrap text-white whitespace-pre">
              Objectives &amp; Actions
            </p>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-[29px]">
            <div className="relative h-[26px] w-[195px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="box-border w-full h-[26px] bg-transparent border border-[#6e757c] rounded-[4px] px-[26px] py-[3.25px] caption text-white placeholder:text-[#6e757c] focus:outline-none focus:border-accent"
              />
              <div className="absolute left-[8px] size-[11.375px] top-[7.44px] pointer-events-none">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                  <g>
                    <path d={svgPaths.p3a3bec00} stroke="#6E757C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.710938" />
                    <path d={svgPaths.p380aaa80} stroke="#6E757C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.710938" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Objective and Add Action Buttons - Below Header */}
      <div className="flex items-center justify-start gap-3 px-4">
        <button
          onClick={() => addObjective('top')}
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
            Add Objective
          </p>
        </button>
        <button
          onClick={() => {
            // Does nothing for now
          }}
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
            Add Action
          </p>
        </button>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {filteredObjectives.map((objective) => (
          <div
            key={objective.id}
            className="border border-border rounded-lg overflow-hidden"
            style={{ 
              background: 'linear-gradient(90deg, rgba(104, 118, 238, 0.08) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(20, 23, 26) 0%, rgb(20, 23, 26) 100%)'
            }}
          >
            {/* Objective Header */}
            <div className={`p-3 ${expandedObjectives.has(objective.id) ? 'border-b border-border' : ''}`}>
              {editingObjective === objective.id ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={objective.type}
                      onValueChange={(value) => updateObjectiveType(objective.id, value as 'Operational' | 'Managerial')}
                    >
                      <SelectTrigger 
                        className="w-14 h-[22px] bg-input-background border-border !text-[12px] flex-shrink-0"
                        style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: '1.5' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent onClick={(e) => e.stopPropagation()}>
                        <SelectItem 
                          value="Operational"
                          className="!text-[12px]"
                          style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: '1.5' }}
                        >
                          O
                        </SelectItem>
                        <SelectItem 
                          value="Managerial"
                          className="!text-[12px]"
                          style={{ fontFamily: "'Open Sans', sans-serif", lineHeight: '1.5' }}
                        >
                          M
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={objective.title}
                      onChange={(e) => updateObjectiveTitle(objective.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveObjectiveEdit();
                        if (e.key === 'Escape') cancelObjectiveEdit();
                      }}
                      placeholder="Enter objective text"
                      autoFocus
                      className="bg-input-background border-border text-card-foreground caption"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveObjectiveEdit();
                      }}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 h-[22.75px] px-3"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelObjectiveEdit();
                      }}
                      variant="outline"
                      size="sm"
                      className="border-border h-[22.75px] px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start gap-2 flex-1 cursor-pointer"
                    onClick={() => toggleObjective(objective.id)}
                  >
                    <span className="caption">{objective.title}</span>
                  </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle map action here
                  }}
                  className="p-1 hover:bg-muted/30 rounded transition-colors"
                >
                  <Map className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditingObjective(objective);
                  }}
                  className="p-1 hover:bg-muted/30 rounded transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteObjective(objective.id);
                  }}
                  className="p-1 hover:bg-muted/30 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
                </div>
              )}
            </div>

            {/* Actions Section */}
            {expandedObjectives.has(objective.id) && (
              <div className="pr-3">
                <div className="flex items-center justify-between my-3 pl-3">
                  <span className="caption">Actions</span>
                  <div className="flex items-center gap-2">
                    {!hideRecommendActions && (
                      <Button
                        onClick={() => toggleRecommended(objective.id)}
                        size="sm"
                        variant="outline"
                        disabled={editingObjective === objective.id}
                        className="h-auto py-1 px-3 gap-1 border-border"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="caption">Recommend Actions</span>
                      </Button>
                    )}
                    <Button
                      onClick={() => addAction(objective.id)}
                      size="sm"
                      disabled={editingObjective === objective.id}
                      className="bg-primary hover:bg-primary/90 h-auto py-1 px-3 gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="caption">{addActionButtonText}</span>
                    </Button>
                  </div>
                </div>

                {/* Actions List - hidden by default; shown when Recommend Actions toggled */}
                {showRecommended.has(objective.id) && (<div className="space-y-3 pl-3">
                  {objective.actions.map((action) => {
                    const isActionEditing = editingAction?.objectiveId === objective.id && editingAction?.actionId === action.id;
                    
                    return (
                      <div
                        key={action.id}
                        onClick={() => {
                          if (!isActionEditing) {
                            startEditingAction(objective.id, action);
                          }
                        }}
                        className={`py-3 pl-3 pr-0 bg-card/30 flex items-start gap-2 ${
                          !isActionEditing ? 'cursor-pointer' : ''
                        }`}
                      >
                        {/* Action Description */}
                        <div className="flex-1 min-w-0">
                          <Textarea
                            value={action.description}
                            onChange={(e) => updateAction(objective.id, action.id, 'description', e.target.value)}
                            placeholder="Enter action description..."
                            className="min-h-[54px] resize-y bg-input-background border-border text-card-foreground caption disabled:opacity-100 disabled:cursor-pointer disabled:border-transparent"
                            disabled={!isActionEditing}
                            onClick={(e) => isActionEditing && e.stopPropagation()}
                          />
                          
                          {/* Save/Cancel Buttons - Below Textarea when editing */}
                          {isActionEditing && (
                            <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveActionEdit();
                                }}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 h-[22.75px] px-3"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelActionEdit();
                                }}
                                variant="outline"
                                size="sm"
                                className="border-border h-[22.75px] px-3"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}

                          {/* Assignee Display */}
                          <div className="mt-2" style={{ marginLeft: '15px' }}>
                            <div className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40">
                              <span className="caption text-white">Assignee</span>
                              <Badge variant="outline" className="caption border-white text-white">
                                {action.assignee && action.assignee.trim().length > 0 ? action.assignee : 'Unassigned'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                

                        {/* Action Icon Buttons - Only show when NOT editing */}
                        {!isActionEditing && (
                          <div className="flex items-start gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle map action here
                              }}
                              className="p-1 hover:bg-muted/30 rounded transition-colors"
                            >
                              <Map className="w-3 h-3 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingAction(objective.id, action);
                              }}
                              className="p-1 hover:bg-muted/30 rounded transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAction(objective.id, action.id);
                              }}
                              className="p-1 hover:bg-muted/30 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>)}

                
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

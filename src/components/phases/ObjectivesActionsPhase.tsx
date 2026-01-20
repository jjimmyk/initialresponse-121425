import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown, Map, Sparkles, User, Mail, Phone, Briefcase } from 'lucide-react';
import svgPaths from '../../imports/svg-7hg6d30srz';

interface Action {
  id: string;
  description: string;
  status: string;
  assignee?: string;
  location?: string;
  time?: string;
  date?: string;
  timezone?: string;
  childActions?: Action[];
  notificationSentAt?: string;
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

interface PersonnelContact {
  name: string;
  position: string;
  email: string;
  phone: string;
  organization: string;
  activationStatus: string;
  activatedAt: string;
  checkedInAt: string;
  signedInAt: string;
}

// Personnel contact database matching roster data
const PERSONNEL_CONTACTS: Record<string, PersonnelContact> = {
  'Leilani Ikaika': {
    name: 'Leilani Ikaika',
    position: 'State On-Scene Coordinator (ESF-10)',
    email: 'leilani.ikaika@hawaii.gov',
    phone: '(808) 587-2650',
    organization: 'Hawaii State Emergency Management',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:00 HST',
    checkedInAt: 'Jun 11, 2026, 14:05 HST',
    signedInAt: 'Jun 11, 2026, 14:00 HST'
  },
  'Dr. Kai Nakamura': {
    name: 'Dr. Kai Nakamura',
    position: 'NOAA Scientific Support Coordinator',
    email: 'kai.nakamura@noaa.gov',
    phone: '(808) 725-5000',
    organization: 'NOAA',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:15 HST',
    checkedInAt: 'Jun 11, 2026, 14:20 HST',
    signedInAt: 'Jun 11, 2026, 14:15 HST'
  },
  'John Kealoha': {
    name: 'John Kealoha',
    position: 'EPA On-Scene Coordinator',
    email: 'john.kealoha@epa.gov',
    phone: '(808) 541-2711',
    organization: 'EPA',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:30 HST',
    checkedInAt: 'Jun 11, 2026, 14:35 HST',
    signedInAt: 'Jun 11, 2026, 14:30 HST'
  },
  'Mark Silva': {
    name: 'Mark Silva',
    position: 'OSRO Operations Manager',
    email: 'mark.silva@osro-contractor.com',
    phone: '(808) 544-5200',
    organization: 'OSRO Contractor',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 15:00 HST',
    checkedInAt: 'Jun 11, 2026, 15:05 HST',
    signedInAt: 'Jun 11, 2026, 15:00 HST'
  },
  'Cmdr. David Chen': {
    name: 'Cmdr. David Chen',
    position: 'Operations Section Chief',
    email: 'd.chen@uscg.mil',
    phone: '(808) 541-2002',
    organization: 'USCG',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:10 HST',
    checkedInAt: 'Jun 11, 2026, 14:12 HST',
    signedInAt: 'Jun 11, 2026, 14:10 HST'
  },
  'Lt. Jonah Reyes': {
    name: 'Lt. Jonah Reyes',
    position: 'Navy Environmental Affairs Liaison',
    email: 'jonah.reyes@navy.mil',
    phone: '(808) 473-2390',
    organization: 'U.S. Navy',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 15:30 HST',
    checkedInAt: 'Jun 11, 2026, 15:35 HST',
    signedInAt: 'Jun 11, 2026, 15:30 HST'
  },
  'Malia Ito': {
    name: 'Malia Ito',
    position: 'Hawaii DOH Environmental Health',
    email: 'malia.ito@doh.hawaii.gov',
    phone: '(808) 586-4424',
    organization: 'Hawaii Department of Health',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 16:00 HST',
    checkedInAt: 'Jun 11, 2026, 16:05 HST',
    signedInAt: 'Jun 11, 2026, 16:00 HST'
  },
  'Ken Lau': {
    name: 'Ken Lau',
    position: 'Public Information Officer (JIC)',
    email: 'ken.lau@uscg.mil',
    phone: '(808) 842-2612',
    organization: 'USCG',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:45 HST',
    checkedInAt: 'Jun 11, 2026, 14:50 HST',
    signedInAt: 'Jun 11, 2026, 14:45 HST'
  },
  'Sarah Kim': {
    name: 'Sarah Kim',
    position: 'Responsible Party Legal Counsel',
    email: 'sarah.kim@maritime-legal.com',
    phone: '(808) 529-3900',
    organization: 'Maritime Legal Services',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 17:00 HST',
    checkedInAt: 'Jun 11, 2026, 17:05 HST',
    signedInAt: 'Jun 11, 2026, 17:00 HST'
  },
  'Daniel Ho': {
    name: 'Daniel Ho',
    position: 'Logistics Section – Equipment Staging',
    email: 'daniel.ho@uscg.mil',
    phone: '(808) 842-2625',
    organization: 'USCG',
    activationStatus: 'Activated',
    activatedAt: 'Jun 11, 2026, 14:20 HST',
    checkedInAt: 'Jun 11, 2026, 14:25 HST',
    signedInAt: 'Jun 11, 2026, 14:20 HST'
  }
};

export function ObjectivesActionsPhase({ data = {}, onDataChange, onComplete, onPrevious, onRecommendActions, hideRecommendActions = false, addActionButtonText = 'Add Actions' }: ObjectivesActionsPhaseProps) {
  const [objectives, setObjectives] = useState<Objective[]>(data.objectives || [
    {
      id: '1',
      title: 'Contain oil spill expansion and prevent further discharge from source vessel within 24 hours.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Deploy primary containment boom (12,000 ft) around source vessel and establish 500-yard safety perimeter; conduct damage assessment and plug leaking fuel tanks.',
          status: 'Complete',
          assignee: 'Operations Section Chief - Cmdr. David Chen',
          location: 'Source Vessel Location'
        },
        {
          id: '2',
          description: 'Position 4 skimming vessels at optimal recovery zones; coordinate boom tending operations and maintain 24/7 skimming capacity during favorable sea state window.',
          status: 'In Progress',
          assignee: 'OSRO Operations Manager - Mark Silva',
          location: 'Primary Spill Zone'
        },
        {
          id: '3',
          description: 'Establish forward staging area for boom, absorbents, and disposal containers; maintain inventory of 8,000 ft reserve boom and resupply PPE for responders.',
          status: 'In Progress',
          assignee: 'Logistics Section – Equipment Staging - Daniel Ho',
          location: 'Kewalo Basin Staging Area'
        }
      ]
    },
    {
      id: '2',
      title: 'Protect priority shoreline areas and sensitive environmental resources from oil impact.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Pre-deploy protective boom at Kailua Bay, Lanikai Beach, and Waimanalo coral reef zones; prioritize monk seal haul-out areas and seabird nesting sites.',
          status: 'In Progress',
          assignee: 'Navy Environmental Affairs Liaison - Lt. Jonah Reyes',
          location: 'Windward Oahu Shoreline'
        },
        {
          id: '2',
          description: 'Conduct aerial and shoreline surveillance every 4 hours; document oil arrival times, coverage extent, and update trajectory models with current wind/tide data.',
          status: 'In Progress',
          assignee: 'NOAA Scientific Support Coordinator - Dr. Kai Nakamura',
          location: 'Affected Coastline'
        },
        {
          id: '3',
          description: 'Coordinate with USFWS and NOAA Fisheries to establish wildlife exclusion zones; pre-position rescue equipment and activate rehabilitation facilities.',
          status: 'In Progress',
          assignee: 'State On-Scene Coordinator (ESF-10) - Leilani Ikaika',
          location: 'Marine Sanctuary Zones'
        }
      ]
    },
    {
      id: '3',
      title: 'Minimize public health risks and maintain community safety during active spill response operations.',
      type: 'Operational',
      actions: [
        {
          id: '1',
          description: 'Issue beach closure orders for Kailua, Lanikai, and Waimanalo; post signage and conduct public outreach via social media and local news channels.',
          status: 'Complete',
          assignee: 'Public Information Officer (JIC) - Ken Lau',
          location: 'Windward Beach Communities'
        },
        {
          id: '2',
          description: 'Establish air quality monitoring stations at shoreline impact zones; conduct VOC sampling and provide respiratory protection guidance for nearby residents.',
          status: 'In Progress',
          assignee: 'Hawaii DOH Environmental Health - Malia Ito',
          location: 'Coastal Monitoring Sites'
        },
        {
          id: '3',
          description: 'Coordinate vessel traffic restrictions and issue NOTMAR warnings; maintain 3 NM exclusion zone and escort commercial traffic through designated corridors.',
          status: 'In Progress',
          assignee: 'Operations Section Chief - Cmdr. David Chen',
          location: 'Oahu Waters'
        }
      ]
    },
    {
      id: '4',
      title: 'Maintain unified command coordination and ensure regulatory compliance throughout response.',
      type: 'Managerial',
      actions: [
        {
          id: '1',
          description: 'Conduct twice-daily Unified Command meetings with USCG, State, EPA, and Responsible Party representatives; document decisions and track action items.',
          status: 'In Progress',
          assignee: 'State On-Scene Coordinator (ESF-10) - Leilani Ikaika',
          location: 'Joint Base Pearl Harbor-Hickam EOC'
        },
        {
          id: '2',
          description: 'Establish 4‑hour operational briefing cadence for all response sections; update ICS-209 and submit federal notification reports per NCP requirements.',
          status: 'Complete',
          assignee: 'EPA On-Scene Coordinator - John Kealoha',
          location: 'Unified Command Center'
        },
        {
          id: '3',
          description: 'Maintain financial tracking system for all response costs; coordinate Responsible Party funding approvals and document expenses for potential OSLTF claims.',
          status: 'In Progress',
          assignee: 'Responsible Party Legal Counsel - Sarah Kim',
          location: 'Finance Unit'
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
  const [notifyAssignees, setNotifyAssignees] = useState<Record<string, boolean>>({});
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<PersonnelContact | null>(null);

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

  // Helper function to extract person's name from assignee string (format: "Position - Name")
  const extractPersonName = (assigneeString: string): string => {
    if (!assigneeString || assigneeString.trim().length === 0) return '';
    const parts = assigneeString.split(' - ');
    if (parts.length >= 2) {
      return parts[1].trim();
    }
    return assigneeString.trim();
  };

  // Function to open contact modal for an assignee
  const openContactModal = (assigneeString: string) => {
    const personName = extractPersonName(assigneeString);
    const contact = PERSONNEL_CONTACTS[personName];
    if (contact) {
      setSelectedContact(contact);
      setContactModalOpen(true);
    }
  };

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
      status: 'In Progress',
      assignee: '',
      location: '',
      time: '',
      date: '',
      timezone: 'UTC',
      childActions: [],
      notificationSentAt: undefined
    };
    const updated = objectives.map(obj =>
      obj.id === objectiveId 
        ? { ...obj, actions: [...obj.actions, newAction] }
        : obj
    );
    updateData(updated);
  };

  const addChildAction = (objectiveId: string, parentActionId: string) => {
    const newChildAction: Action = {
      id: Date.now().toString(),
      description: '',
      status: 'In Progress',
      assignee: '',
      location: '',
      time: '',
      date: '',
      timezone: 'UTC',
      childActions: [],
      notificationSentAt: undefined
    };
    const updated = objectives.map(obj =>
      obj.id === objectiveId 
        ? {
            ...obj,
            actions: obj.actions.map(action =>
              action.id === parentActionId
                ? { ...action, childActions: [...(action.childActions || []), newChildAction] }
                : action
            )
          }
        : obj
    );
    updateData(updated);
  };

  const updateAction = (objectiveId: string, actionId: string, field: keyof Action, value: string, parentActionId?: string) => {
    if (parentActionId) {
      // Update child action
      const updated = objectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              actions: obj.actions.map(action =>
                action.id === parentActionId
                  ? {
                      ...action,
                      childActions: (action.childActions || []).map(child =>
                        child.id === actionId ? { ...child, [field]: value } : child
                      )
                    }
                  : action
              )
            }
          : obj
      );
      updateData(updated);
    } else {
      // Update top-level action
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
    }
  };

  const deleteAction = (objectiveId: string, actionId: string, parentActionId?: string) => {
    if (parentActionId) {
      // Delete child action
      const updated = objectives.map(obj =>
        obj.id === objectiveId
          ? {
              ...obj,
              actions: obj.actions.map(action =>
                action.id === parentActionId
                  ? {
                      ...action,
                      childActions: (action.childActions || []).filter(child => child.id !== actionId)
                    }
                  : action
              )
            }
          : obj
      );
      updateData(updated);
    } else {
      // Delete top-level action
      const updated = objectives.map(obj =>
        obj.id === objectiveId
          ? { ...obj, actions: obj.actions.filter(action => action.id !== actionId) }
          : obj
      );
      updateData(updated);
    }
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
    <>
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

      {/* Add Objective Button - Below Header */}
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
                    <button
                      onClick={() => {
                        // Add child action to first available action or create new action first
                        if (objective.actions.length > 0) {
                          addChildAction(objective.id, objective.actions[0].id);
                        }
                      }}
                      disabled={editingObjective === objective.id || objective.actions.length === 0}
                      className="bg-[#01669f] h-[22.75px] rounded-[4px] w-[150px] hover:bg-[#01669f]/90 transition-colors flex items-center justify-center relative disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Add Child Action
                      </p>
                    </button>
                  </div>
                </div>

                {/* Actions List - always shown */}
                <div className="space-y-3 pl-3">
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

                          {/* Assignee, Status, and Location */}
                          <div className="mt-2 flex items-center gap-3 flex-wrap" style={{ marginLeft: '15px' }}>
                            {isActionEditing ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="caption text-white">Assignee:</span>
                                  <Input
                                    value={action.assignee || ''}
                                    onChange={(e) => updateAction(objective.id, action.id, 'assignee', e.target.value)}
                                    placeholder="Enter assignee..."
                                    className="h-8 w-40 bg-input-background border-border text-card-foreground caption"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="caption text-white">Status:</span>
                                  <Select
                                    value={action.status || 'In Progress'}
                                    onValueChange={(value) => updateAction(objective.id, action.id, 'status', value)}
                                  >
                                    <SelectTrigger className="w-36 h-8 bg-input-background border-border text-card-foreground caption">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Complete">Complete</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="caption text-white">Location:</span>
                                  <Input
                                    value={action.location || ''}
                                    onChange={(e) => updateAction(objective.id, action.id, 'location', e.target.value)}
                                    placeholder="Enter location..."
                                    className="h-8 w-40 bg-input-background border-border text-card-foreground caption"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div 
                                  className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40 cursor-pointer hover:bg-background/60 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (action.assignee && action.assignee.trim().length > 0) {
                                      openContactModal(action.assignee);
                                    }
                                  }}
                                >
                                  <span className="caption text-white">Assignee</span>
                                  <Badge variant="outline" className="caption border-white text-white">
                                    {action.assignee && action.assignee.trim().length > 0 ? action.assignee : 'Unassigned'}
                                  </Badge>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40">
                                  <span className="caption text-white">Status</span>
                                  <Badge 
                                    variant="outline" 
                                    className="caption"
                                    style={{ 
                                      backgroundColor: action.status === 'Complete' ? 'rgba(18, 183, 106, 0.2)' : 'rgba(254, 200, 75, 0.2)',
                                      borderColor: action.status === 'Complete' ? '#12B76A' : '#FEC84B',
                                      color: action.status === 'Complete' ? '#12B76A' : '#FEC84B'
                                    }}
                                  >
                                    {action.status || 'In Progress'}
                                  </Badge>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40">
                                  <span className="caption text-white">Location</span>
                                  <Badge variant="outline" className="caption border-white text-white">
                                    {action.location && action.location.trim().length > 0 ? action.location : 'Not specified'}
                                  </Badge>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Save/Cancel Buttons - Below Assignee field when editing */}
                          {isActionEditing && (
                            <div className="flex items-center gap-2 mt-2" style={{ marginLeft: '15px' }} onClick={(e) => e.stopPropagation()}>
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

                          {/* Notify Assignee Button - Always visible and clickable */}
                          <div className="flex items-center gap-2 mt-2" style={{ marginLeft: '15px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newCheckedState = !notifyAssignees[action.id];
                                setNotifyAssignees(prev => ({
                                  ...prev,
                                  [action.id]: newCheckedState
                                }));
                                if (newCheckedState) {
                                  // Record timestamp when notification is sent
                                  const timestamp = new Date().toLocaleString();
                                  updateAction(objective.id, action.id, 'notificationSentAt', timestamp);
                                }
                              }}
                              className="bg-[#01669f] h-[22.75px] rounded-[4px] px-3 hover:bg-[#01669f]/90 transition-colors caption text-white"
                            >
                              Notify Assignee & Request Update
                            </button>
                            {action.notificationSentAt && (
                              <span className="caption text-white ml-2">
                                Sent: {action.notificationSentAt}
                              </span>
                            )}
                          </div>

                          {/* Child Actions */}
                          {action.childActions && action.childActions.length > 0 && (
                            <div className="mt-3 ml-8 space-y-2">
                              {action.childActions.map((childAction) => {
                                const isChildEditing = editingAction?.objectiveId === objective.id && editingAction?.actionId === childAction.id;
                                return (
                                  <div
                                    key={childAction.id}
                                    className="py-2 pl-3 pr-0 bg-card/20 border-l-2 border-accent/50 flex items-start gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isChildEditing) {
                                        startEditingAction(objective.id, childAction);
                                      }
                                    }}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <Textarea
                                        value={childAction.description}
                                        onChange={(e) => updateAction(objective.id, childAction.id, 'description', e.target.value, action.id)}
                                        placeholder="Enter child action description..."
                                        className="min-h-[40px] resize-y bg-input-background border-border text-card-foreground caption disabled:opacity-100 disabled:cursor-pointer disabled:border-transparent"
                                        disabled={!isChildEditing}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isChildEditing) e.stopPropagation();
                                        }}
                                      />

                                      {/* Child Assignee */}
                                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                                        {isChildEditing ? (
                                          <>
                                            <div className="flex items-center gap-2">
                                              <span className="caption text-white">Assignee:</span>
                                              <Input
                                                value={childAction.assignee || ''}
                                                onChange={(e) => updateAction(objective.id, childAction.id, 'assignee', e.target.value, action.id)}
                                                placeholder="Enter assignee..."
                                                className="h-8 w-40 bg-input-background border-border text-card-foreground caption"
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="caption text-white">Status:</span>
                                              <Select
                                                value={childAction.status || 'In Progress'}
                                                onValueChange={(value) => updateAction(objective.id, childAction.id, 'status', value, action.id)}
                                              >
                                                <SelectTrigger className="w-36 h-8 bg-input-background border-border text-card-foreground caption">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                                  <SelectItem value="Complete">Complete</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div 
                                              className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40 cursor-pointer hover:bg-background/60 transition-colors"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (childAction.assignee && childAction.assignee.trim().length > 0) {
                                                  openContactModal(childAction.assignee);
                                                }
                                              }}
                                            >
                                              <span className="caption text-white">Assignee</span>
                                              <Badge variant="outline" className="caption border-white text-white">
                                                {childAction.assignee && childAction.assignee.trim().length > 0 ? childAction.assignee : 'Unassigned'}
                                              </Badge>
                                            </div>
                                            <div className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40">
                                              <span className="caption text-white">Status</span>
                                              <Badge 
                                                variant="outline" 
                                                className="caption"
                                                style={{ 
                                                  backgroundColor: childAction.status === 'Complete' ? 'rgba(18, 183, 106, 0.2)' : 'rgba(254, 200, 75, 0.2)',
                                                  borderColor: childAction.status === 'Complete' ? '#12B76A' : '#FEC84B',
                                                  color: childAction.status === 'Complete' ? '#12B76A' : '#FEC84B'
                                                }}
                                              >
                                                {childAction.status || 'In Progress'}
                                              </Badge>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      {/* Child Location */}
                                      <div className="mt-2">
                                        {isChildEditing ? (
                                          <div className="flex items-center gap-2">
                                            <span className="caption text-white">Location:</span>
                                            <Input
                                              value={childAction.location || ''}
                                              onChange={(e) => updateAction(objective.id, childAction.id, 'location', e.target.value, action.id)}
                                              placeholder="Enter location..."
                                              className="h-8 bg-input-background border-border text-card-foreground caption"
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </div>
                                        ) : (
                                          <div className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 bg-background/40">
                                            <span className="caption text-white">Location</span>
                                            <Badge variant="outline" className="caption border-white text-white">
                                              {childAction.location && childAction.location.trim().length > 0 ? childAction.location : 'Not specified'}
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Save/Cancel Buttons - Below Assignee field when editing */}
                                      {isChildEditing && (
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

                                      {/* Notify Assignee Button - Always visible and clickable */}
                                      <div className="flex items-center gap-2 mt-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const newCheckedState = !notifyAssignees[childAction.id];
                                            setNotifyAssignees(prev => ({
                                              ...prev,
                                              [childAction.id]: newCheckedState
                                            }));
                                            if (newCheckedState) {
                                              // Record timestamp when notification is sent
                                              const timestamp = new Date().toLocaleString();
                                              updateAction(objective.id, childAction.id, 'notificationSentAt', timestamp, action.id);
                                            }
                                          }}
                                          className="bg-[#01669f] h-[22.75px] rounded-[4px] px-3 hover:bg-[#01669f]/90 transition-colors caption text-white"
                                        >
                                          Notify Assignee & Request Update
                                        </button>
                                        {childAction.notificationSentAt && (
                                          <span className="caption text-white ml-2">
                                            Sent: {childAction.notificationSentAt}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {!isChildEditing && (
                                      <div className="flex items-start gap-1" onClick={(e) => e.stopPropagation()}>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingAction(objective.id, childAction);
                                          }}
                                          className="p-1 hover:bg-muted/30 rounded transition-colors"
                                        >
                                          <Edit2 className="w-3 h-3 text-white" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteAction(objective.id, childAction.id, action.id);
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
                            </div>
                          )}
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
                </div>

                
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Incident Profile Modal */}
    <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Incident Profile
          </DialogTitle>
        </DialogHeader>
        {selectedContact && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Row 1: Name & Position */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-foreground">Name</span>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <p className="text-sm text-white">{selectedContact.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-foreground">Position</span>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <p className="text-sm text-white">{selectedContact.position}</p>
              </div>
            </div>

            {/* Row 2: Organization & Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-foreground">Organization</span>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <p className="text-sm text-white">{selectedContact.organization}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-foreground">Email</span>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <a 
                  href={`mailto:${selectedContact.email}`}
                  className="text-sm text-accent hover:underline"
                >
                  {selectedContact.email}
                </a>
              </div>
            </div>

            {/* Row 3: Phone & Activation Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-foreground">Phone</span>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <a 
                  href={`tel:${selectedContact.phone}`}
                  className="text-sm text-accent hover:underline"
                >
                  {selectedContact.phone}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Activation Status</span>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex flex-col gap-2">
                  <Badge variant="default" className="bg-green-600 w-full justify-start">
                    {selectedContact.activationStatus}
                  </Badge>
                  <p className="text-xs text-white">{selectedContact.activatedAt}</p>
                </div>
              </div>
            </div>

            {/* Row 4: Check-In Status & Sign-In Status */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Check-In Status</span>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex flex-col gap-2">
                  <Badge variant="default" className="bg-green-600 w-full justify-start">Checked-In</Badge>
                  <p className="text-xs text-white">{selectedContact.checkedInAt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Sign-In Status</span>
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex flex-col gap-2">
                  <Badge variant="default" className="bg-green-600 w-full justify-start">Signed-In</Badge>
                  <p className="text-xs text-white">{selectedContact.signedInAt}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

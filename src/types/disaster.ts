export interface DisasterPhase {
  id: string;
  name: string;
  shortName: string;
  description: string;
  completed: boolean;
  data?: Record<string, any>;
}

export interface OperationalPeriod {
  id: string;
  number: number;
  startTime: Date;
  endTime?: Date;
  phases: DisasterPhase[];
}

export const PLANNING_P_PHASES: Omit<DisasterPhase, 'completed' | 'data'>[] = [
  {
    id: 'initial-response',
    name: 'Initial Response & Assessment',
    shortName: 'Initial Response',
    description: 'Immediate response and situation assessment'
  },
  {
    id: 'incident-briefing',
    name: 'Incident Briefing',
    shortName: 'Incident Briefing',
    description: 'Brief key personnel on the current incident situation'
  }
];

export const OPERATIONAL_PERIOD_PHASES: Omit<DisasterPhase, 'completed' | 'data'>[] = [
  {
    id: 'alerts',
    name: 'Notifications',
    shortName: 'Notifications',
    description: 'Incident alerts and notifications'
  },
  {
    id: 'overview',
    name: 'Overview',
    shortName: 'Overview',
    description: 'Incident overview and situational awareness'
  },
  {
    id: 'objectives-actions',
    name: 'Objectives & Actions',
    shortName: 'Objectives & Actions',
    description: 'Define incident objectives and tactical actions'
  },
  {
    id: 'incident-roster',
    name: 'Incident Roster',
    shortName: 'Incident Roster',
    description: 'Personnel assignments and organizational structure'
  },
  {
    id: 'resources',
    name: 'Resources',
    shortName: 'Resources',
    description: 'Resource tracking and allocation'
  },
  {
    id: 'safety-analysis',
    name: 'Safety Analysis',
    shortName: 'Safety Analysis',
    description: 'Safety considerations and risk assessment'
  },
  {
    id: 'log',
    name: 'Log',
    shortName: 'Log',
    description: 'Activity log'
  },
  {
    id: 'ics-forms',
    name: 'ICS',
    shortName: 'ICS',
    description: 'ICS Forms'
  }
];
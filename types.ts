export enum EventType {
  ROUTINE = 'ROUTINE',
  REMINDER = 'REMINDER',
  LEARNING = 'LEARNING'
}

export enum EventStatus {
  TODO = 'TODO',
  DONE = 'DONE',
  WAITING = 'WAITING'
}

export enum EventPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum ViewMode {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  IDEAS = 'IDEAS',
  ALL_TASKS = 'ALL_TASKS',
  SETTINGS = 'SETTINGS'
}

export enum EventScope {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  IDEA = 'IDEA'
}

export interface UserSettings {
  enabledScopes: EventScope[];
}

export interface IEvent {
  id: string;
  title: string;
  type: EventType;
  scope: EventScope; // New field to distinguish daily tasks vs monthly plans
  priority: EventPriority;
  status: EventStatus;
  date: string; // ISO Date String YYYY-MM-DD (For Week/Month/Year, this will be the start date. For Idea, this might be creation date)
  time?: string; // HH:mm (Only relevant for DAY scope)
  description?: string; // Markdown content
  createdAt: number;
}

export interface DayStats {
  total: number;
  completed: number;
}
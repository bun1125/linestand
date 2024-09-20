// types/models.ts

import firebase from 'firebase/app';

// 1. lineAccounts コレクション
export interface LineAccount {
  id: string;
  accountName: string;
  accessToken: string;
  channelSecret: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.1 users サブコレクション
export interface User {
  id: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  language: string;
  tags: string[];
  statusId: string;
  gclid?: string;
  lastMessageAt?: firebase.firestore.Timestamp;
  notes?: string;
  pin: boolean;
  scenarioId?: string;
  scenarioModifiedAt?: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.1.1 messages サブコレクション
export interface Message {
  id: string;
  type: string;
  content: Record<string, any>;
  direction: 'incoming' | 'outgoing';
  timestamp: firebase.firestore.Timestamp;
  replyToScenarioMessageId?: string;
  analysisResult?: AnalysisResult;
}

export interface AnalysisResult {
  isReply: boolean;
  scenarioMessageId?: string;
  confidence?: number;
}

// 1.2 scenarios サブコレクション
export interface Scenario {
  id: string;
  name: string;
  description: string;
  systemUserId: string;
  default: boolean;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.2.1 messages サブコレクション
export interface ScenarioMessage {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
  delay: number;
  deliveryConditions: DeliveryConditions;
  tagAssignments: string[];
  sentCount: number;
  replyCount: number;
  replyRate: number;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export interface DeliveryConditions {
  requiredTagIds?: string[];
  optionalTagIds?: string[];
  excludedTagIds?: string[];
  requiredStatusIds?: string[];
  excludedStatusIds?: string[];
  daysAfterRegistration?: number;
  fixedDateTime?: firebase.firestore.Timestamp;
}

// 1.2.2 scenarioAssignmentRules サブコレクション
export interface ScenarioAssignmentRule {
  id: string;
  conditions: DeliveryConditions;
  scenarioId: string;
  priority: number;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.3 oneTimeMessages サブコレクション
export interface OneTimeMessage {
  id: string;
  type: string;
  content: Record<string, any>;
  deliveryConditions: DeliveryConditions;
  tagAssignments: string[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.4 templateMessages サブコレクション
export interface TemplateMessage {
  id: string;
  name: string;
  type: string;
  content: Record<string, any>;
  tagAssignments: string[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.5 urls サブコレクション
export interface Url {
  id: string;
  originalUrl: string;
  redirectUrl: string;
  tagAssignments: string[];
  clickCount: number;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  clicks: Click[];
}

export interface Click {
  id: string;
  userId: string;
  clickedAt: firebase.firestore.Timestamp;
}

// 1.6 gclids サブコレクション
export interface Gclid {
  id: string;
  timestamp: firebase.firestore.Timestamp;
  googleAdId: string;
  associatedUserId?: string;
  // その他必要なフィールド
}

// 1.7 tags サブコレクション
export interface Tag {
  id: string;
  name: string;
  description: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.8 statuses サブコレクション
export interface Status {
  id: string;
  name: string;
  description: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 1.9 deliveryJobs サブコレクション
export interface DeliveryJob {
  id: string;
  type: 'scenario' | 'one-time';
  messageIds: string[];
  targetUserIds: string[];
  deliveryConditions: DeliveryConditions;
  scheduledAt: firebase.firestore.Timestamp;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  tagAssignments: string[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

// 2. systemUsers コレクション
export interface SystemUser {
  id: string; // adminId
  name: string;
  email: string;
  role: 'superadmin' | 'editor' | string;
  associatedLineAccountIds: string[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

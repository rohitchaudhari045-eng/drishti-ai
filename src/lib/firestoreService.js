import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

// Helper to check if Firestore is ready
export const isFirestoreReady = () => Boolean(db);

/**
 * =========================================================================
 * USER PROFILE & SETTINGS
 * =========================================================================
 */

export async function getUserProfile(userId) {
  if (!db || !userId) return null;
  const userDocRef = doc(db, 'users', userId);
  const snap = await getDoc(userDocRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

export async function createUserProfileIfMissing(userId, initialData = {}) {
  if (!db || !userId) return null;
  const userDocRef = doc(db, 'users', userId);
  const snap = await getDoc(userDocRef);

  if (!snap.exists()) {
    const profile = {
      email: initialData.email || '',
      displayName: initialData.displayName || '',
      workspaceName: initialData.workspaceName || `${initialData.displayName || 'Operator'}'s Workspace`,
      region: initialData.region || 'Asia Pacific (Mumbai - ap-south-1)',
      plan: 'Developer Free Tier', // Privileged tier field - read-only from client updates
      webhookUrl: 'https://api.drishti.ai/v1/events/inbound',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(userDocRef, profile);
    
    // Seed initial agents, workflows, and log for the new user
    await seedDefaultUserData(userId);
    return profile;
  }
  return snap.data();
}

export async function updateUserProfile(userId, updates) {
  if (!db || !userId) throw new Error('Database is not initialized or user is not authenticated.');
  
  // Whitelist editable client fields to prevent tampering with privileged attributes
  const safeUpdates = {};
  if (typeof updates.workspaceName === 'string') safeUpdates.workspaceName = updates.workspaceName.trim();
  if (typeof updates.region === 'string') safeUpdates.region = updates.region.trim();
  if (typeof updates.webhookUrl === 'string') safeUpdates.webhookUrl = updates.webhookUrl.trim();
  if (typeof updates.displayName === 'string') safeUpdates.displayName = updates.displayName.trim();
  
  safeUpdates.updatedAt = serverTimestamp();

  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, safeUpdates);
}

/**
 * =========================================================================
 * AI AGENTS
 * Collection: users/{userId}/agents
 * =========================================================================
 */

export function subscribeUserAgents(userId, onUpdate, onError) {
  if (!db || !userId) {
    if (onError) onError(new Error('Database or userId not available'));
    return () => {};
  }

  const agentsRef = collection(db, 'users', userId, 'agents');
  const q = query(agentsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const agents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(agents);
    },
    (err) => {
      console.error('[DRISHTI AI] Firestore subscribe agents error:', err);
      if (onError) onError(err);
    }
  );
}

export async function createUserAgent(userId, agentData) {
  if (!db || !userId) throw new Error('Firestore is not initialized or user is not logged in.');
  
  if (!agentData.name?.trim()) throw new Error('Agent name is required.');
  if (!agentData.role?.trim()) throw new Error('Agent role is required.');

  const agentsRef = collection(db, 'users', userId, 'agents');
  const newAgentRef = doc(agentsRef); // Auto-generate ID

  const payload = {
    name: agentData.name.trim(),
    role: agentData.role.trim(),
    model: agentData.model?.trim() || 'DRISHTI Core Rules Engine v2',
    status: agentData.status || 'Active',
    uptime: agentData.uptime || '100%',
    tasks24h: agentData.tasks24h || '0',
    description: agentData.description?.trim() || 'Custom autonomous agent configured for workspace workflows.',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(newAgentRef, payload);
  return { id: newAgentRef.id, ...payload };
}

export async function updateUserAgent(userId, agentId, updates) {
  if (!db || !userId || !agentId) throw new Error('Invalid arguments for updateUserAgent');
  const agentRef = doc(db, 'users', userId, 'agents', agentId);
  await updateDoc(agentRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteUserAgent(userId, agentId) {
  if (!db || !userId || !agentId) throw new Error('Invalid arguments for deleteUserAgent');
  const agentRef = doc(db, 'users', userId, 'agents', agentId);
  await deleteDoc(agentRef);
}

/**
 * =========================================================================
 * WORKFLOWS
 * Collection: users/{userId}/workflows
 * =========================================================================
 */

export function subscribeUserWorkflows(userId, onUpdate, onError) {
  if (!db || !userId) {
    if (onError) onError(new Error('Database or userId not available'));
    return () => {};
  }

  const workflowsRef = collection(db, 'users', userId, 'workflows');
  const q = query(workflowsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const workflows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(workflows);
    },
    (err) => {
      console.error('[DRISHTI AI] Firestore subscribe workflows error:', err);
      if (onError) onError(err);
    }
  );
}

export async function createUserWorkflow(userId, workflowData) {
  if (!db || !userId) throw new Error('Firestore is not initialized or user is not logged in.');
  
  if (!workflowData.name?.trim()) throw new Error('Workflow name is required.');
  if (!workflowData.trigger?.trim()) throw new Error('Trigger type is required.');

  const workflowsRef = collection(db, 'users', userId, 'workflows');
  const newWfRef = doc(workflowsRef);

  const payload = {
    name: workflowData.name.trim(),
    trigger: workflowData.trigger.trim(),
    steps: Number(workflowData.steps) || 3,
    lastRun: 'Never',
    enabled: workflowData.enabled ?? true,
    successRate: '100%',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(newWfRef, payload);
  return { id: newWfRef.id, ...payload };
}

export async function toggleUserWorkflow(userId, workflowId, currentStatus) {
  if (!db || !userId || !workflowId) throw new Error('Invalid arguments for toggleUserWorkflow');
  const wfRef = doc(db, 'users', userId, 'workflows', workflowId);
  await updateDoc(wfRef, {
    enabled: !currentStatus,
    updatedAt: serverTimestamp()
  });
}

export async function deleteUserWorkflow(userId, workflowId) {
  if (!db || !userId || !workflowId) throw new Error('Invalid arguments for deleteUserWorkflow');
  const wfRef = doc(db, 'users', userId, 'workflows', workflowId);
  await deleteDoc(wfRef);
}

/**
 * =========================================================================
 * ACTIVITY & AUDIT LOGS
 * Collection: users/{userId}/activity_logs
 * =========================================================================
 */

export function subscribeUserLogs(userId, onUpdate, onError, maxLimit = 25) {
  if (!db || !userId) {
    if (onError) onError(new Error('Database or userId not available'));
    return () => {};
  }

  const logsRef = collection(db, 'users', userId, 'activity_logs');
  const q = query(logsRef, orderBy('createdAt', 'desc'), limit(maxLimit));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(logs);
    },
    (err) => {
      console.error('[DRISHTI AI] Firestore subscribe logs error:', err);
      if (onError) onError(err);
    }
  );
}

export async function addUserLog(userId, logData) {
  if (!db || !userId) return;

  const logsRef = collection(db, 'users', userId, 'activity_logs');
  const newLogRef = doc(logsRef);

  const now = new Date();
  const timeFormatted = now.toISOString().replace('T', ' ').substring(0, 19);

  const payload = {
    timestamp: timeFormatted,
    level: logData.level || 'INFO',
    source: logData.source || 'SYSTEM',
    message: logData.message || 'System event executed.',
    createdAt: serverTimestamp()
  };

  await setDoc(newLogRef, payload);
  return { id: newLogRef.id, ...payload };
}

/**
 * =========================================================================
 * DEFAULT DATA SEEDER FOR NEW AUTHENTICATED USERS
 * =========================================================================
 */

export async function seedDefaultUserData(userId) {
  if (!db || !userId) return;

  try {
    // 1. Seed initial agents
    const agentsRef = collection(db, 'users', userId, 'agents');
    const existingAgents = await getDocs(query(agentsRef, limit(1)));
    
    if (existingAgents.empty) {
      const defaultAgents = [
        {
          name: 'Ingestion Sentinel',
          role: 'Data Parsing & Schema Normalization',
          model: 'DRISHTI Structural Parser v1',
          status: 'Active',
          uptime: '99.99%',
          tasks24h: '1,420',
          description: 'Inspects inbound payload structures from webhooks and REST endpoints, ensuring strict type safety.'
        },
        {
          name: 'Logic Evaluator',
          role: 'Deterministic Rule Execution',
          model: 'DRISHTI Rules Engine v2.4',
          status: 'Active',
          uptime: '100%',
          tasks24h: '2,110',
          description: 'Executes branching business policies and triggers downstream webhooks when conditions are met.'
        },
        {
          name: 'Audit Dispatcher',
          role: 'Security & Compliance Logging',
          model: 'Immutable Ledger Bridge',
          status: 'Active',
          uptime: '100%',
          tasks24h: '3,890',
          description: 'Streams signed execution hashes and trace diagnostics to external monitoring stacks.'
        }
      ];

      for (const ag of defaultAgents) {
        const agentDoc = doc(agentsRef);
        await setDoc(agentDoc, {
          ...ag,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // 2. Seed initial workflows
    const workflowsRef = collection(db, 'users', userId, 'workflows');
    const existingWfs = await getDocs(query(workflowsRef, limit(1)));

    if (existingWfs.empty) {
      const defaultWorkflows = [
        {
          name: 'Customer Onboarding Orchestration',
          trigger: 'Webhook: Auth0 / Signup Event',
          steps: 5,
          lastRun: 'Just now',
          enabled: true,
          successRate: '100%'
        },
        {
          name: 'Invoice Data Extraction & ERP Sync',
          trigger: 'Cron: Every 1 Hour',
          steps: 4,
          lastRun: '15 mins ago',
          enabled: true,
          successRate: '99.8%'
        },
        {
          name: 'High-Value Alert & Slack Dispatch',
          trigger: 'REST API: Inbound Lead',
          steps: 3,
          lastRun: '45 mins ago',
          enabled: true,
          successRate: '100%'
        }
      ];

      for (const wf of defaultWorkflows) {
        const wfDoc = doc(workflowsRef);
        await setDoc(wfDoc, {
          ...wf,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // 3. Seed initial activity log
    const logsRef = collection(db, 'users', userId, 'activity_logs');
    const existingLogs = await getDocs(query(logsRef, limit(1)));

    if (existingLogs.empty) {
      const initialLogDoc = doc(logsRef);
      await setDoc(initialLogDoc, {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'SUCCESS',
        source: 'CONTROL_PLANE',
        message: 'Initialized secure Firestore workspace and provisioned agent fleet.',
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('[DRISHTI AI] Default workspace seeding notice:', err?.message || err);
  }
}

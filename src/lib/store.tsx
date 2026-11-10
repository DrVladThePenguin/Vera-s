"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  emptyFounder,
  emptyInvestor,
  type Database,
  type FounderDraft,
  type Interaction,
  type InvestorDraft,
  type Note,
  type RelationType,
  type Role,
  type Session,
} from "@/lib/types";
import { uid } from "@/lib/utils";

const KEY = "ventureos.v1";

const emptyDb = (): Database => ({
  session: null,
  founders: {},
  investors: {},
  actions: [],
  notes: [],
});

type Action =
  | { type: "hydrate"; db: Database }
  | { type: "set-session"; session: Session | null }
  | { type: "upsert-founder"; email: string; draft: FounderDraft }
  | { type: "upsert-investor"; email: string; draft: InvestorDraft }
  | { type: "patch-founder"; email: string; recipe: (draft: FounderDraft) => FounderDraft }
  | { type: "patch-investor"; email: string; recipe: (draft: InvestorDraft) => InvestorDraft }
  | { type: "add-action"; action: Interaction }
  | { type: "set-status"; action: Interaction }
  | { type: "add-note"; note: Note };

function reducer(state: Database, action: Action): Database {
  switch (action.type) {
    case "hydrate":
      return action.db;
    case "set-session":
      return { ...state, session: action.session };
    case "upsert-founder":
      return {
        ...state,
        founders: { ...state.founders, [action.email]: action.draft },
      };
    case "upsert-investor":
      return {
        ...state,
        investors: { ...state.investors, [action.email]: action.draft },
      };
    case "patch-founder": {
      const currentFounder = state.founders[action.email];
      if (!currentFounder) return state;
      return {
        ...state,
        founders: { ...state.founders, [action.email]: action.recipe(currentFounder) },
      };
    }
    case "patch-investor": {
      const currentInvestor = state.investors[action.email];
      if (!currentInvestor) return state;
      return {
        ...state,
        investors: { ...state.investors, [action.email]: action.recipe(currentInvestor) },
      };
    }
    case "add-action":
      return { ...state, actions: [action.action, ...state.actions] };
    case "set-status":
      return {
        ...state,
        actions: [
          action.action,
          ...state.actions.filter(
            (item) =>
              !(
                item.startupId === action.action.startupId &&
                item.investorEmail === action.action.investorEmail &&
                item.type !== "view"
              ),
          ),
        ],
      };
    case "add-note":
      return { ...state, notes: [...state.notes, action.note] };
    default:
      return state;
  }
}

interface StoreValue {
  ready: boolean;
  storageWarning: string;
  db: Database;
  session: Session | null;
  founder: FounderDraft | null;
  investor: InvestorDraft | null;
  begin: (role: Role, email: string) => "created" | "resumed";
  signIn: (role: Role, email: string) => boolean;
  signOut: () => void;
  updateFounder: (recipe: (draft: FounderDraft) => FounderDraft) => void;
  updateInvestor: (recipe: (draft: InvestorDraft) => InvestorDraft) => void;
  recordView: (startupId: string) => void;
  setRelation: (startupId: string, type: Exclude<RelationType, "view">) => void;
  relationFor: (startupId: string) => RelationType | null;
  addNote: (startupId: string, investorEmail: string, body: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, dispatch] = useReducer(reducer, undefined, emptyDb);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Database;
        dispatch({
          type: "hydrate",
          db: {
            session: parsed.session ?? null,
            founders: parsed.founders ?? {},
            investors: parsed.investors ?? {},
            actions: parsed.actions ?? [],
            notes: parsed.notes ?? [],
          },
        });
      }
    } catch {
      setStorageWarning("Saved progress could not be read. A new session was started on this device.");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
      setStorageWarning("");
    } catch {
      setStorageWarning("This browser could not store more profile images. Text and file names are still saved.");
    }
  }, [db, ready]);

  const session = db.session;
  const founder = session?.role === "founder" ? db.founders[session.email] ?? null : null;
  const investor = session?.role === "investor" ? db.investors[session.email] ?? null : null;

  const value = useMemo<StoreValue>(() => {
    const begin = (role: Role, email: string) => {
      const key = normalizeEmail(email);
      if (role === "founder") {
        const existing = db.founders[key];
        if (!existing) {
          dispatch({ type: "upsert-founder", email: key, draft: emptyFounder(key) });
        }
        dispatch({ type: "set-session", session: { role, email: key } });
        return existing ? "resumed" : "created";
      }
      const existing = db.investors[key];
      if (!existing) {
        dispatch({ type: "upsert-investor", email: key, draft: emptyInvestor(key) });
      }
      dispatch({ type: "set-session", session: { role, email: key } });
      return existing ? "resumed" : "created";
    };

    const signIn = (role: Role, email: string) => {
      const key = normalizeEmail(email);
      const exists = role === "founder" ? db.founders[key] : db.investors[key];
      if (!exists) return false;
      dispatch({ type: "set-session", session: { role, email: key } });
      return true;
    };

    return {
      ready,
      storageWarning,
      db,
      session,
      founder,
      investor,
      begin,
      signIn,
      signOut: () => dispatch({ type: "set-session", session: null }),
      updateFounder: (recipe) => {
        if (!session || session.role !== "founder") return;
        dispatch({ type: "patch-founder", email: session.email, recipe });
      },
      updateInvestor: (recipe) => {
        if (!session || session.role !== "investor") return;
        dispatch({ type: "patch-investor", email: session.email, recipe });
      },
      recordView: (startupId) => {
        if (!session || session.role !== "investor" || !investor) return;
        const today = new Date().toISOString().slice(0, 10);
        const seen = db.actions.some(
          (item) =>
            item.type === "view" &&
            item.startupId === startupId &&
            item.investorEmail === session.email &&
            item.at.slice(0, 10) === today,
        );
        if (seen) return;
        dispatch({
          type: "add-action",
          action: {
            id: uid(),
            startupId,
            investorEmail: session.email,
            investorName: investor.fullName || session.email,
            organisation: investor.organisation,
            type: "view",
            at: new Date().toISOString(),
          },
        });
      },
      setRelation: (startupId, type) => {
        if (!session || session.role !== "investor" || !investor) return;
        dispatch({
          type: "set-status",
          action: {
            id: uid(),
            startupId,
            investorEmail: session.email,
            investorName: investor.fullName || session.email,
            organisation: investor.organisation,
            type,
            at: new Date().toISOString(),
          },
        });
      },
      relationFor: (startupId) => {
        if (!session || session.role !== "investor") return null;
        const match = db.actions.find(
          (item) =>
            item.startupId === startupId &&
            item.investorEmail === session.email &&
            item.type !== "view",
        );
        return match?.type ?? null;
      },
      addNote: (startupId, investorEmail, body) => {
        if (!session) return;
        const trimmed = body.trim();
        if (!trimmed) return;
        dispatch({
          type: "add-note",
          note: {
            id: uid(),
            startupId,
            investorEmail,
            author: session.role,
            body: trimmed,
            at: new Date().toISOString(),
          },
        });
      },
    };
  }, [db, founder, investor, ready, session, storageWarning]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}

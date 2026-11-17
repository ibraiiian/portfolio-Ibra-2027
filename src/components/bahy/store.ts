import { useSyncExternalStore } from 'react'

/** Fase Bahy, dipakai orb (menu bar & panel) untuk memilih animasi. */
export type BahyPhase = 'idle' | 'listening' | 'thinking' | 'speaking'

type State = { open: boolean; phase: BahyPhase }

let state: State = { open: false, phase: 'idle' }
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(l => l())

export const bahy = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch }
    emit()
  },
  toggle: () => bahy.set({ open: !state.open }),
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useBahy() {
  return useSyncExternalStore(bahy.subscribe, bahy.get, bahy.get)
}

/** Aksi halaman yang bisa dijalankan Bahy. Projects mendengarkan event ini. */
export const OPEN_PROJECT_EVENT = 'bahy:open-project'
export const openProject = (index: number) => window.dispatchEvent(new CustomEvent(OPEN_PROJECT_EVENT, { detail: index }))

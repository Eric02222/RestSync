export const VITALS_UPDATED_EVENT = 'restsync-vitals-updated';

export function notifyVitalsUpdated(pacienteId) {
  window.dispatchEvent(
    new CustomEvent(VITALS_UPDATED_EVENT, { detail: { pacienteId } })
  );
}

/**
 * useOnboarding Hook
 * Manages onboarding state, draft saving, and step navigation
 */

import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useOnboarding = () => {
  const [status, setStatus] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch onboarding status
   */
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch onboarding status');
      }

      const data = await response.json();
      setStatus(data.onboarding);
      return data.onboarding;
    } catch (err) {
      console.error('[useOnboarding] fetchStatus error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch saved responses (draft)
   */
  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/onboarding/responses`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If no profile exists yet, return empty object
        if (response.status === 404) {
          setResponses({});
          return {};
        }
        throw new Error('Failed to fetch responses');
      }

      const data = await response.json();
      setResponses(data.profile || {});
      return data.profile || {};
    } catch (err) {
      console.error('[useOnboarding] fetchResponses error:', err);
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save draft responses (without completing onboarding)
   *
   * Bug fixed: PATCH /responses returns { success, message } with NO profile
   * field. Calling setResponses(responseData.profile) set responses to
   * undefined on every draft save, which then corrupted formData. We now
   * leave the in-memory responses alone — the component's formData is the
   * live source of truth during a session; DB is only consulted at startup.
   */
  const saveDraft = useCallback(async (data) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/onboarding/responses`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save draft');
      }

      // PATCH returns { success: true, message } — no profile field.
      // Do NOT call setResponses here; formData in OnboardingPage is canonical.
      return { success: true };
    } catch (err) {
      console.error('[useOnboarding] saveDraft error:', err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setSaving(false);
    }
  }, []);


  /**
   * Complete onboarding (final submission)
   */
  const completeOnboarding = useCallback(async (data) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete onboarding');
      }

      const responseData = await response.json();
      // New backend returns: { success, onboarding: { status, completedAt }, primaryRole, accountType }
      setStatus({
        status: 'completed',
        completedAt: responseData.onboarding?.completedAt || new Date().toISOString(),
      });
      return { success: true, data: responseData };
    } catch (err) {
      console.error('[useOnboarding] completeOnboarding error:', err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  /**
   * Update local responses state (optimistic update)
   */
  const updateResponses = useCallback((newResponses) => {
    setResponses((prev) => ({
      ...prev,
      ...newResponses,
    }));
  }, []);

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    fetchStatus();
    fetchResponses();
  }, [fetchStatus, fetchResponses]);

  return {
    status,
    responses,
    loading,
    saving,
    error,
    isCompleted: status?.status === 'completed',
    isInProgress: status?.status === 'in_progress',
    fetchStatus,
    fetchResponses,
    saveDraft,
    completeOnboarding,
    updateResponses,
  };
};

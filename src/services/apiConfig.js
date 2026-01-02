/**
 * API Configuration Helper
 * This file helps manage API keys and configuration
 */

export const API_CONFIG = {
  GEMINI: {
    // API key is loaded from environment variables
    getKey: () => import.meta.env.VITE_GEMINI_API_KEY,
    
    // Base URL for Gemini API
    getBaseUrl: () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    
    // Full URL with API key
    getFullUrl: () => {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    },
    
    // Check if API is configured
    isConfigured: () => {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      return key && key !== "" && key !== "your_actual_api_key_here";
    },
    
    // Get configuration status
    getStatus: () => {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) {
        return { configured: false, message: "API key is not set" };
      }
      if (key === "your_actual_api_key_here") {
        return { configured: false, message: "Please replace the placeholder API key with your actual key" };
      }
      if (key.startsWith("AIza")) {
        return { configured: true, message: "API is properly configured" };
      }
      return { configured: false, message: "API key format is invalid" };
    }
  }
};

/**
 * Safely get environment variables with fallback
 */
export function getEnvVariable(key, defaultValue = "") {
  try {
    const value = import.meta.env[key];
    return value || defaultValue;
  } catch (error) {
    console.warn(`Error accessing environment variable ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Check if running in development mode
 */
export function isDevelopment() {
  return import.meta.env.DEV;
}

/**
 * Log API configuration (for debugging, don't use in production)
 */
export function logApiConfig() {
  if (isDevelopment()) {
    const status = API_CONFIG.GEMINI.getStatus();
    console.log("API Configuration Status:", status);
    
    // Don't log the actual key, just whether it's set
    const key = API_CONFIG.GEMINI.getKey();
    console.log("API Key is set:", !!key);
    console.log("API Key length:", key ? key.length : 0);
  }
}
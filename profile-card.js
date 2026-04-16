/**
 * Profile Card Dynamic Functionality
 * Implements epoch timer logic and avatar URL handling
 */

(function() {
  'use strict';

  // Avatar URL Configuration
  const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/150';

  /**
   * Updates the time display element with current epoch timestamp
   */
  function updateTimeDisplay() {
    const timeElement = document.querySelector('[data-testid="test-user-time"]');

    // Null check to prevent errors if element doesn't exist
    if (!timeElement) {
      console.warn('Time display element not found');
      return;
    }

    // Update text content with current epoch timestamp in milliseconds
    const currentTimestamp = Date.now();
    const newText = `Member since ${currentTimestamp}`;

    // Only update if text has changed to avoid unnecessary announcements
    if (timeElement.textContent !== newText) {
      timeElement.textContent = newText;
    }

    // Set datetime attribute with full date and time (ISO 8601 format)
    const date = new Date(currentTimestamp);
    timeElement.setAttribute('datetime', date.toISOString());
  }

  /**
   * Sets up the epoch timer with specified interval
   * @param {number} intervalMs - Update interval in milliseconds (500-1000ms recommended)
   */
  function setupEpochTimer(intervalMs = 500) {
    // Validate interval is within reasonable bounds (500ms to 1000ms)
    const validInterval = Math.max(500, Math.min(1000, intervalMs));

    // Set initial display
    updateTimeDisplay();

    // Set up continuous updates at the specified interval
    const intervalId = setInterval(updateTimeDisplay, validInterval);

    // Return cleanup function for potential cleanup needs
    return function cleanup() {
      clearInterval(intervalId);
    };
  }

  /**
   * Handles avatar image URL, applying default if needed
   */
  function handleAvatarUrl() {
    const avatarElement = document.querySelector('[data-testid="test-user-avatar"]');

    // Null check to prevent errors if element doesn't exist
    if (!avatarElement) {
      console.warn('Avatar element not found');
      return;
    }

    // Check if src is empty, invalid, or a placeholder
    const currentSrc = avatarElement.src;
    const isValidSrc = currentSrc &&
                      !currentSrc.includes('placeholder') &&
                      currentSrc.startsWith('http');

    // Apply default URL if current src is invalid
    if (!isValidSrc) {
      avatarElement.src = DEFAULT_AVATAR_URL;
    }
  }

  /**
   * Sets a new avatar URL for the profile card
   * @param {string} newUrl - The new avatar URL
   */
  function setAvatarUrl(newUrl) {
    const avatarElement = document.querySelector('[data-testid="test-user-avatar"]');

    if (!avatarElement) {
      console.warn('Avatar element not found');
      return false;
    }

    if (typeof newUrl !== 'string' || !newUrl.trim()) {
      console.error('Invalid URL provided');
      return false;
    }

    avatarElement.src = newUrl.trim();
    return true;
  }

  /**
   * Configuration object for easy customization
   */
  const ProfileCardConfig = {
    avatarUrl: DEFAULT_AVATAR_URL,
    timerInterval: 500,

    setAvatarUrl: function(url) {
      this.avatarUrl = url;
      return setAvatarUrl(url);
    },

    setTimerInterval: function(interval) {
      this.timerInterval = Math.max(500, Math.min(1000, interval));
      return this.timerInterval;
    }
  };

  /**
   * Initialize all profile card functionality
   */
  function initializeProfileCard() {
    // Set up epoch timer
    setupEpochTimer(ProfileCardConfig.timerInterval);

    // Handle avatar URL
    handleAvatarUrl();

    // Log initialization
    console.log('Profile card initialized with epoch timer and avatar handling');
  }

  // Wait for DOM to be fully loaded before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfileCard);
  } else {
    // DOM is already ready, initialize immediately
    initializeProfileCard();
  }

  // Expose public API globally
  window.ProfileCard = {
    updateAvatar: setAvatarUrl,
    config: ProfileCardConfig,
    updateTime: updateTimeDisplay
  };

})();
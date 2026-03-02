import { useState, useEffect } from 'react';
import { AudioSettings, SoundConfig } from '../types';
import { SAGE_AVATAR } from '../constants';

const DEFAULT_SOUND_CONFIG: SoundConfig = {
  start: ['', '', ''],
  rest: ['', '', ''],
  finish: ['', '', ''],
  selectedStart: 0,
  selectedRest: 0,
  selectedFinish: 0
};

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterEnabled: true,
  masterVolume: 1.0,
  types: {
    start: { enabled: true, volume: 1.0 },
    rest: { enabled: true, volume: 1.0 },
    finish: { enabled: true, volume: 1.0 },
    ui: { enabled: true, volume: 0.5 }
  }
};

export const useSettings = () => {
  // Theme
  const [theme, setTheme] = useState<'Dia' | 'Noite'>(() => {
    return (localStorage.getItem('samurai_theme') as 'Dia' | 'Noite') || 'Noite';
  });

  useEffect(() => {
    localStorage.setItem('samurai_theme', theme);
  }, [theme]);

  // Audio Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('samurai_audio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_AUDIO_SETTINGS, ...parsed, types: { ...DEFAULT_AUDIO_SETTINGS.types, ...parsed.types } };
      } catch (e) {
        return DEFAULT_AUDIO_SETTINGS;
      }
    }
    const oldSoundBoolean = localStorage.getItem('samurai_sounds');
    if (oldSoundBoolean !== null) {
        const isEnabled = JSON.parse(oldSoundBoolean);
        return { ...DEFAULT_AUDIO_SETTINGS, masterEnabled: isEnabled };
    }
    return DEFAULT_AUDIO_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('samurai_audio_settings', JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Sound Config
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(() => {
    const saved = localStorage.getItem('samurai_sound_config');
    return saved ? JSON.parse(saved) : DEFAULT_SOUND_CONFIG;
  });

  const handleUpdateSoundConfig = (newConfig: SoundConfig) => {
    setSoundConfig(newConfig);
    localStorage.setItem('samurai_sound_config', JSON.stringify(newConfig));
  };

  // Avatar
  const [sageAvatar, setSageAvatar] = useState<string>(() => {
    return localStorage.getItem('sage_avatar') || SAGE_AVATAR;
  });

  const handleUpdateSageAvatar = (newUrl: string) => {
    setSageAvatar(newUrl);
    localStorage.setItem('sage_avatar', newUrl);
  };

  // Custom Icons
  const [customIcons, setCustomIcons] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('samurai_custom_icons');
    return saved ? JSON.parse(saved) : {};
  });

  const handleUpdateIcon = (tabId: string, newUrl: string) => {
    const updated = { ...customIcons, [tabId]: newUrl };
    setCustomIcons(updated);
    localStorage.setItem('samurai_custom_icons', JSON.stringify(updated));
  };

  const handleResetIcon = (tabId: string) => {
    const updated = { ...customIcons };
    delete updated[tabId];
    setCustomIcons(updated);
    localStorage.setItem('samurai_custom_icons', JSON.stringify(updated));
  };

  return {
    theme,
    setTheme,
    audioSettings,
    setAudioSettings,
    soundConfig,
    handleUpdateSoundConfig,
    sageAvatar,
    handleUpdateSageAvatar,
    customIcons,
    handleUpdateIcon,
    handleResetIcon
  };
};

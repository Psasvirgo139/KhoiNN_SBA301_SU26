/**
 * themeConfig.js – Định nghĩa màu sắc cho Light / Dark theme (Bài 4)
 * File này đã được cung cấp sẵn, KHÔNG cần chỉnh sửa.
 *
 * Sử dụng: import { themes } from '../data/themeConfig'
 */

export const themes = {
  light: {
    background: '#ffffff',
    surface:    '#f3f4f6',
    border:     '#e5e7eb',
    text:       '#111827',
    textMuted:  '#6b7280',
    primary:    '#4f46e5',
    primaryText:'#ffffff',
  },
  dark: {
    background: '#111827',
    surface:    '#1f2937',
    border:     '#374151',
    text:       '#f9fafb',
    textMuted:  '#9ca3af',
    primary:    '#6366f1',
    primaryText:'#ffffff',
  },
}

export const THEME_MODES = ['light', 'dark', 'system']

export const THEME_LABELS = {
  light:  '☀️ Light',
  dark:   '🌙 Dark',
  system: '💻 System',
}

export const STORAGE_KEY = 'theme-mode'

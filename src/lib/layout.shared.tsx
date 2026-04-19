import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      children: <ThemeSwitcher />,
    },
    // Disable the default Fumadocs theme switch since we use our custom one
    themeSwitch: {
      enabled: false,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

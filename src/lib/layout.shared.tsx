import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2">
          <Image
            src="/brand/mogplex-icon.png"
            alt=""
            width={20}
            height={20}
            priority
          />
          {appName}
        </span>
      ),
    },
    // Disable the default Fumadocs theme switch since we render our own in the sidebar footer
    themeSwitch: {
      enabled: false,
    },
  };
}

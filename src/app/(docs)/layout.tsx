import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{
        collapsible: false,
        footer: (
          <div className="flex w-full justify-center pt-2">
            <ThemeSwitcher />
          </div>
        ),
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}

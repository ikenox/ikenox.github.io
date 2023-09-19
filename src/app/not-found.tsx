import { Metadata } from 'next';
import { pageInfoBase, toMetadata } from '@/app/page-info';

export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}

// FIXME this is not working
export const metadata: Metadata = toMetadata({
  ...pageInfoBase,
  title: '404 Not Found',
});

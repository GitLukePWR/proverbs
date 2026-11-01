import { Compass } from 'lucide-react';
import { Link } from 'react-router';
import { EmptyState } from '../components/EmptyState';

export function NotFoundScreen() {
  return (
    <EmptyState icon={<Compass size={22} />} title="This page doesn’t exist" action={<Link to="/" className="btn-primary">Go to today</Link>}>
      The link may be out of date.
    </EmptyState>
  );
}

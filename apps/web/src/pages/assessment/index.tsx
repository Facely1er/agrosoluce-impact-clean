import { useParams } from 'react-router-dom';
import { AssessmentFlow } from '@/components/assessment';

export default function AssessmentPage() {
  const { coop_id } = useParams<{ coop_id?: string }>();
  
  return (
    <div className="py-8">
      <AssessmentFlow cooperativeId={coop_id} />
    </div>
  );
}


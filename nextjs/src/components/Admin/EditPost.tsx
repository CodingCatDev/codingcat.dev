import dynamic from 'next/dynamic';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-purple/theme.css';

import { useUser } from '@/utils/auth/useUser';
import { getPost } from '@/services/firestore';

const MdxEditor = dynamic(() => import('@/components/MdxEditor'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function EditPost({ className }) {
  return (
    <div className={className}>
      <MdxEditor />
    </div>
  );
}

export default EditPost;

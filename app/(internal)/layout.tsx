import Shell from '@/components/Shell';import {currentUser} from '@/lib/auth';import {redirect} from 'next/navigation';
export default async function InternalLayout({children}:{children:React.ReactNode}){const user=await currentUser();if(!user)redirect('/login');return <Shell user={user}>{children}</Shell>}

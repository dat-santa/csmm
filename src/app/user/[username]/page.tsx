type Props = {
    params: { username: string };
  };
  
  export default async function UserPage({ 
    params,
     }: {
    params: { username: string };
     }) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        Xin chào @{params.username}
      </div>
    );
  }
  
import Sidebar from "../../components/sidebar/Sidebar";

export default async function AdminPageLlayout({
  children
}: {
  children: React.ReactNode,
}) {

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        
        {children}
      </div>
    </Sidebar>
  );
}

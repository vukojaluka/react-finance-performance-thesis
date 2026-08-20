export function ProtectedPageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="grow p-2 lg:p-4">{children}</div>
}

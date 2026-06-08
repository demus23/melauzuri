export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin: Payment #{id}</h1>
      <p>Proof + Approve/Reject buttons will be here.</p>
    </main>
  );
}

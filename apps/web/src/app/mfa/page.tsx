export default function MfaPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="text-content-primary text-2xl font-semibold">
        Verify your identity
      </h1>
      <p className="text-content-secondary mt-2 text-sm">
        Your role requires multi-factor authentication. Enrollment UI comes in a
        later phase; this route exists so the server-side MFA guard has a
        target.
      </p>
    </main>
  );
}

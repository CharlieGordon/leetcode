export function AppLogo() {
  return (
    <svg className="app-logo" viewBox="0 0 72 72" role="img" aria-labelledby="app-logo-title">
      <title id="app-logo-title">LeetCode practice logo</title>
      <path
        d="M31 25 20 36 31 47"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 25 52 36 41 47"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39 22 33 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="52" cy="20" r="4" fill="var(--accent)" />
    </svg>
  );
}

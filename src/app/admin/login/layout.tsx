// Login sayfası admin layout'unu override eder — sidebar olmadan
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

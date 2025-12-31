import NewYear2026Love from "../components/NewYear2026Love";

export default function Page() {
  const initialNow = Date.now();
  return <NewYear2026Love initialNow={initialNow} />;
}

import { useRouter } from "next/router";
import Link from "next/link";

export default function StoryPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/">
        <a className="text-blue-500 underline mb-4 inline-block">← Back to Home</a>
      </Link>
      <h1 className="text-4xl font-bold mb-4">Story {id}</h1>
      <p className="text-lg">
        This is a placeholder page for story {id}. You can add full article content here.
      </p>
    </div>
  );
}

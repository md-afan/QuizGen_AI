import DeveloperCard from "./DeveloperCard.jsx";

export default function DocumentPage({ developer, sampleText }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Sample Document</h2>
          <div className="prose max-w-none text-gray-700">
            {/* Render sample text with newlines */}
            {sampleText.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">How to use</h3>
            <ol className="list-decimal list-inside text-gray-600">
              <li>Upload a document (PDF/TXT) or paste text from this page.</li>
              <li>Choose number of questions and click "Generate Quiz".</li>
              <li>Play the quiz and view results & strengths/weaknesses.</li>
            </ol>
          </div>
        </div>

        <div>
          <DeveloperCard {...developer} />
        </div>
      </div>
    </div>
  );
}

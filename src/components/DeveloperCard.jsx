export default function DeveloperCard({ name, image, role, bio }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
      <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
      <h4 className="font-bold text-lg">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
      <p className="text-sm text-gray-600 mt-3">{bio}</p>
      <div className="mt-4">
        <a href="mailto:md.afan@example.com" className="text-sm text-blue-600 underline">Contact</a>
      </div>
    </div>
  );
}

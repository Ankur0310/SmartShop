export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-4 h-4 rounded-full ${
            step === current ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

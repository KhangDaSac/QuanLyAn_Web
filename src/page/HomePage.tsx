export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-700 dark:text-blue-300">Welcome to the Home Page!</h1>
      <p className="text-lg text-gray-700 dark:text-gray-200 text-center max-w-xl">
        This is a responsive home page. Use the navigation above to explore the app. The layout and all components are styled with Tailwind CSS and Flowbite, and scale beautifully on mobile, tablet, and desktop.
      </p>
    </div>
  );
}


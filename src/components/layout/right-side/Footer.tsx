export default function Footer() {
  return (
    <footer className="py-4 text-gray-400">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <p className="text-xs mt-2">Built with ❤️ using React and Tailwind CSS.</p>
      </div>
    </footer>
  );
}

"use server";

export const Footer = async () => {
  const fullYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col px-10 py-6 border-t border-neutral-600/70">
      <p>
        Designed by <a href="https://bento.me/raphtlw">@raphtlw</a> &copy;{" "}
        {fullYear}.
      </p>
    </footer>
  );
};

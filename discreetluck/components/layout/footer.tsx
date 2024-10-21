export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full my-12 text-gray-500">
      <div className="flex flex-col items-center justify-center text-center">
        <p>
          built by{" "}
          <a href="https://twitter.com/redvelvetzip" className="underline">
            Red
          </a>
        </p>
        <p>
          interested in bitcoin scaling? check out{" "}
          <a href="https://bitcoinlayers.org" className="underline">
            Bitcoin Layers
          </a>
        </p>
      </div>
    </footer>
  );
}

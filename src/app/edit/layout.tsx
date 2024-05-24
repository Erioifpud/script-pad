export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow h-full">
      <ul className="h-full flex-shrink-0 overflow-auto w-52 border-r border-solid border-gray-200">
        <li className="h-28 border-b border-solid border-gray-100">1</li>
      </ul>
      <div className="flex-grow h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}

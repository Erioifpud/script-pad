import ScriptList from './_components/ScriptList';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow h-full">
      <ScriptList></ScriptList>
      <div className="flex-grow h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}

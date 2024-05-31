'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    redirect("/edit")
  }, [])
  return (
    <div>
      <Link href="/edit">Edit</Link>
    </div>
  )
}
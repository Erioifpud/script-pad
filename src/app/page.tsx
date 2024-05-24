'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href="/edit">Edit</Link>
      <Link href="/edit/1">Edit [id]</Link>
    </div>
  )
}
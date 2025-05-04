"use client";
import { usePathname } from 'next/navigation';
import ChatPopup from './ChatPopup';

export default function GlobalChatPopup() {
  const pathname = usePathname();
  const isStorePage = pathname.startsWith('/stores/');
  if (isStorePage) return null;
  return <ChatPopup />;
} 
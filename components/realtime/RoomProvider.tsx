"use client";

type RoomProviderProps = {
  roomId: string;
  children: React.ReactNode;
};

export function RoomProvider({ children }: RoomProviderProps) {
  // Liveblocks provider scaffold — wire up in YAN-79
  return <>{children}</>;
}

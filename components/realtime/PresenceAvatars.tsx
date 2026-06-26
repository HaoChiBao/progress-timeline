type PresenceAvatarsProps = {
  users?: Array<{ id: string; name: string }>;
};

export function PresenceAvatars({ users = [] }: PresenceAvatarsProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex -space-x-2">
      {users.map((user) => (
        <span
          key={user.id}
          title={user.name}
          className="inline-flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary-soft text-xs font-medium text-primary-active"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
      ))}
    </div>
  );
}

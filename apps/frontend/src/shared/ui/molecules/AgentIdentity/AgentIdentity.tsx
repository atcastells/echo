import { clsx } from 'clsx';
import { Avatar, type AvatarSize } from '../../atoms/Avatar';
import { Badge } from '../../atoms/Badge';
import { Icon } from '../../atoms/Icon';

export type AgentStatus = 'available' | 'busy' | 'restricted' | 'offline';

export interface AgentIdentityProps {
  /** Agent display name */
  name: string;
  /** Agent role or description */
  role?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Current agent status */
  status?: AgentStatus;
  /** Size of the identity display */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the identity is clickable */
  clickable?: boolean;
  /** Callback when clicked */
  onClick?: () => void;
  /** Whether to show the chevron indicator for clickable state */
  showChevron?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig: Record<
  NonNullable<AgentIdentityProps['size']>,
  {
    avatar: AvatarSize;
    nameClass: string;
    roleClass: string;
    gap: string;
  }
> = {
  sm: {
    avatar: 'sm',
    nameClass: 'text-sm font-medium',
    roleClass: 'text-xs',
    gap: 'gap-2',
  },
  md: {
    avatar: 'md',
    nameClass: 'text-base font-medium',
    roleClass: 'text-sm',
    gap: 'gap-3',
  },
  lg: {
    avatar: 'lg',
    nameClass: 'text-lg font-semibold',
    roleClass: 'text-base',
    gap: 'gap-3',
  },
};

const statusConfig: Record<
  AgentStatus,
  { label: string; badgeVariant: 'default' | 'success' | 'warning' | 'error' }
> = {
  available: { label: 'Available', badgeVariant: 'success' },
  busy: { label: 'Busy', badgeVariant: 'warning' },
  restricted: { label: 'Restricted', badgeVariant: 'error' },
  offline: { label: 'Offline', badgeVariant: 'default' },
};

const statusToAvatarStatus = (status: AgentStatus): 'online' | 'busy' | 'away' | 'offline' => {
  switch (status) {
    case 'available':
      return 'online';
    case 'busy':
      return 'busy';
    case 'restricted':
      return 'away';
    case 'offline':
      return 'offline';
  }
};

/**
 * AgentIdentity component for displaying agent information.
 *
 * Composes Avatar, name, role, and status into a unified
 * identity display with optional clickable behavior.
 */
export const AgentIdentity = ({
  name,
  role,
  avatarUrl,
  status,
  size = 'md',
  clickable = false,
  onClick,
  showChevron = true,
  className,
}: AgentIdentityProps) => {
  const config = sizeConfig[size];
  const statusInfo = status ? statusConfig[status] : null;

  const content = (
    <>
      <Avatar
        name={name}
        src={avatarUrl}
        size={config.avatar}
        status={status ? statusToAvatarStatus(status) : undefined}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={clsx(config.nameClass, 'text-neutral-800 truncate')}>
            {name}
          </span>
          {statusInfo && size !== 'sm' && (
            <Badge variant={statusInfo.badgeVariant} size="sm">
              {statusInfo.label}
            </Badge>
          )}
        </div>
        {role && (
          <p className={clsx(config.roleClass, 'text-neutral-500 truncate')}>
            {role}
          </p>
        )}
      </div>

      {clickable && showChevron && (
        <Icon
          name="chevron-right"
          size="sm"
          className="text-neutral-400 flex-shrink-0"
        />
      )}
    </>
  );

  const baseClasses = clsx(
    'flex items-center',
    config.gap,
    clickable && [
      'cursor-pointer rounded-lg transition-colors duration-150',
      'hover:bg-neutral-100',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      size === 'sm' && 'p-1.5',
      size === 'md' && 'p-2',
      size === 'lg' && 'p-2.5',
    ],
    className
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        aria-label={`View ${name}'s profile`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
};

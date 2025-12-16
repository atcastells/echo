import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Tooltip } from '../../atoms/Tooltip';

export interface PersonaOption {
  id: string;
  name: string;
  description?: string;
}

export interface ContextScope {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface ComposerToolbarProps {
  /** Available personas/modes */
  personas?: PersonaOption[];
  /** Currently selected persona ID */
  selectedPersonaId?: string;
  /** Callback when persona is selected */
  onPersonaChange?: (personaId: string) => void;
  /** Available context scopes */
  contextScopes?: ContextScope[];
  /** Callback when context scope is toggled */
  onToggleContextScope?: (scopeId: string) => void;
  /** Whether to show keyboard shortcut hints */
  showShortcutHints?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ComposerToolbar organism component.
 *
 * Provides persona/mode selection, context scope configuration,
 * and keyboard shortcut hints above the composer.
 */
export const ComposerToolbar = ({
  personas = [],
  selectedPersonaId,
  onPersonaChange,
  contextScopes = [],
  onToggleContextScope,
  showShortcutHints = true,
  className,
}: ComposerToolbarProps) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showContextDropdown, setShowContextDropdown] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  const activeScopes = contextScopes.filter((s) => s.isActive);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setShowPersonaDropdown(false);
      }
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setShowContextDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-4 px-3 py-2',
        'bg-neutral-50 border-b border-neutral-200 rounded-t-xl',
        className
      )}
    >
      {/* Left section: persona and context */}
      <div className="flex items-center gap-2">
        {/* Persona selector */}
        {personas.length > 0 && (
          <div ref={personaRef} className="relative">
            <button
              type="button"
              onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'text-sm text-neutral-700',
                'hover:bg-neutral-100 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
            >
              <Icon name="user" size="sm" className="text-neutral-500" />
              <span>{selectedPersona?.name ?? 'Select mode'}</span>
              <Icon name="chevron-down" size="sm" className="text-neutral-400" />
            </button>

            {showPersonaDropdown && (
              <DropdownMenu>
                {personas.map((persona) => (
                  <DropdownItem
                    key={persona.id}
                    isSelected={persona.id === selectedPersonaId}
                    onClick={() => {
                      onPersonaChange?.(persona.id);
                      setShowPersonaDropdown(false);
                    }}
                  >
                    <span className="font-medium">{persona.name}</span>
                    {persona.description && (
                      <span className="text-xs text-neutral-500 block">
                        {persona.description}
                      </span>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Context scope selector */}
        {contextScopes.length > 0 && (
          <div ref={contextRef} className="relative">
            <button
              type="button"
              onClick={() => setShowContextDropdown(!showContextDropdown)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'text-sm text-neutral-700',
                'hover:bg-neutral-100 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
            >
              <Icon name="document" size="sm" className="text-neutral-500" />
              <span>Context</span>
              {activeScopes.length > 0 && (
                <Badge variant="info" size="sm">
                  {activeScopes.length}
                </Badge>
              )}
              <Icon name="chevron-down" size="sm" className="text-neutral-400" />
            </button>

            {showContextDropdown && (
              <DropdownMenu>
                {contextScopes.map((scope) => (
                  <DropdownItem
                    key={scope.id}
                    isSelected={scope.isActive}
                    onClick={() => onToggleContextScope?.(scope.id)}
                    showCheckbox
                  >
                    <span>{scope.name}</span>
                    {scope.description && (
                      <span className="text-xs text-neutral-500 block">
                        {scope.description}
                      </span>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Right section: shortcut hints */}
      {showShortcutHints && (
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <Tooltip content="Submit message" position="top">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500">
                ↵
              </kbd>
              <span className="ml-1">Send</span>
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div
    className={clsx(
      'absolute left-0 top-full mt-1 z-20',
      'min-w-[200px] py-1',
      'bg-white rounded-lg shadow-lg border border-neutral-200',
      'animate-in fade-in slide-in-from-top-1 duration-150'
    )}
  >
    {children}
  </div>
);

interface DropdownItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  showCheckbox?: boolean;
}

const DropdownItem = ({
  children,
  isSelected,
  onClick,
  showCheckbox,
}: DropdownItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-2 px-3 py-2 text-left text-sm',
      'transition-colors duration-150',
      isSelected ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
    )}
  >
    {showCheckbox && (
      <div
        className={clsx(
          'w-4 h-4 rounded border flex items-center justify-center',
          isSelected
            ? 'bg-primary-500 border-primary-500'
            : 'border-neutral-300'
        )}
      >
        {isSelected && (
          <Icon name="check" size="sm" className="text-white" />
        )}
      </div>
    )}
    <div className="flex-1">{children}</div>
    {!showCheckbox && isSelected && (
      <Icon name="check" size="sm" className="text-primary-500" />
    )}
  </button>
);

/**
 * State machines barrel export.
 *
 * State machines are ONLY allowed in:
 * - Organisms
 * - Pages
 *
 * Explicitly FORBIDDEN in:
 * - Atoms
 * - Molecules
 */

export * from './common.types';
export { composerMachine, type ComposerContext, type ComposerEvent } from './composer.machine';

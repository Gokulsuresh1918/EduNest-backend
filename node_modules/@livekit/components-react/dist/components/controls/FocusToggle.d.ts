import * as React from 'react';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
/** @public */
export interface FocusToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    trackRef?: TrackReferenceOrPlaceholder;
}
/**
 * The `FocusToggle` puts the `ParticipantTile` in focus or removes it from focus.
 * @remarks
 * This component needs to live inside `LayoutContext` to work properly.
 *
 * @example
 * ```tsx
 * <ParticipantTile>
 *   <FocusToggle />
 * </ParticipantTile>
 * ```
 * @public
 */
export declare const FocusToggle: React.ForwardRefExoticComponent<FocusToggleProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=FocusToggle.d.ts.map
import {createSelector} from 'reselect';
import {getOwnEstimate} from './storiesAndEstimates';

const getPendingCmds = (state) => state.pendingCommands;

// Returns pending commands as array. Never returns undefined.
const getPendingCommands = createSelector([getPendingCmds], (pendingCmds) =>
  Object.values(pendingCmds || {})
);

/**
 * Returns true if this card (specified by its value) should be shown "waiting".
 * (either because you just estimated or cleared your estimation)
 */
export const isThisCardWaiting = (state, cardValue) => {
  const ownEstimate = getOwnEstimate(state);
  const pendingEstimationCommand = getMatchingPendingCommand(state, 'giveStoryEstimate');
  const estimationWaiting = pendingEstimationCommand
    ? pendingEstimationCommand.payload.value
    : undefined;
  const hasPendingClearCommand = hasMatchingPendingCommand(state, 'clearStoryEstimate');

  return cardValue === estimationWaiting || (hasPendingClearCommand && cardValue === ownEstimate);
};

/**
 * Returns true if this story (in the backlog) (specified by its id) should be shown "waiting".
 * (either because you selected it or trashed it)
 */
export const isThisStoryWaiting = (state, storyId) => {
  const pendingSelectCommands = getAllMatchingPendingCommands(state, 'selectStory');
  const pendingTrashCommand = getAllMatchingPendingCommands(state, 'trashStory');

  return !!(
    pendingSelectCommands.find((cmd) => cmd.payload.storyId === storyId) ||
    pendingTrashCommand.find((cmd) => cmd.payload.storyId === storyId)
  );
};

/**
 * Returns true if this story (in edit mode in the backlog) (specified by its id) should be shown "waiting".
 * (because you saved your changes (= sent changeStory command))
 */
export const isThisStoryEditFormWaiting = (state, storyId) => {
  const pendingChangeCommands = getAllMatchingPendingCommands(state, 'changeStory');
  return !!pendingChangeCommands.find((cmd) => cmd.payload.storyId === storyId);
};

/**
 * Returns true if the client is currently waiting for a (event) response to a sent command that matches the given commandName
 */
export const hasMatchingPendingCommand = (state, commandName) =>
  !!getMatchingPendingCommand(state, commandName);

/**
 * Returns a matching pending command that was sent by this client (the client is currently waiting for a (event) response).
 * Can also return undefined
 */
export const getMatchingPendingCommand = (state, commandName) =>
  getPendingCommands(state).find((cmd) => cmd.name === commandName);

/**
 * Returns all matching pending commands for the given commandName.
 * Can return an empty array. never returns undefined.
 */
export const getAllMatchingPendingCommands = (state, commandName) =>
  getPendingCommands(state).filter((cmd) => cmd.name === commandName);
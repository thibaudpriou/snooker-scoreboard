import type {SnookerGame} from '$model';
import {writable} from 'svelte/store';

export const currentGame = writable<SnookerGame>(undefined);

export default currentGame;

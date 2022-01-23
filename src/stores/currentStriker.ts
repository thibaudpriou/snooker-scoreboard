import type {Player} from '$model';
import {writable} from 'svelte/store';

export const currentStriker = writable<Player>(undefined);

export default currentStriker;

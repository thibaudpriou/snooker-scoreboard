import type Frame from './frame';
import type Player from './player';
import type {SnookerGameType} from '../enum';

export interface SnookerGame {
	players: Player[];
	type: SnookerGameType;
	frames: Frame[];
}

export default SnookerGame;

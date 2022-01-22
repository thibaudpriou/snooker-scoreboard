import type {StrokeType} from '../enum';

export interface Stroke {
	type: StrokeType;
	snooker: boolean;
	score?: number;
}

export default Stroke;

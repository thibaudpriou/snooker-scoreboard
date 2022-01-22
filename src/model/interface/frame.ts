import type Break from './break';

export interface Frame {
	breaks: Break[];
	isClearing: boolean;
	remainingReds: number;
	clearedColours: number[];
}

export default Frame;

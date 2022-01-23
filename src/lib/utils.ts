import {SnookerGameType} from '$model';

export function _clone<T>(object: T): T {
	// TODO optimize
	return JSON.parse(JSON.stringify(object));
}

export function getNbReds(gameType: SnookerGameType): number {
	let totalReds: number | undefined = undefined;
	if (gameType === SnookerGameType['15balls']) {
		totalReds = 15;
	} else if (gameType === SnookerGameType['10balls']) {
		totalReds = 10;
	} else if (gameType === SnookerGameType['6balls']) {
		totalReds = 6;
	}
	return totalReds;
}

import {getNbReds, _clone} from './utils';
import {
	type SnookerGameType,
	type Frame,
	type Player,
	type Break,
	type Stroke,
	StrokeType,
	type Score
} from '$model';

export function createFrame(gameType: SnookerGameType): Frame {
	return {
		breaks: [],
		isClearing: false,
		clearedColours: [],
		remainingReds: getNbReds(gameType)
	};
}

function _hasStarted(frame: Frame): boolean {
	return frame.breaks.length > 0;
}

export function getCurrentBreakPlayer(frame: Frame, players: Player[]): Player {
	const index = getCurrentBreakPlayerIndex(frame, players.length);
	return players[index];
}

export function getCurrentBreakPlayerIndex(frame: Frame, nbPlayers: number): number {
	if (!_hasStarted(frame)) {
		return undefined;
	}

	return (frame.breaks.length - 1) % nbPlayers;
}

export function getLastStroke(b: Break): Stroke | undefined {
	return b.strokes[b.strokes.length - 1];
}

export function getCurrentBreak(frame: Frame): Break | undefined {
	return frame.breaks[frame.breaks.length - 1];
}

export function addBreak(frame: Frame): Frame {
	const f = _clone(frame);
	f.breaks.push({strokes: []});
	return f;
}

export function addStroke(frame: Frame, type: StrokeType, score?: number, snooker = false): Frame {
	const f = _clone(frame);
	f.breaks[f.breaks.length - 1].strokes.push({
		type,
		snooker,
		...(score && {score})
	});
	return f;
}

export function computePlayerFrameScore(
	frame: Frame,
	players: string[],
	playerIndex: number
): Score {
	const score: Score = {
		player: players[playerIndex],
		points: 0,
		penalties: 0
	};

	const playerBreaks = frame.breaks.filter(
		(_, index) => index % players.length === playerIndex
	);
	const playerMoves = playerBreaks.reduce<Stroke[]>(
		(moves, playerBreak) => [...moves, ...playerBreak.strokes],
		[]
	);

	for (const move of playerMoves) {
		if (move.type === StrokeType.pot) {
			score.points += move.score;
		} else if (move.type === StrokeType.foul) {
			score.penalties += move.score;
		}
	}

	return score;
}

import {
	SnookerGameType,
	StrokeType,
	type Player,
	type Score,
	type SnookerGame,
	type Stroke
} from '../model';
import {
	addBreak,
	addStroke as addStrokeToFrame,
	computePlayerFrameScore,
	createFrame,
	getCurrentBreak,
	getCurrentBreakPlayer,
	getLastStroke
} from './frame';

import {_clone} from './utils';

/**
 * Initialise a new Snooker Game.
 * @param players
 * @param type
 * @returns a new game object
 */
export function createGame(
	players: Player[],
	type: SnookerGameType = SnookerGameType['15balls']
): SnookerGame {
	return {
		players,
		type,
		frames: []
	};
}

/**
 * Create a new frame.
 * @param game
 * @returns a new game object
 */
export function addFrame(game: SnookerGame): SnookerGame {
	// TODO error if last frame not finished ?
	const g = _clone(game);
	g.frames.push(createFrame(game.type));
	return g;
}

/**
 * Save a new stroke for the current frame.
 * @param game
 * @param striker
 * @param type
 * @param score
 * @param snooker whether the cue ball is snookered after this stroke
 * @returns a new game object
 */
export function addStroke(
	game: SnookerGame,
	striker: Player,
	type: StrokeType,
	score?: number,
	snooker = false
): SnookerGame {
	guardStrokeLegality(game, striker, type, score);

	const g = _clone(game);
	const currentFrameIdx = g.frames.length - 1;
	let frame = g.frames[currentFrameIdx];
	if (getCurrentBreakPlayer(frame, g.players) !== striker) {
		frame = addBreak(frame);
		frame.isClearing = frame.remainingReds === 0;
	}

	const currentBreak = getCurrentBreak(frame);
	const isPotOfRed =
		type === StrokeType.pot &&
		currentBreak.strokes.filter(s => s.type === StrokeType.pot).length % 2 === 0;

	frame = addStrokeToFrame(frame, type, score, snooker);
	if (isPotOfRed && !frame.isClearing) {
		frame.remainingReds -= score;
	}
	if (frame.isClearing) {
		frame.clearedColours.push(score);
	}
	if (!isPotOfRed) {
		frame.isClearing = frame.remainingReds === 0;
	}

	g.frames[currentFrameIdx] = frame;
	return g;
}

/**
 * Compute and return total score for each player in current Frame
 * @param game
 * @returns player's scores for current frame
 * @todo not tested
 */
export function getCurrentFrameScores(game: SnookerGame): Score[] {
	if (game.frames.length === 0) throw new Error('no current frame');
	const currentFrame = game.frames[game.frames.length - 1];

	return game.players.map((_, i) => computePlayerFrameScore(currentFrame, game.players, i));
}

/**
 * @todo not implemented
 */
function guardStrokeLegality(
	game: SnookerGame,
	striker: Player,
	type: StrokeType,
	score?: number
): void {
	if (game.frames.length === 0) {
		throw new Error('no current frame');
	}

	const frame = game.frames[game.frames.length - 1];
	const lastBreak = getCurrentBreak(frame);
	const lastStroke = lastBreak && getLastStroke(lastBreak);
	const lastPlayer = getCurrentBreakPlayer(frame, game.players);
	if (lastStroke && lastStroke.type === StrokeType.miss && lastPlayer === striker) {
		throw new Error('Cannot strike again after a miss');
	}

	if (lastStroke && lastStroke.type === StrokeType.pot && lastPlayer !== striker) {
		throw new Error('Cannot strike after an opponent pot');
	}

	if (type === StrokeType.foul) {
		if (!score || score < 4) {
			throw new Error('Minimum foul value is 4');
		}
		if (score > 7) {
			throw new Error('Maximum foul value is 7');
		}

		if (frame.isClearing) {
			const lastClearedColour: number | undefined =
				frame.clearedColours[frame.clearedColours.length - 1];
			const colourOn: number = (lastClearedColour ?? 1) + 1;
			if (score < colourOn && score !== 4) {
				throw new Error(`Foul value of ${score} is impossible`);
			}
		}
	}

	if (type === StrokeType.pot) {
		if (!score || score < 1) {
			throw new Error('Minimum pot value is 1');
		}
		let nbPotsForBreak = 0;
		if (lastPlayer === striker) {
			nbPotsForBreak = lastBreak?.strokes.filter(s => s.type === StrokeType.pot).length ?? 0;
		}
		const areRedsOn = nbPotsForBreak % 2 === 0 && !frame.isClearing;
		if (areRedsOn) {
			if (frame.remainingReds < score) {
				throw new Error(
					'Reds are on but pot score is higher than number of remaining reds'
				);
			}
			return;
		}

		if (frame.isClearing) {
			const lastClearedColour: number | undefined =
				frame.clearedColours[frame.clearedColours.length - 1];
			const colourOn: number = (lastClearedColour ?? 1) + 1;
			if (colourOn !== score) {
				throw new Error(`Colour to clear is ${colourOn}, not ${score}`);
			}
		}

		if (score < 2) {
			throw new Error('Colours are on: minimum pot value is 2');
		}
		if (score > 7) {
			throw new Error('Colours are on: maximum pot value is 7');
		}
	}

	// TODO NOT YET IMPLEMENTED
	/*
    if (!!getAllLegalStrokes().find(s => s.type === type && s.score === score)) {
        throw new Error()
    }
    */

	return;
}

/**
 * @todo not implemented
 */
// eslint-disable-next-line
export function getAllLegalStrokes(game: SnookerGame, striker: Player): Stroke[] {
	// TODO NOT YET IMPLEMENTED
	throw new Error('NOT YET IMPLEMENTED');
	return [];
}

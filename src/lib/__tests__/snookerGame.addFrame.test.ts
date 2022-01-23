import {type Player, type SnookerGame, SnookerGameType} from '$model';
import {addFrame, createGame} from '../game';
import {suite} from 'uvu';
import * as assert from 'uvu/assert';

const AddFrame = suite('addFrame');

let players: Player[];
let game: SnookerGame;

AddFrame.before.each(() => {
	players = ['Théo', 'Thibaud'];
	game = createGame(players);
});

AddFrame('should not mutate given game', () => {
	const initial: SnookerGame = {
		players: ['Théo', 'Thibaud'],
		type: SnookerGameType['15balls'],
		frames: []
	};

	addFrame(game);

	assert.equal(game, initial);
});

AddFrame('should add a frame to empty game', () => {
	const expected: SnookerGame = {
		players: ['Théo', 'Thibaud'],
		type: SnookerGameType['15balls'],
		frames: [
			{
				isClearing: false,
				remainingReds: 15,
				breaks: [],
				clearedColours: []
			}
		]
	};

	const result = addFrame(game);

	assert.equal(result, expected);
});

AddFrame('should add a new frame to existing game', () => {
	const expected: SnookerGame = {
		players: ['Théo', 'Thibaud'],
		type: SnookerGameType['15balls'],
		frames: [
			{
				isClearing: false,
				remainingReds: 15,
				breaks: [],
				clearedColours: []
			},
			{
				isClearing: false,
				remainingReds: 15,
				breaks: [],
				clearedColours: []
			}
		]
	};

	const tmp = addFrame(game);
	const result = addFrame(tmp);

	assert.equal(result, expected);
});

AddFrame.run();

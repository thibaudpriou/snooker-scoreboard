import {SnookerGameType, type SnookerGame} from '../../model';
import {createGame} from '../game';
import {suite} from 'uvu';
import * as assert from 'uvu/assert';

const CreateGame = suite('createGame');

CreateGame('should initialise a SnookerGame object', async () => {
	const players = ['Théo', 'Thibaud'];
	const type = SnookerGameType['15balls'];
	const expected: SnookerGame = {
		players: ['Théo', 'Thibaud'],
		type: SnookerGameType['15balls'],
		frames: []
	};

	const result = createGame(players, type);

	assert.equal(result, expected);
});

CreateGame.run();

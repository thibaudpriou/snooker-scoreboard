import {type Player, type SnookerGame, StrokeType, SnookerGameType} from '../../model';
import {addFrame, addStroke, createGame} from '../game';
import {suite} from 'uvu';
import * as assert from 'uvu/assert';

let players: Player[];
let game: SnookerGame;

const AddStroke = suite('addStroke');
AddStroke.before.each(() => {
	players = ['Théo', 'Thibaud'];
	game = createGame(players);
	game = addFrame(game);
});

AddStroke('should not mutate given game', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.miss;
	const initial: SnookerGame = {
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

	addStroke(game, currentPlayer, type);

	assert.equal(game, initial);
});

AddStroke('should throw when no frame exists', async () => {
	game = createGame(players);
	const player = 'Théo';
	const type = StrokeType.miss;

	assert.throws(() => {
		addStroke(game, player, type);
	});
});

AddStroke.skip('should throw when trying to add stroke to already finished frame');

AddStroke('should create a new stroke in a new break when game just started', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.miss;
	const expected: SnookerGame = {
		players: ['Théo', 'Thibaud'],
		type: SnookerGameType['15balls'],
		frames: [
			{
				isClearing: false,
				remainingReds: 15,
				breaks: [
					{
						strokes: [
							{
								type: StrokeType.miss,
								snooker: false
							}
						]
					}
				],
				clearedColours: []
			}
		]
	};

	const result = addStroke(game, currentPlayer, type);

	assert.equal(result, expected);
});

AddStroke.run();

const AddStrokePlayerOrder = suite('addStroke - player order');
AddStrokePlayerOrder.before.each(() => {
	players = ['Théo', 'Thibaud'];
	game = createGame(players);
	game = addFrame(game);
});

AddStrokePlayerOrder(
	"a miss ends player's current break (should throw when player tries to play again after a miss)",
	() => {
		const currentPlayer = 'Théo';
		const type = StrokeType.miss;
		const tmp = addStroke(game, currentPlayer, type);

		assert.throws(() => {
			addStroke(tmp, currentPlayer, type);
		});
	}
);

AddStrokePlayerOrder(
	"a foul may continue player's current break (should not throw when player tries to play again after a foul)",
	() => {
		const currentPlayer = 'Théo';
		const type = StrokeType.foul;
		const score = 4;
		const tmp = addStroke(game, currentPlayer, type, score);

		assert.not.throws(() => {
			addStroke(tmp, currentPlayer, type, score);
		});
	}
);

AddStrokePlayerOrder(
	"a foul may end player's current break (should not throw when opponent tries to play again after a foul)",
	() => {
		const currentPlayer = 'Théo';
		const nextPlayer = 'Thibaud';
		const type = StrokeType.foul;
		const score = 5;
		const tmp = addStroke(game, currentPlayer, type, score);

		assert.not.throws(() => {
			addStroke(tmp, nextPlayer, type, score);
		});
	}
);

AddStrokePlayerOrder(
	'a pot does not end break (should throw when opponent tries to play after a pot)',
	() => {
		const currentPlayer = 'Théo';
		const nextPlayer = 'Thibaud';
		const type = StrokeType.pot;
		const score = 1;
		const tmp = addStroke(game, currentPlayer, type, score);

		assert.throws(() => {
			addStroke(tmp, nextPlayer, type, 3);
		});
	}
);

AddStrokePlayerOrder.run();

const AddStrokeValues = suite('addStroke - pot and fouls values');
AddStrokeValues.before.each(() => {
	players = ['Théo', 'Thibaud'];
	game = createGame(players);
	game = addFrame(game);
});

AddStrokeValues('foul value required (should throw)', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.foul;
	const score = undefined;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues('minimum foul value is 4 (should throw)', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.foul;
	const score = 3;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues('maximum foul value is 7 (should throw)', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.foul;
	const score = 8;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues('foul value required (should throw)', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.pot;
	const score = undefined;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues('minimum pot values is 1 (should throw)', () => {
	const currentPlayer = 'Théo';
	const type = StrokeType.pot;
	const score = 0;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues(
	'when reds are on, maximum pot value is equal to the number of remaining reds (should throw)',
	() => {
		game = createGame(players);
		game = addFrame(game);
		game = addStroke(game, 'Théo', StrokeType.pot, 1);
		game = addStroke(game, 'Théo', StrokeType.pot, 2);
		game = addStroke(game, 'Théo', StrokeType.pot, 3); // 3 reds in a single strike
		game = addStroke(game, 'Théo', StrokeType.miss);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
		game = addStroke(game, 'Thibaud', StrokeType.miss);
		// remaining reds = 15 - 1 - 3 - 1 = 10
		const currentPlayer = 'Théo';
		const type = StrokeType.pot;
		const score = 11;

		assert.throws(() => {
			addStroke(game, currentPlayer, type, score);
		});
	}
);

AddStrokeValues('when colours are on, minimum pot value is 2 (should throw)', () => {
	game = createGame(players);
	game = addFrame(game);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.pot, 2);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.miss);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
	const currentPlayer = 'Thibaud';
	const type = StrokeType.pot;
	const score = 1;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues('when colours are on, maximum pot value is 7 (should throw)', () => {
	game = createGame(players);
	game = addFrame(game);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.pot, 2);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.miss);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
	const currentPlayer = 'Thibaud';
	const type = StrokeType.pot;
	const score = 8;

	assert.throws(() => {
		addStroke(game, currentPlayer, type, score);
	});
});

AddStrokeValues.run();

const AddStrokeClearingColours = suite('addStroke - when no reds remain');
AddStrokeClearingColours.before.each(() => {
	players = ['Théo', 'Thibaud'];
	game = createGame(players);
	game = addFrame(game);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.pot, 7);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.miss);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 6);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
	game = addStroke(game, 'Thibaud', StrokeType.foul, 4);
	game = addStroke(game, 'Théo', StrokeType.pot, 1);
	game = addStroke(game, 'Théo', StrokeType.miss);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 2); // 2 reds, to speed up game ;)
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 2); // 2 reds
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 2); // 2 reds
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 2); // 2 reds
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7);
	game = addStroke(game, 'Thibaud', StrokeType.pot, 1); // no more reds
});
AddStrokeClearingColours('when all colours remain, Yellow should be potted - score 2 given', () => {
	game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
	const value = 2;

	assert.not.throws(() => {
		addStroke(game, 'Thibaud', StrokeType.pot, value);
	});
});
AddStrokeClearingColours(
	'when all colours remain, Yellow should be potted - score <2 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		const value = 1;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when all colours remain, Yellow should be potted - score >2 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		const value = 3;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when all colours remain, Yellow should be potted - striker changed - score 2 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.miss);
		const value = 2;

		assert.not.throws(() => {
			addStroke(game, 'Théo', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when all colours remain, Yellow should be potted - striker changed - score <2 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.miss);
		const value = 1;

		assert.throws(() => {
			addStroke(game, 'Théo', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when all colours remain, Yellow should be potted - striker changed - score >2 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.miss);
		const value = 3;

		assert.throws(() => {
			addStroke(game, 'Théo', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when only colours above Yellow remain, Green should be potted - score 3 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		const value = 3;

		assert.not.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Yellow remain, Green should be potted - score <3 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		const value = 2;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Yellow remain, Green should be potted - score >3 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		const value = 4;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when only colours above Green remain, Brown should be potted - score 4 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		const value = 4;

		assert.not.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Green remain, Brown should be potted - score <4 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		const value = 3;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Green remain, Brown should be potted - score >4 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		const value = 5;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when only colours above Brown remain, Blue should be potted - score 5 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		const value = 5;

		assert.not.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Brown remain, Blue should be potted - score <5 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		const value = 4;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Brown remain, Blue should be potted - score >5 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		const value = 6;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when only colours above Blue remain, Pink should be potted - score 6 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 5);
		const value = 6;

		assert.not.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Blue remain, Pink should be potted - score <6 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 5);
		const value = 5;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Blue remain, Pink should be potted - score >6 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 5);
		const value = 7;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours(
	'when only colours above Pink remain, Black should be potted - score 7 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 5);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 6);
		const value = 7;

		assert.not.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);
AddStrokeClearingColours(
	'when only colours above Pink remain, Black should be potted - score <7 given',
	() => {
		game = addStroke(game, 'Thibaud', StrokeType.pot, 7); // last strike before clearing
		game = addStroke(game, 'Thibaud', StrokeType.pot, 2);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 3);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 4);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 5);
		game = addStroke(game, 'Thibaud', StrokeType.pot, 6);
		const value = 6;

		assert.throws(() => {
			addStroke(game, 'Thibaud', StrokeType.pot, value);
		});
	}
);

AddStrokeClearingColours.run();

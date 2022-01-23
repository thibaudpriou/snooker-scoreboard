<script lang="ts">
	import {currentGame, currentStriker} from '$stores';
	import {Player, SnookerGame, StrokeType} from '$model';
	import {goto} from '$app/navigation';
	import {onMount} from 'svelte';
	import ScoreBoard from '$components/ScoreBoard.svelte';
	import HelpModal from '$components/HelpModal.svelte';
	import {addStroke} from '$lib/game';

	let help: boolean = false;
	let game: SnookerGame | undefined;
	let striker: Player;
	currentStriker.subscribe(s => {
		striker = s;
	});

	let displayKey: boolean;
	let keyBuffer: string[] = [];

	function commit(callback = () => {}) {
		setTimeout(() => {
			displayKey = false;
			keyBuffer = [];
			callback();
		}, 500);
	}

	function setNextStriker() {
		currentStriker.update(s => {
			const currentIdx = game.players.findIndex(p => p === s);
			const nbPlayers = game.players.length;
			return game.players[(currentIdx + 1) % nbPlayers];
		});
	}

	function setPreviousStriker() {
		currentStriker.update(s => {
			const currentIdx = game.players.findIndex(p => p === s);
			const nbPlayers = game.players.length;
			return game.players[(currentIdx - 1) % nbPlayers];
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.repeat) {
			return;
		}
		const k = event.key.toUpperCase();
		switch (k) {
			case 'H':
				help = true;
				break;
			case 'M':
			case 'P':
			case 'F':
				keyBuffer = [];
			case 'R':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
				// ! NOT YET IMPLEMENTED
				// case 'C': // TODO foul only
				// case 'S':
				// case 'O':
				console.log(k);
				keyBuffer = keyBuffer.concat(k);
				console.log(keyBuffer);
				displayKey = true;
				break;
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		const k = event.key.toUpperCase();
		switch (k) {
			case 'H':
				help = false;
				break;
			case 'M':
				commit(() => {
					currentGame.update(g => addStroke(g, striker, StrokeType.miss));
					setNextStriker();
				});
				break;
			case 'R':
				commit(setPreviousStriker);
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
				if (keyBuffer.length === 0) {
					break;
				}

				let type: StrokeType | undefined;
				if (keyBuffer.find(k => k === 'P')) {
					type = StrokeType.pot;
				} else if (keyBuffer.find(k => k === 'F')) {
					type = StrokeType.foul;
				}
				if (!type) {
					break;
				}

				const score = parseInt(k);

				// TODO count "C" in keyBuffer to adjust score (when reds on) or penalty (reds removal)
				// TODO find "S" in keyBuffer to save snooker
				// TODO find "O" in keyBuffer to save snooker

				commit(() => {
					currentGame.update(g => addStroke(g, striker, type, score));
					if (type === StrokeType.foul) {
						setNextStriker();
					}
				});

				break;
		}
	}

	function handleQuit() {
		currentStriker.set(undefined);
		currentGame.set(undefined);
	}

	onMount(() => {
		currentGame.subscribe(g => {
			if (!g) {
				return goto('/');
			}
			game = g;
		});
	});
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div>
	<h1>Scoreboard page</h1>

	{#if game}
		<ScoreBoard {game} />
		<button on:click={handleQuit}>Quit</button>
	{/if}

	{#if help}
		<div class="help-container">
			<HelpModal />
		</div>
	{/if}

	{#if displayKey && keyBuffer.length}
		<p class="key-buffer">{keyBuffer}</p>
	{/if}
</div>

<style>
	.help-container,
	.key-buffer {
		position: absolute;
		display: block;
		top: 3em;
		right: 3em;
		background-color: rgba(211, 211, 211, 0.8);
		font-size: 90%;
	}

	.key-buffer {
		padding: 1em;
	}

	.help-container {
		left: 3em;
		bottom: 3em;
		padding: 2em;
	}
</style>
